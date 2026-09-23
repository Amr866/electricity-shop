# Tasks: Multi-Admin Governance & Security Hardening

**Feature Branch**: `002-admin-governance-security`  
**Input Specifications**: [`spec.md`](./spec.md) | [`plan.md`](./plan.md)  
**Parent Feature**: [001-store-workshop-platform](../001-store-workshop-platform/tasks.md)

---

## Task List

### Phase 1: Database & Core Security Foundations
- [x] T001 [P] Add `tokenVersion Int @default(0)`, `adminPermissions String?`, and `isSuspended Boolean @default(false)` fields to the `User` model in `prisma/schema.prisma` and synchronize PostgreSQL schema via `npx prisma db push`
- [x] T002 Update `src/lib/core/auth.ts` to enforce password-gated admin authentication (disallowing role escalation from OTP), embed `tokenVersion` and `permissions` in NextAuth JWT and session callbacks, and update `src/lib/core/adminAuth.ts` with `tokenVersion` session revocation verification and `checkAdminPermission(session, module)`

### Phase 2: In-Portal Password Rotation Subsystem
- [x] T003 [P] Implement `POST /api/admin/change-password` in `src/app/api/admin/change-password/route.ts` with timing-safe current password verification (`crypto.timingSafeEqual`), complexity validation (minimum 8 characters with letters and numbers), sliding-window rate limiting (5 attempts/15 min), atomic `tokenVersion` increment, and salted scrypt hashing via `src/lib/core/password.ts`
- [x] T004 Build self-service password rotation interface at `/admin/settings` (`src/app/admin/settings/page.tsx` and `src/app/admin/settings/AdminSettingsClient.tsx`) adhering to UI/UX Pro Max standards: visible `<label htmlFor>`, `role="alert"` for error announcements, 44×44px minimum tap targets, eye toggle at inline-start `left-3` in RTL layout with Persian `aria-label`, visible focus rings (`focus:ring-2 focus:ring-primary-500`), and live strength meter

### Phase 3: Multi-Admin Governance & Scoped Permissions
- [x] T005 [P] Implement administrative users API route handlers (`GET`, `POST`, `PATCH`, `DELETE`) in `src/app/api/admin/users/route.ts` and `src/app/api/admin/users/[id]/route.ts` with Root Owner (`ADMIN_PHONES`) exclusivity, immutable SuperAdmin guard, mandatory Root Password re-authentication, and automatic `tokenVersion` increment on suspension (`isSuspended: true`) for immediate global session invalidation
- [x] T006 Build administrative governance portal at `/admin/users` (`src/app/admin/users/page.tsx` and `src/app/admin/users/AdminUsersClient.tsx`) with UI/UX Pro Max compliance: phone numbers wrapped in `<bdi dir="ltr" className="font-mono">`, scoped module assignment chips (`CATALOG`, `ORDERS`, `REPAIRS`, `REVIEWS`), active/suspended badges, and a focus-trapped, keyboard-escapable (`Escape` key) modal dialog (`role="dialog"`, `aria-modal="true"`) requiring Root Password re-auth verification
- [x] T007 Update `src/components/admin/AdminSidebar.tsx` to inspect `session.user.permissions` and dynamically render only permitted domain modules for secondary admins, hiding unauthorized sections and displaying Settings for all admins

### Phase 4: Automated Verification & Test Suite
- [x] T008 Create automated integration test suite `tests/integration/phase19-admin-governance.test.mjs` verifying password rotation, tokenVersion session invalidation, scoped module access denial (403), Root Owner protection, and OTP elevation rejection, followed by clean `npm run typecheck`
