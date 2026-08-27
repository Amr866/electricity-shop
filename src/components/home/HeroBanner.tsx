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
} from "lucide-react";

export function HeroBanner() {
  const { brand } = useBrand();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-12 lg:py-16">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Hero Content & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-right">
            
            {/* Location & Authenticity Tag */}
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>فروشگاه و کارگاه فنی شیاسی در نجف‌آباد اصفهان</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.3] tracking-tight">
              مرکز خرید و تعمیرات تخصصی <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-l from-amber-400 via-amber-300 to-yellow-200">
                لوازم برقی، پنکه، کولر، بخاری و آنتن
              </span>
            </h1>

            {/* Sub-text */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl text-justify">
              خرید مستقیم انواع پنکه ریموت‌دار، دینام و پمپ کولر آبی، بخاری برقی، آنتن‌های دیجیتال، سیم و کابل تمام مس، به همراه کارگاه تعمیرات تخصصی و سیم‌پیچی موتور در نجف‌آباد با ضمانت کارکرد.
            </p>

            {/* Courier & Workshop Highlights */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>تحویل فوری و پیک در نجف‌آباد، ویلاشهر، گلدشت و اصفهان</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>پذیرش و عیب‌یابی حضوری در کارگاه نجف‌آباد</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <Link
                href="/products"
                className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center gap-2"
              >
                <span>مشاهده کاتالوگ محصولات</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <Link
                href="/repair-service"
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm px-5 py-3.5 rounded-xl border border-slate-700 transition-all flex items-center gap-2"
              >
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>پذیرش آنلاین تعمیرات</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Appliance & Equipment Feature Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            
            <Link
              href="/products?category=home-appliances-cooling-heating"
              className="group p-4 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all hover:-translate-y-1 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Fan className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                پنکه و تهویه خانگی
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                خرید و تعمیر پنکه پارس خزر، سانی، سقفی و رومیزی
              </p>
            </Link>

            <Link
              href="/products?category=home-appliances-cooling-heating"
              className="group p-4 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all hover:-translate-y-1 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                موتور و پمپ کولر آبی
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                موتوژن تبریز، الکتروژن، کلید لمسی و سیم‌پیچی
              </p>
            </Link>

            <Link
              href="/products?category=home-appliances-cooling-heating"
              className="group p-4 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all hover:-translate-y-1 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                بخاری برقی و هیتر
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                بخاری کوارتز اخوان، فن‌دار، تعویض المنت و ترموستات
              </p>
            </Link>

            <Link
              href="/products?category=home-appliances-cooling-heating"
              className="group p-4 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all hover:-translate-y-1 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Tv className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                آنتن تلویزیون و بوستر
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                آنتن هوایی گردان هانی 4K، کابل کواکسیال و تعمیر برد
              </p>
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
}
