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
  Headphones,
  CheckCircle2,
  Cpu,
  Wrench,
  FileSpreadsheet,
  User,
} from "lucide-react";

export function Footer() {
  const { brand } = useBrand();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* 1. Value Propositions & Guarantees */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">ارسال فوری در نجف‌آباد و اصفهان</h4>
              <p className="text-xs text-slate-400 mt-0.5">تحویل با اسنپ‌باکس و پیک اختصاصی</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">کارگاه تعمیرات تخصصی</h4>
              <p className="text-xs text-slate-400 mt-0.5">تعمیر پنکه، موتور کولر، بخاری و آنتن</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">ضمانت ۱۰۰٪ اصالت و قطعات مس</h4>
              <p className="text-xs text-slate-400 mt-0.5">برندهای موتوژن، پارس‌خزر، البرز، هانی</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">مهلت تست و کارکرد</h4>
              <p className="text-xs text-slate-400 mt-0.5">ضمانت بازگشت کالا و تست تعمیرات</p>
            </div>
          </div>
        </div>

        {/* 2. Main Footer Links & Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-slate-800">
          
          {/* Col 1 & 2: About Store & Location */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <Zap className="w-6 h-6 fill-slate-950" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white">{brand.nameFa}</span>
                <span className="mr-2 text-xs bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded">
                  {brand.badge}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed text-justify">
              {brand.nameFa} واقع در نجف‌آباد، مرکز تخصصی خرید و فروش لوازم برقی خانگی، پنکه، موتور کولر آبی، بخاری برقی، آنتن، سیم و کابل استاندارد تمام مس، و کارگاه مجهز عیب‌یابی و تعمیرات با قطعات اصلی می‌باشد.
            </p>

            <div className="space-y-2.5 text-xs text-slate-300 pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{brand.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تلفن فروشگاه: <strong className="text-white persian-numbers">{brand.phone}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>شنبه تا چهارشنبه ۸:۳۰ الی ۲۱:۰۰ | پنجشنبه‌ها ۸:۳۰ الی ۱۸:۰۰</span>
              </div>
            </div>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm border-r-2 border-amber-400 pr-2.5">محصولات و دسته‌بندی‌ها</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/products?category=home-appliances-cooling-heating" className="hover:text-amber-400 transition-colors">
                  پنکه و تهویه ریموت‌دار
                </Link>
              </li>
              <li>
                <Link href="/products?category=home-appliances-cooling-heating" className="hover:text-amber-400 transition-colors">
                  موتور و پمپ کولر آبی
                </Link>
              </li>
              <li>
                <Link href="/products?category=home-appliances-cooling-heating" className="hover:text-amber-400 transition-colors">
                  بخاری برقی و هیتر تابشی
                </Link>
              </li>
              <li>
                <Link href="/products?category=home-appliances-cooling-heating" className="hover:text-amber-400 transition-colors">
                  آنتن هوایی گردان دیجیتال
                </Link>
              </li>
              <li>
                <Link href="/products?category=wiring-building" className="hover:text-amber-400 transition-colors">
                  سیم و کابل تمام مس ساختمانی
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Services & Tools */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm border-r-2 border-amber-400 pr-2.5">خدمات و ابزارها</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/repair-service" className="text-amber-400 font-bold hover:underline flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>پذیرش آنلاین تعمیرات</span>
                </Link>
              </li>
              <li>
                <Link href="/bom-upload" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>خرید گروهی قطعات (BOM)</span>
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>حساب کاربری و فاکتور رسمی</span>
                </Link>
              </li>
              <li>
                <Link href="/order-tracking" className="hover:text-amber-400 transition-colors">
                  پیگیری سفارش و فاکتور
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  آدرس و نقشه شعبه نجف‌آباد
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Trust Badges */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm border-r-2 border-amber-400 pr-2.5">نمادهای اعتماد</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center flex flex-col items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-1" />
                <span className="text-[10px] text-slate-300 font-bold">پروانه کسب</span>
                <span className="text-[9px] text-slate-400">صنف الکتریک</span>
              </div>
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center flex flex-col items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-amber-400 mb-1" />
                <span className="text-[10px] text-slate-300 font-bold">درگاه امن</span>
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
                  className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  واتساپ
                </a>
                <a
                  href="https://eitaa.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-600/20 text-orange-400 hover:bg-orange-600 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  ایتا
                </a>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-600/20 text-sky-400 hover:bg-sky-600 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
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
            خرید و خدمات فنی الکتریک، لوازم برقی و سرمایش/گرمایش
          </p>
        </div>
      </div>
    </footer>
  );
}
