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
  ExternalLink,
} from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const { brand } = useBrand();

  // Suppress public footer in admin panel
  if (pathname.startsWith("/admin")) {
    return null;
  }
  const rawPhone = brand.rawPhone || "03142624567";
  const displayPhone = brand.phone || "۰۳۱-۴۲۶۲۴۵۶۷";
  const cleanMobile = brand.rawMobile ? brand.rawMobile.replace(/^0/, "") : "9162665884";
  const whatsappUrl = `https://wa.me/98${cleanMobile}`;

  return (
    <footer className="bg-slate-950 text-slate-300 pt-10 pb-24 md:pb-8 border-t border-slate-850 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Main Footer Links & Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-850">
          
          {/* Col 1 & 2: About Store & Location */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shrink-0 shadow-md shadow-amber-500/20">
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
              فروشگاه شیاسی واقع در نجف‌آباد، مرکز تخصصی خرید انواع پنکه، موتور کولر آبی، بخاری برقی، آنتن‌های دیجیتال، سیم و کابل استاندارد تمام مس، و کارگاه مجهز عیب‌یابی و تعمیرات با قطعات اصلی می‌باشد.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{brand.address}</span>
              </div>
              
              {/* Clickable Phone Number Link */}
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تلفن فروشگاه: </span>
                <a
                  href={`tel:${rawPhone}`}
                  aria-label={`تماس تلفنی با فروشگاه شیاسی: ${displayPhone}`}
                  className="text-amber-400 hover:text-amber-300 font-mono font-bold hover:underline inline-block transition-colors"
                >
                  <bdi dir="ltr">{displayPhone}</bdi>
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>شنبه تا چهارشنبه ۸:۳۰ الی ۲۱:۰۰ | پنجشنبه‌ها ۸:۳۰ الی ۱۸:۰۰</span>
              </div>
            </div>

            {/* Quick Map and About Buttons (Stacked on mobile, row on desktop) */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <Link
                href="/contact"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-98 hover-glow"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>تماس با ما و مسیریابی</span>
              </Link>

              <Link
                href="/about"
                className="bg-slate-850 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all border border-slate-750 active:scale-98"
              >
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>درباره فروشگاه شیاسی</span>
              </Link>
            </div>
          </div>

          {/* Col 3 & Col 4: Categories & Services (Side-by-side 2 columns on Mobile!) */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4 sm:gap-6 border-t border-slate-850 md:border-t-0 pt-6 md:pt-0">
            
            {/* Col 3: Categories */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-sm border-r-2 border-amber-400 pr-2.5">
                دسته‌بندی‌های کالا
              </h4>
              <ul className="space-y-2 text-xs text-slate-400 font-medium">
                <li>
                  <Link href="/products?category=home-appliances-cooling-heating" className="hover:text-amber-400 transition-colors block py-0.5">
                    پنکه و تهویه خانگی
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=home-appliances-cooling-heating" className="hover:text-amber-400 transition-colors block py-0.5">
                    موتور و پمپ کولر
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=home-appliances-cooling-heating" className="hover:text-amber-400 transition-colors block py-0.5">
                    بخاری برقی و هیتر
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=wiring-building" className="hover:text-amber-400 transition-colors block py-0.5">
                    سیم، کابل و آنتن
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=lighting-fixtures" className="hover:text-amber-400 transition-colors block py-0.5">
                    پروژکتور خورشیدی
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=maker-diy-electronics" className="hover:text-amber-400 transition-colors block py-0.5">
                    بردهای آردوینو
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Services & Direct Pages */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-sm border-r-2 border-amber-400 pr-2.5">
                دسترسی و خدمات
              </h4>
              <ul className="space-y-2 text-xs text-slate-400 font-medium">
                <li>
                  <Link href="/contact" className="text-amber-400 font-bold hover:underline flex items-center gap-1 py-0.5">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>تماس و نشانی</span>
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-amber-400 transition-colors flex items-center gap-1 py-0.5">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>درباره شیاسی</span>
                  </Link>
                </li>
                <li>
                  <Link href="/repair-service" className="hover:text-amber-400 transition-colors flex items-center gap-1 py-0.5">
                    <Wrench className="w-3.5 h-3.5 shrink-0" />
                    <span>پیگیری تعمیرات</span>
                  </Link>
                </li>
                <li>
                  <Link href="/bom-upload" className="hover:text-amber-400 transition-colors flex items-center gap-1 py-0.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
                    <span>بارگذاری BOM</span>
                  </Link>
                </li>
                <li>
                  <Link href="/order-tracking" className="hover:text-amber-400 transition-colors flex items-center gap-1 py-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>پیگیری فاکتور</span>
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="hover:text-amber-400 transition-colors flex items-center gap-1 py-0.5">
                    <User className="w-3.5 h-3.5 shrink-0" />
                    <span>حساب کاربری</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Col 5: Trust Badges & Messengers */}
          <div className="space-y-3 border-t border-slate-850 md:border-t-0 pt-6 md:pt-0">
            <h4 className="text-white font-bold text-sm border-r-2 border-amber-400 pr-2.5">نمادهای اعتماد و پشتیبانی</h4>
            
            {/* Enhanced Trust Badges with Glowing Hover Borders */}
            <div className="grid grid-cols-2 gap-2">
              <div className="group bg-slate-900 hover:bg-slate-850 p-3 rounded-2xl border border-slate-800 hover:border-emerald-500/60 text-center flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-0.5 shadow-2xs">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] text-slate-200 font-bold">پروانه کسب</span>
                <span className="text-[9px] text-slate-400">صنف الکتریک</span>
              </div>
              <div className="group bg-slate-900 hover:bg-slate-850 p-3 rounded-2xl border border-slate-800 hover:border-amber-500/60 text-center flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-0.5 shadow-2xs">
                <ShieldCheck className="w-6 h-6 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] text-slate-200 font-bold">درگاه امن</span>
                <span className="text-[9px] text-slate-400">زرین‌پال و شاپرک</span>
              </div>
            </div>

            {/* Official Messengers with Direct Hover and WAI-ARIA */}
            <div className="pt-2">
              <p className="text-xs text-slate-300 mb-2 font-bold">پیام‌رسان‌های رسمی فروشگاه:</p>
              <div className="flex items-center gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ارسال پیام به واتساپ رسمی فروشگاه شیاسی"
                  className="flex-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-2xs shadow-emerald-500/10"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>واتساپ</span>
                </a>
                <a
                  href="https://eitaa.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="کانال رسمی فروشگاه شیاسی در ایتا"
                  className="flex-1 bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-white border border-orange-500/30 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-2xs shadow-orange-500/10"
                >
                  <span>ایتا</span>
                </a>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="کانال تلگرام فروشگاه شیاسی"
                  className="flex-1 bg-sky-600/20 hover:bg-sky-600 text-sky-400 hover:text-white border border-sky-500/30 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-2xs shadow-sky-500/10"
                >
                  <span>تلگرام</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© تمامی حقوق برای {brand.nameFa} محفوظ است.</p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>مرکز تخصصی لوازم برقی، روشنایی، سرمایش و گرمایش نجف‌آباد</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
