"use client";

import React, { useState } from "react";
import { toPersianDigits } from "@/lib/utils";
import { Shield, Zap, Sparkles, CheckCircle2, Layers } from "lucide-react";
import { IridescentFoil } from "@/components/ui/IridescentFoil";

interface LayerInfo {
  id: "jacket" | "insulation" | "copper";
  name: string;
  badge: string;
  material: string;
  specs: {
    label: string;
    value: string;
  }[];
  description: string;
  color: string;
}

const LAYERS: LayerInfo[] = [
  {
    id: "jacket",
    name: "روکش محافظ بیرونی (Outer PVC Sheath)",
    badge: "لایه بیرونی",
    material: "PVC گرید مقاومتی ضد سایش و شعله (Flame-Retardant)",
    specs: [
      { label: "مقاومت حرارتی", value: "-۵ تا +۷۰ درجه سانتی‌گراد" },
      { label: "استاندارد ملی", value: "ISIRI 607-5 / IEC 60227" },
      { label: "ویژگی", value: "مقاوم در برابر تابش نور خورشید و رطوبت" },
    ],
    description: "روکش مستحکم پلیمری که از هادی‌های داخلی در برابر تنش‌های مکانیکی، رطوبت، کشش و سایش کف لوله‌ها محافظت کامل می‌کند.",
    color: "from-slate-700 to-slate-900 border-slate-600 text-slate-100",
  },
  {
    id: "insulation",
    name: "لایه عایق دی‌الکتریک (Dielectric Insulation)",
    badge: "لایه میانی",
    material: "عایق پلی‌وینیل کلراید انعطاف‌پذیر ۷۰ درجه",
    specs: [
      { label: "ضخامت اسمی", value: "۰.۸ میلی‌متر یکنواخت" },
      { label: "استقامت دی‌الکتریک", value: "تست ولتاژ ۲,۵۰۰ ولت متناوب" },
      { label: "مقاومت الکتریکی عایق", value: "بیش از ۲۰ مگااهم در هر کیلومتر" },
    ],
    description: "عایق پلیمری الاستومری دور مغزی که از بروز هرگونه اتصال کوتاه، اتلاف جریان نشتی و تخلیه الکتریکی بین رشته‌ها جلوگیری می‌کند.",
    color: "from-amber-600 to-amber-700 border-amber-500 text-white",
  },
  {
    id: "copper",
    name: "مغزی مس خالص افشان (99.9% Pure Copper Core)",
    badge: "قلب رسانا",
    material: "مس بیلیتی آنیل‌شده با خلوص ۹۹.۹۹٪ (کلاس ۵ افشان)",
    specs: [
      { label: "درصد خلوص", value: "۹۹.۹۹٪ مس الکترولیتی فاقد آهن" },
      { label: "کلاس هادی", value: "کلاس ۵ (افشان بسیار انعطاف‌پذیر)" },
      { label: "مقاومت اهمی در ۲۰ درجه", value: "حداکثر ۴.۹۵ اهم/کیلومتر" },
    ],
    description: "رشته‌های نازک مس خالص که با تاب هماهنگ درون هسته قرار دارند. فاقد هرگونه آلیاژ آلومینیوم (CCA)، با حداقل اتلاف حرارتی و حداکثر هدایت جریان الکتریکی.",
    color: "from-amber-500 via-orange-500 to-amber-600 border-amber-400 text-slate-950",
  },
];

interface LayeredCablePeelProps {
  currentGauge?: number;
  className?: string;
}

