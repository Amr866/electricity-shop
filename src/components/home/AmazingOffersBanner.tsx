"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatToman, toPersianDigits } from "@/lib/utils";
import {
  Zap,
  ArrowLeft,
  Heart,
  ShoppingCart,
  Check,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// 1. Static Fallback Deals (Defined outside component body to eliminate GC allocations)
const FALLBACK_DEALS = [
  {
    id: "deal-1",
    name: "پنکه ایستاده کنترل‌دار پارس خزر مدل FSR-SHIBA پرقدرت و کم‌صدا",
    brand: "پارس خزر",
    categoryName: "پنکه و تهویه",
    price: 3850000,
    originalPrice: 4250000,
    discountPercent: 10,
    rating: 4.9,
    slug: "pars-khazar-standing-fan-fsr",
    image: "/images/products/wal_172619-fans-7995865_1920.jpg",
  },
  {
    id: "deal-2",
    name: "دینام و الکتروموتور کولر آبی ۳/۴ اسب موتوژن تبریز تمام مس با خازن",
    brand: "موتوژن تبریز",
    categoryName: "موتور کولر",
    price: 3450000,
    originalPrice: 3850000,
    discountPercent: 12,
    rating: 5.0,
    slug: "motogen-cooler-motor-34hp",
    image: "/images/products/موتور-کولر-موتوژن-3-4.jpg",
  },
  {
    id: "deal-3",
    name: "پمپ آب کولر آبی الکتروژن مدل البرز تمام مس ضدسوختگی",
    brand: "الکتروژن",
    categoryName: "پمپ کولر",
    price: 420000,
    originalPrice: 480000,
    discountPercent: 12,
    rating: 4.8,
    slug: "electrogen-water-pump-alborz",
    image: "/images/products/adonyig-machine-3098797_1920.jpg",
  },
  {
    id: "deal-4",
    name: "سیم برق افشان سایز ۱.۵*۱ تمام مس استاندارد البرز الکتریک کلاف ۱۰۰ متری",
    brand: "البرز الکتریک",
    categoryName: "سیم و کابل مس",
    price: 980000,
    originalPrice: 1150000,
    discountPercent: 15,
    rating: 4.9,
    slug: "copper-wire-15-alborz",
    image: "/images/products/skdunning-wire-962753_1920.jpg",
  },
];

function OfferCountdown() {
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 24, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-1.5 mb-1 justify-end">
      <span className="inline-flex items-center gap-1 bg-white/20 dark:bg-rose-500/30 text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full backdrop-blur-md shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping shrink-0" />
        <span>پیشنهاد ویژه امروز</span>
      </span>
      <span
        className="relative bg-slate-950/60 text-amber-300 font-mono text-[9px] sm:text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-400/40 shadow-xs tracking-wider ring-2 ring-amber-400/20 animate-pulse duration-[3000ms]"
        dir="ltr"
      >
        {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
      </span>
    </div>
  );
}

interface AmazingOffersBannerProps {
  products: any[];
}

export function AmazingOffersBanner({ products }: AmazingOffersBannerProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [addedDealId, setAddedDealId] = useState<string | null>(null);

  const handleAddDeal = (deal: any) => {
    addToCart(deal, 1);
    setAddedDealId(deal.id);
    setTimeout(() => setAddedDealId(null), 1800);
  };

  // Robust RTL-compatible horizontal scroll handler
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const isRTL = document.dir === "rtl" || true;
      const cardWidth = 220;
      const scrollOffset = direction === "right" 
        ? (isRTL ? cardWidth : -cardWidth) 
        : (isRTL ? -cardWidth : cardWidth);
      
      scrollContainerRef.current.scrollBy({ left: scrollOffset, behavior: "smooth" });
    }
  };

  const deals = products.length > 0 ? products : FALLBACK_DEALS;

  return (
    <section
      role="region"
      aria-label="پیشنهادهای شگفت‌انگیز فروشگاه شیاسی"
      className="bg-gradient-to-l from-amber-600 via-amber-500 to-amber-600 dark:from-amber-950 dark:via-slate-900 dark:to-slate-950 rounded-3xl p-4 sm:p-7 text-white shadow-xl shadow-amber-500/10 space-y-4 sm:space-y-6 relative overflow-hidden border border-amber-400/40 dark:border-amber-700/50 transition-colors duration-300"
    >
      {/* Subtle Background Glow Animation */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-white/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-3 relative z-10">
        {/* Left: View All & Carousel Nav Arrows */}
        <div className="flex items-center gap-2">
          <Link
            href="/products?bestseller=true"
            className="bg-white hover:bg-slate-100 dark:bg-amber-500 dark:hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl transition-all shadow-md flex items-center gap-1 active:scale-95 shrink-0"
          >
            <span>مشاهده همه</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>

          {/* Slider Controls with High Contrast Semi-transparent Glass */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll("right")}
              aria-label="کالای قبلی در لیست شگفت‌انگیز"
              className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/35 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-white flex items-center justify-center transition-all shadow-sm border border-white/20 dark:border-slate-700 active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("left")}
              aria-label="کالای بعدی در لیست شگفت‌انگیز"
              className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/35 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-white flex items-center justify-center transition-all shadow-sm border border-white/20 dark:border-slate-700 active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Amazing Offers Title & Countdown */}
        <div className="flex items-center gap-2.5 sm:gap-3 text-right">
          <div>
            <OfferCountdown />
            <h3 className="font-black text-base sm:text-2xl text-white">
              پیشنهادهای شگفت‌انگیز
            </h3>
            <p className="text-[10px] sm:text-[11px] text-white/90 dark:text-slate-300 font-medium line-clamp-1">
              تخفیف‌های محدود امروز با تحویل فوری در نجف‌آباد و اصفهان
            </p>
          </div>

          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 text-amber-500 dark:text-amber-400 flex items-center justify-center shadow-lg shrink-0 border border-amber-200/50 dark:border-amber-700/60">
            <Zap className="w-5 h-5 sm:w-7 sm:h-7 fill-amber-500 dark:fill-amber-400 text-amber-500 dark:text-amber-400" />
          </div>
        </div>
      </div>

      {/* Horizontal Interactive Carousel Slider */}
      <div
        ref={scrollContainerRef}
        role="region"
        aria-label="لیست اسلایدر محصولات شگفت‌انگیز"
        className="flex overflow-x-auto gap-3 sm:gap-4 pb-2 scrollbar-none snap-x snap-mandatory scroll-smooth relative z-10"
      >
        {deals.map((deal: any) => {
          const isFav = isInWishlist(deal.id);
          const primaryImg =
            deal.images?.[0]?.url ||
            deal.image ||
            "/images/products/wal_172619-fans-7995865_1920.jpg";

          const cleanBrand = (deal.brand || deal.category?.name || "شیاسی").replace(/\s*\(.*?\)/g, "");

          return (
            <div
              key={deal.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 text-slate-900 dark:text-white border border-white/40 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-2 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 w-[150px] sm:w-[215px] min-w-[150px] sm:min-w-[215px] shrink-0 snap-start"
            >
              <div>
                {/* Top Badges: Discount pill + Heart */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="bg-gradient-to-r from-amber-600 to-amber-500 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-xs">
                    {toPersianDigits(deal.discountPercent || 15)}٪
                  </span>

                  <button
                    onClick={() => toggleWishlist(deal)}
                    aria-label="افزودن به علاقه‌مندی‌ها"
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 active:scale-75 ${
                      isFav
                        ? "text-rose-500 bg-rose-50 dark:bg-rose-950/60 scale-105 shadow-sm shadow-rose-500/20"
                        : "text-slate-400 hover:text-rose-500 hover:scale-110 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 transition-all duration-300 ${isFav ? "fill-rose-500 animate-in zoom-in-75" : ""}`} />
                  </button>
                </div>

                {/* Isolated Photo Frame: Seamless in both Light and Dark modes */}
                <Link
                  href={`/products/${deal.slug}`}
                  className="aspect-square w-full rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 p-2 sm:p-3 flex items-center justify-center overflow-hidden block mb-1.5 shadow-2xs"
                >
                  <img
                    src={primaryImg}
                    alt={deal.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                </Link>

                {/* Brand & Name */}
                <div className="space-y-0.5 sm:space-y-1">
                  <span className="text-[9px] sm:text-[10px] text-amber-700 dark:text-amber-400 font-bold block truncate">
                    {cleanBrand}
                  </span>
                  <Link
                    href={`/products/${deal.slug}`}
                    className="font-bold text-[11px] sm:text-xs text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug h-8 sm:h-9"
                  >
                    {deal.name}
                  </Link>
                </div>

                {/* Rating */}
                <div className="pt-1 flex items-center justify-between text-[9px] sm:text-[10px]">
                  <span className="text-slate-500 dark:text-slate-400 truncate max-w-[80px]">
                    {deal.categoryName || deal.category?.name || "کالای برقی"}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400" />
                    <span>{toPersianDigits(deal.rating || 4.9)}</span>
                  </div>
                </div>

                {/* Stock Inventory Progress */}
                <div className="space-y-0.5 pt-1">
                  <div className="flex items-center justify-between text-[8.5px] font-bold text-slate-500 dark:text-slate-400">
                    <span>موجودی تخفیف:</span>
                    <span className="text-amber-600 dark:text-amber-400 font-extrabold">{toPersianDigits(deal.stock || 4)} عدد در انبار</span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full w-[70%]" />
                  </div>
                </div>
              </div>

              {/* Bottom: Cart button & Price in Toman */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                <button
                  onClick={() => handleAddDeal(deal)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center shadow-sm shrink-0 active:scale-85 ${
                    addedDealId === deal.id
                      ? "bg-emerald-600 text-white scale-110 shadow-emerald-600/30"
                      : "bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-400 dark:hover:text-slate-950 hover:scale-105"
                  }`}
                  title="افزودن به سبد"
                >
                  {addedDealId === deal.id ? (
                    <Check className="w-3.5 h-3.5 animate-in zoom-in spin-in-12" />
                  ) : (
                    <ShoppingCart className="w-3.5 h-3.5" />
                  )}
                </button>

                <div className="text-left leading-tight">
                  {deal.originalPrice && deal.originalPrice > deal.price && (
                    <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 line-through block">
                      {formatToman(deal.originalPrice)}
                    </span>
                  )}
                  <span className="font-extrabold text-[10px] sm:text-xs text-slate-950 dark:text-amber-400 block font-mono">
                    {formatToman(deal.price)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Minimalist Bottom Scroll Trackbar */}
      <div className="flex justify-center pt-0.5">
        <div className="w-20 sm:w-28 h-1 bg-white/20 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-white/60 dark:bg-amber-400/80 rounded-full w-1/3" />
        </div>
      </div>
    </section>
  );
}
