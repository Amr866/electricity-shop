"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowLeft, Lightbulb } from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

// 1. Modular Blog Articles Data (Extracted outside render function)
const BLOG_ARTICLES = [
  {
    id: 1,
    title: "چراغ سقفی ارزان و مدرن مناسب نورپردازی منازل و دفاتر",
    category: "نورپردازی و روشنایی",
    readTime: "۴ دقیقه مطالعه",
    date: "۱۴۰۳/۰۶/۱۵",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80",
    slug: "modern-ceiling-lights-guide",
    badgeColor: "bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  },
  {
    id: 2,
    title: "چه مکان‌هایی را در خانه و نما می‌توان نور مخفی و لاین نوری کار کرد؟",
    category: "طراحی لاین نوری",
    readTime: "۳ دقیقه مطالعه",
    date: "۱۴۰۳/۰۶/۱۰",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    slug: "hidden-lighting-places",
    badgeColor: "bg-cyan-100 dark:bg-cyan-950/80 text-cyan-900 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
  },
  {
    id: 3,
    title: "راهنمای عیب‌یابی و سرویس دوره‌ای الکتروموتور و پمپ کولر آبی",
    category: "سرویس و تعمیرات",
    readTime: "۵ دقیقه مطالعه",
    date: "۱۴۰۳/۰۶/۰۲",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    slug: "cooler-motor-service-guide",
    badgeColor: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
];

export function KnowledgeBaseSection() {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-6 transition-colors duration-200">
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
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            مقاله‌های تخصصی درباره برق ساختمان، نگهداری لوازم خانگی، سیستم‌های سرمایشی و گرمایشی
          </p>
        </div>

        {/* Fixed Link to Blog Archive with Spring Arrow Bounce */}
        <Link
          href="/blog"
          className="group text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 transition-colors"
        >
          <span>مشاهده همه آموزش‌ها</span>
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-200" />
        </Link>
      </div>

      {/* 3 Articles Grid (Locked Vertical Alignment & 60fps Image Zoom) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5 items-stretch">
        {BLOG_ARTICLES.map((art) => (
          <Link
            key={art.id}
            href={`/blog/${art.slug}`}
            className="group rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 overflow-hidden flex flex-row md:flex-col justify-between hover:border-amber-400/80 dark:hover:border-amber-400/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 p-2.5 sm:p-0 h-full active:scale-98"
          >
            {/* Image Container: Next.js Optimized Image with 60fps Smooth Zoom */}
            <div className="relative w-24 h-24 sm:w-full sm:h-auto sm:aspect-video overflow-hidden bg-slate-200 dark:bg-slate-800 rounded-xl sm:rounded-none shrink-0">
              <Image
                src={art.image}
                alt={art.title}
                fill
                sizes="(max-width: 640px) 100px, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                loading="lazy"
              />
            </div>

            {/* Content Details (Locked Flexbox Alignment) */}
            <div className="flex-1 flex flex-col justify-between p-1 sm:p-4 mr-2.5 sm:mr-0 min-w-0">
              <div className="space-y-1.5 sm:space-y-2">
                <span className={`inline-block text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded border ${art.badgeColor}`}>
                  {art.category}
                </span>

                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 h-8 sm:h-10">
                  {art.title}
                </h4>
              </div>

              {/* Metadata Row: Locked to Bottom with mt-auto */}
              <div className="pt-2 sm:pt-3 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-700/60 mt-auto">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{art.readTime}</span>
                </span>
                <span className="font-mono text-[10px]">{toPersianDigits(art.date)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
