<!--
Sync Impact Report
- Version change: 1.0.0 -> 1.1.0
- List of modified principles: None
- Added sections:
  - ## Logging
- Removed sections: None
  - Follow-up TODOs: None (All placeholders resolved)
-->

# Shiasi Store & Technical Workshop Platform Constitution

## Core Principles

### I. Triple-Function Local Ecosystem (Shop, Workshop & Engineering)
The platform MUST simultaneously unify three core disciplines: retail/wholesale electrical e-commerce, certified technical repair workshop management, and industrial electrical engineering calculations. The immutable physical and commercial brand identity in Najafabad and Isfahan Province MUST be strictly preserved across all digital interfaces:
- **Commercial Name**: Shiasi Store (*فروشگاه شیاسی*) / Shiasi Technical Service & Rewinding Workshop (*کارگاه خدمات فنی و سیمپیچی شیاسی*).
- **Physical Address**: Isfahan, Najafabad, Central 15 Khordad St., Corner of Narges Dead-End.
- **Unified Geolocation Coordinates**: `32.6365457, 51.3551911` (synchronized across Google Maps, Neshan, and Balad).
- **Official Telecommunications**: Landlines `03142626116` / `03142626107`, and WhatsApp/Mobile `09136260072`.
- **Operating Schedule**: Saturday to Wednesday (`08:30–13:00`, `16:30–21:00`), Thursday morning (`08:30–13:00`), Friday closed.

*Rationale*: Unifying the physical workshop presence with the digital platform builds regional trust, protects local SEO authority, and ensures consistent customer communications.

### II. Zero-Crash Fallback Architecture & Resilient Uptime (NON-NEGOTIABLE)
The platform MUST never present a fatal error screen or crash due to transient database latency, network disruption, or remote connection failure.
- All critical public routes (`/`, `/blog`, `/price-lists`, `/repair-service`) MUST incorporate static fallback datasets (such as `src/data/articles.ts`, cached products, and static reviews) to guarantee 100% continuous uptime.
- Incremental Static Regeneration (ISR) and Static Site Generation (SSG) MUST be prioritized for high-traffic informational and catalog views.
- Workshop intake and customer tracking portals MUST fail gracefully with informative, actionable messaging rather than unhandled exceptions.

*Rationale*: Field electricians, contractors, and local customers often access the platform over unreliable mobile networks; uncompromised uptime and sub-second page loads directly drive customer retention and conversions.

### III. Server-Authoritative Financial Calculations & Dual Invoicing
All client-side computations (product pricing, item subtotals, tiered volume discounts, coupons, and final checkout sums) are strictly treated as advisory display values.
- The checkout API endpoint (`/api/checkout`) MUST independently recalculate all item unit prices, stock availability, tiered wholesale discounts, and coupon validity directly against the PostgreSQL database within an atomic transaction (`$transaction`).
- **Automated Tiered Wholesale Discounts** MUST be enforced server-side:
  - Orders containing ≥ 10 units of a product receive an automatic **5% discount**.
  - Orders containing ≥ 50 units of a product receive an automatic **10% volume discount**.
- **Dual Invoicing Architecture** MUST be fully supported:
  - *Individual (حقیقی)*: Standard B2C invoice for domestic and retail buyers.
  - *Corporate / Legal (حقوقی)*: Official tax-compliant commercial invoice capturing Company Name, National ID (*شناسه ملی*), and Economic Code (*کد اقتصادی*), renderable in standard printable A4 format.

*Rationale*: Guarantees financial and inventory integrity, prevents client-side price tampering, and ensures full compliance with statutory Iranian commercial tax and invoicing requirements.

### IV. Persian RTL Localization, BiDi Isolation & Input Sanitization
The platform MUST be natively Right-to-Left (RTL) styled using the Vazirmatn font family across all Arabic and Persian character subsets with tabular numbers to prevent layout shifts.
- All numeric strings, phone numbers, tracking codes (`REP-YYMMDD-XXXX`, `SH-XXXXXX-XXX`), coordinates, and alphanumeric identifiers displayed in RTL views MUST be wrapped in explicit bidirectional text isolation (`<bdi dir="ltr">`).
- All user phone inputs MUST be processed through `normalizeIranianPhone`, converting Persian (`۰-۹`) and Arabic numerals to ASCII, stripping country code prefixes (`+98`, `0098`), hyphens, and whitespace into standard 11-digit mobile strings (`09xxxxxxxxx`) without rejecting valid customer inputs.

*Rationale*: Eliminates directional punctuation flipping, prevents BiDi layout corruptions in Persian text, and removes checkout friction for non-technical users.

### V. Iranian National Building Regulations Compliance (Chapter 13)
All engineering calculation engines—specifically the Cable Sizing & Voltage Drop Engine (`#calculator` / `CableCalculator`)—MUST strictly adhere to the technical requirements of the **National Iranian Building Regulations Chapter 13 (مبحث ۱۳ مقررات ملی ساختمان)**.
- Voltage drop thresholds MUST NOT exceed **3.0%** for both Single-Phase (220V) and Three-Phase (380V) circuits under standard inductive power factor (\(\cos\phi = 0.85\)).
- Conductor sizing recommendations MUST map exclusively to standard pure annealed copper conductor gauges (1.5mm² up to 120mm²).
- Protective device recommendations MUST specify matching Miniature Circuit Breaker (MCB) curves (B10, B16, C25, C32, C50).
- Users MUST be provided with an immediate one-click action to bundle the computed cable length and recommended breaker directly into the shopping cart.

