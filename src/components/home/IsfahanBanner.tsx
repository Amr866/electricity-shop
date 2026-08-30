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
  Phone,
  Wrench,
} from "lucide-react";

// 1. Modular Store Advantages Data (Extracted outside render function)
const STORE_ADVANTAGES = [
  {
    id: "snap",
    title: "ارسال فوری اسنپ",
    subtitle: "نجف‌آباد و اصفهان",
    icon: Truck,
    iconColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    hoverBorder: "hover:border-emerald-500/80 dark:hover:border-emerald-400/80",
    glowBg: "group-hover:from-emerald-500/10 group-hover:via-emerald-500/5 group-hover:to-transparent",
    pingColor: "bg-emerald-400",
    hasLivePing: true,
  },
  {
    id: "cod",
    title: "پرداخت در محل",
    subtitle: "کارتخوان سیار",
    icon: CreditCard,
    iconColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    hoverBorder: "hover:border-amber-500/80 dark:hover:border-amber-400/80",
    glowBg: "group-hover:from-amber-500/10 group-hover:via-amber-500/5 group-hover:to-transparent",
    hasLivePing: false,
  },
  {
    id: "pickup",
    title: "تحویل حضوری",
    subtitle: "تست در فروشگاه",
    icon: MapPin,
    iconColor: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    hoverBorder: "hover:border-blue-500/80 dark:hover:border-blue-400/80",
    glowBg: "group-hover:from-blue-500/10 group-hover:via-blue-500/5 group-hover:to-transparent",
    hasLivePing: false,
  },
  {
    id: "invoice",
    title: "پیش‌فاکتور رسمی",
    subtitle: "مهر و شناسه معتبر",
    icon: ShieldCheck,
    iconColor: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    hoverBorder: "hover:border-purple-500/80 dark:hover:border-purple-400/80",
    glowBg: "group-hover:from-purple-500/10 group-hover:via-purple-500/5 group-hover:to-transparent",
    hasLivePing: false,
  },
];

export function IsfahanBanner() {
  const { brand } = useBrand();

  const storePhone = brand.phone || "۰۳۱-۴۲۶۲۴۵۶۷";
  const storeRawPhone = brand.rawPhone || "03142624567";
  const repairPhone = "۰۹۱۶-۲۶۶-۵۸۸۴";
  const repairRawPhone = "09162665884";
  const cleanMobile = brand.rawMobile ? brand.rawMobile.replace(/^0/, "") : "9162665884";
  const whatsappUrl = `https://wa.me/98${cleanMobile}?text=${encodeURIComponent("سلام، درخواست راهنمایی و مشاوره خرید از فروشگاه شیاسی را دارم.")}`;

  return (
    <section className="py-2 sm:py-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 text-slate-900 dark:text-white relative overflow-hidden shadow-sm dark:shadow-xl border border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
        
        {/* Ambient Background Decorative Glow */}
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

            {/* 4 Advantages Grid (Refactored to Modular Clean Cards) */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 pt-1 sm:pt-2">
              {STORE_ADVANTAGES.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className={`group relative bg-slate-50 dark:bg-slate-850 rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 dark:border-slate-750 flex items-center gap-2.5 sm:gap-3 transition-all duration-300 hover:-translate-y-1 shadow-2xs overflow-hidden ${item.hoverBorder}`}
                  >
                    {/* Glowing Aura on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.glowBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl`} />

                    <div className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${item.iconColor} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-108 transition-transform duration-300`}>
                      {item.hasLivePing && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${item.pingColor} opacity-75`} />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                      )}
                      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>

                    <div className="min-w-0 relative z-10">
                      <strong className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white block truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {item.title}
                      </strong>
                      <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 block leading-tight font-medium truncate mt-0.5">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Col: Location & Quick Access Glass Storefront Card */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-750 shadow-sm dark:shadow-xl space-y-3.5 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-amber-700 dark:text-amber-400 flex items-center gap-1.5 pb-2.5 border-b border-slate-200/80 dark:border-slate-750">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>نشانی شعبه نجف‌آباد و ارتباط مستقیم</span>
                </h3>

                <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 mt-3">
                  {/* Address Pill */}
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] mb-1 font-medium">آدرس فروشگاه و کارگاه:</span>
                    <span className="font-bold text-slate-900 dark:text-white text-xs leading-relaxed block">
                      {brand.address}
                    </span>
                  </div>

                  {/* Direct Phone Numbers Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${storeRawPhone}`}
                      aria-label={`تماس با تلفن ثابت فروشگاه: ${storePhone}`}
                      className="bg-white dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-2xs transition-all duration-200 hover:border-amber-400/80 block group active:scale-95"
                    >
                      <span className="text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 text-[10px] mb-0.5 font-medium">
                        <Phone className="w-2.5 h-2.5 text-amber-500" />
                        <span>تلفن فروشگاه:</span>
                      </span>
                      <span className="font-bold text-amber-600 dark:text-amber-400 text-xs font-mono group-hover:underline">
                        {storePhone}
                      </span>
                    </a>

                    <a
                      href={`tel:${repairRawPhone}`}
                      aria-label={`تماس با واحد فنی و تعمیرات: ${repairPhone}`}
                      className="bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-2xs transition-all duration-200 hover:border-emerald-400/80 block group active:scale-95"
                    >
                      <span className="text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 text-[10px] mb-0.5 font-medium">
                        <Wrench className="w-2.5 h-2.5 text-emerald-500" />
                        <span>واحد تعمیرات:</span>
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs font-mono group-hover:underline">
                        {repairPhone}
                      </span>
                    </a>
                  </div>

                  {/* Operating Hours Pill */}
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>ساعت کاری: ۸:۳۰ الی ۲۱:۰۰ (پنجشنبه‌ها تا ۱۸:۰۰)</span>
                  </div>
                </div>
              </div>

                {/* Navigation and WhatsApp Buttons */}
                <div className="pt-2 flex gap-2">
                <a
                  href={brand.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="مسیریابی در نقشه نشان و گوگل مپ"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl text-center transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm active:scale-95 hover-glow"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>مسیریابی در نقشه</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ارسال پیام و استعلام در واتساپ"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl text-center transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm active:scale-95 shadow-emerald-600/20"
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
