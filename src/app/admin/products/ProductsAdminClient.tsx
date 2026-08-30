"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatToman, toPersianDigits } from "@/lib/utils";
import {
  Plus,
  Trash2,
  Search,
  Package,
  CheckCircle2,
  AlertCircle,
  X,
  Zap,
  UploadCloud,
  FileSpreadsheet,
  Edit,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  ArrowUpDown,
  Filter,
  Save,
  Loader2,
} from "lucide-react";
import { ProductExcelImportModal } from "@/components/admin/ProductExcelImportModal";

const ITEMS_PER_PAGE = 15;
const LOCAL_FALLBACK_IMAGE = "/images/products/wal_172619-fans-7995865_1920.jpg";

interface ProductImageItem {
  id: string;
  url: string;
  isPrimary?: boolean;
}

interface CategoryItem {
  id: string;
  name: string;
  slug?: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  shortDesc?: string | null;
  description: string;
  price: number;
  originalPrice?: number | null;
  discountPercent?: number;
  stock: number;
  brand?: string | null;
  warranty?: string | null;
  madeIn?: string | null;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isIsfahanFast?: boolean;
  categoryId: string;
  category?: CategoryItem;
  images?: ProductImageItem[];
}

interface ProductsAdminClientProps {
  initialProducts: AdminProduct[];
  categories: CategoryItem[];
}

