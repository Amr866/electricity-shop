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
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-3xl p-5 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        
        {/* Background Decorative Pattern */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center relative z-10">
          
          {/* Left Col: Info & 4 Advantages Grid */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-[11px] font-extrabold px-3 py-1 rounded-full border border-amber-500/30">
              <Building className="w-3.5 h-3.5" />
              <span>فروشگاه مرکزی و کارگاه فنی نجف‌آباد</span>
            </div>

            <div>
              <h2 className="text-lg sm:text-2xl font-extrabold leading-snug text-white">
                خدمات اختصاصی {brand.nameFa} <br />
                <span className="text-amber-400 text-sm sm:text-xl">ویژه همشهریان، پروژه‌ها و سراسر ایران</span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-1.5 text-justify">
                {brand.nameFa} واقع در نجف‌آباد اصفهان، علاوه بر ارسال فوری با اسنپ و تیپاکس، امکان خرید و تحویل حضوری، تعمیرات تخصصی لوازم برقی و صدور فاکتور رسمی را فراهم نموده است.
              </p>
            </div>

            {/* 4 Advantages (2x2 Grid on mobile & desktop) */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 pt-1">
              <div className="bg-slate-850/90 p-3 rounded-2xl border border-slate-700/80 space-y-1">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <strong className="text-xs font-bold text-white block">ارسال فوری اسنپ</strong>
                <span className="text-[10px] text-slate-400 block leading-tight">تحویل فوری در نجف‌آباد و اصفهان</span>
              </div>

              <div className="bg-slate-850/90 p-3 rounded-2xl border border-slate-700/80 space-y-1">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <strong className="text-xs font-bold text-white block">پرداخت در محل</strong>
                <span className="text-[10px] text-slate-400 block leading-tight">کارتخوان سیار پس از تحویل</span>
              </div>

              <div className="bg-slate-850/90 p-3 rounded-2xl border border-slate-700/80 space-y-1">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <strong className="text-xs font-bold text-white block">تحویل حضوری</strong>
                <span className="text-[10px] text-slate-400 block leading-tight">تست و تحویل در فروشگاه</span>
              </div>

              <div className="bg-slate-850/90 p-3 rounded-2xl border border-slate-700/80 space-y-1">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <strong className="text-xs font-bold text-white block">فاکتور رسمی</strong>
                <span className="text-[10px] text-slate-400 block leading-tight">مهر و شناسه ملی معتبر</span>
              </div>
            </div>
          </div>

          {/* Right Col: Location & Google Maps Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-700/90 shadow-xl space-y-3">
              <h3 className="font-extrabold text-xs sm:text-sm text-amber-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>نشانی شعبه نجف‌آباد و تماس</span>
              </h3>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] mb-0.5">آدرس فروشگاه و کارگاه:</span>
                  <span className="font-medium text-white text-[11px] leading-relaxed block">
                    {brand.address}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[9px]">تلفن فروشگاه:</span>
                    <a href={`tel:${brand.phone.replace(/\D/g, "")}`} className="font-bold text-amber-400 text-xs font-mono">
                      {brand.phone}
                    </a>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[9px]">واحد تعمیرات:</span>
                    <a href="tel:09162665884" className="font-bold text-emerald-400 text-xs font-mono">
                      ۰۹۱۶-۲۶۶-۵۸۸۴
                    </a>
                  </div>
                </div>

                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>۸:۳۰ الی ۲۱:۰۰ (پنجشنبه‌ها تا ۱۸:۰۰)</span>
                </div>
              </div>

              <div className="pt-1 flex gap-2">
                <a
                  href={brand.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2 rounded-xl text-center transition-colors flex items-center justify-center gap-1 shadow-md"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>مسیریابی در نقشه</span>
                </a>
                <a
                  href={`https://wa.me/98${brand.mobile.replace(/^0/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-xl text-center transition-colors flex items-center justify-center gap-1"
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
