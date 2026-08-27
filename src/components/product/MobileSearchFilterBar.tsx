"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Truck,
  Package,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

interface MobileSearchFilterBarProps {
  categories: Array<{ id: string; name: string; slug: string; _count: { products: number } }>;
  brands: string[];
  totalProductsCount: number;
}

export function MobileSearchFilterBar({
  categories,
  brands,
  totalProductsCount,
}: MobileSearchFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortModalOpen, setSortModalOpen] = useState(false);

  const currentSort = searchParams.get("sort") || "newest";
  const currentCategory = searchParams.get("category");
  const isFastDelivery = searchParams.get("fast") === "true";
  const isInStock = searchParams.get("instock") === "true";
  const currentBrand = searchParams.get("brand");

  // Count active filters
  let activeFiltersCount = 0;
  if (currentCategory) activeFiltersCount++;
  if (isFastDelivery) activeFiltersCount++;
  if (isInStock) activeFiltersCount++;
  if (currentBrand) activeFiltersCount++;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    } else {
      params.delete("q");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`${pathname}?${params.toString()}`);
  };

  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const sortOptions = [
    { key: "newest", label: "جدیدترین" },
    { key: "bestseller", label: "پرفروش‌ترین" },
    { key: "cheapest", label: "ارزان‌ترین" },
    { key: "expensive", label: "گران‌ترین" },
    { key: "rating", label: "محبوب‌ترین" },
  ];

  const currentSortLabel = sortOptions.find((s) => s.key === currentSort)?.label || "جدیدترین";

  return (
    <div className="lg:hidden space-y-2 mb-4">
      {/* 1. Mobile Search Header (Digikala Style) */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          aria-label="بازگشت"
          className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0 shadow-sm"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در بین کالاها..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs rounded-2xl pr-10 pl-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="پاک کردن متن جستجو"
              className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 absolute left-3 top-2.5 flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </form>
      </div>

      {/* 2. Action Filter Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {/* Sort Pill */}
        <button
          onClick={() => setSortModalOpen(true)}
          className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl shrink-0 font-medium shadow-sm active:scale-95"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" />
          <span>{currentSortLabel}</span>
        </button>

        {/* Filter Drawer Trigger Pill */}
        <button
          onClick={() => setFilterDrawerOpen(true)}
          className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-xl shrink-0 font-medium shadow-sm transition-colors active:scale-95 ${
            activeFiltersCount > 0
              ? "bg-amber-500 text-slate-950 border-amber-500 font-bold"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>فیلترها</span>
          {activeFiltersCount > 0 && (
            <span className="bg-slate-950 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {toPersianDigits(activeFiltersCount)}
            </span>
          )}
        </button>

        {/* Fast Delivery Quick Toggle Pill */}
        <button
          onClick={() => updateParam("fast", isFastDelivery ? undefined : "true")}
          className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-xl shrink-0 font-medium shadow-sm transition-colors active:scale-95 ${
            isFastDelivery
              ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>ارسال سریع</span>
        </button>

        {/* In-Stock Quick Toggle Pill */}
        <button
          onClick={() => updateParam("instock", isInStock ? undefined : "true")}
          className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-xl shrink-0 font-medium shadow-sm transition-colors active:scale-95 ${
            isInStock
              ? "bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-800 dark:text-blue-300 font-bold"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          <Package className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>فقط موجودی</span>
        </button>
      </div>

      {/* Sort Options Bottom Sheet Modal */}
      {sortModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl p-5 w-full max-w-md space-y-4 border-t border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-bottom duration-200 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="font-extrabold text-sm">مرتب‌سازی بر اساس</span>
              <button
                onClick={() => setSortModalOpen(false)}
                aria-label="بستن پنجره مرتب‌سازی"
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              {sortOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    updateParam("sort", opt.key);
                    setSortModalOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-colors ${
                    currentSort === opt.key
                      ? "bg-amber-500 text-slate-950"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{opt.label}</span>
                  {currentSort === opt.key && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters Full Drawer Modal */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto space-y-5 border-t border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-bottom duration-200 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <span className="font-extrabold text-sm">فیلترهای کالا</span>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                aria-label="بستن فیلترها"
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-400 block">دسته‌بندی کالا</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateParam("category", undefined)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center ${
                    !currentCategory
                      ? "bg-amber-500 text-slate-950 border-amber-500 shadow-sm"
                      : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  همه رسته‌ها
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateParam("category", cat.slug)}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-center truncate ${
                      currentCategory === cat.slug
                        ? "bg-amber-500 text-slate-950 border-amber-500 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            {brands.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-slate-400 block">برند تولیدکننده</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateParam("brand", undefined)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                      !currentBrand
                        ? "bg-amber-500 text-slate-950 border-amber-500"
                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    همه برندها
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => updateParam("brand", b)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                        currentBrand === b
                          ? "bg-amber-500 text-slate-950 border-amber-500"
                          : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit & Reset Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => router.push("/products")}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors"
              >
                حذف همه فیلترها
              </button>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition-colors shadow-md"
              >
                مشاهده {toPersianDigits(totalProductsCount)} کالا
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
