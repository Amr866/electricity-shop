---
name: Shiasi Store & Technical Workshop Design System
description: Industrial electrical hardware, rewinding workshop, and engineering calculations design system
colors:
  primary: #f59e0b
  primary-hover: #d97706
  copper: #ea580c
  copper-hover: #c2410c
  isfahan-azure: #0284c7
  isfahan-turquoise: #14b8a6
  bg-light: #f8fafc
  bg-dark: #020617
  card-light: #ffffff
  card-dark: #0f172a
  text-primary-light: #0f172a
  text-primary-dark: #f8fafc
  text-muted-light: #64748b
  text-muted-dark: #94a3b8
  border-light: #e2e8f0
  border-dark: #1e293b
typography:
  fontFamily: var(--font-vazirmatn), system-ui, sans-serif
  direction: rtl
rounded:
  sm: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
spacing:
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
---

# Design System: Shiasi Store & Technical Workshop

## Overview
A distinct, grounded industrial visual identity reflecting physical copper windings, electric current, and the regional craftsmanship of Isfahan and Najafabad. Built for high legibility on mobile networks in field conditions, fast task completion, and zero layout shift.

## Colors
- **Electric Amber Primary (#f59e0b / rand-500)**: Core brand accent, high-visibility actions, and voltage status.
- **Pure Copper Accent (#ea580c / copper-600)**: Highlighting conductors, copper purity, and physical rewinding workshop authority.
- **Persian Azure & Turquoise (#0284c7 & #14b8a6)**: Reflecting Isfahan tile heritage and trusted water pump/cooling services.
- **Industrial Slate Neutral (#020617 / #0f172a dark, #f8fafc light)**: High contrast backgrounds with 4.5:1+ text contrast ratio.

## Typography
- **Primary Typeface**: Vazirmatn Persian font family across all weights (400, 500, 600, 700, 800, 900).
- **Tabular Numerals**: Enforced via 	abular-nums on all currency, prices, cable gauges, and tracking codes.
- **BiDi Isolation**: Mandatory <bdi dir=ltr> wrapper on all alphanumeric identifiers, phone numbers, and coordinates.

## Layout
- **Directionality**: Pure RTL (dir=rtl).
- **Mobile-First Responsive**: Zero horizontal scrollbars. Seamless scaling at 375px, 768px, 1024px, and 1440px.
- **Ergonomic Touch Targets**: Minimum 44x44px clickable area on mobile bottom nav, buttons, and form selectors.

## Elevation & Depth
- **Surface Elevation**: Subtle 1px borders with dark/light mode parity.
- **Electric Glow**: Specialized box shadows (shadow-electric-glow, shadow-copper-glow) reserved for key actions and active state indicators.

## Shapes
- **Corner Radii**: 12px (
ounded-xl) for cards and inputs; 16px (
ounded-2xl) for major containers and dialogs.

## Components
- **LiveSearchBar**: Global / keyboard shortcut, real-time dropdown, recent query history.
- **ElectricalCableCalculator**: Interactive slider inputs, compliance badges, matching MCB card, and 1-click cart bundling.
- **RepairTracker**: 7-stage interactive timeline with 1-click customer cost approval buttons.
- **AdminClientTables**: Interactive client-side triage tables with search, filter, and quick communication links.

## Do's and Don'ts
- **DO**: Use Lucide SVG vector icons exclusively with ria-hidden=true or ria-label.
- **DO**: Wrap all tracking codes (REP-..., SH-...) in <bdi dir=ltr>.
- **DON'T**: Use emojis as UI icons.
- **DON'T**: Use naked outline-none without visible focus rings (ocus-visible:ring-2).
- **DON'T**: Animate layout properties (width, height, margin); animate opacity and 	ransform only.
