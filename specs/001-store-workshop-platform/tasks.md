# Tasks: Shiasi Store & Technical Workshop Platform

**Feature Branch**: `001-store-workshop-platform`  
**Input Specifications**: [`spec.md`](./spec.md) | [`plan.md`](./plan.md) | [`data-model.md`](./data-model.md) | [`research.md`](./research.md)

---

## Table of Phases

| Phase | Phase Name | Priority | Primary Deliverable |
|---|:---|:---:|:---|
| **Phase 1** | Setup & Workspace Infrastructure | Foundations | Project dependencies, environment validation, and tooling |
| **Phase 2** | Foundational Architecture | Foundations | Prisma schema enhancements, Constitution v1.1.0 logger, and RTL layout |
| **Phase 3** | User Story 1 - Digital Catalog & Persian Search | **P1 (MVP)** | Multi-keyword Persian search, `/` shortcut, and technical spec tables |
| **Phase 4** | User Story 2 - Dynamic Cart, Tiered Discounts & Dual Invoicing | **P1** | 5%/10% wholesale tiers, 8-hour Card-to-Card hold, and A4 tax invoice |
| **Phase 5** | User Story 3 - Technical Repair Workshop Intake & Tracking | **P1** | 7-stage lifecycle, `REP-YYMMDD-XXXX`, and 1-click cost approval |
| **Phase 6** | User Story 4 - National Code Chapter 13 Cable Sizer | **P1** | \(\Delta V\% < 3.0\%\) copper conductor sizing, MCB curves, and 1-click cart |
| **Phase 7** | User Story 5 - Iranian Mobile OTP Authentication | **P1** | Phone normalization, 60s cooldown, 3-attempt limit, and account portal |
| **Phase 8** | User Story 6 - Contractor Bill of Materials (BOM) Estimator | **P2** | Multi-line text & binary document intake with admin triage queue |
| **Phase 9** | User Story 7 - Official Factory Price Lists Hub | **P2** | Verified partner PDF price sheets with Jalali dates and coefficients |
| **Phase 10** | User Story 8 - Editorial Knowledge Base & Authoring Studio | **P2** | Technical guides with callouts, auto-slug generator, and live preview |
| **Phase 11** | User Story 9 - Admin Dashboard, Inventory & Database Backup | **P2** | Real-time metrics, low-stock alerts (≤5 units), and 1-click DB backup |
| **Phase 12** | Polish, Verification & Operational Resilience | Final | Zero TypeScript errors, full route build, and quickstart verification |

---

## Phase 1: Setup & Workspace Infrastructure

**Purpose**: Verify dependencies, environment configurations, and core Next.js/Prisma runtime prerequisites.

- [x] T001 Verify project environment dependencies and npm packages in `package.json`
- [x] T002 Configure database connection string and connection pooling in `.env`
- [x] T003 [P] Verify Tailwind CSS RTL layout and Vazirmatn Persian typography in `tailwind.config.ts`

---

## Phase 2: Foundational Architecture

**Purpose**: Core data models, logging governance, and shared utilities blocking all user stories.

**⚠️ CRITICAL**: Must be completed before user story implementation begins.

- [x] T004 Enhance Prisma schema with Card-to-Card reservation, repair approval fields, BOM, and price list models in `prisma/schema.prisma`
- [x] T005 [P] Implement Constitution v1.1.0 structured logging utility (`info` requests, `error` failures, `debug` actions) in `src/lib/logger.ts`
- [x] T006 [P] Verify Persian character and phone normalization utilities (`normalizeIranianPhone`, `normalizePersianText`, `<bdi>` helpers) in `src/lib/utils.ts`
- [x] T007 Synchronize PostgreSQL database schema and compile Prisma Client types via `prisma db push` and `prisma generate`
- [x] T008 [P] Configure global root layout with RTL directionality, Vazirmatn font subsets, and zero-hydration-flash theme provider in `src/app/layout.tsx`

---

## Phase 3: User Story 1 - Digital Catalog & Persian Search (Priority: P1) 🎯 MVP

**Goal**: Enable customers to explore electrical categories, filter products, execute multi-keyword Persian searches with character normalization, and inspect technical spec tables.

