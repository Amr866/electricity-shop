"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Wrench,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";

// 1. Static Showcase Data (Defined outside render function to eliminate GC memory allocation)
const SHOWCASE_CATEGORIES = [
  {
    id: "parskhazar",
    title: "پنکه و لوازم پارس خزر",
    subtitle: "ایستاده ریموت‌دار، رومیزی و بخاری",
    tag: "گارانتی ۲۴ ماهه",
    badge: "پارس خزر",
    link: "/price-lists#parskhazar",
    image: "/images/products/wal_172619-fans-7995865_1920.jpg",
    hoverBorder: "hover:border-amber-500 dark:hover:border-amber-400",
    hoverShadow: "hover:shadow-amber-500/20 hover:shadow-2xl",
    glowBg: "group-hover:from-amber-500/10 group-hover:to-orange-500/10 dark:group-hover:from-amber-500/15 dark:group-hover:to-orange-500/15",
    badgeStyle: "bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-800",
    accentText: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
    iconBg: "bg-amber-500 text-slate-950",
  },
  {
    id: "motogen",
    title: "موتور کولر موتوژن تبریز",
    subtitle: "سیم‌پیچی مس، پمپ و کلاچ کولر",
    tag: "تخفیف ویژه همکار",
    badge: "موتوژن تبریز",
    link: "/price-lists#motogen",
    image: "/images/products/موتور-کولر-موتوژن-3-4.jpg",
    hoverBorder: "hover:border-sky-500 dark:hover:border-sky-400",
    hoverShadow: "hover:shadow-sky-500/20 hover:shadow-2xl",
    glowBg: "group-hover:from-sky-500/10 group-hover:to-cyan-500/10 dark:group-hover:from-sky-500/15 dark:group-hover:to-cyan-500/15",
    badgeStyle: "bg-sky-50 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border-sky-200/80 dark:border-sky-800",
    accentText: "group-hover:text-sky-600 dark:group-hover:text-sky-400",
    iconBg: "bg-sky-500 text-white",
  },
  {
    id: "shahcheragh",
    title: "روشنایی و پنل شاهچراغ",
    subtitle: "پروژکتور خورشیدی و پنل‌های LED",
    tag: "فوق کم‌مصرف A+",
    badge: "روشنایی مدرن",
    link: "/price-lists#shahcheragh",
    image: "/images/products/6653167-flashlight-6786569_1920.jpg",
    hoverBorder: "hover:border-amber-400 dark:hover:border-amber-300",
    hoverShadow: "hover:shadow-amber-400/20 hover:shadow-2xl",
    glowBg: "group-hover:from-amber-400/10 group-hover:to-yellow-500/10 dark:group-hover:from-amber-400/15 dark:group-hover:to-yellow-500/15",
    badgeStyle: "bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-800",
    accentText: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
    iconBg: "bg-amber-400 text-slate-950",
  },
  {
    id: "alborz-wire",
    title: "سیم و کابل مس البرز",
    subtitle: "کلاف ۱۰۰ متری و برش متری استاندارد",
    tag: "۱۰۰٪ مس استاندارد",
    badge: "سیم و کابل تمام مس",
    link: "/price-lists#alborz-wire",
    image: "/images/products/skdunning-wire-962753_1920.jpg",
    hoverBorder: "hover:border-orange-500 dark:hover:border-orange-400",
    hoverShadow: "hover:shadow-orange-500/20 hover:shadow-2xl",
    glowBg: "group-hover:from-orange-500/10 group-hover:to-amber-500/10 dark:group-hover:from-orange-500/15 dark:group-hover:to-amber-500/15",
    badgeStyle: "bg-orange-50 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 border-orange-200/80 dark:border-orange-800",
    accentText: "group-hover:text-orange-600 dark:group-hover:text-orange-400",
    iconBg: "bg-orange-600 text-white",
  },
];

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50/60 via-slate-50 to-slate-100/40 dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950 text-slate-900 dark:text-white py-6 sm:py-10 lg:py-14 border-b border-slate-200/80 dark:border-slate-800/40 transition-colors duration-300">
      
      {/* Ambient Atmospheric Glows */}
      <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-amber-400/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-slate-400/10 dark:bg-slate-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
          
          {/* Right Column: Hero Content & Clear CTA Hierarchy */}
          <div className="lg:col-span-6 space-y-3.5 sm:space-y-5 text-right">
            
            {/* Location & Authenticity Badge */}
            <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>فروشگاه و کارگاه تخصصی شیاسی (نجف‌آباد)</span>
            </div>

            {/* Main Headline: Perfectly Balanced Symmetrical Lines */}
            <h1 className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-black leading-snug sm:leading-[1.35] tracking-tight text-slate-900 dark:text-white">
              مرکز خرید و خدمات تخصصی <br className="hidden sm:inline" />
              <span className="text-amber-600 dark:text-amber-400">
                لوازم برقی، موتور کولر و پنکه
              </span>
            </h1>

            {/* Sub-text: High Contrast & Concise */}
            <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl text-justify font-medium">
              تأمین مستقیم انواع پنکه ریموت‌دار، موتور کولر آبی، بخاری برقی، سیم و کابل استاندارد تمام مس، به همراه کارگاه پذیرش و عیب‌یابی تخصصی در نجف‌آباد.
            </p>

            {/* Courier & Workshop Trust Line with Live Radar Dot */}
            <div className="flex items-center gap-2 text-[10.5px] sm:text-xs text-slate-600 dark:text-slate-400 font-semibold py-0.5">
              <div className="flex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-2 bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="truncate">ارسال فوری نجف‌آباد و اصفهان</span>
              </div>
              <div className="flex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-1.5 bg-amber-500/10 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-xl border border-amber-500/20">
                <Wrench className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="truncate">پذیرش و تست در کارگاه</span>
              </div>
            </div>

            {/* Action Buttons with Shimmer Light Sweep & Enhanced Contrast */}
            <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3 pt-1.5 sm:pt-2.5">
              <Link
                href="/products"
                className="relative overflow-hidden bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-4 sm:px-6 py-3 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-1.5 active:scale-95 text-center group"
              >
                {/* Subtle Shimmer Sweep Light */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />
                <span>کاتالوگ محصولات</span>
                <ArrowLeft className="w-3.5 h-3.5 shrink-0 group-hover:-translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/repair-service"
                className="bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm px-3.5 sm:px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 text-center"
              >
                <Wrench className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>پذیرش تعمیرات</span>
              </Link>
            </div>

            {/* Quick Trust Stat Micro-Metric */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">+۵,۰۰۰ سفارش موفق، عیب‌یابی و توزیع در استان اصفهان</span>
            </div>
          </div>

          {/* Left Column: 4 Interactive Showcase Cards with Distinct Section Header */}
          <div className="lg:col-span-6 flex flex-col gap-2.5 mt-2 lg:mt-0">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 rounded-full bg-amber-500 shrink-0" />
                <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  دسته‌بندی‌های برگزیده
                </span>
              </div>
              <Link
                href="/categories"
                className="text-[11px] sm:text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                <span>مشاهده همه دسته‌ها</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
            {SHOWCASE_CATEGORIES.map((item) => (
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

                {/* Center: Image Frame with Depth & Soft Eager Loading */}
                <div className="relative aspect-[4/3] w-full rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200/80 dark:from-slate-800/80 dark:to-slate-850/80 overflow-hidden p-1 mb-2.5 border border-slate-100 dark:border-slate-800/60 shadow-inner">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 ease-out"
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
      </div>
    </section>
  );
}
