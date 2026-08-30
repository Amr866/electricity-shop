"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Star, Quote, ArrowLeft, CheckCircle2 } from "lucide-react";

interface ReviewItem {
  id: string;
  authorName: string;
  comment: string;
  rating?: number;
  city?: string | null;
  product?: {
    name: string;
    slug: string;
  } | null;
}

interface CustomerReviewsSectionProps {
  reviews?: ReviewItem[];
}

const FALLBACK_REVIEWS: ReviewItem[] = [
  {
    id: "fb-1",
    authorName: "حاج احمد امینی",
    city: "نجف‌آباد",
    rating: 5,
    comment: "پنکه ایستاده ۵ پره پارس خزر عالی و بی‌صدا، تحویل فوری در نجف‌آباد با اخلاق عالی مدیریت شیاسی.",
    product: {
      name: "پنکه ایستاده ۵ پره ریموت‌دار پارس خزر",
      slug: "pars-khazar-fan-5blade",
    },
  },
  {
    id: "fb-2",
    authorName: "مهندس رضا کریمی",
    city: "اصفهان (پیمانکار برق)",
    rating: 5,
    comment: "برای پروژه ساختمانی کلاف‌های سیم تمام مس البرز و فیوز دنا سفارش دادم؛ مس ۱۰۰٪ خالص و ارسال بسیار سریع بود.",
    product: {
      name: "سیم افشان ۲.۵ تمام مس البرز الکتریک",
      slug: "wire-2-5",
    },
  },
  {
    id: "fb-3",
    authorName: "علیرضا یوسفی",
    city: "ویلاشهر نجف‌آباد",
    rating: 5,
    comment: "موتور کولر آبی ۳/۴ موتوژن رو حضوری در کارگاه تست کردند و تحویل دادند. گارانتی معتبر و قیمت بسیار منصفانه.",
    product: {
      name: "موتور کولر آبی ۳/۴ اسب موتوژن تبریز",
      slug: "motogen-cooler-motor-3-4",
    },
  },
];

export function CustomerReviewsSection({ reviews = [] }: CustomerReviewsSectionProps) {
  const displayReviews = reviews && reviews.length > 0 ? reviews : FALLBACK_REVIEWS;

  return (
    <section className="py-4 sm:py-6">
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-5 sm:mb-8">
        <h2 className="text-base sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <span>نظرات مشتریان و خریداران</span>
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          تجربه خرید و استفاده از خدمات فنی و تعمیرات فروشگاه شیاسی
        </p>
      </div>

      {/* Reviews: Horizontal Touch Carousel on Mobile, 3-col Grid on Desktop */}
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 sm:grid sm:grid-cols-3 gap-3.5 sm:gap-6">
        {displayReviews.map((rev) => (
          <div
            key={rev.id}
            className="group relative bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-amber-400/80 dark:hover:border-amber-400/80 hover:shadow-xl hover:-translate-y-1.5 min-w-[270px] max-w-[290px] sm:min-w-0 sm:max-w-none shrink-0 snap-center overflow-hidden"
          >
            {/* Ambient Background Watermark Quote */}
            <div className="absolute top-3 left-3 text-slate-100 dark:text-slate-800/40 pointer-events-none group-hover:text-amber-500/10 transition-colors duration-300">
              <Quote className="w-16 h-16 stroke-[1.5]" />
            </div>

            <div className="space-y-3 relative z-10">
              {/* Header: Avatar, Name, Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-md shadow-amber-500/20 group-hover:scale-108 transition-transform duration-300">
                    {rev.authorName.slice(0, 1)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {rev.authorName}
                    </h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                      {rev.city || "نجف‌آباد"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-0.5 text-amber-400 group-hover:scale-105 transition-transform">
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {rev.product && (
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[9px] bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>خرید تایید شده</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Comment text */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-justify font-medium pt-1">
                «{rev.comment}»
              </p>
            </div>

            {/* Product Link Footer */}
            {rev.product && (
              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-medium relative z-10">
                <Link
                  href={`/products/${rev.product.slug}`}
                  className="flex items-center justify-between w-full group/link hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  <span className="truncate max-w-[220px]">
                    کالا: <strong className="font-bold text-slate-800 dark:text-slate-200 group-hover/link:text-amber-600 dark:group-hover/link:text-amber-400 transition-colors">{rev.product.name}</strong>
                  </span>
                  <ArrowLeft className="w-3 h-3 text-slate-400 group-hover/link:-translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
