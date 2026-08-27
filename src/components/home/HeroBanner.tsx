"use client";

import React from "react";
import Link from "next/link";
import { useBrand } from "@/context/BrandContext";
import {
  Zap,
  Truck,
  ShieldCheck,
  ArrowLeft,
  PhoneCall,
  Sparkles,
  Fan,
  Sun,
  Flame,
  Tv,
  Wrench,
  FileText,
  Download,
  ChevronLeft,
} from "lucide-react";

export function HeroBanner() {
  const { brand } = useBrand();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-slate-50 to-amber-100/40 dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950 text-slate-900 dark:text-white py-10 sm:py-14 lg:py-16 border-b border-slate-200/80 dark:border-slate-800/40 transition-colors duration-300">
      
      {/* Dark Mode Gradient Blending Fades */}
      <div className="hidden dark:block absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent pointer-events-none z-0" />
      <div className="hidden dark:block absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none z-0" />

      {/* Decorative Glows */}
      <div className="absolute top-0 right-1/4 w-72 sm:w-[32rem] h-72 sm:h-[32rem] bg-amber-400/10 dark:bg-amber-500/15 rounded-full blur-3xl sm:blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 sm:w-[32rem] h-72 sm:h-[32rem] bg-blue-400/10 dark:bg-blue-600/15 rounded-full blur-3xl sm:blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          {/* Left Column: Hero Content & CTAs */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-right">
            
            {/* Location & Authenticity Tag */}
            <div className="inline-flex items-center gap-2 bg-amber-500/15 dark:bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-400 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-500" />
              <span>فروشگاه و کارگاه فنی شیاسی در نجف‌آباد اصفهان</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-[1.3] tracking-tight text-slate-900 dark:text-white">
              مرکز خرید و تعمیرات تخصصی <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-l from-amber-600 via-amber-500 to-amber-700 dark:from-amber-400 dark:via-amber-300 dark:to-yellow-200">
                لوازم برقی، پنکه، کولر، بخاری و آنتن
              </span>
            </h1>

            {/* Sub-text */}
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm sm:text-base leading-relaxed max-w-2xl text-justify">
              خرید مستقیم انواع پنکه ریموت‌دار، دینام و پمپ کولر آبی، بخاری برقی، آنتن‌های دیجیتال، سیم و کابل تمام مس، به همراه کارگاه تعمیرات تخصصی و سیم‌پیچی موتور در نجف‌آباد با ضمانت کارکرد.
            </p>

            {/* Courier & Workshop Highlights */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs text-slate-700 dark:text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>تحویل فوری و پیک در نجف‌آباد، ویلاشهر، گلدشت و اصفهان</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>پذیرش و عیب‌یابی حضوری در کارگاه نجف‌آباد</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-3">
              <Link
                href="/products"
                className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center gap-2 active:scale-95"
              >
                <span>مشاهده کاتالوگ محصولات</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <Link
                href="/repair-service"
                className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 shadow-sm active:scale-95"
              >
                <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>پذیرش آنلاین تعمیرات</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Price List & Product Showcase Mini-Cards (Barghsan-Style) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-2.5 sm:gap-3.5">
            
            {/* Card 1: Motogen */}
            <Link
              href="/price-lists#motogen"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1.5 shadow-md hover:shadow-xl hover:shadow-blue-500/15 h-40 sm:h-44 flex flex-col justify-between p-3.5 bg-slate-900"
            >
              <img
                src="/images/products/موتور-کولر-موتوژن-3-4.jpg"
                alt="موتور کولر موتوژن تبریز"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/30 group-hover:via-slate-950/65 transition-all duration-300" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                  لیست قیمت رسمی
                </span>
                <ChevronLeft className="w-4 h-4 text-blue-400 group-hover:-translate-x-1 transition-transform" />
              </div>

              <div className="relative z-10 space-y-0.5">
                <h3 className="font-extrabold text-white text-xs sm:text-sm group-hover:text-blue-300 transition-colors">
                  موتور کولر موتوژن تبریز
                </h3>
                <p className="text-[10px] text-slate-300 line-clamp-1">
                  سیم‌پیچی مس با تخفیف همکار
                </p>
              </div>
            </Link>

            {/* Card 2: Pars Khazar */}
            <Link
              href="/price-lists#parskhazar"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-400 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1.5 shadow-md hover:shadow-xl hover:shadow-rose-500/15 h-40 sm:h-44 flex flex-col justify-between p-3.5 bg-slate-900"
            >
              <img
                src="/images/products/wal_172619-fans-7995865_1920.jpg"
                alt="پنکه پارس خزر"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/30 group-hover:via-slate-950/65 transition-all duration-300" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                  کاتالوگ شرکتی
                </span>
                <ChevronLeft className="w-4 h-4 text-rose-400 group-hover:-translate-x-1 transition-transform" />
              </div>

              <div className="relative z-10 space-y-0.5">
                <h3 className="font-extrabold text-white text-xs sm:text-sm group-hover:text-rose-300 transition-colors">
                  پنکه و لوازم پارس خزر
                </h3>
                <p className="text-[10px] text-slate-300 line-clamp-1">
                  گارانتی ۲۴ ماهه معتبر
                </p>
              </div>
            </Link>

            {/* Card 3: Alborz Electric Wire */}
            <Link
              href="/price-lists#alborz-wire"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1.5 shadow-md hover:shadow-xl hover:shadow-amber-500/15 h-40 sm:h-44 flex flex-col justify-between p-3.5 bg-slate-900"
            >
              <img
                src="/images/products/skdunning-wire-962753_1920.jpg"
                alt="سیم و کابل البرز الکتریک"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/30 group-hover:via-slate-950/65 transition-all duration-300" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full shadow-sm font-black">
                  قیمت روز مس
                </span>
                <ChevronLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
              </div>

              <div className="relative z-10 space-y-0.5">
                <h3 className="font-extrabold text-white text-xs sm:text-sm group-hover:text-amber-300 transition-colors">
                  سیم و کابل تمام مس البرز
                </h3>
                <p className="text-[10px] text-slate-300 line-clamp-1">
                  کلاف ۱۰۰ متری و برش متری
                </p>
              </div>
            </Link>

            {/* Card 4: Shahcheragh LED */}
            <Link
              href="/price-lists#shahcheragh"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-400 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1.5 shadow-md hover:shadow-xl hover:shadow-emerald-500/15 h-40 sm:h-44 flex flex-col justify-between p-3.5 bg-slate-900"
            >
              <img
                src="/images/products/inspiredimages-light-bulb-1138047_1920.jpg"
                alt="روشنایی شاهچراغ"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/30 group-hover:via-slate-950/65 transition-all duration-300" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                  پنل‌های هوشمند
                </span>
                <ChevronLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
              </div>

              <div className="relative z-10 space-y-0.5">
                <h3 className="font-extrabold text-white text-xs sm:text-sm group-hover:text-emerald-300 transition-colors">
                  روشنایی و LED شاهچراغ
                </h3>
                <p className="text-[10px] text-slate-300 line-clamp-1">
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
