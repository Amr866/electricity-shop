import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HeroBanner } from "@/components/home/HeroBanner";
import { TrustFeaturesBar } from "@/components/home/TrustFeaturesBar";
import { AmazingOffersBanner } from "@/components/home/AmazingOffersBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductCard } from "@/components/product/ProductCard";
import { RepairWorkshopSection } from "@/components/home/RepairWorkshopSection";
import { ElectricalCableCalculator } from "@/components/tools/ElectricalCableCalculator";
import { IsfahanBanner } from "@/components/home/IsfahanBanner";
import { BomCallToActionBanner } from "@/components/home/BomCallToActionBanner";
import { BrandLogosRow } from "@/components/home/BrandLogosRow";
import { KnowledgeBaseSection } from "@/components/home/KnowledgeBaseSection";
import { CustomerReviewsSection } from "@/components/home/CustomerReviewsSection";
import {
  Sparkles,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

export const revalidate = 60; // ISR cache for 60 seconds

const FALLBACK_REVIEWS = [
  {
    id: "rev-1",
    authorName: "حاج احمد امینی",
    city: "نجف‌آباد",
    rating: 5,
    comment: "پنکه ایستاده ۵ پره پارس خزر عالی و بی‌صدا، تحویل فوری در نجف‌آباد با اخلاق عالی مدیریت شیاسی.",
    product: { name: "پنکه ایستاده ۵ پره ریموت‌دار پارس خزر", slug: "pars-khazar-fan-5blade" },
  },
  {
    id: "rev-2",
    authorName: "مهندس رضا کریمی",
    city: "اصفهان (پیمانکار برق)",
    rating: 5,
    comment: "برای پروژه ساختمانی کلاف‌های سیم تمام مس البرز و فیوز دنا سفارش دادم؛ مس ۱۰۰٪ خالص و ارسال بسیار سریع بود.",
    product: { name: "سیم افشان ۲.۵ تمام مس البرز الکتریک", slug: "wire-2-5" },
  },
  {
    id: "rev-3",
    authorName: "علیرضا یوسفی",
    city: "ویلاشهر نجف‌آباد",
    rating: 5,
    comment: "موتور کولر آبی ۳/۴ موتوژن رو حضوری در کارگاه تست کردند و تحویل دادند. گارانتی معتبر و قیمت بسیار منصفانه.",
    product: { name: "موتور کولر آبی ۳/۴ اسب موتوژن تبریز", slug: "motogen-cooler-motor-3-4" },
  },
];

async function getHomeData() {
  try {
    const [categories, featuredProducts, discountedProducts, dbReviews] =
      await Promise.all([
        prisma.category.findMany({
          take: 6,
          include: { _count: { select: { products: true } } },
        }),
        prisma.product.findMany({
          where: {
            OR: [{ isFeatured: true }, { isBestSeller: true }],
          },
          include: {
            category: true,
            images: true,
          },
          take: 8,
        }),
        prisma.product.findMany({
          where: { discountPercent: { gt: 0 } },
          include: {
            category: true,
            images: true,
          },
          take: 6,
        }),
        prisma.review.findMany({
          take: 3,
          orderBy: { createdAt: "desc" },
          include: {
            product: {
              select: { name: true, slug: true },
            },
          },
        }),
      ]);

    const finalReviews = dbReviews.length >= 3 ? dbReviews : [
      ...dbReviews,
      ...FALLBACK_REVIEWS.slice(0, 3 - dbReviews.length),
    ];

    return {
      categories,
      featuredProducts,
      discountedProducts,
      reviews: finalReviews,
    };
  } catch (error) {
    console.error("Error fetching home data:", error);
    return {
      categories: [],
      featuredProducts: [],
      discountedProducts: [],
      reviews: FALLBACK_REVIEWS,
    };
  }
}

export default async function HomePage() {
  const {
    categories,
    featuredProducts,
    discountedProducts,
    reviews,
  } = await getHomeData();

  return (
    <div className="space-y-6 sm:space-y-10 pb-16">
      {/* 1. Hero Promotional Area */}
      <HeroBanner />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 space-y-6 sm:space-y-10">
        {/* 2. Trust Value Props */}
        <TrustFeaturesBar />

        {/* 3. Amazing Offers (شگفت‌انگیزها) */}
        {discountedProducts.length > 0 && (
          <AmazingOffersBanner products={discountedProducts} />
        )}

        {/* 4. Browse by Visual Category Grid */}
        <CategoryGrid categories={categories} />

        {/* 5. Unified Featured & Best Selling Products Grid */}
        {featuredProducts.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white">
                  محصولات منتخب و پرفروش شیاسی
                </h2>
              </div>
              <Link
                href="/products"
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                <span>مشاهده همه محصولات</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 items-stretch">
              {featuredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}

        {/* 6. Special Najafabad Electrical Repair Workshop Section */}
        <RepairWorkshopSection />

        {/* 7. Interactive Engineering Cable & Wire Calculator Tool */}
        <ElectricalCableCalculator />

        {/* 8. Local Fast Delivery in Najafabad & Google Maps Location */}
        <IsfahanBanner />

        {/* 9. Call to Action: BOM Upload for Contractors & Electricians */}
        <BomCallToActionBanner />

        {/* 10. Brand Logos Row */}
        <BrandLogosRow />

        {/* 11. Lighting & Electronics Knowledge Base */}
        <KnowledgeBaseSection />

        {/* 12. Modular Customer Reviews & Feedback */}
        <CustomerReviewsSection reviews={reviews} />
      </div>
    </div>
  );
}
