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
  Fan,
  Flame,
  Sun,
  ShieldCheck,
} from "lucide-react";

export function HeroBanner() {
  const { brand } = useBrand();

  const showcaseCategories = [
    {
      id: "parskhazar",
      title: "پنکه و لوازم پارس خزر",
      subtitle: "ایستاده ریموت‌دار، رومیزی و بخاری",
      tag: "گارانتی ۲۴ ماهه",
      badge: "پارس خزر",
      link: "/price-lists#parskhazar",
      image: "/images/products/wal_172619-fans-7995865_1920.jpg",
      // Sunset Coral / Rose Glow
      hoverBorder: "hover:border-rose-500 dark:hover:border-rose-400",
      hoverShadow: "hover:shadow-rose-500/20 hover:shadow-2xl",
      glowBg: "group-hover:from-rose-500/10 group-hover:to-orange-500/10 dark:group-hover:from-rose-500/15 dark:group-hover:to-orange-500/15",
      badgeStyle: "bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800",
      accentText: "group-hover:text-rose-600 dark:group-hover:text-rose-400",
      iconBg: "bg-rose-500 text-white",
    },
    {
      id: "motogen",
      title: "موتور کولر موتوژن تبریز",
      subtitle: "سیم‌پیچی مس، پمپ و کلاچ کولر",
      tag: "تخفیف ویژه همکار",
      badge: "موتوژن تبریز",
      link: "/price-lists#motogen",
      image: "/images/products/موتور-کولر-موتوژن-3-4.jpg",
      // Electric Blue / Cyan Glow
      hoverBorder: "hover:border-blue-500 dark:hover:border-blue-400",
      hoverShadow: "hover:shadow-blue-500/20 hover:shadow-2xl",
      glowBg: "group-hover:from-blue-500/10 group-hover:to-cyan-500/10 dark:group-hover:from-blue-500/15 dark:group-hover:to-cyan-500/15",
      badgeStyle: "bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800",
      accentText: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
      iconBg: "bg-blue-500 text-white",
    },
    {
      id: "shahcheragh",
      title: "روشنایی و پنل شاهچراغ",
      subtitle: "پروژکتور خورشیدی و پنل‌های LED",
      tag: "فوق کم‌مصرف A+",
      badge: "روشنایی مدرن",
      link: "/price-lists#shahcheragh",
      image: "/images/products/inspiredimages-light-bulb-1138047_1920.jpg",
      // Emerald / Mint Glow
      hoverBorder: "hover:border-emerald-500 dark:hover:border-emerald-400",
      hoverShadow: "hover:shadow-emerald-500/20 hover:shadow-2xl",
      glowBg: "group-hover:from-emerald-500/10 group-hover:to-teal-500/10 dark:group-hover:from-emerald-500/15 dark:group-hover:to-teal-500/15",
      badgeStyle: "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800",
      accentText: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
      iconBg: "bg-emerald-500 text-white",
    },
    {
      id: "alborz-wire",
      title: "سیم و کابل مس البرز",
      subtitle: "کلاف ۱۰۰ متری و برش متری استاندارد",
      tag: "۱۰۰٪ مس استاندارد",
      badge: "سیم و کابل",
      link: "/price-lists#alborz-wire",
      image: "/images/products/skdunning-wire-962753_1920.jpg",
      // Copper Amber / Gold Glow
      hoverBorder: "hover:border-amber-500 dark:hover:border-amber-400",
      hoverShadow: "hover:shadow-amber-500/20 hover:shadow-2xl",
      glowBg: "group-hover:from-amber-500/10 group-hover:to-yellow-500/10 dark:group-hover:from-amber-500/15 dark:group-hover:to-yellow-500/15",
      badgeStyle: "bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800",
      accentText: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
      iconBg: "bg-amber-500 text-slate-950",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50/60 via-slate-50 to-slate-100/40 dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950 text-slate-900 dark:text-white py-10 sm:py-14 lg:py-16 border-b border-slate-200/80 dark:border-slate-800/40 transition-colors duration-300">
      
      {/* Ambient Atmospheric Glows */}
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

            {/* Action Buttons: Strict Hierarchy */}
            <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-3">
              <Link
                href="/products"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center gap-2 active:scale-95 hover-glow"
              >
                <span>مشاهده کاتالوگ محصولات</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <Link
                href="/repair-service"
                className="bg-white/90 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 shadow-sm active:scale-95"
              >
                <Wrench className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>پذیرش آنلاین تعمیرات</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Interactive Showcase Cards with Distinct Hover Glows */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5 sm:gap-4">
            {showcaseCategories.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                className={`group relative bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-3 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 ${item.hoverBorder} ${item.hoverShadow}`}
              >
                {/* Dynamic Ambient Hover Aura */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.glowBg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                {/* Top: Header Badges & Arrow */}
                <div className="relative z-10 flex items-center justify-between gap-1 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border shadow-sm ${item.badgeStyle}`}>
                    {item.badge}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                    <ChevronLeft className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Center: Image Frame with Depth */}
                <div className="relative aspect-[4/3] w-full rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/80 dark:from-slate-800/80 dark:to-slate-850/80 overflow-hidden flex items-center justify-center p-2 mb-2.5 border border-slate-100 dark:border-slate-800/60 shadow-inner">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain group-hover:scale-110 group-hover:-rotate-1 transition-transform duration-500 ease-out"
                  />
                  {/* Quick Feature Tag pill */}
                  <span className="absolute bottom-1.5 right-1.5 text-[9px] font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                    {item.tag}
                  </span>
                </div>

                {/* Bottom: Typography & Info */}
                <div className="relative z-10 space-y-0.5">
                  <h3 className={`font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm transition-colors line-clamp-1 ${item.accentText}`}>
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 font-medium">
                    {item.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
