"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MessageSquare,
  CheckCircle2,
  XCircle,
  Trash2,
  Star,
  Clock,
  Search,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Check,
  AlertCircle,
  Filter,
} from "lucide-react";
import { toPersianDigits } from "@/lib/utils";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";

export interface AdminReviewItem {
  id: string;
  authorName: string;
  city: string | null;
  rating: number;
  comment: string;
  isVerified: boolean;
  productId: string;
  createdAt: string | Date;
  product: {
    id: string;
    name: string;
    slug: string;
    rating: number;
    reviewCount: number;
    images?: { url: string }[];
  };
}

interface ReviewsAdminClientProps {
  initialReviews: AdminReviewItem[];
  initialStats: {
    total: number;
    pending: number;
    verified: number;
  };
  initialProductId?: string;
}

export function ReviewsAdminClient({
  initialReviews,
  initialStats,
  initialProductId,
}: ReviewsAdminClientProps) {
  const [reviews, setReviews] = useState<AdminReviewItem[]>(initialReviews);
  const [stats, setStats] = useState(initialStats);
  const [activeTab, setActiveTab] = useState<"pending" | "verified" | "all">(
    initialStats.pending > 0 ? "pending" : "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(
    initialProductId
  );
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modal State for Delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<AdminReviewItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Selected for Bulk Actions
  const [selectedReviewIds, setSelectedReviewIds] = useState<string[]>([]);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter((rev) => {
      // Tab filter
      if (activeTab === "pending" && rev.isVerified) return false;
      if (activeTab === "verified" && !rev.isVerified) return false;

      // Product filter
      if (selectedProductId && rev.productId !== selectedProductId) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesAuthor = rev.authorName.toLowerCase().includes(q);
        const matchesComment = rev.comment.toLowerCase().includes(q);
        const matchesCity = rev.city ? rev.city.toLowerCase().includes(q) : false;
        const matchesProduct = rev.product?.name.toLowerCase().includes(q);
        if (!matchesAuthor && !matchesComment && !matchesCity && !matchesProduct) {
          return false;
        }
      }

      return true;
    });
  }, [reviews, activeTab, selectedProductId, searchQuery]);

  // Moderate review (Approve or Unpublish)
  const handleModerate = async (reviewId: string, newVerifiedStatus: boolean) => {
    setProcessingId(reviewId);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId,
          isVerified: newVerifiedStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در ویرایش نظر");

      // Update state
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                isVerified: newVerifiedStatus,
                product: data.product
                  ? {
                      ...r.product,
                      rating: data.product.rating,
                      reviewCount: data.product.reviewCount,
                    }
                  : r.product,
              }
            : r
        )
      );

      // Update stats
      setStats((prev) => ({
        ...prev,
        pending: newVerifiedStatus ? Math.max(0, prev.pending - 1) : prev.pending + 1,
        verified: newVerifiedStatus ? prev.verified + 1 : Math.max(0, prev.verified - 1),
      }));

      showNotification(
        newVerifiedStatus
          ? "دیدگاه با موفقیت تایید و در سایت منتشر شد."
          : "انتشار دیدگاه لغو شد."
      );
    } catch (err: any) {
      showNotification(err.message || "خطا در تغییر وضعیت نظر", "error");
    } finally {
      setProcessingId(null);
    }
  };

  // Delete Single Review
  const confirmDeleteSingle = async () => {
    if (!reviewToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: reviewToDelete.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در حذف نظر");

      setReviews((prev) => prev.filter((r) => r.id !== reviewToDelete.id));
      setSelectedReviewIds((prev) => prev.filter((id) => id !== reviewToDelete.id));

      setStats((prev) => ({
        total: Math.max(0, prev.total - 1),
        pending: reviewToDelete.isVerified ? prev.pending : Math.max(0, prev.pending - 1),
        verified: reviewToDelete.isVerified ? Math.max(0, prev.verified - 1) : prev.verified,
      }));

      showNotification("دیدگاه مورد نظر با موفقیت حذف شد.");
      setDeleteModalOpen(false);
      setReviewToDelete(null);
    } catch (err: any) {
      showNotification(err.message || "خطا در حذف نظر", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Delete Bulk Reviews
  const confirmDeleteBulk = async () => {
    if (selectedReviewIds.length === 0) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewIds: selectedReviewIds }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در حذف گروهی نظرات");

      const deletedItems = reviews.filter((r) => selectedReviewIds.includes(r.id));
      const deletedPending = deletedItems.filter((r) => !r.isVerified).length;
      const deletedVerified = deletedItems.filter((r) => r.isVerified).length;

      setReviews((prev) => prev.filter((r) => !selectedReviewIds.includes(r.id)));
      setSelectedReviewIds([]);

      setStats((prev) => ({
        total: Math.max(0, prev.total - deletedItems.length),
        pending: Math.max(0, prev.pending - deletedPending),
        verified: Math.max(0, prev.verified - deletedVerified),
      }));

      showNotification(`${deletedItems.length} نظر با موفقیت حذف شدند.`);
      setBulkDeleteModalOpen(false);
    } catch (err: any) {
      showNotification(err.message || "خطا در حذف گروهی نظرات", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedReviewIds.length === filteredReviews.length) {
      setSelectedReviewIds([]);
    } else {
      setSelectedReviewIds(filteredReviews.map((r) => r.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedReviewIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const activeProduct = selectedProductId
    ? reviews.find((r) => r.productId === selectedProductId)?.product
    : null;

  return (
    <div className="space-y-6 pb-28 sm:pb-10">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
            notification.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-rose-600 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                مدیریت نظرات و دیدگاه‌ها
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                بررسی کیفی، تایید انتشار، و حذف نظرات ثبت‌شده کاربران
              </p>
            </div>
          </div>
        </div>

        {/* Selected Product Filter Badge */}
        {selectedProductId && (
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700/60 px-3 py-1.5 rounded-2xl text-xs text-amber-900 dark:text-amber-200">
            <Filter className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-bold truncate max-w-[200px]">
              محصول: {activeProduct?.name || selectedProductId}
            </span>
            <button
              onClick={() => setSelectedProductId(undefined)}
              className="p-1 hover:bg-amber-200/60 dark:hover:bg-amber-800 rounded-lg text-amber-700 dark:text-amber-300 transition-colors"
              title="نمایش نظرات همه محصولات"
              aria-label="نمایش نظرات همه محصولات"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveTab("all")}
          className={`cursor-pointer bg-white dark:bg-slate-900 p-4 rounded-2xl border transition-all ${
            activeTab === "all"
              ? "border-amber-500 ring-2 ring-amber-500/20 shadow-md"
              : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              کل نظرات
            </span>
            <MessageSquare className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white font-mono">
            {toPersianDigits(stats.total)}
          </div>
        </div>

        <div
          onClick={() => setActiveTab("pending")}
          className={`cursor-pointer bg-white dark:bg-slate-900 p-4 rounded-2xl border transition-all ${
            activeTab === "pending"
              ? "border-amber-500 ring-2 ring-amber-500/20 shadow-md"
              : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
              در انتظار بررسی
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {toPersianDigits(stats.pending)}
            </span>
            {stats.pending > 0 && (
              <span className="text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold animate-pulse">
                نیازمند اقدام
              </span>
            )}
          </div>
        </div>

        <div
          onClick={() => setActiveTab("verified")}
          className={`cursor-pointer bg-white dark:bg-slate-900 p-4 rounded-2xl border transition-all ${
            activeTab === "verified"
              ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
              : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              تایید و منتشر شده
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {toPersianDigits(stats.verified)}
          </div>
        </div>
      </div>

      {/* Control Bar: Filter Tabs & Search */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "pending"
                ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>در انتظار بررسی ({toPersianDigits(stats.pending)})</span>
          </button>

          <button
            onClick={() => setActiveTab("verified")}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "verified"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>تایید شده‌ها ({toPersianDigits(stats.verified)})</span>
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "all"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>همه ({toPersianDigits(stats.total)})</span>
          </button>
        </div>

        {/* Search & Bulk Trigger */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="جستجو در نظرات، نام کاربر، محصول..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl pr-9 pl-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                title="پاک کردن متن جستجو"
                aria-label="پاک کردن متن جستجو"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {selectedReviewIds.length > 0 && (
            <button
              onClick={() => setBulkDeleteModalOpen(true)}
              className="bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-300/60 dark:border-rose-800 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف انتخابی ({toPersianDigits(selectedReviewIds.length)})</span>
            </button>
          )}
        </div>
      </div>

      {/* Reviews Table / Card List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
        {filteredReviews.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {/* Table Header Bar */}
            <div className="p-3 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={
                    filteredReviews.length > 0 &&
                    selectedReviewIds.length === filteredReviews.length
                  }
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
                  title="انتخاب همه"
                />
                <span>نمایش {toPersianDigits(filteredReviews.length)} دیدگاه</span>
              </div>
            </div>

            {/* List of Review Cards */}
            {filteredReviews.map((rev) => {
              const isProcessing = processingId === rev.id;
              const isSelected = selectedReviewIds.includes(rev.id);

              return (
                <div
                  key={rev.id}
                  className={`p-4 sm:p-5 transition-colors ${
                    isSelected
                      ? "bg-amber-50/40 dark:bg-amber-950/20"
                      : "hover:bg-slate-50/70 dark:hover:bg-slate-850/60"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Checkbox & Review Details */}
                    <div className="flex items-start gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(rev.id)}
                        className="w-4 h-4 mt-1 rounded text-amber-500 focus:ring-amber-500 cursor-pointer shrink-0"
                      />

                      <div className="space-y-2 flex-1">
                        {/* Author, City, Rating, Date */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <strong className="text-sm font-extrabold text-slate-900 dark:text-white">
                            {rev.authorName}
                          </strong>

                          {rev.city && (
                            <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md font-medium">
                              {rev.city}
                            </span>
                          )}

                          {/* Star Rating */}
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < (rev.rating || 5)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-200 dark:text-slate-700"
                                }`}
                              />
                            ))}
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mr-1 font-mono">
                              <bdi dir="rtl">({toPersianDigits(rev.rating)} از ۵)</bdi>
                            </span>
                          </div>

                          {/* Status Badge */}
                          {rev.isVerified ? (
                            <span className="text-[11px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border border-emerald-200/80 dark:border-emerald-800">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>تایید و منتشر شده</span>
                            </span>
                          ) : (
                            <span className="text-[11px] bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border border-amber-300/80 dark:border-amber-700">
                              <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                              <span>در انتظار بررسی</span>
                            </span>
                          )}
                        </div>

                        {/* Comment text */}
                        <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {rev.comment}
                        </div>

                        {/* Associated Product Link */}
                        {rev.product && (
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                            <span>محصول:</span>
                            <Link
                              href={`/products/${rev.product.slug}`}
                              target="_blank"
                              className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                            >
                              <span>{rev.product.name}</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                            <span className="text-[11px] text-slate-400">
                              <bdi dir="rtl">(میانگین فعلی: {toPersianDigits(rev.product.rating || 5)} - {toPersianDigits(rev.product.reviewCount || 0)} نظر)</bdi>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end lg:self-start pt-2 lg:pt-0">
                      {rev.isVerified ? (
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleModerate(rev.id, false)}
                          className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                          title="لغو انتشار نظر و کسر از میانگین امتیاز کالا"
                        >
                          <XCircle className="w-3.5 h-3.5 text-slate-500" />
                          <span>لغو انتشار</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleModerate(rev.id, true)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                          title="تایید دیدگاه و محاسبه در امتیاز کالا"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>تایید و انتشار</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setReviewToDelete(rev);
                          setDeleteModalOpen(true);
                        }}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                        title="حذف دائمی این دیدگاه"
                        aria-label="حذف دائمی این دیدگاه"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              هیچ دیدگاهی در این وضعیت یافت نشد
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              نظرات جدید ارسال‌شده توسط خریداران در بخش «در انتظار بررسی» برای تایید مدیریت نمایش داده می‌شوند.
            </p>
          </div>
        )}
      </div>

      {/* Friction Modal: Single Review Delete */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setReviewToDelete(null);
        }}
        onConfirm={confirmDeleteSingle}
        title="حذف دیدگاه کاربر"
        description={`آیا از حذف دیدگاه «${reviewToDelete?.authorName || "کاربر"}» برای محصول «${reviewToDelete?.product?.name || ""}» اطمینان دارید؟ امتیاز محصول بلافاصله به‌روزرسانی خواهد شد.`}
        itemCount={1}
        itemType="دیدگاه"
        isPurge={true}
        isLoading={isDeleting}
      />

      {/* Friction Modal: Bulk Reviews Delete */}
      <ConfirmDeleteModal
        isOpen={bulkDeleteModalOpen}
        onClose={() => setBulkDeleteModalOpen(false)}
        onConfirm={confirmDeleteBulk}
        title="حذف گروهی نظرات کاربران"
        description={`شما در حال حذف ${selectedReviewIds.length} دیدگاه انتخابی هستید. امتیاز تمامی محصولات وابسته به‌صورت خودکار مجدداً محاسبه خواهد شد.`}
        itemCount={selectedReviewIds.length}
        itemType="دیدگاه"
        isPurge={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
