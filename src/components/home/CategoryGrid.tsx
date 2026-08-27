import React from "react";
import Link from "next/link";
import { Zap, SunMedium, Layers, Cpu, ArrowLeft } from "lucide-react";
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

export function CategoryGrid({ categories }: CategoryGridProps) {
  const getIcon = (slug: string) => {
    switch (slug) {
      case "wiring-building":
        return <Zap className="w-6 h-6 text-amber-500" />;
      case "lighting-fixtures":
        return <SunMedium className="w-6 h-6 text-blue-500" />;
      case "industrial-automation":
        return <Layers className="w-6 h-6 text-purple-500" />;
      case "maker-diy-electronics":
        return <Cpu className="w-6 h-6 text-emerald-500" />;
      default:
        return <Zap className="w-6 h-6 text-amber-500" />;
    }
  };

  return (
    <section className="py-12 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>دسته‌بندی‌های تخصصی کالا</span>
              <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold border border-amber-200">
                ۴ رسته اصلی
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              تجهیزات برق ساختمانی، روشنایی، اتوماسیون صنعتی و قطعات الکترونیک
            </p>
          </div>

          <Link
            href="/products"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group"
          >
            <span>مشاهده همه محصولات</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-amber-400 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-amber-50 flex items-center justify-center transition-colors">
                    {getIcon(cat.slug)}
                  </div>
                  {cat._count && (
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      {toPersianDigits(cat._count.products)} کالا
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-amber-600">
                <span>مشاهده محصولات</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
