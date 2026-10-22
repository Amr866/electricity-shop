## `POST` in src/app/api/checkout/route.ts (L18-L343)

**Purpose:** Validates checkout payload (customer information, 10-digit Iranian postal code, corporate tax fields, items, coupon, shipping method), executes server-authoritative financial and tiered pricing calculations, claims inventory atomically within a database transaction to prevent deadlocks and overselling, persists the new Order, and issues payment/tracking redirection URLs.

**Inputs & Assumptions:**
- `body` (JSON object):
  - `customerName`, `customerPhone`, `address`, `postalCode`, `items`: untrusted input from customer browser.
  - `isCorporate`, `companyName`, `economicCode`, `nationalCode`: untrusted corporate tax fields.
  - `paymentMethod` (`"zarinpal"` | `"cod_isfahan"` | `"card_to_card"`): untrusted payment selection.
  - `shippingMethod`: untrusted shipping selection.
  - `couponCode`: untrusted coupon string.
- Implicit: `getServerSession(authOptions)` for optional user binding, database tables `Product`, `Order`, `OrderItem`, `Coupon`, `PaymentTransactionLog`.
- Preconditions:
  - Required fields present (`customerName`, `customerPhone`, `address`, non-empty `items`, clean 10-digit `postalCode`).
  - Cash-on-delivery (`cod_isfahan`) is restricted to local Isfahan/Najafabad shipping methods (L69-L85).
  - Corporate invoices require valid Iranian National Code and Economic Code format (L87-L97).

**Outputs & Effects:**
- Returns JSON `{ success: true, orderNumber, orderId, subtotal, discount, shippingCost, totalAmount, redirectUrl, ... }` on 200, or error message on 400.
- State write: atomic decrement of `Product.stock` inside Prisma transaction (L245-L255).
- State write: creation of `Order` record and related `OrderItem` rows (L262-L293).
- State write: inserts initial audit record into `PaymentTransactionLog` (L302-L315).

**Block-by-Block:**

```typescript
// L52-L66
if (!customerName || !customerPhone || !address || !items || items.length === 0) {
  return NextResponse.json({ message: "لطفاً تمامی فیلدهای الزامی را تکمیل کنید." }, { status: 400 });
}
const cleanPostalCode = toAsciiDigits(String(postalCode || "").trim());
if (!cleanPostalCode || !/^\d{10}$/.test(cleanPostalCode)) {
  return NextResponse.json({ message: "کد پستی باید دقیقاً ۱۰ رقم عددی باشد." }, { status: 400 });
}
```
- **What:** Validates mandatory customer identity, contact, delivery address, and 10-digit postal code.
- **Why here:** Immediate boundary validation before querying products or running financial logic.
- **Assumes:** Iran Post requires strict 10-digit numeric postal codes.
- **Establishes:** `cleanPostalCode` is exactly 10 digits; customer metadata is non-empty.
- **Depended on by:** Database order creation at L271.

```typescript
// L108-L120
const [session, dbProducts, coupon] = await Promise.all([
  getServerSession(authOptions),
  prisma.product.findMany({ where: { id: { in: requestedProductIds } }, include: { images: true } }),
  couponCode ? prisma.coupon.findUnique({ where: { code: couponCode.trim().toUpperCase() } }) : Promise.resolve(null),
]);
```
- **What:** Concurrently fetches caller session, product catalog snapshots, and coupon definition.
- **Why here:** Parallel read minimizes database round-trips before transactional lock phase.
- **Assumes:** Product IDs are unique and present in the catalog.
- **Establishes:** Server holds authoritative catalog state (`price`, `stock`, `isArchived`).
- **Depended on by:** Item validation loop (L138-L195) and financial calculation engine (L211-L224).

```typescript
// L240-L260
const sortedItemsToLock = sortItemsForDeterministicLock(validatedItems);
const order = await prisma.$transaction(async (tx) => {
  for (const item of sortedItemsToLock) {
    const updateResult = await tx.product.updateMany({
      where: { id: item.productId, stock: { gte: item.quantity } },
      data: { stock: { decrement: item.quantity } },
    });
    if (updateResult.count === 0) {
      throw new Error(`موجودی کالای «${item.productName}» هم‌اکنون به اتمام رسیده است.`);
    }
  }
  return await tx.order.create({ ... });
});
```
- **What:** Sorts items deterministically by `productId` to prevent deadlocks, decrements inventory with conditional `stock >= qty`, and creates order record.
- **Why here:** Atomic guarantee that orders are never placed without confirmed inventory decrement.
- **Assumes:** Deterministic product ID order prevents database deadlock under high concurrency.
- **Assumes:** Concurrent checkout attempts cannot decrement stock below zero (`stock: { gte: item.quantity }`).
- **Establishes:** Inventory is physically claimed and order record is committed with status PENDING.
- **Depended on by:** Order tracking, inventory release cron, and warehouse fulfillment.

```typescript
// L317-L321
let redirectUrl = `/order-tracking/${order.orderNumber}`;
if (paymentMethod === "zarinpal") {
  redirectUrl = `/zarinpal-mock?orderNumber=${order.orderNumber}&amount=${finalTotalAmount}`;
}
```
- **What:** Selects user redirect URL based on payment method.
- **Why here:** Supplies the client with the next navigation target after database commit.
- **Assumes:** For `"zarinpal"`, redirecting to `/zarinpal-mock` is appropriate. Established by: `nothing found` (no production ZarinPal payment request `/pg/v4/payment/request.json` dispatch in this route handler).
- **Establishes:** Client receives redirect URL in JSON response.
- **Depended on by:** Frontend checkout client router.

**Cross-Function Dependencies:**
- Callee `sortItemsForDeterministicLock`, `calculateOrderFinancials`, `calculateTieredUnitPrice`: internal domain helpers in `@/lib/checkoutEngine`.
- Callee `logPaymentTransaction`: internal helper in `@/lib/paymentLogger`.
- Callers: Frontend checkout page (`/checkout`).
- Shared state: `Product.stock` (decremented here, incremented by `stockReservation.ts` upon expiration).
- Invariant couplings:
  - Every successfully created order decrements `Product.stock`.
  - If payment is not completed before `reservedUntil`, `cron/release-reservations` restores `Product.stock`.

**Open Questions:**
- Unclear; how does production live payment gateway initiation occur if `redirectUrl` hardcodes `/zarinpal-mock`? Does `/zarinpal-mock` internally redirect to ZarinPal, or is production online payment flow dependent on a separate client-side trigger?
- Unclear; what happens if an unauthenticated user places an order (`userId = null`) using a phone number of an existing registered user? The order is created with `userId = null`; does the account dashboard link guest orders by customerPhone?
