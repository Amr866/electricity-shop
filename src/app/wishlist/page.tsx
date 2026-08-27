"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/product/ProductCard";
import { toPersianDigits } from "@/lib/utils";
import {
  Heart,
  ArrowLeft,
  Trash2,
  ShoppingCart,
  CheckCircle2,
  Sparkles,
  Zap,
  Tag,
  Share2,
} from "lucide-react";

export default function WishlistPage() {
  const { wishlist, wishlistCount, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedAll, setAddedAll] = useState(false);
  const [filterStockOnly, setFilterStockOnly] = useState(false);

  const handleAddAllToCart = () => {
    wishlist.forEach((product) => {
      if (product.stock > 0) {
        addToCart(product, 1);
      }
    });
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2500);
  };

  const displayedList = filterStockOnly
    ? wishlist.filter((p) => p.stock > 0)
    : wishlist;

  if (wishlistCount === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-[75vh] flex items-center justify-center py-12 px-4 transition-colors duration-200">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-slate-900 dark:text-white">
            <div className="relative w-20 h-20 bg-rose-50 dark:bg-rose-950/60 text-rose-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <Heart className="w-10 h-10 animate-pulse fill-rose-500/20 text-rose-500" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 text-[10px] font-black">
                ۰
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                لیست کالاهای ذخیره‌شده شما خالی است!
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                با زدن دکمه قلب روی هر محصول، آن را در این صفحه ذخیره کنید تا قیمت و موجودی آن را همیشه دم دست داشته باشید.
              </p>
            </div>

            {/* Quick Categories to explore */}
            <div className="pt-2 flex flex-wrap justify-center gap-1.5 text-[11px]">
              <Link
                href="/products?category=home-appliances-cooling-heating"
                className="bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 px-2.5 py-1 rounded-xl font-medium transition-colors"
              >
                🌀 پنکه و موتور کولر
              </Link>
              <Link
                href="/products?category=wiring-building"
                className="bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 px-2.5 py-1 rounded-xl font-medium transition-colors"
              >
                🔌 سیم و کابل مس
              </Link>
              <Link
                href="/products?category=lighting-fixtures"
                className="bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 px-2.5 py-1 rounded-xl font-medium transition-colors"
              >
                💡 روشنایی LED
              </Link>
            </div>

            <div className="pt-2">
              <Link
                href="/products"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm py-3 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 hover-glow"
              >
                <span>مشاهده کاتالوگ و خرید</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-6 sm:py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 space-y-4 sm:space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shrink-0 shadow-sm">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-white">
                  کالاهای ذخیره‌شده
                </h1>
                <span className="text-[11px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">
                  {toPersianDigits(wishlistCount)} کالا
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                لیست علاقه‌مندی‌های شما در مرورگر ذخیره شده است
              </p>
            </div>
          </div>

          {/* Action Buttons: Add All to Cart & Clear */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleAddAllToCart}
              className={`flex-1 sm:flex-initial text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95 ${
                addedAll
                  ? "bg-emerald-600 text-white shadow-emerald-600/30"
                  : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20"
              }`}
            >
              {addedAll ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>همه به سبد اضافه شدند</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>افزودن همه به سبد</span>
                </>
              )}
            </button>

            <button
              onClick={clearWishlist}
              className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 px-3 py-2.5 rounded-xl font-bold transition-colors shrink-0 flex items-center gap-1"
              title="پاک کردن همه علاقه‌مندی‌ها"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">حذف همه</span>
            </button>
          </div>
        </div>

        {/* Filter Badges Bar */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterStockOnly(false)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors text-xs ${
                !filterStockOnly
                  ? "bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
              }`}
            >
              همه ({toPersianDigits(wishlistCount)})
            </button>

            <button
              onClick={() => setFilterStockOnly(true)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors text-xs ${
                filterStockOnly
                  ? "bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
              }`}
            >
              فقط کالاهای موجود
            </button>
          </div>

          <span className="text-[11px] text-slate-400">
            نمایش {toPersianDigits(displayedList.length)} کالا
          </span>
        </div>

        {/* 2-Column Grid on Mobile, 4-Column on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          {displayedList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </div>
  );
}
