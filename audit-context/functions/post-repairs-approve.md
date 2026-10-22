## `POST` in src/app/api/repairs/approve/route.ts (L9-L122)

**Purpose:** Evaluates customer or administrative decisions (approve or decline) on technical workshop repair estimates, verifies authorization (session ownership, admin privilege, or matching phone), applies the repair state machine transition to REPAIRING or CANCELLED, updates audit notes, and records the approval channel.

**Inputs & Assumptions:**
- `body.trackingCode` (string): Workshop ticket identifier (`REP-YYMMDD-XXXX`). Trust: **untrusted**.
- `body.action` (string): Decision (`"APPROVE"` | `"DECLINE"`). Trust: **untrusted**.
- `body.phone` (string | undefined): Phone number for unauthenticated customer portal approvals. Trust: **untrusted**.
- Implicit: `getServerSession(authOptions)` for optional session binding, database table `RepairRequest`.
- Precondition: `trackingCode` and `action` are non-empty strings.
- Precondition: `action` must be exactly `"APPROVE"` or `"DECLINE"`.
- Precondition: Ticket exists in database with status `"COST_ESTIMATED"` and costApprovalStatus `"PENDING"`.

**Outputs & Effects:**
- Returns JSON `{ success: true, trackingCode, status, costApprovalStatus, approvalChannel, approvalTimestamp }` on 200, 400 on invalid input/state transition, 403 on authorization failure, 404 on not found, 500 on server error.
- State write: updates `RepairRequest` (`status`, `costApprovalStatus`, `approvalChannel`, `approvalTimestamp`, `adminNotes`).

**Block-by-Block:**

```typescript
// L23-L41
const cleanCode = toAsciiDigits(trackingCode).trim().toUpperCase();
if (action !== "APPROVE" && action !== "DECLINE") {
  return NextResponse.json({ error: "عملیات ارسالی نامعتبر است (APPROVE یا DECLINE)." }, { status: 400 });
}
const existingRepair = await prisma.repairRequest.findUnique({ where: { trackingCode: cleanCode } });
if (!existingRepair) {
  return NextResponse.json({ error: "درخواست تعمیری با این کد رهگیری یافت نشد." }, { status: 404 });
}
```
- **What:** Sanitizes tracking code to uppercase ASCII, validates action enum, and fetches existing repair ticket.
- **Why here:** Basic schema validation and resource lookup before checking permissions or applying state machine logic.
- **Assumes:** `trackingCode` is unique in `RepairRequest`.
- **Establishes:** `existingRepair` is non-null and `action` is strictly APPROVE or DECLINE.
- **Depended on by:** Access control gate (L44-L65) and state transition evaluator (L67-L83).

```typescript
// L44-L65
const session = await getServerSession(authOptions);
const isAdmin = session?.user?.role === "ADMIN";
const isOwner = Boolean(
  session?.user && (
    (existingRepair.userId && session.user.id === existingRepair.userId) ||
    (existingRepair.customerPhone && session.user.phone === existingRepair.customerPhone)
  )
);
const inputPhone = body.phone ? normalizeIranianPhone(String(body.phone)) : null;
const isPhoneMatched = Boolean(inputPhone && inputPhone === existingRepair.customerPhone);

if (!isAdmin && !isOwner && !isPhoneMatched) {
  return NextResponse.json({ error: "..." }, { status: 403 });
}
```
- **What:** Enforces multi-tier authorization: permits admins, authenticated ticket owners (by userId or phone), or guests who provide the matching customer phone number.
- **Why here:** Protects repair decisions from unauthorized manipulation while supporting unauthenticated portal users who hold physical paper claim checks.
- **Assumes:** Possession of both `cleanCode` and `customerPhone` establishes sufficient customer authorization when unauthenticated. Established by: application design for guest workshop customers.
- **Establishes:** Caller is authorized to submit a cost approval decision for this repair ticket.
- **Depended on by:** State update execution below.

```typescript
// L67-L83
const decisionResult = evaluateCostApprovalDecision(
  existingRepair.status,
  existingRepair.costApprovalStatus,
  action,
  "PORTAL"
);
if (!decisionResult.isValid) {
  return NextResponse.json({ error: decisionResult.error, ... }, { status: 400 });
}
```
- **What:** Delegates to pure domain state machine function `evaluateCostApprovalDecision`.
- **Why here:** Enforces domain invariants that only tickets in `COST_ESTIMATED` with `costApprovalStatus === "PENDING"` can be approved or declined.
- **Assumes:** Pure state machine function is deterministic and side-effect free.
- **Establishes:** Transition to `REPAIRING` (if APPROVE) or `CANCELLED` (if DECLINE) is formally valid.
- **Depended on by:** Database update at L87.

```typescript
// L87-L98
const updatedRepair = await prisma.repairRequest.update({
  where: { trackingCode: cleanCode },
  data: {
    status: decisionResult.nextStatus,
    costApprovalStatus: decisionResult.nextApprovalStatus,
    approvalChannel: decisionResult.approvalChannel,
    approvalTimestamp: decisionResult.timestamp,
    adminNotes: existingRepair.adminNotes
      ? `${existingRepair.adminNotes}\n${decisionResult.noteAppend}`
      : decisionResult.noteAppend,
  },
});
```
- **What:** Commits updated state, approval status, channel, and audit note to the database.
- **Why here:** Persists decision and audit log.
- **Assumes:** No concurrent request modified `status` between L32 and L87.
- **Establishes:** Repair ticket enters REPAIRING or CANCELLED status.
- **Depended on by:** Workshop repair dashboard and customer tracking interface.

**Cross-Function Dependencies:**
- Callee `evaluateCostApprovalDecision`: domain state machine in `@/lib/repairLifecycle`.
- Callers: Customer repair tracking portal (`/repair-service?code=...`) or admin workshop dashboard.
- Shared state: `RepairRequest` table (also touched by `cron/release-reservations` via `expireStaleRepairEstimates`).
- Invariant couplings:
  - Once approved, status moves to `REPAIRING`, making the ticket immune to `expireStaleRepairEstimates` (which only sweeps `status: "COST_ESTIMATED"`).

**Open Questions:**
- Unclear; what prevents a brute-force search over `body.phone` if an attacker knows a `trackingCode`? Rate limiting is not currently applied to this endpoint.
- Unclear; does an approval trigger an SMS notification to the workshop technician? In the current implementation, notes are appended to `adminNotes`, but no outbound webhook or SMS is dispatched to staff.
