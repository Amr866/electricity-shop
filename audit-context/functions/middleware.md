## `middleware` in src/middleware.ts (L4-L91)

**Purpose:** Next.js Edge middleware interceptor. Executes three system-level routing policies: (0) 301 canonical host redirection from `www.` to non-www domains; (1) maintenance mode gating serving 503 Service Unavailable (with Retry-After: 3600) to non-admin visitors; and (2) administrative access boundary protection redirecting or rejecting unauthenticated or non-ADMIN sessions targeting `/admin` and `/api/admin`.

**Inputs & Assumptions:**
- `req.headers.get("host")`: incoming Host header. Trust: **untrusted**.
- `req.nextUrl.pathname`: parsed URL path.
- `req.cookies`: incoming cookie store containing NextAuth JWT session. Trust: **untrusted** (verified cryptographically via `NEXTAUTH_SECRET`).
- Implicit: `process.env.MAINTENANCE_MODE`, `process.env.NEXTAUTH_SECRET`.
- Precondition: Next.js routing config matcher executes this middleware for all non-static paths.

**Outputs & Effects:**
- Returns `NextResponse.redirect` (301 for www normalization; 307/302 for unauthenticated admin access).
- Returns `NextResponse.rewrite` or `NextResponse.json` with 503 status code during maintenance.
- Returns `NextResponse.json({ error: ... }, { status: 403 })` for unauthorized administrative API requests.
- Returns `NextResponse.next()` when request is permitted to proceed.

**Block-by-Block:**

```typescript
// L8-L13
const host = req.headers.get("host") || "";
if (host.startsWith("www.")) {
  const nonWwwHost = host.replace(/^www\./, "");
  const destinationUrl = new URL(pathname + req.nextUrl.search, `${req.nextUrl.protocol}//${nonWwwHost}`);
  return NextResponse.redirect(destinationUrl, 301);
}
```
- **What:** Strips `www.` prefix and issues a permanent 301 redirect to canonical root domain.
- **Why here:** Immediate SEO and domain normalization before evaluating maintenance or auth rules.
- **Assumes:** `req.nextUrl.protocol` matches the public scheme (handled by Edge/Vercel/Nginx reverse proxy).
- **Establishes:** Canonical domain consistency across all inbound routes.
- **Depended on by:** Upstream search crawlers and browser caches.

```typescript
// L16-L64
const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";
if (isMaintenanceMode) {
  const isWhitelisted = ...;
  if (!isWhitelisted) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const isAdmin = token && token.role === "ADMIN";
    if (!isAdmin) {
      if (pathname.startsWith("/api/")) {
        const apiResponse = NextResponse.json({ error: "...", maintenance: true }, { status: 503 });
        apiResponse.headers.set("Retry-After", "3600");
        return apiResponse;
      }
      const maintenanceUrl = new URL("/maintenance", req.url);
      const pageResponse = NextResponse.rewrite(maintenanceUrl, { status: 503 });
      pageResponse.headers.set("Retry-After", "3600");
      return pageResponse;
    }
  }
}
```
- **What:** Halts public traffic during maintenance, serving 503 with Retry-After header, while exempting ADMIN sessions, static assets, and auth endpoints.
- **Why here:** Pre-empts all application execution during maintenance to protect data integrity and avoid serving partial pages.
- **Assumes:** Administrators can authenticate via `/auth/login` to inspect the platform during maintenance.
- **Establishes:** Non-whitelisted endpoints return 503 to non-admin visitors.
- **Depended on by:** Search engine bot preservation (503 prevents de-indexing).

```typescript
// L67-L88
if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "دسترسی غیرمجاز: نیازمند دسترسی مدیریت است." }, { status: 403 });
    }
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
}
```
- **What:** Enforces role-based perimeter access control on administrative page and API routes.
- **Why here:** Coarse-grained perimeter defense preventing unauthenticated access to back-office routes.
- **Assumes:** `token.role === "ADMIN"` is sufficient for initial perimeter entry.
- **Assumes:** Edge runtime does not query the database to verify if `token.tokenVersion` is current or if `dbUser.isSuspended === true`. Established by: `nothing found` at the middleware boundary (deep verification is deferred to `checkAdminSession` in API route handlers).
- **Establishes:** Inbound requests reaching `/admin` or `/api/admin` possess a valid NextAuth JWT with `role: "ADMIN"`.
- **Depended on by:** Downstream page components and API route handlers.

**Cross-Function Dependencies:**
- Callee `getToken` from `next-auth/jwt`: unpacks and verifies JWT signature using `NEXTAUTH_SECRET`.
- Callers: Next.js engine on every HTTP request matching config matcher.
- Shared state: Session cookies.
- Invariant couplings:
  - If `token.role !== "ADMIN"`, request cannot reach `/api/admin/*`.
  - However, if an admin is suspended after JWT issuance, the JWT remains cryptographically valid until expiration; downstream routes must invoke `checkAdminSession()` to reject revoked sessions.

**Open Questions:**
- Unclear; are all administrative API endpoints guaranteed to call `checkAdminSession()`? As noted in our codebase analysis, `src/app/api/admin/upload/route.ts` and `src/app/api/admin/articles/route.ts` implement custom `requireAdmin()` checks that do not verify `tokenVersion` against the database.
- Unclear; what happens if `NEXTAUTH_SECRET` is unset in the environment? `getToken` will fail to decrypt/verify tokens, resulting in `null` and denying all admin access (fail-closed behavior).
