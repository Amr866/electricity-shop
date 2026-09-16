# Migration Specification: Payment Transaction Logs

**Migration Identifier**: `2026-09-16-add-payment-transaction-logs`  
**Date**: 2026-09-16  
**Status**: IN_PROGRESS  
**Domain**: Payments, Auditing & Financial Integrity  

---

## 1. System Context & Analysis

### Current State
- `Order` records contain coarse payment summary fields:
  - `paymentMethod`: `zarinpal`, `card_to_card`, `cod_isfahan`
  - `paymentStatus`: `PENDING`, `PAID`, `FAILED`
  - `paymentRefId`: Bank/Gateway transaction reference ID
  - `receiptImage`: S3/local file path to Card-to-Card payment receipt
- **Problem**: There is currently no append-only audit trail capturing intermediate payment events, failed verification attempts, webhook payloads, raw gateway error codes, IP addresses, or state transitions over time. If a customer reports a payment dispute or a gateway times out, the system cannot inspect historical attempt records.

### Readers & Writers
- **Current Readers**:
  - `src/app/order-tracking/[id]/page.tsx`
  - `src/app/admin/orders/page.tsx`
- **Current Writers**:
  - `src/app/api/checkout/route.ts` (order creation)
  - `src/app/api/payment/webhook/route.ts` (ZarinPal webhook)
  - `src/app/api/orders/verify/route.ts` (mock/client verification)
- **New Readers**:
  - Customer order timeline (payment history)
  - Admin payment audit drawer / transaction inspector
  - Financial reconciliation background jobs

---

## 2. Compatibility & Migration Strategy

### Expand-Contract Sequencing
1. **Expand (Non-Breaking)**:
   - Introduce new table `PaymentTransactionLog` in PostgreSQL via Prisma.
   - Maintain all existing fields on `Order` (`paymentStatus`, `paymentRefId`, etc.) for complete backward compatibility.
   - Zero downtime: Existing client components and APIs continue reading and writing `Order` without breaking.
2. **Dual-Write / Audit Hook**:
   - Deploy `src/lib/paymentLogger.ts` utility.
   - Hook into checkout creation (`INITIATE`), webhook processing (`WEBHOOK`/`VERIFY`), and verification callbacks.
3. **Verify**:
   - Verify PostgreSQL index coverage, check constraint behavior (`amount >= 0`), foreign key cascading, and end-to-end logging under tests.
4. **Contract (Future, Optional)**:
   - None required; `Order` retains summary state while `PaymentTransactionLog` serves as the authoritative immutable history.

---

## 3. Forward Path

1. **Schema Update (`prisma/schema.prisma`)**:
   - Add `paymentLogs PaymentTransactionLog[]` to model `Order`.
   - Add model `PaymentTransactionLog` with foreign key relation to `Order`, indexes on `orderId`, `orderNumber`, `authority`, `referenceId`, `status`, and `createdAt`.
2. **Database Push & Client Generation**:
   - `npx prisma db push`
   - `npx prisma generate`
3. **PostgreSQL Constraint Enforcement**:
   - Apply idempotent `CHECK (amount >= 0)` constraint via `scripts/migrate-payment-transaction-logs.ts`.
4. **Service Integration**:
   - Implement `src/lib/paymentLogger.ts`.
   - Update `src/app/api/checkout/route.ts`, `src/app/api/payment/webhook/route.ts`, and `src/app/api/orders/verify/route.ts`.

---

## 4. Rollback Path

If rollback is explicitly requested:
1. Revert `prisma/schema.prisma` removing `PaymentTransactionLog` and `Order.paymentLogs`.
2. Run `scripts/rollback-payment-transaction-logs.ts` which safely drops `PaymentTransactionLog` table and its check constraint.
3. Re-run `npx prisma generate`.
4. Revert `src/lib/paymentLogger.ts` calls in route handlers.
5. Zero loss of core order data since `Order` table is never altered destructively.

---

## 5. Verification Plan

- [x] Schema parity and zero TypeScript errors (`tsc --noEmit`).
- [x] Database check constraint validation (`amount >= 0`).
- [x] Foreign key index validation in `pg_indexes`.
- [x] Automated test suite verifying creation, querying, and error handling.
- [x] Clean Next.js route build (`next build`).
