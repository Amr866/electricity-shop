"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  SunMedium,
  Sparkles,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Truck,
  CreditCard,
  Headphones,
  Zap,
  Flame,
} from "lucide-react";

export function EdisonHeroBanner() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: "انرژی و روشنایی خورشیدی",
      title: "پروژکتور و سیستم‌های خورشیدی",
      subtitle:
        "روشنایی بدون نیاز به برق شهری! همراه با پنل سولار باکیفیت و باتری داخلی برای باغ، ویلا و محوطه.",
      image:
        "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
      ctaText: "مشاهده انواع پروژکتور",
      ctaLink: "/products?category=lighting-fixtures",
      color: "from-amber-950 via-slate-900 to-slate-950",
    },
    {
      id: 2,
      badge: "سیم و کابل تمام مس استاندارد",
      title: "سیم‌های افشان و کابل ساختمانی",
      subtitle:
        "مستقیم از خط تولید کارخانجات معتبر با خلوص مس ۹۹.۹٪ و تاییدیه رسمی نظام مهندسی ساختمان.",
      image:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      ctaText: "مشاهده سیم و کابل",
      ctaLink: "/products?category=wiring-building",
      color: "from-slate-950 via-slate-900 to-amber-950",
    },
    {
      id: 3,
      badge: "بردهای هوشمند و رباتیک",
      title: "آردوینو، ESP32 و قطعات DIY",
      subtitle:
        "مرکز تخصصی ماژول‌های الکترونیکی، سنسورهای صنعتی، درایورها و بردهای توسعه با پشتیبانی فنی کامل.",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      ctaText: "ورود به بخش الکترونیک",
      ctaLink: "/products?category=maker-diy-electronics",
      color: "from-blue-950 via-slate-900 to-slate-950",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const current = slides[activeSlide];

  return (
    <div className="space-y-6 pt-4">
      {/* 3-Piece Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Main Left/Center Slider (8 cols) */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-amber-950 to-slate-950 border border-slate-800 shadow-xl min-h-[360px] sm:min-h-[420px] flex flex-col justify-between p-6 sm:p-10 text-white">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Badge & Slide Indicators */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <SunMedium className="w-4 h-4 text-amber-400" />
              <span>{current.badge}</span>
            </span>

            {/* Slider Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)
                }
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
                aria-label="اسلاید قبلی"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
                aria-label="اسلاید بعدی"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Content & Image */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center my-auto py-4">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                {current.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-justify">
                {current.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link
                  href={current.ctaLink}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2 group active:scale-95"
                >
                  <span>{current.ctaText}</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/products"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-3 rounded-xl backdrop-blur-md transition-colors"
                >
                  همه دسته‌ها
                </Link>
              </div>
            </div>

            <div className="relative aspect-square max-w-[240px] sm:max-w-none mx-auto flex items-center justify-center">
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 rounded-2xl"
              />
            </div>
          </div>

          {/* Bottom Dots Indicator */}
          <div className="relative z-10 flex items-center justify-center gap-2 pt-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  activeSlide === i ? "w-8 bg-amber-500" : "w-2 bg-white/30"
                }`}
                aria-label={`اسلاید ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 2 Side Promo Banner Cards (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-5">
          
          {/* Top Promo Card: Filament Edison Bulb */}
          <Link
            href="/products?q=فیلامنت"
            className="group flex-1 rounded-3xl p-6 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-white border border-amber-500/30 shadow-lg relative overflow-hidden flex flex-col justify-between transition-transform hover:-translate-y-1"
          >
            <div className="relative z-10 space-y-2">
              <span className="text-[11px] font-bold text-amber-200 block">
                پیشنهاد ویژه امروز
              </span>
              <h3 className="text-lg font-black leading-snug">
                لامپ ادیسونی فیلامنتی با ۲۳٪ تخفیف
              </h3>
            </div>

            <div className="relative z-10 pt-4 flex items-center justify-between text-xs font-extrabold text-amber-200 group-hover:text-white">
              <span>خرید کن</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>

            {/* Ambient Background Bulb Graphic */}
            <div className="absolute -bottom-6 -left-6 opacity-20 group-hover:opacity-30 transition-opacity">
              <Zap className="w-36 h-36 fill-white" />
            </div>
          </Link>

          {/* Bottom Promo Card: Chandeliers & Ceiling Lights */}
          <Link
            href="/products?category=lighting-fixtures"
            className="group flex-1 rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white border border-slate-800 shadow-lg relative overflow-hidden flex flex-col justify-between transition-transform hover:-translate-y-1"
          >
            <div className="relative z-10 space-y-2">
              <span className="text-[11px] font-bold text-amber-400 block">
                چراغ سقفی تزیینی و پنل
              </span>
              <h3 className="text-lg font-black leading-snug">
                لوستر و چراغ سقفی تا ۲۹٪ تخفیف
              </h3>
            </div>

            <div className="relative z-10 pt-4 flex items-center justify-between text-xs font-extrabold text-amber-400 group-hover:text-white">
              <span>مشاهده دسته‌بندی</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>

            {/* Ambient Background Flame Graphic */}
            <div className="absolute -bottom-6 -left-6 opacity-20 group-hover:opacity-30 transition-opacity text-amber-500">
              <Flame className="w-36 h-36 fill-amber-500" />
            </div>
          </Link>

        </div>

      </div>

      {/* 5 Trust Badges Row (Edisonkala Screenshot 4) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-slate-800">
        
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-xs text-slate-900">تضمین اصالت کالا</h4>
            <span className="text-[11px] text-slate-400 block">۱۰۰٪ کالای اصل</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-xs text-slate-900">۷ روز مهلت بازگشت</h4>
            <span className="text-[11px] text-slate-400 block">تضمین رضایت خرید</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <Truck className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-xs text-slate-900">ارسال سریع</h4>
            <span className="text-[11px] text-slate-400 block">پیک اصفهان و سراسر ایران</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-xs text-slate-900">پرداخت امن</h4>
            <span className="text-[11px] text-slate-400 block">درگاه شاپرک و در محل</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <Headphones className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-xs text-slate-900">مشاوره فنی رایگان</h4>
            <span className="text-[11px] text-slate-400 block">پشتیبانی تلفنی و واتساپ</span>
          </div>
        </div>

      </div>
    </div>
  );
}
