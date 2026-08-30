"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Award, Sparkles, ExternalLink } from "lucide-react";

const OFFICIAL_BRANDS = [
  {
    name: "پارس خزر",
    category: "پنکه و تهویه خانگی",
    tag: "ضمانت ۲۴ ماهه",
    slug: "pars-khazar",
    monogram: "PK",
    accentColor: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-500",
  },
  {
    name: "موتوژن تبریز",
    category: "الکتروموتور کولر آبی",
    tag: "سیم مس ۱۰۰٪",
    slug: "motogen",
    monogram: "MG",
    accentColor: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-500",
  },
  {
    name: "البرز الکتریک",
    category: "سیم و کابل مس",
    tag: "استاندارد توانیر",
    slug: "alborz",
    monogram: "AL",
    accentColor: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-500",
  },
  {
    name: "صنایع اخوان",
    category: "بخاری برقی و هیتر",
    tag: "گارانتی شرکتی",
    slug: "akhavan",
    monogram: "AK",
    accentColor: "from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-500",
  },
  {
    name: "آنتن هانی",
    category: "تقویت سیگنال و دیجیتال",
    tag: "گیرندگی فوق‌العاده",
    slug: "hani",
    monogram: "HN",
    accentColor: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-500",
  },
  {
    name: "افراتاب",
    category: "روشنایی و پروژکتور LED",
    tag: "فوق‌کم‌مصرف A+",
    slug: "afratab",
    monogram: "AF",
    accentColor: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-500",
  },
  {
    name: "پارس شهاب",
    category: "لامپ و سیستم‌های نور",
    tag: "طول عمر بالا",
    slug: "pars-shahab",
    monogram: "PS",
    accentColor: "from-teal-500/20 to-teal-600/10 border-teal-500/30 text-teal-500",
  },
  {
    name: "شیوا امواج",
    category: "رله و کنترل صنعتی",
    tag: "دقت مهندسی",
    slug: "shiva-amvaj",
    monogram: "SH",
    accentColor: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-500",
  },
  {
    name: "سیم و کابل اصفهان",
    category: "هادی مس تمام عیار",
    tag: "خلوص ۹۹.۹٪",
    slug: "isfahan-cable",
    monogram: "IC",
    accentColor: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-500",
  },
  {
    name: "دلند الکتریک",
    category: "کلید و پریز لوکس",
    tag: "مقاوم و استاندارد",
    slug: "deland",
    monogram: "DL",
    accentColor: "from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-500",
  },
];

export function BrandLogosRow() {
  // Duplicate array twice for smooth infinite loop
  const marqueeBrands = [...OFFICIAL_BRANDS, ...OFFICIAL_BRANDS];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 relative overflow-hidden transition-colors duration-200">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <span>عاملیت رسمی و برندهای همکار کارگاه شیاسی</span>
        </h3>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>ضمانت اصالت و عاملیت مجاز</span>
        </div>
      </div>

      {/* Infinite Auto-scrolling Marquee Container with Edge Fades */}
      <div className="relative w-full overflow-hidden py-1">
        
        {/* Right and Left Edge Gradient Masks for Smooth In/Out Fading */}
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />

        {/* 60fps Scrolling Track */}
        <div className="animate-marquee-rtl flex items-center gap-3.5 sm:gap-4 select-none cursor-pointer">
          {marqueeBrands.map((b, idx) => (
            <Link
              key={`${b.slug}-${idx}`}
              href={`/products?brand=${encodeURIComponent(b.slug)}`}
              className="group shrink-0 w-52 sm:w-60 bg-slate-50 dark:bg-slate-850/80 hover:bg-white dark:hover:bg-slate-800 p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-amber-500/60 dark:hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 shadow-2xs hover:shadow-lg hover:shadow-amber-500/10 flex items-center gap-3"
            >
              {/* Monogram Badge */}
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${b.accentColor} border flex items-center justify-center font-mono font-black text-sm sm:text-base shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-inner`}>
                {b.monogram}
              </div>

              {/* Brand Title & Tag */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate group-hover:text-amber-500 transition-colors">
                    {b.name}
                  </h4>
                  <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>

                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                  {b.category}
                </p>

                <div className="mt-1">
                  <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    {b.tag}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>

      <div className="pt-1 text-center">
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          با قرار دادن ماوس یا لمس، حرکت متوقف شده و می‌توانید کالاهای هر برند را بررسی فرمایید.
        </span>
      </div>

    </div>
  );
}
