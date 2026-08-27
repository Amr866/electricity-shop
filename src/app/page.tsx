import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EdisonHeroBanner } from "@/components/home/EdisonHeroBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { LightingWizard } from "@/components/home/LightingWizard";
import { InteractiveHomeCatalog } from "@/components/home/InteractiveHomeCatalog";
import { ConsultationBanner } from "@/components/home/ConsultationBanner";
import { SpecialOffers } from "@/components/home/SpecialOffers";
import { BrandLogosRow } from "@/components/home/BrandLogosRow";
import { KnowledgeBaseSection } from "@/components/home/KnowledgeBaseSection";
import { IsfahanBanner } from "@/components/home/IsfahanBanner";
import { ProductCard } from "@/components/product/ProductCard";
import { Zap, ArrowLeft, Star, Sparkles, TrendingUp } from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

// Server Component: Fetch Data directly from PostgreSQL
async function getHomeData() {
  try {
    const [categories, allProducts, featuredProducts, bestSellers, discountedProducts, reviews] =
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
          orderBy: { createdAt: "desc" },
          include: {
            category: true,
            images: true,
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
          take: 4,
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
      allProducts,
      featuredProducts,
      bestSellers,
      discountedProducts,
      reviews,
    };
  } catch (error) {
    console.error("Error fetching home data:", error);
    return {
      categories: [],
      allProducts: [],
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
    allProducts,
    featuredProducts,
    bestSellers,
    discountedProducts,
    reviews,
  } = await getHomeData();

  return (
    <div className="space-y-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* 1. Edisonkala-Style 3-Piece Hero Banner & 5 Trust Badges */}
        <EdisonHeroBanner />

        {/* 2. Core Categories Grid */}
        <CategoryGrid categories={categories} />

        {/* 3. Edisonkala-Style Smart Lighting Selection Wizard */}
        <LightingWizard />

        {/* 4. Instant Live Tab Filtered All Items Catalog */}
        <InteractiveHomeCatalog products={allProducts} categories={categories} />

        {/* 5. Specialist Technical Consultation & Multi-line Support */}
        <ConsultationBanner />

        {/* 6. Special Offers & Discounts Section */}
        <SpecialOffers products={discountedProducts} />

        {/* 7. Bestselling Products Section */}
        <section className="py-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  پرفروش‌ترین تجهیزات برقی و قطعات
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                اقلام پرمصرف پروژه‌های ساختمانی، اتوماسیون صنعتی و پروژه‌های الکترونیک
              </p>
            </div>

            <Link
              href="/products?bestseller=true"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group"
            >
              <span>مشاهده همه پرفروش‌ها</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 8. Reputable Brand Logos Row */}
        <BrandLogosRow />

        {/* 9. Lighting & Electronics Knowledge Base / Blog */}
        <KnowledgeBaseSection />

        {/* 10. Local Fast Delivery & Nationwide Shipping Banner */}
        <IsfahanBanner />

        {/* 11. Customer Reviews & Ratings */}
        {reviews.length > 0 && (
          <section className="py-6">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
                <span>نظرات مشتریان و برق‌کاران</span>
                <Sparkles className="w-5 h-5 text-amber-500" />
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                تجربه خرید مهندسین، کارفرمایان و خریداران محترم
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                          {rev.authorName.slice(0, 1)}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">
                            {rev.authorName}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {rev.city || "اصفهان"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed text-justify">
                      «{rev.comment}»
                    </p>
                  </div>

                  {rev.product && (
                    <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                      <span className="truncate max-w-[200px]">
                        کالا: {rev.product.name}
                      </span>
                      <span className="text-emerald-600 font-semibold text-[10px]">
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
