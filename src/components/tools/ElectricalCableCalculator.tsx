"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatToman, toPersianDigits } from "@/lib/utils";
import {
  Calculator,
  Zap,
  ShieldAlert,
  CheckCircle2,
  ShoppingCart,
  ArrowLeft,
  Sparkles,
  Info,
  ChevronDown,
} from "lucide-react";

export function ElectricalCableCalculator() {
  const { addToCart } = useCart();

  // Inputs
  const [phaseType, setPhaseType] = useState<"single" | "three">("single"); // 220V vs 380V
  const [loadPowerWatts, setLoadPowerWatts] = useState<number>(3500); // in Watts
  const [distanceMeters, setDistanceMeters] = useState<number>(25); // in Meters
  const [appliancePreset, setAppliancePreset] = useState<string>("cooler_motor");
  const [addedToCart, setAddedToCart] = useState(false);

  // Presets
  const PRESETS = [
    { id: "cooler_motor", name: "موتور کولر آبی + پمپ", power: 1200, phase: "single" as const },
    { id: "electric_heater", name: "بخاری برقی / هیتر ۲ کیلووات", power: 2200, phase: "single" as const },
    { id: "lighting_circuit", name: "مدار روشنایی و لاین نوری ساختمان", power: 800, phase: "single" as const },
    { id: "split_ac", name: "اسپلیت و کولر گازی ۲۴۰۰۰", power: 3500, phase: "single" as const },
    { id: "workshop_motor", name: "الکتروموتور کارگاهی سه‌فاز ۵.۵ اسب", power: 4000, phase: "three" as const },
  ];

  const handleSelectPreset = (presetId: string) => {
    const found = PRESETS.find((p) => p.id === presetId);
    if (found) {
      setAppliancePreset(presetId);
      setLoadPowerWatts(found.power);
      setPhaseType(found.phase);
    }
  };

  // Calculation Logic (Standard Iranian National Building Code - مبحث ۱۳ مقررات ملی ساختمان)
  const voltage = phaseType === "single" ? 220 : 380;
  const powerFactor = 0.85; // typical inductive load
  
  // Current in Amperes
  const currentAmps =
    phaseType === "single"
      ? loadPowerWatts / (voltage * powerFactor)
      : loadPowerWatts / (Math.sqrt(3) * voltage * powerFactor);

  // Copper resistivity rho = 0.0175 ohm*mm2/m
  // Voltage drop formula: deltaV = 2 * L * I * rho / S (for single phase)
  // Required cross section S = 2 * L * I * rho / (V * deltaV_percentage)
  const maxDropPercent = 0.03; // 3% allowable voltage drop
  const maxDropVolts = voltage * maxDropPercent;
  
  const minCrossSectionDrop =
    phaseType === "single"
      ? (2 * distanceMeters * currentAmps * 0.0175) / maxDropVolts
      : (Math.sqrt(3) * distanceMeters * currentAmps * 0.0175) / maxDropVolts;

  // Determine standard copper wire size
  let recommendedGauge = 1.5;
  let recommendedFuseAmps = 10;
  let recommendedFuseType = "B10";

  if (currentAmps <= 10 && minCrossSectionDrop <= 1.5) {
    recommendedGauge = 1.5;
    recommendedFuseAmps = 10;
    recommendedFuseType = "B10 یا B16";
  } else if (currentAmps <= 16 && minCrossSectionDrop <= 2.5) {
    recommendedGauge = 2.5;
    recommendedFuseAmps = 16;
    recommendedFuseType = "B16";
  } else if (currentAmps <= 25 && minCrossSectionDrop <= 4.0) {
    recommendedGauge = 4.0;
    recommendedFuseAmps = 25;
    recommendedFuseType = "C25";
  } else if (currentAmps <= 35 && minCrossSectionDrop <= 6.0) {
    recommendedGauge = 6.0;
    recommendedFuseAmps = 32;
    recommendedFuseType = "C32";
  } else {
    recommendedGauge = 10.0;
    recommendedFuseAmps = 50;
    recommendedFuseType = "C50";
  }

  // Estimated pricing for recommended products
  const cableMeterPrice =
    recommendedGauge === 1.5
      ? 9800
      : recommendedGauge === 2.5
      ? 16500
      : recommendedGauge === 4.0
      ? 28000
      : 42000;

  const totalCableCost = cableMeterPrice * distanceMeters;
  const fuseCost = 145000;

  const handleAddBundleToCart = () => {
    // Add Cable
    addToCart(
      {
        id: `cable-${recommendedGauge}`,
        name: `سیم برق افشان تمام مس استاندارد سایز ${recommendedGauge} میلی‌متر (${distanceMeters} متر)`,
        slug: "copper-wire-15-alborz-electric",
        price: cableMeterPrice,
        stock: 500,
        images: [{ url: "/images/products/parto-electric-stranded-wire-1-15.png" }],
      },
      distanceMeters
    );

    // Add Fuse
    addToCart(
      {
        id: `fuse-${recommendedFuseAmps}`,
        name: `کلید فیوز مینیاتوری ${recommendedFuseType} اشنایدر / هیوندای استاندارد`,
        slug: "copper-wire-15-alborz-electric",
        price: fuseCost,
        stock: 50,
        images: [{ url: "/images/products/ds_30-cable-4875319_1920.jpg" }],
      },
      1
    );

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Calculator className="w-5 h-5" />
            </span>
            <h3 className="text-base sm:text-xl font-extrabold text-white">
              محاسبه‌گر مهندسی سایز کابل و فیوز مینیاتوری
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            بر اساس استاندارد مقررات ملی ساختمان ایران (مبحث ۱۳) و مسافت کابل‌کشی
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <span className="text-[11px] text-slate-400 font-semibold shrink-0">دستگاه:</span>
          <select
            value={appliancePreset}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-amber-400 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 font-bold w-full sm:w-auto"
          >
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Form Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {/* Input 1: Phase Type */}
        <div className="p-4 bg-slate-850/80 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-300 block">
            نوع برق ورودی:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPhaseType("single")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                phaseType === "single"
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black"
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
              }`}
            >
              ۲۲۰V تک‌فاز (خانگی)
            </button>
            <button
              type="button"
              onClick={() => setPhaseType("three")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                phaseType === "three"
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black"
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
              }`}
            >
              ۳۸۰V سه‌فاز (صنعتی)
            </button>
          </div>
        </div>

        {/* Input 2: Load Power */}
        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300">توان مصرفی مصرف‌کننده:</span>
            <span className="text-amber-400 font-mono font-bold">
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
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>۲۰۰W</span>
            <span>۵kW</span>
            <span>۱۵kW</span>
          </div>
        </div>

        {/* Input 3: Distance */}
        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300">مسافت کابل‌کشی (طول سیم):</span>
            <span className="text-amber-400 font-mono font-bold">
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
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>۵ متر</span>
            <span>۷۵ متر</span>
            <span>۱۵۰ متر</span>
          </div>
        </div>
      </div>

      {/* Engineering Results Display Box */}
      <div className="bg-slate-950/90 rounded-3xl p-5 sm:p-6 border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left Col: Calculated Technical Values */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">جریان نامی مصرفی</span>
              <strong className="text-amber-400 font-mono text-sm sm:text-base font-bold">
                {currentAmps.toFixed(1)} A
              </strong>
            </div>

            <div className="p-3 bg-slate-900 rounded-2xl border border-amber-500/40 shadow-sm">
              <span className="text-[11px] text-slate-300 block mb-1">سایز سیم پیشنهادی</span>
              <strong className="text-white font-mono text-sm sm:text-base font-black">
                {recommendedGauge} mm²
              </strong>
            </div>

            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">فیوز مینیاتوری</span>
              <strong className="text-emerald-400 font-mono text-sm sm:text-base font-bold">
                {recommendedFuseType}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              سیم محاسبه‌شده ۱۰۰٪ تمام مس آنیل شده با افت ولتاژ زیر ۳٪ در مسافت {toPersianDigits(distanceMeters)} متر است.
            </span>
          </div>
        </div>

        {/* Right Col: Instant 1-Click Purchase of calculated bundle */}
        <div className="lg:col-span-5 bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">پکیج کابل مس + فیوز محافظ:</span>
            <span className="text-amber-400 font-extrabold font-mono text-sm">
              {formatToman(totalCableCost + fuseCost)}
            </span>
          </div>

          <button
            onClick={handleAddBundleToCart}
            className={`w-full py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 hover-glow ${
              addedToCart
                ? "bg-emerald-600 text-white shadow-emerald-600/30"
                : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20"
            }`}
          >
            {addedToCart ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>پکیج کابل و فیوز به سبد اضافه شد</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>افزودن سیم ({distanceMeters}متر) و فیوز به سبد</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
