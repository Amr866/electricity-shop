# Implementation Plan: Multi-Admin Governance & Security Hardening

**Branch**: `002-admin-governance-security` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)  
**Parent Feature**: [001-store-workshop-platform](../001-store-workshop-platform/spec.md)

---

## Summary

This plan details the technical architecture and security boundaries for **Multi-Admin Governance & Security Hardening**. It establishes self-service credential rotation, hierarchical staff administration with dynamically scoped domain permissions, global session invalidation across compromised devices via `tokenVersion`, and strict password-gated authentication.

---

## Technical Context

- **Language/Version**: TypeScript 5.7.2, Node.js v20+ / v22+
- **Primary Dependencies**: Next.js 15.1.0, React 19.0.0, Tailwind CSS 3.4.16, Prisma ORM 6.19.3, NextAuth.js 4.24.15, Lucide React 1.46.0
- **Storage**: PostgreSQL 16 managed through Prisma ORM with connection pooling
- **Testing**: `node:test` integration tests (`tests/integration/phase19-admin-governance.test.mjs`), `tsc --noEmit`
- **Security Primitives**: Node.js `crypto.scryptSync`, `crypto.randomBytes(16)`, `crypto.timingSafeEqual`

---

## Constitution Check

| Principle / Gate | Status | Architectural Verification |
|---|:---:|---|
| **I. Brand & Local Identity** | **PASS** | Persian RTL typography (Vazirmatn), explicit `<bdi dir="ltr">` phone formatting, Najafabad store identity. |
| **II. Zero-Crash Fallback** | **PASS** | Clean error handling on API endpoints, structured fallback responses without unhandled 500 exceptions. |
| **III. Server-Authoritative** | **PASS** | Server-side cryptographic password verification, sliding-window rate limiting, and database-level session tokenVersion validation. |
| **IV. Persian RTL & BiDi** | **PASS** | All phone numbers wrapped in `<bdi dir="ltr">`, eye toggle positioned at `left-3` in RTL layout to prevent text collisions. |
| **VI. Technology Stack** | **PASS** | Next.js 15 App Router, React 19 Client/Server components, Prisma ORM 6.19.3, NextAuth 4. |
| **VII. Structured Logging** | **PASS** | Zero plaintext passwords or hash fragments logged; HTTP requests logged at `info`, failures at `error`, internal checks at `debug`. |
| **VIII. Quality Gates** | **PASS** | Zero TypeScript compilation errors (`tsc --noEmit`), automated integration tests pass 100%. |

---

## Architecture & Implementation Details

1. **Database Schema Enhancements (`FR-004`)**:
   - `prisma/schema.prisma` `User` model augmented with:
     - `tokenVersion Int @default(0)`
     - `adminPermissions String?` (JSON string array: `["CATALOG", "ORDERS", "REPAIRS", "REVIEWS"]` or `["ALL"]`)
     - `isSuspended Boolean @default(false)`

2. **Strict Password-Gated Authentication & Session Invalidation (`FR-004`, `FR-006`)**:
   - `src/lib/core/auth.ts`:
     - Disallow administrative role escalation via SMS OTP: when authenticating via `otpCode`, the resulting session role is strictly clamped to `"CUSTOMER"`.
     - Administrative session privileges (`role: "ADMIN"`) require explicit Phone + Password credentials, protected by sliding-window rate limiting (maximum 5 failed attempts per 15 minutes).
     - Include `tokenVersion` and `permissions` in NextAuth `jwt` and `session` callbacks.
   - `src/lib/core/adminAuth.ts`:
     - `checkAdminSession()`: query current `tokenVersion` and `isSuspended` from PostgreSQL. If `dbUser.isSuspended` is true or `dbUser.tokenVersion !== session.user.tokenVersion`, immediately reject with HTTP 401 Unauthorized.
     - `checkAdminPermission(session, requiredModule)`: verify that the administrator possesses either `"ALL"` or the specific module in `adminPermissions`.

3. **In-Portal Self-Service Password Rotation (`FR-001`)**:
   - `POST /api/admin/change-password`:
     - Validates active session via `checkAdminSession()`.
     - Enforces sliding-window rate limiting (maximum 5 attempts per 15 minutes) via `checkRateLimit`.
     - Verifies `currentPassword` with timing-safe comparison (`crypto.timingSafeEqual` via `verifyPassword`).
     - Enforces new password complexity: minimum 8 characters with at least one letter and one number (`/^(?=.*[A-Za-z])(?=.*\d).{8,}$/`).
     - Hashes new password with cryptographic scrypt and random 16-byte salt (`hashPassword`).
     - Atomically updates password and increments `tokenVersion: { increment: 1 }` in PostgreSQL.
   - `/admin/settings` (`src/app/admin/settings/page.tsx` & `AdminSettingsClient.tsx`):
     - Visible `<label>` tags with `htmlFor`, WCAG 2.1 AA 4.5:1 text contrast, visible focus rings.
     - Error summary announcements using `role="alert"` and `aria-live="polite"`.
     - Minimum 44×44px touch targets.
     - RTL password reveal button positioned at inline-start (`left-3`) with Persian `aria-label`.

4. **Root Owner Governance & Re-Authentication Guard (`FR-002`, `FR-005`)**:
   - Designate Root Owner (`ADMIN_PHONES`, e.g. `09136260072`) as immutable SuperAdmin: Root accounts cannot be edited, suspended, demoted, or deleted.
   - `src/app/api/admin/users/route.ts` & `src/app/api/admin/users/[id]/route.ts`:
     - `GET`: Accessible exclusively to Root Owner.
     - `POST`: Provisions a new secondary admin (`phone`, `name`, `initialPassword`, `permissions`). Requires mandatory Root Password re-authentication.
     - `PATCH`: Modifies assigned permissions or suspension status. Requires Root Owner password re-authentication. When setting `isSuspended: true`, PostgreSQL atomically increments `tokenVersion: { increment: 1 }`.
     - `DELETE`: Revokes secondary admin account. Root Owner is guarded against deletion.
   - `/admin/users` (`src/app/admin/users/page.tsx` & `AdminUsersClient.tsx`):
     - Accessible exclusively to Root Owner; non-root admins receive 403 Forbidden.
     - Display phone numbers in table cells using `<bdi dir="ltr" className="font-mono">`.
     - Provisioning and editing modal dialog: focus-trapped, keyboard-escapable (`Escape` key), with `role="dialog"` and `aria-modal="true"`.

5. **Dynamic Scoped Admin Navigation (`FR-003`)**:
   - `src/components/admin/AdminSidebar.tsx`:
     - Inspect `session.user.permissions` and Root Owner status.
     - Dynamically render navigation items matching the current administrator's assigned domain modules (`CATALOG`, `ORDERS`, `REPAIRS`, `REVIEWS`, Root Owner only: `users`, `backup`).

---

## Verification Plan

- **Automated Tests**: `tests/integration/phase19-admin-governance.test.mjs` running via `node:test`.
- **Type Checking**: Clean execution of `tsc --noEmit`.
