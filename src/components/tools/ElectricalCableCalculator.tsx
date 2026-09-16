"use client";

import React, { useState, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { toPersianDigits, formatToman } from "@/lib/utils";
import {
  calculateCableRequirements,
  CopperGauge,
} from "@/lib/cableCalculator";
import { calculateTieredUnitPrice } from "@/lib/checkoutEngine";
import {
  Calculator,
  CheckCircle2,
  AlertTriangle,
  ShoppingCart,
  Check,
  ChevronDown,
  Sparkles,
  Plus,
  Minus,
} from "lucide-react";

interface DevicePreset {
  id: string;
  name: string;
  defaultPowerWatts: number;
  phase: "single" | "three";
}

const PRESETS: DevicePreset[] = [
  { id: "split_ac", name: "اسپلیت و کولر گازی ۲۴۰۰۰", defaultPowerWatts: 3500, phase: "single" },
  { id: "water_cooler", name: "کولر آبی ۷۰۰۰ (موتور ۳/۴ اسب)", defaultPowerWatts: 850, phase: "single" },
  { id: "electric_heater", name: "بخاری برقی و هیتر المنتی", defaultPowerWatts: 2200, phase: "single" },
  { id: "water_pump", name: "پمپ آب خانگی ۱ اسب", defaultPowerWatts: 750, phase: "single" },
  { id: "welding_machine", name: "اینورتر و دستگاه جوشکاری", defaultPowerWatts: 4500, phase: "single" },
  { id: "three_phase_motor", name: "الکتروموتور ۵.۵ اسب ۳ فاز", defaultPowerWatts: 4000, phase: "three" },
  { id: "custom", name: "سفارشی (تنظیم دستی توان)", defaultPowerWatts: 2000, phase: "single" },
];

const WIRE_PRICING: Record<number, { name: string; pricePerMeter: number; productId: string }> = {
  1.5: { name: "سیم افشان ۱.۵ تمام مس البرز", pricePerMeter: 18500, productId: "cable-alborz-1-5" },
  2.5: { name: "سیم افشان ۲.۵ تمام مس البرز", pricePerMeter: 29500, productId: "cable-alborz-2-5" },
  4: { name: "سیم افشان ۴ تمام مس البرز", pricePerMeter: 46000, productId: "cable-alborz-4-0" },
  6: { name: "سیم افشان ۶ تمام مس البرز", pricePerMeter: 68000, productId: "cable-alborz-6-0" },
  10: { name: "سیم افشان ۱۰ تمام مس البرز", pricePerMeter: 112000, productId: "cable-alborz-10-0" },
  16: { name: "سیم افشان ۱۶ تمام مس البرز", pricePerMeter: 175000, productId: "cable-alborz-16-0" },
  25: { name: "کابل افشان ۲۵ تمام مس البرز", pricePerMeter: 275000, productId: "cable-alborz-25-0" },
  35: { name: "کابل افشان ۳۵ تمام مس البرز", pricePerMeter: 385000, productId: "cable-alborz-35-0" },
  50: { name: "کابل افشان ۵۰ تمام مس البرز", pricePerMeter: 540000, productId: "cable-alborz-50-0" },
  70: { name: "کابل افشان ۷۰ تمام مس البرز", pricePerMeter: 760000, productId: "cable-alborz-70-0" },
  95: { name: "کابل افشان ۹۵ تمام مس البرز", pricePerMeter: 1050000, productId: "cable-alborz-95-0" },
  120: { name: "کابل افشان ۱۲۰ تمام مس البرز", pricePerMeter: 1320000, productId: "cable-alborz-120-0" },
};

const FUSE_PRICING: Record<string, { name: string; price: number; productId: string }> = {
  B10: { name: "کلید مینیاتوری ۱۰ آمپر دنا الکتریک", price: 115000, productId: "fuse-b10" },
  B16: { name: "کلید مینیاتوری ۱۶ آمپر دنا الکتریک", price: 120000, productId: "fuse-b16" },
  C25: { name: "کلید مینیاتوری ۲۵ آمپر دنا الکتریک", price: 135000, productId: "fuse-c25" },
  C32: { name: "کلید مینیاتوری ۳۲ آمپر دنا الکتریک", price: 145000, productId: "fuse-c32" },
  C40: { name: "کلید مینیاتوری ۴۰ آمپر دنا الکتریک", price: 165000, productId: "fuse-c40" },
  C50: { name: "کلید مینیاتوری ۵۰ آمپر دنا الکتریک", price: 185000, productId: "fuse-c50" },
  C63: { name: "کلید مینیاتوری ۶۳ آمپر دنا الکتریک", price: 215000, productId: "fuse-c63" },
  C80: { name: "کلید مینیاتوری ۸۰ آمپر دنا الکتریک", price: 290000, productId: "fuse-c80" },
  C100: { name: "کلید اتوماتیک ۱۰۰ آمپر دنا الکتریک", price: 420000, productId: "fuse-c100" },
  C125: { name: "کلید اتوماتیک ۱۲۵ آمپر دنا الکتریک", price: 560000, productId: "fuse-c125" },
};

// 3. Smooth Number Ticker Interpolation Hook (60fps requestAnimationFrame)
function useAnimatedNumber(value: number, duration: number = 200) {
  const [displayValue, setDisplayValue] = useState(value);

  React.useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;
    const endValue = value;

    if (startValue === endValue) return;

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (endValue - startValue) * easeProgress);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return displayValue;
}

