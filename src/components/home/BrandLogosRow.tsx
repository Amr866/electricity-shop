"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Award } from "lucide-react";

// 1. Modular Official Brands Data (Extracted outside render function)
const OFFICIAL_BRANDS = [
  {
    name: "پارس خزر",
    tag: "ضمانت ۲۴ ماهه",
    slug: "pars-khazar",
    monogram: "PK",
    badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  {
    name: "موتوژن تبریز",
    tag: "سیم مس ۱۰۰٪",
    slug: "motogen",
    monogram: "MG",
    badgeColor: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  {
    name: "البرز الکتریک",
    tag: "کابل استاندارد",
    slug: "alborz",
    monogram: "AL",
    badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    name: "صنایع اخوان",
    tag: "هیتر و بخاری",
    slug: "akhavan",
    monogram: "AK",
    badgeColor: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
  },
  {
    name: "آنتن هانی",
    tag: "تقویت سیگنال",
    slug: "hani",
    monogram: "HN",
    badgeColor: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
  },
  {
    name: "افراتاب",
    tag: "روشنایی LED",
    slug: "afratab",
    monogram: "AF",
    badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  {
    name: "پارس شهاب",
    tag: "لامپ فوق‌کم‌مصرف",
    slug: "pars-shahab",
    monogram: "PS",
    badgeColor: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
  },
  {
    name: "شیوا امواج",
    tag: "کنترل و رله",
    slug: "shiva-amvaj",
    monogram: "SH",
    badgeColor: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
  },
  {
    name: "سیم کابل اصفهان",
    tag: "هادی تمام مس",
    slug: "isfahan-cable",
    monogram: "IC",
    badgeColor: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
  },
  {
    name: "دلند الکتریک",
    tag: "کلید و پریز",
    slug: "deland",
    monogram: "DL",
    badgeColor: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
  },
];

export function BrandLogosRow() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors duration-200">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <span>عاملیت رسمی و برندهای همکار کارگاه شیاسی</span>
        </h3>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>ضمانت اصالت و گارانتی شرکتی</span>
        </span>
      </div>

      {/* Brands Grid: Horizontal Touch Slider on Mobile, 5-col Grid on Desktop */}
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {OFFICIAL_BRANDS.map((b) => (
          <Link
            key={b.slug}
            href={`/products?brand=${encodeURIComponent(b.slug)}`}
            aria-label={`مشاهده محصولات رسمی برند ${b.name}`}
            className="group relative p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-amber-50/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-750 hover:border-amber-400/80 dark:hover:border-amber-400/80 transition-all duration-300 flex items-center gap-2.5 min-w-[150px] sm:min-w-0 min-h-[58px] sm:min-h-[64px] shrink-0 snap-center shadow-2xs hover:shadow-md hover:-translate-y-1 active:scale-98 overflow-hidden"
          >
            {/* Ambient hover light */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Brand Monogram Icon Badge */}
            <div className={`w-8 h-8 rounded-xl ${b.badgeColor} border flex items-center justify-center font-black text-xs font-mono shrink-0 shadow-2xs group-hover:scale-110 transition-transform duration-300`}>
              {b.monogram}
            </div>

            <div className="min-w-0 text-right relative z-10">
              <strong className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors block truncate">
                {b.name}
              </strong>
              <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium block truncate">
                {b.tag}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
