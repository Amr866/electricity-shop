"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Check, RotateCcw, Tag, ChevronDown } from "lucide-react";

interface BrandFilterWidgetProps {
  brands: string[];
}

export function BrandFilterWidget({ brands }: BrandFilterWidgetProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(true);

  const brandParam = searchParams.get("brand");
  const selectedBrands = brandParam ? brandParam.split(",").map((b) => b.trim()).filter(Boolean) : [];

  const toggleBrand = (brandName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page"); // Reset page to 1

    let updated: string[];
    if (selectedBrands.includes(brandName)) {
      updated = selectedBrands.filter((b) => b !== brandName);
    } else {
      updated = [...selectedBrands, brandName];
    }

    if (updated.length > 0) {
      params.set("brand", updated.join(","));
    } else {
      params.delete("brand");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearBrands = (e: React.MouseEvent) => {
    e.stopPropagation();
    const params = new URLSearchParams(searchParams.toString());
    params.delete("brand");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  if (brands.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
      {/* Clickable Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-right font-bold text-sm text-slate-900 dark:text-white hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors select-none"
      >
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-amber-500" />
          <span>برندهای معتبر</span>
          {selectedBrands.length > 0 && (
            <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {selectedBrands.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedBrands.length > 0 && (
            <span
              onClick={handleClearBrands}
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
          <div className="p-4 sm:p-5 pt-0 space-y-1.5 max-h-60 overflow-y-auto pr-1 text-xs border-t border-slate-100 dark:border-slate-800/60">
            {brands.map((b) => {
              const isSelected = selectedBrands.includes(b);
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBrand(b)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all text-right ${
                    isSelected
                      ? "bg-amber-50 dark:bg-amber-950/60 border-amber-400 dark:border-amber-600 text-amber-950 dark:text-amber-200 font-bold"
                      : "border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="truncate">{b}</span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-amber-500 text-slate-950 font-black"
                        : "border border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
