# Feature Specification: Shiasi Store & Technical Workshop Platform

**Feature Branch**: `001-store-workshop-platform`

**Created**: 2026-09-14

**Status**: Draft

**Input**: User description: "Shiasi Store & Technical Workshop Platform (Najafabad & Isfahan) Master Feature Specifications covering Catalog & Multi-Keyword Search, Dynamic Cart & Dual Invoicing, Technical Repair Intake & Tracking, Chapter 13 Cable Sizer, Contractor BOM Estimator, Official Price Lists, Editorial Knowledge Base, OTP Authentication, and Admin Operations & Backups."
## Clarifications

### Session 2026-09-14
- Q: How should inventory reservation and order expiration be handled for Bank Card-to-Card orders awaiting administrative verification? → A: Temporarily reserve inventory for 8 hours upon order placement; auto-release stock and expire order if receipt is missing or unverified after 8 hours.
- Q: What retry throttling and fallback mechanism should apply when a customer requests an SMS OTP verification code? → A: Enforce a 60-second resend cooldown, maximum 3 OTP requests per 15 minutes per phone number, with optional password login fallback if an account password has been configured.
- Q: How should customer cost approval be recorded when a technical repair ticket reaches the Cost Estimated stage? → A: Hybrid online & SMS workflow: dispatch an automated SMS with direct tracking link upon cost estimation, provide 1-click "Approve Cost" and "Decline Repair" buttons on the customer tracking portal, and permit technicians to log verbal phone approvals in the admin console.

### Session 2026-09-17
- Q: When a customer submits a new product review or rating on the website, should it be published immediately or held in an admin moderation queue for approval? → A: Admin Moderation Queue: Reviews are saved as pending (`isVerified: false`) and only appear on the product page and update the average rating once approved by an admin.
- Q: How should administrators be defined and managed for the website? → A: CLI Command-Line Only: Admins are created or promoted via a secure server-side script (`node scripts/create-admin.js`) for maximum security isolation.
- Q: Should Cash on Delivery (COD / پرداخت در محل) be strictly restricted to local deliveries in Najafabad and Isfahan, or enabled nationwide? → A: Strictly Local Only: COD is available only for Najafabad courier, Isfahan express (SnappBox), and in-store pickup; it is automatically disabled for Post and Tipax.
- Q: When a new customer verifies their SMS OTP for the first time, how should their full name be collected? → A: Immediate Inline Name Step: An inline prompt for full name is presented right after 5-digit OTP verification before redirecting.
- Q: When an admin deletes products that are referenced in past customer orders, how should the system handle the deletion? → A: Smart Guarded Deletion: Products with zero order history are physically deleted along with image files; products linked to past order items are safeguarded from hard deletion and transitioned to an archived/inactive status (`isArchived: true`), hiding them from the storefront catalog while preserving invoice and financial history.
- Q: How should the migration of product images to /public/uploads/products/ be structured to prevent broken links without creating directory clutter? → A: Clean Single-Directory Consolidation with Virtual Rewrite: Move all images from root `/Images` and `/public/images/products` into `/public/uploads/products/`, delete empty redundant source directories, update all database and seed URLs to `/uploads/products/`, and provide a transparent Next.js route rewrite in `next.config.ts` for backward-compatible cache handling without disk duplication.
- Q: When an admin manages contractor Bill of Materials (BOM) inquiries, how should deletion and file cleanup be handled? → A: Two-Stage Archival & Purge Workflow: Deleting a BOM inquiry by default archives it (`isArchived: true`) and shifts it to an "آرشیو استعلام‌ها" view with preserved Excel attachments; administrators can restore archived inquiries with 1-click or execute an explicit permanent purge which deletes the database record and unlinks the attached file from disk with a confirmation modal.
- Q: How should deletion and archival of technical repair tickets in the workshop management console be governed? → A: Hybrid Safety-Locked Archival with Terminal Purge: Active in-progress repair tickets (inspecting, estimating, repairing, ready) are strictly locked from deletion to prevent tracking failures for customers with physical appliances in the shop; completed and cancelled tickets automatically transition to the Workshop Technical Archive preserving diagnosis and parts replacement history; permanent deletion is permitted exclusively from within the archive tab for terminal tickets with explicit confirmation.
- Q: What confirmation friction and interaction design must govern bulk deletion across admin tables (products, BOM inquiries, orders, repairs)? → A: Smart Friction Confirmation Modal: Small batch deletions (1-3 items) require a standard destructive confirmation modal with item enumeration and Escape dismissal; large batch deletions (>3 items or "Delete All") require typing the Persian word "حذف" or the item count into an input box to unlock the danger action, eliminating accidental touchscreen execution.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Digital Catalog Browsing & Multi-Keyword Persian Search (Priority: P1)

