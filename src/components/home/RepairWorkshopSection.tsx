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
  Clock,
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
      badge: "پارس خزر، سانی، تکنو",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "سرویس و موتور کولر آبی",
      desc: "تعویض پلاتین و کلاچ، تعویض بوش برنجی، تراشکاری شفت، خازن و پمپ آب",
      icon: Sun,
      badge: "موتوژن، الکتروژن، کیا",
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      title: "تعمیر بخاری برقی و هیتر",
      desc: "تعویض المنت شیشه‌ای کوارتز و سرامیکی، کلیدهای نسوز، فن و ترموستات ایمن",
      icon: Flame,
      badge: "اخوان، ارشیا، پارس کوشان",
      color: "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      title: "تعمیر آنتن و بردهای الکترونیک",
      desc: "تعمیر بوستر آنتن، منبع تغذیه، بردهای تغذیه سوئیچینگ و دیجیتال",
      icon: Tv,
      badge: "هانی، سیماران، فراز",
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      title: "تعمیر سایر وسایل برقی (غیره)",
      desc: "عیب‌یابی چای‌ساز، جاروبرقی، اتو، محافظ برق، سشوار، دریل و لوازم خانگی",
      icon: Plug,
      badge: "خانگی، کارگاهی و متفرقه",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
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
            تعمیرات تخصصی انواع پنکه، موتور کولر، بخاری برقی، آنتن و سایر وسایل برقی
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            علاوه بر خرید کالا، کارگاه فنی فروشگاه شیاسی در نجف‌آباد مجهز به ابزار دقیق عیب‌یابی و قطعات یدکی اصلی جهت تعمیر و سرویس مطمئن انواع لوازم برقی خانگی و کارگاهی شماست.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/repair-service"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-2"
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
              className="bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-700/80 hover:border-amber-400/60 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-2xl ${item.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-[10px] bg-slate-700 text-slate-300 font-semibold px-2 py-0.5 rounded truncate max-w-[110px]">
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-white">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-1.5">{item.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-amber-400 font-bold">
                <span>تست در کارگاه</span>
                <span className="text-slate-400 text-[10px]">نجف‌آباد</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>پذیرش حضوری در فروشگاه نجف‌آباد + امکان ارسال با پیک اسنپ</span>
        </div>
        <a
          href="tel:09162665884"
          className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>تماس مستقیم با واحد تعمیرات: ۰۹۱۶-۲۶۶-۵۸۸۴</span>
        </a>
      </div>
    </section>
  );
}
