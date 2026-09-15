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
**Scale/Scope**: 9 core platform feature domains, 53 application routes, dual B2C/B2B invoicing, single-store multi-channel operations  

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
├── components/
│   ├── CableCalculator.tsx       # Chapter 13 Cable Sizer with 1-click cart bundling
│   ├── Header.tsx                # Navigation, search shortcut (/), and cart badge
│   ├── Footer.tsx                # Workshop geolocation, contact numbers, hours, and credentials
│   ├── InvoicePrint.tsx          # Ministry of Finance compliant A4 tax invoice component
│   └── RepairTracker.tsx         # 7-stage interactive timeline with 1-click approval buttons
├── lib/
│   ├── auth.ts                   # NextAuth configuration and JWT session handlers
│   ├── cableCalculator.ts        # Chapter 13 physics and building code calculation engine
│   ├── logger.ts                 # Constitution v1.1.0 structured logger (info, error, debug)
│   ├── prisma.ts                 # Global Prisma client instance
│   ├── search.ts                 # Persian letterform normalization and multi-field scoring
│   └── utils.ts                  # normalizeIranianPhone, Toman currency formatting, Jalali date helpers
└── data/                         # Zero-crash static fallbacks
    ├── articles.ts               # Pre-rendered educational guides
    ├── products.ts               # Static catalog fallback dataset
    └── priceLists.ts             # Partner manufacturer price sheets
```

---

## Complexity Tracking

> No constitutional violations or unwarranted complexities detected. The architecture preserves direct Prisma database access, Next.js route handlers, and in-memory static fallbacks without unnecessary third-party microservices.
