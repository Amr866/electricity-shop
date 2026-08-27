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
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50/70 via-slate-50 to-slate-100/50 dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950 text-slate-900 dark:text-white py-10 sm:py-14 lg:py-16 border-b border-slate-200/80 dark:border-slate-800/40 transition-colors duration-300">
      
      {/* Subtle Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-amber-400/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-slate-400/10 dark:bg-slate-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Hero Content & Clear CTA Hierarchy */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-right">
            
            {/* Location & Authenticity Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>فروشگاه و کارگاه تخصصی شیاسی (نجف‌آباد)</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-[1.3] tracking-tight text-slate-900 dark:text-white">
              مرکز خرید و خدمات فنی <br />
              <span className="text-amber-600 dark:text-amber-400">
                انواع لوازم برقی، موتور کولر، پنکه و سیم‌کشی
              </span>
            </h1>

            {/* Sub-text */}
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm sm:text-base leading-relaxed max-w-2xl text-justify">
              تأمین مستقیم انواع پنکه ریموت‌دار، دینام و پمپ کولر آبی، بخاری برقی، سیم و کابل استاندارد تمام مس و آنتن تلویزیون، به همراه کارگاه پذیرش و عیب‌یابی تخصصی در نجف‌آباد.
            </p>

            {/* Courier & Workshop Highlights */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs text-slate-700 dark:text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>ارسال فوری با اسنپ و پیک در نجف‌آباد و اصفهان</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <Wrench className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span>پذیرش و تست حضوری در کارگاه نجف‌آباد</span>
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
                className="bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 shadow-sm active:scale-95"
              >
                <Wrench className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>پذیرش آنلاین تعمیرات</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Cohesive Product Cards (Unified Theme & Clean Badges) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-3.5">
            
            {/* Card 1: Motogen */}
            <Link
              href="/price-lists#motogen"
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 shadow-sm hover:shadow-md h-40 sm:h-44 flex flex-col justify-between p-3.5"
            >
              <img
                src="/images/products/موتور-کولر-موتوژن-3-4.jpg"
                alt="موتور کولر موتوژن تبریز"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-80 dark:opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent dark:from-slate-950 dark:via-slate-950/75 dark:to-transparent" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-bold bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80">
                  لیست قیمت رسمی
                </span>
                <ChevronLeft className="w-4 h-4 text-slate-400 dark:text-slate-400 group-hover:-translate-x-1 transition-transform" />
              </div>

              <div className="relative z-10 space-y-0.5">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  موتور کولر موتوژن تبریز
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  سیم‌پیچی مس با گارانتی
                </p>
              </div>
            </Link>

            {/* Card 2: Pars Khazar */}
            <Link
              href="/price-lists#parskhazar"
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 shadow-sm hover:shadow-md h-40 sm:h-44 flex flex-col justify-between p-3.5"
            >
              <img
                src="/images/products/wal_172619-fans-7995865_1920.jpg"
                alt="پنکه پارس خزر"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-80 dark:opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent dark:from-slate-950 dark:via-slate-950/75 dark:to-transparent" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-bold bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80">
                  کاتالوگ شرکتی
                </span>
                <ChevronLeft className="w-4 h-4 text-slate-400 dark:text-slate-400 group-hover:-translate-x-1 transition-transform" />
              </div>

              <div className="relative z-10 space-y-0.5">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  پنکه و لوازم پارس خزر
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  ایستاده ریموت‌دار و رومیزی
                </p>
              </div>
            </Link>

            {/* Card 3: Alborz Electric Wire */}
            <Link
              href="/price-lists#alborz-wire"
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 shadow-sm hover:shadow-md h-40 sm:h-44 flex flex-col justify-between p-3.5"
            >
              <img
                src="/images/products/skdunning-wire-962753_1920.jpg"
                alt="سیم و کابل البرز الکتریک"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-80 dark:opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent dark:from-slate-950 dark:via-slate-950/75 dark:to-transparent" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-bold bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80">
                  سیم و کابل استاندارد
                </span>
                <ChevronLeft className="w-4 h-4 text-slate-400 dark:text-slate-400 group-hover:-translate-x-1 transition-transform" />
              </div>

              <div className="relative z-10 space-y-0.5">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  سیم افشان تمام مس البرز
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  کلاف ۱۰۰ متری و برش متری
                </p>
              </div>
            </Link>

            {/* Card 4: Shahcheragh LED */}
            <Link
              href="/price-lists#shahcheragh"
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 shadow-sm hover:shadow-md h-40 sm:h-44 flex flex-col justify-between p-3.5"
            >
              <img
                src="/images/products/inspiredimages-light-bulb-1138047_1920.jpg"
                alt="روشنایی شاهچراغ"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-80 dark:opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent dark:from-slate-950 dark:via-slate-950/75 dark:to-transparent" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-bold bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80">
                  روشنایی و LED
                </span>
                <ChevronLeft className="w-4 h-4 text-slate-400 dark:text-slate-400 group-hover:-translate-x-1 transition-transform" />
              </div>

              <div className="relative z-10 space-y-0.5">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  روشنایی و پنل شاهچراغ
                </h3>
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
