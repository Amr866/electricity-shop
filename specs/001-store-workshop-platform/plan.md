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

## Plan Extension: Media Assets Migration & Smart Guarded Admin Deletions (2026-09-17)

### Technical Architecture & Decisions

1. **Product Media Assets Consolidation & Next.js Rewrites (FR-042)**:
   - Create a dedicated migration script `scripts/migrate-images.js`:
     - Inspect files in root `/Images/` and `/public/images/products/`.
     - Move/copy all unique product image files to `/public/uploads/products/` with UTF-8 safe filename handling.
     - Update all `ProductImage.url` and `Category.image` database rows to point to `/uploads/products/<filename>`.
     - Update `prisma/seed.js` to reference `/uploads/products/...` directly.
     - Remove redundant source folders after successful migration.
   - Configure transparent URL rewriting in `next.config.ts`:
     - Map `/images/products/:path*` to `/uploads/products/:path*` in `async rewrites()` to prevent broken 404 image errors on client caches.

2. **Products Smart Guarded Deletion Architecture (FR-041)**:
   - Database schema enhancement: add `isArchived Boolean @default(false)` to `Product` model in `prisma/schema.prisma`.
   - Implement `DELETE /api/admin/products/[id]` and `DELETE /api/admin/products` (bulk):
     - Query `OrderItem` count for target product IDs.
     - **For products with 0 orders**: execute full cascade deletion of `ProductSpec`, `ProductImage`, and `Review` records within a `$transaction`, unlinking local image files.
     - **For products with >= 1 orders**: prevent hard deletion; update `isArchived: true` and `stock: 0`, preserving invoice history and foreign key constraints.
   - Update storefront catalog queries (`src/app/products/page.tsx`, `src/app/products/[slug]/page.tsx`, `src/app/api/search/route.ts`) to filter `where: { isArchived: false }`.
   - Update `ProductsAdminClient.tsx`:
     - Add single and bulk delete buttons.
     - Add segmented view tabs: **"کاتالوگ فعال"** vs **"آرشیو شده‌ها"**.
     - Display a summary badge on deletion: *"X کالا به طور کامل حذف شد و Y کالا به دلیل داشتن سابقه فاکتور به بایگانی منتقل شد"*.

3. **BOM Inquiries Two-Stage Archival & Purge (FR-043)**:
   - Database schema enhancement: add `isArchived Boolean @default(false)` to `BOMSubmission` model.
   - Implement `PATCH /api/admin/boms/[id]/archive` to toggle archive/restore state.
   - Implement `DELETE /api/admin/boms/[id]` and bulk delete for permanent purge:
     - Unlink physical uploaded file (`.xlsx`, `.xls`, `.pdf`) from disk (`public/uploads/boms/`).
     - Delete database record.
   - Update `BomsAdminClient.tsx`:
     - Add segmented view tabs: **"استعلام‌های جاری"** vs **"بایگانی‌شده‌ها"**.
     - In active view: action button is "انتقال به بایگانی" (Archive).
     - In archive view: action buttons are "بازگردانی" (Restore) and "حذف قطعی" (Permanent Purge).

4. **Workshop Repairs Hybrid Safety-Locked Archival (FR-044)**:
   - Database schema enhancement: add `isArchived Boolean @default(false)` to `RepairRequest` model.
   - Implement `DELETE /api/admin/repairs/[id]` and bulk delete:
     - Guard check: if `status` is in `['SUBMITTED', 'RECEIVED', 'INSPECTING', 'COST_ESTIMATED', 'REPAIRING', 'READY']`, reject with status 400 (*"دستگاه‌های فعال و در حال انجام کار در کارگاه قابل حذف نیستند"*).
     - If `status` is `COMPLETED` or `CANCELLED`, permit deletion.
   - Update `RepairsAdminClient.tsx`:
     - Disable delete button on in-progress rows with clear tooltip explanation.
     - Add **"بایگانی سوابق فنی کارگاه"** tab for completed and cancelled tickets.
     - Permit permanent purge modal exclusively from within the archive view.

5. **Universal Smart Friction Deletion Modal (FR-045)**:
   - Implement reusable component `src/components/admin/ConfirmDeleteModal.tsx`:
     - Small batches (1-3 items): displays item titles, affected count, cancel button, and red action button.
     - Large batches (>3 items or "حذف همه"): requires typing the word **"حذف"** in a confirmation text input before enabling the red action button.
     - Fully accessible: `role="alertdialog"`, `aria-modal="true"`, focus trap on open, dismiss on `Escape` key, Vazirmatn Persian typography.

---

## Plan Extension: Optional Pricing Units, Customer Reviews Moderation & Total Order Purge (2026-09-17)

### Technical Architecture & Decisions

1. **Configurable Product Pricing Units (FR-047)**:
   - Database Schema: Add `priceUnit String?` to the `Product` model in `prisma/schema.prisma`.
   - Run `npx prisma db push` to synchronize Postgres.
   - Admin Editor (`src/app/admin/products/ProductsAdminClient.tsx` & `src/app/api/admin/products/route.ts`):
     - Add interactive preset chips: `عدد`, `متر`, `کلاف`, `شاخه`, `کیلوگرم`, `بسته`.
     - Clicking a chip populates or toggles the `priceUnit` state; custom text input allows bespoke units or clearing.
     - Save `priceUnit` via `POST` / `PUT` endpoints in `src/app/api/admin/products/route.ts`.
   - Storefront Rendering:
     - In `src/components/product/ProductCard.tsx`: Conditionally append `/{product.priceUnit}` when `product.priceUnit` is not null/empty; otherwise render clean currency.
     - In `src/app/products/[slug]/ProductDetailView.tsx`: Render `/ {product.priceUnit}` next to price in main header, bulk discount table, and mobile sticky bottom purchase bar.

