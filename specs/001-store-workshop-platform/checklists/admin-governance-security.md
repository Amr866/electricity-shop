# Multi-Admin Governance & Security Hardening Checklist: Shiasi Store Platform

**Purpose**: Requirements-quality review gate (Unit Tests for Requirements) validating the completeness, clarity, threat-model coverage, and consistency of Phase 19 specifications covering multi-admin governance, dynamic scoped permissions, global session invalidation, and password-gated security.  
**Created**: 2026-09-19  
**Feature**: [spec.md](../spec.md) | [plan.md](../plan.md) | [data-model.md](../data-model.md)  
**Focus**: Strict Security & Threat-Model Gate (Authorization boundaries, timing attacks, session hijacking, brute-force defenses, least privilege)  
**Review Ownership**: Reviewer-owned requirements-quality review artifact. Mark an item `[x]` only when the reviewer confirms that the written requirement meets the quality criterion.  
**Marker Semantics**: `[x]` means the requirement itself is well-written, unambiguous, and covers all relevant failure/threat scenarios. It does NOT mean the code has been implemented.  

---

## 1. Requirement Completeness & Threat Modeling Coverage

- [ ] CHK001 Are requirements explicitly documented for neutralizing SIM-swap and SMS OTP interception attacks against administrative portals? [Coverage, Spec §FR-067]
- [ ] CHK002 Are brute-force defense requirements defined for administrative login, password change, and Root Owner re-authentication endpoints? [Completeness, Spec §FR-062, §FR-067]
- [ ] CHK003 Are credential exposure prevention requirements specified, explicitly forbidding serialization or logging of plaintext passwords and salted hashes across API responses and structured loggers? [Completeness, Spec §FR-062, Constitution §VII]
- [ ] CHK004 Are requirements defined for initial credential provisioning and forced or guided password rotation upon first login for secondary administrators? [Completeness, Spec §FR-066]
- [ ] CHK005 Is the distinction between temporary account suspension (`isSuspended`) and permanent account deletion explicitly defined in requirements? [Completeness, Spec §FR-063, Data Model §User]
- [ ] CHK006 Are threat scenarios addressing concurrent session hijacking and stale token replay after credential changes covered by requirements? [Coverage, Spec §FR-065]
- [ ] CHK007 Are rollback or error handling requirements defined for atomic transactions when provisioning a secondary admin fails halfway through database insertion? [Coverage, Gap]

---

## 2. Requirement Clarity & Cryptographic Specifications

- [ ] CHK008 Is password complexity quantified with exact validation rules (minimum 8 characters, letters and digits) rather than vague "strong password" guidance? [Clarity, Spec §FR-062, §FR-066]
- [ ] CHK009 Is timing-safe comparison (`crypto.timingSafeEqual`) explicitly mandated for password verification to prevent side-channel timing attacks? [Clarity, Spec §FR-062, Research §9]
- [ ] CHK010 Are sliding-window rate-limiting parameters quantified with exact thresholds (maximum 5 failed attempts within a 15-minute sliding window per IP and account)? [Clarity, Spec §FR-062, §FR-067]
- [ ] CHK011 Is the cryptographic hashing algorithm, salt length, and key derivation parameters explicitly specified (`crypto.scryptSync` with 16-byte random salt and 64-byte key)? [Clarity, Spec §FR-062, Plan §Phase 19]
- [ ] CHK012 Are rate limit exhaustion responses quantified with specific HTTP status codes (HTTP 429) and retry countdown semantics (`retryAfterSeconds`)? [Clarity, Contract §admin-password-api.json]
- [ ] CHK013 Is the re-authentication parameter (`rootPassword`) clearly defined in both request schema and error handling for all administrative governance mutations? [Clarity, Contract §admin-users-api.json]

---

## 3. Authorization Boundaries & Least Privilege Consistency

- [ ] CHK014 Are the operational boundaries of the four domain modules (`CATALOG`, `ORDERS`, `REPAIRS`, `REVIEWS`) explicitly itemized with all enclosed routes and API endpoints? [Completeness, Spec §FR-064]
- [ ] CHK015 Are unauthorized access response requirements consistently defined across all administrative API endpoints (HTTP 403 Forbidden with localized Persian guidance)? [Consistency, Spec §FR-064]
- [ ] CHK016 Do requirements consistently enforce Root Owner immutability across all user management operations, forbidding self-deletion, demotion, or suspension? [Consistency, Spec §FR-063]
- [ ] CHK017 Are requirements consistent between UI sidebar navigation rendering and backend API authorization guards for secondary administrators with scoped permissions? [Consistency, Spec §FR-064, Plan §Phase 19]
- [ ] CHK018 Is the inheritance of administrative authority clear regarding whether Root Owner (`ADMIN_PHONES`) requires explicit permission grants or holds universal (`ALL`) access by definition? [Clarity, Spec §FR-063, §FR-064]
- [ ] CHK019 Are requirements defined for what happens when a secondary admin attempts to access `/admin/users` or execute administrative user provisioning? [Coverage, Spec §FR-063]

---

## 4. Session Lifecycle & Global Invalidation Semantics

