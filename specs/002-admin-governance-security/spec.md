# Feature Specification: Multi-Admin Governance & Security Hardening

**Feature Branch**: `002-admin-governance-security`  
**Created**: 2026-09-19 | **Status**: Complete  
**Predecessor Feature**: [`001-store-workshop-platform`](../001-store-workshop-platform/spec.md)

---

## Overview

The **Multi-Admin Governance & Security Hardening** feature establishes a secure, zero-trust administrative tier for the Shiasi Store & Technical Workshop Platform. It equips the store owner with self-service credential rotation, hierarchical staff administration with dynamically scoped domain permissions, global session invalidation across compromised devices, and strict password-gated authentication that neutralizes SIM-swap and SMS interception attacks.

---

## Clarifications

### Session 2026-09-19
- **Q**: Where and how should administrators be allowed to change their passwords and provision new admin accounts?  
  **A**: **In-Portal Self-Service & Multi-Admin Management with Re-Auth Guard**: Logged-in admins can rotate their own password at `/admin/settings` (requires verifying `currentPassword`, minimum 8 characters with complexity rules, sliding-window rate limiting, and revoking stale sessions). Admins can also add or promote new administrators from a dedicated `/admin/users` interface, guarded by mandatory re-authentication of the executing admin's current password. The server-side CLI script (`scripts/seeds/create-admin.js`) is preserved as an offline root administrative tool.
- **Q**: When adding multiple administrators, how should account authority and deletion/demotion protections be governed between the store owner and secondary admins?  
  **A**: **Protected Root Owner with Dynamic Scoped Permissions for Secondary Admins**: The primary store owner account (associated with `ADMIN_PHONES`, e.g. `09136260072`) holds immutable SuperAdmin authority and cannot be edited, demoted, or deleted by any other administrator. Only the Root Owner/SuperAdmin can create, suspend, or revoke secondary admin accounts, and can dynamically configure and modify the operational permissions assigned to each secondary admin (e.g., full access vs scoped access to Store Catalog, Order Fulfillment, Workshop Repairs, or Customer Reviews). Secondary admins can only manage their permitted operational modules and rotate their own password.
- **Q**: When an administrator changes their password, how should active login sessions across other devices and browsers be handled?  
  **A**: **Global Invalidation of Secondary Devices via `tokenVersion`**: Incrementing a `tokenVersion` field on the `User` record upon password rotation immediately invalidates all active sessions on other devices and browsers, forcibly terminating stale or compromised tokens upon their next authenticated API call, while seamlessly refreshing the active browser session with the incremented `tokenVersion`.
- **Q**: When the Root Owner provisions a new administrator account, how should the new admin's initial credentials and account activation be established?  
  **A**: **Owner-Defined Initial Password with Prompt for Rotation**: The Root Owner supplies the new admin's full name, mobile number, assigned domain modules, and sets a strong initial password (at least 8 characters) in `/admin/users`, guarded by Root re-authentication. The new admin logs in using their phone and initial password, and is guided to change it to a private password via `/admin/settings`.
- **Q**: What authentication factor requirements should govern administrative access when signing into the `/admin` portal?  
  **A**: **Strict Password-Gated Admin Access**: Administrative sessions strictly require Phone + Password (protected by sliding-window rate limiting). SMS OTP alone cannot grant administrative privileges or elevate a user session to `ADMIN`, completely eliminating SIM swap and SMS interception vulnerabilities. SMS OTP is reserved exclusively for customer accounts and verified admin password recovery.

---

## User Scenarios & Testing

### User Story 1 - Self-Service Admin Password Rotation (Priority: P1)

As an authorized administrator, I need to securely update my password from within `/admin/settings`, so that I can maintain account hygiene and immediately terminate stale or compromised sessions across other devices.

**Acceptance Scenarios**:
1. **Given** an admin is on `/admin/settings`, **When** submitting the password rotation form, **Then** the current password must be validated using timing-safe comparison (`crypto.timingSafeEqual`).
2. **Given** an admin enters a new password under 8 characters or without letters/numbers, **When** submitted, **Then** validation blocks submission and displays a localized Persian complexity error.
3. **Given** password rotation succeeds, **When** persisted in PostgreSQL, **Then** the password is saved as a salted scrypt hash (`src/lib/core/password.ts`), `tokenVersion` increments by 1, and other device sessions are terminated on their next request.
4. **Given** an RTL layout, **When** viewing password inputs, **Then** the eye toggle button is positioned at inline-start (`left-3`) with Persian `aria-label` to prevent visual collision with right-aligned text.

---

### User Story 2 - Root Owner Multi-Admin Governance & Scoped Permissions (Priority: P1)

As the store owner (Root SuperAdmin), I need to create secondary administrator accounts and assign them scoped operational permissions (`CATALOG`, `ORDERS`, `REPAIRS`, `REVIEWS`), so that staff can execute their duties without lateral privilege escalation.

**Acceptance Scenarios**:
1. **Given** the Root Owner visits `/admin/users`, **When** the page renders, **Then** a roster of all administrators is displayed with their assigned module chips, suspension status, and `<bdi dir="ltr">` phone formatting.
2. **Given** a non-root administrator attempts to access `/admin/users`, **When** queried, **Then** the system returns HTTP 403 Forbidden with a clear localized access-denied screen.
3. **Given** the Root Owner provisions or edits an admin, **When** submitting the modal form, **Then** mandatory Root Password re-authentication is required before changes are committed.
4. **Given** an admin account is marked `isSuspended: true`, **When** saved, **Then** `tokenVersion` is atomically incremented, immediately terminating their active session.
5. **Given** any administrative user, **When** attempting to delete or demote the Root Owner (`ADMIN_PHONES`), **Then** the API and UI strictly forbid the action.

