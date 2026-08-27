"use client";

import React, { useState } from "react";
import { formatToman, toPersianDigits } from "@/lib/utils";
import {
  Layers,
  Plus,
  Trash2,
  Zap,
  SunMedium,
  Cpu,
  X,
  Package,
  CheckCircle2,
} from "lucide-react";

interface CategoriesAdminClientProps {
  initialCategories: any[];
}

export function CategoriesAdminClient({ initialCategories }: CategoriesAdminClientProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Zap");
  const [image, setImage] = useState("");

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          description,
          icon,
          image,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "خطا در ایجاد دسته‌بندی.");
      } else {
        setCategories([...categories, { ...data.category, _count: { products: 0 } }]);
        setModalOpen(false);
        setName("");
        setSlug("");
        setDescription("");
        setImage("");
      }
    } catch (e) {
      setErrorMsg("خطای سرور.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟")) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== id));
      } else {
        alert("خطا در حذف دسته‌بندی.");
      }
    } catch (e) {
      alert("خطای سرور.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <span>مدیریت دسته‌بندی‌های کالا</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            تعریف و ویرایش دسته‌های برق ساختمانی، صنعتی، روشنایی و قطعات الکترونیک
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن دسته‌بندی جدید</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-slate-900 rounded-3xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-bold">
                  {toPersianDigits(cat._count?.products || 0)} کالا
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-white">{cat.name}</h3>
              <span className="text-[11px] text-amber-400 font-mono block mt-0.5">
                /{cat.slug}
              </span>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {cat.description || "بدون توضیحات"}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">آیکون: {cat.icon || "Zap"}</span>
              <button
                onClick={() => handleDelete(cat.id)}
                className="p-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-400 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>افزودن دسته‌بندی جدید</span>
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="bg-rose-950 border border-rose-800 text-rose-300 text-xs p-3 rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">نام دسته‌بندی *</label>
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
                  placeholder="مثال: کلید و پریزهای لوکس"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">اسلاگ URL انگلیسی *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="luxury-switches"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">توضیحات کوتاه</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="انواع کلیدهای لمسی و پریزهای توکار..."
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">آدرس تصویر پس‌زمینه (اختیاری)</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl"
                >
                  {loading ? "در حال ثبت..." : "ذخیره دسته‌بندی"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
