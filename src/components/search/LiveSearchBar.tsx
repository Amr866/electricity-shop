"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatToman } from "@/lib/utils";
import {
  Search,
  Zap,
  Sparkles,
  ArrowLeft,
  X,
  Loader2,
  TrendingUp,
  Tag,
} from "lucide-react";

const POPULAR_SEARCHES = [
  "پنکه پارس خزر",
  "موتور کولر موتوژن",
  "بخاری برقی اخوان",
  "آنتن تلویزیون هانی",
  "سیم افشان ۱.۵ مس",
  "پروژکتور خورشیدی ۲۰۰ وات",
  "برد آردوینو Uno",
  "هویه دیجیتال ۶۰ وات",
  "مولتی‌متر DT9205A",
  "کلید و پریز دلند",
];

export function LiveSearchBar({ isMobile = false }: { isMobile?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [results, setResults] = useState<{ products: any[]; categories: any[] }>({
    products: [],
    categories: [],
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape or click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], categories: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data);
      } catch (e) {
        console.error("Live search failed", e);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectPopular = (term: string) => {
    setQuery(term);
    setIsOpen(false);
    router.push(`/products?q=${encodeURIComponent(term)}`);
  };

  return (
    <>
      {/* Full Viewport Dimming Backdrop */}
      {isOpen && mounted && typeof document !== "undefined" && createPortal(
        <div
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 w-screen h-screen bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity duration-300 animate-in fade-in cursor-pointer"
        />,
        document.body
      )}

      <div ref={wrapperRef} className={`relative w-full ${isOpen ? "z-50" : "z-10"}`}>
        {/* Search Input Form (RTL Natural Alignment) */}
        <form onSubmit={handleSubmit} className="relative w-full">
          <div
            className={`relative flex items-center transition-all duration-200 rounded-xl ${
              isOpen
                ? "bg-white dark:bg-slate-900 border-2 border-amber-500/80 dark:border-amber-400/80 shadow-xl shadow-amber-500/10 ring-4 ring-amber-500/10"
                : "bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {/* Right: Search Icon */}
            <div className={`pr-3.5 pl-1 flex items-center justify-center shrink-0 ${isOpen ? "text-amber-500" : "text-slate-400"}`}>
              {loading ? (
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
              ) : (
                <Search className="w-4 h-4 text-slate-400" />
              )}
            </div>

            {/* Center: Text Input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              placeholder={
                isMobile
                  ? "جستجوی کالا یا برند..."
                  : "جستجوی نام کالا، برند یا قطعه (مثال: موتوژن، سیم مس)..."
              }
              className="w-full bg-transparent text-xs sm:text-sm py-2 sm:py-2.5 px-2 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium text-slate-900 dark:text-white text-right"
            />

            {/* Left: Clear (X) and Search Button */}
            <div className="pl-1.5 flex items-center gap-1 shrink-0">
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setResults({ products: [], categories: [] });
                    inputRef.current?.focus();
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="submit"
                className="p-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg transition-all active:scale-95 flex items-center justify-center shadow-sm"
                title="جستجو"
              >
                <Search className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </form>

        {/* Live Search Results Dropdown */}
        {isOpen && (
          <div className="absolute top-full right-0 left-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* When Empty Query: Show Popular Searches */}
            {!query.trim() && (
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                  <span>جستجوهای پرطرفدار در نجف‌آباد و اصفهان:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSelectPopular(term)}
                      className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300 px-3 py-1.5 rounded-xl transition-colors border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1"
                    >
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {loading && query.trim() && (
              <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                <span>در حال جستجوی کاتالوگ فروشگاه شیاسی...</span>
              </div>
            )}

            {/* Search Results Display */}
            {!loading && query.trim() && (
              <div className="max-h-[65vh] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
                {/* Categories matched */}
                {results.categories.length > 0 && (
                  <div className="p-3 bg-slate-50/70 dark:bg-slate-800/40">
                    <span className="text-[11px] font-bold text-slate-400 block mb-2 px-1">
                      دسته‌بندی‌های مرتبط:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {results.categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="text-xs font-semibold bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1 hover:border-amber-400"
                        >
                          <Tag className="w-3 h-3" />
                          <span>{cat.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products matched */}
                {results.products.length > 0 ? (
                  <div className="p-2 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 block px-2 pt-1 pb-2">
                      محصولات یافت‌شده:
                    </span>
                    {results.products.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/products/${prod.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                      >
                        <img
                          src={prod.images?.[0]?.url || "/images/products/wal_172619-fans-7995865_1920.jpg"}
                          alt={prod.name}
                          className="w-12 h-12 rounded-lg object-contain bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition-colors">
                            {prod.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            {prod.brand && <span>برند: {prod.brand}</span>}
                            {prod.warranty && (
                              <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                                {prod.warranty}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-left shrink-0">
                          <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-amber-400 font-mono">
                            {formatToman(prod.price)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 space-y-2">
                    <p className="text-xs font-bold">کالایی با عبارت «{query}» یافت نشد.</p>
                    <p className="text-[11px] text-slate-400">
                      می‌توانید کاتالوگ کلی را مرور کرده یا از بخش پذیرش تعمیرات استعلام بگیرید.
                    </p>
                  </div>
                )}

                {/* View all results CTA */}
                <div className="p-2 bg-slate-50 dark:bg-slate-850 text-center">
                  <Link
                    href={`/products?q=${encodeURIComponent(query.trim())}`}
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 py-1.5"
                  >
                    <span>مشاهده تمام نتایج جستجو برای «{query}»</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
