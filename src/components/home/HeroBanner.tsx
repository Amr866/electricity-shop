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
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 text-white py-12 lg:py-16 transition-colors duration-300">
      {/* Top & Bottom Smooth Gradient Fade Overlays */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent pointer-events-none z-0" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none z-0" />

      {/* Radial Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[32rem] h-[32rem] bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[32rem] h-[32rem] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

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

          {/* Right Column: 4 Appliance & Equipment Feature Cards with Images */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            
            <Link
              href="/products?category=home-appliances-cooling-heating"
              className="group relative overflow-hidden rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all hover:-translate-y-1 shadow-lg h-44 flex flex-col justify-end p-3.5"
            >
              <img
                src="https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=400&q=80"
                alt="پنکه و تهویه"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
              <div className="relative z-10">
                <div className="w-8 h-8 rounded-lg bg-amber-500/90 text-slate-950 flex items-center justify-center mb-1.5 shadow-md">
                  <Fan className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-xs sm:text-sm group-hover:text-amber-400 transition-colors">
                  پنکه و تهویه خانگی
                </h3>
                <p className="text-[10px] text-slate-300 mt-0.5 leading-tight">
                  پارس خزر، سانی و کارگاه تعمیرات
                </p>
              </div>
            </Link>

            <Link
              href="/products?category=home-appliances-cooling-heating"
              className="group relative overflow-hidden rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all hover:-translate-y-1 shadow-lg h-44 flex flex-col justify-end p-3.5"
            >
              <img
                src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80"
                alt="موتور و پمپ کولر"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
              <div className="relative z-10">
                <div className="w-8 h-8 rounded-lg bg-blue-500/90 text-white flex items-center justify-center mb-1.5 shadow-md">
                  <Sun className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-xs sm:text-sm group-hover:text-amber-400 transition-colors">
                  موتور و پمپ کولر آبی
                </h3>
                <p className="text-[10px] text-slate-300 mt-0.5 leading-tight">
                  موتوژن تبریز و سیم‌پیچی مس
                </p>
              </div>
            </Link>

            <Link
              href="/products?category=home-appliances-cooling-heating"
              className="group relative overflow-hidden rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all hover:-translate-y-1 shadow-lg h-44 flex flex-col justify-end p-3.5"
            >
              <img
                src="https://images.unsplash.com/photo-1545259742-b43a38f38692?auto=format&fit=crop&w=400&q=80"
                alt="بخاری برقی"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
              <div className="relative z-10">
                <div className="w-8 h-8 rounded-lg bg-rose-500/90 text-white flex items-center justify-center mb-1.5 shadow-md">
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-xs sm:text-sm group-hover:text-amber-400 transition-colors">
                  بخاری برقی و هیتر
                </h3>
                <p className="text-[10px] text-slate-300 mt-0.5 leading-tight">
                  اخوان، المنت کوارتز و فن‌دار
                </p>
              </div>
            </Link>

            <Link
              href="/products?category=home-appliances-cooling-heating"
              className="group relative overflow-hidden rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all hover:-translate-y-1 shadow-lg h-44 flex flex-col justify-end p-3.5"
            >
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80"
                alt="آنتن تلویزیون"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
              <div className="relative z-10">
                <div className="w-8 h-8 rounded-lg bg-purple-500/90 text-white flex items-center justify-center mb-1.5 shadow-md">
                  <Tv className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-xs sm:text-sm group-hover:text-amber-400 transition-colors">
                  آنتن تلویزیون و بوستر
                </h3>
                <p className="text-[10px] text-slate-300 mt-0.5 leading-tight">
                  آنتن هوایی گردان هانی 4K
                </p>
              </div>
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
}