export function LayeredCablePeel({ currentGauge = 2.5, className = "" }: LayeredCablePeelProps) {
  const [activeLayerId, setActiveLayerId] = useState<"jacket" | "insulation" | "copper">("copper");

  const activeLayer = LAYERS.find((l) => l.id === activeLayerId) || LAYERS[2];

  return (
    <div className={`bg-slate-900/90 dark:bg-slate-950 border border-slate-800 rounded-3xl p-3.5 sm:p-7 text-white shadow-xl relative overflow-hidden backdrop-blur-md ${className}`}>
      
      {/* Background Subtle Technical Grid Substrate */}
      <div 
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #f59e0b 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Layers className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-amber-400 font-mono tracking-wide">
              آناتومی لایه‌ای کابل استاندارد البرز
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              سایز {toPersianDigits(currentGauge)} mm²
            </span>
          </div>
          <h3 className="text-sm sm:text-lg font-black text-white">
            برش تعاملی مقطع کابل و نمایش مس خالص
          </h3>
        </div>

        {/* Layer Selector Chips */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
          {LAYERS.map((layer) => {
            const isSelected = layer.id === activeLayerId;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => setActiveLayerId(layer.id)}
                className={`text-[11px] sm:text-xs py-1.5 px-2 sm:px-2.5 rounded-lg font-bold text-center transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-850"
                }`}
              >
                {layer.badge}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        
        {/* Visual Layer Peel Cutaway Graphic (SVG with Dynamic Highlights) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 relative">
          
          <div className="relative w-full max-w-[280px] aspect-[4/3] flex items-center justify-center select-none">
            
            {/* Concentric Layer SVG Visualizer */}
            <svg
              viewBox="0 0 320 240"
              className="w-full h-full drop-shadow-2xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Copper Metallic Gradient */}
                <linearGradient id="copperShine" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="40%" stopColor="#d97706" />
                  <stop offset="70%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>

                {/* Insulation Amber/Orange Gradient */}
                <linearGradient id="insulationGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ea580c" />
                  <stop offset="50%" stopColor="#c2410c" />
                  <stop offset="100%" stopColor="#7c2d12" />
                </linearGradient>

                {/* Outer Jacket Dark PVC Gradient */}
                <linearGradient id="jacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="50%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                {/* Ambient Soft Glow Filter */}
                <filter id="layerGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. Outer PVC Jacket (Extends to the right) */}
              <g 
                onClick={() => setActiveLayerId("jacket")}
                className="cursor-pointer transition-all duration-300 hover:opacity-90"
              >
                <path
                  d="M 40 50 L 150 50 Q 180 50 180 120 Q 180 190 150 190 L 40 190 Q 20 190 20 120 Q 20 50 40 50 Z"
                  fill="url(#jacketGrad)"
                  stroke={activeLayerId === "jacket" ? "#f59e0b" : "#475569"}
                  strokeWidth={activeLayerId === "jacket" ? "3" : "1.5"}
                />
                {/* Jacket Ribbing Texture */}
                <line x1="60" y1="52" x2="60" y2="188" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                <line x1="90" y1="52" x2="90" y2="188" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                <line x1="120" y1="52" x2="120" y2="188" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              </g>

              {/* 2. Middle Dielectric Insulation (Stepping out from jacket) */}
              <g 
                onClick={() => setActiveLayerId("insulation")}
                className="cursor-pointer transition-all duration-300 hover:opacity-90"
              >
                <path
                  d="M 140 68 L 220 68 Q 240 68 240 120 Q 240 172 220 172 L 140 172 Q 155 120 140 68 Z"
                  fill="url(#insulationGrad)"
                  stroke={activeLayerId === "insulation" ? "#f59e0b" : "#ea580c"}
                  strokeWidth={activeLayerId === "insulation" ? "3" : "1.5"}
                />
              </g>

              {/* 3. Pure Copper Strands Core (Stepping out from insulation) */}
              <g 
                onClick={() => setActiveLayerId("copper")}
                className="cursor-pointer transition-all duration-300 hover:opacity-90"
              >
                {/* Bundle Core Body */}
                <path
                  d="M 210 82 L 280 82 Q 295 82 295 120 Q 295 158 280 158 L 210 158 Q 220 120 210 82 Z"
                  fill="url(#copperShine)"
                  stroke={activeLayerId === "copper" ? "#fde047" : "#b45309"}
                  strokeWidth={activeLayerId === "copper" ? "3" : "1.5"}
                  filter={activeLayerId === "copper" ? "url(#layerGlow)" : undefined}
                />
                
                {/* Multi-strand Individual Wire Filaments */}
                <circle cx="282" cy="100" r="3.5" fill="#fef08a" stroke="#78350f" strokeWidth="0.8" />
                <circle cx="288" cy="112" r="3.5" fill="#fde047" stroke="#78350f" strokeWidth="0.8" />
                <circle cx="282" cy="122" r="3.5" fill="#fef08a" stroke="#78350f" strokeWidth="0.8" />
                <circle cx="287" cy="132" r="3.5" fill="#fde047" stroke="#78350f" strokeWidth="0.8" />
                <circle cx="277" cy="140" r="3.5" fill="#fef08a" stroke="#78350f" strokeWidth="0.8" />
                <circle cx="272" cy="110" r="3" fill="#fde047" stroke="#78350f" strokeWidth="0.8" />
                <circle cx="275" cy="125" r="3" fill="#fbbf24" stroke="#78350f" strokeWidth="0.8" />
              </g>

              {/* Interactive Label Pointer to Active Layer */}
              {activeLayerId === "copper" && (
                <g>
                  <line x1="285" y1="75" x2="285" y2="35" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
                  <circle cx="285" cy="75" r="3" fill="#f59e0b" />
                  <rect x="230" y="15" width="110" height="22" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                  <text x="285" y="29" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">مس ۹۹.۹٪ کلاس ۵</text>
                </g>
              )}

              {activeLayerId === "insulation" && (
                <g>
                  <line x1="190" y1="65" x2="190" y2="35" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="2 2" />
                  <circle cx="190" cy="65" r="3" fill="#ea580c" />
                  <rect x="140" y="15" width="100" height="22" rx="6" fill="#0f172a" stroke="#ea580c" strokeWidth="1" />
                  <text x="190" y="29" fill="#fb923c" fontSize="10" fontWeight="bold" textAnchor="middle">عایق دی‌الکتریک</text>
                </g>
              )}

              {activeLayerId === "jacket" && (
                <g>
                  <line x1="90" y1="50" x2="90" y2="35" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" />
                  <circle cx="90" cy="50" r="3" fill="#94a3b8" />
                  <rect x="40" y="15" width="100" height="22" rx="6" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                  <text x="90" y="29" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">روکش PVC نسوز</text>
                </g>
              )}
            </svg>
          </div>

          <div className="text-[11px] text-slate-400 font-medium text-center mt-2">
            برای بازرسی لایه، روی بخش مربوطه در تصویر یا دکمه‌های بالا کلیک کنید
          </div>
        </div>

        {/* Layer Specifications Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-md border ${
                activeLayerId === "copper"
                  ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                  : activeLayerId === "insulation"
                  ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
                  : "bg-slate-700/50 text-slate-300 border-slate-600"
              }`}>
                {activeLayer.badge}
              </span>
              <span className="text-sm font-bold text-slate-300">
                جنس متریال: {activeLayer.material}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-black text-white">
              {activeLayer.name}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeLayer.description}
            </p>
          </div>

          {/* Metric Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {activeLayer.specs.map((spec, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1 text-right"
              >
                <div className="text-[10.5px] text-slate-400 font-medium">
                  {spec.label}
                </div>
                <div className="text-xs font-bold text-amber-400 font-mono">
                  {spec.value}
                </div>
              </div>
            ))}
          </div>

          {/* Guarantee Hologram Seal using IridescentFoil */}
          <IridescentFoil className="p-3 sm:p-3.5 rounded-2xl border border-amber-400/50 shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-extrabold text-xs text-slate-900 dark:text-amber-200">
                هولوگرام امنیتی اصالت ۹۹.۹٪ مس بیلیتی البرز
              </span>
            </div>
            <p className="text-[10.5px] text-slate-800 dark:text-slate-200 mt-1 leading-relaxed font-medium">
              تاییدیه آنالیز کوانتومتری متالورژی نجف‌آباد؛ بدون ناخالصی آلومینیوم (CCA)، با ضمانت مرجوعی مادام‌العمر در صورت هرگونه مغایرت وزن مس.
            </p>
          </IridescentFoil>

        </div>

      </div>

    </div>
  );
}
