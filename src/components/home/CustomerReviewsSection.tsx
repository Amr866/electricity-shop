"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Star, Quote, ArrowLeft, CheckCircle2, ShieldCheck, Wrench, RotateCcw, MessageSquarePlus } from "lucide-react";

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

export function CustomerReviewsSection({ reviews = [] }: CustomerReviewsSectionProps) {
  const hasRealReviews = reviews && reviews.length > 0;

  return (
    <section className="py-4 sm:py-6" aria-label="بخش نظرات مشتریان و تعهدات فروشگاه">
      {hasRealReviews ? (
        <>
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

          {/* Real Customer Reviews Grid */}
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 sm:grid sm:grid-cols-3 gap-3.5 sm:gap-6">
            {reviews.map((rev) => (
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
                        <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {rev.authorName}
                        </h3>
                        {rev.city && (
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                            {rev.city}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-0.5 text-amber-400 group-hover:scale-105 transition-transform" aria-label={`امتیاز ${rev.rating || 5} از ۵ ستاره`}>
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
                      className="flex items-center justify-between w-full group/link hover:text-amber-600 dark:hover:text-amber-400 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none rounded-lg"
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
        </>
      ) : (
        /* Honest Store Assurances & Review Invitation */
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-base sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <span>تعهدات و تضمین‌های خدمات شیاسی</span>
              <ShieldCheck className="w-5 h-5 text-amber-500" />
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              مرکز تخصصی لوازم برقی و کارگاه سیم‌پیچی و تعمیرات در نجف‌آباد اصفهان
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                  تست فنی در کارگاه نجف‌آباد
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                  آزمایش سلامت الکتروموتورها، پمپ‌های آب، پنکه‌ها و بردهای الکترونیکی پیش از تحویل به مشتری در محل کارگاه.
                </p>
              </div>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                تحویل حضوری یا ارسال با پیک
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                  ضمانت ۱۰۰٪ مس و اصالت کالا
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                  توزیع مستقیم سیم و کابل استاندارد تمام مس بدون آلیاژ آلومینیوم (CCA)، به همراه گارانتی رسمی شرکت‌های تولیدی.
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                اصالت معتبر و فاکتور پروژه‌ای
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                  مهلت تست و مشاوره فنی
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                  امکان ارجاع کالا مطابق با شرایط بازگشت وجه، همراه با راهنمایی فنی متخصصان جهت انتخاب بهترین کابل و قطعه.
                </p>
              </div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                پشتیبانی تلفنی و حضوری
              </span>
            </div>
          </div>

          {/* Invitation Banner */}
          <div className="bg-slate-100 dark:bg-slate-850 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-750 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                <MessageSquarePlus className="w-4.5 h-4.5" />
              </div>
              <div>
                <strong className="text-xs sm:text-sm text-slate-900 dark:text-white block">
                  تجربه خرید یا دریافت خدمات خود را ثبت کنید
                </strong>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  نظرات و دیدگاه‌های خریداران گرامی پس از بررسی در این بخش نمایش داده خواهد شد.
                </span>
              </div>
            </div>

            <Link
              href="/contact"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 shrink-0 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
            >
              تماس و ثبت نظر یا استعلام
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
