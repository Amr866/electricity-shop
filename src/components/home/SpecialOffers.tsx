import React from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { Flame, ArrowLeft } from "lucide-react";

interface SpecialOffersProps {
  products: any[];
}

export function SpecialOffers({ products }: SpecialOffersProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8 bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Flame className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  تخفیف‌های ویژه و پیشنهاد شگفت‌انگیز
                </h2>
                <span className="bg-rose-100 text-rose-700 text-xs font-black px-2 py-0.5 rounded">
                  فروش ویژه
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                تجهیزات برق ساختمانی و قطعات الکترونیک با تخفیف ویژه به مدت محدود در فروشگاه اصفهان
              </p>
            </div>
          </div>

          <Link
            href="/products?featured=true"
            className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm shrink-0"
          >
            <span>مشاهده همه تخفیف‌ها</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
