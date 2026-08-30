"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

interface CategoryFilterWidgetProps {
  categories: Array<{ id: string; name: string; slug: string; _count: { products: number } }>;
  categorySlug?: string;
  params: Record<string, any>;
}

export function CategoryFilterWidget({
  categories,
  categorySlug,
  params,
}: CategoryFilterWidgetProps) {
  const [isOpen, setIsOpen] = useState(true);

  const totalProducts = categories.reduce((acc, c) => acc + c._count.products, 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
      {/* Clickable Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-right font-bold text-sm text-slate-900 dark:text-white hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors select-none"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-amber-500" />
          <span>دسته‌بندی‌ها</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180 text-amber-500" : ""
          }`}
        />
      </button>

      {/* Smooth Animated Collapsible Content via CSS Grid */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 sm:p-5 pt-0 space-y-1 text-xs border-t border-slate-100 dark:border-slate-800/60">
            <Link
              href={{
                pathname: "/products",
                query: { ...params, category: undefined, page: undefined },
              }}
              className={`flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors ${
                !categorySlug
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <span>همه محصولات</span>
              <span className="text-[11px] opacity-80">
                {toPersianDigits(totalProducts)}
              </span>
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={{
                  pathname: "/products",
                  query: { ...params, category: cat.slug, page: undefined },
                }}
                className={`flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors ${
                  categorySlug === cat.slug
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <span className="truncate">{cat.name}</span>
                <span className="text-[11px] opacity-80 shrink-0 mr-1">
                  {toPersianDigits(cat._count.products)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
