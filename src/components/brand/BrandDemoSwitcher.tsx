"use client";

import React from "react";
import { useBrand, BrandKey } from "@/context/BrandContext";
import { Sparkles, Check, Palette } from "lucide-react";

export function BrandDemoSwitcher() {
  const { brandKey, setBrandKey } = useBrand();

  const options: { key: BrandKey; title: string; subtitle: string }[] = [
    {
      key: "shiasi",
      title: "دمو ۱: فروشگاه شیاسی (Shiasi Store)",
      subtitle: "طراحی مدرن ادیسون‌کالا / الکسترا",
    },
    {
      key: "naghshejahan",
      title: "دمو ۲: الکتریک نقش جهان اصفهان",
      subtitle: "هویت بومی و تامین‌کننده اصفهان",
    },
    {
      key: "shiasi_isfahan",
      title: "دمو ۳: برق و الکترونیک شیاسی اصفهان",
      subtitle: "ترکیب جامع قطعات و روشنایی",
    },
  ];

  return (
    <div className="bg-slate-950 text-white border-b border-amber-500/30 px-3 py-2 text-xs no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <Palette className="w-4 h-4" />
          <span>انتخاب زنده هویت و نام برند (Live Brand Switcher):</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setBrandKey(opt.key)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                brandKey === opt.key
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 ring-2 ring-white/20"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
              }`}
            >
              {brandKey === opt.key && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              <span>{opt.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