**Independent Test**: Focus search with `/`, query `"موتور موتوژن ۳/۴"`, receive results in < 400ms, and view technical specs on `/products/[slug]`.

- [x] T009 [P] [US1] Implement multi-token Persian keyword search and scoring engine with static fallback in `src/app/api/search/route.ts`
- [x] T010 [P] [US1] Create search API route with request/error logging in `src/app/api/search/route.ts`
- [x] T011 [US1] Implement global search bar with `/` keyboard shortcut and instant dropdown results in `src/components/search/LiveSearchBar.tsx`
- [x] T012 [P] [US1] Build category filtering, brand filters, and stock badge indicators in `src/app/products/page.tsx`
- [x] T013 [US1] Build product detail page with structured technical specification table and datasheet download in `src/app/products/[slug]/page.tsx`

---

## Phase 4: User Story 2 - Dynamic Cart, Tiered Discounts & Dual Invoicing (Priority: P1)

**Goal**: Implement dynamic shopping cart with tiered wholesale volume discounts (5% at ≥10, 10% at ≥50), dual B2C/B2B tax invoicing, 4 shipping methods, and 8-hour Card-to-Card reservation.

**Independent Test**: Add 12 items to cart to verify 5% discount, select Legal Corporate invoice with Economic Code, submit via Card-to-Card, and verify 8-hour reservation timestamp.

- [x] T014 [P] [US2] Implement client-side cart calculation with automatic tiered wholesale discounts in `src/context/CartContext.tsx`
- [x] T015 [US2] Build cart review view showing tiered discount savings and localized shipping options in `src/app/cart/page.tsx`
- [x] T016 [US2] Build checkout view with Individual vs Corporate invoice toggle and Iranian tax field validation in `src/app/checkout/page.tsx`
- [x] T017 [US2] Implement server-authoritative checkout route with atomic `$transaction`, price re-verification, and 8-hour Card-to-Card reservation in `src/app/api/checkout/route.ts`
- [x] T018 [P] [US2] Create Ministry of Finance compliant printable A4 legal tax invoice layout in `src/app/order-tracking/[id]/page.tsx`
- [x] T019 [US2] Implement order confirmation and Card-to-Card receipt upload view in `src/app/order-tracking/page.tsx`

---

## Phase 5: User Story 3 - Technical Repair Workshop Intake & Tracking (Priority: P1)

**Goal**: Streamline appliance intake for Najafabad workshop and courier delivery across Isfahan, tracking 7-stage lifecycle with hybrid automated SMS and 1-click customer cost approvals.

**Independent Test**: Register a repair ticket, receive `REP-YYMMDD-XXXX`, lookup status, simulate quote generation, and trigger 1-click cost approval.

- [x] T020 [P] [US3] Build online repair intake form for 6 appliance groups with drop-off/courier options in `src/app/repair-service/page.tsx`
- [x] T021 [US3] Implement repair ticket registration endpoint generating bidirectional-isolated `REP-YYMMDD-XXXX` codes in `src/app/api/repairs/route.ts`
- [x] T022 [P] [US3] Build customer repair tracking page with 7-stage visual timeline and direct workshop contacts in `src/app/repair-service/page.tsx`
- [x] T023 [US3] Implement customer 1-click "Approve Cost" and "Decline Repair" action endpoint in `src/app/api/repairs/approve/route.ts`
- [x] T024 [US3] Build admin workshop workbench for diagnostics logging, cost estimation, and phone approval entry in `src/app/admin/repairs/page.tsx`

---

## Phase 6: User Story 4 - National Code Chapter 13 Cable Sizer (Priority: P1)

**Goal**: Calculate mandatory safe copper wire cross-sections maintaining \(\Delta V\% < 3.0\%\) per National Building Regulations Chapter 13, match MCB breaker trip curves, and bundle to cart with 1 click.

**Independent Test**: Input 5 kW over 45 meters single-phase; verify nominal current 26.7A, 6mm² copper conductor, 1.8% voltage drop, C32 breaker, and 1-click cart addition.

