"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArticleData } from "@/data/articles";
import {
  Search,
  BookOpen,
  Clock,
  Calendar,
  Tag,
  ArrowLeft,
  Sparkles,
  Phone,
  MessageCircle,
  CheckCircle2,
  ChevronLeft
} from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

interface BlogClientProps {
  initialArticles: ArticleData[];
  categories: string[];
}

export function BlogClient({ initialArticles, categories }: BlogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    return initialArticles.filter((art) => {
      const matchCategory =
        selectedCategory === "همه" || art.category === selectedCategory;

      const matchTag =
        !selectedTag || art.tags.some((t) => t.includes(selectedTag));

      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        art.title.toLowerCase().includes(query) ||
        art.summary.toLowerCase().includes(query) ||
        art.tags.some((t) => t.toLowerCase().includes(query));

      return matchCategory && matchTag && matchSearch;
    });
  }, [initialArticles, searchQuery, selectedCategory, selectedTag]);

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Hero Promotional Header */}
      <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 p-6 sm:p-10 border border-slate-800 text-white overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>پایگاه دانش و آموزش تخصصی برق شیاسی (نجف‌آباد)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
            راهنمای جامع روشنایی، برق ساختمان و تعمیرات الکتروموتور
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            مجموعه مقالات کاربردی و کارشناسی با هدف انتخاب بهترین کالاها، کاهش مصرف انرژی، یادگیری استانداردهای نوین نورپردازی و عیب‌یابی لوازم خانگی به قلم متخصصان کارگاه شیاسی.
          </p>

          {/* Search Box inside Hero */}
          <div className="pt-2 max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در مقالات، مثلاً: لاین نوری، موتور موتوژن، پنل سقفی..."
                className="w-full bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm rounded-2xl pr-10 pl-4 py-3 focus:outline-hidden focus:border-amber-400 transition-colors shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-3 text-xs text-slate-400 hover:text-white"
                >
                  پاک‌کردن
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Filter & Active Tags */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedTag(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat && !selectedTag
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black scale-102"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Selected Tag Clear Badge */}
        {selectedTag && (
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span>فیلتر بر اساس تگ:</span>
            <span className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 px-2.5 py-1 rounded-lg border border-amber-300 font-bold">
              <span>#{selectedTag}</span>
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className="hover:text-red-500 font-black mr-1 cursor-pointer"
                title="حذف فیلتر تگ"
              >
                ×
              </button>
            </span>
          </div>
        )}
      </section>

      {/* 3. Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 space-y-4">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            مقاله‌ای با این مشخصات یافت نشد
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            می‌توانید کلمه جستجو را تغییر دهید یا فیلتر دسته‌بندی را روی «همه» بگذارید.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("همه");
              setSelectedTag(null);
            }}
            className="bg-amber-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl hover:bg-amber-400 transition-colors"
          >
            مشاهده همه مقالات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-400/80 dark:hover:border-amber-400/80 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image & Zoom */}
                <Link
                  href={`/blog/${art.slug}`}
                  className="block relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800"
                >
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-xs ${
                        art.badgeColor ||
                        "bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-200"
                      }`}
                    >
                      {art.category}
                    </span>
                  </div>
                </Link>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{art.readTime}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>{toPersianDigits(art.date)}</span>
                    </span>
                  </div>

                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
                    <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                  </h2>

                  <p className="text-xs text-slate-600 dark:text-slate-400 font-normal leading-relaxed line-clamp-3">
                    {art.summary}
                  </p>

                  {/* Tags Preview */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {art.tags.slice(0, 3).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSelectedTag(tag)}
                        className="text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300 px-2 py-0.5 rounded-md transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                    {art.tags.length > 3 && (
                      <span className="text-[10px] text-slate-400">
                        +{toPersianDigits(art.tags.length - 3)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Read More CTA Footer */}
              <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {art.author}
                </span>

                <Link
                  href={`/blog/${art.slug}`}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1 group/btn"
                >
                  <span>مطالعه کامل</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover/btn:-translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 4. Help & Consultation CTA Banner */}
      <section className="bg-gradient-to-r from-amber-500/10 via-slate-100 to-amber-500/10 dark:from-amber-500/5 dark:via-slate-900 dark:to-amber-500/5 border border-amber-300/40 dark:border-amber-500/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-right">
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            سوال فنی درباره خرید یا تعمیر لوازم برقی دارید؟
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            تیم کارشناسان شیاسی در نجف‌آباد و اصفهان آماده پاسخگویی، مشاوره خرید و خدمات تعمیرات هستند.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="tel:03142626116"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-5 py-3 rounded-2xl flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>تماس: ۰۳۱-۴۲۶۲۶۱۱۶</span>
          </a>

          <a
            href="https://wa.me/989136260072"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>مشاوره واتساپ: ۰۹۱۳۶۲۶۰۰۷۲</span>
          </a>
        </div>
      </section>
    </div>
  );
}
