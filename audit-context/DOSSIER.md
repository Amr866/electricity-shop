# System Audit Context Dossier: Electricity Shop

**Orientation Target:** `electricity_shop` (Next.js 15, React 19, TypeScript, Prisma ORM, PostgreSQL)  
**Analysis Date:** 2026-10-22  
**Purpose:** Map system architecture, trust boundaries, state persistence, cross-function couplings, unenforced assumptions (`nothing found`), and open questions to establish audit ground truth prior to the vulnerability-hunting phase.

---

## 1. System Orientation & Architecture

### Core Subsystems
1. **Commerce & Inventory Pipeline:**
   - Client checkout (`/api/checkout`) claims stock atomically via Prisma `$transaction`, enforces deterministic sorting to avoid deadlocks, and generates order numbers.
   - Payment settlement via ZarinPal callback (`/api/payment/webhook`) verifies gateway settlement before updating order status to PAID.
   - Periodic sweeper (`/api/cron/release-reservations`) expires unpaid reservations and restores inventory.
2. **Identity & Session Lifecycle:**
   - Multi-tenant authentication engine (`/lib/core/auth.ts`) handles password-based administrative login and single-use SMS OTP customer login.
   - SMS OTP is strictly clamped to `CUSTOMER` role to prevent privilege escalation.
   - Admin session invalidation is backed by `tokenVersion` and `isSuspended` checks in `checkAdminSession()`.
3. **Workshop Repairs Lifecycle:**
   - Multi-stage repair state machine (`/lib/domain/repairLifecycle.ts`) tracking equipment from submission to delivery.
   - Customer and admin cost approval portal (`/api/repairs/approve`).
   - Automated expiration of stale quotes via cron.
4. **Contractor Inquiries & File Processing:**
   - Contractor BOM spreadsheet intake and semantic catalog matching (`/api/bom/parse`).
   - Centralized filesystem media manager (`/lib/services/mediaService.ts`) with path traversal guards and anti-scripting checks.

### Trust Boundaries & Domain Mapping

| Domain Vector | Implementation / Location | Details & Trust Boundary |
|---|---|---|
| **Ways In** | Next.js API Route Handlers (`src/app/api/**/route.ts`) | HTTP JSON / FormData payloads from browsers, webhook dispatchers, and cron triggers. |
| **Who is on the other side** | Anonymous visitor, authenticated customer, system administrator, ZarinPal gateway, cron daemon. | Trust boundary is established by Next.js Edge middleware (`src/middleware.ts`) and route-level auth checks. |
| **Data that sticks around** | PostgreSQL via Prisma (`schema.prisma`) | `User`, `Order`, `OrderItem`, `Product`, `ProductImage`, `VerificationToken`, `RepairRequest`, `BillOfMaterials`, `Review`, `PaymentTransactionLog`. |
| **Calls you can't see inside** | External HTTP endpoints & system utilities | Upstream ZarinPal verification (`https://api.zarinpal.com/pg/v4/payment/verify.json`), Node.js `fs/promises` filesystem APIs, SheetJS parser (`xlsx`). |

---

## 2. Index of Analyzed Functions

