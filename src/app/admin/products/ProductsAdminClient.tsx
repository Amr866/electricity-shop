"use client";

import React, { useState } from "react";
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
} from "lucide-react";

interface ProductsAdminClientProps {
  initialProducts: any[];
  categories: any[];
}

export function ProductsAdminClient({
  initialProducts,
  categories,
}: ProductsAdminClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");

  // New Product Form state
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
    } catch (e) {
      alert("خطای سرور.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          sku,
          categoryId,
          price,
          originalPrice,
          stock,
          brand,
          warranty,
          isFeatured,
          isBestSeller,
          isIsfahanFast,
          imageUrl,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "خطا در ایجاد محصول.");
      } else {
        setProducts([data.product, ...products]);
        setModalOpen(false);
        // Reset form
        setName("");
        setSlug("");
        setSku("");
        setPrice("");
        setOriginalPrice("");
        setImageUrl("");
        setDescription("");
      }
    } catch (e) {
      setMessage("خطا در برقراری ارتباط.");
    } finally {
      setLoading(false);
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
    } catch (e) {
      alert("خطای سرور.");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCat || p.categoryId === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" />
            <span>مدیریت محصولات و موجودی انبار</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {toPersianDigits(products.length)} کالا در دیتابیس PostgreSQL ثبت شده است
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن محصول جدید</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو بر اساس نام کالا، برند..."
            className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl pr-9 pl-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">همه دسته‌بندی‌ها</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-3.5">تصویر</th>
                <th className="p-3.5">نام کالا</th>
                <th className="p-3.5">برند</th>
                <th className="p-3.5">قیمت (تومان)</th>
                <th className="p-3.5 text-center">موجودی انبار</th>
                <th className="p-3.5 text-center">ارسال فوری</th>
                <th className="p-3.5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5">
                    <img
                      src={
                        prod.images?.[0]?.url ||
                        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={prod.name}
                      className="w-10 h-10 rounded-lg object-contain bg-slate-800 p-0.5 border border-slate-700"
                    />
                  </td>
                  <td className="p-3.5">
                    <strong className="text-white block line-clamp-1">{prod.name}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">اسلاگ: {prod.slug}</span>
                  </td>
                  <td className="p-3.5">{prod.brand || "-"}</td>
                  <td className="p-3.5 font-bold text-white">{formatToman(prod.price)}</td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        prod.stock <= 5
                          ? "bg-rose-950 text-rose-400 border border-rose-800"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {toPersianDigits(prod.stock)} عدد
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    {prod.isIsfahanFast ? (
                      <span className="text-emerald-400 text-[10px] font-bold">بله (اسنپ)</span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">خیر</span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => handleDelete(prod.id)}
                      className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-400 rounded-lg transition-colors"
                      title="حذف کالا"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>افزودن کالای جدید به فروشگاه</span>
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {message && (
              <div className="bg-rose-950 border border-rose-800 text-rose-300 text-xs p-3 rounded-xl">
                {message}
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">نام کالا *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!slug) {
                        setSlug(
                          e.target.value
                            .trim()
                            .toLowerCase()
                            .replace(/[^\w\u0600-\u06FF]+/g, "-")
                        );
                      }
                    }}
                    placeholder="مثال: کابل ۲ در ۱.۵ مس"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">اسلاگ URL (انگلیسی/فارسی) *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="cable-2x1-5-copper"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">دسته‌بندی کالا *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">برند سازنده</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="مثال: پارس شهاب / هیوندای"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">قیمت نهایی (تومان) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="مثال: 450000"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">قیمت خط‌خورده قبل تخفیف (تومان)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="مثال: 500000"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">موجودی انبار اصفهان</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">
                    تصویر کالا (آدرس یا انتخاب مستقیم فایل)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="/uploads/... یا آدرس وب"
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono text-xs"
                    />
                    <label className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2.5 rounded-xl cursor-pointer shrink-0 font-bold text-xs flex items-center gap-1">
                      <UploadCloud className="w-4 h-4" />
                      <span>{uploadingImage ? "..." : "فایل"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingImage}
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">توضیحات و مشخصات فنی</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="مشخصات استاندارد، ولتاژ کاری و جنس هادی را وارد کنید..."
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isIsfahanFast}
                    onChange={(e) => setIsIsfahanFast(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-amber-500"
                  />
                  <span>امکان ارسال فوری با پیک در اصفهان</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-amber-500"
                  />
                  <span>نمایش در کالاهای برگزیده صفحه اول</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl"
                >
                  {loading ? "در حال ثبت..." : "ذخیره در دیتابیس"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