- [x] T025 [P] [US4] Implement Chapter 13 mathematical calculation engine (\(I\), \(\Delta V\%\), pure copper ladder, and MCB curves) in `src/lib/cableCalculator.ts`
- [x] T026 [US4] Build interactive Cable Calculator UI with sliders, voltage drop safety indicators, and MCB recommendations in `src/components/tools/ElectricalCableCalculator.tsx`
- [x] T027 [US4] Implement 1-click bundle purchase dispatching exact cable length and matching breaker to cart in `src/components/tools/ElectricalCableCalculator.tsx`
- [x] T028 [US4] Integrate Chapter 13 Cable Calculator module into storefront homepage in `src/app/page.tsx`

---

## Phase 7: User Story 5 - Iranian Mobile OTP Authentication (Priority: P1)

**Goal**: Provide secure passwordless login using Iranian mobile numbers (`09XXXXXXXXX`) with 60s cooldown, 3-attempt throttling, password fallback, and customer account dashboard.

**Independent Test**: Submit phone with Persian digits, receive 5-digit OTP with 60s countdown, verify throttling on repeated attempts, and log in to inspect order history.

- [x] T029 [P] [US5] Implement SMS OTP dispatch endpoint with 60s cooldown and 3-attempt/15min rate limiting in `src/app/api/auth/otp/send/route.ts`
- [x] T030 [US5] Implement OTP verification and JWT session creation in `src/lib/auth.ts`
- [x] T031 [P] [US5] Build customer login page supporting OTP flow with countdown timer and password fallback in `src/app/auth/login/page.tsx`
- [x] T032 [US5] Build authenticated customer account dashboard displaying order history and repair tickets in `src/app/account/page.tsx`

---

## Phase 8: User Story 6 - Contractor Bill of Materials (BOM) Estimator (Priority: P2)

**Goal**: Enable electrical contractors to submit multi-line material lists or upload project spreadsheets/PDFs (up to 10MB) for rapid wholesale sales quotations.

**Independent Test**: Paste a 15-item materials list and upload a PDF; verify inquiry receipt code and admin triage visibility.

- [x] T033 [P] [US6] Build contractor BOM submission portal supporting text paste and binary file uploads in `src/app/bom-upload/page.tsx`
- [x] T034 [US6] Implement BOM inquiry ingestion endpoint with file validation (max 10MB) in `src/app/api/bom/route.ts`
- [x] T035 [US6] Build admin BOM inquiry management view with contractor contact and WhatsApp quote actions in `src/app/admin/bom/page.tsx`

---

## Phase 9: User Story 7 - Official Factory Price Lists Hub (Priority: P2)

**Goal**: Provide electricians and trade contractors with 1-click access to verified manufacturer PDF price sheets and discount coefficients with Jalali publication dates.

**Independent Test**: Browse `/price-lists`, filter by brand (Alborz Cable, Motogen, etc.), and download verified PDF with 0 broken links.

- [x] T036 [P] [US7] Create static verified manufacturer price list registry in `src/data/priceLists.ts`
- [x] T037 [US7] Build public Price Lists Hub with brand filtering, Jalali dates, and direct download buttons in `src/app/price-lists/page.tsx`

---

## Phase 10: User Story 8 - Editorial Knowledge Base & Authoring Studio (Priority: P2)

**Goal**: Publish educational technical guides with electrical safety callouts and comparison tables; provide the store owner with a no-code admin Markdown editor and live preview.

**Independent Test**: Open guide to verify `[!TIP]` and `[!WARNING]` styling; in `/admin/articles`, draft article, click "تولید از عنوان", toggle live preview, and publish.

- [x] T038 [P] [US8] Build public educational article reader with custom callout styling and JSON-LD metadata in `src/app/blog/[slug]/page.tsx`
- [x] T039 [US8] Implement administrative Markdown authoring studio with toolbar shortcuts and Persian auto-slug generator in `src/app/admin/articles/page.tsx`
- [x] T040 [US8] Build real-time side-by-side public preview component in `src/app/admin/articles/ArticlesAdminClient.tsx`
- [x] T041 [US8] Implement article CRUD API routes with slug uniqueness enforcement in `src/app/api/admin/articles/route.ts`

---

## Phase 11: User Story 9 - Admin Dashboard, Inventory & Database Backup (Priority: P2)

**Goal**: Empower management with real-time revenue metrics, critical low-stock alerts (≤5 units), order fulfillment controls, and single-click database backup dumps.

