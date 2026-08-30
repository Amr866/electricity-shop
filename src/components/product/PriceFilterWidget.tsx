"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { formatToman } from "@/lib/utils";
import { Banknote, Check, RotateCcw, ChevronDown } from "lucide-react";

interface PriceFilterWidgetProps {
  initialMinPrice?: number;
  initialMaxPrice?: number;
}

const MAX_PRICE_LIMIT = 25000000; // 25 Million Tomans
const PRICE_STEP = 100000; // 100K Tomans step

export function PriceFilterWidget({
  initialMinPrice,
  initialMaxPrice,
}: PriceFilterWidgetProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(true);
  const [minPrice, setMinPrice] = useState<number>(initialMinPrice || 0);
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice || MAX_PRICE_LIMIT);

  useEffect(() => {
    const qMin = searchParams.get("minPrice");
    const qMax = searchParams.get("maxPrice");
    setMinPrice(qMin ? Number(qMin) : 0);
    setMaxPrice(qMax ? Number(qMax) : MAX_PRICE_LIMIT);
  }, [searchParams]);

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (minPrice > 0) {
      params.set("minPrice", minPrice.toString());
    } else {
      params.delete("minPrice");
    }

    if (maxPrice < MAX_PRICE_LIMIT && maxPrice > 0) {
      params.set("maxPrice", maxPrice.toString());
    } else {
      params.delete("maxPrice");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMinPrice(0);
    setMaxPrice(MAX_PRICE_LIMIT);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const setPreset = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (min > 0) {
      params.set("minPrice", min.toString());
    } else {
      params.delete("minPrice");
    }

    if (max < MAX_PRICE_LIMIT) {
      params.set("maxPrice", max.toString());
    } else {
      params.delete("maxPrice");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const hasActivePrice = Boolean(searchParams.get("minPrice") || searchParams.get("maxPrice"));

  // Calculate percentage strictly in LTR
  const minPercent = Math.min(100, Math.max(0, (minPrice / MAX_PRICE_LIMIT) * 100));
  const maxPercent = Math.min(100, Math.max(0, (maxPrice / MAX_PRICE_LIMIT) * 100));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
      {/* 1. Clickable Header with Accordion Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-right font-bold text-sm text-slate-900 dark:text-white hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors select-none"
      >
        <div className="flex items-center gap-2">
          <Banknote className="w-4 h-4 text-amber-500" />
          <span>محدوده قیمت</span>
        </div>
        <div className="flex items-center gap-2">
          {hasActivePrice && (
            <span
              onClick={handleClear}
              className="text-[11px] text-rose-500 hover:text-rose-600 flex items-center gap-0.5 font-bold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              حذف
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-300 ease-in-out ${
              isOpen ? "rotate-180 text-amber-500" : ""
            }`}
          />
        </div>
      </button>

      {/* Smooth Animated Collapsible Content via CSS Grid */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 sm:p-5 pt-0 space-y-4 border-t border-slate-100 dark:border-slate-800/60">
            {/* 2. Live Selected Range Display */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 block font-normal">از:</span>
                <span>{minPrice === 0 ? "۰ تومان" : formatToman(minPrice)}</span>
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-normal">تا:</span>
                <span>{maxPrice >= MAX_PRICE_LIMIT ? "۲۵+ میلیون" : formatToman(maxPrice)}</span>
              </div>
            </div>

            {/* 3. Rock-solid LTR Dual Range Slider */}
            <div className="px-1 py-1">
              <div dir="ltr" className="relative w-full h-7 flex items-center">
                {/* Background track */}
                <div className="absolute w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
                
                {/* Active Highlight Bar */}
                <div
                  className="absolute h-2 bg-amber-500 rounded-full"
                  style={{
                    left: `${minPercent}%`,
                    width: `${Math.max(0, maxPercent - minPercent)}%`,
                  }}
                />

                {/* Min Thumb Input */}
                <input
                  type="range"
                  min={0}
                  max={MAX_PRICE_LIMIT}
                  step={PRICE_STEP}
                  value={minPrice}
                  onChange={(e) => {
                    const val = Math.min(Number(e.target.value), maxPrice - PRICE_STEP);
                    setMinPrice(val);
                  }}
                  className={`absolute w-full h-2 appearance-none bg-transparent pointer-events-none focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:dark:bg-slate-900 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-500 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer ${
                    minPrice > MAX_PRICE_LIMIT - 2000000 ? "z-30" : "z-20"
                  }`}
                />

                {/* Max Thumb Input */}
                <input
                  type="range"
                  min={0}
                  max={MAX_PRICE_LIMIT}
                  step={PRICE_STEP}
                  value={maxPrice}
                  onChange={(e) => {
                    const val = Math.max(Number(e.target.value), minPrice + PRICE_STEP);
                    setMaxPrice(val);
                  }}
                  className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-20 focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:dark:bg-slate-900 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-500 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
                />
              </div>
            </div>

            {/* 4. Manual Numeric Inputs & Submit Button */}
            <form onSubmit={handleApply} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">
                    از (تومان):
                  </label>
                  <input
                    type="number"
                    value={minPrice === 0 ? "" : minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                    placeholder="۰"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-left"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">
                    تا (تومان):
                  </label>
                  <input
                    type="number"
                    value={maxPrice >= MAX_PRICE_LIMIT ? "" : maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value) || MAX_PRICE_LIMIT)}
                    placeholder="۲۵۰۰۰۰۰۰"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-left"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 active:scale-98"
              >
                <Check className="w-3.5 h-3.5" />
                <span>اعمال فیلتر قیمت</span>
              </button>
            </form>

            {/* 5. Quick Presets Placed Down Below the Button */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 block">یا انتخاب سریع بازه:</span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setPreset(0, 500000)}
                  className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-400 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium transition-colors text-center"
                >
                  زیر ۵۰۰ هزار
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(500000, 2000000)}
                  className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-400 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium transition-colors text-center"
                >
                  ۵۰۰ هزار تا ۲ م
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(2000000, 10000000)}
                  className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-400 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium transition-colors text-center"
                >
                  ۲ تا ۱۰ میلیون
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(10000000, MAX_PRICE_LIMIT)}
                  className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-400 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium transition-colors text-center"
                >
                  بالای ۱۰ میلیون
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
