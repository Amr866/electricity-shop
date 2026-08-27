import React from "react";
import Link from "next/link";
import {
  Zap,
  Truck,
  ShieldCheck,
  Award,
  ArrowLeft,
  PhoneCall,
  Sparkles,
  Layers,
  Cpu,
  SunMedium,
} from "lucide-react";

export function HeroBanner() {
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
              <span>بازار بزرگ برق و الکترونیک اصفهان (خیابان فردوسی)</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.3] tracking-tight">
              مرکز تخصصی تجهیزات <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-l from-amber-400 via-amber-300 to-yellow-200">
                برق ساختمانی، صنعتی و الکترونیک
              </span>
            </h1>

            {/* Sub-text */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl text-justify">
              تامین مستقیم انواع سیم و کابل استاندارد تمام مس، روشنایی‌های مدرن و کم‌مصرف، کلید و پریز، اتوماسیون و تابلو برق صنعتی، به همراه بردهای میکروکنترلری و قطعات رباتیک با بهترین قیمت بازار اصفهان.
            </p>

            {/* Isfahan Courier Highlights */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>تحویل ۲ الی ۳ ساعته در کلیه نقاط اصفهان</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>ضمانت تاییدیه نظام مهندسی و اداره برق</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <Link
                href="/products"
                className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center gap-2"
              >
                <span>مشاهده کاتالوگ و خرید</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <a
                href="tel:03132204567"
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm px-5 py-3.5 rounded-xl border border-slate-700 transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>استعلام تلفنی: ۰۳۱-۳۲۲۰۴۵۶۷</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Category Feature Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            
            <Link
              href="/products?category=wiring-building"
              className="group p-4 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all hover:-translate-y-1 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                سیم و کابل ساختمانی
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                سیم افشان، کابل مفتول تمام مس، کلید و پریز دلند
              </p>
            </Link>

            <Link
              href="/products?category=lighting-fixtures"
              className="group p-4 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all hover:-translate-y-1 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <SunMedium className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                روشنایی و پنل LED
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                پنل ۶۰×۶۰، پروژکتور SMD، ریسه نئون فلکس
              </p>
            </Link>

            <Link
              href="/products?category=industrial-automation"
              className="group p-4 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all hover:-translate-y-1 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                برق صنعتی و تابلو
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                فیوز مینیاتوری، کنتاکتور هیوندای، اینورتر دلتا
              </p>
            </Link>

            <Link
              href="/products?category=maker-diy-electronics"
              className="group p-4 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all hover:-translate-y-1 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                بردهای DIY و رباتیک
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                آردوینو، ESP32، ماژول رله، مولتی‌متر و هویه
              </p>
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
}
