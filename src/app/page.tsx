import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HeroBanner } from "@/components/home/HeroBanner";
import { TrustFeaturesBar } from "@/components/home/TrustFeaturesBar";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { RepairWorkshopSection } from "@/components/home/RepairWorkshopSection";
import { AmazingOffersBanner } from "@/components/home/AmazingOffersBanner";
import { BrandLogosRow } from "@/components/home/BrandLogosRow";
import { KnowledgeBaseSection } from "@/components/home/KnowledgeBaseSection";
import { IsfahanBanner } from "@/components/home/IsfahanBanner";
import { BomCallToActionBanner } from "@/components/home/BomCallToActionBanner";
import { ElectricalCableCalculator } from "@/components/tools/ElectricalCableCalculator";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowLeft, Star, Sparkles, TrendingUp } from "lucide-react";

// Server Component: Fetch Data directly from PostgreSQL
async function getHomeData() {
  try {
    const [categories, featuredProducts, bestSellers, discountedProducts, reviews] =
      await Promise.all([
        prisma.category.findMany({
          orderBy: { sortOrder: "asc" },
          include: {
            _count: {
              select: { products: true },
            },
          },
        }),
        prisma.product.findMany({
          where: { isFeatured: true },
          include: {
            category: true,
            images: true,
          },
          take: 8,
        }),
        prisma.product.findMany({
          where: { isBestSeller: true },
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

    return {
      categories,
      featuredProducts,
      bestSellers,
      discountedProducts,
      reviews,
    };
  } catch (error) {
    console.error("Error fetching home data:", error);
    return {
      categories: [],
      featuredProducts: [],
      bestSellers: [],
      discountedProducts: [],
      reviews: [],
    };
  }
}

export default async function HomePage() {
  const {
    categories,
    featuredProducts,
    bestSellers,
    discountedProducts,
    reviews,
  } = await getHomeData();

  return (
    <div className="space-y-5 sm:space-y-8 pb-12 transition-colors duration-200">
      {/* 1. Hero Section for Shiasi Store Najafabad */}
      <HeroBanner />

      {/* 2. Slim 4-Item Trust Ribbon (Directly Below Hero) */}
      <TrustFeaturesBar />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 space-y-5 sm:space-y-8">
        {/* 3. Amazing Offers & Special Discounts Carousel */}
        <AmazingOffersBanner products={discountedProducts} />

        {/* 4. Core Categories Grid (2x2 on Mobile with Real Photos) */}
        <CategoryGrid categories={categories} />

        {/* 5. Best Selling Products Section (Touch-scrollable on mobile) */}
        <section className="py-5 sm:py-8 bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 sm:space-y-6 transition-colors duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h2 className="text-base sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  پرفروش‌ترین کالاها و تجهیزات برقی
                </h2>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                اقلام پرمصرف و پرفروش مشتریان در نجف‌آباد و سراسر کشور
              </p>
            </div>

            <Link
              href="/products?bestseller=true"
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 group"
            >
              <span>مشاهده همه پرفروش‌ها</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Touch-Scrollable Products Carousel on Mobile, 4-col Grid on Desktop */}
          <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 pb-2 sm:pb-0 scrollbar-thin">
            {bestSellers.map((product) => (
              <div
                key={product.id}
                className="min-w-[155px] max-w-[170px] sm:min-w-0 sm:max-w-none shrink-0 sm:shrink flex flex-col"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* 6. Dedicated Repair Workshop Showcase */}
        <RepairWorkshopSection />

        {/* 7. Interactive Electrical Cable & Fuse Breaker Calculator */}
        <ElectricalCableCalculator />

        {/* 8. Local Fast Delivery in Najafabad & Google Maps Location */}
        <IsfahanBanner />

        {/* 9. Call to Action: BOM Upload for Contractors & Electricians */}
        <BomCallToActionBanner />

        {/* 9. Brand Logos Row */}
        <BrandLogosRow />

        {/* 10. Lighting & Electronics Knowledge Base */}
        <KnowledgeBaseSection />

        {/* 11. Customer Reviews & Feedback */}
        {reviews.length > 0 && (
          <section className="py-4 sm:py-6">
            <div className="text-center max-w-xl mx-auto mb-5 sm:mb-8">
              <h2 className="text-base sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                <span>نظرات مشتریان و خریداران</span>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">
                تجربه خرید و استفاده از خدمات فنی و تعمیرات فروشگاه شیاسی
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors duration-200"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                          {rev.authorName.slice(0, 1)}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                            {rev.authorName}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {rev.city || "نجف‌آباد"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                      «{rev.comment}»
                    </p>
                  </div>

                  {rev.product && (
                    <div className="pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      <span className="truncate max-w-[180px]">
                        کالا: {rev.product.name}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                        خرید تایید شده
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
