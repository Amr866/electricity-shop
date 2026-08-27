"use client";

import React from "react";
import Link from "next/link";
import { useBrand } from "@/context/BrandContext";
import {
  Zap,
  Truck,
  ArrowLeft,
  Sparkles,
  Wrench,
  ChevronLeft,
} from "lucide-react";

export function HeroBanner() {
  const { brand } = useBrand();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50/60 via-slate-50 to-slate-100/40 dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950 text-slate-900 dark:text-white py-10 sm:py-14 lg:py-16 border-b border-slate-200/80 dark:border-slate-800/40 transition-colors duration-300">
      
      {/* Subtle Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-amber-400/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-slate-400/10 dark:bg-slate-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Hero Content & Clear CTA Hierarchy */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-right">
            
            {/* Location & Authenticity Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>فروشگاه و کارگاه تخصصی شیاسی (نجف‌آباد)</span>
            </div>

            {/* Main Headline: Perfectly Balanced Symmetrical Lines */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black leading-[1.35] tracking-tight text-slate-900 dark:text-white">
              مرکز خرید و خدمات تخصصی <br />
              <span className="text-amber-600 dark:text-amber-400">
                لوازم برقی، موتور کولر و پنکه
              </span>
            </h1>

            {/* Sub-text: High Contrast WCAG AAA */}
            <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm sm:text-base leading-relaxed max-w-2xl text-justify font-medium">
              تأمین مستقیم انواع پنکه ریموت‌دار، دینام و پمپ کولر آبی، بخاری برقی، سیم و کابل استاندارد تمام مس و آنتن تلویزیون، به همراه کارگاه پذیرش و عیب‌یابی تخصصی در نجف‌آباد.
            </p>

            {/* Courier & Workshop Highlights */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-slate-800 dark:text-slate-200 pt-1 font-medium">
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>ارسال فوری در نجف‌آباد و اصفهان</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>پذیرش و تست در کارگاه نجف‌آباد</span>
              </div>
            </div>

            {/* Action Buttons: Strict Hierarchy (1 Primary + 1 Secondary) */}
            <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-3">
              {/* PRIMARY CTA: Amber Solid */}
              <Link
                href="/products"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center gap-2 active:scale-95 hover-glow"
              >
                <span>مشاهده کاتالوگ محصولات</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              {/* SECONDARY CTA: Clean Outline / Neutral */}
              <Link
                href="/repair-service"
                className="bg-white/90 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 shadow-sm active:scale-95"
              >
                <Wrench className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>پذیرش آنلاین تعمیرات</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Clean, Two-Tier Showcase Cards (Isolated Photo + Dedicated Text Area) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-3.5">
            
            {/* Card 1: Motogen */}
            <Link
              href="/price-lists#motogen"
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 p-2.5 sm:p-3 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 shadow-sm hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 overflow-hidden flex items-center justify-center p-2 mb-2">
                <img
                  src="/images/products/موتور-کولر-موتوژن-3-4.jpg"
                  alt="موتور کولر موتوژن تبریز"
                  className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
                />
                <span className="absolute top-1.5 right-1.5 text-[9px] sm:text-[10px] font-bold bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700 shadow-sm backdrop-blur-sm">
                  لیست قیمت
                </span>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                    موتور کولر موتوژن
                  </h3>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-x-0.5 transition-transform shrink-0" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  سیم‌پیچی مس و گارانتی معتبر
                </p>
              </div>
            </Link>

            {/* Card 2: Pars Khazar */}
            <Link
              href="/price-lists#parskhazar"
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 p-2.5 sm:p-3 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 shadow-sm hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 overflow-hidden flex items-center justify-center p-2 mb-2">
                <img
                  src="/images/products/wal_172619-fans-7995865_1920.jpg"
                  alt="پنکه پارس خزر"
                  className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
                />
                <span className="absolute top-1.5 right-1.5 text-[9px] sm:text-[10px] font-bold bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700 shadow-sm backdrop-blur-sm">
                  کاتالوگ رسمی
                </span>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                    پنکه و لوازم پارس خزر
                  </h3>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-x-0.5 transition-transform shrink-0" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  ایستاده ریموت‌دار و رومیزی
                </p>
              </div>
            </Link>

            {/* Card 3: Alborz Electric Wire */}
            <Link
              href="/price-lists#alborz-wire"
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 p-2.5 sm:p-3 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 shadow-sm hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 overflow-hidden flex items-center justify-center p-2 mb-2">
                <img
                  src="/images/products/skdunning-wire-962753_1920.jpg"
                  alt="سیم و کابل البرز الکتریک"
                  className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
                />
                <span className="absolute top-1.5 right-1.5 text-[9px] sm:text-[10px] font-bold bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700 shadow-sm backdrop-blur-sm">
                  سیم و کابل
                </span>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                    سیم افشان تمام مس
                  </h3>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-x-0.5 transition-transform shrink-0" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  کلاف ۱۰۰ متری و برش متری
                </p>
              </div>
            </Link>

            {/* Card 4: Shahcheragh LED */}
            <Link
              href="/price-lists#shahcheragh"
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 p-2.5 sm:p-3 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 shadow-sm hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 overflow-hidden flex items-center justify-center p-2 mb-2">
                <img
                  src="/images/products/inspiredimages-light-bulb-1138047_1920.jpg"
                  alt="روشنایی شاهچراغ"
                  className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
                />
                <span className="absolute top-1.5 right-1.5 text-[9px] sm:text-[10px] font-bold bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700 shadow-sm backdrop-blur-sm">
                  روشنایی LED
                </span>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                    پنل‌های روشنایی LED
                  </h3>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-x-0.5 transition-transform shrink-0" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  پروژکتور و پنل‌های سنسوردار
                </p>
              </div>
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
}
