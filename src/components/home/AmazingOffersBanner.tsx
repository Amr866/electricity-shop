"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatToman, toPersianDigits } from "@/lib/utils";
import {
  Zap,
  ArrowLeft,
  ArrowRight,
  Heart,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface AmazingOffersBannerProps {
  products: any[];
}

export function AmazingOffersBanner({ products }: AmazingOffersBannerProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Seeded / Sample Amazing Deals matching real electrical shop products
  const deals = products.length > 0 ? products : [
    {
      id: "deal-1",
      name: "پنکه ایستاده کنترل‌دار پارس خزر مدل FSR-SHIBA پرقدرت و کم‌صدا با گارانتی ۲۴ ماهه",
      brand: "پارس خزر",
      categoryName: "پنکه و تهویه",
      price: 3850000,
      originalPrice: 4250000,
      discountPercent: 10,
      rating: 4.9,
      slug: "pars-khazar-standing-fan-fsr",
      image: "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "deal-2",
      name: "دینام و الکتروموتور کولر آبی ۳/۴ اسب موتوژن تبریز تمام مس با خازن استارت",
      brand: "موتوژن تبریز",
      categoryName: "موتور کولر",
      price: 3450000,
      originalPrice: 3850000,
      discountPercent: 12,
      rating: 5.0,
      slug: "motogen-cooler-motor-34hp",
      image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "deal-3",
      name: "بخاری برقی تابشی ۳ شعله اخوان مدل فن‌دار با المنت کوارتز و کلید قطع کن خودکار",
      brand: "صنایع اخوان",
      categoryName: "بخاری برقی",
      price: 1480000,
      originalPrice: 1750000,
      discountPercent: 15,
      rating: 4.8,
      slug: "akhavan-electric-heater-fan",
      image: "https://images.unsplash.com/photo-1545259742-b43a38f38692?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "deal-4",
      name: "آنتن تلویزیون برقی گردان ۴K هانی مدل ۲۰۱ همراه با بوستر تقویت سیگنال قوی",
      brand: "هانی (Hani)",
      categoryName: "آنتن و بوستر",
      price: 490000,
      originalPrice: 580000,
      discountPercent: 16,
      rating: 4.7,
      slug: "hani-motorized-antenna-201",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "deal-5",
      name: "پروژکتور خورشیدی سرلوله ۲۰۰ وات ویمکس سنسوردار با پنل مونوکریستال و ریموت",
      brand: "ویمکس (Vimax)",
      categoryName: "روشنایی خورشیدی",
      price: 4250000,
      originalPrice: 4780000,
      discountPercent: 11,
      rating: 4.9,
      slug: "solar-street-light-200w",
      image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "deal-6",
      name: "سیم برق افشان سایز ۱.۵*۱ تمام مس استاندارد البرز الکتریک کلاف ۱۰۰ متری",
      brand: "البرز الکتریک نور",
      categoryName: "سیم و کابل مس",
      price: 980000,
      originalPrice: 1150000,
      discountPercent: 15,
      rating: 4.9,
      slug: "copper-wire-15-alborz",
      image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <section className="bg-gradient-to-l from-rose-600 via-rose-500 to-amber-500 dark:from-rose-950 dark:via-slate-900 dark:to-amber-950 rounded-3xl p-4 sm:p-7 text-white shadow-xl space-y-4 sm:space-y-6 relative overflow-hidden border border-rose-400/30 dark:border-rose-900/50 transition-colors duration-300">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-3">
        {/* Left: View All & Carousel Nav Arrows */}
        <div className="flex items-center gap-2">
          <Link
            href="/products?bestseller=true"
            className="bg-amber-400 hover:bg-amber-300 dark:bg-amber-500 dark:hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl transition-all shadow-md flex items-center gap-1 active:scale-95 shrink-0"
          >
            <span>مشاهده همه</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>

          {/* Slider Prev / Next Controls */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll("right")}
              aria-label="اسلاید قبلی"
              className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-white flex items-center justify-center transition-colors shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("left")}
              aria-label="اسلاید بعدی"
              className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-white flex items-center justify-center transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Amazing Offers Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 text-right">
          <div>
            <span className="inline-block bg-white/20 dark:bg-rose-500/30 text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full backdrop-blur-md mb-0.5 sm:mb-1">
              • فروش ویژه امروز
            </span>
            <h3 className="font-black text-base sm:text-2xl text-white">
              پیشنهادهای شگفت‌انگیز
            </h3>
            <p className="text-[10px] sm:text-[11px] text-white/90 dark:text-slate-300 font-medium line-clamp-1">
              تخفیف‌های محدود امروز را از دست ندهید
            </p>
          </div>

          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-lg shrink-0 border border-transparent dark:border-rose-900/60">
            <Zap className="w-5 h-5 sm:w-7 sm:h-7 fill-rose-600 dark:fill-rose-400" />
          </div>
        </div>
      </div>

      {/* Horizontal Interactive Carousel Slider with Smooth Touch-Scroll */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-3 sm:gap-4 pb-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
      >
        {deals.map((deal: any) => {
          const isFav = isInWishlist(deal.id);
          const primaryImg =
            deal.images?.[0]?.url ||
            deal.image ||
            "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=600&q=80";

          return (
            <div
              key={deal.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-3 sm:p-4 text-slate-900 dark:text-white border border-white/40 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-2 hover:-translate-y-1 transition-all duration-300 min-w-[160px] max-w-[175px] sm:min-w-[210px] sm:max-w-[220px] shrink-0 snap-start"
            >
              <div>
                {/* Top Badges: Discount pill + Heart */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="bg-rose-500 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-sm">
                    {toPersianDigits(deal.discountPercent || 15)}٪
                  </span>

                  <button
                    onClick={() => toggleWishlist(deal)}
                    aria-label="افزودن به علاقه‌مندی‌ها"
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      isFav
                        ? "text-rose-500 bg-rose-50 dark:bg-rose-950/60"
                        : "text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-rose-500" : ""}`} />
                  </button>
                </div>

                {/* Image */}
                <Link
                  href={`/products/${deal.slug}`}
                  className="aspect-square w-full rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/80 p-2 sm:p-3 flex items-center justify-center overflow-hidden block mb-1.5"
                >
                  <img
                    src={primaryImg}
                    alt={deal.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Brand & Name */}
                <div className="space-y-0.5 sm:space-y-1">
                  <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-semibold block truncate">
                    {deal.brand || deal.category?.name || "شیاسی"}
                  </span>
                  <Link
                    href={`/products/${deal.slug}`}
                    className="font-bold text-[11px] sm:text-xs text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug h-8 sm:h-9"
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
              </div>

              {/* Bottom: Cart button & Price in Toman */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                <button
                  onClick={() => addToCart(deal, 1)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-400 dark:hover:text-slate-950 flex items-center justify-center transition-all shadow-sm shrink-0"
                  title="افزودن به سبد"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                </button>

                <div className="text-left leading-tight">
                  {deal.originalPrice && deal.originalPrice > deal.price && (
                    <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 line-through block">
                      {formatToman(deal.originalPrice)}
                    </span>
                  )}
                  <span className="font-extrabold text-[10px] sm:text-xs text-slate-950 dark:text-amber-400 block">
                    {formatToman(deal.price)}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
