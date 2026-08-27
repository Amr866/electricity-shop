"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatToman, toPersianDigits } from "@/lib/utils";
import {
  Zap,
  Flame,
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Check,
} from "lucide-react";

interface AmazingOffersBannerProps {
  products: any[];
}

export function AmazingOffersBanner({ products }: AmazingOffersBannerProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Seeded / Sample Amazing Deals matching Screenshot 3
  const deals = products.length > 0 ? products : [
    {
      id: "deal-1",
      name: "چراغ پارکی و خیابانی سرلوله خورشیدی ۲۰۰ وات ویمکس سنسوردار با ۲ سال ضمانت",
      brand: "ویمکس (Vimax)",
      categoryName: "پروژکتور خورشیدی",
      price: 4520000,
      originalPrice: 4787400,
      discountPercent: 5,
      rating: 4.8,
      slug: "solar-street-light-200w",
      image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "deal-2",
      name: "باتری شارژی Ni-MH قلم AA ظرفیت ۲۰۰۰mAh ولتاژ ۱.۲V مدل DM Cell",
      brand: "دی‌ام سل",
      categoryName: "باتری",
      price: 165000,
      originalPrice: 220000,
      discountPercent: 25,
      rating: 5.0,
      slug: "aa-rechargeable-battery",
      image: "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "deal-3",
      name: "محافظ جان تک فاز ۳۲ آمپر فراز (الکتروکاوه) RCCB استاندارد",
      brand: "فراز الکتروکاوه",
      categoryName: "محافظ جان و فیوز",
      price: 1615000,
      originalPrice: 1699000,
      discountPercent: 5,
      rating: 4.9,
      slug: "rccb-single-phase-32a",
      image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "deal-4",
      name: "پنل سنسوردار شاهچراغ ۲۴ وات روژان | چراغ روکار سنسوردار با دو سال ضمانت",
      brand: "صنایع روشنایی شاهچراغ",
      categoryName: "پنل LED",
      price: 1039500,
      originalPrice: 1314000,
      discountPercent: 21,
      rating: 4.7,
      slug: "shahcheraq-sensor-panel-24w",
      image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "deal-5",
      name: "چراغ چشمی توکار ۳ وات لنزدار گرد شاهچراغ سانتی‌متر | گارانتی تعویض",
      brand: "شاهچراغ پارسیان",
      categoryName: "روشنایی فضاهای خاص",
      price: 64000,
      originalPrice: 68500,
      discountPercent: 7,
      rating: 4.6,
      slug: "spotlight-3w-shahcheraq",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <section className="bg-gradient-to-l from-rose-600 via-rose-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: View All Button */}
        <Link
          href="/products?bestseller=true"
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl transition-all shadow-md flex items-center gap-1.5 active:scale-95"
        >
          <span>مشاهده همه</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>

        {/* Right: Amazing Offers Title */}
        <div className="flex items-center gap-3 text-right">
          <div>
            <span className="inline-block bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full backdrop-blur-md mb-1">
              • فروش ویژه امروز
            </span>
            <h3 className="font-black text-xl sm:text-2xl text-white">
              پیشنهادهای شگفت‌انگیز
            </h3>
            <p className="text-[11px] text-white/90 font-medium">
              تخفیف‌های محدود امروز را از دست ندهید
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white text-rose-600 flex items-center justify-center shadow-lg shrink-0">
            <Zap className="w-7 h-7 fill-rose-600" />
          </div>
        </div>

      </div>

      {/* Horizontal Carousel Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {deals.map((deal: any) => {
          const isFav = isInWishlist(deal.id);
          const primaryImg =
            deal.images?.[0]?.url ||
            deal.image ||
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80";

          return (
            <div
              key={deal.id}
              className="group bg-white rounded-3xl p-4 text-slate-900 border border-white/40 shadow-lg flex flex-col justify-between space-y-3 hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                {/* Top Badges: Discount pill + Heart */}
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-rose-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm">
                    {toPersianDigits(deal.discountPercent || 15)}٪
                  </span>

                  <button
                    onClick={() => toggleWishlist(deal)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      isFav
                        ? "text-rose-500 bg-rose-50"
                        : "text-slate-400 hover:text-rose-500 hover:bg-slate-100"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500" : ""}`} />
                  </button>
                </div>

                {/* Image */}
                <Link
                  href={`/products/${deal.slug}`}
                  className="aspect-square w-full rounded-2xl bg-slate-50 p-3 flex items-center justify-center overflow-hidden block mb-2"
                >
                  <img
                    src={primaryImg}
                    alt={deal.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Brand & Name */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold block">
                    {deal.brand || deal.category?.name || "روشنایی"}
                  </span>
                  <Link
                    href={`/products/${deal.slug}`}
                    className="font-extrabold text-xs text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-2 leading-snug h-8"
                  >
                    {deal.name}
                  </Link>
                </div>

                {/* Category tag pill */}
                <div className="pt-1.5 flex items-center justify-between">
                  <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {deal.categoryName || deal.category?.name || "کالای برق"}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{toPersianDigits(deal.rating || 4.9)}</span>
                  </div>
                </div>
              </div>

              {/* Bottom: Cart button & Price in Toman */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => addToCart(deal, 1)}
                  className="w-8 h-8 rounded-xl bg-amber-100 hover:bg-amber-500 text-amber-800 hover:text-slate-950 flex items-center justify-center transition-all shadow-sm"
                  title="افزودن به سبد"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>

                <div className="text-left">
                  {deal.originalPrice && deal.originalPrice > deal.price && (
                    <span className="text-[10px] text-slate-400 line-through block">
                      {formatToman(deal.originalPrice)}
                    </span>
                  )}
                  <span className="font-black text-xs sm:text-sm text-slate-950 block">
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