export function ProductsAdminClient({
  initialProducts,
  categories,
}: ProductsAdminClientProps) {
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "in_stock" | "low_stock" | "out_of_stock">("all");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "stock_desc" | "stock_asc">("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");

  // Inline edit state
  const [editingInlineId, setEditingInlineId] = useState<string | null>(null);
  const [inlinePrice, setInlinePrice] = useState("");
  const [inlineStock, setInlineStock] = useState("");
  const [inlineLoading, setInlineLoading] = useState(false);
  const [savedInlineId, setSavedInlineId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState("20");
  const [brand, setBrand] = useState("");
  const [warranty, setWarranty] = useState("گارانتی اصالت و سلامت فیزیکی");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isIsfahanFast, setIsIsfahanFast] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const openCreateModal = () => {
    setEditingProduct(null);
    setName("");
    setSlug("");
    setSku("");
    setCategoryId(categories[0]?.id || "");
    setPrice("");
    setOriginalPrice("");
    setStock("20");
    setBrand("");
    setWarranty("گارانتی اصالت و سلامت فیزیکی");
    setIsFeatured(false);
    setIsBestSeller(false);
    setIsIsfahanFast(true);
    setImageUrl("");
    setDescription("");
    setMessage("");
    setModalOpen(true);
  };

  const openEditModal = (prod: AdminProduct) => {
    setEditingProduct(prod);
    setName(prod.name);
    setSlug(prod.slug);
    setSku(prod.sku || "");
    setCategoryId(prod.categoryId);
    setPrice(prod.price.toString());
    setOriginalPrice(prod.originalPrice ? prod.originalPrice.toString() : "");
    setStock(prod.stock.toString());
    setBrand(prod.brand || "");
    setWarranty(prod.warranty || "گارانتی اصالت و سلامت فیزیکی");
    setIsFeatured(Boolean(prod.isFeatured));
    setIsBestSeller(Boolean(prod.isBestSeller));
    setIsIsfahanFast(prod.isIsfahanFast !== false);
    setImageUrl(prod.images?.[0]?.url || "");
    setDescription(prod.description || "");
    setMessage("");
    setModalOpen(true);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setImageUrl(data.url);
      } else {
        alert(data.message || "خطا در آپلود تصویر.");
      }
    } catch {
      alert("خطای سرور در آپلود فایل.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const isEdit = Boolean(editingProduct);
    const method = isEdit ? "PUT" : "POST";

    const payload: any = {
      name,
      slug,
      sku,
      categoryId,
      price: parseInt(price, 10),
      originalPrice: originalPrice ? parseInt(originalPrice, 10) : null,
      stock: parseInt(stock, 10) || 0,
      brand,
      warranty,
      isFeatured,
      isBestSeller,
      isIsfahanFast,
      imageUrl,
      description,
    };

    if (isEdit) {
      payload.id = editingProduct!.id;
    }

    try {
      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "خطا در ذخیره کالا.");
      } else {
        if (isEdit) {
          setProducts((prev) =>
            prev.map((p) => (p.id === data.product.id ? data.product : p))
          );
        } else {
          setProducts([data.product, ...products]);
        }
        setModalOpen(false);
      }
    } catch {
      setMessage("خطا در برقراری ارتباط با سرور.");
    } finally {
      setLoading(false);
    }
  };

  const handleInlineSave = async (id: string) => {
    if (!inlinePrice || !inlineStock) return;
    setInlineLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          price: parseInt(inlinePrice, 10),
          stock: parseInt(inlineStock, 10),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, price: parseInt(inlinePrice, 10), stock: parseInt(inlineStock, 10) }
              : p
          )
        );
        setEditingInlineId(null);
        setSavedInlineId(id);
        setTimeout(() => setSavedInlineId(null), 2500);
      } else {
        alert(data.message || "خطا در به‌روزرسانی سریع.");
      }
    } catch {
      alert("خطای سرور.");
    } finally {
      setInlineLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این کالا از دیتابیس اطمینان دارید؟")) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert("خطا در حذف کالا.");
      }
    } catch {
      alert("خطای سرور.");
    }
  };

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand?.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase());

      const matchCat = !selectedCat || p.categoryId === selectedCat;

      let matchStock = true;
      if (stockFilter === "in_stock") matchStock = p.stock > 0;
      else if (stockFilter === "low_stock") matchStock = p.stock > 0 && p.stock <= 5;
      else if (stockFilter === "out_of_stock") matchStock = p.stock === 0;

      return matchSearch && matchCat && matchStock;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "stock_desc") return b.stock - a.stock;
      if (sortBy === "stock_asc") return a.stock - b.stock;
      return 0; // "newest" preserved from default DB order
    });

    return result;
  }, [products, search, selectedCat, stockFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 180, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <span>مدیریت محصولات و موجودی انبار</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {toPersianDigits(products.length)} کالا در دیتابیس PostgreSQL ثبت شده است
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setExcelModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3.5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>بارگذاری اکسل / CSV</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 active:scale-95 hover-glow cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ افزودن محصول جدید</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar & Stock Chips */}
      <div className="bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Input (Span 6) */}
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="جستجو بر اساس نام کالا، برند یا کد SKU..."
              className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl pr-9 pl-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          </div>

          {/* Category Dropdown (Span 3) */}
          <div className="sm:col-span-3">
            <select
              value={selectedCat}
              onChange={(e) => {
                setSelectedCat(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
            >
              <option value="">همه دسته‌بندی‌ها</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown (Span 3) */}
          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
            >
              <option value="newest">مرتب‌سازی: جدیدترین</option>
              <option value="price_asc">قیمت: ارزان‌ترین</option>
              <option value="price_desc">قیمت: گران‌ترین</option>
              <option value="stock_desc">موجودی: بیشترین</option>
              <option value="stock_asc">موجودی: کمترین</option>
            </select>
          </div>

        </div>

        {/* Quick Stock Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400 text-[11px] font-bold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>وضعیت انبار:</span>
          </span>

          {[
            { id: "all", label: "همه اقلام" },
            { id: "in_stock", label: "کالاهای موجود" },
            { id: "low_stock", label: "رو به اتمام (زیر ۵ عدد)" },
            { id: "out_of_stock", label: "ناموجود (۰ عدد)" },
          ].map((chip) => {
            const isActive = stockFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => {
                  setStockFilter(chip.id as any);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all active:scale-95 cursor-pointer ${
                  isActive
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
                }`}
              >
                {chip.label}
              </button>
            );
          })}

          <span className="mr-auto text-[11px] font-mono text-slate-400">
            نمایش {toPersianDigits(paginatedProducts.length)} از {toPersianDigits(filteredProducts.length)} کالا
          </span>
        </div>
      </div>

      {/* 1. Mobile Cards (md:hidden) */}
      <div className="md:hidden space-y-3">
        {paginatedProducts.map((prod) => {
          const isCritical = prod.stock <= 5 && prod.stock > 0;
          const isOut = prod.stock === 0;

          return (
            <div
              key={prod.id}
              className={`bg-slate-900 rounded-2xl p-4 border transition-all duration-300 space-y-3 ${
                isCritical
                  ? "border-rose-800/80 shadow-md shadow-rose-950/40"
                  : "border-slate-800 shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative w-16 h-16 rounded-2xl bg-slate-800 p-1 border border-slate-700 shrink-0 overflow-hidden">
                  <Image
                    src={prod.images?.[0]?.url || LOCAL_FALLBACK_IMAGE}
                    alt={prod.name}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <strong className="text-white text-xs block line-clamp-2 leading-snug font-bold">
                      {prod.name}
                    </strong>
                    <Link
                      href={`/products/${prod.slug}`}
                      target="_blank"
                      className="text-slate-400 hover:text-amber-400 p-1"
                      title="مشاهده در سایت"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>برند: {prod.brand || "متفرقه"}</span>
                    <span>•</span>
                    <span className="font-mono">کد: {prod.sku || prod.slug.slice(0, 10)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-400 font-mono text-sm">
                    {formatToman(prod.price)}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isOut
                        ? "bg-rose-950 text-rose-400 border border-rose-800"
                        : isCritical
                        ? "bg-amber-950 text-amber-400 border border-amber-800 animate-pulse"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {isOut ? "ناموجود" : `${toPersianDigits(prod.stock)} عدد`}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(prod)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>ویرایش</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(prod.id)}
                    className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-400 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Desktop Table (hidden md:block) */}
      <div className="hidden md:block bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700 text-[11px]">
              <tr>
                <th className="p-3.5 font-bold">تصویر</th>
                <th className="p-3.5 font-bold">نام کالا و دسته‌بندی</th>
                <th className="p-3.5 font-bold">برند</th>
                <th className="p-3.5 font-bold">قیمت واحد (تومان)</th>
                <th className="p-3.5 text-center font-bold">موجودی انبار</th>
                <th className="p-3.5 text-center font-bold">ارسال فوری</th>
                <th className="p-3.5 text-center font-bold">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {paginatedProducts.map((prod) => {
                const isCritical = prod.stock <= 5 && prod.stock > 0;
                const isOut = prod.stock === 0;
                const isInlineEditing = editingInlineId === prod.id;
                const isJustSaved = savedInlineId === prod.id;

                return (
                  <tr
                    key={prod.id}
                    className={`hover:bg-slate-800/50 transition-colors group animate-in fade-in slide-in-from-bottom-1 ${
                      isCritical ? "bg-rose-950/10" : ""
                    }`}
                  >
                    {/* Thumbnail */}
                    <td className="p-3.5">
                      <div className="relative w-12 h-12 rounded-xl bg-slate-800 p-1 border border-slate-700 overflow-hidden shrink-0">
                        <Image
                          src={prod.images?.[0]?.url || LOCAL_FALLBACK_IMAGE}
                          alt={prod.name}
                          fill
                          sizes="48px"
                          className="object-contain p-0.5"
                        />
                      </div>
                    </td>

                    {/* Name & Category */}
                    <td className="p-3.5">
                      <div className="space-y-1 max-w-sm">
                        <div className="flex items-center gap-1.5">
                          <strong className="text-white font-black text-xs block leading-snug line-clamp-1">
                            {prod.name}
                          </strong>
                          <Link
                            href={`/products/${prod.slug}`}
                            target="_blank"
                            className="text-slate-400 hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="مشاهده زنده در سایت"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-400">
                            {prod.category?.name || "عمومی"}
                          </span>
                          <span>•</span>
                          <span className="font-mono">کد: {prod.sku || prod.slug.slice(0, 10)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="p-3.5 font-bold text-slate-300">
                      {prod.brand || "الکترونیک شیاسی"}
                    </td>

                    {/* Price (with Inline Edit) */}
                    <td className="p-3.5 font-mono">
                      {isInlineEditing ? (
                        <input
                          type="number"
                          value={inlinePrice}
                          onChange={(e) => setInlinePrice(e.target.value)}
                          className="w-24 bg-slate-950 border border-amber-500 text-white font-mono text-xs px-2 py-1 rounded-lg focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <div
                          onClick={() => {
                            setEditingInlineId(prod.id);
                            setInlinePrice(prod.price.toString());
                            setInlineStock(prod.stock.toString());
                          }}
                          className="font-bold text-white cursor-pointer hover:text-amber-400 flex items-center gap-1"
                          title="کلیک برای ویرایش سریع قیمت"
                        >
                          <span>{formatToman(prod.price)}</span>
                        </div>
                      )}
                    </td>

                    {/* Stock (with Inline Edit) */}
                    <td className="p-3.5 text-center font-mono">
                      {isInlineEditing ? (
                        <input
                          type="number"
                          value={inlineStock}
                          onChange={(e) => setInlineStock(e.target.value)}
                          className="w-16 bg-slate-950 border border-amber-500 text-white font-mono text-xs px-2 py-1 rounded-lg text-center focus:outline-none"
                        />
                      ) : (
                        <span
                          onClick={() => {
                            setEditingInlineId(prod.id);
                            setInlinePrice(prod.price.toString());
                            setInlineStock(prod.stock.toString());
                          }}
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black cursor-pointer transition-transform hover:scale-105 ${
                            isOut
                              ? "bg-rose-950 text-rose-400 border border-rose-800"
                              : isCritical
                              ? "bg-amber-950 text-amber-400 border border-amber-800 animate-pulse shadow-xs shadow-amber-500/20"
                              : "bg-slate-800 text-slate-200 border border-slate-700"
                          }`}
                          title="کلیک برای ویرایش سریع موجودی"
                        >
                          {isOut ? "ناموجود" : `${toPersianDigits(prod.stock)} عدد`}
                        </span>
                      )}
                    </td>

                    {/* Ready for Express Delivery */}
                    <td className="p-3.5 text-center">
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        بله (اسنپ)
                      </span>
                    </td>

                    {/* Operations */}
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {isInlineEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleInlineSave(prod.id)}
                              disabled={inlineLoading}
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer"
                              title="ذخیره تغییرات سریع"
                            >
                              {inlineLoading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Save className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingInlineId(null)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors cursor-pointer"
                              title="انصراف"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : isJustSaved ? (
                          <span className="p-1.5 bg-emerald-950 text-emerald-400 rounded-lg flex items-center gap-1 text-[10px] font-bold animate-in zoom-in-95">
                            <Check className="w-3.5 h-3.5" />
                            <span>ذخیره شد</span>
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => openEditModal(prod)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="ویرایش کامل کالا"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(prod.id)}
                              className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="حذف از دیتابیس"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between shadow-md">
          <span className="text-xs text-slate-400 font-medium">
            صفحه <strong className="text-white font-bold">{toPersianDigits(currentPage)}</strong> از{" "}
            <strong className="text-white font-bold">{toPersianDigits(totalPages)}</strong>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
              aria-label="صفحه قبلی"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Page number buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .map((page, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && page - prev > 1;

                return (
                  <React.Fragment key={page}>
                    {showEllipsis && <span className="text-slate-500 text-xs px-1">...</span>}
                    <button
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        currentPage === page
                          ? "bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      {toPersianDigits(page)}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
              aria-label="صفحه بعدی"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  {editingProduct ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <h2 className="font-black text-sm text-white">
                  {editingProduct ? "ویرایش مشخصات کالا" : "افزودن محصول جدید به کاتالوگ"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {message && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{message}</span>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleSubmitProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Product Name */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-400 font-bold">نام محصول *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingProduct) {
                        setSlug(e.target.value.trim().toLowerCase().replace(/\s+/g, "-"));
                      }
                    }}
                    placeholder="مثال: موتور کولر آبی ۳/۴ موتوژن تمام مس"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">نامک انگلیسی (Slug) *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="motogen-cooler-motor-34"
                    className="w-full bg-slate-800 border border-slate-700 text-white font-mono rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* SKU */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">کد انبار / SKU</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="SH-ENG-102"
                    className="w-full bg-slate-800 border border-slate-700 text-white font-mono rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">دسته‌بندی *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">برند تولیدکننده</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="موتوژن، پارت الکتریک، رونیکس..."
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">قیمت فروش (تومان) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="2500000"
                    className="w-full bg-slate-800 border border-slate-700 text-white font-mono rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Original Price */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">قیمت قبل از تخفیف (اختیاری)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="2800000"
                    className="w-full bg-slate-800 border border-slate-700 text-white font-mono rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Stock */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">موجودی انبار *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="20"
                    className="w-full bg-slate-800 border border-slate-700 text-white font-mono rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Warranty */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">گارانتی</label>
                  <input
                    type="text"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    placeholder="۲۴ ماه گارانتی تعویض موتوژن"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Image Upload / URL */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-slate-400 font-bold">تصویر محصول</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="آدرس اینترنتی یا مسیر تصویر لوکال..."
                      className="flex-1 bg-slate-800 border border-slate-700 text-white font-mono rounded-xl px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <label className="bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold px-3 py-2 rounded-xl border border-slate-700 cursor-pointer flex items-center gap-1 shrink-0">
                      <UploadCloud className="w-4 h-4" />
                      <span>{uploadingImage ? "در حال آپلود..." : "آپلود فایل"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-400 font-bold">توضیحات و مشخصات فنی</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="شرح کامل، توان، ولتاژ، مشخصات سیم‌پیچ و ویژگی‌های کالا..."
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none leading-relaxed"
                  />
                </div>

              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4 bg-slate-800 border-slate-700"
                  />
                  <span>کالای ویژه (Featured)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4 bg-slate-800 border-slate-700"
                  />
                  <span>پرفروش‌ترین (Best Seller)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isIsfahanFast}
                    onChange={(e) => setIsIsfahanFast(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4 bg-slate-800 border-slate-700"
                  />
                  <span>آماده ارسال فوری نجف‌آباد و اصفهان</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {loading
                    ? "در حال ذخیره‌سازی..."
                    : editingProduct
                    ? "ذخیره تغییرات کالا"
                    : "افزودن کالا به کاتالوگ"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Excel / CSV Import Modal */}
      <ProductExcelImportModal
        isOpen={excelModalOpen}
        onClose={() => setExcelModalOpen(false)}
        onSuccess={() => {
          window.location.reload();
        }}
      />

    </div>
  );
}
