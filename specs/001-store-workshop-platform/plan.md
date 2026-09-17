# Implementation Plan: Shiasi Store & Technical Workshop Platform

**Branch**: `001-store-workshop-platform` | **Date**: 2026-09-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from [`/specs/001-store-workshop-platform/spec.md`](./spec.md)

---

## Summary

The Shiasi Store & Technical Workshop Platform unifies retail/wholesale electrical e-commerce, technical repair workshop management, and industrial electrical engineering calculations into a cohesive, zero-crash web application.

The technical architecture leverages **Next.js 15 App Router** with **React 19 Server Components**, **PostgreSQL 16** managed via **Prisma ORM (v6.19.3)**, **Tailwind CSS RTL**, and **NextAuth.js 4**. Core systems enforce server-authoritative pricing (5% wholesale discount at ≥10 units, 10% at ≥50 units), an 8-hour inventory reservation window for Bank Card-to-Card payments, Iranian National Building Regulations Chapter 13 cable sizing (<3% voltage drop), a 7-stage repair lifecycle with hybrid SMS and 1-click web cost approvals, Persian numeral normalization, and Constitution v1.1.0-compliant structured logging.

---

## Technical Context

**Language/Version**: TypeScript 5.7.2, Node.js v20+ / v22+  
**Primary Dependencies**: Next.js 15.1.0, React 19.0.0, Tailwind CSS 3.4.16, Prisma ORM 6.19.3, NextAuth.js 4.24.15, Lucide React 1.38.0, Sharp 0.35.4  
**Storage**: PostgreSQL 16 with connection pooling (`pool_limit=10`), managed via Prisma ORM  
**Testing**: Static type checking (`tsc --noEmit`), Next.js production route compilation (`next build`), contract validation  
**Target Platform**: Node.js runtime, modern desktop and mobile browsers (iOS Safari, Android Chrome, Windows/Mac desktop)  
**Project Type**: Full-Stack Web Application (Next.js 15 App Router with hybrid RSC and Client Components)  
**Performance Goals**: Catalog search queries < 400ms; repair tracking queries < 500ms; checkout completion < 90s; database backup export < 5s; 100% Lighthouse SEO audit compliance  
**Constraints**: Zero-crash static fallbacks (`src/data/`) for critical routes; Persian RTL layout with Vazirmatn font; explicit bidirectional isolation (`<bdi dir="ltr">`); National Building Code Chapter 13 (\(\Delta V\% < 3.0\%\)); Constitution v1.1.0 tiered logging  
**Scale/Scope**: 9 core platform feature domains, 55 application routes, dual B2C/B2B invoicing, single-store multi-channel operations  

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Gate | Status | Architectural Verification |
|---|:---:|---|
| **I. Triple-Function Local Ecosystem** | **PASS** | Physical address (Central 15 Khordad, Najafabad), coordinates (`32.6365457, 51.3551911`), landlines (`03142626116`), and workshop identity are baked into metadata, headers, footers, and repair workflows. |
| **II. Zero-Crash Fallback Architecture** | **PASS** | Catalog, price lists, and blog implement static fallback arrays in `src/data/` if database latency exceeds thresholds or connection fails. |
| **III. Server-Authoritative Financials & Dual Invoicing** | **PASS** | `/api/checkout` validates all pricing inside a Prisma `$transaction`, applying 5% discount at 10+ units, 10% at 50+ units, enforcing 8-hour Card-to-Card reservation, and generating A4 tax invoices. |
| **IV. Persian RTL Localization & Input Sanitization** | **PASS** | Vazirmatn font with tabular numbers; `<bdi dir="ltr">` for all tracking codes, numbers, and coordinates; `normalizeIranianPhone` sanitizes Persian/Arabic digits. |
| **V. National Building Code Chapter 13** | **PASS** | `CableCalculator` strictly enforces \(\Delta V\% < 3.0\%\) with pure copper resistivity \(\rho = 0.0175\), maps to standard MCB curves (B/C), and provides 1-click cart bundling. |
| **VI. Technology Stack Standards** | **PASS** | Verified stack: Next.js 15, React 19, Tailwind CSS 3.4, Prisma 6.19.3, NextAuth 4, PostgreSQL 16. |
| **VII. Structured Logging (Constitution v1.1.0)** | **PASS** | `logger.ts` enforces `info` for incoming HTTP requests, `error` for unhandled exceptions and query failures, and `debug` for internal actions. |
| **VIII. Quality Gates & Governance** | **PASS** | Zero TypeScript compilation errors (`tsc --noEmit`), full `next build` route compilation, Prisma schema synchronization, executive admin dashboard, and database backup dump. |

