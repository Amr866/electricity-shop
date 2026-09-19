# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary Users**: Electricians, technical contractors, and building wiring project leads in Isfahan and Najafabad needing reliable, verified components, official manufacturer price lists, fast BOM estimations, and Chapter 13 regulatory calculations.
- **Secondary Users**: Homeowners and retail consumers seeking repair and servicing for domestic electrical appliances (cooler motors, fans, heaters, water pumps) or retail hardware with fast local delivery/in-store pickup.
- **Administrative Users**: Shiasi workshop technicians and sales desk managers logging diagnostics, managing inventory, processing official corporate tax invoices, and triaging BOM quotes.

## Product Purpose

Unify physical electro-mechanical workshop repair operations, retail and wholesale e-commerce, and statutory electrical engineering calculations into a resilient, zero-crash digital platform.

## Positioning

The only regional electrical platform in Isfahan/Najafabad combining statutory Chapter 13 engineering calculations with 1-click cart fulfillment, certified physical electro-mechanical rewinding services with online lifecycle tracking, and official corporate tax invoicing.

## Operating Context

- Mobile and field environments: Electricians and contractors checking cable sizing and price lists on mobile networks on-site.
- Workshop bench: Physical service technicians in Najafabad recording diagnostic findings, estimating parts/labor costs, and dispatching 1-click customer SMS approvals.
- High-volume construction orders: Contractors submitting multi-line material lists or spreadsheets (BOM) for fast wholesale quotes.

## Capabilities and Constraints

- Next.js 15 App Router + React 19 + Tailwind CSS RTL with Vazirmatn Persian typography.
- PostgreSQL 16 via Prisma ORM with connection pooling.
- Server-authoritative calculations with 5% (>=10 units) and 10% (>=50 units) tiered wholesale discounts.
- 8-hour inventory reservation window for Bank Card-to-Card payments.
- Chapter 13 cable calculation engine adhering strictly to Delta V% < 3.0% with pure copper ladder (1.5mm2 to 120mm2).
- 7-stage repair ticket lifecycle with 1-click customer approval.

## Brand Commitments

- **Commercial Name**: Shiasi Store (فروشگاه شیاسی) / Shiasi Technical Service & Rewinding Workshop (کارگاه خدمات فنی و سیم‌پیچی شیاسی).
- **Physical Location**: Isfahan, Najafabad, Central 15 Khordad St., Corner of Narges Dead-End.
- **Telecommunications**: Landlines 03142626116 / 03142626107, Mobile 09136260072.
- **Coordinates**: 32.6365457, 51.3551911.

## Product Principles

1. **Zero-Crash Resilient Uptime**: All high-traffic public routes must serve static fallbacks during transient database disruptions.
2. **Server-Authoritative Commercial Truth**: Never trust client calculations for pricing, discounts, or inventory holds.
3. **Regional Trust & Physical Co-Location**: Anchor all digital interfaces to the verified physical workshop and phone lines.
4. **Engineering Rigor**: Compliance with National Building Regulations Chapter 13 is non-negotiable.

## Accessibility & Inclusion

- Native Persian Right-to-Left (RTL) layout with explicit bidirectional text isolation (<bdi dir=ltr>) on tracking numbers and codes.
- Tabular numerals (tabular-nums) to prevent layout shifts.
- Mobile-first responsive touch targets (minimum 44x44px).
