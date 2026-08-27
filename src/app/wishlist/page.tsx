"use client";

import React from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/product/ProductCard";
import { toPersianDigits } from "@/lib/utils";
import { Heart, ArrowLeft, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, wishlistCount, clearWishlist } = useWishlist();

  if (wishlistCount === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-16 transition-colors duration-200">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-slate-900 dark:text-white">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/60 text-rose-500 rounded-3xl flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h1 className="font-extrabold text-base text-slate-900 dark:text-white">
              لیست کالاهای ذخیره‌شده شما خالی است!
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              با کلیک روی آیکون قلب روی هر کالا، می‌توانید آن را به این لیست اضافه نموده تا در مراجعات بعدی به سرعت به آن دسترسی داشته باشید.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
            >
              <span>مشاهده و مرور کاتالوگ</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              <span>کالاهای ذخیره‌شده و علاقه‌مندی‌ها</span>
              <span className="text-xs bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300 px-2.5 py-0.5 rounded-full font-bold border border-rose-200 dark:border-rose-800">
                {toPersianDigits(wishlistCount)} کالا
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              کالاهایی که برای بررسی بعدی نشان کرده‌اید
            </p>
          </div>

          <button
            onClick={clearWishlist}
            className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 font-bold flex items-center gap-1 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 px-3 py-2 rounded-xl transition-colors shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>پاک کردن همه</span>
          </button>
        </div>

        {/* Wishlist Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </div>
  );
}