*Rationale*: Guarantees that electrical designs provided to construction contractors and electricians are legally compliant, electrically safe, and directly linked to procurement.

## Technology Stack & Architectural Standards
The platform architecture is standardized on the following verified stack:
- **Frontend Framework**: Next.js 15 (App Router v15.5.24) using React 19 Server Components (RSC) by default and Client Components (`'use client'`) where interactivity is required.
- **UI Library & Styling**: React 19 and Tailwind CSS 3.4 with custom RTL plugins, Lucide React icons, and a light/dark theme system engineered for zero hydration flash.
- **Typography**: Vazirmatn Persian font family with Latin and Persian glyph subsets.
- **Database & Relational ORM**: PostgreSQL 16 managed through Prisma ORM (v6.19.3) with connection pooling (`pool_limit=10`), indexed queries, and atomic transactions.
- **Authentication & Authorization**: NextAuth.js 4 with JWT sessions, 5-digit SMS OTP verification, and Role-Based Access Control (`CUSTOMER` vs `ADMIN`).
- **SEO & Structured Metadata**: Next.js Metadata API, automated `sitemap.xml` and `robots.txt`, and Schema.org JSON-LD schemas (`Product`, `BreadcrumbList`, `BlogPosting`, `LocalBusiness`).
- **Repair Ticket Lifecycle**: Standardized tracking format (`REP-YYMMDD-XXXX`) traversing 6 stages: `SUBMITTED` ➔ `RECEIVED` ➔ `INSPECTING` ➔ `COST_ESTIMATED` ➔ `REPAIRING` ➔ `READY` ➔ `DELIVERED`.

## Logging
The platform MUST enforce structured, level-appropriate logging across all server routes, background jobs, and operational workflows:
- **Incoming Requests**: All incoming HTTP requests and API invocations MUST be logged at `info` level (capturing HTTP method, pathname, client IP/user-agent, and response status code).
- **Error Handling**: All runtime exceptions, database query errors, unhandled rejections, and security violations MUST be logged at `error` level with full contextual diagnostics and error traces.
- **Operational Actions**: All other actions (such as database query execution details, cache operations, state transitions, and intermediate business calculations) MUST be logged at `debug` level.

*Rationale*: Guarantees high-signal production observability and auditability without polluting operational logs, enabling rapid root-cause analysis during incidents.

## Quality Gates, Admin Governance & Operational Resilience
Development, deployments, and administrative management MUST adhere to strict verification gates:
- **Zero TypeScript Errors**: All source code MUST compile cleanly with zero TypeScript errors (`tsc --noEmit`) prior to commit.
- **Full Production Route Build**: All 55 application routes MUST compile cleanly during `next build`, maintaining static pre-rendering (SSG/ISR) for blog posts and catalog pages.
- **Database Schema Parity**: Prisma schemas MUST remain synchronized with PostgreSQL (`prisma db push` / `prisma generate`).
- **Executive Administration (`/admin`)**: Centralized dashboard monitoring gross revenue, order volume, low-stock threshold alerts (≤ 5 units), and active repair tickets.
- **Disaster Recovery & Backups (`/admin/backup`)**: Single-click manual PostgreSQL backup dumps and documented restore procedures.
- **Editorial Studio (`/admin/articles`)**: No-code Markdown authoring studio with live WYSIWYG side-by-side preview, Persian title-to-slug generation, reading time calculation, and custom callout rendering (`[!TIP]`, `[!WARNING]`, zebra-striped tables).

## Governance
This Constitution is the supreme architectural, engineering, and quality authority for the Shiasi Store & Technical Workshop Platform. All software development, feature specifications, and architectural changes MUST strictly comply with the principles and standards set forth herein.

- **Precedence & Authority**: In any situation where feature requests, quick-fix patches, design drafts, or external guidelines conflict with this Constitution, this Constitution strictly prevails.
- **Amendment Procedure**: Amendments to this Constitution require explicit documentation, architectural justification, and team consensus. Any amendment MUST specify its impact across core principles and architectural standards and include a semantic version increment.
- **Versioning Policy**: This document follows Semantic Versioning (`MAJOR.MINOR.PATCH`):
  - **MAJOR**: Fundamental changes, removal or redefinition of core principles or invariants (e.g. altering server-enforced financial calculations or dismantling the workshop lifecycle).
  - **MINOR**: Addition of new principles, architectural pillars, or significantly expanded technical standards.
  - **PATCH**: Non-semantic clarifications, wording improvements, typo corrections, or minor documentation refinements.
- **Compliance & Workflow**: All Spec Kit workflows (including `/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, and `/speckit-implement`) MUST validate work against the principles, invariants, and quality gates defined in this Constitution.

**Version**: 1.1.0 | **Ratified**: 2026-09-14 | **Last Amended**: 2026-09-14
