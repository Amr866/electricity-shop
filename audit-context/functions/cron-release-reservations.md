## `handleCron` in src/app/api/cron/release-reservations/route.ts (L8-L44)

**Purpose:** Periodic background sweeper. Authenticates caller via `CRON_SECRET` bearer token, executes atomic stock reservation restoration for expired pending orders (e.g. abandoned 30-min gateway sessions or 8-hour card-to-card reservations), and auto-cancels stale unanswered repair estimates past 5 business days (~7 calendar days).

**Inputs & Assumptions:**
- `headers.authorization` (string): Bearer token header. Trust: **untrusted**.
- Implicit: `process.env.CRON_SECRET`, database tables `Order`, `Product`, `RepairRequest`.
- Precondition: `process.env.CRON_SECRET` is set and matches `req.headers.get("authorization")` exactly as `Bearer ${cronSecret}` (L20-L24).

**Outputs & Effects:**
- Returns JSON `{ success: true, timestamp, expiredRepairsCount, releasedCount, restoredItemsCount }` on 200, 401 on missing or mismatched secret, 500 on execution error.
- State write: atomic status transition of expired orders from `PENDING` to `EXPIRED` and `FAILED`.
- State write: increment of `Product.stock` for all restored order items.
- State write: auto-cancellation of stale repair estimates from `COST_ESTIMATED` to `CANCELLED`.
- State write: records `INVENTORY_RELEASE` transaction log per processed order.

**Block-by-Block:**

```typescript
// L17-L24
const authHeader = req.headers.get("authorization");
const cronSecret = process.env.CRON_SECRET;
if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}
```
- **What:** Fails closed if `CRON_SECRET` is unconfigured or if the authorization header does not match.
- **Why here:** Protects the background cleanup cron from arbitrary external triggering.
- **Assumes:** Constant-time header comparison is not strictly required for long random secret strings, or network timing jitter dominates.
- **Establishes:** Invariant that only authorized cron runners (e.g. Vercel Cron, system systemd/cron daemon) can trigger cleanup.
- **Depended on by:** Stock and repair release execution below.

```typescript
// L26-L36
const [stockResult, expiredRepairsCount] = await Promise.all([
  releaseExpiredReservations(),
  expireStaleRepairEstimates(prisma),
]);
return NextResponse.json({
  success: true,
  timestamp: new Date().toISOString(),
  expiredRepairsCount,
  ...stockResult,
});
```
- **What:** Concurrently triggers inventory restoration and repair quote expiration.
- **Why here:** Consolidates periodic maintenance into a single unified heartbeat task.
- **Assumes:** Both functions can execute concurrently without locking the same tables.
- **Establishes:** Database state is swept and returned in diagnostic telemetry JSON.
- **Depended on by:** Operational monitoring and cron telemetry.

**Cross-Function Dependencies:**
- Callee `releaseExpiredReservations`: domain sweeper in `@/lib/domain/stockReservation.ts`.
  - Inside `releaseExpiredReservations`:
    - Queries candidate expired orders (`paymentStatus: "PENDING"`, `orderStatus: "PENDING"`, `reservedUntil < now`, `take: 50`).
    - Uses `tx.order.updateMany({ where: { id: order.id, orderStatus: "PENDING" }, data: { orderStatus: "EXPIRED", paymentStatus: "FAILED" } })` to claim the order atomically across multiple workers.
    - Sorts items deterministically by `productId` to prevent deadlocks.
    - Restores stock via `tx.product.updateMany({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } })`.
- Callee `expireStaleRepairEstimates`: domain sweeper in `@/lib/domain/repairLifecycle.ts`.
  - Finds `RepairRequest` rows with `status: "COST_ESTIMATED"`, `costApprovalStatus: "PENDING"`, and `updatedAt < cutoff` (7 days).
  - Updates each to `status: "CANCELLED"`, `costApprovalStatus: "DECLINED"`.
- Callers: Vercel Cron or server cron runner (GET or POST).
- Shared state: `Order`, `Product`, `RepairRequest`.
- Invariant couplings:
  - If `order.paymentStatus === "PAID"`, it is excluded from `releaseExpiredReservations` and will never be cancelled or restocked.

**Open Questions:**
- Inconsistency: The docstring in `stockReservation.ts:L15-L17` asserts: *"Orders with an uploaded payment receipt (receiptImage != null) are preserved for administrative manual verification and are never auto-cancelled."* However, `releaseExpiredReservations` at L23-L29 does NOT filter out `receiptImage != null` in the query! If 8 hours pass without admin approval, orders with receipts uploaded ARE cancelled and restocked. Established by: `nothing found` (no `receiptImage: null` clause in the Prisma query).
- Unclear; in `expireStaleRepairEstimates`, the cutoff comparison uses `updatedAt < cutoff` rather than a dedicated `estimatedAt` timestamp. Any administrative update to notes or customer details resets `updatedAt`, resetting the 7-day expiration countdown.
