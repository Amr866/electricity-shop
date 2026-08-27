"use client";

import React from "react";
import Link from "next/link";
import { useBrand } from "@/context/BrandContext";
import {
  Zap,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Wrench,
  FileSpreadsheet,
  User,
  Info,
  Navigation,
  MessageCircle,
} from "lucide-react";

export function Footer() {
  const { brand } = useBrand();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 pt-14 pb-8 border-t border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* 1. Value Propositions & Guarantees */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pb-10 border-b border-slate-800">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 dark:bg-slate-900/60 border border-slate-700/50 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm">ارسال فوری در نجف‌آباد و اصفهان</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">تحویل با اسنپ‌باکس و پیک اختصاصی</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 dark:bg-slate-900/60 border border-slate-700/50 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm">کارگاه تعمیرات تخصصی</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">تعمیر پنکه، موتور کولر، بخاری و آنتن</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 dark:bg-slate-900/60 border border-slate-700/50 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm">ضمانت ۱۰۰٪ مس و اصالت کالا</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">موتوژن، پارس‌خزر، البرز، اخوان، هانی</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 dark:bg-slate-900/60 border border-slate-700/50 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm">مهلت تست و کارکرد</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">ضمانت بازگشت و تست کارکرد قطعات</p>
            </div>
          </div>
        </div>

        {/* 2. Main Footer Links & Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-10 border-b border-slate-800">
          
          {/* Col 1 & 2: About Store & Location */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shrink-0 shadow-md shadow-amber-500/20">
                <Zap className="w-6 h-6 fill-slate-950" />
              </div>
              <div className="flex items-center gap-2.5">
                <span className="font-black text-xl text-white tracking-tight">فروشگاه شیاسی</span>
                <span className="text-[11px] bg-amber-400/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-md border border-amber-400/30 whitespace-nowrap">
                  {brand.badge}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              فروشگاه شیاسی واقع در نجف‌آباد، مرکز تخصصی خرید و فروش انواع پنکه، موتور کولر آبی، بخاری برقی، آنتن‌های دیجیتال، سیم و کابل استاندارد تمام مس، و کارگاه مجهز عیب‌یابی و تعمیرات با قطعات اصلی می‌باشد.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{brand.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تلفن فروشگاه: <bdi dir="ltr" className="text-amber-400 font-mono font-bold text-left inline-block">۰۳۱-۴۲۶۲۴۵۶۷</bdi></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>شنبه تا چهارشنبه ۸:۳۰ الی ۲۱:۰۰ | پنجشنبه‌ها ۸:۳۰ الی ۱۸:۰۰</span>
              </div>
            </div>

            {/* Quick Map and About Buttons */}
            <div className="flex gap-2 pt-2">
              <Link
                href="/contact"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>تماس با ما و مسیریابی</span>
              </Link>

              <Link
                href="/about"
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>درباره فروشگاه شیاسی</span>
              </Link>
            </div>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm border-r-2 border-amber-400 pr-2.5">دسته‌بندی‌های کالا</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/products?category=home-appliances-cooling-heating" className="hover:text-amber-400 transition-colors">
                  پنکه و تهویه خانگی
                </Link>
              </li>
              <li>
                <Link href="/products?category=home-appliances-cooling-heating" className="hover:text-amber-400 transition-colors">
                  موتور و پمپ کولر آبی
                </Link>
              </li>
              <li>
                <Link href="/products?category=home-appliances-cooling-heating" className="hover:text-amber-400 transition-colors">
                  بخاری برقی و هیتر
                </Link>
              </li>
              <li>
                <Link href="/products?category=wiring-building" className="hover:text-amber-400 transition-colors">
                  سیم، کابل و آنتن دیجیتال
                </Link>
              </li>
              <li>
                <Link href="/products?category=lighting-fixtures" className="hover:text-amber-400 transition-colors">
                  روشنایی و پروژکتور خورشیدی
                </Link>
              </li>
              <li>
                <Link href="/products?category=maker-diy-electronics" className="hover:text-amber-400 transition-colors">
                  بردهای آردوینو و ماژول‌ها
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Services & Direct Pages */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm border-r-2 border-amber-400 pr-2.5">دسترسی و خدمات</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/contact" className="text-amber-400 font-bold hover:underline flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>تماس با ما و نشانی شعبه</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>درباره فروشگاه شیاسی</span>
                </Link>
              </li>
              <li>
                <Link href="/repair-service" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>پذیرش و پیگیری تعمیرات</span>
                </Link>
              </li>
              <li>
                <Link href="/bom-upload" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>خرید عمده و بارگذاری BOM</span>
                </Link>
              </li>
              <li>
                <Link href="/order-tracking" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>پیگیری سفارش و فاکتور رسمی</span>
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>حساب کاربری و تاریخچه خرید</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Trust Badges & Messengers */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm border-r-2 border-amber-400 pr-2.5">نمادهای اعتماد و پشتیبانی</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800 dark:bg-slate-900 p-3 rounded-xl border border-slate-700 dark:border-slate-800 text-center flex flex-col items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-1" />
                <span className="text-[10px] text-slate-200 font-bold">پروانه کسب</span>
                <span className="text-[9px] text-slate-400">صنف الکتریک</span>
              </div>
              <div className="bg-slate-800 dark:bg-slate-900 p-3 rounded-xl border border-slate-700 dark:border-slate-800 text-center flex flex-col items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-amber-400 mb-1" />
                <span className="text-[10px] text-slate-200 font-bold">درگاه امن</span>
                <span className="text-[9px] text-slate-400">زرین‌پال و شاپرک</span>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs text-slate-400 mb-2">پیام‌رسان‌های فروشگاه:</p>
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/98${brand.mobile.replace(/^0/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>واتساپ</span>
                </a>
                <a
                  href="https://eitaa.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-600/20 text-orange-400 hover:bg-orange-600 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  ایتا
                </a>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-600/20 text-sky-400 hover:bg-sky-600 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  تلگرام
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© تمامی حقوق برای {brand.nameFa} محفوظ است.</p>
          <p className="flex items-center gap-1">
            خرید و خدمات فنی الکتریک، لوازم برقی و سرمایش/گرمایش نجف‌آباد
          </p>
        </div>
      </div>
    </footer>
  );
}
