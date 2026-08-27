"use client";

import React from "react";
import Link from "next/link";
import { FileSpreadsheet, ArrowLeft, Building2, UploadCloud, Percent, CheckCircle2 } from "lucide-react";

export function BomCallToActionBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-amber-950 text-white p-6 sm:p-8 border border-amber-500/20 shadow-xl">
      {/* Ambient background decoration glow */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Text & Value Props */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Building2 className="w-3.5 h-3.5" />
            <span>ویژه پیمانکاران، برق‌کاران و پروژه‌های ساختمانی</span>
          </div>

          <h3 className="text-lg sm:text-2xl font-black tracking-tight text-white">
            خرید عمده و بارگذاری لیست قطعات (BOM)
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            لیست تجهیزات، سیم، کابل، کلید پریز یا قطعات مورد نیاز پروژه خود را به صورت اکسل، PDF یا عکس دست‌نویس ارسال کنید تا با تخفیف ویژه همکار و فاکتور رسمی در سریع‌ترین زمان پیش‌فاکتور برایتان صادر شود.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-amber-400" />
              <span>تخفیف پلکانی بر اساس متراژ و تعداد</span>
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>امکان صدور فاکتور رسمی با کد اقتصادی</span>
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 w-full sm:w-auto">
          <Link
            href="/bom-upload"
            className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 group transition-all transform active:scale-95"
          >
            <UploadCloud className="w-4 h-4 text-slate-950" />
            <span>بارگذاری سریع لیست قطعات</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