2. **Customer Reviews Moderation Hub (FR-046)**:
   - Schema & Defaults:
     - `Review` model has `isVerified Boolean @default(true)`. For user-submitted reviews from `ProductReviewsTab.tsx`, set default to `false` (pending moderation).
   - Dedicated API Route (`src/app/api/admin/reviews/route.ts`):
     - `GET`: Returns all reviews with product relation (`include: { product: true }`), ordered by `createdAt: desc`, with optional `status=pending|verified|all` query filtering.
     - `PATCH`: Toggles `isVerified` (approve or unpublish). Automatically recomputes the product's average rating and verified review count in a `$transaction`.
     - `DELETE`: Permanently deletes review records (single or bulk), recomputing the product's average rating.
   - Admin Reviews Console (`src/app/admin/reviews/page.tsx` & `src/app/admin/reviews/ReviewsAdminClient.tsx`):
     - Filter tabs: **"در انتظار بررسی"** (pending), **"تایید شده‌ها"** (approved), and **"همه نظرات"** (all).
     - Metric counter cards: Pending count, Total Approved, Average Store Rating.
     - Review cards with star rating, customer name, date, product thumbnail/title, review text, and 1-click action buttons: "تایید و انتشار" (Approve), "لغو انتشار" (Unpublish), "حذف قطعی" (Delete via `ConfirmDeleteModal`).
   - Admin Navigation (`src/components/admin/AdminSidebar.tsx`):
     - Register `/admin/reviews` with `MessageSquare` Lucide icon in admin sidebar.
     - In `ProductsAdminClient.tsx`, provide a direct link/badge from product rows to review moderation.

3. **Total Order Purge & Cascade Deletion (FR-048)**:
   - Backend API (`src/app/api/admin/orders/route.ts`):
     - Support `{ deleteAllOrders: true }` parameter in `DELETE` handler.
     - Queries all existing Order IDs, deletes associated `OrderItem` rows in batch, and deletes the `Order` records in a `$transaction`.
   - Admin UI (`src/app/admin/orders/OrdersAdminClient.tsx`):
     - Provide two clear action buttons in the header toolbar:
       1. **"حذف سفارش‌های تستی / نمونه"** (filters demo/mock orders).
       2. **"حذف تمامی سفارش‌های سیستم (پاکسازی کلی)"** (triggers complete database order purge).
     - Both actions are guarded by `ConfirmDeleteModal` with high-friction confirmation (mandatory typing "حذف" to activate the red destructive button).

---

## Plan Extension: Storefront In-App Performance Optimization & Database Indexing (Phase 17 - 2026-09-18)

### Technical Architecture & Decisions

1. **PostgreSQL Composite Indexing (`FR-054`)**:
   - Update `prisma/schema.prisma` `Product` model with:
     - `@@index([isArchived, createdAt])` (default recency ordering)
     - `@@index([isArchived, price])` (cheapest / expensive sorting)
     - `@@index([isArchived, categoryId])` (catalog category filtering)
   - Synchronize with PostgreSQL via `npx prisma db push`.

2. **In-App Data Cache & Tagged Revalidation (`FR-053`, `FR-057`)**:
   - Implement `getCachedCatalogMetadata()` in `src/lib/domain/catalog-cache.ts` wrapped with Next.js `unstable_cache`:
     - Caches active categories with product count calculations.
     - Caches distinct brand listings.
     - Tags cache with `['catalog-metadata']`.
   - Update `src/app/products/page.tsx` to retrieve categories and brands from `getCachedCatalogMetadata()`.
   - Update administrative route handlers `src/app/api/admin/products/route.ts` and `src/app/api/admin/categories/route.ts`:
     - Add `revalidateTag('catalog-metadata')` and `revalidatePath('/products/[slug]')` upon product/category mutations.

3. **Incremental Static Regeneration (ISR) for Product Detail Pages (`FR-053`)**:
   - In `src/app/products/[slug]/page.tsx`:
     - Export `revalidate = 300` (5 minutes ISR).
     - Export `generateStaticParams()` querying active product slugs (`where: { isArchived: false }`).
     - Product detail pages render from static HTML memory cache in under 30ms.

4. **Search Query Execution Scoping (`FR-055`)**:
   - In `src/app/products/page.tsx`:
     - Refine multi-token search `where.AND` mapping to query: `name`, `sku`, `mpn`, `brand`, and `shortDesc`.
     - Omit raw HTML `description` wildcard scanning, preventing database table scans on large text blobs.

5. **Mobile Font Payload Trimming (`FR-056`)**:
   - In `src/app/layout.tsx`:
     - Trim Vazirmatn weights to `["400", "500", "700", "900"]` with `display: "swap"` and `preload: true`, cutting font transfer payload and reducing mobile FCP.

---

## Complexity Tracking

> No constitutional violations or unwarranted complexities detected. The architecture preserves direct Prisma database access, Next.js route handlers, and in-memory static fallbacks without unnecessary third-party microservices.
