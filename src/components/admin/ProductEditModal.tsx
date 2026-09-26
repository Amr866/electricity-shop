"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Plus,
  Edit,
  AlertCircle,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import type { AdminProduct, CategoryItem } from "@/app/admin/products/ProductsAdminClient";

export interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: (product: AdminProduct, isEdit: boolean) => void;
  editingProduct: AdminProduct | null;
  categories: CategoryItem[];
}

export function ProductEditModal({
  isOpen,
  onClose,
  onSaveSuccess,
  editingProduct,
  categories,
}: ProductEditModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState("20");
  const [priceUnit, setPriceUnit] = useState("");
  const [brand, setBrand] = useState("");
  const [warranty, setWarranty] = useState("گارانتی اصالت و سلامت فیزیکی");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isIsfahanFast, setIsIsfahanFast] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  // Sync state when editingProduct changes or modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (editingProduct) {
      setName(editingProduct.name);
      setSlug(editingProduct.slug);
      setSku(editingProduct.sku || "");
      setCategoryId(editingProduct.categoryId);
      setPrice(editingProduct.price.toString());
      setOriginalPrice(editingProduct.originalPrice ? editingProduct.originalPrice.toString() : "");
      setStock(editingProduct.stock.toString());
      setPriceUnit(editingProduct.priceUnit || "");
      setBrand(editingProduct.brand || "");
      setWarranty(editingProduct.warranty || "گارانتی اصالت و سلامت فیزیکی");
      setIsFeatured(Boolean(editingProduct.isFeatured));
      setIsBestSeller(Boolean(editingProduct.isBestSeller));
      setIsIsfahanFast(editingProduct.isIsfahanFast !== false);
      setImageUrl(editingProduct.images?.[0]?.url || "");
      setDescription(editingProduct.description || "");
    } else {
      setName("");
      setSlug("");
      setSku("");
      setCategoryId(categories[0]?.id || "");
      setPrice("");
      setOriginalPrice("");
      setStock("20");
      setPriceUnit("");
      setBrand("");
      setWarranty("گارانتی اصالت و سلامت فیزیکی");
      setIsFeatured(false);
      setIsBestSeller(false);
      setIsIsfahanFast(true);
      setImageUrl("");
      setDescription("");
    }
    setMessage("");
  }, [isOpen, editingProduct, categories]);

  if (!isOpen) return null;

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "products");

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

  const handleSubmit = async (e: React.FormEvent) => {
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
      priceUnit: priceUnit.trim() ? priceUnit.trim() : null,
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
        onSaveSuccess(data.product, isEdit);
        onClose();
      }
    } catch {
      setMessage("خطا در برقراری ارتباط با سرور.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
            onClick={onClose}
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
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
                required
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
              <label className="text-slate-400 font-bold">برند / سازنده</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="مثلاً: موتوژن، سیمکو، پارس شهاب"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Price (Toman) */}
            <div className="space-y-1">
              <label className="text-slate-400 font-bold">قیمت فروش (تومان) *</label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2500000"
                className="w-full bg-slate-800 border border-slate-700 text-white font-mono rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Original Price */}
            <div className="space-y-1">
              <label className="text-slate-400 font-bold">قیمت خط‌خورده / قبل تخفیف (تومان)</label>
              <input
                type="number"
                min="0"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="اختیاری جهت نمایش تخفیف"
                className="w-full bg-slate-800 border border-slate-700 text-white font-mono rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Stock */}
            <div className="space-y-1">
              <label className="text-slate-400 font-bold">موجودی انبار *</label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white font-mono rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Warranty */}
            <div className="space-y-1">
              <label className="text-slate-400 font-bold">گارانتی و ضمانت</label>
              <input
                type="text"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                placeholder="گارانتی ۲ ساله تعویض"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Pricing Unit */}
            <div className="sm:col-span-2 space-y-2 p-3.5 bg-slate-950/40 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-bold flex items-center gap-1.5">
                  <span>واحد قیمت‌گذاری (اختیاری)</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    (مانند: /متر، /کلاف، /عدد)
                  </span>
                </label>
                {priceUnit && (
                  <button
                    type="button"
                    onClick={() => setPriceUnit("")}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                  >
                    پاک کردن واحد
                  </button>
                )}
              </div>

              {/* Preset Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                {["عدد", "متر", "کلاف", "شاخه", "کیلوگرم", "بسته"].map((preset) => {
                  const isSelected = priceUnit === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPriceUnit(isSelected ? "" : preset)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30 scale-105"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>

              {/* Custom Unit Input */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-slate-400 text-xs">یا واحد دلخواه:</span>
                <input
                  type="text"
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  placeholder="مثلاً: قوطی، کارتن، لیتری..."
                  className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Product Image URL & Picker */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-slate-400 font-bold">تصویر محصول</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="آدرس تصویر (مثال: /uploads/products/xyz.jpg)..."
                    className={`w-full bg-slate-800 border border-slate-700 text-white font-mono text-xs rounded-xl py-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                      imageUrl ? "pr-3 pl-12" : "px-3"
                    }`}
                    dir="ltr"
                  />
                  {imageUrl && (
                    <div className="absolute left-1.5 top-1.5 w-7 h-7 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                      <Image
                        src={imageUrl}
                        alt="Preview"
                        fill
                        sizes="28px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setMediaModalOpen(true)}
                    className="flex-1 sm:flex-none bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold px-3 py-2 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 text-xs transition-colors"
                    title="انتخاب از تصاویر و رسانه سرور"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>انتخاب از رسانه</span>
                  </button>

                  <label className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold px-3 py-2 rounded-xl border border-slate-700 cursor-pointer flex items-center justify-center gap-1.5 text-xs transition-colors">
                    <UploadCloud className="w-4 h-4 text-cyan-400" />
                    <span>{uploadingImage ? "در حال آپلود..." : "آپلود جدید"}</span>
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

            {/* Description */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-slate-400 font-bold">توضیحات و مشخصات فنی</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات تکمیلی محصول و کاربردهای کارگاهی..."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Badges & Special Toggles */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs border-t border-slate-800">
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
              onClick={onClose}
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

      {/* Embedded Media Picker */}
      <MediaPickerModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelect={(url) => setImageUrl(url)}
        currentUrl={imageUrl}
      />
    </div>
  );
}
