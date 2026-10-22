## `POST` in src/app/api/payment/webhook/route.ts (L6-L152)

**Purpose:** Ingests asynchronous payment callbacks from the ZarinPal payment gateway, verifies transaction authenticity and settlement amount against upstream gateway APIs, transitions the referenced Order to PAID/PROCESSING, logs the audit trail, and prevents double-crediting.

**Inputs & Assumptions:**
- `body.orderNumber` (string): Unique identifier for the order (`SH-YYMMDD-XXX`). Trust: **untrusted** (supplied directly in HTTP POST payload).
- `body.Authority` (string): Gateway transaction authority token (`A000...` or `ZP-MOCK-...`). Trust: **untrusted**.
- `body.Status` (string): Gateway status string (`OK` or `NOK`). Trust: **untrusted**.
- Implicit: `process.env.ZARINPAL_MERCHANT_ID`, `process.env.NODE_ENV`, `process.env.NEXTAUTH_SECRET`, database table `Order` and `PaymentTransactionLog`.
- Precondition: `orderNumber` and `Authority` are non-empty strings (enforced at L21-L23).
- Precondition: Order exists in database (enforced at L26-L32).
- Precondition: Order is not already paid (`order.paymentStatus !== "PAID"`, enforced at L35-L37).

**Outputs & Effects:**
- Returns JSON `{ success: true, message: "Payment verified successfully", refId }` on success (200), or error JSON with status 400, 403, 404, 500.
- State write: updates `Order` (`paymentStatus = "PAID"`, `orderStatus = "PROCESSING"`, `paymentRefId = refId` at L92-L99; or `paymentStatus = "FAILED"` at L70-L73 and L124-L129).
- State write: inserts row into `PaymentTransactionLog` (L103-L116 and L131-L145).
- External interaction: outbound HTTPS POST to `https://api.zarinpal.com/pg/v4/payment/verify.json` (L56-L64).

**Block-by-Block:**

```typescript
// L21-L32
if (!orderNumber || typeof orderNumber !== "string" || !Authority || typeof Authority !== "string") {
  return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
}
const order = await prisma.order.findUnique({ where: { orderNumber } });
if (!order) {
  return NextResponse.json({ error: "Order not found" }, { status: 404 });
}
```
- **What:** Validates string payload types and fetches the candidate order record by unique orderNumber.
- **Why here:** Immediate gatekeeping before evaluating payment status or initiating network calls.
- **Assumes:** `orderNumber` is unique across orders.
- **Establishes:** `order != null` and `orderNumber` and `Authority` are strings for subsequent blocks.
- **Depended on by:** L35 (status check), L61 (amount calculation), and L92 (order update).

```typescript
// L35-L37
if (order.paymentStatus === "PAID") {
  return NextResponse.json({ success: true, message: "Order is already paid" });
}
```
- **What:** Returns early success if order has already been marked PAID.
- **Why here:** Idempotency guard against duplicate gateway webhook deliveries.
- **Assumes:** An order marked PAID was legitimately verified previously and its inventory / processing state is finalized.
- **Establishes:** Invariant that `order.paymentStatus !== "PAID"` past this point.
- **Depended on by:** Gateway verification and database update logic below.

