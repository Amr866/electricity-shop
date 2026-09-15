# Quickstart & Verification Guide: Shiasi Store & Technical Workshop Platform

**Branch**: `001-store-workshop-platform` | **Date**: 2026-09-14 | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

This guide details the step-by-step verification procedures to validate the complete platform end-to-end across all 9 core feature dimensions.

---

## 1. Prerequisites & Environment Setup

### Environment Requirements
- **Node.js**: `v20.x` or higher
- **PostgreSQL**: `v16.x` database running with connection string in `.env` (`DATABASE_URL`)
- **Package Manager**: `npm`

### Setup Commands
```bash
# 1. Install dependencies
npm install

# 2. Synchronize Prisma Schema and generate types
npx prisma generate
npx prisma db push

# 3. Seed initial categories, sample products, price lists, and admin accounts
node prisma/seed.js

# 4. Start Next.js development server
npm run dev
```
The application will launch at `http://localhost:3000`.

---

## 2. Verification Scenarios

### Scenario 1: Multi-Keyword Persian Search & Normalization (`FEAT-CATALOG`)
1. Open `http://localhost:3000`.
2. Press the `/` shortcut key on your keyboard.
   - *Expected*: The global search input in the header immediately gains focus.
3. Type `"موتور موتوژن ۳/۴"` or with Arabic letters `"موتور موتوژن 3/4"`.
   - *Expected*: Results filter instantly in under 400ms without page reload. Normalization matches Motogen 3/4 HP cooler motor regardless of Arabic/Persian letterforms.
4. Click on the product card to navigate to `/products/motogen-cooler-motor-3-4`.
   - *Expected*: Technical specifications table loads (220V, pure copper winding, warranty badge).

---

### Scenario 2: Dynamic Cart, Tiered Discounts & Dual Tax Invoicing (`FEAT-CHECKOUT`)
1. On the product page, set quantity to `12` and click "افزودن به سبد خرید" (Add to Cart).
2. Open `/cart`.
   - *Expected*: An automatic **5% tiered wholesale discount** is deducted from the subtotal.
3. Update quantity to `50`.
   - *Expected*: The line item discount updates to an automatic **10% volume discount**.
4. Proceed to `/checkout`.
5. Select "صدور فاکتور رسمی حقوقی" (Official Corporate Tax Invoice).
   - *Expected*: Mandatory fields for Company Name, National ID, and Economic Code appear.
6. Select payment method "کارت به کارت" (Bank Card-to-Card) and submit order.
   - *Expected*: Server-side validation calculates the exact total, generates order code `SH-YYMMDD-XXX`, and sets the 8-hour inventory reservation window (`reservedUntil = now + 8 hours`).

---

### Scenario 3: Chapter 13 Cable Sizer & MCB Matching (`FEAT-CABLE-CALC`)
1. Navigate to `/` and scroll to the Cable Calculator section (`#calculator`).
2. Input:
   - Load: `5 kW` (5000 Watts)
   - Distance: `45 meters`
   - Phase: `Single-Phase (220V)`
   - Power Factor: `0.85`
3. Click "محاسبه سطح مقطع سیم" (Calculate).
   - *Expected*:
     - Nominal Current: \(\approx 26.7\,\text{A}\)
     - Recommended Wire Gauge: \(6\,\text{mm}^2\) Pure Copper Conductor
     - Voltage Drop: \(1.8\%\) (< 3.0% threshold per National Building Code Chapter 13)
     - Recommended Miniature Circuit Breaker: `C32`
4. Click "افزودن سیم و فیوز به سبد خرید" (Bundle to Cart).
   - *Expected*: 45 meters of 6mm² copper cable and 1 C32 breaker are bundled into the cart.

---

### Scenario 4: Technical Repair Workshop Intake & Cost Approval (`FEAT-REPAIR`)
1. Open `/repair-service` and complete the intake form:
   - Appliance Type: `کولر آبی` (Cooler Motor)
   - Brand & Model: `موتوژن ۱/۲`
   - Issue: `سوختگی سیم‌پیچ و صدای بلبرینگ`
   - Delivery: `in_person`
2. Click "ثبت درخواست تعمیر".
   - *Expected*: Unique tracking code generated: `REP-YYMMDD-XXXX` (e.g. `REP-260914-0418`) with Najafabad workshop drop-off address.
3. Open `/repair-service/track?code=REP-YYMMDD-XXXX`.
   - *Expected*: Visual 7-stage timeline rendered showing `SUBMITTED`.
4. As an Admin in `/admin/repairs`, update status to `COST_ESTIMATED` with estimate `850000 Toman`.
5. Refresh the customer tracking page.
   - *Expected*: Customer sees estimated cost, and 1-click action buttons "تایید هزینه و شروع تعمیر" (Approve) and "انصراف از تعمیر" (Decline) appear.
6. Click "تایید هزینه".
   - *Expected*: Ticket transitions to `REPAIRING` with approval logged.

---

### Scenario 5: Iranian Mobile OTP Authentication & Throttling (`FEAT-AUTH-ACC`)
1. Open `/auth/login`.
2. Enter mobile number with Persian numerals: `۰۹۱۳۲۴۵۶۷۸۹`.
3. Click "ارسال کد تایید".
   - *Expected*: Number normalized to `09132456789`, 5-digit OTP issued, and a 60-second cooldown countdown starts.
4. Attempt to click resend before 60 seconds expire.
   - *Expected*: Button is disabled with countdown timer.
5. If 3 resends are requested within 15 minutes:
   - *Expected*: HTTP 429 response displayed with prompt to log in via password alternative.
6. Enter valid 5-digit code and submit.
   - *Expected*: Successfully logged in, redirected to `/account` showing order and repair history.

---

### Scenario 6: Editorial Authoring Studio & Live Preview (`FEAT-KNOWLEDGE`)
1. Log into `/admin/articles` as an administrator.
2. Click "مقاله جدید" (New Article).
3. Enter Title: `"راهنمای جامع روغن‌کاری و سرویس موتور کولر موتوژن"`.
4. Click "تولید از عنوان".
   - *Expected*: Generates Persian URL slug: `rahenmaye-service-motor-cooler-motogen`.
5. Insert markdown callouts (`[!TIP]` and `[!WARNING]`).
6. Click "پیش‌نمایش زنده".
   - *Expected*: Side-by-side public layout preview renders with styled alert boxes and tables.
7. Click "انتشار مقاله".
   - *Expected*: Article publishes with valid JSON-LD `BlogPosting` schema.

---

### Scenario 7: Admin Dashboard & Database Backup (`FEAT-ADMIN-OPS`)
1. Open `/admin`.
   - *Expected*: Dashboard displays Total Gross Revenue, Paid Orders Count, Low-Stock Count (≤ 5 units), and Active Repairs.
2. Open `/admin/backup`.
3. Click "دانلود پشتیبان دیتابیس".
   - *Expected*: Secure backup dump generated and downloaded in under 5 seconds.

---

## 3. Quality & Regression Verification

Run the automated verification suite:
```bash
# Verify zero TypeScript compilation errors
npx tsc --noEmit

# Verify full production build of all routes
npm run build
```
Both commands must exit with code `0`.
