"use client";

import React from "react";
import { useBrand } from "@/context/BrandContext";
import {
  MapPin,
  Truck,
  CreditCard,
  Clock,
  ShieldCheck,
  Building,
  Navigation,
  MessageCircle,
} from "lucide-react";

export function IsfahanBanner() {
  const { brand } = useBrand();

  return (
    <section className="py-2 sm:py-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 text-slate-900 dark:text-white relative overflow-hidden shadow-sm dark:shadow-xl border border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
        
        {/* Background Decorative Pattern */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-stretch relative z-10">
          
          {/* Left Col: Info & 4 Advantages Grid */}
          <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-500/30 mb-2.5">
                <Building className="w-3.5 h-3.5" />
                <span>فروشگاه مرکزی و کارگاه فنی شیاسی نجف‌آباد</span>
              </div>

              <h2 className="text-lg sm:text-2xl font-black leading-snug text-slate-900 dark:text-white">
                خدمات اختصاصی فروشگاه و کارگاه شیاسی <br />
                <span className="text-amber-600 dark:text-amber-400 text-sm sm:text-lg">ویژه شهروندان، پروژه‌های ساختمانی و سراسر کشور</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mt-2 text-justify font-medium">
                فروشگاه شیاسی واقع در نجف‌آباد اصفهان، علاوه بر تحویل فوری با اسنپ و تیپاکس، امکان خرید و عیب‌یابی حضوری و صدور پیش‌فاکتور رسمی را فراهم نموده است.
              </p>
            </div>

            {/* 4 Advantages Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-750 space-y-1 hover:border-amber-400/60 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <strong className="text-xs font-bold text-slate-900 dark:text-white block">ارسال فوری اسنپ</strong>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight font-medium">تحویل سریع در نجف‌آباد و اصفهان</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-750 space-y-1 hover:border-amber-400/60 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <strong className="text-xs font-bold text-slate-900 dark:text-white block">پرداخت در محل</strong>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight font-medium">کارتخوان سیار پس از تحویل</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-750 space-y-1 hover:border-amber-400/60 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <strong className="text-xs font-bold text-slate-900 dark:text-white block">تحویل حضوری</strong>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight font-medium">تست کالا در فروشگاه</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-750 space-y-1 hover:border-amber-400/60 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <strong className="text-xs font-bold text-slate-900 dark:text-white block">پیش‌فاکتور رسمی</strong>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight font-medium">مهر و شناسه معتبر</span>
              </div>
            </div>
          </div>

          {/* Right Col: Location & Google Maps Card */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-750 shadow-sm dark:shadow-xl space-y-3.5 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-amber-700 dark:text-amber-400 flex items-center gap-1.5 pb-2 border-b border-slate-200/80 dark:border-slate-750">
                  <MapPin className="w-4 h-4" />
                  <span>نشانی شعبه نجف‌آباد و ارتباط مستقیم</span>
                </h3>

                <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 mt-3">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] mb-0.5 font-medium">آدرس فروشگاه و کارگاه:</span>
                    <span className="font-bold text-slate-900 dark:text-white text-xs leading-relaxed block">
                      {brand.address}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-2xs">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px] mb-0.5 font-medium">تلفن فروشگاه:</span>
                      <a href={`tel:${brand.rawPhone || "03142624567"}`} className="font-bold text-amber-600 dark:text-amber-400 text-xs font-mono">
                        {brand.phone}
                      </a>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-2xs">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px] mb-0.5 font-medium">واحد تعمیرات:</span>
                      <a href="tel:09162665884" className="font-bold text-emerald-600 dark:text-emerald-400 text-xs font-mono">
                        ۰۹۱۶-۲۶۶-۵۸۸۴
                      </a>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>ساعت کاری: ۸:۳۰ الی ۲۱:۰۰ (پنجشنبه‌ها تا ۱۸:۰۰)</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <a
                  href={brand.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl text-center transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>مسیریابی در نقشه</span>
                </a>

                <a
                  href={`https://wa.me/98${brand.rawMobile?.replace(/^0/, "") || "9131112233"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl text-center transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>واتساپ</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