Customers, local contractors, and homeowners need to browse industrial and domestic electrical products, filter items across categories and brands, search using conversational or multi-word Persian keywords, and inspect detailed technical specifications before purchasing.

**Why this priority**: Core revenue driver and primary entry point for discovering retail and wholesale electrical equipment.

**Independent Test**: A customer can open the catalog, filter by category or brand, execute a multi-token Persian search query (such as "موتور موتوژن ۳/۴"), inspect full technical specifications on the product page, and verify pricing and stock status without initiating checkout.

**Acceptance Scenarios**:

1. **Given** a customer navigates to the Cooling & Heating category, **When** the page renders, **Then** products such as cooler motors, water pumps, and ventilation fans are displayed with images, brand names, warranty badges, delivery flags, and unit prices in Iranian Toman.
2. **Given** a user enters `"موتور موتوژن ۳/۴"` in the search bar, **When** characters are typed, **Then** the system normalizes Persian and Arabic letter variants (`ي` to `ی`, `ك` to `ک`), matches across title, brand, SKU, and technical descriptions, and returns relevant results within 400 milliseconds.
3. **Given** a desktop user is on any public page, **When** they press the `/` shortcut key, **Then** the search input is instantly focused and ready for text input.
4. **Given** a visitor views a product detail page, **When** inspecting the technical specifications tab, **Then** a structured specifications table (operating voltage, wattage, copper purity, dimensions, warranty duration, country of origin) and downloadable technical datasheets (when available) are presented.

---

### User Story 2 - Dynamic Cart, Tiered Volume Discounts & Dual Tax Invoicing (Priority: P1)

Shoppers and electrical contractors assemble items in a shopping cart that automatically applies tiered volume discounts for bulk quantities. During checkout, buyers choose between an individual consumer receipt or an official, tax-compliant corporate invoice (with Company Name, National ID, and Economic Code), selecting localized shipping methods and verified payment options.

**Why this priority**: Directly converts browsing into transactions while adhering to Iranian commercial and tax regulations for both domestic retail buyers and corporate/contractor clients.

**Independent Test**: Add varying quantities of items to cart, verify that 5% discount applies at 10+ units and 10% applies at 50+ units, toggle between Individual and Legal Corporate invoice modes, select fulfillment and payment methods, and confirm server-side price validation upon order creation.

**Acceptance Scenarios**:

1. **Given** a contractor adds 12 units of a single product to the cart, **When** the cart subtotal is calculated, **Then** an automatic 5% tiered wholesale discount is deducted from that line item total; if quantity reaches 50 or more, an automatic 10% volume discount is deducted.
2. **Given** a corporate buyer proceeds to checkout and selects "صدور فاکتور رسمی حقوقی" (Official Corporate Tax Invoice), **When** toggled, **Then** mandatory fields for Company Name, National ID (شناسه ملی), Economic Code (کد اقتصادی), and Province/City appear with strict validation rules.
3. **Given** a buyer completes an order with Corporate Invoicing, **When** the invoice is generated, **Then** it renders according to the statutory Iranian Ministry of Finance standard A4 layout.
4. **Given** a buyer located in Najafabad or Isfahan proceeds to delivery selection, **When** selecting fulfillment, **Then** the system offers Najafabad In-Store Pickup (0 Toman), Isfahan Express Courier, Tipax Courier, and Post Pishtaz, calculating shipping costs dynamically.
5. **Given** an order submission is processed, **When** received by the server, **Then** all line item prices, tiered discount thresholds, coupon validity, and inventory levels are independently recomputed and verified before the order is confirmed.
6. **Given** a buyer completes an order using Bank Card-to-Card payment, **When** the order is created, **Then** the purchased inventory items are placed into a reserved state for exactly 8 hours pending administrative receipt verification, automatically releasing reserved stock and expiring the order if unverified after 8 hours.

---

### User Story 3 - Technical Repair Workshop Intake & Real-Time Lifecycle Tracking (Priority: P1)

Appliance owners and technicians register repair requests for malfunctioning electrical appliances (evaporative cooler motors, submersible pumps, electric fans, quartz heaters, digital antennas, and electronic circuit boards). Customers receive an identifiable tracking code (`REP-YYMMDD-XXXX`) to track diagnostic progress, review estimated costs, and verify pickup readiness.

**Why this priority**: Represents the physical workshop pillar of the business, fostering long-term local trust and streamlining diagnostic workflows for technicians and clients.

**Independent Test**: Submit a repair request online, receive a formatted tracking code, lookup the ticket via the public tracking page to view current status and cost estimates, and verify that technician updates (e.g., from `INSPECTING` to `READY`) update the customer-facing timeline in real time.

