"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBrand } from "@/context/BrandContext";
import {
  Zap,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  FileSpreadsheet,
  User,
  Info,
  Navigation,
  MessageCircle,
  HelpCircle,
  Scale,
  Sparkles,
  ChevronLeft,
  BookOpen,
} from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const { brand } = useBrand();

  // Suppress public footer in admin panel
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const rawPhone = brand.rawPhone || "03142626116";
  const displayPhone = brand.phone || "۰۳۱-۴۲۶۲۶۱۱۶";
  const rawPhoneAlt = brand.rawPhoneAlt || "03142626107";
  const displayPhoneAlt = brand.phoneAlt || "۰۳۱-۴۲۶۲۶۱۰۷";
  const rawMobile = brand.rawMobile || "09136260072";
  const displayMobile = brand.mobile || "۰۹۱۳-۶۲۶-۰۰۷۲";
  const cleanMobile = brand.rawMobile ? brand.rawMobile.replace(/^0/, "") : "9136260072";
  const whatsappUrl = `https://wa.me/98${cleanMobile}`;
  const eitaaUrl = "https://eitaa.com/shiasi_electric";
  const telegramUrl = "https://t.me/shiasi_electric";

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-24 md:pb-8 border-t border-slate-850 relative overflow-hidden transition-colors duration-200">
      
      {/* Electric Amber Shimmer Topline */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-850">
          
          {/* Col 1 & 2: Store Identity & Contact */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shrink-0 shadow-lg shadow-amber-500/20">
                <Zap className="w-6 h-6 fill-slate-950 text-slate-950" />
              </div>
              <div className="flex items-center gap-2.5">
                <span className="font-black text-xl text-white tracking-tight">فروشگاه شیاسی</span>
                <span className="text-[11px] bg-amber-400/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-md border border-amber-400/30 whitespace-nowrap">
                  {brand.badge}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed text-justify font-medium">
              مرکز تخصصی پخش و فروش انواع پنکه، موتور و پمپ کولر آبی، بخاری برقی، سیم و کابل استاندارد تمام‌مس، آنتن دیجیتال و کارگاه مجهز عیب‌یابی و تعمیرات با قطعات اصلی در نجف‌آباد اصفهان.
            </p>

            <div className="space-y-2.5 text-xs text-slate-300 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{brand.address}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>تلفن: </span>
                  <a
                    href={`tel:${rawPhone}`}
                    aria-label={`تماس با تلفن ۱ فروشگاه شیاسی: ${displayPhone}`}
                    className="text-amber-400 hover:text-amber-300 font-mono font-bold hover:underline inline-block transition-colors"
                  >
                    <bdi dir="ltr">{displayPhone}</bdi>
                  </a>
                  <span className="text-slate-500">|</span>
                  <a
                    href={`tel:${rawPhoneAlt}`}
                    aria-label={`تماس با تلفن ۲ فروشگاه شیاسی: ${displayPhoneAlt}`}
                    className="text-amber-400 hover:text-amber-300 font-mono font-bold hover:underline inline-block transition-colors"
                  >
                    <bdi dir="ltr">{displayPhoneAlt}</bdi>
                  </a>
                </div>
                
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span>(همراه: </span>
                  <a
                    href={`tel:${rawMobile}`}
                    className="text-emerald-400 hover:underline font-mono font-bold"
                  >
                    <bdi dir="ltr">{displayMobile}</bdi>
                  </a>
                  <span>)</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span>شنبه تا چهارشنبه: ۸:۳۰ الی ۱۳:۰۰ و ۱۶:۳۰ الی ۲۱:۰۰</span>
                  <span className="block text-[11px] text-slate-400">پنج‌شنبه: ۸:۳۰ الی ۱۳:۰۰ | جمعه: تعطیل</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <Link
                href="/contact"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>تماس با ما و مسیریابی</span>
              </Link>

              <Link
                href="/about"
                className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all border border-slate-750 active:scale-95 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>درباره فروشگاه شیاسی</span>
              </Link>
            </div>
          </div>

          {/* Col 3 & Col 4: Symmetrical 6x6 Columns */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4 sm:gap-6 border-t border-slate-850 md:border-t-0 pt-6 md:pt-0">
            
            {/* Col 3: Categories (Exactly 6 clean items) */}
            <div className="space-y-3.5">
              <h4 className="text-white font-black text-sm border-r-2 border-amber-400 pr-2.5">
                دسته‌بندی‌های کالا
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
                <li>
                  <Link href="/products?category=home-appliances-cooling-heating" className="hover:text-amber-400 transition-colors flex items-center justify-between group py-0.5">
                    <span>پنکه و تهویه خانگی</span>
                    <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-amber-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=home-appliances-cooling-heating" className="hover:text-amber-400 transition-colors flex items-center justify-between group py-0.5">
                    <span>موتور و پمپ کولر آبی</span>
                    <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-amber-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=wiring-building" className="hover:text-amber-400 transition-colors flex items-center justify-between group py-0.5">
                    <span>سیم، کابل و آنتن مس</span>
                    <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-amber-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=lighting-fixtures" className="hover:text-amber-400 transition-colors flex items-center justify-between group py-0.5">
                    <span>پروژکتور و روشنایی</span>
                    <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-amber-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=tools-equipment" className="hover:text-amber-400 transition-colors flex items-center justify-between group py-0.5">
                    <span>بخاری برقی و هیتر</span>
                    <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-amber-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=maker-diy-electronics" className="hover:text-amber-400 transition-colors flex items-center justify-between group py-0.5">
                    <span>بردهای الکترونیک و ماژول</span>
                    <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-amber-400" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Services & Tools (Exactly 6 clean items) */}
            <div className="space-y-3.5">
              <h4 className="text-white font-black text-sm border-r-2 border-amber-400 pr-2.5">
                دسترسی و خدمات
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
                <li>
                  <Link href="/repair-service" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 py-0.5">
                    <Wrench className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                    <span>پیگیری تعمیرات کارگاه</span>
                  </Link>
                </li>
                <li>
                  <Link href="/bom-upload" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 py-0.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    <span>بارگذاری و استعلام BOM</span>
                  </Link>
                </li>
                <li>
                  <Link href="/order-tracking" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 py-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <span>پیگیری فاکتور و مرسوله</span>
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 py-0.5">
                    <HelpCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <span>سوالات متداول مشتریان</span>
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 py-0.5">
                    <BookOpen className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <span>مجله دانستنی‌ها و مقالات</span>
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 py-0.5">
                    <Scale className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                    <span>قوانین، گارانتی و حریم خصوصی</span>
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 py-0.5">
                    <User className="w-3.5 h-3.5 shrink-0 text-blue-400" />
                    <span>حساب کاربری و سفارشات</span>
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Col 5: Glassmorphic Trust Badges & Messengers */}
          <div className="space-y-3.5 border-t border-slate-850 md:border-t-0 pt-6 md:pt-0">
            <h4 className="text-white font-black text-sm border-r-2 border-amber-400 pr-2.5">
              نمادهای اعتماد و پشتیبانی
            </h4>
            
            {/* Glassmorphic Trust Badges with Glowing Borders & Pulse */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="group bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-3 rounded-2xl border border-slate-800 hover:border-emerald-500/60 text-center flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/40">
                <div className="relative">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
                </div>
                <span className="text-[10px] text-slate-200 font-bold">پروانه کسب</span>
                <span className="text-[9px] text-slate-400">صنف الکتریک نجف‌آباد</span>
              </div>

              <div className="group bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-3 rounded-2xl border border-slate-800 hover:border-amber-500/60 text-center flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/40">
                <ShieldCheck className="w-6 h-6 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] text-slate-200 font-bold">درگاه امن</span>
                <span className="text-[9px] text-slate-400">زرین‌پال و شاپرک</span>
              </div>
            </div>

            {/* Official Messengers with 60fps Brand Glow and Real URLs */}
            <div className="pt-2">
              <p className="text-xs text-slate-300 mb-2 font-bold">پیام‌رسان‌های رسمی فروشگاه:</p>
              <div className="flex items-center gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ارسال پیام به واتساپ رسمی فروشگاه شیاسی"
                  className="flex-1 bg-emerald-950/60 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-800/80 hover:border-emerald-500 px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>واتساپ</span>
                </a>

                <a
                  href={eitaaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="کانال رسمی فروشگاه شیاسی در ایتا"
                  className="flex-1 bg-orange-950/60 hover:bg-orange-600 text-orange-400 hover:text-white border border-orange-800/80 hover:border-orange-500 px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/25 active:scale-95 cursor-pointer"
                >
                  <span>ایتا</span>
                </a>

                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="کانال تلگرام فروشگاه شیاسی"
                  className="flex-1 bg-sky-950/60 hover:bg-sky-600 text-sky-400 hover:text-white border border-sky-800/80 hover:border-sky-500 px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/25 active:scale-95 cursor-pointer"
                >
                  <span>تلگرام</span>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© تمامی حقوق مادی و معنوی برای {brand.nameFa} محفوظ است.</p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>مرکز تخصصی لوازم برقی، روشنایی، سرمایش و گرمایش نجف‌آباد</span>
          </p>
        </div>

      </div>

    </footer>
  );
}
