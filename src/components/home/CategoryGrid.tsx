import React from "react";
import Link from "next/link";
import { Zap, SunMedium, Layers, Cpu, ArrowLeft, Fan } from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

interface CategoryGridProps {
  categories: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    _count?: { products: number };
  }[];
}

const CATEGORY_IMAGES: Record<string, string> = {
  "home-appliances-cooling-heating":
    "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=600&q=80",
  "wiring-building":
    "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=600&q=80",
  "lighting-fixtures":
    "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80",
  "maker-diy-electronics":
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  const getIcon = (slug: string) => {
    switch (slug) {
      case "home-appliances-cooling-heating":
        return <Fan className="w-5 h-5 text-amber-500" />;
      case "wiring-building":
        return <Zap className="w-5 h-5 text-amber-500" />;
      case "lighting-fixtures":
        return <SunMedium className="w-5 h-5 text-blue-500" />;
      case "maker-diy-electronics":
        return <Cpu className="w-5 h-5 text-emerald-500" />;
      default:
        return <Zap className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <section className="py-5 sm:py-8 bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 sm:space-y-6 transition-colors duration-200">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>دسته‌بندی‌های تخصصی کالا</span>
            <span className="text-[10px] sm:text-xs bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-bold border border-amber-300 dark:border-amber-700">
              ۴ رسته اصلی
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            لوازم سرمایش و گرمایش، سیم و کابل استاندارد، روشنایی مدرن و قطعات الکترونیک
          </p>
        </div>

        <Link
          href="/products"
          className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 group"
        >
          <span>مشاهده کاتالوگ جامع</span>
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Categories Grid (2x2 on mobile, 4 in a row on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {categories.map((cat) => {
          const bgImage =
            cat.image ||
            CATEGORY_IMAGES[cat.slug] ||
            "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80";

          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-sm hover:shadow-md transition-all duration-300 h-48 sm:h-52 flex flex-col justify-between p-4"
            >
              {/* Background Photo */}
              <img
                src={bgImage}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Gradient Overlay for high text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/30" />

              {/* Top: Icon + Count */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-950 dark:text-amber-400 flex items-center justify-center shadow-md backdrop-blur-sm">
                  {getIcon(cat.slug)}
                </div>
                {cat._count && (
                  <span className="text-[11px] font-bold text-amber-300 bg-slate-900/80 border border-slate-700/80 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {toPersianDigits(cat._count.products)} کالا
                  </span>
                )}
              </div>

              {/* Bottom: Name & Subtitle */}
              <div className="relative z-10 space-y-1">
                <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-300 line-clamp-1">
                  {cat.description || "تجهیزات تخصصی و قطعات اصلی"}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:underline">
                  <span>مشاهده محصولات</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
