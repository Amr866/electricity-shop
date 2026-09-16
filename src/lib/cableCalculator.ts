/**
 * National Iranian Building Regulations Chapter 13 (مبحث ۱۳ مقررات ملی ساختمان)
 * Cable Sizer, Voltage Drop, and Miniature Circuit Breaker (MCB) Matching Engine.
 */

import { calculateTieredUnitPrice } from "./checkoutEngine.ts";

export const STANDARD_COPPER_GAUGES = [
  1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120,
] as const;

export type CopperGauge = (typeof STANDARD_COPPER_GAUGES)[number];

// Standard conservative continuous ampacity ratings in conduit/duct (in Amperes)
const COPPER_AMPACITY: Record<CopperGauge, number> = {
  1.5: 16,
  2.5: 21,
  4: 28,
  6: 36,
  10: 50,
  16: 68,
  25: 89,
  35: 110,
  50: 134,
  70: 171,
  95: 207,
  120: 239,
};

export const STANDARD_MCB_RATINGS = [10, 16, 25, 32, 40, 50, 63, 80, 100, 125] as const;
export type McbRating = (typeof STANDARD_MCB_RATINGS)[number];

export interface CableCalculationInput {
  powerWatts: number;
  distanceMeters: number;
  phase: "single_phase_220v" | "three_phase_380v";
  powerFactor?: number; // default: 0.85
  loadType?: "motor_inductive" | "lighting_resistive"; // default: motor_inductive
}

export interface CableCalculationOutput {
  currentAmperes: number;
  currentAmps: number;
  recommendedGaugeMm2: CopperGauge;
  voltageDropVolts: number;
  voltageDropPercent: number;
  isCompliant: boolean; // strictly < 3.0%
  recommendedMcb: {
    curve: "B" | "C";
    ratingAmperes: McbRating;
    name: string;
    productId: string;
  };
  matchedCableProductId: string;
  cableName: string;
}

// Pure annealed copper resistivity at 20°C: 0.0175 ohm·mm²/m
const COPPER_RESISTIVITY = 0.0175;
const MAX_ALLOWED_VOLTAGE_DROP_PERCENT = 3.0;

export function calculateCableRequirements(
  input: CableCalculationInput
): CableCalculationOutput {
  const {
    powerWatts,
    distanceMeters,
    phase,
    powerFactor = 0.85,
    loadType = "motor_inductive",
  } = input;

  const pf = Math.max(0.5, Math.min(1.0, powerFactor));
  const isSinglePhase = phase === "single_phase_220v";
  const nominalVoltage = isSinglePhase ? 220 : 380;

  // 1. Nominal Load Current Calculation
  let currentAmps = 0;
  if (isSinglePhase) {
    currentAmps = powerWatts / (220 * pf);
  } else {
    currentAmps = powerWatts / (Math.sqrt(3) * 380 * pf);
  }

  // 2. Determine initial gauge by thermal current carrying capacity
  let selectedGauge: CopperGauge = 120; // Default to max standard gauge if current exceeds all ratings
  for (const gauge of STANDARD_COPPER_GAUGES) {
    if (COPPER_AMPACITY[gauge] >= currentAmps) {
      selectedGauge = gauge;
      break;
    }
  }

  // 3. Evaluate Voltage Drop & Step Up Gauge until deltaV% < 3.0%
  let voltageDropVolts = 0;
  let voltageDropPercent = 0;
  let isCompliant = false;

  const currentIdx = STANDARD_COPPER_GAUGES.indexOf(selectedGauge);

  for (let i = currentIdx; i < STANDARD_COPPER_GAUGES.length; i++) {
    const candidateGauge = STANDARD_COPPER_GAUGES[i];

    if (isSinglePhase) {
      // Loop distance = 2 * L
      voltageDropVolts =
        (2 * distanceMeters * currentAmps * COPPER_RESISTIVITY) / candidateGauge;
    } else {
      voltageDropVolts =
        (Math.sqrt(3) * distanceMeters * currentAmps * COPPER_RESISTIVITY) /
        candidateGauge;
    }

    voltageDropPercent = (voltageDropVolts / nominalVoltage) * 100;

    if (voltageDropPercent < MAX_ALLOWED_VOLTAGE_DROP_PERCENT) {
      selectedGauge = candidateGauge;
      isCompliant = true;
      break;
    }
  }

  // If even 120mm2 exceeds 3% drop
  if (!isCompliant) {
    selectedGauge = 120;
    if (isSinglePhase) {
      voltageDropVolts =
        (2 * distanceMeters * currentAmps * COPPER_RESISTIVITY) / 120;
    } else {
      voltageDropVolts =
        (Math.sqrt(3) * distanceMeters * currentAmps * COPPER_RESISTIVITY) / 120;
    }
    voltageDropPercent = (voltageDropVolts / nominalVoltage) * 100;
  }

  // 4. MCB Curve & Rating Selection
  const curve: "B" | "C" = loadType === "lighting_resistive" ? "B" : "C";
  let recommendedMcbRating: McbRating = 125; // Default to max standard rating if current exceeds all ratings

  for (const rating of STANDARD_MCB_RATINGS) {
    if (rating >= currentAmps) {
      recommendedMcbRating = rating;
      break;
    }
  }

  const mcbName = `کلید مینیاتوری ${curve}${recommendedMcbRating} دنا الکتریک`;
  const mcbProductId = `fuse-${curve.toLowerCase()}${recommendedMcbRating}`;
  const cableName = `سیم افشان ${selectedGauge} تمام مس البرز`;
  const matchedCableProductId = `cable-alborz-${selectedGauge.toString().replace(".", "-")}`;

  return {
    currentAmperes: currentAmps,
    currentAmps,
    recommendedGaugeMm2: selectedGauge,
    voltageDropVolts: Math.round(voltageDropVolts * 100) / 100,
    voltageDropPercent: Math.round(voltageDropPercent * 100) / 100,
    isCompliant,
    recommendedMcb: {
      curve,
      ratingAmperes: recommendedMcbRating,
      name: mcbName,
      productId: mcbProductId,
    },
    matchedCableProductId,
    cableName,
  };
}

