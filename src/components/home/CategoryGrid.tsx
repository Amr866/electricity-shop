import React from "react";
import Link from "next/link";
import { Zap, SunMedium, Cpu, ArrowLeft, Fan } from "lucide-react";
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
    "/images/products/wal_172619-fans-7995865_1920.jpg",
  "wiring-building":
    "/images/products/skdunning-wire-962753_1920.jpg",
  "lighting-fixtures":
    "/images/products/inspiredimages-light-bulb-1138047_1920.jpg",
  "maker-diy-electronics":
    "/images/products/close-up-circuit-reparing-tool.jpg",
};

const CATEGORY_THEMES: Record<string, {
  hoverBorder: string;
  hoverShadow: string;
  glow: string;
  accentText: string;
  badgeBg: string;
}> = {
  "home-appliances-cooling-heating": {
    hoverBorder: "hover:border-amber-500 dark:hover:border-amber-400",
    hoverShadow: "hover:shadow-amber-500/20 hover:shadow-xl",
    glow: "from-amber-500/25 via-amber-500/5 to-transparent",
    accentText: "group-hover:text-amber-400",
    badgeBg: "text-amber-300 dark:text-amber-400",
  },
  "wiring-building": {
    hoverBorder: "hover:border-blue-500 dark:hover:border-blue-400",
    hoverShadow: "hover:shadow-blue-500/20 hover:shadow-xl",
    glow: "from-blue-500/25 via-blue-500/5 to-transparent",
    accentText: "group-hover:text-blue-400",
    badgeBg: "text-blue-300 dark:text-blue-400",
  },
  "lighting-fixtures": {
    hoverBorder: "hover:border-emerald-500 dark:hover:border-emerald-400",
    hoverShadow: "hover:shadow-emerald-500/20 hover:shadow-xl",
    glow: "from-emerald-500/25 via-emerald-500/5 to-transparent",
    accentText: "group-hover:text-emerald-400",
    badgeBg: "text-emerald-300 dark:text-emerald-400",
  },
  "maker-diy-electronics": {
    hoverBorder: "hover:border-purple-500 dark:hover:border-purple-400",
    hoverShadow: "hover:shadow-purple-500/20 hover:shadow-xl",
    glow: "from-purple-500/25 via-purple-500/5 to-transparent",
    accentText: "group-hover:text-purple-400",
    badgeBg: "text-purple-300 dark:text-purple-400",
  },
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  const getIcon = (slug: string) => {
    switch (slug) {
      case "home-appliances-cooling-heating":
        return <Fan className="w-5 h-5 text-amber-500" />;
      case "wiring-building":
        return <Zap className="w-5 h-5 text-blue-500" />;
      case "lighting-fixtures":
        return <SunMedium className="w-5 h-5 text-emerald-500" />;
      case "maker-diy-electronics":
        return <Cpu className="w-5 h-5 text-purple-500" />;
      default:
        return <Zap className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <section className="relative overflow-hidden py-5 sm:py-8 bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 sm:space-y-6 transition-colors duration-200">
      {/* Ambient Aurora Glow Breathing Lights */}
      <div className="absolute -top-12 -left-12 w-72 h-72 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>دسته‌بندی‌های تخصصی کالا</span>
            <span className="text-[10px] sm:text-xs bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-bold border border-amber-300 dark:border-amber-700">
              ۴ رسته اصلی
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            لوازم سرمایش و گرمایش، سیم و کابل استاندارد، روشنایی مدرن و قطعات الکترونیک
          </p>
        </div>

        <Link
          href="/categories"
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

          const theme = CATEGORY_THEMES[cat.slug] || CATEGORY_THEMES["home-appliances-cooling-heating"];

          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`group relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all duration-300 h-48 sm:h-52 flex flex-col justify-between p-3.5 sm:p-4 bg-slate-850 dark:bg-slate-900 ${theme.hoverBorder} ${theme.hoverShadow}`}
            >
              {/* Background Photo */}
              <img
                src={bgImage}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              {/* Gradient Overlay for crisp text legibility in both themes */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/20 dark:from-slate-950 dark:via-slate-950/85 dark:to-slate-950/40" />

              {/* Dynamic Theme Glow on Hover */}
              <div className={`absolute top-0 right-0 w-48 h-32 bg-gradient-to-br ${theme.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-tr-2xl blur-xl`} />

              {/* Top: Icon + Count */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/95 dark:bg-slate-900/90 text-slate-950 flex items-center justify-center shadow-md backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/60">
                  {getIcon(cat.slug)}
                </div>
                {cat._count && (
                  <span className={`text-[10px] sm:text-[11px] font-bold bg-slate-900/90 border border-slate-700/80 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm ${theme.badgeBg}`}>
                    {toPersianDigits(cat._count.products)} کالا
                  </span>
                )}
              </div>

              {/* Bottom: Name & Subtitle */}
              <div className="relative z-10 space-y-1">
                <h3 className={`font-extrabold text-sm sm:text-base text-white transition-colors ${theme.accentText}`}>
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-300 line-clamp-1 font-medium">
                  {cat.description || "تجهیزات تخصصی و قطعات اصلی"}
                </p>
                <div className={`pt-1.5 flex items-center justify-between text-xs font-bold ${theme.accentText} group-hover:underline`}>
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
