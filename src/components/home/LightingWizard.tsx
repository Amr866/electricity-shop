"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lightbulb, Zap, Sun, Shield, ArrowLeft, Sparkles } from "lucide-react";

export function LightingWizard() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("ال‌ای‌دی");
  const [selectedPower, setSelectedPower] = useState("توان ۱۰۰ وات");
  const [selectedColor, setSelectedColor] = useState("آفتابی");
  const [selectedIP, setSelectedIP] = useState("IP65");

  const types = ["ال‌ای‌دی", "SMD", "COB", "فیلامنتی"];
  const powers = ["توان ۲۰ وات", "توان ۵۰ وات", "توان ۱۰۰ وات", "توان ۲۰۰ وات"];
  const colors = ["آفتابی", "مهتابی", "طبیعی (نچرال)"];
  const ips = ["IP20 (فضای داخلی)", "IP65 (ضدباران و گردوغبار)", "IP68 (استخری)"];

  const handleSearch = () => {
    const query = `${selectedType} ${selectedPower} ${selectedColor}`;
    router.push(`/products?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 max-w-2xl space-y-2">
        <span className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
          <Lightbulb className="w-4 h-4" />
          <span>راهنمای تخصصی انتخاب روشنایی و توان</span>
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
          دقیقاً همان نوری که فضای شما نیاز دارد
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          بر اساس کاربرد، دمای رنگ، توان و درجه حفاظت فیلتر کنید و در چند ثانیه بهترین چراغ، پنل یا پروژکتور متناسب با پروژه خود را انتخاب فرمایید.
        </p>
      </div>

      {/* Interactive Selectable Chips Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Type */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2.5">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            نوع تکنولوژی:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {types.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedType(t)}
                className={`text-xs px-2.5 py-1.5 rounded-xl font-bold transition-all ${
                  selectedType === t
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Wattage */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2.5">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            توان مصرفی و روشنایی:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {powers.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPower(p)}
                className={`text-xs px-2.5 py-1.5 rounded-xl font-bold transition-all ${
                  selectedPower === p
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Color Temperature */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2.5">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            طیف و دمای رنگ:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedColor(c)}
                className={`text-xs px-2.5 py-1.5 rounded-xl font-bold transition-all ${
                  selectedColor === c
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 4. IP Protection */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2.5">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            درجه حفاظت فیزیکی:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {ips.map((ip) => (
              <button
                key={ip}
                type="button"
                onClick={() => setSelectedIP(ip)}
                className={`text-xs px-2.5 py-1.5 rounded-xl font-bold transition-all ${
                  selectedIP === ip
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {ip.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
        <div className="text-xs text-slate-400">
          فیلتر انتخاب شده: <strong className="text-amber-400">{selectedType} - {selectedPower} - رنگ {selectedColor}</strong>
        </div>

        <button
          onClick={handleSearch}
          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
        >
          <span>مشاهده محصولات منطبق</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
