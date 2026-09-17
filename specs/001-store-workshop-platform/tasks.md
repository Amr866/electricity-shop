# Tasks: UI/UX Fixes, Product Architecture, Checkout & Unified Authentication

**Feature Branch**: `001-store-workshop-platform`  
**Input Specifications**: [`spec.md`](./spec.md) | [`plan.md`](./plan.md)

---

## Table of Phases

| Phase | Phase Name | Priority | Primary Deliverable |
|---|:---|:---:|:---|
| **Phase 1** | Database Seed & Data Realignment | Foundational | Real reviews seed and accurate motor gallery images |
| **Phase 2** | Backend APIs & Security Architecture | Foundational | Check-user API, DB-backed admin auth, postal validation, and order DELETE endpoint |
| **Phase 3** | Header Navigation & Desktop Jitter Resolution | P1 (MVP) | Hysteresis scroll threshold, mobile store name layout, and z-index harmony |
| **Phase 4** | Product Card, Detail View & Mobile UX Fixes | P1 (MVP) | Fix `/متر` unit, warranty/rating separation, IntersectionObserver sticky bar, and review tab math |
| **Phase 5** | Checkout & Order Tracking UX | P1 | Mandatory 10-digit postal code, COD button logic, and tracking page reassurance |
| **Phase 6** | Admin Orders Management & Sample Deletion | P2 | Single & bulk test order deletion with confirmation modal |
| **Phase 7** | Unified Single-Flow Authentication UI | P2 | Single phone entry, password vs. OTP toggle for admins, auto-registration for customers |
| **Phase 8** | Polish, Build & End-to-End Playwright Verification | Final | TypeScript typecheck, build validation, and Playwright verification across mobile/desktop |
| **Phase 9** | Product Media Assets Consolidation & Next.js Rewrites | Foundational | Single uploads folder, seed URL updates, and Next.js backward-compatible rewrites |
| **Phase 10** | Products Smart Guarded Deletion | P2 | Safe order-history check, archive transition vs hard delete, and admin catalog tabs |
| **Phase 11** | BOM Inquiries Two-Stage Archival & Purge | P2 | Inquiries archive toggle, restore action, and permanent disk purge with Excel unlinking |
| **Phase 12** | Workshop Repairs Safety-Locked Archival | P2 | Active repair protection, technical history archive, and terminal ticket deletion |
| **Phase 13** | Universal Smart Friction Deletion Modal & WCAG | P2 | Count-aware friction modal (type "حذف" >3 items), keyboard trap, and accessible alerts |
| **Phase 14** | Automated Verification & Full Test Suite | Final | End-to-end integration tests for image routing, guarded deletion, and full system typecheck |

---

## Phase 1: Database Seed & Data Realignment

**Purpose**: Align mock database records with UI expectations so reviews, ratings, and image galleries match actual data.

- [x] T001 [P] Seed real `Review` records in `prisma/seed.js` for Motogen cooler motors to establish parity between `reviewCount` and actual database rows.
- [x] T002 [P] Replace mismatched generator thumbnail for `APP-CLR-MOT75` with authentic cooler motor technical diagram in `prisma/seed.js`.
- [x] T003 Execute database seed via `node prisma/seed.js` to persist corrected review records and motor images.

---

## Phase 2: Backend APIs & Security Architecture

**Purpose**: Core backend endpoints, validation rules, and authentication providers required for UI flows.

- [x] T004 [P] Create `/api/auth/check-user` endpoint in `src/app/api/auth/check-user/route.ts` to inspect phone number role (`ADMIN`/`CUSTOMER`) and password presence.
- [x] T005 [P] Update NextAuth credentials provider in `src/lib/auth.ts` to support database-driven admin password checking and OTP fallback.
- [x] T006 [P] Create admin generation CLI helper script in `scripts/create-admin.js` to promote or create admin accounts with custom credentials.
- [x] T007 Enforce mandatory 10-digit postal code validation (`^\d{10}$`) and COD eligibility check in `src/app/api/checkout/route.ts`.
- [x] T008 Implement `DELETE` method in `src/app/api/admin/orders/route.ts` supporting single order ID deletion and bulk test order cleanup with transaction safety.

---

## Phase 3: Header Navigation & Desktop Jitter Resolution (Priority: P1) 🎯 MVP