**Acceptance Scenarios**:

1. **Given** a customer with a faulty cooler motor accesses the repair service intake, **When** submitting appliance category, brand/model, issue description, and preferred handover method (in-person drop-off or courier), **Then** a unique tracking code formatted as `REP-YYMMDD-XXXX` is generated and delivery instructions to the Najafabad workshop are displayed.
2. **Given** a customer enters their tracking code or registered phone number on the repair tracking page, **When** queried, **Then** a visual timeline displays the current stage (`SUBMITTED`, `RECEIVED`, `INSPECTING`, `COST_ESTIMATED`, `REPAIRING`, `READY`, or `DELIVERED`), technician notes, estimated vs. final costs in Toman, and direct workshop contact details.
3. **Given** a workshop technician updates a ticket status, notes, or final costs in the administrative portal, **When** saved, **Then** the changes immediately reflect on the customer-facing tracking page without delays.
4. **Given** a repair ticket transitions to the `COST_ESTIMATED` status, **When** the estimate is logged, **Then** the customer receives an automated SMS notification with a direct tracking link, allowing them to click "Approve Cost" or "Decline Repair" directly on the portal, while workshop technicians retain the capability to log verbal phone approvals in the admin console.

---

### User Story 4 - National Building Code Chapter 13 Cable Sizer & MCB Matching (Priority: P1)

Electrical contractors, builders, and electricians input electrical load (Watts or kW), circuit distance (meters), and electrical phase (Single-Phase 220V or Three-Phase 380V) to calculate the safe copper wire cross-section ensuring voltage drop remains strictly under 3.0% in full compliance with National Iranian Building Regulations Chapter 13 (مبحث ۱۳ مقررات ملی ساختمان), with matching circuit breaker trip curves and 1-click shopping cart addition.

**Why this priority**: Bridges technical engineering authority with commercial procurement, giving contractors immediate legal certainty and boosting cable and breaker sales.

**Independent Test**: Enter electrical load and distance for both single-phase and three-phase circuits, verify that the mathematical model calculates nominal current, checks voltage drop against the 3.0% threshold, selects the appropriate standard copper cross-section and MCB rating, and adds the specified cable length and breaker to the cart with one click.

**Acceptance Scenarios**:

1. **Given** a user inputs a 5 kW load over 45 meters on Single-Phase 220V with standard power factor \(\cos\phi = 0.85\), **When** calculated, **Then** the tool computes nominal current (\(\approx 26.7\,\text{A}\)), recommends a \(6\,\text{mm}^2\) pure copper conductor, confirms voltage drop is \(1.8\%\) (< 3.0% regulatory limit), and suggests a matching C32 miniature circuit breaker.
2. **Given** a user inputs a circuit length and load where the initial conductor size produces a voltage drop \(\ge 3.0\%\), **When** evaluated, **Then** the tool displays a warning alert and automatically steps up to the next standard copper wire cross-section until the voltage drop is strictly below 3.0%.
3. **Given** a compliant calculation result is displayed, **When** the user clicks "افزودن سیم و فیوز به سبد خرید" (Add Cable & Breaker to Cart), **Then** the exact calculated length of cable and the recommended circuit breaker are bundled into the cart with accurate quantities.

---

### User Story 5 - Iranian Mobile OTP Authentication & Customer Account Portal (Priority: P1)

Shoppers and returning customers authenticate securely using their 11-digit Iranian mobile number via a 5-digit SMS one-time password (OTP) or password, manage their delivery profile, track current and past orders, and inspect repair tickets.

**Why this priority**: Eliminates password friction for Iranian consumers while providing a secure customer portal for order tracking, repair monitoring, and profile management.

**Independent Test**: Initiate login with an Iranian mobile number entered in Persian digits with spaces or country code prefix, receive and submit the 5-digit verification code, establish an authenticated session, and navigate the account portal to review past orders and repair requests.

**Acceptance Scenarios**:

1. **Given** a customer enters their phone number using Persian numerals, spaces, or prefix formats (e.g. `۰۹۱۳۲۴۵۶۷۸۹`, `+989132456789`, or `0913 245 6789`), **When** submitted, **Then** the system normalizes the input into standard `09XXXXXXXXX` format and sends a 5-digit verification code.
2. **Given** a valid 5-digit OTP token is issued, **When** entered within its 5-minute validity window, **Then** the customer is authenticated with a secure session, and the token is invalidated against reuse.
3. **Given** an authenticated customer navigates to the account dashboard, **When** loaded, **Then** their complete order history (status, total amount, shipping tracking code, downloadable invoice) and registered repair requests are presented.
4. **Given** a customer has requested an SMS OTP, **When** attempting to request another code within 60 seconds, **Then** a countdown timer disables the resend action, and if 3 attempts occur within 15 minutes, further requests are throttled with the option to log in via account password if previously configured.

