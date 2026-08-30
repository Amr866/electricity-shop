"use client";

import React from "react";
import Link from "next/link";
import {
  Wrench,
  Fan,
  Sun,
  Flame,
  Tv,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  PhoneCall,
  Plug,
} from "lucide-react";

// 1. Static Services Data (Defined outside render function to eliminate GC memory allocation)
const WORKSHOP_SERVICES = [
  {
    id: "fan",
    title: "تعمیر انواع پنکه",
    desc: "تعویض بوش، رفع صدای موتور، سیم‌پیچی، تعویض خازن، کلید و ریموت کنترل",
    icon: Fan,
    badge: "پارس خزر • سانی",
    iconColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30",
    hoverBorder: "hover:border-amber-500/80 dark:hover:border-amber-400/80",
    hoverShadow: "hover:shadow-amber-500/15 hover:shadow-xl",
    glowBg: "group-hover:from-amber-500/10 group-hover:via-amber-500/5 group-hover:to-transparent",
    accentText: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
  },
  {
    id: "cooler-motor",
    title: "سرویس و موتور کولر",
    desc: "تعویض پلاتین و کلاچ، تعویض بوش برنجی، تراشکاری شفت، خازن و پمپ آب",
    icon: Sun,
    badge: "موتوژن • کیا",
    iconColor: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30",
    hoverBorder: "hover:border-blue-500/80 dark:hover:border-blue-400/80",
    hoverShadow: "hover:shadow-blue-500/15 hover:shadow-xl",
    glowBg: "group-hover:from-blue-500/10 group-hover:via-blue-500/5 group-hover:to-transparent",
    accentText: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
  },
  {
    id: "heater",
    title: "بخاری برقی و هیتر",
    desc: "تعویض المنت شیشه‌ای کوارتز و سرامیکی، کلیدهای نسوز، فن و ترموستات ایمن",
    icon: Flame,
    badge: "اخوان • ارشیا",
    iconColor: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30",
    hoverBorder: "hover:border-rose-500/80 dark:hover:border-rose-400/80",
    hoverShadow: "hover:shadow-rose-500/15 hover:shadow-xl",
    glowBg: "group-hover:from-rose-500/10 group-hover:via-rose-500/5 group-hover:to-transparent",
    accentText: "group-hover:text-rose-600 dark:group-hover:text-rose-400",
  },
  {
    id: "antenna",
    title: "آنتن و قطعات دیجیتال",
    desc: "تعمیر بوستر آنتن، منبع تغذیه، بردهای تغذیه سوئیچینگ و تقویت‌کننده‌ها",
    icon: Tv,
    badge: "هانی • سیماران",
    iconColor: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30",
    hoverBorder: "hover:border-purple-500/80 dark:hover:border-purple-400/80",
    hoverShadow: "hover:shadow-purple-500/15 hover:shadow-xl",
    glowBg: "group-hover:from-purple-500/10 group-hover:via-purple-500/5 group-hover:to-transparent",
    accentText: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
  },
  {
    id: "general",
    title: "سایر لوازم برقی",
    desc: "عیب‌یابی چای‌ساز، جاروبرقی، اتو، محافظ برق، سشوار و دریل کارگاهی",
    icon: Plug,
    badge: "خانگی و صنعتی",
    iconColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
    hoverBorder: "hover:border-emerald-500/80 dark:hover:border-emerald-400/80",
    hoverShadow: "hover:shadow-emerald-500/15 hover:shadow-xl",
    glowBg: "group-hover:from-emerald-500/10 group-hover:via-emerald-500/5 group-hover:to-transparent",
    accentText: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
  },
];

export function RepairWorkshopSection() {
  return (
    <section id="workshop" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-6 relative overflow-hidden transition-colors duration-200 scroll-mt-28">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-2 max-w-2xl text-right">
          <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400 text-xs font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
            <Wrench className="w-4 h-4" />
            <span>مرکز تخصصی تعمیرات و خدمات فنی شیاسی (نجف‌آباد)</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
            تعمیرات تخصصی انواع پنکه، موتور کولر، بخاری برقی، آنتن و وسایل برقی
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            علاوه بر خرید کالا، کارگاه فنی شیاسی در نجف‌آباد مجهز به ابزار دقیق عیب‌یابی و قطعات یدکی اصلی جهت تعمیر و سرویس مطمئن با گارانتی کارکرد است.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/repair-service"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-2 hover-glow active:scale-95"
          >
            <span>ثبت آنلاین درخواست تعمیر</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 5 Interactive Repair Service Cards (Links to online request) */}
      <div className="relative z-10 flex overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {WORKSHOP_SERVICES.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={`/repair-service?service=${item.id}`}
              className={`group relative bg-slate-50 dark:bg-slate-850 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-750 transition-all duration-300 flex flex-col justify-between space-y-3 shadow-sm min-w-[240px] max-w-[260px] sm:min-w-0 sm:max-w-none shrink-0 snap-center hover:-translate-y-1.5 overflow-hidden ${item.hoverBorder} ${item.hoverShadow}`}
            >
              {/* Dynamic Aura Glow on Hover */}
              <div className={`absolute top-0 right-0 w-48 h-32 bg-gradient-to-br ${item.glowBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-tr-2xl blur-xl`} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${item.iconColor} flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 stroke-[2] transition-transform duration-300 group-hover:rotate-6" />
                  </div>
                  <span className="text-[10px] bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
                    {item.badge}
                  </span>
                </div>

                <h3 className={`font-extrabold text-sm text-slate-900 dark:text-white transition-colors ${item.accentText}`}>
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1.5 font-medium line-clamp-3">
                  {item.desc}
                </p>
              </div>

              <div className="relative z-10 pt-3 border-t border-slate-200/80 dark:border-slate-750 flex items-center justify-between text-[11px]">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>تست کارکرد</span>
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-bold text-[10px] bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                  کارگاه نجف‌آباد
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 dark:text-slate-300 gap-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-medium">پذیرش حضوری در فروشگاه نجف‌آباد + امکان ارسال با پیک اسنپ</span>
        </div>
        <a
          href="tel:09162665884"
          className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-bold flex items-center gap-1.5 font-mono"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>تماس مستقیم کارگاه: ۰۹۱۶-۲۶۶-۵۸۸۴</span>
        </a>
      </div>
    </section>
  );
}
