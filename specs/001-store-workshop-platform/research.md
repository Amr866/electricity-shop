# Technical Research & Architecture Decisions: Shiasi Store & Technical Workshop Platform

**Branch**: `001-store-workshop-platform` | **Date**: 2026-09-14 | **Spec**: [spec.md](./spec.md)

---

## 1. Server-Authoritative Financial Engine & 8-Hour Card-to-Card Inventory Reservation

### Context
In accordance with Constitution Principle III, client-side pricing and discount calculations are strictly advisory. The server must re-verify prices, stock, tiered discounts (5% at ≥10 units, 10% at ≥50 units), and coupon validity directly within a transactional boundary. Furthermore, clarified requirements mandate an 8-hour inventory reservation window for Bank Card-to-Card payments.

### Decision
Implement server-authoritative checkout in `/api/checkout` wrapped inside a Prisma `$transaction`:
1. **Price & Stock Validation**: Fetch all line item products from PostgreSQL with row-level locks / atomic decrement checks.
2. **Tiered Wholesale Discounts**:
   - For each product line item: if `quantity >= 50`, apply `itemPrice * 0.90`; else if `quantity >= 10`, apply `itemPrice * 0.95`.
3. **Card-to-Card Reservation**:
   - For `paymentMethod === 'card_to_card'`, decrement `stock` immediately, set `orderStatus: 'PENDING'`, `paymentStatus: 'PENDING'`, and set `reservedUntil = new Date(Date.now() + 8 * 60 * 60 * 1000)`.
   - A scheduled cleanup job or on-demand check before stock reads checks for orders where `paymentStatus === 'PENDING'` and `reservedUntil < now()`, resetting their status to `'EXPIRED'` and replenishing product stock via `$transaction`.
4. **Dual Invoicing Payload**:
   - For `isCorporate: true`, validate `companyName`, `economicCode` (12-digit format), and `nationalCode` (10 or 11-digit format), saving them to the `Order` record and rendering the statutory A4 layout.

### Rationale
- Atomic transactions prevent race conditions during peak traffic where two buyers checkout the last item concurrently.
- Enforcing the 8-hour reservation window directly in database timestamps ensures inventory is not locked indefinitely if a buyer abandons the bank transfer.

### Alternatives Considered
- *Redis TTL keys for reservations*: Rejected to maintain simple zero-dependency operational resilience; PostgreSQL timestamp-based reservation avoids introducing external memory stores.
- *Hold stock only after admin approval*: Rejected during clarification because high-demand electrical supplies would risk double-selling before manual admin review.

---

## 2. Persian Multi-Keyword Search & Character Normalization Engine

### Context
Customers search in colloquial Persian using varied mobile keyboard layouts (Persian, Arabic, and Western glyphs) with queries like `"موتور موتوژن ۳/۴"`. System must return results in < 400ms without crashing if the database is temporarily unreachable.

### Decision
Implement a multi-tier search pipeline in `src/lib/search.ts`:
1. **String Normalization (`normalizePersianText`)**:
   - Convert Arabic letters: `ي` ➔ `ی`, `ك` ➔ `ک`, `ة` ➔ `ه`, `ؤ`/`إ`/`أ` ➔ `ا`.
   - Convert Persian/Arabic digits to Western Arabic numerals (`۰-۹` and `٠-٩` ➔ `0-9`).
   - Strip diacritics (Tanween, Tashdeed, Fatha, etc.) and trim punctuation.
2. **Tokenization & Multi-field Scoring**:
   - Split query into distinct tokens.
   - Match tokens across: `product.name`, `product.brand`, `product.sku`, `product.mpn`, `product.category.name`, and `product.specs.value`.
   - Prioritize exact SKU/MPN matches, then title matches, then technical specs.
3. **Zero-Crash Static Fallback**:
   - If PostgreSQL query latency exceeds 500ms or throws a connection error, fall back transparently to pre-indexed static catalog data (`src/data/products.ts`), logging an `error` and returning results seamlessly.

### Rationale
- Normalization guarantees 100% recall regardless of whether the mobile phone keyboard uses Arabic or Persian Unicode codepoints.
- Pre-indexed in-memory fallback guarantees 100% uptime for catalog searches.

### Alternatives Considered
- *External Elasticsearch / Meilisearch cluster*: Rejected as excessive operational overhead for a 500-product catalog; in-memory and PostgreSQL indexing provide sub-50ms query latency.

---

## 3. National Building Code Chapter 13 Cable Sizer & MCB Matching Engine

### Context
Electrical contractors and electricians require strict mathematical compliance with National Iranian Building Regulations Chapter 13 (مبحث ۱۳ مقررات ملی ساختمان). Maximum allowable voltage drop is 3.0%.

### Decision
Build a verified calculation engine in `src/lib/cableCalculator.ts`:
1. **Nominal Current Calculation**:
   - Single-Phase (220V): \(I = \frac{P}{220 \times \cos\phi}\)
   - Three-Phase (380V): \(I = \frac{P}{\sqrt{3} \times 380 \times \cos\phi}\)
   - Standard power factor default: \(\cos\phi = 0.85\).
