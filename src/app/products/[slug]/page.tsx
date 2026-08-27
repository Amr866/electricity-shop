import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { ProductCard } from "@/components/product/ProductCard";
import { ChevronLeft, Zap } from "lucide-react";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return {
      title: "کالای مورد نظر یافت نشد | فروشگاه تخصصی شیاسی",
    };
  }

  return {
    title: `${product.name} | فروشگاه شیاسی نجف‌آباد`,
    description: product.shortDesc || product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDesc || product.description.slice(0, 160),
      url: `https://shiasi-store.ir/products/${product.slug}`,
      siteName: "فروشگاه تخصصی شیاسی",
      locale: "fa_IR",
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: true,
      specs: true,
      reviews: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products from the same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 4,
    include: {
      category: true,
      images: true,
    },
  });

  // Schema.org JSON-LD Structured Data for Google Rich Snippets
  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c";

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
      url: `https://shiasi-store.ir/products/${product.slug}`,
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

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8 transition-colors duration-200">
      {/* Inject JSON-LD Schema.org markup for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Breadcrumb Bar */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            صفحه اصلی
          </Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            کاتالوگ محصولات
          </Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <Link
            href={`/products?category=${product.category.slug}`}
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            {product.category.name}
          </Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-white font-semibold truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Main Product Component */}
        <ProductDetailView product={product as any} />

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span>کالاهای مرتبط و مکمل</span>
              </h2>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                مشاهده همه موارد این دسته
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
