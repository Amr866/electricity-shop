"use client";

import React from "react";
import { Headphones, Phone, MessageCircle, Clock } from "lucide-react";

export function ConsultationBanner() {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-lg space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Title & Description */}
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              مشاوره تخصصی و استعلام قیمت
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            کارشناسان و مهندسین ما در انتخاب تجهیزات برقی، پروژکتورهای خورشیدی، بردهای آردوینو و تابلوهای صنعتی همراه شما هستند.
          </p>
        </div>

        {/* Action Buttons & Phone lines */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* WhatsApp Button */}
          <a
            href="https://wa.me/989162665884?text=سلام،%20برای%20مشاوره%20تخصصی%20و%20استعلام%20قیمت%20پیام%20می‌دهم."
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-slate-950" />
            <span>گفتگو در واتساپ</span>
          </a>

          {/* Direct Phone Lines */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <a
              href="tel:03142624567"
              aria-label="تلفن ثابت فروشگاه: ۰۳۱-۴۲۶۲۴۵۶۷"
              className="bg-slate-800/80 hover:bg-slate-800 text-amber-400 font-bold px-3.5 py-3 rounded-xl border border-slate-700 flex items-center gap-1.5 hover:border-amber-400/80 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>۰۳۱-۴۲۶۲۴۵۶۷</span>
            </a>
            <a
              href="tel:09162665884"
              aria-label="تلفن همراه کارگاه و تعمیرات: ۰۹۱۶-۲۶۶-۵۸۸۴"
              className="bg-slate-800/80 hover:bg-slate-800 text-emerald-400 font-bold px-3.5 py-3 rounded-xl border border-slate-700 flex items-center gap-1.5 hover:border-emerald-400/80 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>۰۹۱۶-۲۶۶-۵۸۸۴</span>
            </a>
          </div>
        </div>

      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>ساعات پاسخگویی مهندسین فنی: شنبه تا پنج‌شنبه از ساعت ۸:۳۰ الی ۲۱:۰۰</span>
        </span>
        <span className="text-amber-400 font-bold hidden sm:inline-block">
          پشتیبانی سریع پروژه‌های ساختمانی و صنعتی
        </span>
      </div>
    </div>
  );
}
