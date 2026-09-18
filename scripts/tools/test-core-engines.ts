import {
  calculateTieredUnitPrice,
  calculateOrderFinancials,
  sortItemsForDeterministicLock,
  generateOrderNumber,
  calculateReservationExpiry,
  validateCorporateInvoice,
} from "../../src/lib/checkoutEngine";

import {
  isValidRepairTransition,
  generateRepairTrackingCode,
  evaluateCostApprovalDecision,
  getCostEstimationSmsPayload,
  getRepairStageMetadata,
} from "../../src/lib/repairLifecycle";

import {
  calculateCableRequirements,
  createChapter13CartBundle,
  getFeederEngineeringAdvice,
} from "../../src/lib/cableCalculator";

function runTests() {
  console.log("=================================================");
  console.log("STARTING DECOUPLED CORE ENGINES VERIFICATION");
  console.log("=================================================\n");

  // -------------------------------------------------------------
  // ENGINE 1: Checkout & Pricing Engine
  // -------------------------------------------------------------
  console.log("--- TEST SUITE 1: E-COMMERCE CHECKOUT & PRICING ENGINE ---");

  // 1.1 Tiered Discounts (Constitution Principle III)
  const tier0 = calculateTieredUnitPrice(100000, 5);
  if (tier0.discountPercent !== 0 || tier0.unitPrice !== 100000) {
    throw new Error(`Failed tier 0: expected 0% & 100000, got ${tier0.discountPercent}% & ${tier0.unitPrice}`);
  }
  console.log("✅ 1.1a Tier 0 (<10 units) -> 0% discount verified.");

  const tier5 = calculateTieredUnitPrice(100000, 12);
  if (tier5.discountPercent !== 5 || tier5.unitPrice !== 95000) {
    throw new Error(`Failed tier 5: expected 5% & 95000, got ${tier5.discountPercent}% & ${tier5.unitPrice}`);
  }
  console.log("✅ 1.1b Tier 1 (>=10 units) -> 5% wholesale discount verified.");

  const tier10 = calculateTieredUnitPrice(100000, 55);
  if (tier10.discountPercent !== 10 || tier10.unitPrice !== 90000) {
    throw new Error(`Failed tier 10: expected 10% & 90000, got ${tier10.discountPercent}% & ${tier10.unitPrice}`);
  }
  console.log("✅ 1.1c Tier 2 (>=50 units) -> 10% volume discount verified.");

  // 1.2 Full Order Financial Breakdown
  const sampleItems = [
    { productId: "p-motor", basePrice: 4000000, quantity: 10 }, // 5% off -> 3,800,000 ea -> 38,000,000
    { productId: "p-switch", basePrice: 100000, quantity: 50 },  // 10% off -> 90,000 ea -> 4,500,000
  ];
  const financials = calculateOrderFinancials(sampleItems, "isfahan_express", {
    code: "TEST10",
    discountPercent: 10,
    maxDiscount: 500000,
  });

  // Net subtotal = 38M + 4.5M = 42.5M
  // Coupon 10% capped at 500k -> 500k deduction
  // Shipping = 45,000
  // Final = 42.5M - 500k + 45k = 42,045,000
  if (financials.netItemsTotal !== 42500000 || financials.couponDiscount !== 500000 || financials.finalTotalAmount !== 42045000) {
    throw new Error(`Financials calculation mismatch: ${JSON.stringify(financials)}`);
  }
  console.log("✅ 1.2 Order financial breakdown (subtotal, savings, coupon, shipping) verified.");

  // 1.3 Deterministic Lock Ordering
  const unsortedItems = [{ productId: "z-prod" }, { productId: "a-prod" }, { productId: "m-prod" }];
  const sorted = sortItemsForDeterministicLock(unsortedItems);
  if (sorted[0].productId !== "a-prod" || sorted[1].productId !== "m-prod" || sorted[2].productId !== "z-prod") {
    throw new Error("Deterministic lock ordering failed.");
  }
  console.log("✅ 1.3 Deterministic lock ordering (productId ASC) verified.");

  // 1.4 Card-to-Card 8-Hour Reservation Window
  const baseTime = new Date("2026-09-16T10:00:00Z");
  const c2cExpiry = calculateReservationExpiry("card_to_card", baseTime);
  if (!c2cExpiry || c2cExpiry.toISOString() !== "2026-09-16T18:00:00.000Z") {
    throw new Error("8-hour reservation calculation failed.");
  }
  const codExpiry = calculateReservationExpiry("cod_isfahan", baseTime);
  if (codExpiry !== null) {
    throw new Error("Non-C2C payment should not have reservation expiry.");
  }
  console.log("✅ 1.4 Card-to-Card 8-hour reservation window calculation verified.");

  // 1.5 Corporate Invoice Invariants
  const invalidCorp = validateCorporateInvoice({ isCorporate: true, companyName: "", nationalCode: "123" });
  if (invalidCorp.isValid) {
    throw new Error("Corporate validation should reject invalid data.");
  }
  const validCorp = validateCorporateInvoice({
    isCorporate: true,
    companyName: "فولاد مبارکه اصفهان",
    nationalCode: "10100123456",
    economicCode: "411122233344",
  });
  if (!validCorp.isValid) {
    throw new Error("Corporate validation rejected valid corporate tax details.");
  }
  console.log("✅ 1.5 Corporate tax invoice validation invariants verified.");

  // -------------------------------------------------------------
  // ENGINE 2: Repair Ticket Lifecycle Engine
  // -------------------------------------------------------------
  console.log("\n--- TEST SUITE 2: REPAIR TICKET LIFECYCLE ENGINE ---");

  // 2.1 Tracking Code Format
  const trackingCode = generateRepairTrackingCode();
  if (!/^REP-\d{6}-\d{4}$/.test(trackingCode)) {
    throw new Error(`Invalid tracking code format: ${trackingCode}`);
  }
  console.log(`✅ 2.1 Tracking code format verified: ${trackingCode}`);

  // 2.2 Valid State Machine Transitions
  if (!isValidRepairTransition("SUBMITTED", "RECEIVED")) throw new Error("Transition SUBMITTED -> RECEIVED failed.");
  if (!isValidRepairTransition("RECEIVED", "INSPECTING")) throw new Error("Transition RECEIVED -> INSPECTING failed.");
  if (!isValidRepairTransition("INSPECTING", "COST_ESTIMATED")) throw new Error("Transition INSPECTING -> COST_ESTIMATED failed.");
  if (!isValidRepairTransition("COST_ESTIMATED", "REPAIRING")) throw new Error("Transition COST_ESTIMATED -> REPAIRING failed.");
  if (!isValidRepairTransition("REPAIRING", "READY")) throw new Error("Transition REPAIRING -> READY failed.");
  if (!isValidRepairTransition("READY", "DELIVERED")) throw new Error("Transition READY -> DELIVERED failed.");
  if (isValidRepairTransition("SUBMITTED", "DELIVERED")) throw new Error("Invalid transition SUBMITTED -> DELIVERED was wrongly allowed.");
  console.log("✅ 2.2 7-stage state machine transition rules verified.");

  // 2.3 Cost Approval Decisions
  const approveDecision = evaluateCostApprovalDecision("COST_ESTIMATED", "PENDING", "APPROVE", "PORTAL");
  if (!approveDecision.isValid || approveDecision.nextStatus !== "REPAIRING" || approveDecision.nextApprovalStatus !== "APPROVED") {
    throw new Error("Cost approval decision failed.");
  }
  const declineDecision = evaluateCostApprovalDecision("COST_ESTIMATED", "PENDING", "DECLINE", "PHONE");
  if (!declineDecision.isValid || declineDecision.nextStatus !== "CANCELLED" || declineDecision.nextApprovalStatus !== "DECLINED") {
    throw new Error("Cost decline decision failed.");
  }
  const invalidDecision = evaluateCostApprovalDecision("SUBMITTED", "PENDING", "APPROVE");
  if (invalidDecision.isValid) {
    throw new Error("Cost approval should be rejected when ticket is not in COST_ESTIMATED.");
  }
  console.log("✅ 2.3 Cost approval invariants (APPROVE / DECLINE / rejection of non-estimated tickets) verified.");

  // 2.4 SMS Notification Payload
  const smsPayload = getCostEstimationSmsPayload({
    trackingCode: "REP-260916-1234",
    customerPhone: "09136260072",
    estimatedCost: 850000,
  });
  if (!smsPayload.message.includes("850,000") || !smsPayload.trackingUrl.includes("REP-260916-1234")) {
    throw new Error("SMS notification payload formatting failed.");
  }
  console.log("✅ 2.4 Automated cost estimation SMS payload verified.");

  // -------------------------------------------------------------
  // ENGINE 3: Chapter 13 Electrical Calculation Engine
  // -------------------------------------------------------------
  console.log("\n--- TEST SUITE 3: CHAPTER 13 ELECTRICAL CALCULATION ENGINE ---");

  // 3.1 Single-Phase 220V Calculation
  const singlePhaseResult = calculateCableRequirements({
    powerWatts: 5000,
    distanceMeters: 45,
    phase: "single_phase_220v",
    powerFactor: 0.85,
    loadType: "motor_inductive",
  });

  if (singlePhaseResult.voltageDropPercent >= 3.0) {
    throw new Error(`Single phase calculation violated Chapter 13: ${singlePhaseResult.voltageDropPercent}%`);
  }
  if (singlePhaseResult.recommendedGaugeMm2 !== 10) {
    throw new Error(`Expected 10mm2 copper for 45m distance, got ${singlePhaseResult.recommendedGaugeMm2}mm2`);
  }
  if (singlePhaseResult.recommendedMcb.curve !== "C" || singlePhaseResult.recommendedMcb.ratingAmperes !== 32) {
    throw new Error(`Expected C32 MCB breaker, got ${singlePhaseResult.recommendedMcb.curve}${singlePhaseResult.recommendedMcb.ratingAmperes}`);
  }
  console.log(`✅ 3.1 Single-phase (5kW, 45m) -> 10mm² copper, \u0394V% = ${singlePhaseResult.voltageDropPercent}%, MCB C32 verified.`);

  // 3.2 Three-Phase 380V Calculation
  const threePhaseResult = calculateCableRequirements({
    powerWatts: 15000,
    distanceMeters: 60,
    phase: "three_phase_380v",
    powerFactor: 0.85,
    loadType: "motor_inductive",
  });

  if (threePhaseResult.voltageDropPercent >= 3.0) {
    throw new Error(`Three phase calculation violated Chapter 13: ${threePhaseResult.voltageDropPercent}%`);
  }
  console.log(`✅ 3.2 Three-phase (15kW, 60m) -> ${threePhaseResult.recommendedGaugeMm2}mm² copper, \u0394V% = ${threePhaseResult.voltageDropPercent}% verified.`);

  // 3.3 1-Click Cart Bundling
  const bundle = createChapter13CartBundle(singlePhaseResult, 45);
  if (bundle.cableItem.quantity !== 45 || bundle.mcbItem.quantity !== 1 || !bundle.mcbItem.productName.includes("C32")) {
    throw new Error("Cart bundle generation failed.");
  }
  console.log("✅ 3.3 1-click cart bundle payload creation verified.");

  // 3.4 Feeder Engineering Advice
  const advice = getFeederEngineeringAdvice(singlePhaseResult, 45);
  if (!advice.some((a) => a.includes("تیپ C"))) {
    throw new Error("Engineering advice missing MCB curve guidance.");
  }
  console.log("✅ 3.4 Feeder engineering advice per Chapter 13 verified.");

  console.log("\n=================================================");
  console.log("ALL 3 CORE ENGINES FULLY VERIFIED (13/13 CHECKS) 🎉");
  console.log("=================================================");
}

runTests();