---

### User Story 6 - Contractor Bill of Materials (BOM) Inquiry & Fast Quotation (Priority: P2)

Electrical contractors and project managers submit structured material lists or paste unstructured text inquiries (list of cables, conduit, miniature circuit breakers, distribution panels, and fixtures) or upload spreadsheets/PDFs to receive comprehensive wholesale price estimates from the store sales desk.

**Why this priority**: Caters to high-volume bulk construction orders that cannot be easily assembled piece-by-piece in a standard consumer cart.

**Independent Test**: Submit a raw text BOM list and an Excel file upload with contact information, verify receipt confirmation with a unique reference code, and verify sales desk visibility in the administrative portal.

**Acceptance Scenarios**:

1. **Given** an electrical contractor pastes a multi-line list of materials into the BOM text area, **When** submitting along with contact details and project city, **Then** the system confirms receipt, issues a reference ticket number, and dispatches the inquiry to the wholesale sales queue.
2. **Given** a project manager uploads an Excel (`.xlsx`, `.xls`) or PDF file of quantities up to 10MB, **When** validated, **Then** the file is safely stored, and a confirmation summary is displayed to the user.

---

### User Story 7 - Official Factory Price Lists Hub & Technical Catalogs (Priority: P2)

Electricians, trade contractors, and retail partners access and download official, verified PDF price lists, discount coefficients, and technical catalogs directly from partnered manufacturing brands (such as Alborz Cable, Motogen, Electrogen, Hani, Pars Khazar, and Deland).

**Why this priority**: Serves as a daily reference utility for tradespeople in the Isfahan/Najafabad region, driving organic professional traffic and cementing commercial credibility.

**Independent Test**: Browse the price lists hub, filter by manufacturer brand and category, inspect Jalali publication dates and discount coefficients, and trigger a direct PDF download.

**Acceptance Scenarios**:

1. **Given** an electrician on a construction site accesses the Price Lists portal, **When** selecting a manufacturer brand (e.g., Alborz Copper Cable), **Then** all active price sheets are displayed with publication date in the Jalali calendar, file size, discount coefficient, and a verified download link.
2. **Given** a user clicks to download a price list, **When** clicked, **Then** the document opens or downloads directly with zero broken links or invalid file references.

---

### User Story 8 - Editorial Technical Knowledge Base & Store Owner Authoring Studio (Priority: P2)

Homeowners and technicians read deeply educational, SEO-optimized repair and installation guides featuring electrical safety alerts and comparison tables. The store owner authors, edits, and publishes guides through an administrative studio equipped with formatting toolbars, automatic Persian slug generation, reading time estimation, and real-time preview.

**Why this priority**: Establishes technical domain authority, captures high-intent organic search traffic across Iran, and empowers the non-technical store owner to publish content independently.

**Independent Test**: View a published article to verify visual callouts, comparison tables, and structured data; log into the administrative article studio, draft a new guide using formatting tools and auto-slug generation, toggle live preview, and publish.

**Acceptance Scenarios**:

1. **Given** a visitor opens an educational guide (such as an evaporative cooler motor troubleshooting guide), **When** rendered, **Then** safety warnings (`[!WARNING]`), technical tip boxes (`[!TIP]`), comparison tables, estimated read time, breadcrumbs, and consultation contact cards are presented.
2. **Given** the store owner enters an article title in the administrative authoring studio, **When** clicking "تولید از عنوان" (Generate from Title), **Then** a sanitized, SEO-friendly Persian URL slug is automatically created.
3. **Given** the store owner is drafting Markdown content, **When** switching to the live preview tab, **Then** the editor renders the exact public layout, styles, callouts, and images before publication.

---

### User Story 9 - Centralized Administrative Dashboard, Inventory Governance & Database Backup (Priority: P2)

Store managers and workshop leads monitor real-time gross revenue, review pending orders, track critical low-stock inventory (<= 5 units), manage product technical specifications and pricing, update order and repair statuses, and execute single-click database backups.

**Why this priority**: Provides operational command and control over retail sales, workshop turnaround, and disaster recovery.

**Independent Test**: Access the administrative dashboard as an authorized administrator, inspect live sales metrics and low-stock alerts, edit product inventory and specifications, print an A4 invoice, and trigger a secure database backup export.

**Acceptance Scenarios**:

