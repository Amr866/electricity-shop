"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  ShieldCheck,
} from "lucide-react";

// 1. Static Module Helpers (Extracted outside component function to eliminate in-render regex and calculations)
function formatBrandName(brand?: string | null): string {
  if (!brand) return "";
  return brand.replace(/\s*\(.*?\)/g, "").trim();
}

function getPriceUnit(name: string, categorySlug?: string): string | null {
  if (name.includes("کلاف")) return "/کلاف";

  // If categorySlug is available, it MUST match wiring or cable
  if (categorySlug) {
    const isWiringCategory =
      categorySlug.includes("wiring") ||
      categorySlug.includes("cable") ||
      categorySlug.includes("wire");
    if (!isWiringCategory) return null;
  }

  // Exclude motor winding, motors, fans, heaters, and appliances
  if (
    name.includes("سیم‌پیچ") ||
    name.includes("سیمپیچ") ||
    name.includes("موتور") ||
    name.includes("پمپ") ||
    name.includes("پنکه") ||
    name.includes("بخاری")
  ) {
    return null;
  }

  const isCableOrWireName =
    (name.includes("کابل") && !name.includes("کولر")) ||
    name.startsWith("سیم ") ||
    name.includes("سیم نایلون") ||
    name.includes("سیم افشان") ||
    name.includes("سیم مفتول") ||
    name.includes("سیم ارت");

  if (isCableOrWireName) {
    return "/متر";
  }
  return null;
}

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

  const [imageError, setImageError] = useState(false);

  const primaryImage = imageError
    ? "/images/products/wal_172619-fans-7995865_1920.jpg"
    : product.images?.find((img) => img.isPrimary)?.url ||
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
  const brandLabel = formatBrandName(product.brand);
  const priceUnit = getPriceUnit(product.name, product.category?.slug);

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 dark:hover:shadow-amber-500/15 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden">
      
      {/* Top Section: Badges, Wishlist & Image */}
      <div className="flex-1 flex flex-col">
        {/* Product Image Frame: Clean Soft Background in both Light and Dark Modes */}
        <div className="relative m-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 overflow-hidden aspect-square flex items-center justify-center p-3">
          
          {/* Top-Right Badge: Discount or Best Seller */}
          <div className="absolute top-2 right-2 z-10">
            {product.discountPercent && product.discountPercent > 0 ? (
              <span className="bg-gradient-to-r from-amber-600 to-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                {toPersianDigits(product.discountPercent)}٪ تخفیف
              </span>
            ) : product.isBestSeller ? (
              <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5 fill-slate-950" />
                پرفروش
              </span>
            ) : null}
          </div>

          {/* Wishlist Heart Button with Elastic Spring Pop */}
          <button
            type="button"
            onClick={handleToggleFav}
            aria-label={`افزودن ${product.name} به علاقه‌مندی‌ها`}
            className={`absolute top-2 left-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm active:scale-75 ${
              isFavorited
                ? "bg-rose-50 dark:bg-rose-950 text-rose-500 border border-rose-200 dark:border-rose-800 scale-105 shadow-rose-500/20"
                : "bg-white/90 dark:bg-slate-900/90 text-slate-400 dark:text-slate-300 hover:text-rose-500 hover:scale-110 border border-slate-200/80 dark:border-slate-700 backdrop-blur-sm"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 transition-all duration-300 ${isFavorited ? "fill-rose-500 text-rose-500 animate-in zoom-in-75" : ""}`} />
          </button>

          {/* Product Image Link */}
          <Link href={`/products/${product.slug}`} className="relative w-full h-full block">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-2 group-hover:scale-108 transition-transform duration-500 ease-out"
              loading="lazy"
              onError={() => setImageError(true)}
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

        {/* Content Details (Flex-1 to keep spacing balanced across all cards) */}
        <div className="px-3.5 pb-2 sm:px-4 space-y-2 flex-1 flex flex-col justify-between">
          <div>
            {/* Category & Brand Tags */}
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 gap-1 mb-1">
              <span className="truncate">{product.category?.name || "تجهیزات برق"}</span>
              {brandLabel && (
                <span className="font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200/60 dark:border-amber-800/60 shrink-0">
                  {brandLabel}
                </span>
              )}
            </div>

            {/* Product Title (Locked to consistent 2-line height) */}
            <Link href={`/products/${product.slug}`} className="block">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-500 transition-colors h-8 sm:h-10">
                {product.name}
              </h3>
            </Link>
          </div>

          {/* Rating & Warranty / Delivery Badge */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 pt-1 min-h-[22px] gap-1">
            <div className="flex items-center gap-1 text-amber-500 shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-700 dark:text-slate-300 text-[10px] sm:text-[11px]">
                {toPersianDigits(product.rating || 4.9)}
              </span>
            </div>

            {product.warranty ? (
              <span className="text-[9px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800 shrink-0 flex items-center gap-0.5 max-w-[95px] sm:max-w-[130px]">
                <ShieldCheck className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate">{product.warranty}</span>
              </span>
            ) : product.isIsfahanFast ? (
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-bold shrink-0">
                <Truck className="w-2.5 h-2.5" />
                <span>ارسال فوری</span>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Bottom Section: Price & Add to Cart Action (Locked with mt-auto to strictly align across all grid cards) */}
      <div className="p-3.5 sm:p-4 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-auto">
        <div className="flex items-center justify-between gap-1.5 pt-2.5">
          {/* Price Container */}
          <div className="flex flex-col min-h-[34px] justify-center">
            {product.originalPrice && product.originalPrice > product.price ? (
              <span className="text-[10px] sm:text-[11px] text-slate-400 line-through leading-none mb-0.5">
                {formatToman(product.originalPrice)}
              </span>
            ) : null}
            <div className="flex items-baseline gap-1">
              <span className="font-black text-xs sm:text-sm lg:text-base text-slate-950 dark:text-amber-400 font-mono">
                {formatToman(product.price)}
              </span>
              {priceUnit && (
                <span className="text-[8.5px] sm:text-[9px] text-slate-500 dark:text-slate-400 font-normal">
                  {priceUnit}
                </span>
              )}
            </div>
          </div>

          {/* Spring Pop Add To Cart CTA Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={`افزودن ${product.name} به سبد خرید`}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-1 shadow-sm active:scale-85 shrink-0 ${
              isOutOfStock
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                : added
                ? "bg-emerald-600 text-white shadow-emerald-600/30 scale-105 animate-in zoom-in-95"
                : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 hover-glow hover:scale-105"
            }`}
            title="افزودن به سبد خرید"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 animate-in zoom-in spin-in-12" />
                <span className="text-[11px]" aria-live="polite">ثبت شد</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                <span className="text-[11px]">خرید</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
