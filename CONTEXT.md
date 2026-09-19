# Shiasi Store & Technical Workshop Platform

Unified digital ecosystem combining retail/wholesale electrical equipment commerce, certified electro-mechanical repair workshop management, and statutory Chapter 13 engineering calculations in Najafabad and Isfahan.

## Language

### E-Commerce & Invoicing

**Order**:
A finalized commercial purchase comprising verified catalog products, fulfillment method, and payment status.
_Avoid_: Purchase, transaction, checkout session

**Dual Invoice**:
The two statutory invoice classifications: Individual (*حقیقی*) consumer receipt or Corporate (*حقوقی*) commercial tax invoice with Company Name, National ID, and Economic Code.
_Avoid_: Bill, receipt, invoice mode

**Tiered Wholesale Discount**:
Automatic volume reductions applied server-side: 5% for line item quantities >= 10, and 10% for quantities >= 50.
_Avoid_: Bulk discount, promo rate, deal

**Card-to-Card Reservation**:
An 8-hour inventory hold window for orders awaiting bank transfer receipt verification, after which unverified stock is automatically released.
_Avoid_: Pending hold, cart lock

### Technical Workshop

**Repair Ticket**:
An authenticated diagnostic and servicing record for an appliance traversing the 7-stage lifecycle (SUBMITTED -> RECEIVED -> INSPECTING -> COST_ESTIMATED -> REPAIRING -> READY -> DELIVERED).
_Avoid_: Service request, job order, fix ticket

**Cost Approval**:
The customer's authorization (APPROVED or DECLINED) of estimated repair parts and labor costs logged via 1-click web portal, automated SMS, or technician phone entry.
_Avoid_: Estimate sign-off, quote confirmation

**Appliance Group**:
The 6 certified workshop servicing categories: Evaporative Cooler Motors, Submersible Water Pumps, Electric Fans, Quartz Heaters, Digital Antennas, and Electronic Circuit Boards.
_Avoid_: Device type, equipment class

### Engineering & B2B Procurement

**Cable Sizer**:
The mathematical engine calculating nominal current, standard copper wire cross-section (1.5mm2 to 120mm2), and voltage drop strictly under 3.0% per National Iranian Building Regulations Chapter 13.
_Avoid_: Wire calculator, gauge finder

**BOM Inquiry**:
An unstructured or spreadsheet-based Bill of Materials submitted by contractors for fast wholesale quotation by the sales desk.
_Avoid_: Material list, quotation request, RFQ

**Factory Price List**:
Verified manufacturer PDF catalog and discount coefficient sheets for partnered brands (Alborz Cable, Motogen, Electrogen, Hani) dated in the Jalali calendar.
_Avoid_: Rate card, brand catalog
