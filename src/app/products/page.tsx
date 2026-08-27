import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
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

  // Build Prisma where clause
  const where: any = {};

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery } },
      { description: { contains: searchQuery } },
      { shortDesc: { contains: searchQuery } },
      { brand: { contains: searchQuery } },
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

  // Build orderBy
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
      distinct: ["brand"],
    }),
  ]);

  const brands = allProductsForBrands
    .map((p) => p.brand)
    .filter((b): b is string => Boolean(b));

  const currentCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumb & Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-amber-600">
                صفحه اصلی
              </Link>
              <span>/</span>
              <span className="text-slate-900 font-semibold">
                {currentCategory ? currentCategory.name : "کاتالوگ کلیه محصولات"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>{currentCategory ? currentCategory.name : "کلیه تجهیزات و قطعات برقی"}</span>
              <span className="text-xs bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full font-bold">
                {toPersianDigits(products.length)} کالا
              </span>
            </h1>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <ArrowUpDown className="w-3.5 h-3.5" />
              مرتب‌سازی:
            </span>
            <div className="flex items-center gap-1">
              <Link
                href={{
                  pathname: "/products",
                  query: { ...params, sort: "newest" },
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  sortBy === "newest"
                    ? "bg-amber-500 text-slate-950"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                جدیدترین
              </Link>
              <Link
                href={{
                  pathname: "/products",
                  query: { ...params, sort: "cheapest" },
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  sortBy === "cheapest"
                    ? "bg-amber-500 text-slate-950"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                ارزان‌ترین
              </Link>
              <Link
                href={{
                  pathname: "/products",
                  query: { ...params, sort: "expensive" },
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  sortBy === "expensive"
                    ? "bg-amber-500 text-slate-950"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                گران‌ترین
              </Link>
              <Link
                href={{
                  pathname: "/products",
                  query: { ...params, sort: "bestseller" },
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  sortBy === "bestseller"
                    ? "bg-amber-500 text-slate-950"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                پرفروش‌ترین
              </Link>
            </div>
          </div>
        </div>

        {/* Main Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3 space-y-5">
            
            {/* 1. Active Filters & Reset */}
            {(categorySlug || searchQuery || inStockOnly || fastDeliveryOnly || brandFilter) && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span>فیلترهای فعال</span>
                  <Link
                    href="/products"
                    className="text-[11px] text-rose-600 hover:text-rose-700 flex items-center gap-0.5"
                  >
                    <RotateCcw className="w-3 h-3" />
                    حذف فیلترها
                  </Link>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {currentCategory && (
                    <span className="bg-white border border-amber-300 text-slate-800 px-2 py-0.5 rounded-md">
                      دسته: {currentCategory.name}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="bg-white border border-amber-300 text-slate-800 px-2 py-0.5 rounded-md">
                      جستجو: {searchQuery}
                    </span>
                  )}
                  {brandFilter && (
                    <span className="bg-white border border-amber-300 text-slate-800 px-2 py-0.5 rounded-md">
                      برند: {brandFilter}
                    </span>
                  )}
                  {inStockOnly && (
                    <span className="bg-white border border-amber-300 text-slate-800 px-2 py-0.5 rounded-md">
                      فقط کالاهای موجود
                    </span>
                  )}
                  {fastDeliveryOnly && (
                    <span className="bg-white border border-amber-300 text-slate-800 px-2 py-0.5 rounded-md">
                      ارسال فوری اصفهان
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 2. Categories Widget */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
                <span>دسته‌بندی‌ها</span>
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              </h3>

              <div className="space-y-1 text-xs">
                <Link
                  href="/products"
                  className={`flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors ${
                    !categorySlug
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
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
                        : "text-slate-700 hover:bg-slate-50"
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

            {/* 3. Fast Delivery & In-Stock Toggles */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
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
                      ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>تحویل فوری اصفهان</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center ${
                      fastDeliveryOnly ? "bg-emerald-600 text-white" : "border border-slate-300"
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
                      ? "bg-amber-50 border-amber-300 text-amber-900 font-bold"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>فقط کالاهای موجود در انبار</span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center ${
                      inStockOnly ? "bg-amber-500 text-slate-950" : "border border-slate-300"
                    }`}
                  >
                    {inStockOnly && <Check className="w-3 h-3" />}
                  </div>
                </Link>
              </div>
            </div>

            {/* 4. Brand Filter */}
            {brands.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                  برندهای معتبر
                </h3>

                <div className="space-y-1.5 text-xs max-h-48 overflow-y-auto pr-1">
                  {brands.map((b) => (
                    <Link
                      key={b}
                      href={{
                        pathname: "/products",
                        query: { ...params, brand: brandFilter === b ? undefined : b },
                      }}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                        brandFilter === b
                          ? "bg-amber-100 text-amber-900 font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{b}</span>
                      {brandFilter === b && <Check className="w-3.5 h-3.5 text-amber-700" />}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Help & Fast Order Phone Box */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-2">
              <span className="text-amber-400 font-bold text-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                سفارش عمده و استعلام سریع
              </span>
              <p className="text-[11px] text-slate-300 leading-snug">
                برای استعلام قیمت تعداد بالا، کابل‌های صنعتی یا پروژه‌های انبوه‌سازی تماس بگیرید.
              </p>
              <a
                href="tel:03132204567"
                className="block text-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-2 rounded-xl transition-colors"
              >
                تماس: ۰۳۱-۳۲۲۰۴۵۶۷
              </a>
            </div>

          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-9">
            {products.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  کالایی با مشخصات انتخابی یافت نشد!
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  فیلترهای اعمال شده را تغییر دهید یا نام کالا را به شکل دیگری جستجو کنید (مانند: سیم افشان، پروژکتور، هیوندای، آردوینو).
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
                >
                  مشاهده همه محصولات
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
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
