"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { toPersianDigits } from "@/lib/utils";
import { Zap, SunMedium, Layers, Cpu, ArrowLeft, LayoutGrid } from "lucide-react";

interface InteractiveHomeCatalogProps {
  products: any[];
  categories: any[];
}

export function InteractiveHomeCatalog({
  products,
  categories,
}: InteractiveHomeCatalogProps) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("all");

  const filteredProducts =
    selectedCategorySlug === "all"
      ? products
      : products.filter((p) => p.category?.slug === selectedCategorySlug);

  return (
    <section className="py-12 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                ویترین و کاتالوگ جامع محصولات
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              مشاهده مستقیم اقلام؛ روی هر دسته‌بندی کلیک کنید تا کالاهای همان دسته بلافاصله نمایش داده شوند.
            </p>
          </div>

          <Link
            href="/products"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            <span>مشاهده کاتالوگ با فیلترهای پیشرفته</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Interactive Category Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategorySlug("all")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs shrink-0 transition-all flex items-center gap-1.5 ${
              selectedCategorySlug === "all"
                ? "bg-slate-950 text-amber-400 shadow-md ring-2 ring-amber-400/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>همه اقلام فروشگاه</span>
            <span className="text-[10px] opacity-80 mr-1">
              ({toPersianDigits(products.length)})
            </span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategorySlug(cat.slug)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs shrink-0 transition-all flex items-center gap-1.5 ${
                selectedCategorySlug === cat.slug
                  ? "bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-500/30"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{cat.name}</span>
              {cat._count && (
                <span className="text-[10px] opacity-80 mr-0.5">
                  ({toPersianDigits(cat._count.products)})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center text-slate-400 text-xs border border-slate-200">
            کالایی در این رسته یافت نشد.
          </div>
        )}

      </div>
    </section>
  );
}
