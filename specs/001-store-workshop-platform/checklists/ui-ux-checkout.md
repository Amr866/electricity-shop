# UI/UX, Checkout & Authentication Requirements Quality Checklist

**Purpose**: Requirements-quality review checklist ("Unit Tests for English") validating that specifications for UI/UX fixes, mobile layout, checkout validations, and unified authentication are complete, unambiguous, and testable.  
**Created**: 2026-09-17  
**Feature**: [`spec.md`](../spec.md) | [`plan.md`](../plan.md) | [`tasks.md`](../tasks.md)  

**Review Ownership**: Reviewer-owned requirements-quality review artifact. Mark `[x]` only when the reviewer determines the requirements-quality criterion is satisfied.  
**Marker Semantics**: `[x]` means the criterion has been reviewed and satisfied for requirements quality; it does not mean implementation work is complete.

---

## 1. Visual Hierarchy & Mobile Viewport Layout

- [x] CHK001 Are minimum vertical bottom clearance dimensions (`pb-32` / ~128px) explicitly specified to guarantee that floating sticky buy bars and bottom navigation never cover interactive elements (review textarea, submit buttons, related cards)?
- [x] CHK002 Is the mobile store brand title length constraint in `Header.tsx` specified without restrictive fixed widths (`max-w-[210px]`) so "فروشگاه شیاسی" never truncates to "فروشگ..."?
- [x] CHK003 Are the exact trigger boundaries for the `IntersectionObserver` defined (e.g. `threshold: 0`, disappearing when main purchase box enters viewport) to prevent duplicate Add-to-Cart buttons from rendering simultaneously?
- [x] CHK004 Are rating star elements (`★ 4.9`) and warranty badges (`۲ سال ضمانت...`) assigned dedicated, non-competing layout slots on 2-column mobile cards to prevent text truncation and horizontal wrapping collisions?
- [x] CHK005 Is desktop header collapse scroll threshold quantified with hysteresis values (e.g. hide above 160px, show below 80px) to prevent recursive height-shrink jitter?
- [x] CHK006 Does the breadcrumb specification preserve RTL fraction glyphs (`۳/۴`) using `<bdi>` elements and horizontal overflow without aggressive string slicing?

---

## 2. Product Catalog, Content & Pricing Logic

- [x] CHK007 Is the pricing unit rule (`/متر` vs `/عدد`) constrained to product category taxonomy (`category.slug === 'wiring' || category.slug === 'cable'`) rather than generic string matching on `"سیم"`?
- [x] CHK008 Does the specification explicitly forbid `/متر` from matching motor winding descriptions (`"سیم‌پیچ"`, `"سیم‌پیچی"`)?
- [x] CHK009 Are fallback percentage calculations in `ProductReviewsTab` defined to display 0% across all star ratings when no reviews exist in the database, rather than defaulting to hardcoded values that sum to 130%?
- [x] CHK010 Are bulk wholesale tier discount titles defined dynamically according to product taxonomy (e.g. "تخفیف پله‌ای خرید عمده و تعداد بالا:" for motors vs "متراژ بالا:" for cables)?
- [x] CHK011 Are all product gallery images specified to match the exact product catalog entity (e.g. verifying cooler motor `APP-CLR-MOT75` displays motors rather than industrial generators)?

---

## 3. Checkout, Postal Code & Cash on Delivery (COD)

- [x] CHK012 Is postal code validation specified as strictly mandatory for 100% of checkout orders, rejecting empty inputs or character lengths other than exactly 10 ASCII/Persian digits?
- [x] CHK013 Are real-time client-side Persian error messages defined for postal code validation failure (e.g. "کد پستی باید دقیقاً ۱۰ رقم عددی باشد")?
- [x] CHK014 Is Cash on Delivery (`cod_isfahan`) restricted to eligible local shipping methods (Najafabad & Isfahan fast couriers), and disabled for nationwide Post or Tipax?
- [x] CHK015 Is the checkout call-to-action button copy dynamically updated to "ثبت سفارش با پرداخت در محل" with delivery iconography when COD is selected?
- [x] CHK016 Does the order tracking specification define an explicit green reassurance alert clarifying that online payment was not executed and settlement is collected upon physical delivery via mobile POS or cash?

---

## 4. Unified Authentication & Admin Security

- [x] CHK017 Is the single phone number entry step specified to accept Iranian mobile numbers (`09xxxxxxxxx`) without requiring the user to manually pre-select "Customer" vs "Admin" tabs?
- [x] CHK018 Does the specification define the lookup API contract (`/api/auth/check-user`) returning account capability flags (`hasPassword`, `role`)?
- [x] CHK019 For accounts with passwords (Admins), does the specification provide dual login options: "ورود با رمز عبور" (Password) with an instant toggle to "ورود با کد یکبار مصرف پیامکی (OTP)"?
- [x] CHK020 For new customer phone numbers, does the specification define automatic account creation upon verifying the 5-digit OTP without blocking checkout or browsing?
- [x] CHK021 Is the 120-second countdown timer, resend cooldown, and single-use OTP invalidation cycle clearly documented?
- [x] CHK022 Is the admin promotion workflow defined (via CLI script or database migration) using secure password hashing?

---

## 5. Admin Order Operations & Data Management

- [x] CHK023 Is the order deletion action guarded by server-side `ADMIN` session validation?
- [x] CHK024 Does the specification define a modal confirmation dialog warning the admin before permanent deletion?
- [x] CHK025 Are cascade deletion rules specified to clean up child `OrderItem` records and transaction logs in a single Prisma transaction?
- [x] CHK026 Does the specification define a bulk "حذف سفارش‌های تستی / نمونه" filter or action to purge mock seed orders without touching production data?

---

## Notes & Review Guidance

- Mark items `[x]` as you verify that the requirement meets quality and clarity criteria.
- Leave items unchecked `[ ]` if any requirement remains ambiguous, underspecified, or conflicting.
- This checklist does not replace runtime test verification (`playwright` / `typecheck`), but serves as the quality gate for design completeness before and during code implementation.
