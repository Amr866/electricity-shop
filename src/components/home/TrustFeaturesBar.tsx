"use client";

import React from "react";
import { ShieldCheck, RotateCcw, Truck, PhoneCall } from "lucide-react";

// 1. Static Trust Features Data (Defined outside render function to eliminate GC memory allocation)
const TRUST_FEATURES = [
  {
    id: "guarantee-copper",
    icon: ShieldCheck,
    title: "ضمانت ۱۰۰٪ مس",
    subtitle: "موتوژن، پارس‌خزر، البرز",
    badgeGlow: "group-hover:bg-amber-500/20 group-hover:border-amber-500/40",
  },
  {
    id: "testing-workshop",
    icon: RotateCcw,
    title: "مهلت تست و عیب‌یابی",
    subtitle: "گارانتی سلامت و کارکرد",
    badgeGlow: "group-hover:bg-sky-500/20 group-hover:border-sky-500/40",
  },
  {
    id: "fast-delivery",
    icon: Truck,
    title: "ارسال سریع اسنپ",
    subtitle: "تحویل فوری در نجف‌آباد",
    badgeGlow: "group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40",
  },
  {
    id: "support-phone",
    icon: PhoneCall,
    title: "مشاوره و پشتیبانی",
    subtitle: "تلفن: ۰۳۱-۴۲۶۲۴۵۶۷",
    phoneHref: "tel:03142624567",
    badgeGlow: "group-hover:bg-orange-500/20 group-hover:border-orange-500/40",
  },
];

export function TrustFeaturesBar() {
  return (
    <section aria-label="مزایا و خدمات فروشگاه شیاسی" className="max-w-7xl mx-auto px-3 sm:px-4 -mt-2 sm:-mt-4 relative z-20">
      <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-slate-200 dark:border-slate-700 shadow-md dark:shadow-2xl dark:shadow-black/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-slate-100 dark:divide-slate-700/80">
          {TRUST_FEATURES.map((item, idx) => {
            const Icon = item.icon;
            const content = (
              <>
                {/* Icon Container with Micro-interaction Scale & Aura */}
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-500/10 dark:bg-slate-700 text-amber-600 dark:text-amber-400 border border-amber-500/20 dark:border-slate-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform duration-300 ${item.badgeGlow}`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:rotate-6" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-[11px] sm:text-xs text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h4>
                  {item.id === "support-phone" ? (
                    <p className="text-[10px] sm:text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-0.5 whitespace-nowrap">
                      <span>تلفن: </span>
                      <bdi dir="ltr" className="font-mono font-bold tracking-tight">۰۳۱-۴۲۶۲۴۵۶۷</bdi>
                    </p>
                  ) : (
                    <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-300 mt-0.5 truncate">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </>
            );

            if (item.phoneHref) {
              return (
                <a
                  key={item.id}
                  href={item.phoneHref}
                  aria-label="تماس مستقیم با واحد مشاوره و پشتیبانی شیاسی: ۰۳۱-۴۲۶۲۴۵۶۷"
                  className={`group flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-2xl transition-all duration-300 hover:bg-amber-50/60 dark:hover:bg-slate-750 active:scale-98 ${
                    idx > 1 ? "pt-2.5 sm:pt-2" : ""
                  }`}
                >
                  {content}
                </a>
              );
            }

            return (
              <div
                key={item.id}
                className={`group flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-2xl transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-750 ${
                  idx > 1 ? "pt-2.5 sm:pt-2" : ""
                }`}
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