**Goal**: Eliminate rapid scroll jitter on desktop, prevent brand name truncation on mobile, and balance header z-index.

**Independent Test**: Scroll past 200px on desktop (1280px) and verify header collapses smoothly without flickering; view mobile header (375px) and verify "فروشگاه شیاسی" displays without truncation.

- [x] T009 [P] [US1] Implement scroll threshold hysteresis (`hide > 160px`, `show < 80px`) in `src/components/layout/Header.tsx` to eliminate infinite collapse/expand flicker loop.
- [x] T010 [P] [US1] Remove restrictive `max-w-[210px]` container on mobile brand link in `src/components/layout/Header.tsx` to prevent store name truncation (`فروشگ...`).
- [x] T011 [US1] Coordinate z-index stacking and safe-area padding between header, `src/components/layout/MobileBottomNav.tsx`, and sticky bars.

---

## Phase 4: Product Card, Detail View & Mobile UX Fixes (Priority: P1) 🎯 MVP

**Goal**: Fix pricing unit bug, separate warranty and rating on mobile cards, eliminate dual add-to-cart buttons, resolve 130% review math, and remove bottom screen occlusion.

**Independent Test**: Open `/products/[slug]` on mobile (375px), verify Motogen motor displays no `/متر`, sticky bar appears only when main purchase card is scrolled out of view, and review textarea + submit button are fully visible and clickable.

- [x] T012 [P] [US2] Fix pricing unit bug in `src/components/product/ProductCard.tsx` so `/متر` only applies when product category is `wiring` or `cable` and explicitly excludes motors/appliances (`سیم‌پیچ`).
- [x] T013 [P] [US2] Rebalance warranty badge and rating star layout in `src/components/product/ProductCard.tsx` to prevent horizontal text collision on mobile screens.
- [x] T014 [US3] Implement `IntersectionObserver` in `src/components/product/ProductDetailView.tsx` to display sticky bottom bar only when main desktop/mobile buy card scrolls out of view.
- [x] T015 [US3] Refactor bulk wholesale tiered discount title in `src/components/product/ProductDetailView.tsx` to dynamically render "متراژ بالا" for cables and "تعداد بالا" for motors/appliances.
- [x] T016 [US3] Add `pb-32 sm:pb-12` bottom padding clearance in `src/components/product/ProductDetailView.tsx` and `src/app/products/[slug]/page.tsx`.
- [x] T017 [US3] Fix review breakdown mathematical percentage bug in `src/components/product/ProductReviewsTab.tsx` so empty reviews default to 0% across all star bars.
- [x] T018 [US3] Preserve Persian fractions (e.g. `۳/۴`) in `src/app/products/[slug]/page.tsx` breadcrumbs by wrapping in `<bdi>` and utilizing horizontal scrolling.

---

## Phase 5: Checkout & Order Tracking UX (Priority: P1)

**Goal**: Enforce 10-digit mandatory postal code, clarify COD payment button, and reassure customers on order tracking.

**Independent Test**: Attempt checkout without postal code or with 9 digits (verify error); select COD (verify button says "ثبت سفارش با پرداخت در محل"); inspect tracking page (verify green reassurance banner).

- [x] T019 [P] [US3] Add red asterisk `*`, strict 10-digit validation, and real-time Persian helper error to postal code input in `src/app/checkout/page.tsx`.
- [x] T020 [US3] Update submit button in `src/app/checkout/page.tsx` to dynamically say "ثبت سفارش با پرداخت در محل" with truck icon when COD is selected, adding courier payment details.
- [x] T021 [US3] Update payment status badge and render prominent green reassurance alert for COD orders in `src/app/order-tracking/[id]/page.tsx`.

---

## Phase 6: Admin Orders Management & Sample Deletion (Priority: P2)

**Goal**: Provide store admins with the capability to delete test/sample orders safely from the dashboard.

**Independent Test**: Log in as admin, navigate to `/admin/orders`, click trash icon on a sample order, confirm modal, verify order is removed and metrics update.

- [x] T022 [P] [US4] Add "حذف سفارش" action button with trash icon to order rows and detail drawer in `src/app/admin/orders/OrdersAdminClient.tsx`.
- [x] T023 [US4] Implement confirmation modal with warning dialog before deleting an order in `src/app/admin/orders/OrdersAdminClient.tsx`.
- [x] T024 [US4] Add one-click "حذف سفارش‌های تستی / نمونه" button to batch clean seed/test orders in `src/app/admin/orders/OrdersAdminClient.tsx`.

