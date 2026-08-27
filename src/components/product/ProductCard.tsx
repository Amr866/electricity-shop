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
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80";

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
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-amber-400/60 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Top Section: Badges, Wishlist & Image */}
      <div>
        {/* Badges & Wishlist Bar */}
        <div className="absolute top-3 right-3 left-3 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex flex-col gap-1 items-start">
            {product.discountPercent && product.discountPercent > 0 ? (
              <span className="bg-rose-500 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                {toPersianDigits(product.discountPercent)}٪ تخفیف
              </span>
            ) : null}
            {product.isBestSeller && (
              <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5 fill-slate-950" />
                پرفروش
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {product.isIsfahanFast && (
              <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 backdrop-blur-sm">
                <Truck className="w-2.5 h-2.5" />
                ارسال فوری
              </span>
            )}

            {/* Wishlist Heart Button */}
            <button
              onClick={handleToggleFav}
              aria-label="ذخیره در علاقه‌مندی‌ها"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
                isFavorited
                  ? "bg-rose-50 dark:bg-rose-950 text-rose-500 border border-rose-200 dark:border-rose-800 scale-105"
                  : "bg-white/90 dark:bg-slate-800 text-slate-400 dark:text-slate-300 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Product Image Container */}
        <Link
          href={`/products/${product.slug}`}
          className="block relative aspect-square w-full overflow-hidden bg-slate-50 dark:bg-slate-800/60 p-4"
        >
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-rose-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-lg">
                ناموجود در انبار
              </span>
            </div>
          )}
        </Link>

        {/* Content Details */}
        <div className="p-4 space-y-2.5">
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{product.category?.name || "تجهیزات برق"}</span>
            {product.brand && (
              <span className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                {product.brand}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-500 transition-colors h-10">
              {product.name}
            </h3>
          </Link>

          {/* Rating & Warranty Info */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                {toPersianDigits(product.rating || 4.9)}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                ({toPersianDigits(product.reviewCount || 0)})
              </span>
            </div>

            {product.warranty && (
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800 truncate max-w-[120px]">
                {product.warranty}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Price & Add to Cart Button */}
      <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 mt-2">
        <div className="flex items-end justify-between gap-2 pt-3">
          {/* Price Container */}
          <div className="flex flex-col">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-slate-400 line-through">
                {formatToman(product.originalPrice)}
              </span>
            )}
            <span className="font-extrabold text-base text-slate-950 dark:text-amber-400">
              {formatToman(product.price)}
            </span>
          </div>

          {/* Add To Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isOutOfStock
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                : added
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95"
            }`}
            title="افزودن به سبد خرید"
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>افزوده شد</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>خرید</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