---

### User Story 3 - Strict Password-Gated Administrative Authentication (Priority: P1)

As the platform security system, I must require Phone + Password for all administrative logins and prevent SMS OTP from granting `ADMIN` role privileges, ensuring SIM-swap attacks cannot breach the management console.

**Acceptance Scenarios**:
1. **Given** a user signs in using an admin phone number with SMS OTP alone, **When** authenticated, **Then** the resulting session role is clamped to `CUSTOMER`, preventing `/admin` access.
2. **Given** an admin signs in with Phone + Password, **When** credentials match, **Then** session role `ADMIN` is granted along with the administrator's authorized module permissions.
3. **Given** repeated failed password attempts occur on `/api/admin/change-password` or login, **When** exceeding 5 failures in 15 minutes, **Then** sliding-window rate limiting blocks further requests (HTTP 429).

---

## Requirements

### Functional Requirements

- **FR-001**: The administrative portal MUST provide a secure self-service password rotation interface at `/admin/settings` (`/api/admin/change-password`). Changing an admin password MUST strictly require verification of the existing current password using timing-safe comparison, enforce a minimum length of 8 characters with alphanumeric complexity, apply sliding-window rate limiting (maximum 5 attempts per 15 minutes), and update the password as a cryptographically salted scrypt hash (`src/lib/core/password.ts`). The API and application loggers MUST NEVER return, log, or serialize plaintext passwords or password hashes in responses or stack traces.
- **FR-002**: The administrative portal MUST provide an administrator governance interface at `/admin/users` (`/api/admin/users`) accessible exclusively to the Root Owner / SuperAdmin. The Root Owner account (associated with `ADMIN_PHONES`, e.g. `09136260072`) MUST be strictly immutable against deletion, suspension, or demotion. Only the Root Owner can create, suspend, or revoke secondary administrator accounts, and executing any admin provisioning action MUST require mandatory re-authentication of the Root Owner's current password to prevent session-hijack escalation.
- **FR-003**: The Root Owner MUST be able to dynamically configure and update scoped operational permissions for each secondary administrator across four granular domain modules: `CATALOG` (products, categories, pricing units), `ORDERS` (order fulfillment, tracking numbers, invoices), `REPAIRS` (technical workshop intake, diagnoses, cost estimates), and `REVIEWS` (customer rating and feedback moderation). Secondary administrators MUST be restricted to their assigned operational domains and their self-service password rotation view, preventing unauthorized lateral privilege escalation.
- **FR-004**: The authentication and session management subsystem MUST implement global session invalidation using an integer `tokenVersion` column on the `User` model. Upon every successful password update or credential revocation, `tokenVersion` MUST be atomically incremented in the database. Active JWT tokens presented by secondary devices, concurrent browsers, or unauthorized clients carrying an outdated `tokenVersion` MUST be rejected immediately (HTTP 401 Unauthorized), terminating all stale sessions worldwide without requiring an external Redis store.
- **FR-005**: When provisioning a new administrator account at `/admin/users` (`/api/admin/users`), the Root Owner MUST provide the full name, normalized Iranian mobile number, authorized domain permissions, and an initial strong password (minimum 8 characters). The platform MUST immediately salt and hash the initial password via `src/lib/core/password.ts`, store it without logging or exposing the plaintext, set `isVerified: true` and `role: "ADMIN"`, and guide the new administrator toward personal credential rotation on their first login.
- **FR-006**: The authentication provider (`src/lib/core/auth.ts`) MUST strictly enforce password-gated authentication for all administrative logins. SMS OTP verification alone MUST NOT grant administrative session privileges (`role: "ADMIN"`), even if the phone number matches an administrator or `ADMIN_PHONES`. Accessing the `/admin` console MUST require successful authentication via Phone and Password, protected by sliding-window rate limiting (maximum 5 failed attempts per 15 minutes), preventing SIM swap and SMS interception attacks from compromising the back office.

---

## Key Entities & Data Schema

- **User**:
  - `id`: CUID identifier
  - `phone`: Normalized Iranian mobile number (`09XXXXXXXXX`, unique)
  - `name`: Administrator full name
  - `password`: Salted scrypt derived key string (`salt:key`), strictly omitted from public JSON projections
  - `role`: `"ADMIN"` | `"CUSTOMER"`
  - `tokenVersion`: Integer counter (default `0`), incremented upon credential rotation or account suspension
  - `adminPermissions`: JSON string array (`["CATALOG", "ORDERS", "REPAIRS", "REVIEWS"]` or `["ALL"]`)
  - `isSuspended`: Boolean toggle (default `false`)
  - `createdAt`, `updatedAt`: Timestamps

---

## Edge Cases

- **Admin Brute-Force & Credential Interception**: Repeated failed password verification attempts on `/api/admin/change-password` or admin management endpoints are throttled after 5 consecutive failures within a 15-minute sliding window per IP and account; API responses return generic error messaging without revealing account existence or hash details.
- **Admin Login via OTP Attempt**: If an administrator's mobile number is used to log in via SMS OTP alone without a password, the resulting session is assigned standard `CUSTOMER` privileges only and cannot access the `/admin` portal; the user is prompted to sign in with their administrator password to unlock administrative permissions.
- **Suspended Admin Active Token Replay**: When an account is suspended (`isSuspended: true`), PostgreSQL atomically increments `tokenVersion: { increment: 1 }`, ensuring that any active JWT held by the suspended administrator is rejected on their very next API call.
- **RTL Password Reveal Button**: In RTL form layouts, the eye toggle icon is positioned at inline-start (`left-3`) with an explicit Persian `aria-label`, preventing visual collision with right-aligned Persian text input.
