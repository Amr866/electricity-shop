"use client";

import React from "react";
import Link from "next/link";
import { useBrand } from "@/context/BrandContext";
import {
  MapPin,
  Truck,
  CreditCard,
  Phone,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Building,
  Navigation,
} from "lucide-react";

export function IsfahanBanner() {
  const { brand } = useBrand();

  return (
    <section className="py-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-slate-700">
        
        {/* Background Decorative Pattern */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Col: Info & Features */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-500/30">
              <Building className="w-3.5 h-3.5" />
              <span>فروشگاه مرکزی و ارسال سریع</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white">
              خدمات اختصاصی {brand.nameFa} <br />
              <span className="text-amber-400">ویژه همشهریان، پروژه‌ها و سراسر ایران</span>
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed text-justify">
              {brand.nameFa} واقع در اصفهان، علاوه بر امکان خرید آنلاین با ارسال سریع، امکان خرید حضوری، بررسی نمونه کالاها و دریافت فاکتور رسمی معتبر را برای پیمانکاران، برق‌کاران و همشهریان گرامی فراهم نموده است.
            </p>

            {/* Grid of Advantages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-start gap-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <Truck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-xs font-bold text-white block">پیک اختصاصی و اسنپ‌باکس</strong>
                  <span className="text-[11px] text-slate-400">تحویل زیر ۳ ساعت در تمام مناطق ۱۵ گانه اصفهان</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <CreditCard className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-xs font-bold text-white block">پرداخت در محل (POS پیک)</strong>
                  <span className="text-[11px] text-slate-400">تسویه وجه با کارتخوان سیار پس از دریافت کالا</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-xs font-bold text-white block">تحویل حضوری در شعبه</strong>
                  <span className="text-[11px] text-slate-400">امکان تحویل حضوری و تست فنی اقلام</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-xs font-bold text-white block">پیش‌فاکتور رسمی پروژه‌ای</strong>
                  <span className="text-[11px] text-slate-400">صدور فاکتور با مهر و امضای معتبر فروشگاه</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Location & Google Maps Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
              <h3 className="font-extrabold text-base text-amber-400 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>اطلاعات شعبه و موقعیت در گوگل‌مپ</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] mb-1">آدرس دقیق فروشگاه:</span>
                  <span className="font-medium leading-relaxed text-white">
                    {brand.address}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] mb-1">تلفن فروشگاه:</span>
                    <a href={`tel:${brand.phone.replace(/\D/g, "")}`} className="font-bold text-amber-400 persian-numbers text-sm">
                      {brand.phone}
                    </a>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] mb-1">همراه و واتساپ:</span>
                    <a href={`tel:${brand.mobile}`} className="font-bold text-emerald-400 persian-numbers text-sm">
                      {brand.mobile}
                    </a>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>شنبه تا چهارشنبه ۸:۳۰ تا ۲۱:۰۰ | پنجشنبه‌ها ۸:۳۰ تا ۱۸:۰۰</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <a
                  href={brand.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2.5 rounded-xl text-center transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>مسیریابی در گوگل‌مپ</span>
                </a>
                <a
                  href={`https://wa.me/98${brand.mobile.replace(/^0/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl text-center transition-colors"
                >
                  پیام در واتساپ
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
