## `authorize` in src/lib/core/auth.ts (L35-L146)

**Purpose:** Primary NextAuth credentials authentication handler. Supports two distinct authentication pathways: (1) Administrative password authentication with scrypt hash verification, root-owner phone check, and suspension rejection; and (2) Customer phone verification via single-use 5-digit SMS OTP token strictly clamped to `CUSTOMER` role to prevent privilege escalation.

**Inputs & Assumptions:**
- `credentials.phone` (string): Iranian phone number. Trust: **untrusted** (client provided).
- `credentials.password` (string | undefined): Password for administrative login. Trust: **untrusted**.
- `credentials.otpCode` (string | undefined): 5-digit verification code. Trust: **untrusted**.
- `credentials.name` (string | undefined): Optional name for new user registration. Trust: **untrusted**.
- Implicit: `ADMIN_PHONES = ["09136260072"]` (root owner whitelist at L7), database tables `User` and `VerificationToken`.
- Precondition: `phone` normalizes to a valid Iranian mobile number (`09...`).
- Precondition: Either `password` or `otpCode` is provided.

**Outputs & Effects:**
- Returns User session object `{ id, name, phone, role, tokenVersion, permissions }` on success, or `null` on failure.
- State write:
  - If admin credentials valid but `adminUser.role !== "ADMIN"`, promotes `role: "ADMIN"` (L63-L68).
  - If OTP valid, immediately deletes `VerificationToken` to guarantee single-use (L103).
  - If OTP user does not exist, creates new `User` record with `role: "CUSTOMER"` (L109-L117).
  - If existing user has missing name or unverified status, updates user record (L118-L132).

**Block-by-Block:**

```typescript
// L36-L40
if (!credentials?.phone) return null;
const phone = normalizeIranianPhone(credentials.phone);
if (!phone) return null;
```
- **What:** Validates and normalizes phone number to standard 11-digit Iranian format (`09xxxxxxxxx`).
- **Why here:** Guarantees uniform database lookups and eliminates format anomalies.
- **Assumes:** `normalizeIranianPhone` converts Persian/Arabic numerals and handles `+98` prefixes.
- **Establishes:** `phone` is a normalized string for subsequent database queries.
- **Depended on by:** Both password and OTP query blocks.

```typescript
// L42-L62
if (credentials.password) {
  const inputPass = credentials.password.trim();
  let adminUser = await prisma.user.findUnique({ where: { phone } });
  if (!adminUser || adminUser.isSuspended) return null;

  const isRootOwner = ADMIN_PHONES.includes(phone);
  const isDbAdmin = adminUser.role === "ADMIN" || isRootOwner;
  if (!isDbAdmin) return null;

  if (!verifyPassword(inputPass, adminUser.password)) return null;
```
- **What:** Authenticates admin credentials using scrypt hash verification, checking account suspension and role.
- **Why here:** Isolates administrative password flow from customer OTP flow.
- **Assumes:** `verifyPassword` uses constant-time comparison (`crypto.timingSafeEqual`) to prevent timing side-channels.
- **Assumes:** Suspended admins (`isSuspended: true`) must be rejected immediately at login.
- **Establishes:** User is an active, unsuspended administrator with matching password hash.
- **Depended on by:** Admin token issuance and permission parsing (L70-L83).

```typescript
// L88-L104
if (credentials.otpCode) {
  const inputCode = toAsciiDigits(credentials.otpCode.trim());
  const validToken = await prisma.verificationToken.findFirst({
    where: { phone, code: inputCode, expiresAt: { gt: new Date() } },
  });
  if (!validToken) return null;
  await prisma.verificationToken.delete({ where: { id: validToken.id } });
```
- **What:** Validates unexpired OTP token for normalized phone number and burns token immediately upon consumption.
- **Why here:** Guarantees single-use semantics and enforces token lifetime.
- **Assumes:** `expiresAt > new Date()` prevents replay of expired codes.
- **Assumes:** Deleting token before user provisioning prevents concurrent replay races.
- **Establishes:** Caller possesses access to the SMS-delivered token for `phone`.
- **Depended on by:** Customer user resolution at L106.

```typescript
// L134-L143
return {
  id: user.id,
  name: user.name || "مشتری گرامی",
  phone: user.phone,
  role: "CUSTOMER" as const,
  tokenVersion: user.tokenVersion,
  permissions: [],
};
```
- **What:** Returns authenticated user payload strictly clamped to `role: "CUSTOMER"` with empty permissions.
- **Why here:** Strict defense against SMS OTP privilege escalation (FR-067). Even if `user.role` in the database was `ADMIN`, logging in via OTP produces a `CUSTOMER` session.
- **Assumes:** Administrative privileges must require password verification, never SMS OTP alone.
- **Establishes:** Invariant that OTP-derived session tokens never hold `ADMIN` privileges.
- **Depended on by:** NextAuth `jwt` and `session` callbacks and downstream middleware role enforcement.

**Cross-Function Dependencies:**
- Callee `verifyPassword`: internal crypto helper in `@/lib/core/password.ts`.
- Callee `prisma.verificationToken.findFirst`, `delete`: database access for OTP tokens.
- Callee `prisma.user.findUnique`, `create`, `update`: database user management.
- Callers: NextAuth route handler (`src/app/api/auth/[...nextauth]/route.ts`).
- Shared state: `VerificationToken` table (written by `src/app/api/auth/otp/send/route.ts`).
- Invariant couplings:
  - Tokens created with 2-minute expiration by `otp/send` must be queried with `expiresAt: { gt: new Date() }`.
  - Admin users with `isSuspended: true` are blocked here on password login.

**Open Questions:**
- Unclear; what happens if an admin logs in via OTP? They receive a `CUSTOMER` session. If they later navigate to `/admin`, `middleware.ts` rejects them because `token.role === "CUSTOMER"`. This is intentional per FR-067, but is there any UI indicator informing the admin to use password login?
- Unclear; is there a maximum failed password attempts counter on the admin password flow to prevent offline brute-force attacks against `authorize`? Established by: `nothing found` (rate limiting exists on `otp/send`, but not directly inside `authorize` for password attempts).
