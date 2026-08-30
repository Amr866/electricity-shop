import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ProductCard } from "@/components/product/ProductCard";
import { MobileSearchFilterBar } from "@/components/product/MobileSearchFilterBar";
import { PriceFilterWidget } from "@/components/product/PriceFilterWidget";
import { BrandFilterWidget } from "@/components/product/BrandFilterWidget";
import { CategoryFilterWidget } from "@/components/product/CategoryFilterWidget";
import { DeliveryFilterWidget } from "@/components/product/DeliveryFilterWidget";
import { Pagination } from "@/components/product/Pagination";
import {
  SlidersHorizontal,
  Search,
  Zap,
  Check,
  Truck,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Home,
  ChevronLeft,
  Banknote,
  Tag,
} from "lucide-react";
import { toPersianDigits, formatToman } from "@/lib/utils";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: string;
    instock?: string;
    fast?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    pageSize?: string;
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
  const brandParam = params.brand;
  const selectedBrands = brandParam
    ? brandParam.split(",").map((b) => b.trim()).filter(Boolean)
    : [];
  const minPriceNum = params.minPrice ? parseInt(params.minPrice, 10) : undefined;
  const maxPriceNum = params.maxPrice ? parseInt(params.maxPrice, 10) : undefined;
  const featuredOnly = params.featured === "true";
  const bestSellerOnly = params.bestseller === "true";

  // Pagination params (Default 12 per page, supports 60 and 120)
  const currentPage = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const rawPageSize = parseInt(params.pageSize || "12", 10);
  const pageSize = [12, 60, 120].includes(rawPageSize) ? rawPageSize : 12;
  const skip = (currentPage - 1) * pageSize;
  const take = pageSize;

  // Build Prisma where clause with PostgreSQL case-insensitivity and strong types
  const where: Prisma.ProductWhereInput = {};

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (searchQuery && searchQuery.trim()) {
    const tokens = searchQuery
      .replace(/[\u200C\u200B\u200E\u200F]/g, " ")
      .replace(/[ي]/g, "ی")
      .replace(/[ك]/g, "ک")
      .replace(/[ة]/g, "ه")
      .split(/[\s,،\-–_+*]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (tokens.length > 0) {
      where.AND = tokens.map((token) => ({
        OR: [
          { name: { contains: token, mode: "insensitive" } },
          { description: { contains: token, mode: "insensitive" } },
          { shortDesc: { contains: token, mode: "insensitive" } },
          { brand: { contains: token, mode: "insensitive" } },
          { sku: { contains: token, mode: "insensitive" } },
        ],
      }));
    }
  }

  if (inStockOnly) {
    where.stock = { gt: 0 };
  }

  if (fastDeliveryOnly) {
    where.isIsfahanFast = true;
  }

  if (selectedBrands.length > 0) {
    where.brand = { in: selectedBrands };
  }

  if (
    (minPriceNum !== undefined && !isNaN(minPriceNum)) ||
    (maxPriceNum !== undefined && !isNaN(maxPriceNum))
  ) {
    where.price = {
      ...(minPriceNum !== undefined && !isNaN(minPriceNum) ? { gte: minPriceNum } : {}),
      ...(maxPriceNum !== undefined && !isNaN(maxPriceNum) ? { lte: maxPriceNum } : {}),
    };
  }

  if (featuredOnly) {
    where.isFeatured = true;
  }

  if (bestSellerOnly) {
    where.isBestSeller = true;
  }

  // Build orderBy (Default: newest)
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sortBy === "cheapest") orderBy = { price: "asc" };
  else if (sortBy === "expensive") orderBy = { price: "desc" };
  else if (sortBy === "bestseller") orderBy = { isBestSeller: "desc" };
  else if (sortBy === "rating") orderBy = { rating: "desc" };

  // Fetch count, products, categories, and unique brands concurrently
  const [totalCount, products, categories, allProductsForBrands] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take,
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
  const totalPages = Math.ceil(totalCount / pageSize);

  const hasActiveFilters = Boolean(
    categorySlug ||
    searchQuery ||
    inStockOnly ||
    fastDeliveryOnly ||
    selectedBrands.length > 0 ||
    minPriceNum !== undefined ||
    maxPriceNum !== undefined
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-4 sm:py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 space-y-4 sm:space-y-6">
        
        {/* 1. Mobile Search & Filter Action Bar (Digikala style) */}
        <MobileSearchFilterBar
          categories={categories as any}
          brands={uniqueBrands}
          totalProductsCount={totalCount}
        />

        {/* 2. Breadcrumb Navigation */}
        <nav aria-label="راهنمای مسیر" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 px-1">
          <Link
            href="/"
            className="hover:text-amber-500 transition-colors flex items-center gap-1 font-medium"
          >
            <Home className="w-3.5 h-3.5" />
            <span>خانه</span>
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
          <Link
            href="/products"
            className={`hover:text-amber-500 transition-colors font-medium ${
              !currentCategory ? "text-amber-600 dark:text-amber-400 font-bold" : ""
            }`}
          >
            <span>محصولات و تجهیزات برقی</span>
          </Link>
          {currentCategory && (
            <>
              <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                {currentCategory.name}
              </span>
            </>
          )}
        </nav>

        {/* 3. Desktop Header Bar (Title, Count & Sorting Tabs) */}
        <div className="hidden lg:flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {currentCategory ? currentCategory.name : "کاتالوگ جامع تجهیزات و قطعات برقی"}
              </h1>
              <span className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                {toPersianDigits(totalCount)} کالا
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {currentCategory
                ? currentCategory.description || "تجهیزات و قطعات اصلی با ضمانت فروشگاه شیاسی نجف‌آباد"
                : "تجهیزات روشنایی، سیم و کابل استاندارد، لوازم سرمایش و گرمایش، و بردهای الکترونیک"}
            </p>
          </div>

          {/* Desktop Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              مرتب‌سازی:
            </span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {[
                { key: "newest", label: "جدیدترین" },
                { key: "bestseller", label: "پرفروش‌ترین" },
                { key: "cheapest", label: "ارزان‌ترین" },
                { key: "expensive", label: "گران‌ترین" },
              ].map((s) => (
                <Link
                  key={s.key}
                  href={{
                    pathname: "/products",
                    query: { ...params, sort: s.key, page: undefined },
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    sortBy === s.key
                      ? "bg-amber-500 text-slate-950 shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Main Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Desktop Sidebar Filters (Hidden on Mobile) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-5">
            
            {/* Active Filters & Reset */}
            {hasActiveFilters && (
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-300">
                  <span>فیلترهای فعال</span>
                  <Link
                    href="/products"
                    className="text-[11px] text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-0.5 font-bold"
                  >
                    <RotateCcw className="w-3 h-3" />
                    حذف همه
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
                  {selectedBrands.map((b) => (
                    <span
                      key={b}
                      className="bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md"
                    >
                      برند: {b}
                    </span>
                  ))}
                  {(minPriceNum !== undefined || maxPriceNum !== undefined) && (
                    <span className="bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md">
                      قیمت: {minPriceNum ? formatToman(minPriceNum) : "از ۰"} تا{" "}
                      {maxPriceNum ? formatToman(maxPriceNum) : "نامحدود"}
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
            <CategoryFilterWidget
              categories={categories as any}
              categorySlug={categorySlug}
              params={params}
            />

            {/* Price Filter Widget */}
            <PriceFilterWidget
              initialMinPrice={minPriceNum}
              initialMaxPrice={maxPriceNum}
            />

            {/* Fast Delivery & In-Stock Toggles */}
            <DeliveryFilterWidget
              fastDeliveryOnly={fastDeliveryOnly}
              inStockOnly={inStockOnly}
              params={params}
            />

            {/* Multi-Brand Filter Widget */}
            <BrandFilterWidget brands={uniqueBrands} />

          </aside>

          {/* Products Grid + Pagination */}
          <main className="lg:col-span-9 space-y-6">
            {products.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  کالایی با این مشخصات یافت نشد
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  فیلترهای انتخابی یا بازه قیمت را تغییر داده یا کلمه کلیدی دیگری را جستجو نمایید.
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
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalCount={totalCount}
                />
              </>
            )}
          </main>

        </div>

      </div>
    </div>
  );
}