/**
 * Creates 1-click cart bundle payload for the calculated cable and matching breaker.
 */
export function createChapter13CartBundle(
  output: CableCalculationOutput,
  lengthMeters: number,
  basePricePerMeter?: number
): {
  cableItem: {
    productId: string;
    productName: string;
    quantity: number;
    unitPriceToman?: number;
    discountPercent?: number;
  };
  mcbItem: {
    productId: string;
    productName: string;
    quantity: number;
  };
} {
  const safeQty = Math.max(1, Math.round(lengthMeters));
  let unitPriceToman: number | undefined;
  let discountPercent: number | undefined;

  if (basePricePerMeter !== undefined) {
    const tiered = calculateTieredUnitPrice(basePricePerMeter, safeQty);
    unitPriceToman = tiered.unitPrice;
    discountPercent = tiered.discountPercent;
  }

  return {
    cableItem: {
      productId: output.matchedCableProductId,
      productName: `${output.cableName} (طول ${safeQty} متر)`,
      quantity: safeQty,
      ...(unitPriceToman !== undefined ? { unitPriceToman, discountPercent } : {}),
    },
    mcbItem: {
      productId: output.recommendedMcb.productId,
      productName: output.recommendedMcb.name,
      quantity: 1,
    },
  };
}

/**
 * Provides Chapter 13 regulatory and engineering advice based on calculation metrics.
 */
export function getFeederEngineeringAdvice(
  output: CableCalculationOutput,
  distanceMeters: number
): string[] {
  const notes: string[] = [];

  if (!output.isCompliant || output.voltageDropPercent > 3.0) {
    notes.push(
      "هشدار مبحث ۱۳: افت ولتاژ از سقف مجاز ۳.۰ درصد فراتر است. کابل‌های موازی دوبل یا انتقال تابلو برق به نزدیکی بار توصیه می‌شود."
    );
  } else if (output.voltageDropPercent > 2.5) {
    notes.push(
      "توجه: افت ولتاژ نزدیک به آستانه حداکثری ۳.۰ درصد است. در صورت امکان ارتقا به مقطع بزرگتر جهت کاهش تلفات اهمی پیشنهاد می‌گردد."
    );
  }

  if (distanceMeters > 200) {
    notes.push(
      "مسافت طولانی: برای فواصل بالای ۲۰۰ متر، مقاومت مکانیکی کابل در برابر کشش و لوله‌گذاری صلب عایق بررسی گردد."
    );
  }

  if (output.recommendedMcb.curve === "C") {
    notes.push(
      "کلید تیپ C: با ضریب قطع مغناطیسی ۵ الی ۱۰ برابر جریان نامی، مناسب حفاظت بارهای سلفی و الکتروموتورهای کولری و پمپ."
    );
  } else {
    notes.push(
      "کلید تیپ B: با ضریب قطع مغناطیسی ۳ الی ۵ برابر جریان نامی، مناسب مدارهای روشنایی و بارهای فاقد جریان هجومی."
    );
  }

  return notes;
}

