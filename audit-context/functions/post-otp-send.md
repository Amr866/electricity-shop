## `POST` in src/app/api/auth/otp/send/route.ts (L7-L80)

**Purpose:** Handles customer OTP dispatch requests. Normalizes phone number, enforces dual sliding-window rate limits (per IP and per phone number), generates a cryptographically secure 5-digit numeric token, invalidates prior tokens for the phone, commits token with 2-minute expiration to the database, and returns remaining attempt metadata.

**Inputs & Assumptions:**
- `body.phone` (string): Target mobile number. Trust: **untrusted**.
- `headers["x-forwarded-for"]` / `headers["x-real-ip"]` (string): Client IP. Trust: **semi-trusted** (reverse proxy headers).
- Implicit: `process.env.NODE_ENV`, in-memory `rateLimitStore`, database table `VerificationToken`.
- Precondition: `phone` normalizes to an 11-digit Iranian mobile format (`09\d{9}`).
- Precondition: Request does not exceed IP limit (max 5 requests per 120s) or Phone limit (max 3 requests per 120s).

**Outputs & Effects:**
- Returns JSON `{ success: true, message: "...", remainingAttempts: n, ...(isDev ? { devCode } : {}) }` on 200, 400 on invalid format, 429 on rate limit breach, 500 on server error.
- State write: in-memory `rateLimitStore` increment.
- State write: `prisma.verificationToken.deleteMany({ where: { phone: cleanPhone } })` (L51-L53).
- State write: `prisma.verificationToken.create({ ... })` (L56-L62).

**Block-by-Block:**

```typescript
// L13-L20
const cleanPhone = normalizeIranianPhone(phone);
if (!cleanPhone || !/^09\d{9}$/.test(cleanPhone)) {
  return NextResponse.json(
    { error: "شماره موبایل وارد شده معتبر نمی‌باشد (مثال: 09132456789)" },
    { status: 400 }
  );
}
```
- **What:** Validates regex pattern and converts digits to standard English ASCII.
- **Why here:** Immediate input rejection before consulting rate limit stores or generating cryptographic tokens.
- **Assumes:** All Iranian mobile lines begin with `09` and comprise exactly 11 digits.
- **Establishes:** `cleanPhone` is a sanitized 11-digit string matching `^09\d{9}$`.
- **Depended on by:** Phone rate limiting key at L35 and database token creation at L58.

```typescript
// L23-L44
const ipLimit = checkRateLimit(`ip_otp_${ip}`, 5, 120);
if (!ipLimit.success) {
  return NextResponse.json({ ... }, { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSeconds) } });
}
const phoneLimit = checkRateLimit(`phone_otp_${cleanPhone}`, 3, 120);
if (!phoneLimit.success) {
  return NextResponse.json({ ... }, { status: 429, headers: { "Retry-After": String(phoneLimit.retryAfterSeconds) } });
}
```
- **What:** Applies two tiers of sliding-window rate limiting to throttle IP spamming and target phone harassment.
- **Why here:** Precedes token generation and database writes to mitigate SMS gateway exhaustion and bombing.
- **Assumes:** `checkRateLimit` maintains accurate counters. Established by: in-memory `Map` in `src/lib/core/rateLimit.ts` (isolated per process; not shared in multi-process/serverless environments).
- **Establishes:** Request rate is within authorized thresholds for this worker instance.
- **Depended on by:** Token generation at L47.

```typescript
// L47-L62
const code = crypto.randomInt(10000, 100000).toString();
const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
await prisma.verificationToken.deleteMany({ where: { phone: cleanPhone } });
await prisma.verificationToken.create({
  data: { phone: cleanPhone, code, expiresAt },
});
```
- **What:** Generates an integer in range `[10000, 99999]` using CSPRNG, invalidates old tokens, and saves new token with 2-minute lifetime.
- **Why here:** Replaces older predictable RNG and ensures only one active token exists per phone number.
- **Assumes:** `crypto.randomInt` provides uniform, non-guessable cryptographic entropy.
- **Assumes:** Clock synchronization across API and database is within reasonable bounds (seconds).
- **Establishes:** Exactly one valid `VerificationToken` exists in the database for `cleanPhone`.
- **Depended on by:** `authorize` in `src/lib/core/auth.ts`.

```typescript
// L64-L75
if (process.env.NODE_ENV !== "production") {
  console.log(`📱 [SMS Gateway] OTP code for ${cleanPhone}: ${code}`);
}
const isDev = process.env.NODE_ENV !== "production";
return NextResponse.json({
  success: true,
  message: `کد تایید ۵ رقمی به شماره ${cleanPhone} پیامک شد.`,
  remainingAttempts: phoneLimit.remaining,
  ...(isDev ? { devCode: code } : {}),
});
```
- **What:** Emits dev log and appends `devCode` to JSON response exclusively when not in production.
- **Why here:** Facilitates automated end-to-end testing and offline development without consuming real SMS credits.
- **Assumes:** `process.env.NODE_ENV === "production"` is consistently configured in live production environments.
- **Establishes:** In production, `code` is withheld from the response payload and console logs.
- **Depended on by:** Frontend OTP entry modal.

**Cross-Function Dependencies:**
- Callee `checkRateLimit`: in-memory rate limiter in `@/lib/rateLimit`.
- Callee `prisma.verificationToken.deleteMany`, `create`: database token persistence.
- Callers: Frontend login dialog (`src/components/auth/AuthModal.tsx` or `/auth/login`).
- Shared state: `VerificationToken` table (consumed by `src/lib/core/auth.ts:authorize`).
- Invariant couplings:
  - Token validity window is 120 seconds (`expiresAt = Date.now() + 120000`). `authorize` checks `expiresAt: { gt: new Date() }`.

**Open Questions:**
- Unclear; if `process.env.NODE_ENV` is set to `"staging"` or `"test"` in a public test environment, `isDev` evaluates to `true` and exposes `devCode` in the public API response. Is there an explicit whitelist for dev mode?
- Unclear; how does production SMS delivery execute? Currently there is no upstream SMS gateway call (e.g. Kavenegar HTTP API) in this route handler; it only logs when non-production. Is the real SMS dispatch planned for an external worker or integration hook?