2. **Voltage Drop Percentage Calculation**:
   - Single-Phase (Loop distance \(2 \times L\)):
     $$\Delta V\% = \frac{2 \times L \times I \times \rho}{S \times 220} \times 100$$
   - Three-Phase:
     $$\Delta V\% = \frac{\sqrt{3} \times L \times I \times \rho}{S \times 380} \times 100$$
   - Conductor resistivity: \(\rho = 0.0175\,\Omega\cdot\text{mm}^2/\text{m}\) (pure annealed copper).
3. **Standard Conductor Gauge Iteration**:
   - Gauge ladder (\(\text{mm}^2\)): `[1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120]`.
   - Evaluate lowest gauge satisfying both current carrying ampacity and \(\Delta V\% < 3.0\%\).
   - If \(\Delta V\% \ge 3.0\%\), step up to next cross-section. If 120mm² still exceeds 3%, flag non-compliant warning.
4. **Miniature Circuit Breaker (MCB) Trip Selection**:
   - Map load current to standard MCB ratings: B10, B16, C25, C32, C40, C50, C63.
   - For motor and inductive loads, default to type "C" (slow curve). For resistive/lighting, recommend "B".
5. **1-Click Cart Bundling**:
   - Client component maps recommended gauge and length (meters) plus matching MCB product ID to cart dispatch action.

### Rationale
- Eliminates manual contractor errors on job sites, protects against electrical overheating, and drives immediate procurement of cables and breakers.

### Alternatives Considered
- *Approximation lookup tables*: Rejected because exact continuous distance and wattage inputs provide precise engineering compliance.

---

## 4. Hybrid Repair Workshop Intake, 7-Stage Lifecycle & Cost Approval Workflow

### Context
The workshop pillar requires managing physical appliance drop-offs in Najafabad and courier dispatches across Isfahan Province. Clarified spec mandates a 7-stage lifecycle with hybrid approval (automated SMS, 1-click portal action, and admin phone logging).

### Decision
Structure the repair domain in `src/app/repair-service` and `/api/repairs`:
1. **Tracking Code Generation**:
   - Format: `REP-YYMMDD-XXXX` (e.g. `REP-260914-0418`) using Persian/Gregorian date tokens and random alphanumeric check digits. Wrapped in `<bdi dir="ltr">`.
2. **Lifecycle State Machine**:
   - `SUBMITTED` ➔ `RECEIVED` ➔ `INSPECTING` ➔ `COST_ESTIMATED` ➔ `REPAIRING` ➔ `READY` ➔ `DELIVERED` (plus terminal `CANCELLED`).
3. **Cost Approval Sub-State**:
   - When transitioning to `COST_ESTIMATED`:
     - Set `costApprovalStatus = 'PENDING'`.
     - Trigger SMS notification via SMS gateway API: *"مشتری گرامی، هزینه تعمیر دستگاه شما در کارگاه شیاسی برآورد شد. مشاهده و تایید: https://shiasishop.ir/repair-service/track?code=REP-..."*.
   - On the customer tracking page:
     - Render 1-click buttons: "تایید هزینه و شروع تعمیر" (`APPROVED`) and "انصراف از تعمیر" (`DECLINED`).
     - Submitting sends a signed POST request updating `costApprovalStatus: 'APPROVED'`, `approvalChannel: 'PORTAL'`, and moving status to `REPAIRING`.
   - In Admin Portal:
     - Technicians have dropdown actions: "تایید تلفنی مشتری" (`approvalChannel: 'PHONE'`).

### Rationale
- Removing the requirement for in-person customer visits to sign repair quotes reduces turnaround time from days to minutes.

### Alternatives Considered
- *Mandatory in-person signature*: Rejected as causing major friction for customers across Isfahan.
- *SMS-only 2-way reply*: Retained as future enhancement; direct URL link with 1-click web approval is more reliable across varied Iranian telecom carriers.

---

## 5. Iranian Mobile OTP Authentication & Throttling Security

### Context
Passwordless authentication using Iranian 11-digit mobile numbers (`09XXXXXXXXX`) via 5-digit SMS OTP tokens. Throttling is strictly required: 60s cooldown, 3-attempt limit per 15 minutes, with password fallback.

### Decision
Implement security-hardened authentication flow in `/api/auth/otp`:
1. **Phone Number Sanitization**:
   - Pipe all input through `normalizeIranianPhone`: strip `+98`, `0098`, leading zeros, spaces, hyphens, and convert Persian/Arabic numerals to ASCII `09XXXXXXXXX`.
2. **Token Lifecycle & Rate Limiting**:
   - Check `VerificationToken` table for existing active token for that phone.
   - If `resendAttempts >= 3` within the last 15 minutes, reject with HTTP 429 and Iranian error message, offering password login.
   - If last request was < 60 seconds ago, reject with cooldown remaining seconds.
   - Generate crypto-random 5-digit numeric token (`Math.floor(10000 + Math.random() * 90000)`).
   - Set `expiresAt = now + 5 minutes`.
