"use client";

import React from "react";
import { ShieldCheck, RotateCcw, Truck, PhoneCall } from "lucide-react";

export function TrustFeaturesBar() {
  const features = [
    {
      icon: ShieldCheck,
      title: "ضمانت ۱۰۰٪ مس",
      subtitle: "موتوژن، پارس‌خزر، البرز",
    },
    {
      icon: RotateCcw,
      title: "مهلت تست و عیب‌یابی",
      subtitle: "گارانتی سلامت و کارکرد",
    },
    {
      icon: Truck,
      title: "ارسال سریع اسنپ",
      subtitle: "تحویل فوری در نجف‌آباد",
    },
    {
      icon: PhoneCall,
      title: "مشاوره و پشتیبانی",
      subtitle: "تلفن: ۰۳۱-۴۲۶۲۴۵۶۷",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 -mt-2 sm:-mt-4 relative z-20">
      <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-slate-200 dark:border-slate-700 shadow-md dark:shadow-2xl dark:shadow-black/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-slate-100 dark:divide-slate-700/80">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 transition-all ${
                  idx > 1 ? "pt-2.5 sm:pt-2" : ""
                }`}
              >
                {/* Icon Container */}
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-500/10 dark:bg-slate-700 text-amber-600 dark:text-amber-400 border border-amber-500/20 dark:border-slate-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-[11px] sm:text-xs text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-300 mt-0.5 truncate">
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