---

## Project Structure

### Documentation (this feature)

```text
specs/001-store-workshop-platform/
├── spec.md              # Feature specification (refined and clarified)
├── plan.md              # Implementation plan (this file)
├── research.md          # Technical decisions & architecture research
├── data-model.md        # Complete entity schemas and state transitions
├── quickstart.md        # End-to-end runnable verification guide
├── checklists/
│   └── requirements.md  # Specification quality checklist
└── contracts/           # Interface and API contracts
    ├── checkout-api.json
    ├── repairs-api.json
    ├── auth-otp-api.json
    └── cable-calc-contract.json
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx                # Root layout with Vazirmatn font and RTL configuration
│   ├── page.tsx                  # Storefront home, hero, featured products, cable sizer
│   ├── account/                  # Customer account portal (orders, repairs, profile)
│   ├── admin/                    # Administrative dashboard, inventory, repairs, backups, articles
│   │   ├── backup/               # Database backup export page
│   │   ├── articles/             # Editorial Markdown authoring studio with live preview
│   │   ├── orders/               # Order management and printable A4 tax invoices
│   │   ├── products/             # Catalog CRUD and technical specs editor
│   │   └── repairs/              # Workshop ticket dispatch and cost logging
│   ├── api/                      # Server-side route handlers
│   │   ├── auth/otp/             # Iranian phone normalization, cooldown, and verification
│   │   ├── checkout/             # Server-authoritative checkout & Card-to-Card 8h reservation
│   │   ├── repairs/              # Repair ticket intake, tracking, and 1-click approval
│   │   ├── search/               # Multi-keyword Persian search API
│   │   └── admin/backup/         # Single-click database snapshot export API
│   ├── blog/                     # SEO educational knowledge base
│   ├── bom-upload/               # Contractor bill of materials inquiry portal
│   ├── cart/                     # Dynamic cart with tiered wholesale discount display
│   ├── checkout/                 # B2C / B2B dual invoicing checkout flow
│   ├── price-lists/              # Official factory price lists hub
│   ├── products/                 # Catalog browsing, filtering, and technical spec views
│   └── repair-service/           # Workshop intake and real-time lifecycle tracking portal
├── middleware.ts                 # NextAuth Edge JWT Role-Based Access Control (/admin/*)
├── components/
│   ├── tools/
│   │   └── ElectricalCableCalculator.tsx  # Chapter 13 Cable Sizer with 1-click cart bundling
│   ├── layout/
│   │   ├── Header.tsx                     # Navigation, search shortcut (/), and cart badge
│   │   └── Footer.tsx                     # Workshop geolocation, contact numbers, hours, credentials
│   ├── product/
│   │   ├── ProductCard.tsx                # Catalog item card with badges
│   │   └── MobileSearchFilterBar.tsx      # Responsive mobile filtering
│   └── search/
│       └── LiveSearchBar.tsx              # Quick search with / shortcut
├── lib/
│   ├── auth.ts                            # NextAuth configuration and JWT session handlers
│   ├── cableCalculator.ts                 # Chapter 13 physics and building code calculation engine
│   ├── logger.ts                          # Constitution v1.1.0 structured logger (info, error, debug)
│   ├── paymentLogger.ts                   # Centralized payment transaction audit logging service
│   ├── prisma.ts                          # Global Prisma client instance
│   ├── search.ts                          # Persian letterform normalization and multi-field scoring
│   ├── stockReservation.ts                # Atomic race-free 8h Card-to-Card auto-release service
│   └── utils.ts                           # normalizeIranianPhone, Toman currency formatting, Jalali helpers
└── data/                                  # Zero-crash static fallbacks (Constitution Principle II)
    ├── articles.ts                        # Pre-rendered educational guides
    ├── products.ts                        # Static catalog fallback dataset
    ├── priceLists.ts                      # Partner manufacturer price sheets
    └── repairFallback.ts                  # Static appliance repair definitions & workshop telemetry
```

