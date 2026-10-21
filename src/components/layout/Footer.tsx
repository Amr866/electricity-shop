"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBrand } from "@/context/BrandContext";
import {
  Zap,
  ShieldCheck,
  ChevronLeft,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Send,
} from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const { brand } = useBrand();
  const [enamadFailed, setEnamadFailed] = React.useState(false);

  // Suppress public footer in admin panel
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const displayPhone = brand.phone || "۰۳۱-۴۲۶۲۶۱۱۶";
  const displayMobile = brand.mobile || "۰۹۱۳-۶۲۶-۰۰۷۲";
  const rawMobile = brand.rawMobile || "09136260072";
  const cleanMobile = brand.rawMobile ? brand.rawMobile.replace(/^0/, "") : "9136260072";
  const whatsappUrl = `https://wa.me/98${cleanMobile}`;
  const eitaaUrl = "https://eitaa.com/shiasi_electric";
  const telegramUrl = "https://t.me/shiasi_electric";

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-24 md:pb-8 border-t border-slate-850 relative overflow-hidden transition-colors duration-200">
      
      {/* Subtle Amber Topline Shimmer */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Directory & Trust Grid (5 Balanced Columns across 12-Span Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
          
          {/* Col 1 (lg:col-span-4, sm:col-span-2): Brand Identity & Horizontal Messengers */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            
            {/* Brand Logo & Name with Cute Electric Breathing Halo */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="relative group/zap">
                  {/* Soft animated ambient pulse halo */}
                  <div className="absolute -inset-1 bg-amber-500/25 rounded-2xl blur-xs animate-pulse pointer-events-none" />
                  <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-slate-950 font-black shrink-0 shadow-sm shadow-amber-500/30 transition-transform duration-300 group-hover/zap:rotate-6 group-hover/zap:scale-105">
                    <Zap className="w-5 h-5 fill-slate-950 text-slate-950" />
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-lg text-white tracking-tight">
                    {brand.nameFa || "فروشگاه شیاسی"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-amber-400/10 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/25 shadow-xs">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-spin-slow" />
                    <span>تأسیس ۱۳۸۵</span>
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                مرکز تخصصی پخش سیم و کابل استاندارد مس، موتور و پمپ کولر آبی، پنکه، روشنایی صنعتی و کارگاه عیب‌یابی و تعمیرات در نجف‌آباد.
              </p>
            </div>

            {/* Horizontal Messengers Bar - Clean & Symmetrical */}
            <div className="pt-1 space-y-2">
              <span className="block text-[11px] text-slate-400 font-medium">
                ارتباط و کانال‌های رسمی فروشگاه:
              </span>
              <div className="grid grid-cols-3 gap-2">
                
                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ارسال پیام به واتساپ رسمی فروشگاه شیاسی"
                  className="bg-emerald-950/60 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-800/80 hover:border-emerald-500 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>واتساپ</span>
                </a>

                {/* Eitaa */}
                <a
                  href={eitaaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="کانال رسمی فروشگاه شیاسی در پیام‌رسان ایتا"
                  className="bg-orange-950/60 hover:bg-orange-600 text-orange-400 hover:text-white border border-orange-800/80 hover:border-orange-500 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/25 active:scale-95 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-orange-400 group-hover:bg-white transition-colors shrink-0" />
                  <span>ایتا</span>
                </a>

                {/* Telegram */}
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="کانال تلگرام رسمی فروشگاه شیاسی"
                  className="bg-sky-950/60 hover:bg-sky-600 text-sky-400 hover:text-white border border-sky-800/80 hover:border-sky-500 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/25 active:scale-95 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 shrink-0" />
                  <span>تلگرام</span>
                </a>

              </div>
            </div>

          </div>

          {/* Col 2 (lg:col-span-2): Product Directory with Magnetic Smooth Hover */}
          <nav aria-label="دسته‌بندی‌های کالا" className="lg:col-span-2 space-y-3">
            <p className="text-white font-black text-sm border-r-2 border-amber-400 pr-2">
              دسته‌بندی کالاها
            </p>
            <ul className="space-y-1.5 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/products?category=home-appliances-cooling-heating" prefetch={false} className="group flex items-center justify-between py-1 hover:text-white transition-colors">
                  <span className="group-hover:-translate-x-1 transition-transform duration-200">پنکه و تهویه</span>
                  <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-amber-400" />
                </Link>
              </li>
              <li>
                <Link href="/products?category=home-appliances-cooling-heating" prefetch={false} className="group flex items-center justify-between py-1 hover:text-white transition-colors">
                  <span className="group-hover:-translate-x-1 transition-transform duration-200">موتور و پمپ کولر</span>
                  <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-amber-400" />
                </Link>
              </li>
              <li>
                <Link href="/products?category=wiring-building" prefetch={false} className="group flex items-center justify-between py-1 hover:text-white transition-colors">
                  <span className="group-hover:-translate-x-1 transition-transform duration-200">سیم و کابل مس</span>
                  <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-amber-400" />
                </Link>
              </li>
              <li>
                <Link href="/products?category=lighting-fixtures" prefetch={false} className="group flex items-center justify-between py-1 hover:text-white transition-colors">
                  <span className="group-hover:-translate-x-1 transition-transform duration-200">پروژکتور و روشنایی</span>
                  <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-amber-400" />
                </Link>
              </li>
              <li>
                <Link href="/products?category=tools-equipment" prefetch={false} className="group flex items-center justify-between py-1 hover:text-white transition-colors">
                  <span className="group-hover:-translate-x-1 transition-transform duration-200">بخاری برقی و هیتر</span>
                  <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-amber-400" />
                </Link>
              </li>
              <li>
                <Link href="/products?category=maker-diy-electronics" prefetch={false} className="group flex items-center justify-between py-1 hover:text-white transition-colors">
                  <span className="group-hover:-translate-x-1 transition-transform duration-200">بردهای الکترونیک</span>
                  <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-amber-400" />
                </Link>
              </li>
            </ul>
          </nav>

          {/* Col 3 (lg:col-span-2): Workshop Services with Magnetic Smooth Hover */}
          <nav aria-label="خدمات کارگاه" className="lg:col-span-2 space-y-3">
            <p className="text-white font-black text-sm border-r-2 border-amber-400 pr-2">
              خدمات کارگاه
            </p>
            <ul className="space-y-1.5 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/repair-service" prefetch={false} className="group flex items-center justify-between py-1 hover:text-white transition-colors">
                  <span className="group-hover:-translate-x-1 transition-transform duration-200">پیگیری تعمیرات</span>
                  <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-amber-400" />
                </Link>
              </li>
              <li>
                <Link href="/bom-upload" prefetch={false} className="group flex items-center justify-between py-1 hover:text-white transition-colors">
                  <span className="group-hover:-translate-x-1 transition-transform duration-200">استعلام BOM</span>
                  <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-amber-400" />
                </Link>
              </li>
              <li>
                <Link href="/order-tracking" prefetch={false} className="group flex items-center justify-between py-1 hover:text-white transition-colors">
                  <span className="group-hover:-translate-x-1 transition-transform duration-200">پیگیری سفارشات</span>
                  <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-amber-400" />
                </Link>
              </li>
              <li>
                <Link href="/blog" prefetch={false} className="group flex items-center justify-between py-1 hover:text-white transition-colors">
                  <span className="group-hover:-translate-x-1 transition-transform duration-200">دانستنی‌های فنی</span>
                  <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-amber-400" />
                </Link>
              </li>
              <li>
                <Link href="/#calculator" prefetch={false} className="group flex items-center justify-between py-1 hover:text-white transition-colors">
                  <span className="group-hover:-translate-x-1 transition-transform duration-200">محاسبه‌گر کابل</span>
                  <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-amber-400" />
                </Link>
              </li>
            </ul>
          </nav>

          {/* Col 4 (lg:col-span-2): Customer Help with Magnetic Smooth Hover */}
          <nav aria-label="راهنمای مشتریان" className="lg:col-span-2 space-y-3">
            <p className="text-white font-black text-sm border-r-2 border-amber-400 pr-2">
              راهنمای مشتریان
            </p>
            <ul className="space-y-1.5 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/about" prefetch={false} className="group flex items-center justify-between py-1 hover:text-white transition-colors">
                  <span className="group-hover:-translate-x-1 transition-transform duration-200">درباره فروشگاه</span>
                  <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-amber-400" />
                </Link>
              </li>
              <li>
                <Link href="/contact" prefetch={false} className="group flex items-center justify-between py-1 hover:text-white transition-colors">
                  <span className="group-hover:-translate-x-1 transition-transform duration-200">تماس و آدرس</span>
                  <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-amber-400" />
                </Link>
              </li>
              <li>
                <Link href="/faq" prefetch={false} className="group flex items-center justify-between py-1 hover:text-white transition-colors">
                  <span className="group-hover:-translate-x-1 transition-transform duration-200">سوالات متداول</span>
                  <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-amber-400" />
                </Link>
              </li>
              <li>
                <Link href="/terms" prefetch={false} className="group flex items-center justify-between py-1 hover:text-white transition-colors">
                  <span className="group-hover:-translate-x-1 transition-transform duration-200">قوانین و ضمانت</span>
                  <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-amber-400" />
                </Link>
              </li>
              <li>
                <Link href="/privacy" prefetch={false} className="group flex items-center justify-between py-1 hover:text-white transition-colors">
                  <span className="group-hover:-translate-x-1 transition-transform duration-200">حریم خصوصی</span>
                  <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-amber-400" />
                </Link>
              </li>
            </ul>
          </nav>

          {/* Col 5 (lg:col-span-2): Official Trust Seal & Enamad Column (Standard Iranian E-Commerce) */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-white font-black text-sm border-r-2 border-amber-400 pr-2">
              مجوز و اصالت
            </p>
            
            {/* Prestige Enamad Plaque */}
            <a
              referrerPolicy="origin"
              target="_blank"
              rel="noopener noreferrer"
              href="https://trustseal.enamad.ir/?id=8210505&Code=1TmOzJfoS6Cc17GnfRo4li4vKH41QGhM"
              title="استعلام نماد اعتماد الکترونیکی رسمی فروشگاه شیاسی در سامانه وزارت صمت"
              className="group relative bg-gradient-to-b from-slate-900/90 to-slate-950 p-3 rounded-2xl border border-slate-800 hover:border-amber-400/60 w-full flex flex-col items-center justify-between text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer overflow-hidden"
            >
              {/* Subtle top amber highlight */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Seal Emblem Frame */}
              <div className="w-12 h-12 rounded-xl bg-slate-950 p-1 flex items-center justify-center border border-slate-800 group-hover:border-amber-400/40 transition-colors shadow-inner relative overflow-hidden mb-2">
                {!enamadFailed ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    referrerPolicy="origin"
                    src="https://trustseal.enamad.ir/logo.aspx?id=8210505&Code=1TmOzJfoS6Cc17GnfRo4li4vKH41QGhM"
                    alt="اینماد فروشگاه شیاسی"
                    onError={() => setEnamadFailed(true)}
                    className="h-full w-full object-contain filter group-hover:scale-105 transition-transform duration-300"
                  />
                ) : null}

                {enamadFailed && (
                  <div className="flex flex-col items-center justify-center text-amber-400">
                    <ShieldCheck className="w-6 h-6 text-amber-400" />
                  </div>
                )}
              </div>

              {/* Badge Text with Pulsing Live Dot */}
              <div className="space-y-0.5 w-full">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-black text-white group-hover:text-amber-400 transition-colors">
                    اینماد رسمی
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  کد: ۸۲۱۰۵۰۵
                </p>
              </div>

              <div className="mt-2 text-[10px] text-amber-400/80 group-hover:text-amber-300 flex items-center justify-center gap-0.5">
                <span>استعلام برخط</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </div>
            </a>

            <div className="text-[10px] text-slate-500 text-center leading-tight">
              وزارت صنعت، معدن و تجارت
            </div>

          </div>

        </div>

        {/* Section 2: Bottom Legal, Metadata & Copyright Bar */}
        <div className="pt-6 border-t border-slate-850/80 space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            
            {/* Copyright */}
            <p className="text-slate-400">
              © تمامی حقوق برای {brand.nameFa || "فروشگاه شیاسی"} محفوظ است.
            </p>
            
            {/* Quick Location & Phone Info */}
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] text-slate-400">
              <span>نجف‌آباد، خیابان ۱۵ خرداد مرکزی</span>
              <span className="text-slate-700">•</span>
              <span>تلفن: <bdi dir="ltr" className="font-mono text-slate-300">{displayPhone}</bdi></span>
              <span className="text-slate-700">•</span>
              <span>همراه: <bdi dir="ltr" className="font-mono text-emerald-400">{displayMobile}</bdi></span>
            </div>

            {/* Quick Legal Links */}
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
              <Link href="/terms" prefetch={false} className="hover:text-amber-400 transition-colors">
                قوانین
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/privacy" prefetch={false} className="hover:text-amber-400 transition-colors">
                حریم خصوصی
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/cookies" prefetch={false} className="hover:text-amber-400 transition-colors">
                کوکی‌ها
              </Link>
            </div>

          </div>

        </div>

      </div>

    </footer>
  );
}
