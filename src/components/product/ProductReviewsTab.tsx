"use client";

import React, { useState } from "react";
import { Star, Send, CheckCircle2, HelpCircle } from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

export interface ProductReviewItem {
  id?: string;
  authorName: string;
  rating: number;
  comment: string;
  city?: string | null;
  createdAt?: Date;
}

interface ProductReviewsTabProps {
  productId: string;
  initialReviews: ProductReviewItem[];
  defaultRating?: number;
}

export function ProductReviewsTab({
  productId,
  initialReviews,
  defaultRating = 4.9,
}: ProductReviewsTabProps) {
  const [reviewsList, setReviewsList] = useState<ProductReviewItem[]>(initialReviews || []);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerCity, setReviewerCity] = useState("نجف‌آباد");
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Real-time Rating Analytics Calculation
  const totalReviews = reviewsList.length;
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let ratingSum = 0;

  reviewsList.forEach((rev) => {
    const r = Math.min(Math.max(rev.rating || 5, 1), 5) as 1 | 2 | 3 | 4 | 5;
    ratingCounts[r] = (ratingCounts[r] || 0) + 1;
    ratingSum += r;
  });

  const averageRating = totalReviews > 0 ? (ratingSum / totalReviews).toFixed(1) : defaultRating.toFixed(1);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          authorName: reviewerName,
          city: reviewerCity,
          rating: reviewerRating,
          comment: reviewerComment,
        }),
      });

      if (res.ok) {
        setReviewSuccess(true);
        setReviewerName("");
        setReviewerComment("");
        setTimeout(() => setReviewSuccess(false), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div
      id="panel-reviews"
      role="tabpanel"
      aria-labelledby="tab-reviews"
      className="space-y-6 max-w-4xl animate-in fade-in zoom-in-98 duration-200"
    >
      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 bg-slate-50 dark:bg-slate-850 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-750 items-center">
        <div className="text-center sm:text-right space-y-1 sm:border-l sm:border-slate-200 dark:sm:border-slate-700 sm:pl-5">
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
            <bdi dir="ltr">{toPersianDigits(averageRating)}</bdi>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(Number(averageRating))
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300 dark:text-slate-600"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
            بر اساس {toPersianDigits(totalReviews)} نظر ثبت‌شده
          </span>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="sm:col-span-2 space-y-1.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingCounts[stars as keyof typeof ratingCounts] || 0;
            const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={stars} className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                <span className="w-12 text-[11px] font-bold shrink-0">{toPersianDigits(stars)} ستاره</span>
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-750 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-8 text-[10px] font-mono text-left shrink-0">
                  <bdi dir="ltr">{toPersianDigits(percent)}٪</bdi>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <div className="bg-slate-50 dark:bg-slate-850 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-750">
        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
          <Star className="w-4 h-4 text-amber-500" />
          <span>ثبت دیدگاه یا پرسش درباره این کالا</span>
        </h4>

        {reviewSuccess ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>دیدگاه شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="مثال: علی رضایی"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  شهر محل سکونت
                </label>
                <input
                  type="text"
                  value={reviewerCity}
                  onChange={(e) => setReviewerCity(e.target.value)}
                  placeholder="نجف‌آباد"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  امتیاز شما به کالا
                </label>
                <select
                  value={reviewerRating}
                  onChange={(e) => setReviewerRating(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (عالی - ۵ از ۵)</option>
                  <option value={4}>⭐⭐⭐⭐ (خوب - ۴ از ۵)</option>
                  <option value={3}>⭐⭐⭐ (متوسط - ۳ از ۵)</option>
                  <option value={2}>⭐⭐ (ضعیف - ۲ از ۵)</option>
                  <option value={1}>⭐ (خیلی ضعیف - ۱ از ۵)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                متن دیدگاه یا نقد و بررسی
              </label>
              <textarea
                required
                rows={3}
                value={reviewerComment}
                onChange={(e) => setReviewerComment(e.target.value)}
                placeholder="کیفیت ساخت، سهولت در استفاده و عملکرد کالا را بنویسید..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 hover-glow active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingReview ? "در حال ارسال..." : "ثبت دیدگاه"}</span>
            </button>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {reviewsList.length > 0 ? (
          reviewsList.map((rev, idx) => (
            <div
              key={rev.id || idx}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                    {rev.authorName?.slice(0, 1) || "ک"}
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 dark:text-white block">
                      {rev.authorName}
                    </strong>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {rev.city || "نجف‌آباد"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-justify font-medium">
                {rev.comment}
              </p>
            </div>
          ))
        ) : (
          <div className="p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2 bg-slate-50/50 dark:bg-slate-850/50">
            <HelpCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              هنوز دیدگاهی برای این محصول ثبت نشده است.
            </p>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              تجربه نصب یا سوال فنی خود را در فرم بالا بنویسید تا کارشناسان کارگاه شیاسی پاسخ دهند.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
