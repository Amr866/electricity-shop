"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  UploadCloud,
  Percent,
  CheckCircle2,
  FileSpreadsheet,
  Sparkles,
} from "lucide-react";

export function BomCallToActionBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-50 dark:from-slate-900 dark:via-slate-850 dark:to-amber-950 text-slate-900 dark:text-white p-5 sm:p-8 border border-amber-300/60 dark:border-amber-500/20 shadow-sm dark:shadow-xl transition-colors duration-200">
      {/* Ambient background decoration glow */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Text & Value Props */}
        <div className="space-y-3 max-w-2xl text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-400 text-xs font-bold">
            <Building2 className="w-3.5 h-3.5" />
            <span>ویژه پیمانکاران، برق‌کاران و پروژه‌های ساختمانی</span>
          </div>

          <h3 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-snug">
            خرید عمده و بارگذاری لیست قطعات (BOM)
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            لیست تجهیزات، سیم، کابل، کلید پریز یا قطعات مورد نیاز پروژه خود را به صورت اکسل، PDF یا عکس دست‌نویس ارسال کنید تا با تخفیف ویژه همکار و فاکتور رسمی در سریع‌ترین زمان پیش‌فاکتور برایتان صادر شود.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
            <span className="flex items-center gap-1 bg-amber-500/10 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/20 text-amber-900 dark:text-amber-300 font-bold">
              <Percent className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>تخفیف پلکانی بر اساس متراژ و تعداد</span>
            </span>
            <span className="flex items-center gap-1 bg-emerald-500/10 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>امکان صدور فاکتور رسمی با کد اقتصادی</span>
            </span>
          </div>
        </div>

        {/* Right Side: Floating Document Graphic & Action CTA */}
        <div className="shrink-0 w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-center gap-3">
          {/* Floating Excel/PDF Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs backdrop-blur-xs animate-bounce" style={{ animationDuration: '3s' }}>
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">پذیرش فرمت Excel • PDF • عکس</span>
            <Sparkles className="w-3 h-3 text-amber-500" />
          </div>

          <Link
            href="/bom-upload"
            className="relative overflow-hidden w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 group transition-all transform active:scale-95 hover-glow"
          >
            {/* Subtle Shimmer Sweep Light */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />
            <UploadCloud className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
            <span>بارگذاری سریع لیست قطعات</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
