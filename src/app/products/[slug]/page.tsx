import React, { cache, Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDetailView, type ProductDetailData } from "@/components/product/ProductDetailView";
import { ProductCard } from "@/components/product/ProductCard";
import { ChevronLeft, Zap } from "lucide-react";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isArchived: false },
    select: { slug: true },
  });
  return products.map((p) => ({ slug: p.slug }));
}

// React.cache for request-scoped deduplication across metadata & page rendering
const getCachedProduct = cache(async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: true,
      specs: true,
      reviews: {
        where: { isVerified: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!product || product.isArchived) return null;
  return product;
});

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCachedProduct(slug);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shiasi-electric.ir";

  if (!product) {
    return {
      title: "کالای مورد نظر یافت نشد | فروشگاه تخصصی شیاسی",
    };
  }

  return {
    title: `${product.name} | فروشگاه شیاسی نجف‌آباد`,
    description: product.shortDesc || product.description.slice(0, 160),
    alternates: {
      canonical: `${baseUrl}/products/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.shortDesc || product.description.slice(0, 160),
      url: `${baseUrl}/products/${product.slug}`,
      siteName: "فروشگاه تخصصی شیاسی",
      locale: "fa_IR",
      type: "website",
    },
  };
}

async function RelatedProductsSection({
  categoryId,
  currentProductId,
  categorySlug,
}: {
  categoryId: string;
  currentProductId: string;
  categorySlug: string;
}) {
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId,
      id: { not: currentProductId },
      isArchived: false,
    },
    take: 4,
    include: {
      category: true,
      images: true,
    },
  });

  if (relatedProducts.length === 0) return null;

  return (
    <div className="pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <span>کالاهای مرتبط و مکمل</span>
        </h2>
        <Link
          href={`/products?category=${categorySlug}`}
          className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
        >
          مشاهده همه موارد این دسته
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 items-stretch">
        {relatedProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

function RelatedProductsSkeleton() {
  return (
    <div className="pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800 animate-pulse space-y-4">
      <div className="h-6 bg-slate-200 dark:bg-slate-850 rounded-md w-48" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getCachedProduct(slug);

  if (!product) {
    notFound();
  }

  // Schema.org JSON-LD Structured Data for Google Rich Snippets
  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c";

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shiasi-electric.ir";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((img) => img.url),
    description: product.shortDesc || product.description,
    sku: product.sku || product.id,
    mpn: product.mpn || product.sku || product.id,
    brand: {
      "@type": "Brand",
      name: product.brand || "فروشگاه تخصصی شیاسی",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/products/${product.slug}`,
      priceCurrency: "IRR",
      price: product.price * 10, // Rials in Schema.org
      priceValidUntil: "2026-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "فروشگاه تخصصی شیاسی نجف‌آباد",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating || 4.8,
      reviewCount: Math.max(product.reviewCount || 1, 1),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "صفحه اصلی",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "کاتالوگ محصولات",
        item: `${baseUrl}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category.name,
        item: `${baseUrl}/categories/${product.category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `${baseUrl}/products/${product.slug}`,
      },
    ],
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-6 sm:py-8 pb-32 sm:pb-12 transition-colors duration-200">
      {/* Inject JSON-LD Schema.org markup for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 space-y-6 sm:space-y-8">
        
        {/* Breadcrumb Bar */}
        <nav aria-label="مسیر راهنما" className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
          <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            صفحه اصلی
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
          <Link href="/products" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            کاتالوگ محصولات
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
          <Link
            href={`/products?category=${product.category.slug}`}
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            {product.category.name}
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
          <bdi dir="rtl" className="text-slate-900 dark:text-white font-bold shrink-0">
            {product.name}
          </bdi>
        </nav>

        {/* Main Product Component */}
        <ProductDetailView product={product as ProductDetailData} />

        {/* Streaming Related Products Section */}
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProductsSection
            categoryId={product.categoryId}
            currentProductId={product.id}
            categorySlug={product.category.slug}
          />
        </Suspense>

      </div>
    </div>
  );
}