---

## Phase 7: Unified Single-Flow Authentication UI (Priority: P2)

**Goal**: Replace separate customer/admin tabs with an intelligent, single phone entry flow supporting password, SMS OTP, and auto-registration.

**Independent Test**: Enter admin phone number (verify option for password or OTP appears); enter regular phone number (verify 5-digit OTP step with 120s timer appears and auto-registers new account).

- [x] T025 [US5] Refactor `src/app/auth/login/page.tsx` to remove manual tab mode switcher in favor of a step-based unified phone input.
- [x] T026 [US5] Integrate `/api/auth/check-user` into `src/app/auth/login/page.tsx` to present password entry or SMS OTP toggle for admins.
- [x] T027 [US5] Implement automatic registration and name intake for new customers upon verifying 5-digit OTP in `src/app/auth/login/page.tsx`.

---

## Phase 8: Polish, Build & End-to-End Playwright Verification (Final)

**Purpose**: Validate that all fixes build without errors and function properly on both mobile and desktop viewports.

- [x] T028 Run TypeScript typecheck via `npm run typecheck` to verify zero compiler errors across all modified components and API routes.
- [x] T029 Execute full production build via `npm run build` to verify Next.js page generation and static/dynamic route compilation.
- [x] T030 Create Playwright / E2E verification test in `tests/e2e-all-phases.test.mjs` covering:
  - Desktop header scroll without jitter
  - Product page mobile layout, correct pricing unit (no `/متر`), and `IntersectionObserver` sticky bar
  - Review tab form accessibility and visibility above bottom nav
  - Mandatory postal code validation in checkout
  - Cash on delivery button state and tracking reassurance banner
- [x] T031 Run Playwright / E2E test suite using command runner and capture verification screenshots.

---

## Phase 9: Product Media Assets Consolidation & Next.js Rewrites (Foundational)

**Goal**: Consolidate product image assets into `/public/uploads/products/` as the single source of truth, update database seed references, and configure transparent Next.js rewrites for zero broken images.

**Independent Test**: Request `/images/products/alborz-cable-1.jpg` and `/uploads/products/alborz-cable-1.jpg` in browser/curl, verify both return HTTP 200 and identical image bytes.

- [ ] T032 [P] Create migration script `scripts/migrate-images.js` to copy/move images from root `/Images` and `/public/images/products` into `/public/uploads/products/`
- [ ] T033 [P] Update image references in `prisma/seed.js` and database rows (`ProductImage.url`, `Category.image`) to use `/uploads/products/...`
- [ ] T034 [P] Configure transparent Next.js URL rewrite in `next.config.ts` mapping `/images/products/:path*` to `/uploads/products/:path*`
- [ ] T035 Execute image migration script `scripts/migrate-images.js` and clean up empty redundant source directories

---

## Phase 10: Products Smart Guarded Deletion (Priority: P2)

**Goal**: Implement smart guarded deletion for products: permanently delete products with zero orders along with disk images; archive products with historical order items (`isArchived: true`) to preserve financial/order integrity.

**Independent Test**: Attempt deleting a zero-order product (verify hard delete from DB); attempt deleting a product with 1+ orders (verify status transitions to `isArchived: true` and stock becomes 0); query public catalog (verify archived item is excluded); view admin catalog (verify item appears under "آرشیو شده‌ها").

- [ ] T036 [P] Add `isArchived Boolean @default(false)` to `Product` model in `prisma/schema.prisma` and push schema via `npx prisma db push`
- [ ] T037 [US9] Implement `DELETE /api/admin/products` and `DELETE /api/admin/products/[id]` with `OrderItem` count check (hard delete + image unlink if 0 orders; `isArchived: true` if >=1 orders) in `src/app/api/admin/products/route.ts` and `src/app/api/admin/products/[id]/route.ts`
- [ ] T038 [US9] Update public catalog queries in `src/app/products/page.tsx`, `src/app/products/[slug]/page.tsx`, and `src/app/api/search/route.ts` to filter `where: { isArchived: false }`
- [ ] T039 [US9] Update `src/app/admin/products/ProductsAdminClient.tsx` with single/bulk deletion actions, summary badge feedback, and active vs. archived catalog view tabs

