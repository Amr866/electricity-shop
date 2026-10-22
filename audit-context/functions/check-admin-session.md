## `checkAdminSession` in src/lib/core/adminAuth.ts (L63-L147)

**Purpose:** Comprehensive administrative session and authorization validator. Unpacks session from NextAuth, queries the live PostgreSQL database for account suspension (`isSuspended`) and session revocation (`tokenVersion`), checks root ownership (`ADMIN_PHONES`), and verifies fine-grained administrative module permissions (`requiredModule`).

**Inputs & Assumptions:**
- `requiredModule` (optional string): Specific administrative privilege needed (`"PRODUCTS"`, `"ORDERS"`, `"REPAIRS"`, `"BOMS"`, `"USERS"`, `"SETTINGS"`).
- Implicit: `getServerSession(authOptions)` to obtain caller's JWT, database table `User`, constant `ADMIN_PHONES = ["09136260072"]`.
- Preconditions:
  - Session exists and `session.user.role === "ADMIN"`.
  - Database user exists, has `role === "ADMIN"`, and `isSuspended !== true`.
  - Database user's `tokenVersion` matches the JWT's `tokenVersion`.

**Outputs & Effects:**
- Returns `CheckAdminSessionSuccess` (`{ isAdmin: true, isRootOwner: boolean, session, dbUser }`) on success.
- Returns `CheckAdminSessionFailure` (`{ isAdmin: false, isRootOwner: false, session: null, dbUser: null, response: NextResponse }`) with status 401 or 403 on failure.
- Database read: `prisma.user.findUnique({ where: { id: session.user.id } })`.

**Block-by-Block:**

```typescript
// L64-L77
const session = await getServerSession(authOptions);
if (!session?.user || session.user.role !== "ADMIN") {
  return {
    isAdmin: false,
    isRootOwner: false,
    session: null,
    dbUser: null,
    response: NextResponse.json({ error: "دسترسی غیرمجاز. ورود با حساب مدیریت الزامی است." }, { status: 401 }),
  };
}
```
- **What:** Validates presence of an active NextAuth session asserting `role: "ADMIN"`.
- **Why here:** Immediate rejection of unauthenticated callers or customer-level sessions.
- **Assumes:** NextAuth session cookie is cryptographically signed and untampered.
- **Establishes:** Session is valid and claims role `ADMIN`.
- **Depended on by:** Live database lookup below.

```typescript
// L79-L104
const dbUser = await prisma.user.findUnique({
  where: { id: session.user.id },
  select: { id: true, name: true, phone: true, role: true, tokenVersion: true, isSuspended: true, adminPermissions: true },
});
if (!dbUser || dbUser.role !== "ADMIN" || dbUser.isSuspended) {
  return {
    isAdmin: false,
    isRootOwner: false,
    session: null,
    dbUser: null,
    response: NextResponse.json({ error: "حساب کاربری معلق یا دسترسی نامعتبر است." }, { status: 401 }),
  };
}
```
- **What:** Fetches current user state directly from PostgreSQL and checks for account suspension or role demotion.
- **Why here:** Protects against revoked or suspended admins who still hold unexpired JWT session cookies.
- **Assumes:** Database reflects the authoritative ground truth of user account status.
- **Establishes:** User currently exists in DB, has role `ADMIN`, and is not suspended.
- **Depended on by:** Token version validation at L106.

```typescript
// L106-L118
const sessionTokenVersion = session.user.tokenVersion ?? 0;
if (dbUser.tokenVersion !== sessionTokenVersion) {
  return {
    isAdmin: false,
    isRootOwner: false,
    session: null,
    dbUser: null,
    response: NextResponse.json({ error: "نشست شما منقضی شده است. لطفا مجددا وارد شوید." }, { status: 401 }),
  };
}
```
- **What:** Compares JWT `tokenVersion` against PostgreSQL `tokenVersion`; rejects session if versions mismatch.
- **Why here:** Instantaneous global session revocation upon password change, suspension, or manual session invalidation (FR-062, FR-065).
- **Assumes:** Any administrative state change that invalidates sessions increments `user.tokenVersion` in PostgreSQL.
- **Establishes:** Session was issued after the most recent password reset or suspension event.
- **Depended on by:** Permission evaluation below.

```typescript
// L120-L144
const isRootOwner = ADMIN_PHONES.includes(dbUser.phone);
if (isRootOwner) {
  return { isAdmin: true, isRootOwner: true, session, dbUser };
}
if (requiredModule) {
  const permissions = parseAdminPermissions(dbUser.adminPermissions);
  const hasAccess = permissions.includes("ALL") || permissions.includes(requiredModule);
  if (!hasAccess) {
    return {
      isAdmin: false,
      isRootOwner: false,
      session: null,
      dbUser: null,
      response: NextResponse.json({ error: `دسترسی به بخش «${requiredModule}» مجاز نمی‌باشد.` }, { status: 403 }),
    };
  }
}
return { isAdmin: true, isRootOwner: false, session, dbUser };
```
- **What:** Grants bypass to root owner phone and evaluates granular permissions for secondary admin users.
- **Why here:** Implements scoped least-privilege administrative access (FR-064).
- **Assumes:** Root owner phone number (`09136260072`) is hardcoded and unalterable via database mutation.
- **Establishes:** Admin possesses the specific permission required to execute the target endpoint.
- **Depended on by:** Route mutation logic in callers.

**Cross-Function Dependencies:**
- Callee `getServerSession` from `next-auth`.
- Callee `prisma.user.findUnique`.
- Callee `parseAdminPermissions`: helper in `@/lib/core/auth`.
- Callers: Used across 16 administrative route handlers (`backup`, `boms`, `categories`, `change-password`, `coupons`, `orders`, `products`, `repairs`, `reviews`, `users`).
- Shared state: `User` table.
- Invariant couplings:
  - When an admin changes password in `src/app/api/admin/change-password/route.ts`, `tokenVersion` is incremented, immediately causing this function to return 401 for all existing sessions.

**Open Questions:**
- Contrast: Why do `src/app/api/admin/upload/route.ts` and `src/app/api/admin/articles/route.ts` not call `checkAdminSession`? Both routes implement private `requireAdmin()` checks that read only the unexpired JWT role without querying `tokenVersion` or `isSuspended` in PostgreSQL.
