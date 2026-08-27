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

export function RepairWorkshopSection() {
  const services = [
    {
      title: "تعمیر انواع پنکه",
      desc: "تعویض بوش، رفع صدای موتور، سیم‌پیچی، تعویض خازن، کلید و ریموت کنترل",
      icon: Fan,
      badge: "پارس خزر • سانی",
      color: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
    },
    {
      title: "سرویس و موتور کولر",
      desc: "تعویض پلاتین و کلاچ، تعویض بوش برنجی، تراشکاری شفت، خازن و پمپ آب",
      icon: Sun,
      badge: "موتوژن • کیا",
      color: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    },
    {
      title: "بخاری برقی و هیتر",
      desc: "تعویض المنت شیشه‌ای کوارتز و سرامیکی، کلیدهای نسوز، فن و ترموستات ایمن",
      icon: Flame,
      badge: "اخوان • ارشیا",
      color: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    },
    {
      title: "آنتن و قطعات دیجیتال",
      desc: "تعمیر بوستر آنتن، منبع تغذیه، بردهای تغذیه سوئیچینگ و تقویت‌کننده‌ها",
      icon: Tv,
      badge: "هانی • سیماران",
      color: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    },
    {
      title: "سایر لوازم برقی",
      desc: "عیب‌یابی چای‌ساز، جاروبرقی، اتو، محافظ برق، سشوار و دریل کارگاهی",
      icon: Plug,
      badge: "خانگی و صنعتی",
      color: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    },
  ];

  return (
    <section className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-2 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
            <Wrench className="w-4 h-4" />
            <span>مرکز تخصصی تعمیرات و خدمات فنی شیاسی (نجف‌آباد)</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
            تعمیرات تخصصی انواع پنکه، موتور کولر، بخاری برقی، آنتن و وسایل برقی
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            علاوه بر خرید کالا، کارگاه فنی شیاسی در نجف‌آباد مجهز به ابزار دقیق عیب‌یابی و قطعات یدکی اصلی جهت تعمیر و سرویس مطمئن با گارانتی کارکرد است.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/repair-service"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-2 hover-glow"
          >
            <span>ثبت آنلاین درخواست تعمیر</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 5 Repair Service Cards */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {services.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-slate-850/90 rounded-2xl p-4 sm:p-5 border border-slate-750 hover:border-amber-400/60 transition-all flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-200 font-bold px-2 py-0.5 rounded border border-slate-700">
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-white">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-1.5 font-medium">{item.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-750 flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>تست کارکرد</span>
                </span>
                <span className="text-slate-300 font-bold text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  کارگاه نجف‌آباد
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-3 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">پذیرش حضوری در فروشگاه نجف‌آباد + امکان ارسال با پیک اسنپ</span>
        </div>
        <a
          href="tel:09162665884"
          className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 font-mono"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>تماس مستقیم کارگاه: ۰۹۱۶-۲۶۶-۵۸۸۴</span>
        </a>
      </div>
    </section>
  );
}
