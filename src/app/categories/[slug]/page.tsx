import React, { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { ChevronLeft, Home, Layers, Sparkles, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 300;

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });
  return categories.map((c) => ({ slug: c.slug }));
}

const getCachedCategory = cache(async (slug: string) => {
  return await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { products: { where: { isArchived: false } } },
      },
    },
  });
});

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCachedCategory(slug);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shiasi-electric.ir";

  if (!category) {
    return {
      title: "دسته‌بندی یافت نشد | فروشگاه برق شیاسی نجف‌آباد",
    };
  }

  const title = `خرید انواع ${category.name} | لیست قیمت و مشخصات | فروشگاه برق شیاسی نجف‌آباد`;
  const description =
    category.description ||
    `خرید آنلاین انواع ${category.name} با بهترین قیمت، اصالت کالا و ارسال سریع در نجف‌آباد و سراسر کشور در فروشگاه و کارگاه برق شیاسی.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/categories/${category.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/categories/${category.slug}`,
      type: "website",
      siteName: "فروشگاه برق و صنعت شیاسی نجف‌آباد",
      locale: "fa_IR",
    },
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCachedCategory(slug);

  if (!category) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shiasi-electric.ir";

  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
      categoryId: category.id,
    },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      images: true,
    },
  });

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
        name: "دسته‌بندی‌های کالا",
        item: `${baseUrl}/categories`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `${baseUrl}/categories/${category.slug}`,
      },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description || `انواع ${category.name} در فروشگاه برق شیاسی`,
    url: `${baseUrl}/categories/${category.slug}`,
    numberOfItems: products.length,
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-6 sm:py-10 pb-28 sm:pb-16 transition-colors duration-200">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        {/* Breadcrumbs */}
        <nav aria-label="مسیر راهنما" className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
          <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>صفحه اصلی</span>
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <Link href="/categories" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            دسته‌بندی‌ها
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <bdi dir="rtl" className="text-slate-900 dark:text-white font-bold shrink-0">
            {category.name}
          </bdi>
        </nav>

        {/* Hero Header Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50 to-amber-50/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-amber-950/20 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black">
                <Layers className="w-3.5 h-3.5" />
                <span>دسته‌بندی تخصصی کالا</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                {category.name}
              </h1>
              {category.description ? (
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {category.description}
                </p>
              ) : (
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  مجموعه کامل و لیست قیمت انواع {category.name} با کیفیت استاندارد و ضمانت اصالت فیزیکی کالا در فروشگاه شیاسی نجف‌آباد.
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="px-4 py-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center min-w-[100px]">
                <span className="block text-2xl font-black text-amber-600 dark:text-amber-400">
                  <bdi dir="ltr">{toPersianDigits(products.length)}</bdi>
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">کالای فعال</span>
              </div>

              <Link
                href={`/products?category=${category.slug}`}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02]"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>فیلتر و جستجوی پیشرفته</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>کالاهای موجود در این دسته</span>
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                نمایش <bdi dir="ltr">{toPersianDigits(products.length)}</bdi> مورد
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 items-stretch">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              کالایی در این دسته‌بندی یافت نشد
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto font-normal">
              در حال حاضر کالایی در این بخش موجود نیست یا در حال به‌روزرسانی موجودی هستیم. می‌توانید سایر کالاهای فروشگاه را مشاهده نمایید.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity"
              >
                <span>مشاهده تمام محصولات</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