export function ElectricalCableCalculator() {
  const { addToCart } = useCart();
  const [selectedPresetId, setSelectedPresetId] = useState<string>("split_ac");
  const [loadPowerWatts, setLoadPowerWatts] = useState<number>(3500);
  const [distanceMeters, setDistanceMeters] = useState<number>(25);
  const [phaseType, setPhaseType] = useState<"single" | "three">("single");
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // Bulletproof cross-page & hash scroll listener
  React.useEffect(() => {
    const triggerSmoothScroll = () => {
      if (typeof window === "undefined") return;
      const isHash = window.location.hash === "#calculator";
      const isQuery = window.location.search.includes("scroll=calculator");

      if (isHash || isQuery) {
        let attempts = 0;
        const interval = setInterval(() => {
          const el = document.getElementById("calculator");
          if (el) {
            clearInterval(interval);
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            if (isQuery) {
              window.history.replaceState(null, "", "/#calculator");
            }
          }
          attempts++;
          if (attempts > 30) clearInterval(interval);
        }, 100);
      }
    };

    triggerSmoothScroll();
    window.addEventListener("hashchange", triggerSmoothScroll);
    return () => window.removeEventListener("hashchange", triggerSmoothScroll);
  }, []);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = PRESETS.find((p) => p.id === presetId);
    if (preset && preset.id !== "custom") {
      setLoadPowerWatts(preset.defaultPowerWatts);
      setPhaseType(preset.phase);
    }
  };

  const {
    currentAmps,
    recommendedGauge,
    recommendedFuse,
    voltageDropPercent,
    isDropAcceptable,
    totalPackagePrice,
    wireItemName,
    wireDiscountPercent,
    fuseItemName,
  } = useMemo(() => {
    const calcResult = calculateCableRequirements({
      powerWatts: loadPowerWatts,
      distanceMeters,
      phase: phaseType === "single" ? "single_phase_220v" : "three_phase_380v",
      powerFactor: 0.85,
      loadType: "motor_inductive",
    });

    const gauge = calcResult.recommendedGaugeMm2;
    const fuseKey = `${calcResult.recommendedMcb.curve}${calcResult.recommendedMcb.ratingAmperes}`;

    const wireInfo = WIRE_PRICING[gauge] || WIRE_PRICING[10];
    const fuseInfo = FUSE_PRICING[fuseKey] || FUSE_PRICING["C32"];
    const wireTier = calculateTieredUnitPrice(wireInfo.pricePerMeter, distanceMeters);
    const wireCost = wireTier.unitPrice * distanceMeters;
    const fuseCost = fuseInfo.price;
    const pkgPrice = wireCost + fuseCost;

    return {
      currentAmps: calcResult.currentAmps,
      recommendedGauge: gauge,
      recommendedFuse: fuseKey,
      voltageDropPercent: calcResult.voltageDropPercent,
      isDropAcceptable: calcResult.isCompliant,
      totalPackagePrice: pkgPrice,
      wireItemName: `${toPersianDigits(distanceMeters)} متر ${wireInfo.name}`,
      wireDiscountPercent: wireTier.discountPercent,
      fuseItemName: fuseInfo.name,
    };
  }, [loadPowerWatts, distanceMeters, phaseType]);

  const animatedPackagePrice = useAnimatedNumber(totalPackagePrice);
  const animatedAmps = useAnimatedNumber(Math.round(currentAmps * 10)) / 10;

  const handleAddPackageToCart = () => {
    const wireInfo = WIRE_PRICING[recommendedGauge] || WIRE_PRICING[4];
    const fuseInfo = FUSE_PRICING[recommendedFuse] || FUSE_PRICING["C25"];

    addToCart(
      {
        id: wireInfo.productId,
        name: `${wireInfo.name} (${toPersianDigits(distanceMeters)} متر بر اساس محاسبه‌گر)`,
        price: wireInfo.pricePerMeter,
        stock: 1000,
        slug: `wire-${recommendedGauge}`,
      },
      distanceMeters
    );

    addToCart(
      {
        id: fuseInfo.productId,
        name: `${fuseInfo.name} (محافظ پکیج کابل)`,
        price: fuseInfo.price,
        stock: 50,
        slug: `fuse-${recommendedFuse.toLowerCase()}`,
      },
      1
    );

    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2500);
  };

  return (
    <section
      id="calculator"
      className="scroll-mt-24 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-6 relative overflow-hidden transition-colors duration-200"
    >
      {/* Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-2 max-w-2xl text-right">
          <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400 text-xs font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
            <Calculator className="w-4 h-4" />
            <span>محاسبه‌گر مهندسی سایز کابل و فیوز مینیاتوری</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
            تعیین استاندارد سیم مسی، افت ولتاژ و تیپ فیوز
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            بر اساس مقررات ملی ساختمان ایران (مبحث ۱۳) و استانداردهای نظام مهندسی برق
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="w-full md:w-64 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold py-2.5 pr-3.5 pl-10 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-amber-500 appearance-none cursor-pointer transition-colors shadow-xs text-right"
            >
              {PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {preset.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Form Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {/* Input 1: Phase Type */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-750 space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            نوع برق ورودی:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPhaseType("single")}
              className={`min-h-[44px] py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 border active:scale-95 flex items-center justify-center text-center ${
                phaseType === "single"
                  ? "bg-amber-500 text-amber-950 border-amber-400 shadow-md font-black scale-102"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              ۲۲۰V تک‌فاز (خانگی)
            </button>
            <button
              type="button"
              onClick={() => setPhaseType("three")}
              className={`min-h-[44px] py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 border active:scale-95 flex items-center justify-center text-center ${
                phaseType === "three"
                  ? "bg-amber-500 text-amber-950 border-amber-400 shadow-md font-black scale-102"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              ۳۸۰V سه‌فاز (صنعتی)
            </button>
          </div>
        </div>

        {/* Input 2: Load Power */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-750 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300">توان مصرفی:</span>
            <span className="text-amber-600 dark:text-amber-400 font-mono font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20 tabular-nums">
              <bdi dir="ltr">{toPersianDigits(loadPowerWatts)} W</bdi> ({(loadPowerWatts / 1000).toFixed(1)} kW)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLoadPowerWatts((prev) => Math.max(200, prev - 100))}
              className="w-10 h-10 shrink-0 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-amber-500 hover:text-amber-950 transition-colors active:scale-95 shadow-2xs font-bold"
              aria-label="کاهش توان ۱۰۰ وات"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex-1 space-y-1.5" dir="ltr">
              <input
                type="range"
                min="200"
                max="15000"
                step="100"
                value={loadPowerWatts}
                aria-label="تنظیم توان مصرفی بر حسب وات"
                aria-valuemin={200}
                aria-valuemax={15000}
                aria-valuenow={loadPowerWatts}
                aria-valuetext={`${toPersianDigits(loadPowerWatts)} وات`}
                onChange={(e) => setLoadPowerWatts(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 transition-all hover:bg-slate-300 dark:hover:bg-slate-700"
              />
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium" dir="ltr">
                <span>200W</span>
                <span>7.5kW</span>
                <span>15kW</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setLoadPowerWatts((prev) => Math.min(15000, prev + 100))}
              className="w-10 h-10 shrink-0 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-amber-500 hover:text-amber-950 transition-colors active:scale-95 shadow-2xs font-bold"
              aria-label="افزایش توان ۱۰۰ وات"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Input 3: Distance */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-750 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300">طول مسیر سیم‌کشی:</span>
            <span className="text-amber-600 dark:text-amber-400 font-mono font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20 tabular-nums">
              <bdi dir="ltr">{toPersianDigits(distanceMeters)} m</bdi>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDistanceMeters((prev) => Math.max(5, prev - 5))}
              className="w-10 h-10 shrink-0 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-amber-500 hover:text-amber-950 transition-colors active:scale-95 shadow-2xs font-bold"
              aria-label="کاهش طول ۵ متر"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex-1 space-y-1.5" dir="ltr">
              <input
                type="range"
                min="5"
                max="150"
                step="5"
                value={distanceMeters}
                aria-label="تنظیم طول مسیر سیم‌کشی بر حسب متر"
                aria-valuemin={5}
                aria-valuemax={150}
                aria-valuenow={distanceMeters}
                aria-valuetext={`${toPersianDigits(distanceMeters)} متر`}
                onChange={(e) => setDistanceMeters(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 transition-all hover:bg-slate-300 dark:hover:bg-slate-700"
              />
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium" dir="ltr">
                <span>5m</span>
                <span>75m</span>
                <span>150m</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDistanceMeters((prev) => Math.min(150, prev + 5))}
              className="w-10 h-10 shrink-0 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-amber-500 hover:text-amber-950 transition-colors active:scale-95 shadow-2xs font-bold"
              aria-label="افزایش طول ۵ متر"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Engineering Results Display Box */}
      <div className="bg-slate-100 dark:bg-slate-950 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left Col: Calculated Technical Values */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
            {/* Box 1: Amps */}
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1 font-medium">جریان نامی مصرفی</span>
              <strong className="text-slate-900 dark:text-slate-100 font-mono text-sm sm:text-base font-bold transition-all tabular-nums inline-block">
                <bdi dir="ltr">{animatedAmps.toFixed(1)} A</bdi>
              </strong>
            </div>

            {/* Box 2: Recommended Gauge (Prominent Gold Hero Highlight) */}
            <div className="p-3.5 bg-gradient-to-b from-amber-500/10 to-amber-500/5 dark:from-amber-950/40 dark:to-slate-900 rounded-2xl border-2 border-amber-500 shadow-md shadow-amber-500/10 relative overflow-hidden">
              <div className="absolute top-1 right-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
              </div>
              <span className="text-[11px] text-amber-900 dark:text-amber-300 block mb-0.5 font-bold">سایز سیم پیشنهادی</span>
              <strong className="text-amber-600 dark:text-amber-400 font-mono text-lg sm:text-2xl font-black block tracking-tight tabular-nums">
                <bdi dir="ltr">{recommendedGauge} <span className="text-xs font-normal">mm²</span></bdi>
              </strong>
            </div>

            {/* Box 3: Fuse */}
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1 font-medium">فیوز مینیاتوری</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm sm:text-base font-bold tabular-nums inline-block">
                <bdi dir="ltr">{recommendedFuse}</bdi>
              </strong>
            </div>
          </div>

          {/* Voltage drop validation badge with Dynamic Gauge Morph */}
          <div
            className={`flex items-center justify-between text-[11px] px-3.5 py-2.5 rounded-xl border transition-all duration-500 ${
              isDropAcceptable
                ? "bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-900 dark:text-emerald-300"
                : "bg-amber-500/15 dark:bg-amber-950/40 border-amber-500/40 text-amber-900 dark:text-amber-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {isDropAcceptable ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
              )}
              <span className="font-medium leading-relaxed">
                {isDropAcceptable
                  ? `سیم محاسبه‌شده ۱۰۰٪ تمام مس با افت ولتاژ مجاز (${voltageDropPercent.toFixed(1)}٪) در مسافت ${toPersianDigits(distanceMeters)} متر است.`
                  : `افت ولتاژ (${voltageDropPercent.toFixed(1)}٪) بیش از حد مجاز ۳٪ بود؛ سایز سیم جهت حفاظت مصرف‌کننده ارتقا یافت.`}
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Instant 1-Click Purchase Package with Transparent Itemization */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
          <div className="space-y-1 text-right">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">پکیج کابل مس + فیوز محافظ:</span>
                {wireDiscountPercent > 0 && (
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded-full">
                    تخفیف متراژ: {toPersianDigits(wireDiscountPercent)}٪
                  </span>
                )}
              </div>
              <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 font-mono transition-all tabular-nums">
                {formatToman(animatedPackagePrice)}
              </span>
            </div>
            {/* Itemized package transparency */}
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate">
              شامل: {wireItemName} + {fuseItemName}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddPackageToCart}
            className={`w-full min-h-[48px] py-3 rounded-xl font-black text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md active:scale-95 ${
              isAddedToCart
                ? "bg-emerald-600 text-white shadow-emerald-600/30 scale-102"
                : "bg-amber-500 hover:bg-amber-400 text-amber-950 hover-glow"
            }`}
          >
            {isAddedToCart ? (
              <>
                <Check className="w-4 h-4 animate-in zoom-in spin-in-12" />
                <span>پکیج به سبد خرید اضافه شد</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>افزودن سیم ({toPersianDigits(distanceMeters)} متر) و فیوز به سبد</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
