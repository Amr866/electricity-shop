"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toPersianDigits } from "@/lib/utils";
import {
  Layers,
  Plus,
  Trash2,
  Edit,
  Zap,
  SunMedium,
  Cpu,
  Fan,
  Wrench,
  Package,
  X,
  CheckCircle2,
  ExternalLink,
  UploadCloud,
  Loader2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  image?: string | null;
  sortOrder?: number;
  _count?: {
    products: number;
  };
}

interface CategoriesAdminClientProps {
  initialCategories: AdminCategory[];
}

const AVAILABLE_ICONS = [
  { id: "Fan", label: "پنکه و سرمایش", icon: Fan, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  { id: "Zap", label: "سیم، کابل و برق", icon: Zap, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  { id: "SunMedium", label: "روشنایی و خورشیدی", icon: SunMedium, color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
  { id: "Cpu", label: "بردهای الکترونیک", icon: Cpu, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  { id: "Wrench", label: "ابزار و تعمیرات", icon: Wrench, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
  { id: "Package", label: "قطعات و بسته‌ها", icon: Package, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
  { id: "Layers", label: "دسته‌بندی کلی", icon: Layers, color: "text-rose-400 bg-rose-500/10 border-rose-500/30" },
];

function CategoryIcon({ iconName, className = "w-5 h-5" }: { iconName?: string | null; className?: string }) {
  switch (iconName) {
    case "Fan":
      return <Fan className={`${className} text-blue-400 transition-transform duration-700 group-hover:rotate-180`} />;
    case "SunMedium":
      return <SunMedium className={`${className} text-yellow-400 transition-transform duration-500 group-hover:scale-110`} />;
    case "Cpu":
      return <Cpu className={`${className} text-emerald-400 transition-transform duration-500 group-hover:scale-110`} />;
    case "Wrench":
      return <Wrench className={`${className} text-purple-400 transition-transform duration-500 group-hover:rotate-12`} />;
    case "Package":
      return <Package className={`${className} text-cyan-400 transition-transform duration-500 group-hover:scale-110`} />;
    case "Layers":
      return <Layers className={`${className} text-rose-400 transition-transform duration-500 group-hover:scale-110`} />;
    case "Zap":
    default:
      return <Zap className={`${className} text-amber-400 transition-transform duration-500 group-hover:scale-110`} />;
  }
}

export function CategoriesAdminClient({ initialCategories }: CategoriesAdminClientProps) {
  const [categories, setCategories] = useState<AdminCategory[]>(initialCategories);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Zap");
  const [image, setImage] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setIcon("Zap");
    setImage("");
    setSortOrder(categories.length);
    setErrorMsg("");
    setModalOpen(true);
  };

  const openEditModal = (cat: AdminCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setIcon(cat.icon || "Zap");
    setImage(cat.image || "");
    setSortOrder(cat.sortOrder ?? 0);
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setImage(data.url);
      } else {
        alert("خطا در آپلود تصویر بنر.");
      }
    } catch {
      alert("خطای سرور در آپلود.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const isEdit = !!editingCategory;
    const url = "/api/admin/categories";
    const method = isEdit ? "PUT" : "POST";
    const payload = isEdit
      ? { id: editingCategory.id, name, slug, description, icon, image, sortOrder }
      : { name, slug, description, icon, image, sortOrder };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "خطا در ذخیره دسته‌بندی.");
      } else {
        if (isEdit) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? { ...c, ...data.category } : c))
          );
        } else {
          setCategories((prev) => [...prev, { ...data.category, _count: { products: 0 } }]);
        }
        setModalOpen(false);
      }
    } catch {
      setErrorMsg("خطای سرور در برقراری ارتباط.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSortOrder = async (cat: AdminCategory, delta: number) => {
    const newOrder = Math.max(0, (cat.sortOrder ?? 0) + delta);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cat.id, sortOrder: newOrder }),
      });

      if (res.ok) {
        setCategories((prev) =>
          prev
            .map((c) => (c.id === cat.id ? { ...c, sortOrder: newOrder } : c))
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        );
      }
    } catch {
      alert("خطا در تغییر ترتیب نمایش.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`آیا از حذف دسته‌بندی «${name}» اطمینان دارید؟ تمامی کالاهای مرتبط ممکن است بدون دسته‌بندی شوند.`)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("خطا در حذف دسته‌بندی.");
      }
    } catch {
      alert("خطای سرور.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Create Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <span>مدیریت دسته‌بندی‌های کالا</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            تعریف، اولویت‌بندی و ویرایش دسته‌های برق ساختمانی، صنعتی، روشنایی و قطعات الکترونیک
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-2xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن دسته‌بندی جدید</span>
        </button>
      </div>

      {/* 2. Symmetrical 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className="group bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-4 animate-in fade-in slide-in-from-bottom-2"
          >
            
            {/* Top Bar: Icon + Title + Count Pill + Store Link */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                
                {/* Category Dynamic Icon Container */}
                <div className="w-12 h-12 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center shrink-0 shadow-inner">
                  <CategoryIcon iconName={cat.icon} className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors">
                      {cat.name}
                    </h3>
                    <Link
                      href={`/categories/${cat.slug}`}
                      target="_blank"
                      className="text-slate-500 hover:text-amber-400 p-0.5 transition-colors cursor-pointer"
                      title="مشاهده صفحه عمومی دسته در سایت"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <span className="text-[11px] text-amber-400/90 font-mono block mt-0.5" dir="ltr">
                    /{cat.slug}
                  </span>
                </div>
              </div>

              {/* Product Count Badge */}
              <span className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full font-bold shrink-0">
                {toPersianDigits(cat._count?.products || 0)} کالا
              </span>
            </div>

            {/* Banner Image Preview (if available) & Description */}
            <div className="flex flex-col sm:flex-row gap-3.5 items-start">
              {cat.image ? (
                <div className="w-full sm:w-28 h-20 rounded-2xl overflow-hidden bg-slate-800 relative shrink-0 border border-slate-750">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : null}

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {cat.description || "بدون توضیحات ثبت‌شده برای این دسته‌بندی."}
              </p>
            </div>

            {/* Bottom Actions: Sort Order Stepper + Edit + Delete */}
            <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
              
              {/* Sort Order Stepper */}
              <div className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-750 px-2.5 py-1 rounded-xl">
                <span className="text-[11px] text-slate-400 font-medium">اولویت نمایش:</span>
                <span className="font-mono font-black text-amber-400 text-xs px-1">
                  {toPersianDigits(cat.sortOrder ?? idx + 1)}
                </span>
                <div className="flex items-center gap-0.5 mr-1">
                  <button
                    type="button"
                    onClick={() => handleUpdateSortOrder(cat, -1)}
                    className="w-5 h-5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center cursor-pointer"
                    title="افزایش اولویت (بالاتر)"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateSortOrder(cat, 1)}
                    className="w-5 h-5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center cursor-pointer"
                    title="کاهش اولویت (پایین‌تر)"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Edit & Delete Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(cat)}
                  className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 rounded-xl border border-amber-500/30 transition-all flex items-center gap-1 font-bold cursor-pointer active:scale-95"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>ویرایش</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-400 rounded-xl border border-rose-900 transition-all flex items-center gap-1 cursor-pointer"
                  title="حذف دسته‌بندی"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* 3. Create & Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
              <h3 className="font-black text-sm sm:text-base text-white flex items-center gap-2">
                {editingCategory ? <Edit className="w-4 h-4 text-amber-400" /> : <Plus className="w-4 h-4 text-amber-400" />}
                <span>{editingCategory ? `ویرایش دسته‌بندی «${editingCategory.name}»` : "افزودن دسته‌بندی جدید"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="bg-rose-950/80 border border-rose-800 text-rose-300 text-xs p-3 rounded-2xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">نام دسته‌بندی *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingCategory && !slug) {
                        setSlug(
                          e.target.value
                            .trim()
                            .toLowerCase()
                            .replace(/[^\w\u0600-\u06FF]+/g, "-")
                        );
                      }
                    }}
                    placeholder="مثال: کلید و پریزهای ساختمانی"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">اسلاگ URL انگلیسی *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="switches-sockets"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">توضیحات دسته‌بندی</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="انواع کلید و پریز روکار و توکار، کلید مینیاتوری اشنایدر و سیم‌کشی..."
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 leading-relaxed"
                />
              </div>

              {/* Visual Icon Picker */}
              <div>
                <label className="block text-slate-300 font-bold mb-2">انتخاب آیکون نمایشی دسته‌بندی</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AVAILABLE_ICONS.map((item) => {
                    const isSelected = icon === item.id;
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setIcon(item.id)}
                        className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10"
                            : "bg-slate-800/80 border-slate-750 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                        }`}
                      >
                        <ItemIcon className="w-5 h-5" />
                        <span className="text-[10px] font-bold">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Banner Image Upload & Preview */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">تصویر بنر دسته‌بندی</label>
                <div className="flex items-center gap-3">
                  {image ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 relative border border-slate-700 shrink-0">
                      <Image src={image} alt="Preview" fill className="object-cover" />
                    </div>
                  ) : null}
                  
                  <label className="flex-1 border border-dashed border-slate-700 hover:border-amber-500/50 bg-slate-800/50 p-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    {uploadingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    ) : (
                      <UploadCloud className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="text-slate-300 text-[11px] font-bold">
                      {uploadingImage ? "در حال آپلود..." : "آپلود تصویر جدید (اختیاری)"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">اولویت نمایش (عدد کمتر = بالاتر در منو)</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                  className="w-28 bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading || uploadingImage}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
                >
                  {loading ? "در حال ثبت..." : editingCategory ? "ذخیره تغییرات" : "ایجاد دسته‌بندی"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
