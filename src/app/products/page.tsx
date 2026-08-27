import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { MobileSearchFilterBar } from "@/components/product/MobileSearchFilterBar";
import {
  SlidersHorizontal,
  Search,
  Zap,
  Check,
  Truck,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: string;
    instock?: string;
    fast?: string;
    brand?: string;
    featured?: string;
    bestseller?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const categorySlug = params.category;
  const searchQuery = params.q;
  const sortBy = params.sort || "newest";
  const inStockOnly = params.instock === "true";
  const fastDeliveryOnly = params.fast === "true";
  const brandFilter = params.brand;
  const featuredOnly = params.featured === "true";
  const bestSellerOnly = params.bestseller === "true";

  // Build Prisma where clause with PostgreSQL case-insensitivity
  const where: any = {};

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery, mode: "insensitive" } },
      { description: { contains: searchQuery, mode: "insensitive" } },
      { shortDesc: { contains: searchQuery, mode: "insensitive" } },
      { brand: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  if (inStockOnly) {
    where.stock = { gt: 0 };
  }

  if (fastDeliveryOnly) {
    where.isIsfahanFast = true;
  }

  if (brandFilter) {
    where.brand = brandFilter;
  }

  if (featuredOnly) {
    where.isFeatured = true;
  }

  if (bestSellerOnly) {
    where.isBestSeller = true;
  }

  // Build orderBy (Default: newest)
  let orderBy: any = { createdAt: "desc" };
  if (sortBy === "cheapest") orderBy = { price: "asc" };
  else if (sortBy === "expensive") orderBy = { price: "desc" };
  else if (sortBy === "bestseller") orderBy = { isBestSeller: "desc" };
  else if (sortBy === "rating") orderBy = { rating: "desc" };

  // Fetch products, categories, and unique brands
  const [products, categories, allProductsForBrands] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        images: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    }),
    prisma.product.findMany({
      select: { brand: true },
      where: { brand: { not: null } },
      distinct: ["brand"],
    }),
  ]);

  const uniqueBrands = allProductsForBrands
    .map((p) => p.brand)
    .filter(Boolean) as string[];

  const currentCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-4 sm:py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 space-y-4 sm:space-y-6">
        
        {/* 1. Mobile Search & Filter Action Bar (Digikala style) */}
        <MobileSearchFilterBar
          categories={categories as any}
          brands={uniqueBrands}
          totalProductsCount={products.length}
        />

        {/* 2. Desktop Header Bar (Breadcrumb & Sorting Tabs) */}
        <div className="hidden lg:flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {currentCategory ? currentCategory.name : "کاتالوگ جامع تجهیزات و قطعات برقی"}
              </h1>
              <span className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                {toPersianDigits(products.length)} کالا
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {currentCategory
                ? currentCategory.description || "تجهیزات و قطعات اصلی با ضمانت فروشگاه شیاسی"
                : "تجهیزات روشنایی، سیم و کابل استاندارد، لوازم سرمایش و گرمایش، و بردهای الکترونیک"}
            </p>
          </div>

          {/* Desktop Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              مرتب‌سازی بر اساس:
            </span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <Link
                href={{
                  pathname: "/products",
                  query: { ...params, sort: "newest" },
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  sortBy === "newest"
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                جدیدترین
              </Link>
              <Link
                href={{
                  pathname: "/products",
                  query: { ...params, sort: "bestseller" },
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  sortBy === "bestseller"
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                پرفروش‌ترین
              </Link>
              <Link
                href={{
                  pathname: "/products",
                  query: { ...params, sort: "cheapest" },
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  sortBy === "cheapest"
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                ارزان‌ترین
              </Link>
              <Link
                href={{
                  pathname: "/products",
                  query: { ...params, sort: "expensive" },
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  sortBy === "expensive"
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                گران‌ترین
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Main Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Desktop Sidebar Filters (Hidden on Mobile) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-5">
            
            {/* Active Filters & Reset */}
            {(categorySlug || searchQuery || inStockOnly || fastDeliveryOnly || brandFilter) && (
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-300">
                  <span>فیلترهای فعال</span>
                  <Link
                    href="/products"
                    className="text-[11px] text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-0.5"
                  >
                    <RotateCcw className="w-3 h-3" />
                    حذف فیلترها
                  </Link>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {currentCategory && (
                    <span className="bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md">
                      دسته: {currentCategory.name}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md">
                      جستجو: {searchQuery}
                    </span>
                  )}
                  {brandFilter && (
                    <span className="bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md">
                      برند: {brandFilter}
                    </span>
                  )}
                  {inStockOnly && (
                    <span className="bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md">
                      فقط کالاهای موجود
                    </span>
                  )}
                  {fastDeliveryOnly && (
                    <span className="bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md">
                      ارسال فوری نجف‌آباد
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Categories Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span>دسته‌بندی‌ها</span>
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              </h3>

              <div className="space-y-1 text-xs">
                <Link
                  href="/products"
                  className={`flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors ${
                    !categorySlug
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>همه محصولات</span>
                  <span className="text-[11px] opacity-80">
                    {toPersianDigits(categories.reduce((acc, c) => acc + c._count.products, 0))}
                  </span>
                </Link>

                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={{
                      pathname: "/products",
                      query: { ...params, category: cat.slug },
                    }}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors ${
                      categorySlug === cat.slug
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[11px] opacity-80">
                      {toPersianDigits(cat._count.products)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Fast Delivery & In-Stock Toggles */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                وضعیت ارسال و موجودی
              </h3>

              <div className="space-y-2.5 text-xs">
                <Link
                  href={{
                    pathname: "/products",
                    query: { ...params, fast: fastDeliveryOnly ? undefined : "true" },
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    fastDeliveryOnly
                      ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300 font-bold"
                      : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>تحویل فوری در نجف‌آباد</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center ${
                      fastDeliveryOnly ? "bg-emerald-600 text-white" : "border border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {fastDeliveryOnly && <Check className="w-3 h-3" />}
                  </div>
                </Link>

                <Link
                  href={{
                    pathname: "/products",
                    query: { ...params, instock: inStockOnly ? undefined : "true" },
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    inStockOnly
                      ? "bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-300 font-bold"
                      : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>فقط کالاهای موجود در انبار</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center ${
                      inStockOnly ? "bg-blue-600 text-white" : "border border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {inStockOnly && <Check className="w-3 h-3" />}
                  </div>
                </Link>
              </div>
            </div>

            {/* Brand Filter */}
            {uniqueBrands.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  برندهای معتبر
                </h3>

                <div className="flex flex-wrap gap-1.5 text-xs">
                  {uniqueBrands.map((b) => (
                    <Link
                      key={b}
                      href={{
                        pathname: "/products",
                        query: {
                          ...params,
                          brand: brandFilter === b ? undefined : b,
                        },
                      }}
                      className={`px-3 py-1.5 rounded-xl border transition-all ${
                        brandFilter === b
                          ? "bg-amber-500 border-amber-500 text-slate-950 font-bold"
                          : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {b}
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </aside>

          {/* Products Grid (2 columns on mobile, 3 on desktop) */}
          <main className="lg:col-span-9 space-y-4">
            {products.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  کالایی با این مشخصات یافت نشد
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  فیلترهای انتخابی را تغییر داده یا کلمه کلیدی دیگری را جستجو نمایید.
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>مشاهده همه کالاها</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>
    </div>
  );
}