1. **Given** an administrator visits `/admin`, **When** the dashboard loads, **Then** aggregate metrics for Total Gross Revenue, Paid Orders Count, Total Active Products, Low-Stock Alerts Count, and Active Workshop Repairs are displayed.
2. **Given** a product's available inventory drops to 5 units or below, **When** viewing the inventory view, **Then** the item is flagged with a high-priority low-stock badge.
3. **Given** an order is opened for fulfillment, **When** clicking "چاپ فاکتور" (Print Invoice), **Then** a clean, thermal- and standard-printer-compatible A4 layout opens with full customer and item details.
4. **Given** an administrator accesses the backup management interface and clicks "دانلود پشتیبان دیتابیس" (Download Database Backup), **When** triggered, **Then** a complete, secure export of database records is generated and downloaded within 5 seconds.

---

### Edge Cases

- **Mixed Persian, Arabic, and Latin Numeral Inputs**: Customers inputting phone numbers, quantities, or search keywords containing mixed ASCII, Persian (`۰-۹`), or Arabic (`٠-٩`) numerals are seamlessly normalized without form errors.
- **Extreme Conductor Sizing Distances**: In the Cable Sizing Calculator, when user inputs an excessive length (e.g. 500 meters at high current) where standard wire sizes cannot keep voltage drop below 3.0%, the system alerts the user that industrial multi-core parallel feeders or transformer relocation are required.
- **Wholesale Tier Threshold Boundaries**: When an order quantity transitions at exact boundary conditions (e.g. exactly 9 vs 10 units for the 5% tier, or 49 vs 50 units for the 10% tier), the system applies the exact prescribed discount percentage without rounding inconsistencies.
- **Corporate Invoicing Missing Data**: When a user selects corporate invoicing but leaves National ID, Economic Code, or Company Name blank or malformed, form validation prevents submission and highlights invalid fields in Persian.
- **Unregistered or Malformed Repair Tracking Code**: When a user searches for an invalid or non-existent tracking code, the system displays an empathetic error message explaining how to locate the tracking code or offering direct phone support.
- **Disrupted Network Connectivity**: During catalog browsing or repair tracking under slow mobile networks, the platform falls back to cached or pre-rendered content rather than displaying an unhandled exception or blank screen.
- **Oversized or Non-Permitted File Uploads in BOM**: If a contractor attempts to upload an unsupported format (e.g. `.exe`) or a file exceeding 10MB, the file is rejected client-side and server-side with clear localized guidance.
- **Simultaneous Inventory Depletion**: If multiple shoppers attempt to checkout the last remaining units of a product concurrently, atomic server validation prevents overselling and notifies the customer gracefully.
- **Card-to-Card Payment Verification Expiry**: For orders placed using Bank Card-to-Card payment, inventory items are temporarily held in a reserved state for up to 8 hours; if the bank transfer receipt is not uploaded or administrative verification is not completed within 8 hours, the order status transitions to `EXPIRED` and reserved items are automatically released back to active stock.
- **SMS OTP Throttling & Carrier Delays**: When a customer requests multiple verification codes, resend requests are locked behind a 60-second cooldown timer, with a strict cap of 3 OTP dispatches per 15 minutes per phone number; customers who have established an account password can switch to password authentication immediately.
- **Repair Estimate Declined or Unanswered**: If a customer explicitly declines an estimated repair cost or fails to approve it within 5 business days, the ticket transitions to `CANCELLED` (or `READY` for pickup in unrepaired condition) without incurring unauthorized labor or replacement costs.

---

## Requirements *(mandatory)*

### Functional Requirements

#### Catalog & Multi-Keyword Search (`FEAT-CATALOG`)
- **FR-001**: The system MUST organize products into 5 primary domains: Cooling/Heating, Wiring & Building, Lighting & Fixtures, Heating & Tools, and Maker Electronics.
- **FR-002**: The catalog MUST support multi-parameter filtering by price range, manufacturer brand, stock availability, and promotional badges (Featured, Best Seller, Special Offer).
- **FR-003**: The search engine MUST support multi-token Persian keyword queries, normalizing Persian and Arabic character variants (`ي`/`ی`, `ك`/`ک`, `ة`/`ه`), matching across title, brand, SKU, and technical specifications.
- **FR-004**: The system MUST provide global keyboard shortcut navigation (`/`) to focus the search bar from any desktop view.
- **FR-005**: Every product detail page MUST present a structured technical specification table (voltage, wattage, conductor purity, dimensions, warranty duration, country of origin).
- **FR-006**: Product detail pages MUST support downloadable technical datasheets and manuals when available.

#### Dynamic Cart, Tiered Discounts & Invoicing (`FEAT-CHECKOUT`)
- **FR-007**: The cart system MUST dynamically calculate line item subtotals, shipping costs, coupon discounts, and final payable amounts denominated in Iranian Toman.
- **FR-008**: The pricing engine MUST automatically apply tiered wholesale volume discounts:
  - 5% discount on the line item total for quantities between 10 and 49 units.
  - 10% discount on the line item total for quantities of 50 units or greater.
