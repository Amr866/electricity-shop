"use client";

import React from "react";
import { ShieldCheck, RotateCcw, Truck, PhoneCall } from "lucide-react";

export function TrustFeaturesBar() {
  const features = [
    {
      icon: ShieldCheck,
      title: "ضمانت ۱۰۰٪ مس و اصالت کالا",
      subtitle: "موتوژن، پارس‌خزر، البرز، هانی",
    },
    {
      icon: RotateCcw,
      title: "مهلت تست و کارکرد",
      subtitle: "تست سلامت قطعه و عیب‌یابی تعمیرات",
    },
    {
      icon: Truck,
      title: "ارسال سریع اسنپ و پیک",
      subtitle: "تحویل فوری در نجف‌آباد و اصفهان",
    },
    {
      icon: PhoneCall,
      title: "مشاوره و پشتیبانی فنی",
      subtitle: "پاسخگویی: ۰۳۱-۴۲۶۲۴۵۶۷",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 -mt-2 sm:-mt-4 relative z-20">
      <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700 shadow-md dark:shadow-2xl dark:shadow-black/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-slate-100 dark:divide-slate-700/80">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-2.5 sm:gap-3.5 p-1.5 sm:p-2 transition-all hover:translate-y-[-1px] ${
                  idx > 1 ? "pt-3 sm:pt-2" : ""
                }`}
              >
                {/* Unified High-Contrast Icon Container */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 dark:bg-slate-700 text-amber-600 dark:text-amber-400 border border-slate-200/80 dark:border-slate-600 flex items-center justify-center shrink-0 shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mt-0.5 truncate">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