---

## Phase 11: BOM Inquiries Two-Stage Archival & Purge (Priority: P2)

**Goal**: Provide a two-stage archival and purge workflow for contractor Bill of Materials (BOM) inquiries, protecting active submissions while permitting permanent purging of physical Excel/PDF files.

**Independent Test**: Move an inquiry to archive (verify `isArchived: true` and file preserved on disk); click restore (verify `isArchived: false`); click permanent purge in archive tab (verify DB row deleted and uploaded file deleted from disk).

- [ ] T040 [P] Add `isArchived Boolean @default(false)` to `BOMSubmission` model in `prisma/schema.prisma` and push schema via `npx prisma db push`
- [ ] T041 [US9] Implement `PATCH /api/admin/boms/[id]/archive` (toggle archive) and `DELETE /api/admin/boms/[id]` (permanent purge with physical Excel file unlinking from `public/uploads/boms/`) in `src/app/api/admin/boms/[id]/archive/route.ts` and `src/app/api/admin/boms/[id]/route.ts`
- [ ] T042 [US9] Update `src/app/admin/boms/BomsAdminClient.tsx` with segmented tabs (active vs. archived), 1-click restore action, and permanent purge confirmation modal

---

## Phase 12: Workshop Repairs Safety-Locked Archival (Priority: P2)

**Goal**: Safeguard active workshop repair jobs from deletion, while routing completed and cancelled tickets to a searchable technical history archive with restricted permanent purge.

**Independent Test**: Attempt deleting a repair ticket in `INSPECTING` status (verify HTTP 400 error and rejection); complete the ticket and delete (verify transition to `isArchived: true` in technical archive); purge terminal ticket from archive view (verify record removed).

- [ ] T043 [P] Add `isArchived Boolean @default(false)` to `RepairRequest` model in `prisma/schema.prisma` and push schema via `npx prisma db push`
- [ ] T044 [US9] Implement `DELETE /api/admin/repairs/[id]` in `src/app/api/admin/repairs/[id]/route.ts` and bulk delete in `src/app/api/admin/repairs/route.ts` rejecting in-progress stages (`INSPECTING`, `COST_ESTIMATED`, `REPAIRING`, `READY`) and allowing deletion only for terminal states (`COMPLETED`, `CANCELLED`)
- [ ] T045 [US9] Update `src/app/admin/repairs/RepairsAdminClient.tsx` with disabled delete tooltip on active repairs, a dedicated "بایگانی سوابق فنی کارگاه" tab, and permanent purge modal

---

## Phase 13: Universal Smart Friction Deletion Modal & WCAG (Priority: P2)

**Goal**: Deliver a WCAG-compliant, Persian-friction confirmation modal across all admin views (Orders, Products, BOMs, Repairs) requiring text confirmation ("حذف") for large batches or "Delete All".

**Independent Test**: Select 2 items for deletion (verify standard red confirmation modal); select 5 items or "Delete All" (verify button is disabled until typing "حذف"); press `Escape` or tab through (verify focus trap and clean dismissal).

- [ ] T046 [P] [US9] Create reusable component `src/components/admin/ConfirmDeleteModal.tsx` with count-aware friction (standard confirmation for 1-3 items; type "حذف" for >3 items or "Delete All"), Escape dismiss, and focus trap
- [ ] T047 [US9] Integrate `ConfirmDeleteModal` into Orders, Products, BOMs, and Repairs admin client views in `src/app/admin/orders/OrdersAdminClient.tsx`, `src/app/admin/products/ProductsAdminClient.tsx`, `src/app/admin/boms/BomsAdminClient.tsx`, and `src/app/admin/repairs/RepairsAdminClient.tsx`

---

## Phase 14: Automated Verification & Full Test Suite (Final)

**Purpose**: Execute end-to-end integration tests for media migration rewrites, guarded deletions across entities, and full system typecheck.

- [ ] T048 Create integration test suite in `tests/phase9-guarded-deletion.test.mjs` covering image rewrites, product order-guard checks, BOM file deletion, and repair status protection
- [ ] T049 Execute `npm run typecheck`, `npm test`, and `npx tsx tests/phase9-guarded-deletion.test.mjs` to verify zero errors across all phases

