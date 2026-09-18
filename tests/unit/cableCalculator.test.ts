import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCableRequirements,
  createChapter13CartBundle,
  getFeederEngineeringAdvice,
  STANDARD_COPPER_GAUGES,
  STANDARD_MCB_RATINGS,
} from '../../src/lib/domain/cableCalculator';

describe('Cable Calculator - Chapter 13 Compliance & Edge Cases', () => {
  describe('Seam 1: Single-Phase 220V Voltage Drop & Current Formulas', () => {
    it('calculates exact single-phase current and 2-way loop voltage drop with unity PF', () => {
      // 2200W at 220V, PF=1.0 => I = 10.0A
      // L = 20m, candidate 1.5mm² => deltaV = (2 * 20 * 10 * 0.0175) / 1.5 = 4.6667V
      // deltaV% = (4.6667 / 220) * 100 = 2.12%
      const result = calculateCableRequirements({
        powerWatts: 2200,
        distanceMeters: 20,
        phase: 'single_phase_220v',
        powerFactor: 1.0,
        loadType: 'lighting_resistive',
      });

      assert.equal(Math.round(result.currentAmperes * 100) / 100, 10);
      assert.equal(result.recommendedGaugeMm2, 1.5);
      assert.equal(result.voltageDropVolts, 4.67);
      assert.equal(result.voltageDropPercent, 2.12);
      assert.equal(result.isCompliant, true);
      assert.equal(result.recommendedMcb.curve, 'B');
      assert.equal(result.recommendedMcb.ratingAmperes, 10);
      assert.equal(result.recommendedMcb.productId, 'fuse-b10');
      assert.equal(result.matchedCableProductId, 'cable-alborz-1-5');
    });
  });

  describe('Seam 2: Three-Phase 380V Voltage Drop & Current Formulas', () => {
    it('calculates three-phase current using sqrt(3)*380 and steps up gauge when 2.5mm² exceeds 3% drop', () => {
      // 11kW at 380V, PF=0.85 => I = 11000 / (sqrt(3) * 380 * 0.85) = 19.66A
      // Thermally needs 2.5mm² (ampacity 21A >= 19.66A)
      // At L = 50m on 2.5mm²: deltaV% = 3.14% (> 3.0%)
      // Engine must step up to 4.0mm² where deltaV% = 1.96% (< 3.0%)
      const result = calculateCableRequirements({
        powerWatts: 11000,
        distanceMeters: 50,
        phase: 'three_phase_380v',
        powerFactor: 0.85,
        loadType: 'motor_inductive',
      });

      assert.equal(Math.round(result.currentAmperes * 100) / 100, 19.66);
      assert.equal(result.recommendedGaugeMm2, 4);
      assert.equal(result.voltageDropPercent, 1.96);
      assert.equal(result.isCompliant, true);
      assert.equal(result.recommendedMcb.curve, 'C');
      assert.equal(result.recommendedMcb.ratingAmperes, 25);
      assert.equal(result.recommendedMcb.productId, 'fuse-c25');
      assert.equal(result.matchedCableProductId, 'cable-alborz-4');
    });
  });

  describe('Seam 3: Distance Edge Cases (0m to 1000m)', () => {
    it('enforces thermal ampacity over negligible voltage drop at near-zero distance (L = 1m)', () => {
      // 7000W at 220V, PF=1.0 => I = 31.82A.
      // At L = 1m, 1.5mm² drop is only 0.34%, but thermal limit requires 6.0mm² (36A ampacity)
      const result = calculateCableRequirements({
        powerWatts: 7000,
        distanceMeters: 1,
        phase: 'single_phase_220v',
        powerFactor: 1.0,
      });

      assert.equal(Math.round(result.currentAmperes * 100) / 100, 31.82);
      assert.equal(result.recommendedGaugeMm2, 6);
      assert.equal(result.isCompliant, true);
      assert.equal(result.voltageDropPercent < 0.2, true);
    });

    it('handles L = 0m with zero voltage drop while preserving thermal sizing and breaker', () => {
      const result = calculateCableRequirements({
        powerWatts: 2200,
        distanceMeters: 0,
        phase: 'single_phase_220v',
        powerFactor: 1.0,
      });

      assert.equal(result.voltageDropVolts, 0);
      assert.equal(result.voltageDropPercent, 0);
      assert.equal(result.isCompliant, true);
      assert.equal(result.recommendedGaugeMm2, 1.5);
      assert.equal(result.recommendedMcb.ratingAmperes, 10);
    });

    it('flags non-compliance (isCompliant = false) and caps at 120mm² for extreme distance (L = 1000m)', () => {
      // 15kW at 220V, L = 1000m => drop on 120mm² is ~10.63% (well over 3.0%)
      const result = calculateCableRequirements({
        powerWatts: 15000,
        distanceMeters: 1000,
        phase: 'single_phase_220v',
        powerFactor: 0.85,
      });

      assert.equal(result.isCompliant, false);
      assert.equal(result.recommendedGaugeMm2, 120);
      assert.equal(result.voltageDropPercent > 3.0, true);

      const advice = getFeederEngineeringAdvice(result, 1000);
      assert.equal(advice.some((a) => a.includes('هشدار مبحث ۱۳: افت ولتاژ از سقف مجاز ۳.۰ درصد')), true);
      assert.equal(advice.some((a) => a.includes('مسافت طولانی: برای فواصل بالای ۲۰۰ متر')), true);
    });

    it('steps up multiple gauge increments across moderate vs long distance for the same load', () => {
      // 5000W, 220V, PF=0.85 => I = 26.74A (thermally 4.0mm²)
      // At 10m => 4.0mm² is compliant (1.06% drop)
      const shortRun = calculateCableRequirements({
        powerWatts: 5000,
        distanceMeters: 10,
        phase: 'single_phase_220v',
        powerFactor: 0.85,
      });
      assert.equal(shortRun.recommendedGaugeMm2, 4);

      // At 40m => 4.0mm² exceeds 3% (4.25%), steps up to 6.0mm² (2.84%)
      const midRun = calculateCableRequirements({
        powerWatts: 5000,
        distanceMeters: 40,
        phase: 'single_phase_220v',
        powerFactor: 0.85,
      });
      assert.equal(midRun.recommendedGaugeMm2, 6);

      // At 80m => steps up further to 16.0mm²
      const longRun = calculateCableRequirements({
        powerWatts: 5000,
        distanceMeters: 80,
        phase: 'single_phase_220v',
        powerFactor: 0.85,
      });
      assert.equal(longRun.recommendedGaugeMm2, 16);
      assert.equal(longRun.isCompliant, true);
    });
  });

  describe('Seam 4: Overload & Power Factor Boundary Edge Cases', () => {
    it('clamps power factor to [0.5, 1.0] range', () => {
      // With powerWatts = 2200, if PF is 0.1, it should clamp to 0.5 => I = 2200 / (220 * 0.5) = 20A
      const lowPf = calculateCableRequirements({
        powerWatts: 2200,
        distanceMeters: 10,
        phase: 'single_phase_220v',
        powerFactor: 0.1,
      });
      assert.equal(Math.round(lowPf.currentAmperes), 20);

      // If PF is 1.5, it should clamp to 1.0 => I = 2200 / (220 * 1.0) = 10A
      const highPf = calculateCableRequirements({
        powerWatts: 2200,
        distanceMeters: 10,
        phase: 'single_phase_220v',
        powerFactor: 1.5,
      });
      assert.equal(Math.round(highPf.currentAmperes), 10);
    });

    it('caps thermal gauge to 120mm² and MCB to 125A when current exceeds maximum standard tables (overload saturation)', () => {
      // 60kW on single-phase 220V with PF=1.0 => I = 272.7A (> 239A max gauge ampacity, > 125A max MCB)
      const overload = calculateCableRequirements({
        powerWatts: 60000,
        distanceMeters: 1,
        phase: 'single_phase_220v',
        powerFactor: 1.0,
      });

      assert.equal(overload.currentAmperes > 270, true);
      // Must NOT fall back to 1.5mm² or 10A breaker!
      assert.equal(overload.recommendedGaugeMm2, 120);
      assert.equal(overload.recommendedMcb.ratingAmperes, 125);
    });
  });

  describe('Seam 5: Breaker Curves, Cart Bundle & Chapter 13 Regulatory Advice', () => {
    it('selects Curve B for resistive lighting and Curve C for inductive motors with appropriate advice', () => {
      const lighting = calculateCableRequirements({
        powerWatts: 1500,
        distanceMeters: 15,
        phase: 'single_phase_220v',
        loadType: 'lighting_resistive',
      });
      assert.equal(lighting.recommendedMcb.curve, 'B');
      const lightAdvice = getFeederEngineeringAdvice(lighting, 15);
      assert.equal(lightAdvice.some((a) => a.includes('کلید تیپ B')), true);

      const motor = calculateCableRequirements({
        powerWatts: 1500,
        distanceMeters: 15,
        phase: 'single_phase_220v',
        loadType: 'motor_inductive',
      });
      assert.equal(motor.recommendedMcb.curve, 'C');
      const motorAdvice = getFeederEngineeringAdvice(motor, 15);
      assert.equal(motorAdvice.some((a) => a.includes('کلید تیپ C')), true);
    });

    it('generates 1-click cart bundle with properly itemized cable and breaker payload', () => {
      const calc = calculateCableRequirements({
        powerWatts: 3500,
        distanceMeters: 25,
        phase: 'single_phase_220v',
        loadType: 'motor_inductive',
      });

      const bundle = createChapter13CartBundle(calc, 25.4);
      assert.equal(bundle.cableItem.productId, calc.matchedCableProductId);
      assert.equal(bundle.cableItem.quantity, 25);
      assert.equal(bundle.cableItem.productName.includes('25 متر'), true);

      assert.equal(bundle.mcbItem.productId, calc.recommendedMcb.productId);
      assert.equal(bundle.mcbItem.quantity, 1);
      assert.equal(bundle.mcbItem.productName, calc.recommendedMcb.name);

      // Verify wholesale tiered pricing in bundle
      const bundledTier5 = createChapter13CartBundle(calc, 25, 100000);
      assert.equal(bundledTier5.cableItem.discountPercent, 5);
      assert.equal(bundledTier5.cableItem.unitPriceToman, 95000);

      const bundledTier10 = createChapter13CartBundle(calc, 50, 100000);
      assert.equal(bundledTier10.cableItem.discountPercent, 10);
      assert.equal(bundledTier10.cableItem.unitPriceToman, 90000);

      const bundledTier0 = createChapter13CartBundle(calc, 8, 100000);
      assert.equal(bundledTier0.cableItem.discountPercent, 0);
      assert.equal(bundledTier0.cableItem.unitPriceToman, 100000);

      // Safeguard for zero or negative length
      const zeroBundle = createChapter13CartBundle(calc, 0);
      assert.equal(zeroBundle.cableItem.quantity, 1);
    });

    it('emits marginal threshold warning when voltage drop is between 2.5% and 3.0%', () => {
      // Choose parameters where drop lands in (2.5%, 3.0%)
      // e.g. 5000W at 220V, PF=0.85 => I=26.74A. At 37m on 6.0mm² => deltaV% = 2.63%
      const calc = calculateCableRequirements({
        powerWatts: 5000,
        distanceMeters: 37,
        phase: 'single_phase_220v',
        powerFactor: 0.85,
      });

      assert.equal(calc.voltageDropPercent >= 2.5 && calc.voltageDropPercent <= 3.0, true);
      const advice = getFeederEngineeringAdvice(calc, 37);
      assert.equal(
        advice.some((a) => a.includes('توجه: افت ولتاژ نزدیک به آستانه حداکثری ۳.۰ درصد است')),
        true
      );
    });

    it('always emits Chapter 13 violation warning when isCompliant is false even if rounded drop is 3.0%', () => {
      const nonCompliantResult = calculateCableRequirements({
        powerWatts: 15000,
        distanceMeters: 1000,
        phase: 'single_phase_220v',
      });
      // Override drop percent to exactly 3.0 to test the boundary condition
      const boundaryEdge = { ...nonCompliantResult, isCompliant: false, voltageDropPercent: 3.0 };
      const advice = getFeederEngineeringAdvice(boundaryEdge, 1000);
      assert.equal(
        advice.some((a) => a.includes('هشدار مبحث ۱۳: افت ولتاژ از سقف مجاز ۳.۰ درصد فراتر است')),
        true
      );
    });
  });

  describe('Comprehensive Table-Driven Boundaries: Gauges, MCB Ratings & Product IDs', () => {
    it('correctly maps fractional and integer gauges to hyphenated product IDs', () => {
      const testCases: Array<{ power: number; expectedGauge: number; expectedId: string }> = [
        { power: 1000, expectedGauge: 1.5, expectedId: 'cable-alborz-1-5' },
        { power: 4000, expectedGauge: 2.5, expectedId: 'cable-alborz-2-5' },
        { power: 5500, expectedGauge: 4, expectedId: 'cable-alborz-4' },
        { power: 7500, expectedGauge: 6, expectedId: 'cable-alborz-6' },
      ];

      for (const tc of testCases) {
        const res = calculateCableRequirements({
          powerWatts: tc.power,
          distanceMeters: 5,
          phase: 'single_phase_220v',
          powerFactor: 1.0,
        });
        assert.equal(res.recommendedGaugeMm2, tc.expectedGauge);
        assert.equal(res.matchedCableProductId, tc.expectedId);
      }
    });

    it('verifies exact current increase between PF=1.0 and PF=0.8 for the same wattage', () => {
      const watts = 8800; // 8800 / 220 = 40A at PF=1.0, 50A at PF=0.8
      const unity = calculateCableRequirements({
        powerWatts: watts,
        distanceMeters: 10,
        phase: 'single_phase_220v',
        powerFactor: 1.0,
      });
      const lagging = calculateCableRequirements({
        powerWatts: watts,
        distanceMeters: 10,
        phase: 'single_phase_220v',
        powerFactor: 0.8,
      });

      assert.equal(Math.round(unity.currentAmperes), 40);
      assert.equal(Math.round(lagging.currentAmperes), 50);
      assert.equal(unity.recommendedMcb.ratingAmperes, 40);
      assert.equal(lagging.recommendedMcb.ratingAmperes, 50);
    });

    it('validates standard copper gauge and MCB rating constants exports', () => {
      assert.equal(STANDARD_COPPER_GAUGES.length, 12);
      assert.equal(STANDARD_COPPER_GAUGES[0], 1.5);
      assert.equal(STANDARD_COPPER_GAUGES[STANDARD_COPPER_GAUGES.length - 1], 120);

      assert.equal(STANDARD_MCB_RATINGS.length, 10);
      assert.equal(STANDARD_MCB_RATINGS[0], 10);
      assert.equal(STANDARD_MCB_RATINGS[STANDARD_MCB_RATINGS.length - 1], 125);
    });
  });
});
