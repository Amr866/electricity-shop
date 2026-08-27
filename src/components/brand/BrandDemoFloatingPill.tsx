"use client";

import React, { useState } from "react";
import { useBrand, BrandKey } from "@/context/BrandContext";
import { Palette, Check, X } from "lucide-react";

export function BrandDemoFloatingPill() {
  const { brandKey, setBrandKey } = useBrand();
  const [open, setOpen] = useState(false);

  const options: { key: BrandKey; title: string; desc: string }[] = [
    {
      key: "shiasi",
      title: "۱. فروشگاه تخصصی شیاسی (Shiasi Store)",
      desc: "هویت جامع فروشگاهی و قطعات الکترونیک در نجف‌آباد اصفهان",
    },
    {
      key: "shiasi_appliances",
      title: "۲. فروشگاه شیاسی (لوازم برقی و خانگی)",
      desc: "فروش تخصصی پنکه، موتور کولر آبی، بخاری برقی، آنتن و سیم و کابل",
    },
    {
      key: "shiasi_workshop",
      title: "۳. کارگاه فنی و خدمات تعمیرات شیاسی",
      desc: "مرکز عیب‌یابی و تعمیر انواع لوازم برقی با قطعات اصلی و مهلت تست",
    },
  ];

  return (
    <div className="hidden md:block fixed bottom-6 left-4 z-40 no-print">
      {open ? (
        <div className="bg-slate-950 text-white border border-amber-500/40 rounded-3xl p-4 shadow-2xl w-80 sm:w-96 space-y-3 animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
              <Palette className="w-4 h-4" />
              <span>سوئیچ زنده هویت فروشگاه شیاسی:</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            {options.map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  setBrandKey(opt.key);
                }}
                className={`w-full text-right p-2.5 rounded-2xl text-xs transition-all flex items-start gap-2 ${
                  brandKey === opt.key
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-white border border-slate-800"
                }`}
              >
                {brandKey === opt.key ? (
                  <Check className="w-4 h-4 shrink-0 mt-0.5 stroke-[3]" />
                ) : (
                  <span className="w-4 h-4 shrink-0 mt-0.5 inline-block" />
                )}
                <div>
                  <div className="font-bold">{opt.title}</div>
                  <div
                    className={`text-[10px] ${
                      brandKey === opt.key ? "text-slate-900/80 font-medium" : "text-slate-400"
                    }`}
                  >
                    {opt.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="text-[10px] text-slate-400 pt-1 text-center">
            تغییرات به صورت آنی در کل سایت، هدر و پیش‌فاکتورها اعمال می‌شود.
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-slate-950/90 hover:bg-slate-900 text-amber-400 border border-amber-500/40 px-3.5 py-2 rounded-full shadow-xl flex items-center gap-2 text-xs font-bold backdrop-blur-md transition-all hover:scale-105"
          title="تغییر هویت برند"
        >
          <Palette className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">هویت فروشگاه شیاسی</span>
        </button>
      )}
    </div>
  );
}