- [ ] CHK020 Is the `tokenVersion` state transition clearly specified, defining how integer incrementing invalidates active JWT sessions on secondary devices? [Clarity, Spec §FR-065, Data Model §3]
- [ ] CHK021 Does the specification define the distinct handling of the active rotating device (seamless JWT session refresh) versus passive secondary devices (immediate HTTP 401 rejection)? [Clarity, Spec §FR-065, Data Model §3]
- [ ] CHK022 Are requirements unambiguous regarding whether session invalidation triggers on voluntary password rotation, administrative password reset, and account suspension? [Completeness, Spec §FR-065]
- [ ] CHK023 Is client-side handling defined for expired or invalidated sessions (clearing client state and redirecting to `/auth/login` with Persian session-expired notification)? [Coverage, Spec §FR-065, Quickstart §Scenario 9]
- [ ] CHK024 Are requirements defined for NextAuth session callback behavior when `tokenVersion` or permissions are mutated during an active session? [Clarity, Plan §Phase 19]

---

## 5. Acceptance Criteria Measurability & Verification Coverage

- [ ] CHK025 Can the password-gated admin access rule (SMS OTP cannot elevate a session to `ADMIN` under any circumstances) be objectively tested and measured? [Measurability, Spec §FR-067, Success Criteria §SC-007]
- [ ] CHK026 Can the global session termination timeline (immediate rejection upon next authenticated API request) be objectively measured without manual inspection? [Measurability, Spec §FR-065, Quickstart §Scenario 9]
- [ ] CHK027 Can the Root Owner password re-authentication requirement be objectively tested via contract testing with valid vs. invalid credentials? [Measurability, Contract §admin-users-api.json]
- [ ] CHK028 Are error message strings specified in standardized Persian without revealing account existence or administrative privilege details? [Clarity, Edge Cases §Admin Brute-Force]
- [ ] CHK029 Is there an end-to-end integration test scenario verifying secondary admin isolation across both frontend UI and backend API layers? [Coverage, Quickstart §Scenario 10]

---

## 6. Operational Governance, Logging & Constitutional Compliance

- [ ] CHK030 Are logging requirements strictly compliant with Constitution v1.1.0, ensuring HTTP invocations log at `info`, failures at `error`, and internal checks at `debug`? [Consistency, Constitution §VII]
- [ ] CHK031 Does the spec strictly prohibit logging credentials, passwords, hash fragments, or OTP tokens anywhere in application logs or stack traces? [Completeness, Spec §FR-062, Constitution §VII]
- [ ] CHK032 Are audit logging requirements defined for administrative account provisioning, permission updates, and account suspensions? [Coverage, Gap, Constitution §VII]
- [ ] CHK033 Are fallback offline administrative management capabilities preserved (via `scripts/seeds/create-admin.js`) if web portal access is compromised? [Completeness, Spec §Clarifications Session 2026-09-19]

## 7. UI/UX Accessibility, RTL Governance & Verification Seams (UI/UX Pro Max & TDD)

- [ ] CHK034 Are form accessibility requirements specified for password rotation and admin provisioning forms, including visible labels with `htmlFor`, WCAG 2.1 AA 4.5:1 text contrast, and preserved visible focus rings (`focus:ring-2 focus:ring-primary-500`)? [Completeness, Spec §FR-062, §FR-066]
- [ ] CHK035 Are dynamic error announcements specified with `role="alert"` and `aria-live="polite"` for assistive technology and visual feedback? [Coverage, Spec §FR-062]
- [ ] CHK036 Are minimum 44×44px interactive tap targets explicitly mandated for all buttons, checkboxes, and visibility toggles? [Clarity, Spec §FR-062, §FR-066]
- [ ] CHK037 Is the password reveal toggle positioning explicitly specified for RTL layout at inline-start (`left-3`) with localized Persian `aria-label` to prevent visual collision with right-aligned Persian text? [Clarity, Edge Cases §Admin Password Eye Toggle, Spec §FR-062]
- [ ] CHK038 Are phone numbers in administrative user tables explicitly required to be wrapped in `<bdi dir="ltr" className="font-mono">` to prevent bidirectional number inversion in Persian RTL layout? [Clarity, Spec §FR-066]
- [ ] CHK039 Are modal dialogs for provisioning/editing secondary admins specified with focus trapping, `Escape` key dismissal, `role="dialog"`, and `aria-modal="true"`? [Completeness, Spec §FR-066]
- [ ] CHK040 Does the account suspension requirement explicitly specify an atomic `tokenVersion` increment in PostgreSQL to immediately invalidate active JWTs/sessions globally without waiting for token expiry? [Completeness, Spec §FR-063, §FR-065, Edge Cases §Suspended Admin Active Token Replay]
- [ ] CHK041 Is the state management architecture defined without client-side Redux Toolkit (RTK) overhead, relying on Next.js 15 Server Components and route handlers for lean mobile payloads? [Consistency, Spec §Clarifications Session 2026-09-19, Plan §Phase 19]
- [ ] CHK042 Are integration test requirements specified to assert against public HTTP contracts and NextAuth seams (`node:test`) rather than mock-coupling internal scrypt or Prisma drivers? [Consistency, Spec §FR-067, Plan §Phase 19]

---

## Notes

- Mark items `[x]` only after review confirms the requirement-quality criterion is satisfied
- Leave items unchecked when they still require clarification, correction, or reviewer evaluation
- `/speckit-implement` reads checklist checkbox state as a gate and must not modify markers
- `checklists/requirements.md` has a separate built-in lifecycle maintained by `/speckit-specify` and `/speckit-clarify`
- Add comments or findings inline
- Link to relevant resources or documentation
- Items are numbered sequentially for easy reference

