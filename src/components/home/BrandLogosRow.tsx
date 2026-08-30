"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  ExternalLink,
  Fan,
  Cpu,
  Zap,
  Flame,
  Radio,
  Lightbulb,
  Sun,
  Activity,
  Layers,
  ToggleRight,
} from "lucide-react";

interface BrandItem {
  name: string;
  category: string;
  tag: string;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  borderColor: string;
}

const OFFICIAL_BRANDS: BrandItem[] = [
  {
    name: "پارس خزر",
    category: "پنکه و تهویه خانگی",
    tag: "ضمانت ۲۴ ماهه",
    slug: "pars-khazar",
    icon: Fan,
    iconBg: "bg-rose-500/15 dark:bg-rose-500/20",
    iconColor: "text-rose-500",
    borderColor: "border-rose-500/30 group-hover:border-rose-500",
  },
  {
    name: "موتوژن تبریز",
    category: "الکتروموتور کولر آبی",
    tag: "سیم مس ۱۰۰٪",
    slug: "motogen",
    icon: Cpu,
    iconBg: "bg-blue-500/15 dark:bg-blue-500/20",
    iconColor: "text-blue-500",
    borderColor: "border-blue-500/30 group-hover:border-blue-500",
  },
  {
    name: "البرز الکتریک",
    category: "سیم و کابل استاندارد",
    tag: "تاییدیه توانیر",
    slug: "alborz",
    icon: Zap,
    iconBg: "bg-emerald-500/15 dark:bg-emerald-500/20",
    iconColor: "text-emerald-500",
    borderColor: "border-emerald-500/30 group-hover:border-emerald-500",
  },
  {
    name: "صنایع اخوان",
    category: "بخاری برقی و هیتر",
    tag: "گارانتی شرکتی",
    slug: "akhavan",
    icon: Flame,
    iconBg: "bg-amber-500/15 dark:bg-amber-500/20",
    iconColor: "text-amber-500",
    borderColor: "border-amber-500/30 group-hover:border-amber-500",
  },
  {
    name: "آنتن هانی",
    category: "تقویت سیگنال و گیرنده",
    tag: "کیفیت تصویر 4K",
    slug: "hani",
    icon: Radio,
    iconBg: "bg-purple-500/15 dark:bg-purple-500/20",
    iconColor: "text-purple-500",
    borderColor: "border-purple-500/30 group-hover:border-purple-500",
  },
  {
    name: "افراتاب",
    category: "روشنایی و پروژکتور LED",
    tag: "فوق‌کم‌مصرف A+",
    slug: "afratab",
    icon: Lightbulb,
    iconBg: "bg-yellow-500/15 dark:bg-yellow-500/20",
    iconColor: "text-yellow-500",
    borderColor: "border-yellow-500/30 group-hover:border-yellow-500",
  },
  {
    name: "پارس شهاب",
    category: "لامپ و سیستم‌های نور",
    tag: "طول عمر بالا",
    slug: "pars-shahab",
    icon: Sun,
    iconBg: "bg-teal-500/15 dark:bg-teal-500/20",
    iconColor: "text-teal-500",
    borderColor: "border-teal-500/30 group-hover:border-teal-500",
  },
  {
    name: "شیوا امواج",
    category: "رله و کنترل صنعتی",
    tag: "دقت مهندسی",
    slug: "shiva-amvaj",
    icon: Activity,
    iconBg: "bg-indigo-500/15 dark:bg-indigo-500/20",
    iconColor: "text-indigo-500",
    borderColor: "border-indigo-500/30 group-hover:border-indigo-500",
  },
  {
    name: "سیم و کابل اصفهان",
    category: "هادی تمام مس",
    tag: "خلوص ۹۹.۹٪",
    slug: "isfahan-cable",
    icon: Layers,
    iconBg: "bg-cyan-500/15 dark:bg-cyan-500/20",
    iconColor: "text-cyan-500",
    borderColor: "border-cyan-500/30 group-hover:border-cyan-500",
  },
  {
    name: "دلند الکتریک",
    category: "کلید و پریز ساختمانی",
    tag: "مقاوم و استاندارد",
    slug: "deland",
    icon: ToggleRight,
    iconBg: "bg-orange-500/15 dark:bg-orange-500/20",
    iconColor: "text-orange-500",
    borderColor: "border-orange-500/30 group-hover:border-orange-500",
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
          {marqueeBrands.map((b, idx) => {
            const Icon = b.icon;
            return (
              <Link
                key={`${b.slug}-${idx}`}
                href={`/products?brand=${encodeURIComponent(b.slug)}`}
                className={`group shrink-0 w-52 sm:w-60 bg-slate-50 dark:bg-slate-850/80 hover:bg-white dark:hover:bg-slate-800 p-3 sm:p-3.5 rounded-2xl border ${b.borderColor} transition-all duration-300 hover:-translate-y-1 shadow-2xs hover:shadow-lg hover:shadow-amber-500/10 flex items-center gap-3`}
              >
                {/* Brand Logo Emblem */}
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${b.iconBg} border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center ${b.iconColor} shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                  <Icon className="w-6 h-6 sm:w-6.5 sm:h-6.5" />
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
            );
          })}
        </div>

      </div>

    </div>
  );
}