- **FR-009**: The checkout engine MUST support Dual Invoicing selection:
  - *Individual (حقیقی)* for standard retail consumers.
  - *Corporate / Legal (حقوقی)* requiring Company Name, National ID (شناسه ملی), and Economic Code (کد اقتصادی), generating a Ministry of Finance compliant A4 layout.
- **FR-010**: The fulfillment engine MUST support 4 localized shipping methods: Najafabad In-Store Pickup, Isfahan Express Courier, Tipax Courier, and Post Pishtaz.
- **FR-011**: The checkout engine MUST support 3 payment options: Online Payment Gateway, Cash on Delivery (Najafabad and Isfahan metro), and Bank Card-to-Card with receipt proof upload. For Card-to-Card orders, inventory MUST be temporarily reserved for up to 8 hours pending administrative receipt verification, automatically releasing reserved stock and transitioning the order to expired status if unverified after 8 hours.
- **FR-012**: The server MUST independently recalculate and validate all item prices, stock availability, tiered discounts, and coupon rules during order creation, rejecting any client-tampered values.

#### Technical Repair Workshop Intake & Tracking (`FEAT-REPAIR`)
- **FR-013**: The repair intake portal MUST register tickets across 6 appliance groups: Evaporative Cooler Motors, Submersible Water Pumps, Electric Fans, Quartz Heaters, Digital Antennas, and Electronic Circuit Boards.
- **FR-014**: Every repair ticket MUST generate a unique, bidirectional-isolated tracking code formatted as `REP-YYMMDD-XXXX`.
- **FR-015**: The repair lifecycle MUST track through 7 sequential states: `SUBMITTED`, `RECEIVED`, `INSPECTING`, `COST_ESTIMATED`, `REPAIRING`, `READY`, and `DELIVERED`, plus `CANCELLED`.
- **FR-016**: The customer repair tracker MUST display an interactive status timeline, technician notes, estimated vs. final costs in Toman, and workshop contact details. When a ticket enters `COST_ESTIMATED`, the system MUST dispatch an automated SMS with a direct tracking link, provide 1-click "Approve Cost" and "Decline Repair" action buttons on the tracking portal, and allow technicians to record verbal phone approvals in the admin console.
- **FR-017**: Workshop technicians MUST have administrative access to update ticket status, append diagnostic work notes, and record final parts and labor costs.

#### National Building Code Chapter 13 Cable Sizer (`FEAT-CABLE-CALC`)
- **FR-018**: The calculation engine MUST compute circuit current using:
  - Single-Phase (220V): \(I = \frac{P}{V \times \cos\phi}\)
  - Three-Phase (380V): \(I = \frac{P}{\sqrt{3} \times V \times \cos\phi}\)
  with standard default power factor \(\cos\phi = 0.85\).
- **FR-019**: The calculation engine MUST compute percentage voltage drop using:
  $$\Delta V\% = \frac{2 \times L \times I \times \rho}{S \times V} \times 100$$
  where resistivity \(\rho = 0.0175\,\Omega\cdot\text{mm}^2/\text{m}\) for pure annealed copper conductor, \(L\) is distance in meters, \(S\) is conductor cross-section in \(\text{mm}^2\), and \(V\) is line voltage.
- **FR-020**: The tool MUST strictly flag any circuit resulting in a voltage drop \(\Delta V\% \ge 3.0\%\) as non-compliant per National Iranian Building Regulations Chapter 13.
- **FR-021**: The engine MUST automatically recommend the minimum standard copper cross-section (1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120 \(\text{mm}^2\)) that maintains voltage drop strictly below 3.0%.
- **FR-022**: The tool MUST recommend a matching Miniature Circuit Breaker (MCB) trip curve and current rating (B10, B16, C25, C32, C40, C50, C63) based on calculated load current.
- **FR-023**: The tool MUST provide a 1-click action to bundle the computed cable length and recommended breaker directly into the shopping cart.

#### Contractor Bill of Materials (BOM) Estimator (`FEAT-BOM-QUOTE`)
- **FR-024**: The BOM intake MUST accept both unstructured multi-line text lists and binary file uploads (`.xlsx`, `.xls`, `.pdf`, `.csv`) up to 10MB in size.
- **FR-025**: Each BOM submission MUST capture contractor name, project city, contact mobile number, optional company details, and project notes.
- **FR-026**: Sales administrators MUST be able to review BOM inquiries with direct communication actions (telephone and WhatsApp link).

#### Official Factory Price Lists Hub (`FEAT-PRICE-LISTS`)
- **FR-027**: The portal MUST catalog official manufacturer price sheets by brand, product category, and publication date.
- **FR-028**: Each entry MUST display publication date in the Jalali calendar, file size, wholesale discount coefficient, and a verified direct download link.

