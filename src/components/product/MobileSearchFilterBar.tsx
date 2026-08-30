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
  ChevronDown,
} from "lucide-react";
import { toPersianDigits, formatToman } from "@/lib/utils";

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

  // Accordion open/close states for mobile drawer
  const [priceOpen, setPriceOpen] = useState(true);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [brandsOpen, setBrandsOpen] = useState(true);

  const currentSort = searchParams.get("sort") || "newest";
  const currentCategory = searchParams.get("category");
  const isFastDelivery = searchParams.get("fast") === "true";
  const isInStock = searchParams.get("instock") === "true";
  const brandParam = searchParams.get("brand");
  const selectedBrands = brandParam ? brandParam.split(",").map((b) => b.trim()).filter(Boolean) : [];
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const currentPageSize = Number(searchParams.get("pageSize")) || 12;

  const [mobileMinPrice, setMobileMinPrice] = useState(minPriceParam);
  const [mobileMaxPrice, setMobileMaxPrice] = useState(maxPriceParam);

  // Count active filters
  let activeFiltersCount = 0;
  if (currentCategory) activeFiltersCount++;
  if (isFastDelivery) activeFiltersCount++;
  if (isInStock) activeFiltersCount++;
  if (selectedBrands.length > 0) activeFiltersCount += selectedBrands.length;
  if (minPriceParam || maxPriceParam) activeFiltersCount++;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
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
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleBrand = (b: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    let updated: string[];
    if (selectedBrands.includes(b)) {
      updated = selectedBrands.filter((item) => item !== b);
    } else {
      updated = [...selectedBrands, b];
    }
    if (updated.length > 0) {
      params.set("brand", updated.join(","));
    } else {
      params.delete("brand");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (mobileMinPrice && !isNaN(Number(mobileMinPrice)) && Number(mobileMinPrice) > 0) {
      params.set("minPrice", mobileMinPrice);
    } else {
      params.delete("minPrice");
    }
    if (mobileMaxPrice && !isNaN(Number(mobileMaxPrice)) && Number(mobileMaxPrice) > 0) {
      params.set("maxPrice", mobileMaxPrice);
    } else {
      params.delete("maxPrice");
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

            {/* Price Range Accordion */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden transition-all duration-300">
              <button
                type="button"
                onClick={() => setPriceOpen(!priceOpen)}
                className="w-full flex items-center justify-between p-3.5 text-right font-bold text-xs text-slate-800 dark:text-slate-200 select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold">محدوده قیمت (تومان)</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">
                    ({mobileMinPrice ? formatToman(Number(mobileMinPrice)) : "۰"} تا{" "}
                    {mobileMaxPrice ? formatToman(Number(mobileMaxPrice)) : "۲۵+ م"})
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-300 ease-in-out ${
                    priceOpen ? "rotate-180 text-amber-500" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  priceOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-3.5 pt-0 space-y-3 border-t border-slate-200/60 dark:border-slate-700/60">
                    {/* Mobile Dual Slider */}
                    <div dir="ltr" className="relative w-full h-7 flex items-center mt-2">
                      <div className="absolute w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
                      <div
                        className="absolute h-2 bg-amber-500 rounded-full"
                        style={{
                          left: `${Math.min(100, Math.max(0, ((Number(mobileMinPrice) || 0) / 25000000) * 100))}%`,
                          width: `${Math.max(0, (((Number(mobileMaxPrice) || 25000000) - (Number(mobileMinPrice) || 0)) / 25000000) * 100)}%`,
                        }}
                      />
                      <input
                        type="range"
                        min={0}
                        max={25000000}
                        step={100000}
                        value={Number(mobileMinPrice) || 0}
                        onChange={(e) => {
                          const currentMax = Number(mobileMaxPrice) || 25000000;
                          const val = Math.min(Number(e.target.value), currentMax - 100000);
                          setMobileMinPrice(val > 0 ? val.toString() : "");
                        }}
                        className={`absolute w-full h-2 appearance-none bg-transparent pointer-events-none focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:dark:bg-slate-900 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-500 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer ${
                          (Number(mobileMinPrice) || 0) > 23000000 ? "z-30" : "z-20"
                        }`}
                      />
                      <input
                        type="range"
                        min={0}
                        max={25000000}
                        step={100000}
                        value={Number(mobileMaxPrice) || 25000000}
                        onChange={(e) => {
                          const currentMin = Number(mobileMinPrice) || 0;
                          const val = Math.max(Number(e.target.value), currentMin + 100000);
                          setMobileMaxPrice(val < 25000000 ? val.toString() : "");
                        }}
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-20 focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:dark:bg-slate-900 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-500 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="از (تومان)..."
                        value={mobileMinPrice}
                        onChange={(e) => setMobileMinPrice(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-xl p-2 font-mono text-left"
                      />
                      <input
                        type="number"
                        placeholder="تا (تومان)..."
                        value={mobileMaxPrice}
                        onChange={(e) => setMobileMaxPrice(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-xl p-2 font-mono text-left"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={applyPriceFilter}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-sm transition-colors"
                    >
                      اعمال فیلتر قیمت
                    </button>

                    {/* Quick Presets for Mobile placed down below apply button */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 block">یا انتخاب سریع بازه:</span>
                      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMinPrice("");
                            setMobileMaxPrice("500000");
                          }}
                          className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium text-center"
                        >
                          زیر ۵۰۰ هزار
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMinPrice("500000");
                            setMobileMaxPrice("2000000");
                          }}
                          className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium text-center"
                        >
                          ۵۰۰ هزار تا ۲ م
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMinPrice("2000000");
                            setMobileMaxPrice("10000000");
                          }}
                          className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium text-center"
                        >
                          ۲ تا ۱۰ میلیون
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMinPrice("10000000");
                            setMobileMaxPrice("");
                          }}
                          className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium text-center"
                        >
                          بالای ۱۰ میلیون
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories Accordion */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden transition-all duration-300">
              <button
                type="button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="w-full flex items-center justify-between p-3.5 text-right font-bold text-xs text-slate-800 dark:text-slate-200 select-none"
              >
                <span>دسته‌بندی کالا</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-300 ease-in-out ${
                    categoriesOpen ? "rotate-180 text-amber-500" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  categoriesOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-3.5 pt-0 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        onClick={() => updateParam("category", undefined)}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center ${
                          !currentCategory
                            ? "bg-amber-500 text-slate-950 border-amber-500 shadow-sm"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
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
                              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Brands Accordion (Multi-select) */}
            {brands.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden transition-all duration-300">
                <button
                  type="button"
                  onClick={() => setBrandsOpen(!brandsOpen)}
                  className="w-full flex items-center justify-between p-3.5 text-right font-bold text-xs text-slate-800 dark:text-slate-200 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>برند تولیدکننده</span>
                    {selectedBrands.length > 0 && (
                      <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 rounded-full font-bold">
                        {selectedBrands.length}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ease-in-out ${
                      brandsOpen ? "rotate-180 text-amber-500" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    brandsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-3.5 pt-0 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2">
                      {selectedBrands.length > 0 && (
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => updateParam("brand", undefined)}
                            className="text-[11px] text-rose-500 font-bold"
                          >
                            پاک کردن برندها
                          </button>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {brands.map((b) => {
                          const isSelected = selectedBrands.includes(b);
                          return (
                            <button
                              key={b}
                              onClick={() => toggleBrand(b)}
                              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                                isSelected
                                  ? "bg-amber-500 text-slate-950 border-amber-500 shadow-sm"
                                  : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900"
                              }`}
                            >
                              <span>{b}</span>
                              {isSelected && <Check className="w-3 h-3" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Items Per Page Selector */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-400 block">تعداد کالا در هر صفحه</span>
              <div className="flex items-center gap-2">
                {[12, 60, 120].map((size) => (
                  <button
                    key={size}
                    onClick={() => updateParam("pageSize", size.toString())}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                      currentPageSize === size
                        ? "bg-amber-500 text-slate-950 border-amber-500 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {toPersianDigits(size)} کالا
                  </button>
                ))}
              </div>
            </div>

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
