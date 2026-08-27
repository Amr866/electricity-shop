"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Clock, ArrowLeft, Sparkles, Lightbulb } from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

export function KnowledgeBaseSection() {
  const articles = [
    {
      id: 1,
      title: "چراغ سقفی ارزان و مدرن مناسب نورپردازی منازل و دفاتر",
      category: "نورپردازی و روشنایی",
      readTime: "۴ دقیقه مطالعه",
      date: "۱۴۰۳/۰۶/۱۵",
      image:
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80",
      slug: "modern-ceiling-lights-guide",
    },
    {
      id: 2,
      title: "چه مکان‌هایی را در خانه و نما می‌توان نور مخفی و لاین نوری کار کرد؟",
      category: "طراحی نورپردازی",
      readTime: "۳ دقیقه مطالعه",
      date: "۱۴۰۳/۰۶/۱۰",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      slug: "hidden-lighting-places",
    },
    {
      id: 3,
      title: "راهنمای عیب‌یابی و سرویس دوره‌ای الکتروموتور و پمپ کولر آبی",
      category: "سرویس و تعمیرات",
      readTime: "۵ دقیقه مطالعه",
      date: "۱۴۰۳/۰۶/۰۲",
      image:
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      slug: "cooler-motor-service-guide",
    },
  ];

  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              دانستنی‌های روشنایی و تعمیرات لوازم برقی
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            مقاله‌های تخصصی درباره برق ساختمان، نگهداری لوازم خانگی، سیستم‌های سرمایشی و گرمایشی
          </p>
        </div>

        <Link
          href="/products"
          className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1"
        >
          <span>مشاهده همه آموزش‌ها</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {articles.map((art) => (
          <div
            key={art.id}
            className="group rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 overflow-hidden flex flex-col justify-between hover:border-amber-400/80 dark:hover:border-amber-500/80 transition-all hover:shadow-md"
          >
            <div>
              <div className="aspect-video w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-4 space-y-2.5">
                <span className="inline-block bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                  {art.category}
                </span>

                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                  {art.title}
                </h4>
              </div>
            </div>

            <div className="p-4 pt-0 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-700/60 mt-3 pt-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                {art.readTime}
              </span>
              <span className="font-mono text-[10px]">{toPersianDigits(art.date)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