```typescript
// L50-L77
if (isProduction || isConfiguredMerchant) {
  if (!isConfiguredMerchant) {
    logger.error("[Payment Webhook] Missing valid ZARINPAL_MERCHANT_ID in production environment");
    return NextResponse.json({ error: "Payment gateway configuration error" }, { status: 500 });
  }
  const zarinRes = await fetch("https://api.zarinpal.com/pg/v4/payment/verify.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: merchantId,
      amount: order.totalAmount * 10, // Toman to Rial conversion
      authority: Authority,
    }),
  });
  const zarinData = await zarinRes.json();
  if (zarinData.data?.code !== 100 && zarinData.data?.code !== 101) {
    await prisma.order.update({ where: { orderNumber }, data: { paymentStatus: "FAILED" } });
    return NextResponse.json({ error: "Payment verification failed with gateway" }, { status: 400 });
  }
  refId = String(zarinData.data.ref_id);
}
```
- **What:** Contacts ZarinPal verification API with merchant ID, Rial amount, and authority to verify real bank settlement.
- **Why here:** Core trust verification separating legitimate payments from spoofed callbacks.
- **Assumes:** `order.totalAmount * 10` exactly equals the amount charged at gateway checkout.
- **Assumes:** `Authority` passed in the body belongs specifically to this `orderNumber`. Established by: `nothing found` (Order schema does not store `paymentAuthority` upon checkout creation; authority is accepted from the webhook body).
- **Establishes:** Upstream ZarinPal gateway confirms settlement of `amount` under `merchant_id` with response code 100/101.
- **Depended on by:** Order status update at L92 and payment audit log at L103.

```typescript
// L79-L90
} else {
  const mockSecret = req.headers.get("x-mock-gateway-secret");
  const isAllowedMock = Authority.startsWith("ZP-MOCK-") || (Boolean(process.env.NEXTAUTH_SECRET) && mockSecret === process.env.NEXTAUTH_SECRET);
  if (!isAllowedMock) {
    return NextResponse.json({ error: "Unauthorized simulated payment attempt" }, { status: 403 });
  }
  refId = `ZP-MOCK-${Date.now()}`;
}
```
- **What:** Gates local development mock payment flow behind mock prefix or shared secret header.
- **Why here:** Allows offline sandbox testing while blocking unauthenticated mock requests.
- **Assumes:** `isProduction || isConfiguredMerchant` is reliably `true` in all real deployment environments.
- **Establishes:** In non-production, unauthenticated arbitrary authority values are rejected with 403.
- **Depended on by:** L92 (order update with mock refId).

```typescript
// L92-L122
await prisma.order.update({
  where: { orderNumber },
  data: { paymentStatus: "PAID", orderStatus: "PROCESSING", paymentRefId: refId },
});
await logPaymentTransaction({ ... });
```
- **What:** Transitions order state to PAID and PROCESSING, records transaction reference ID, and writes an immutable audit record.
- **Why here:** State commitment following successful gateway verification.
- **Assumes:** No concurrent webhook execution has altered `order` between L35 and L92.
- **Establishes:** Order is locked in PAID status with a non-null `paymentRefId`.
- **Depended on by:** Order tracking page, warehouse fulfillment, and inventory reservation cron (which filters out PAID orders).

**Cross-Function Dependencies:**
- Callee `prisma.order.findUnique`, `prisma.order.update`: internal Prisma ORM methods.
- Callee `fetch("https://api.zarinpal.com/pg/v4/payment/verify.json")`: external black-box gateway API. Depends on network availability and ZarinPal API uptime.
- Callee `logPaymentTransaction`: internal helper in `@/lib/paymentLogger`.
- Callers: ZarinPal webhook dispatch servers or client-side mock redirect handlers.
- Shared state: `Order` table shared with `src/app/api/checkout/route.ts` (creator) and `src/app/api/cron/release-reservations/route.ts` (sweeper).
- Invariant couplings:
  - If `paymentStatus` is set to `PAID`, `cron/release-reservations` will never release inventory or cancel the order.
  - If a webhook fails or is delayed past `reservedUntil`, `cron/release-reservations` may mark `orderStatus = "EXPIRED"` before this webhook executes.

**Open Questions:**
- Unclear; what happens if a delayed gateway callback arrives after the cron job has already marked the order `EXPIRED` and restocked items? L35 checks `order.paymentStatus === "PAID"`, but does not check if `order.orderStatus === "EXPIRED"`.
- Unclear; why does `Order` not persist the original `paymentAuthority` returned during initial checkout redirect? Without storing it on `Order`, any verified authority for the exact same Rial amount could theoretically be presented against this orderNumber.