#### Editorial Knowledge Base & Authoring Studio (`FEAT-KNOWLEDGE`)
- **FR-029**: Educational articles MUST support formatted rich-text elements including electrical safety warnings (`[!WARNING]`), technical tips (`[!TIP]`), and comparison tables.
- **FR-030**: Public article views MUST provide structured metadata including breadcrumb navigation, estimated reading time, author attribution, and publication dates.
- **FR-031**: The administrative authoring studio MUST include toolbar formatting shortcuts, automatic Persian slug generation from title, reading time estimation, and a real-time side-by-side preview.
- **FR-032**: The article publishing system MUST enforce unique slugs and validate required fields (title, summary, content, category) prior to publication.

#### Customer Account & Authentication (`FEAT-AUTH-ACC`)
- **FR-033**: The authentication engine MUST normalize all Iranian mobile phone inputs, converting Persian/Arabic digits, stripping country codes (`+98`, `0098`), hyphens, and whitespace into standard `09XXXXXXXXX` strings.
- **FR-034**: The system MUST issue 5-digit verification codes expiring after 5 minutes, invalidating each code upon successful verification. Resend requests MUST enforce a 60-second cooldown timer, cap dispatches to 3 requests per 15 minutes per phone number, and allow users with an existing password to authenticate via password alternative.
- **FR-035**: Authenticated users MUST have access to an account portal showing their order history, fulfillment status, downloadable invoices, and repair tickets.
- **FR-036**: The system MUST enforce role-based access control, preventing unauthorized access to administrative routes.

#### Administrative Dashboard & Operations (`FEAT-ADMIN-OPS`)
- **FR-037**: The administrative dashboard MUST compute and display aggregate metrics: Total Gross Revenue, Paid Orders Count, Total Active Catalog Products, Low-Stock Count, and Active Repair Count.
- **FR-038**: Inventory management MUST flag products with available stock \(\le 5\) units as low stock.
- **FR-039**: Order management MUST allow administrators to update order fulfillment states, attach courier tracking codes, and generate printable A4 tax invoices.
- **FR-040**: The administrative console MUST provide a single-click database backup export tool that generates a downloadable snapshot of all platform records.
- **FR-041**: The admin product catalog management MUST support single and bulk product deletion with Smart Guarded Deletion: products with zero order history are physically deleted along with their image assets; products referenced in existing customer orders are transitioned to an archived/inactive status (`isArchived: true`), removing them from the public store while preserving historical invoices and tax records.
- **FR-042**: All product catalog media assets MUST reside in `/public/uploads/products/` as the single source of truth, with redundant folders pruned and legacy asset routes transparently rewritten via Next.js configuration to prevent 404 broken images on cached mobile clients.
- **FR-043**: The admin BOM inquiry console MUST provide a Two-Stage Archival & Purge workflow: default deletion transitions inquiries to an archived view (`isArchived: true`) with preserved attachments, offering 1-click restoration and an explicit permanent purge modal that deletes the database record and removes the physical Excel/PDF file from disk.
- **FR-044**: The workshop repair admin console MUST implement a Hybrid Safety-Locked Archival workflow: active in-progress tickets (inspecting, estimating, repairing, ready) are strictly locked from deletion; completed or cancelled tickets transition to a searchable Workshop Technical Archive (`isArchived: true`) preserving historical diagnosis and parts replacement records; permanent purge is restricted to terminal records within the archive view.
- **FR-045**: All administrative bulk deletion workflows (Products, BOMs, Orders, Repairs) MUST implement a Smart Friction confirmation dialog adhering to WCAG and Web Design Guidelines: displaying affected item counts, trapping focus, supporting Escape dismissal, and requiring explicit input ("حذف") for batches exceeding 3 items or selecting all records.

---

### Key Entities