---

## Dependencies & Execution Order

```mermaid
flowchart TD
    subgraph Phase1["Phase 1: Seed & Data"]
        T001["T001: Review Seed"]
        T002["T002: Motor Gallery Fix"]
        T003["T003: Execute Seed"]
        T001 --> T003
        T002 --> T003
    end

    subgraph Phase2["Phase 2: Backend APIs"]
        T004["T004: Check-User API"]
        T005["T005: DB-Admin Auth"]
        T006["T006: Create-Admin CLI"]
        T007["T007: Postal Code Validation"]
        T008["T008: Orders DELETE API"]
    end

    subgraph Phase3["Phase 3: Header & Navigation"]
        T009["T009: Hysteresis Scroll"]
        T010["T010: Mobile Store Name"]
        T011["T011: BottomNav Harmony"]
    end

    subgraph Phase4["Phase 4: Product UI Fixes"]
        T012["T012: /متر Unit Fix"]
        T013["T013: Warranty/Rating Separation"]
        T014["T014: Sticky Bar Observer"]
        T015["T015: Dynamic Tier Header"]
        T016["T016: Bottom Spacing pb-32"]
        T017["T017: Reviews Math Fix"]
        T018["T018: Breadcrumb Fraction"]
    end

    subgraph Phase5["Phase 5: Checkout & COD"]
        T019["T019: Postal Code UI"]
        T020["T020: COD Button Logic"]
        T021["T021: COD Tracking Banner"]
    end

    subgraph Phase6["Phase 6: Admin Orders"]
        T022["T022: Delete Button UI"]
        T023["T023: Confirm Modal"]
        T024["T024: Bulk Test Delete"]
    end

    subgraph Phase7["Phase 7: Unified Auth"]
        T025["T025: Phone Input Refactor"]
        T026["T026: Admin Password/OTP"]
        T027["T027: Customer Auto-Reg"]
    end

    subgraph Phase8["Phase 8: Verification"]
        T028["T028: Typecheck"]
        T029["T029: Build"]
        T030["T030: Playwright Tests"]
        T031["T031: Verification Capture"]
    end

    subgraph Phase9["Phase 9: Media Consolidation"]
        T032["T032: Migration Script"]
        T033["T033: Seed & DB URLs"]
        T034["T034: Next.js Rewrites"]
        T035["T035: Execute Migration"]
        T032 --> T035
        T033 --> T035
        T034 --> T035
    end

    subgraph Phase10["Phase 10: Products Guarded Deletion"]
        T036["T036: Schema isArchived (Product)"]
        T037["T037: Product DELETE API"]
        T038["T038: Storefront Filter isArchived"]
        T039["T039: Products Admin UI Tabs"]
        T036 --> T037
        T036 --> T038
        T037 --> T039
    end

    subgraph Phase11["Phase 11: BOMs Archival & Purge"]
        T040["T040: Schema isArchived (BOM)"]
        T041["T041: BOM Archive & Purge API"]
        T042["T042: BOMs Admin UI Tabs"]
        T040 --> T041
        T041 --> T042
    end

    subgraph Phase12["Phase 12: Repairs Safety-Lock"]
        T043["T043: Schema isArchived (Repair)"]
        T044["T044: Repairs Guarded DELETE API"]
        T045["T045: Repairs Admin Archive UI"]
        T043 --> T044
        T044 --> T045
    end

    subgraph Phase13["Phase 13: Universal Friction Modal"]
        T046["T046: ConfirmDeleteModal Component"]
        T047["T047: Admin Views Integration"]
        T046 --> T047
    end

    subgraph Phase14["Phase 14: Verification"]
        T048["T048: Guarded Deletion Test Suite"]
        T049["T049: Typecheck & Full Test Run"]
        T048 --> T049
    end

    Phase1 --> Phase4
    Phase2 --> Phase5
    Phase2 --> Phase6
    Phase2 --> Phase7
    Phase3 --> Phase8
    Phase4 --> Phase8
    Phase5 --> Phase8
    Phase6 --> Phase8
    Phase7 --> Phase8
    Phase9 --> Phase14
    Phase10 --> Phase13
    Phase11 --> Phase13
    Phase12 --> Phase13
    Phase13 --> Phase14
```
