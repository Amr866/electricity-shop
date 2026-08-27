"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatToman, toPersianDigits } from "@/lib/utils";
import {
  ShoppingCart,
  Check,
  Star,
  Zap,
  Truck,
  Heart,
} from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number | null;
    discountPercent?: number;
    stock: number;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isNewArrival?: boolean;
    isIsfahanFast?: boolean;
    brand?: string | null;
    warranty?: string | null;
    rating?: number;
    reviewCount?: number;
    category?: { name: string; slug: string };
    images?: { url: string; isPrimary?: boolean; alt?: string | null }[];
    shortDesc?: string | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "/images/products/wal_172619-fans-7995865_1920.jpg";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;

    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 dark:hover:shadow-amber-500/15 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Top Section: Badges, Wishlist & Image */}
      <div>
        {/* Product Image Frame */}
        <div className="relative m-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 overflow-hidden aspect-square flex items-center justify-center p-3">
          
          {/* Top-Right Badge: Single Primary Badge */}
          <div className="absolute top-2 right-2 z-10">
            {product.discountPercent && product.discountPercent > 0 ? (
              <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
                {toPersianDigits(product.discountPercent)}٪ تخفیف
              </span>
            ) : product.isBestSeller ? (
              <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5 fill-slate-950" />
                پرفروش
              </span>
            ) : null}
          </div>

          {/* Top-Left: Wishlist Heart */}
          <button
            onClick={handleToggleFav}
            aria-label="ذخیره در علاقه‌مندی‌ها"
            className={`absolute top-2 left-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-90 ${
              isFavorited
                ? "bg-rose-50 dark:bg-rose-950 text-rose-500 border border-rose-200 dark:border-rose-800 scale-105"
                : "bg-white/90 dark:bg-slate-900/90 text-slate-400 dark:text-slate-300 hover:text-rose-500 border border-slate-200/80 dark:border-slate-700 backdrop-blur-sm"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>

          {/* Product Image */}
          <Link href={`/products/${product.slug}`} className="w-full h-full flex items-center justify-center">
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          </Link>

          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-rose-600 text-white font-bold text-[11px] sm:text-xs px-3 py-1 rounded-xl shadow-lg">
                ناموجود در انبار
              </span>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="px-3.5 pb-2 sm:px-4 space-y-2">
          {/* Category & Brand Tags (Non-Truncating Clean Row) */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 gap-1">
            <span className="truncate">{product.category?.name || "تجهیزات برق"}</span>
            {product.brand && (
              <span className="font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200/60 dark:border-amber-800/60 shrink-0">
                {product.brand.replace(/\s*\(.*?\)/g, "")}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-500 transition-colors h-8 sm:h-10">
              {product.name}
            </h3>
          </Link>

          {/* Rating & Fast Courier Badge */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 pt-0.5">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-700 dark:text-slate-300 text-[10px] sm:text-[11px]">
                {toPersianDigits(product.rating || 4.9)}
              </span>
            </div>

            {product.warranty ? (
              <span className="text-[9px] sm:text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800 shrink-0">
                {product.warranty}
              </span>
            ) : product.isIsfahanFast ? (
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-bold">
                <Truck className="w-2.5 h-2.5" />
                <span>ارسال فوری</span>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Bottom Section: Price & Add to Cart Action */}
      <div className="p-3.5 sm:p-4 pt-0 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between gap-1.5 pt-2.5">
          {/* Price Container */}
          <div className="flex flex-col">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-[11px] text-slate-400 line-through">
                {formatToman(product.originalPrice)}
              </span>
            )}
            <span className="font-black text-xs sm:text-sm lg:text-base text-slate-950 dark:text-amber-400 font-mono">
              {formatToman(product.price)}
            </span>
          </div>

          {/* Add To Cart CTA Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shadow-sm active:scale-90 ${
              isOutOfStock
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                : added
                ? "bg-emerald-600 text-white shadow-emerald-600/30"
                : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 hover-glow"
            }`}
            title="افزودن به سبد خرید"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="text-[11px]">ثبت شد</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="text-[11px]">خرید</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