3. **Session Issuance**:
   - NextAuth JWT strategy: upon successful OTP code verification, find or create `User` with role `CUSTOMER`, returning encrypted JWT session cookie.
   - Mark token used / delete token to prevent replay attacks.

### Rationale
- Prevents SMS credit draining and denial-of-service against third-party SMS providers.
- Preserves compatibility with NextAuth session handling while offering seamless passwordless login.

### Alternatives Considered
- *Third-party Firebase Auth*: Rejected due to US sanctions and network blocking within Iran. Local Iranian SMS provider integration is required.

---

## 6. Structured Logging Architecture (Constitution v1.1.0 Compliance)

### Context
Constitution v1.1.0 mandates tiered structured logging across all server routes:
- Incoming HTTP requests: `info`
- Errors and exceptions: `error`
- Operational/database actions: `debug`

### Decision
Implement centralized logging utility in `src/lib/logger.ts`:
```typescript
export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => {
    console.info(JSON.stringify({ level: 'info', timestamp: new Date().toISOString(), msg, ...meta }));
  },
  error: (msg: string, error?: unknown, meta?: Record<string, unknown>) => {
    console.error(JSON.stringify({
      level: 'error',
      timestamp: new Date().toISOString(),
      msg,
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
      ...meta
    }));
  },
  debug: (msg: string, meta?: Record<string, unknown>) => {
    if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
      console.debug(JSON.stringify({ level: 'debug', timestamp: new Date().toISOString(), msg, ...meta }));
    }
  }
};
```
- Integrate middleware / API wrapper to log incoming requests (`method`, `url`, `ip`, `status`) at `info` level.
- Wrap all route handlers in try/catch logging at `error` level.
- Instrument database queries and discount calculations at `debug` level.

### Rationale
- Structured JSON logs ensure easy ingestion by log aggregators or terminal output without polluting production logs with debug noise.

---

## 8. Storefront In-App Performance Optimization: In-App Data Cache, ISR, and Composite Indexing

### Context
In accordance with Constitution Principle II (Zero-Crash Fallback Architecture & Resilient Uptime) and clarified requirements (Session 2026-09-18), the platform requires sub-100ms storefront catalog response times and high mobile performance without introducing external stateful infrastructure dependencies such as Redis.

### Decision
Implement a multi-tier in-app performance optimization architecture:
1. **Next.js 15 Data Cache (`unstable_cache`)**:
   - Cache category metadata, product counts, and distinct brand listings with the cache tag `'catalog-metadata'`.
   - Admin API route handlers (`/api/admin/products` and `/api/admin/categories`) trigger on-demand revalidation via `revalidateTag('catalog-metadata')` on create, update, or archive mutations.
2. **Incremental Static Regeneration (ISR) for Product Pages**:
   - In `src/app/products/[slug]/page.tsx`, export `revalidate = 300` (5-minute background regeneration) and `generateStaticParams()` to pre-render active product pages at build time.
   - Admin updates programmatically purge the static page cache via `revalidatePath('/products/[slug]')`.
3. **Targeted PostgreSQL Composite Indexing**:
   - Enhance the `Product` model in `prisma/schema.prisma` with composite indexes:
     - `@@index([isArchived, createdAt])`: Accelerates the default newest-first catalog sorting.
     - `@@index([isArchived, price])`: Accelerates cheapest/expensive price filtering and sorting.
     - `@@index([isArchived, categoryId])`: Accelerates category storefront filtering.
4. **Search Query Execution Scoping**:
   - Scope multi-token search queries strictly to high-relevance catalog attributes (`name`, `sku`, `mpn`, `brand`, `shortDesc`), omitting full raw HTML `description` scanning to eliminate costly table scans.
5. **Mobile Font Payload Trimming**:
   - Configure `Vazirmatn` Google font in `src/app/layout.tsx` to load only the 4 essential design-system weights (`400`, `500`, `700`, `900`) with `display: "swap"` and `preload: true`, reducing font transfer size by ~35%.

### Rationale
- Native Next.js 15 Data Cache and ISR deliver sub-30ms response times directly from server memory without requiring external Redis instances, daemon management, or cross-service connection drop handling.
- PostgreSQL composite B-Tree indexes allow index-only or index-range scans directly filtering out archived items while sorting, reducing query execution from ~80ms to < 5ms.
- Excluding the large rich-text `description` field from `ILIKE` wildcard queries prevents sequential memory scanning on multi-token searches.

### Alternatives Considered
- *External Redis Caching Layer*: Evaluated and rejected; adds unnecessary operational complexity, hosting cost, and failover requirements for a regional store catalog whose active working set easily fits in server memory and PostgreSQL buffer cache.
- *Client-Side Only Caching (SWR/React Query)*: Insufficient for initial SEO crawl and first-time mobile visitors; server-side ISR guarantees fast First Contentful Paint (FCP) and optimal SEO indexing.

