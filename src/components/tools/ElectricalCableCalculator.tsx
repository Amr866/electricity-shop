"use client";

import React, { useState, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { toPersianDigits, formatToman } from "@/lib/utils";
import {
  Zap,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  ShoppingCart,
  Check,
  ChevronDown,
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
};

const FUSE_PRICING: Record<string, { name: string; price: number; productId: string }> = {
  B10: { name: "کلید مینیاتوری ۱۰ آمپر دنا الکتریک", price: 115000, productId: "fuse-b10" },
  B16: { name: "کلید مینیاتوری ۱۶ آمپر دنا الکتریک", price: 120000, productId: "fuse-b16" },
  C25: { name: "کلید مینیاتوری ۲۵ آمپر دنا الکتریک", price: 135000, productId: "fuse-c25" },
  C32: { name: "کلید مینیاتوری ۳۲ آمپر دنا الکتریک", price: 145000, productId: "fuse-c32" },
  C50: { name: "کلید مینیاتوری ۵۰ آمپر دنا الکتریک", price: 185000, productId: "fuse-c50" },
};

// 3. Smooth Number Ticker Interpolation Hook (60fps requestAnimationFrame)
function useAnimatedNumber(value: number, duration: number = 250) {
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
  } = useMemo(() => {
    const powerFactor = 0.85;
    const rho = 0.0175;

    let amps = 0;
    if (phaseType === "single") {
      amps = loadPowerWatts / (220 * powerFactor);
    } else {
      amps = loadPowerWatts / (Math.sqrt(3) * 380 * powerFactor);
    }

    let gauge = 1.5;
    let fuse = "B10";

    if (amps <= 10) {
      gauge = 1.5;
      fuse = "B10";
    } else if (amps <= 16) {
      gauge = 2.5;
      fuse = "B16";
    } else if (amps <= 25) {
      gauge = 4;
      fuse = "C25";
    } else if (amps <= 32) {
      gauge = 6;
      fuse = "C32";
    } else {
      gauge = 10;
      fuse = "C50";
    }

    let vDrop = 0;
    if (phaseType === "single") {
      vDrop = (2 * distanceMeters * amps * rho) / gauge;
    } else {
      vDrop = (Math.sqrt(3) * distanceMeters * amps * rho) / gauge;
    }

    const nominalVoltage = phaseType === "single" ? 220 : 380;
    let vDropPercent = (vDrop / nominalVoltage) * 100;

    if (vDropPercent > 3.0) {
      if (gauge === 1.5) gauge = 2.5;
      else if (gauge === 2.5) gauge = 4;
      else if (gauge === 4) gauge = 6;
      else if (gauge === 6) gauge = 10;

      if (phaseType === "single") {
        vDrop = (2 * distanceMeters * amps * rho) / gauge;
      } else {
        vDrop = (Math.sqrt(3) * distanceMeters * amps * rho) / gauge;
      }
      vDropPercent = (vDrop / nominalVoltage) * 100;
    }

    const dropOk = vDropPercent <= 3.0;

    const wireInfo = WIRE_PRICING[gauge] || WIRE_PRICING[2.5];
    const fuseInfo = FUSE_PRICING[fuse] || FUSE_PRICING["B16"];
    const wireCost = wireInfo.pricePerMeter * distanceMeters;
    const fuseCost = fuseInfo.price;
    const packageTotal = wireCost + fuseCost;

    return {
      currentAmps: amps,
      recommendedGauge: gauge,
      recommendedFuse: fuse,
      voltageDropVolts: vDrop,
      voltageDropPercent: vDropPercent,
      isDropAcceptable: dropOk,
      totalPackagePrice: packageTotal,
    };
  }, [loadPowerWatts, distanceMeters, phaseType]);

  const animatedPackagePrice = useAnimatedNumber(totalPackagePrice, 250);
  const animatedAmps = useAnimatedNumber(Math.round(currentAmps * 10), 200) / 10;

  const handleAddPackageToCart = () => {
    const wireInfo = WIRE_PRICING[recommendedGauge] || WIRE_PRICING[2.5];
    const fuseInfo = FUSE_PRICING[recommendedFuse] || FUSE_PRICING["B16"];

    addToCart(
      {
        id: `${wireInfo.productId}-${distanceMeters}m`,
        name: `${wireInfo.name} (${toPersianDigits(distanceMeters)} متر برش سفارشی)`,
        slug: "alborz-pure-copper-cable",
        price: wireInfo.pricePerMeter * distanceMeters,
        stock: 500,
        category: { name: "سیم و کابل" },
      },
      1
    );

    addToCart(
      {
        id: fuseInfo.productId,
        name: fuseInfo.name,
        slug: "dena-electric-miniature-circuit-breaker",
        price: fuseInfo.price,
        stock: 50,
        category: { name: "تجهیزات حفاظتی" },
      },
      1
    );

    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2500);
  };

  return (
    <section id="calculator" className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-8 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 sm:space-y-6 relative overflow-hidden transition-colors duration-200 scroll-mt-28">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Preset Selector */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400 text-xs font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
            <Calculator className="w-3.5 h-3.5" />
            <span>محاسبه‌گر مهندسی سایز کابل و فیوز مینیاتوری</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            تعیین استاندارد سیم مسی، افت ولتاژ و تیپ فیوز
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            بر اساس مقررات ملی ساختمان ایران (مبحث ۱۳) و استانداردهای نظام مهندسی برق
          </p>
        </div>

        {/* Device Preset Dropdown Selector */}
        <div className="w-full md:w-auto">
          <div className="relative">
            <select
              value={selectedPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="w-full md:w-64 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-amber-500 appearance-none cursor-pointer transition-colors shadow-sm"
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
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                phaseType === "single"
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-black"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              ۲۲۰V تک‌فاز (خانگی)
            </button>
            <button
              type="button"
              onClick={() => setPhaseType("three")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                phaseType === "three"
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-black"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              ۳۸۰V سه‌فاز (صنعتی)
            </button>
          </div>
        </div>

        {/* Input 2: Load Power */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-750 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300">توان مصرفی:</span>
            <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">
              {toPersianDigits(loadPowerWatts)} وات ({(loadPowerWatts / 1000).toFixed(1)} kW)
            </span>
          </div>
          <input
            type="range"
            min="200"
            max="15000"
            step="100"
            value={loadPowerWatts}
            onChange={(e) => setLoadPowerWatts(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">
            <span>۲۰۰W</span>
            <span>۵kW</span>
            <span>۱۵kW</span>
          </div>
        </div>

        {/* Input 3: Distance */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-750 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300">طول مسیر سیم‌کشی:</span>
            <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">
              {toPersianDigits(distanceMeters)} متر
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="150"
            step="5"
            value={distanceMeters}
            onChange={(e) => setDistanceMeters(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">
            <span>۵ متر</span>
            <span>۷۵ متر</span>
            <span>۱۵۰ متر</span>
          </div>
        </div>
      </div>

      {/* Engineering Results Display Box */}
      <div className="bg-slate-100 dark:bg-slate-950 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left Col: Calculated Technical Values */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1 font-medium">جریان نامی مصرفی</span>
              <strong className="text-amber-600 dark:text-amber-400 font-mono text-sm sm:text-base font-bold transition-all">
                {animatedAmps.toFixed(1)} A
              </strong>
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-amber-500/50 shadow-sm">
              <span className="text-[11px] text-slate-600 dark:text-slate-300 block mb-1 font-medium">سایز سیم پیشنهادی</span>
              <strong className="text-slate-950 dark:text-white font-mono text-sm sm:text-base font-black">
                {recommendedGauge} mm²
              </strong>
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1 font-medium">فیوز مینیاتوری</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm sm:text-base font-bold">
                {recommendedFuse}
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

        {/* Right Col: Instant 1-Click Purchase Package */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">پکیج کابل مس + فیوز محافظ:</span>
            <span className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400 font-mono transition-all">
              {formatToman(animatedPackagePrice)}
            </span>
          </div>

          <button
            onClick={handleAddPackageToCart}
            className={`w-full py-3 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 ${
              isAddedToCart
                ? "bg-emerald-600 text-white"
                : "bg-amber-500 hover:bg-amber-400 text-slate-950 hover-glow"
            }`}
          >
            {isAddedToCart ? (
              <>
                <Check className="w-4 h-4" />
                <span>پکیج به سبد خرید اضافه شد</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>افزودن سیم ({toPersianDigits(distanceMeters)}متر) و فیوز به سبد</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