**Independent Test**: View `/admin` metrics, identify flagged low-stock items, attach postal tracking numbers, and trigger a database backup in < 5s.

- [x] T042 [P] [US9] Implement administrative aggregate analytics endpoint (revenue, orders, stock, repairs) in `src/app/api/admin/backup/route.ts` and stats
- [x] T043 [US9] Build executive admin dashboard view with metric cards and low-stock alerts table in `src/app/admin/page.tsx`
- [x] T044 [US9] Build product inventory and technical specifications management table in `src/app/admin/products/page.tsx`
- [x] T045 [US9] Build order fulfillment management view with postal tracking code inputs in `src/app/admin/orders/page.tsx`
- [x] T046 [US9] Implement single-click database backup export endpoint generating snapshot in `src/app/api/admin/backup/route.ts`
- [x] T047 [US9] Build database backup management UI with download action in `src/app/admin/backup/page.tsx`

---

## Phase 12: Polish, Verification & Operational Resilience

**Purpose**: Execute end-to-end verification, type checks, route compilation, and zero-crash fallback validations.

- [x] T048 [P] Run static type analysis to ensure zero TypeScript errors (`tsc --noEmit`)
- [x] T049 Test zero-crash static fallbacks by verifying public route rendering during simulated database disconnection in `src/data/products.ts`
- [x] T050 Execute full Next.js production route build (`next build`) to ensure all 55 application routes compile cleanly
- [x] T051 Execute end-to-end verification scenarios per `specs/001-store-workshop-platform/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

```mermaid
flowchart TD
    P1[Phase 1: Setup] --> P2[Phase 2: Foundational Architecture]
    P2 --> P3[Phase 3: US1 Catalog & Search (MVP)]
    P2 --> P4[Phase 4: US2 Dynamic Cart & Dual Invoicing]
    P2 --> P5[Phase 5: US3 Workshop Intake & Tracking]
    P2 --> P6[Phase 6: US4 Chapter 13 Cable Sizer]
    P2 --> P7[Phase 7: US5 Iranian Mobile OTP Auth]
    P2 --> P8[Phase 8: US6 Contractor BOM Estimator]
    P2 --> P9[Phase 9: US7 Factory Price Lists]
    P2 --> P10[Phase 10: US8 Editorial Knowledge Base]
    P2 --> P11[Phase 11: US9 Admin Dashboard & Backup]
    P3 & P4 & P5 & P6 & P7 & P8 & P9 & P10 & P11 --> P12[Phase 12: Polish & Verification]
```

### Parallel Opportunities

- **Foundations**: T005 (`logger.ts`), T006 (`utils.ts`), and T008 (`layout.tsx`) can be developed simultaneously once Prisma schema (T004) is drafted.
- **User Stories (Post-Foundation)**:
  - Developer A can implement US1 Catalog & Search (T009–T013).
  - Developer B can implement US2 Cart & Dual Invoicing (T014–T019).
  - Developer C can implement US3 Repair Intake & Tracking (T020–T024).
  - Developer D can implement US4 Chapter 13 Cable Sizer (T025–T028).
- **Within Each Story**: Core calculation/backend engines (marked `[P]`) can be implemented in parallel with UI templates before integrating.

---

## Implementation Strategy

### 1. MVP Milestone (Phase 1, Phase 2, and Phase 3)
Complete Setup, Foundational schema/logger, and User Story 1 (Catalog Browsing & Multi-Keyword Search). Verify that customers can explore electrical equipment, search using Persian tokens, and view technical datasheets.

### 2. Commercial Core (Phase 4, Phase 5, and Phase 6)
Deliver Dynamic Cart with wholesale discounts, legal corporate invoicing, the Chapter 13 Cable Sizer with 1-click cart addition, and the Technical Repair Workshop intake/tracking portal.

### 3. Customer & B2B Expansion (Phase 7, Phase 8, and Phase 9)
Deliver Iranian mobile OTP authentication, Contractor BOM upload portal, and the official manufacturer Price Lists hub.

### 4. Governance & Resilience (Phase 10, Phase 11, and Phase 12)
Deliver the editorial Markdown authoring studio with live preview, the executive admin dashboard with low-stock alerts and database backup, and execute full `tsc` and `next build` validation suites.