| Function / Entry Point | File & Range | Primary Boundary | Core Invariant / Enforced Responsibility |
|---|---|---|---|
| [`POST`](file:///d:/projects/antigravity/electricity_shop/audit-context/functions/post-payment-webhook.md) | `src/app/api/payment/webhook/route.ts` (L6-L152) | Public Webhook | Outbound gateway verification of amount & authority; idempotency guard on `PAID` status. |
| [`POST`](file:///d:/projects/antigravity/electricity_shop/audit-context/functions/post-checkout.md) | `src/app/api/checkout/route.ts` (L18-L343) | Public API | Atomic stock decrement inside Prisma transaction; deterministic sorting to prevent deadlocks. |
| [`authorize`](file:///d:/projects/antigravity/electricity_shop/audit-context/functions/auth-authorize.md) | `src/lib/core/auth.ts` (L35-L146) | Internal NextAuth | scrypt password verification for admins; single-use OTP deletion and `CUSTOMER` role clamp. |
| [`POST`](file:///d:/projects/antigravity/electricity_shop/audit-context/functions/post-otp-send.md) | `src/app/api/auth/otp/send/route.ts` (L7-L80) | Public API | Dual sliding-window rate limiting; CSPRNG token generation; single active token per phone. |
| [`middleware`](file:///d:/projects/antigravity/electricity_shop/audit-context/functions/middleware.md) | `src/middleware.ts` (L4-L91) | Edge Request Pipeline | 301 canonical redirect; 503 maintenance mode interception; `/admin` perimeter defense. |
| [`POST`](file:///d:/projects/antigravity/electricity_shop/audit-context/functions/post-repairs-approve.md) | `src/app/api/repairs/approve/route.ts` (L9-L122) | Semi-trusted Portal | Multi-tier authorization (admin, user session, or matching phone); state machine transition to REPAIRING/CANCELLED. |
| [`POST`](file:///d:/projects/antigravity/electricity_shop/audit-context/functions/post-bom-parse.md) | `src/app/api/bom/parse/route.ts` (L10-L131) | Public API | 10MB file limit; extension allowlist (`.xlsx`, `.xls`, `.csv`); anti-smuggling 1KB prefix check. |
| [`deleteUploadedFile`](file:///d:/projects/antigravity/electricity_shop/audit-context/functions/media-delete-file.md) | `src/lib/services/mediaService.ts` (L190-L241) | Internal Service | Path traversal containment within `uploadsBase`; active product image usage protection. |
| [`handleCron`](file:///d:/projects/antigravity/electricity_shop/audit-context/functions/cron-release-reservations.md) | `src/app/api/cron/release-reservations/route.ts` (L8-L44) | Cron Secret Header | Bearer token authorization; atomic order claiming; stock restock; repair quote expiration. |
| [`checkAdminSession`](file:///d:/projects/antigravity/electricity_shop/audit-context/functions/check-admin-session.md) | `src/lib/core/adminAuth.ts` (L63-L147) | Internal Auth Guard | Live database lookup verifying `tokenVersion` and `isSuspended`; module-level permission check. |

---

## 3. Cross-Cutting Invariants & System Coupling

### Invariant 1: Inventory Conservation & Reservation Lifecycle
- **Coupled Functions:** `checkout:POST`, `payment/webhook:POST`, and `cron/release-reservations:handleCron`.
- **System Rule:** Every stock decrement during checkout must culminate in either a confirmed payment (`PAID`), or an automated inventory restoration upon reservation expiration (`reservedUntil < now`).
- **Coupling Mechanics:**
  1. `checkout:POST` decrements `Product.stock` and stamps `reservedUntil` (30 mins for online gateway, 8 hours for card-to-card).
  2. `payment/webhook:POST` marks `paymentStatus = "PAID"`. Once `PAID`, `cron/release-reservations` explicitly ignores the order.
  3. If payment is never received, `releaseExpiredReservations` atomically transitions `orderStatus` from `PENDING` to `EXPIRED` and increments `Product.stock` by the exact item quantities.
- **Deadlock Safeguard:** Both `checkout:POST` and `stockReservation:releaseExpiredReservations` sort order items alphabetically by `productId` before executing lock updates.

### Invariant 2: Administrative Session Revocation Consistency
- **Coupled Functions:** `middleware:middleware`, `checkAdminSession`, `change-password:POST`, and `admin/users/[id]:PUT`.
- **System Rule:** When an administrator's credentials change or an account is suspended, all existing active JWT tokens must be immediately rejected across all administrative endpoints.
- **Implementation Divergence:**
  - `checkAdminSession` (`src/lib/core/adminAuth.ts`) queries PostgreSQL for `dbUser.tokenVersion` and `dbUser.isSuspended`. If `dbUser.tokenVersion !== sessionTokenVersion`, it returns 401. This is used by 16 administrative route handlers.
  - In contrast, `src/app/api/admin/upload/route.ts` (L7-L10) and `src/app/api/admin/articles/route.ts` (L8-L11, L29-L32) implement local `requireAdmin()` helpers that read only `session.user.role === "ADMIN"` from the decrypted JWT without querying PostgreSQL.
  - **Divergence Fact:** Suspended administrators with unexpired JWTs are blocked from products/orders/users APIs, but remain capable of accessing upload and article management APIs until JWT expiration.

### Invariant 3: Card-to-Card Receipt Preservation Discrepancy
- **Coupled Functions:** `stockReservation:releaseExpiredReservations` and `Order` model.
- **Stated Invariant (`src/lib/domain/stockReservation.ts:L15-L17`):**
  > *"Invariant: Orders with an uploaded payment receipt (receiptImage != null) are preserved for administrative manual verification and are never auto-cancelled."*
- **Executed Code (`src/lib/domain/stockReservation.ts:L23-L29`):**
  ```typescript
  const expiredOrders = await prisma.order.findMany({
    where: {
      paymentMethod: { in: ["card_to_card", "zarinpal", "online"] },
      paymentStatus: "PENDING",
      orderStatus: "PENDING",
      reservedUntil: { lt: now },
    }, ...
  });
  ```
- **Discrepancy Fact:** The Prisma query does **not** filter out `receiptImage != null`. If an administrator does not verify a card-to-card receipt within 8 hours, the order is cancelled and its stock is returned to the public pool.

---

## 4. Key Unenforced Assumptions (`establishedBy: "nothing found"`)

These represent critical assumptions where the codebase counts on a property being true, but no code mechanism guarantees it:

1. **Payment Authority Binding to Order:**
   - *Location:* `src/app/api/payment/webhook/route.ts:L62-L64`
   - *Assumes:* The `Authority` passed in the webhook payload belongs specifically to the order identified by `orderNumber`.
   - *Established by:* `nothing found`. The `Order` table in `schema.prisma` does not store `paymentAuthority` upon checkout creation; the webhook accepts whatever `Authority` is provided in the request body and verifies whether ZarinPal settled that authority for the matching Rial amount.

2. **In-Memory Rate Limiting Persistence:**
   - *Location:* `src/lib/core/rateLimit.ts:L8`
   - *Assumes:* Sliding-window rate limit counters are persistent and globally enforced.
   - *Established by:* `nothing found`. The limiter is an in-memory `Map`. In a multi-worker, clustered, or serverless deployment, each worker maintains isolated counters, allowing rate limits to be multiplied by the worker count.

3. **Stale Repair Estimation Expiration Relies on `updatedAt`:**
   - *Location:* `src/lib/domain/repairLifecycle.ts:L179`
   - *Assumes:* `ticket.updatedAt` represents the exact timestamp when the cost estimate was calculated.
   - *Established by:* `nothing found`. `schema.prisma` lacks a dedicated `estimatedAt` field. Any routine update to administrative notes or customer contact information updates `updatedAt`, resetting the 7-day expiration clock.

4. **Media Deletion Usage Checks Only Products:**
   - *Location:* `src/lib/services/mediaService.ts:L209-L216`
   - *Assumes:* Only `ProductImage` records reference files inside `/public/uploads`.
   - *Established by:* `nothing found`. Articles (`Article.coverImage`), repair request attachments, and reviews also reference paths in `/public/uploads`, but `deleteUploadedFile` only verifies `ProductImage`, allowing article or repair imagery to be unlinked on disk without warning.

5. **In-Memory BOM Row Limit Absence:**
   - *Location:* `src/lib/domain/bomParser.ts:L173-L180`, `L342-L352`
   - *Assumes:* The number of line items in an uploaded spreadsheet is sufficiently small that `O(N * M)` in-memory matching against all active catalog products will not block the Node.js event loop.
   - *Established by:* `nothing found`. While file size is capped at 10MB in the route handler, there is no upper bound on the number of rows processed by `parseBomWorkbook`.

---

## 5. Open Questions for Hunting Phase

1. **Live Checkout Gateway Dispatch:**
   - In `src/app/api/checkout/route.ts:L318-L320`, `redirectUrl` is set to `/zarinpal-mock?orderNumber=...`. How does the live production client transition to ZarinPal's hosted payment gateway? Does a separate client-side action initiate `/pg/v4/payment/request.json`, or is this pending production integration?
2. **Delayed Webhook Arrival on Expired Orders:**
   - If a customer completes bank payment after network delays such that the cron sweeper has already marked `orderStatus = "EXPIRED"` and returned items to stock, what occurs when the webhook callback arrives? `payment/webhook/route.ts:L35` checks `paymentStatus === "PAID"`, but does not check `orderStatus === "EXPIRED"`. Does the webhook re-mark the expired order as `PAID` without re-claiming stock?
3. **Repair Cost Approval Unauthenticated Brute-Force:**
   - In `src/app/api/repairs/approve/route.ts`, an unauthenticated caller can approve or decline a repair quote by providing `trackingCode` and matching `phone`. Given that this endpoint lacks rate limiting, can a caller with a known tracking code iterate phone prefixes to guess the associated customer phone number?
4. **Environment Check Stricitness for OTP Return:**
   - In `src/app/api/auth/otp/send/route.ts:L68-L74`, `devCode` is returned whenever `process.env.NODE_ENV !== "production"`. In non-production environments that are publicly exposed (e.g., public staging or QA previews), could unauthenticated visitors read valid OTPs from API responses?