- **Product**: Unique identifier, title, URL slug, SKU, manufacturer part number (MPN), category reference, retail price, promotional price, discount percentage, available stock quantity, minimum order quantity (MOQ), brand name, warranty terms, country of origin, delivery badges, `isArchived` retention flag, and creation/update timestamps.
- **Category**: Unique identifier, title, URL slug, descriptive summary, icon identifier, display sort order, and parent category reference.
- **ProductSpec**: Unique identifier, product reference, specification label, specification value, and display order.
- **Cart & CartItem**: Session or customer reference, product reference, quantity, unit price at addition, applied tiered discount rate, and calculated line item total.
- **Order & OrderItem**: Order reference code (`SH-YYMMDD-XXX`), customer name, normalized phone number, delivery address, city, postal code, invoice type (Individual vs Corporate), company name, national ID, economic code, subtotal amount, volume discount amount, coupon discount amount, shipping fee, final payable amount, shipping method, payment method, payment status, order status, carrier tracking code, and inventory reservation expiration timestamp (`reservedUntil`, 8-hour window for Card-to-Card).
- **Coupon**: Promotional coupon code, discount percentage or fixed deduction, minimum qualifying order amount, expiration date, usage limit, and active status flag.
- **RepairTicket**: Unique tracking code (`REP-YYMMDD-XXXX`), customer name, normalized phone number, appliance category, brand and model, defect description, delivery handover method, current lifecycle status, estimated cost, final cost, cost approval status (`PENDING`, `APPROVED`, `DECLINED`), approval channel (`PORTAL`, `SMS`, `PHONE`), approval timestamp, technician work notes, `isArchived` retention flag, and date milestones.
- **BOMSubmission**: Unique inquiry code, contractor name, mobile phone number, project city, company name, text description of materials, attached document file path, file MIME type, inquiry status, `isArchived` retention flag, and sales admin notes.
- **ManufacturerPriceList**: Brand name, title, category, publication date (Jalali and Gregorian), file download URL, file size, wholesale discount coefficient, and active status flag.
- **Article**: Title, URL slug, summary, content, category, comma-separated tags, estimated read time, featured image URL, author name, view counter, publication status, and publication date.
- **User & VerificationToken**: Full name, normalized mobile number, email address, password hash (optional), user role (`CUSTOMER`, `ADMIN`), postal address, city, postal code, national identity number, company name, economic code, token code, expiration timestamp, resend attempt count, cooldown until timestamp, and session state.
- **StoreSetting**: Key-value pairs governing store operations (contact phone numbers, operating hours, geolocation coordinates, announcement banners, and payment gateway configuration).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of catalog and keyword search queries return relevant matching products in under 400 milliseconds.
- **SC-002**: 100% of customer phone number inputs containing Persian/Arabic numerals or international country codes are successfully sanitized and normalized without user validation errors.
- **SC-003**: 100% of cable sizing calculations mathematically conform to National Iranian Building Regulations Chapter 13, guaranteeing that recommended conductor cross-sections maintain voltage drop strictly below 3.0%.
- **SC-004**: 100% of completed orders undergo server-side authoritative price and discount recalculation, completely preventing client-side price or discount tampering.
- **SC-005**: First-time customers can complete the entire checkout flow in under 90 seconds.
- **SC-006**: Customer repair tracking lookups by tracking code or phone number resolve in under 500 milliseconds.
- **SC-007**: Mobile OTP authentication flow completes within 2 steps and in under 20 seconds from number entry to session establishment.
- **SC-008**: Single-click administrative database backup export executes and initiates download in under 5 seconds.
- **SC-009**: 100% of public informational routes maintain zero-crash uptime by serving static or cached fallback content during transient database or network disruptions.
- **SC-010**: Store owner can draft, preview with exact public styles, and publish an educational article in under 5 minutes without technical assistance.
- **SC-011**: 100% of corporate orders capture valid Company Name, National ID, and Economic Code, and produce a printable A4 invoice formatted to Iranian tax authority standards.
- **SC-012**: 100% of core customer journeys (catalog search, cable calculation, repair tracking, and checkout) render seamlessly on mobile viewports with native Persian Right-to-Left (RTL) alignment and bidirectional numeral isolation.

---

## Assumptions

- **Target Audience & Connectivity**: Users access the platform primarily from Isfahan Province and Najafabad via mobile devices over standard Iranian cellular networks (3G/4G/5G/WiFi), requiring lightweight assets and zero-crash fallbacks.
- **Electrical Standards**: Cable sizing calculations assume standard nominal single-phase voltage of 220V AC, three-phase voltage of 380V AC, frequency of 50 Hz, standard inductive power factor \(\cos\phi = 0.85\), and pure annealed copper conductor resistivity \(\rho = 0.0175\,\Omega\cdot\text{mm}^2/\text{m}\).
- **Payment & Invoicing Regulations**: Invoices and prices are denominated in Iranian Toman (تومان). Corporate tax invoices conform to the layout required by the Iranian Ministry of Economic Affairs and Finance.
- **SMS OTP Gateway**: Mobile authentication assumes integration with an Iranian SMS gateway capable of delivering 5-digit verification codes within 15 seconds.
- **Regional Fulfillment Hierarchy**: Local order fulfillment prioritizes Najafabad in-store pickup and Isfahan express couriers, while national distribution utilizes Tipax and Post Pishtaz.
- **Physical Workshop Co-Location**: Technical repair services are physically conducted at the Najafabad workshop location (Corner of Narges Dead-End, Central 15 Khordad St., Najafabad).