---

## Plan Extension: UI/UX Fixes, Product Architecture, Checkout & Unified Authentication (2026-09-17)

### Technical Architecture & Decisions

1. **Desktop Header Jitter Elimination**:
   - Introduce scroll threshold hysteresis (`hide > 160px`, `show < 80px`) in `Header.tsx`.
   - Ensure sticky header wrapper isolates height collapse from document scroll offset, preventing the 60fps flicker loop.
   - Remove `max-w-[210px]` on the mobile brand container to prevent "فروشگ..." brand title truncation.

2. **Catalog & Mobile Detail View Refinements**:
   - In `ProductCard.tsx`, update `getPriceUnit` to bind `/متر` strictly to `category.slug === 'cable' || category.slug === 'wiring'`, explicitly excluding motor winding descriptions (`"سیم‌پیچ"`, `"سیم‌پیچی"`).
   - Rebalance card visual hierarchy: separate rating stars and warranty badges on 2-column mobile grids to eliminate horizontal collision.
   - In `ProductDetailView.tsx`, implement `IntersectionObserver` to trigger the mobile sticky buy bar only when the main purchase box scrolls out of view.
   - Add `pb-32 sm:pb-12` bottom clearance so floating sticky bars never occlude form inputs, submit buttons, or card details.
   - In `ProductReviewsTab.tsx`, fix the 130% distribution bar math bug for 0-review products.

3. **Checkout Validation & Cash on Delivery (COD)**:
   - Make 10-digit postal code (`postalCode`) strictly mandatory across client and server (`/api/checkout`), with real-time Persian helper error messages.
   - Restrict Cash on Delivery (`cod_isfahan`) to local delivery options (Najafabad courier, Isfahan express, store pickup). Automatically disable COD when Post or Tipax is selected.
   - Update checkout submit button dynamically to "ثبت سفارش با پرداخت در محل" with truck icon when COD is selected.
   - On `/order-tracking/[id]`, display an unambiguous reassurance banner confirming that no online payment is required and settlement occurs upon delivery via mobile POS or cash.

4. **Unified Authentication Architecture**:
   - Unify customer and admin authentication into a single step-based phone entry flow on `/auth/login`.
   - Query `/api/auth/check-user` to inspect account capabilities:
     - Admin / password-enabled accounts can toggle between **"ورود با رمز عبور"** (Password) and **"ارسال کد یکبار مصرف (SMS OTP)"**.
     - Standard customer accounts receive a 5-digit SMS OTP with 120s countdown.
     - New phone numbers are automatically registered in PostgreSQL upon OTP verification, with an immediate inline prompt for their full name.
   - Admin accounts are strictly managed via the server-side CLI tool `scripts/create-admin.js` for security isolation.

5. **Admin Orders Management**:
   - Add `DELETE /api/admin/orders` supporting single and bulk test-order deletion with Prisma transaction cascade cleanup.
   - Add interactive confirmation modal in `OrdersAdminClient.tsx` with a one-click "حذف سفارش‌های تستی / نمونه" feature.

---

## Complexity Tracking

> No constitutional violations or unwarranted complexities detected. The architecture preserves direct Prisma database access, Next.js route handlers, and in-memory static fallbacks without unnecessary third-party microservices.
