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
      title: "راهنمای راه‌اندازی سنسورها و ماژول‌های ESP32 در پروژه‌های اینترنت اشیاء",
      category: "الکترونیک و آردوینو",
      readTime: "۵ دقیقه مطالعه",
      date: "۱۴۰۳/۰۶/۰۲",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
      slug: "esp32-iot-guide",
    },
  ];

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              دانستنی‌های روشنایی و الکترونیک
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            مقاله‌های تخصصی درباره برق ساختمان، طراحی نورپردازی، سیستم‌های خورشیدی و بردهای آردوینو
          </p>
        </div>

        <Link
          href="/products"
          className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
        >
          <span>مشاهده همه آموزش‌ها</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {articles.map((art) => (
          <div
            key={art.id}
            className="group rounded-2xl bg-slate-50 border border-slate-200/80 overflow-hidden flex flex-col justify-between hover:border-amber-400/80 transition-all hover:shadow-md"
          >
            <div>
              <div className="aspect-video w-full overflow-hidden bg-slate-200">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-4 space-y-2.5">
                <span className="inline-block bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                  {art.category}
                </span>

                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                  {art.title}
                </h4>
              </div>
            </div>

            <div className="p-4 pt-0 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 mt-3 pt-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
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
