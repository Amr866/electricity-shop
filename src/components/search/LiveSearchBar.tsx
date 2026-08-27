"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [results, setResults] = useState<{ products: any[]; categories: any[] }>({
    products: [],
    categories: [],
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      {/* Dark Dimming Backdrop Overlay when Search is Active */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity duration-300 animate-in fade-in"
        />
      )}

      <div ref={wrapperRef} className={`relative w-full ${isOpen ? "z-50" : "z-10"}`}>
        {/* Search Input Container with Dual Light & Dark Theme Highlights */}
        <form onSubmit={handleSubmit} className="relative w-full">
          <div
            className={`relative flex items-center transition-all duration-300 rounded-2xl ${
              isOpen
                ? "bg-white dark:bg-slate-900 border-2 border-amber-500 dark:border-amber-400 shadow-2xl shadow-amber-500/20 ring-4 ring-amber-500/20 dark:ring-amber-400/20"
                : "bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {/* Search Icon / Animated Spinner */}
            <div className={`pr-3.5 pl-2 flex items-center justify-center ${isOpen ? "text-amber-500 dark:text-amber-400" : "text-slate-400 dark:text-slate-400"}`}>
              {loading ? (
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
              ) : isOpen ? (
                <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-pulse" />
              ) : (
                <Search className="w-4 h-4 text-slate-400" />
              )}
            </div>

            {/* Text Input */}
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
                  ? "جستجوی کالا، برند یا قطعه..."
                  : "جستجوی پنکه، موتور کولر، بخاری برقی، آنتن، سیم و کابل، آردوینو..."
              }
              className="w-full bg-transparent text-xs sm:text-sm py-2.5 sm:py-3 pl-20 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium text-slate-900 dark:text-white"
            />

            {/* Clear Button */}
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setResults({ products: [], categories: [] });
                  inputRef.current?.focus();
                }}
                className="p-1.5 rounded-full ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Submit Action Button with 'بیاب' */}
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-4 py-1.5 sm:py-2 rounded-xl m-1 transition-all active:scale-95 shadow-sm shrink-0 flex items-center gap-1"
            >
              <span>بیاب</span>
            </button>
          </div>
        </form>

        {/* Interactive Dropdown Search Results Popup with Dark Theme support */}
        {isOpen && (
          <div className="absolute top-full right-0 left-0 mt-2 z-50 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 text-slate-900 dark:text-slate-100">
            
            {/* Case 1: Search Query is Active and Results Found */}
            {query.trim() && (results.products.length > 0 || results.categories.length > 0) && (
              <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
                
                {/* Matching Categories */}
                {results.categories.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-amber-500" />
                      دسته‌بندی‌های مرتبط:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {results.categories.map((c) => (
                        <Link
                          key={c.id}
                          href={`/products?category=${c.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                        >
                          <span>{c.name}</span>
                          <ArrowLeft className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Products List */}
                {results.products.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-500" />
                      کالاهای پیشنهادی:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {results.products.map((p) => (
                        <Link
                          key={p.id}
                          href={`/products/${p.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="group flex items-center gap-3 p-2.5 rounded-2xl hover:bg-amber-50/60 dark:hover:bg-slate-800/80 border border-transparent hover:border-amber-200 dark:hover:border-slate-700 transition-all"
                        >
                          <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] text-slate-400 font-semibold block">
                              {p.brand || p.categoryName}
                            </span>
                            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 truncate">
                              {p.name}
                            </h4>
                            <span className="font-extrabold text-xs text-slate-950 dark:text-amber-400 block mt-0.5 font-mono">
                              {formatToman(p.price)}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* View All Search Results CTA */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={handleSubmit}
                    className="w-full py-2.5 bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>مشاهده همه نتایج جستجو برای «{query}»</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            )}

            {/* Case 2: Search Query Active but No Results */}
            {query.trim() && !loading && results.products.length === 0 && results.categories.length === 0 && (
              <div className="p-6 text-center space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                  کالایی با عنوان «{query}» یافت نشد.
                </span>
                <p className="text-[11px] text-slate-400">
                  می‌توانید کلمات کلیدی دیگری مانند پنکه، موتور کولر، بخاری، آنتن، سیم، کابل یا آردوینو را امتحان کنید.
                </p>
              </div>
            )}

            {/* Case 3: Search Input Focused but Empty */}
            {!query.trim() && (
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    جستجوهای پرطرفدار فروشگاه شیاسی (نجف‌آباد):
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleSelectPopular(term)}
                      className="bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/70 text-slate-700 dark:text-slate-300 hover:text-amber-900 dark:hover:text-amber-300 text-xs font-medium px-3 py-1.5 rounded-xl transition-colors border border-slate-200/80 dark:border-slate-700"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </>
  );
}
