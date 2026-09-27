import React from "react";
import Link from "next/link";
import {
  Wrench,
  Zap,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Lock,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "در حال به‌روزرسانی | مرکز تخصصی برق و کارگاه شیاسی",
  description: "سامانه فروشگاه آنلاین شیاسی در حال ارتقا و بهینه‌سازی است. کارگاه و بخش خدمات فنی باز است.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MaintenancePage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 relative overflow-hidden font-sans p-4 sm:p-8"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Badge */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Zap className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-black text-white block">
              فروشگاه و کارگاه شیاسی
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              مرکز تخصصی برق و تعمیرات نجف‌آباد
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>ارتقای زیرساخت</span>
        </div>
      </header>

      {/* Main Center Hero */}
      <div className="w-full max-w-2xl mx-auto my-auto py-10 text-center z-10 space-y-6">
        {/* Animated Central Emblem */}
        <div className="relative inline-flex items-center justify-center mb-2">
          <div className="absolute inset-0 rounded-3xl bg-amber-500/20 blur-xl animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center">
            <Wrench className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 animate-bounce" />
          </div>
        </div>

        {/* Headlines */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            در حال ارتقا و به‌روزرسانی سیستم‌ها
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            سامانه کاتالوگ آنلاین و ثبت سفارش موقتاً جهت بهینه‌سازی سرعت و افزودن قابلیت‌های جدید در دسترس نیست. از شکیبایی شما صمیمانه سپاسگزاریم.
          </p>
        </div>

        {/* Workshop Alert Banner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-right shadow-xl max-w-xl mx-auto space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-black">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>کارگاه فنی و خدمات حضوری شیاسی فعال است</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            برای تحویل دینام و الکتروموتور، سفارش تلفنی سیم و کابل یا تعمیرات فوری لوازم برقی، کارگاه فنی نجف‌آباد به صورت حضوری و تلفنی در خدمت شماست.
          </p>
        </div>

        {/* Action Contact Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto pt-2">
          <a
            href="tel:03142626116"
            className="flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm py-3 px-4 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>تماس با کارگاه: ۰۳۱-۴۲۶۲۶۱۱۶</span>
          </a>

          <a
            href="https://wa.me/989136260072"
            data-phone="09136260072"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm py-3 px-4 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>پیام در واتساپ: ۰۹۱۳۶۲۶۰۰۷۲</span>
          </a>
        </div>

        {/* Location & Working Hours Information */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[11px] text-slate-400 pt-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>نجف‌آباد، خیابان ۱۵ خرداد مرکزی، نبش بن‌بست نرگس</span>
          </div>
          <span className="hidden sm:inline text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>شیفت صبح: ۸:۳۰ تا ۱۳:۰۰ | عصر: ۱۶:۳۰ تا ۲۱:۰۰</span>
          </div>
        </div>
      </div>

      {/* Discreet Footer Link for Store Owner & Admin Login */}
      <footer className="w-full max-w-4xl mx-auto flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-900 pt-4 z-10">
        <span>© تمامی حقوق متعلق به فروشگاه برق و کارگاه شیاسی است.</span>

        <Link
          href="/auth/login?callbackUrl=/"
          className="flex items-center gap-1 hover:text-slate-300 transition-colors text-[10px]"
          title="ورود پرسنل و مدیریت جهت بررسی زنده سایت"
        >
          <Lock className="w-3 h-3 text-slate-500" />
          <span>ورود مدیریت</span>
        </Link>
      </footer>
    </main>
  );
}
