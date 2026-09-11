"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArticleContentRenderer } from "@/components/blog/ArticleContentRenderer";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Sparkles,
  Save,
  X,
  Heading2,
  Heading3,
  Bold,
  List,
  ListOrdered,
  Lightbulb,
  Table,
  Image as ImageIcon,
  Check,
  RefreshCw,
} from "lucide-react";
import { toPersianDigits, formatJalaliDate } from "@/lib/utils";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string;
  readTime: string;
  image: string;
  authorName: string;
  isPublished: boolean;
  views: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface ArticlesAdminClientProps {
  initialArticles: ArticleItem[];
}

export function ArticlesAdminClient({ initialArticles }: ArticlesAdminClientProps) {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "نورپردازی و روشنایی",
    customCategory: "",
    readTime: "۵ دقیقه مطالعه",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80",
    authorName: "کارشناس فنی فروشگاه شیاسی",
    tags: "",
    summary: "",
    content: "",
    isPublished: true,
  });

  const categoriesList = [
    "نورپردازی و روشنایی",
    "طراحی لاین نوری",
    "سرویس و تعمیرات",
    "سیم و کابل ساختمان",
    "تهویه و سرمایشی",
    "لوازم خانگی برقی",
    "سایر...",
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q) ||
        a.tags.toLowerCase().includes(q)
    );
  }, [articles, searchQuery]);

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      slug: "",
      category: "نورپردازی و روشنایی",
      customCategory: "",
      readTime: "۵ دقیقه مطالعه",
      image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80",
      authorName: "کارشناس فنی فروشگاه شیاسی",
      tags: "روشنایی, برق_ساختمان, نجف_آباد",
      summary: "",
      content: "",
      isPublished: true,
    });
    setActiveTab("edit");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (art: ArticleItem) => {
    setEditingArticle(art);
    const isCustom = !categoriesList.includes(art.category);
    setFormData({
      title: art.title,
      slug: art.slug,
      category: isCustom ? "سایر..." : art.category,
      customCategory: isCustom ? art.category : "",
      readTime: art.readTime,
      image: art.image,
      authorName: art.authorName,
      tags: art.tags,
      summary: art.summary,
      content: art.content,
      isPublished: art.isPublished,
    });
    setActiveTab("edit");
    setIsModalOpen(true);
  };

  // Auto-generate slug from Persian/English title
  const handleGenerateSlug = () => {
    if (!formData.title) return;
    const auto = formData.title
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, "-")
      .replace(/[^\w\u0600-\u06FF-]+/g, "");
    setFormData((prev) => ({ ...prev, slug: auto }));
  };

  // Auto-calculate reading time based on word count
  const handleCalculateReadTime = () => {
    const words = formData.content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    setFormData((prev) => ({
      ...prev,
      readTime: `${toPersianDigits(minutes)} دقیقه مطالعه`,
    }));
  };

  // Insert helper text into content textarea
  const insertFormatting = (snippet: string) => {
    const textarea = document.getElementById("content-editor") as HTMLTextAreaElement | null;
    if (!textarea) {
      setFormData((prev) => ({ ...prev, content: prev.content + "\n" + snippet }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    const updated = before + snippet + after;
    setFormData((prev) => ({ ...prev, content: updated }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 50);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.content) {
      alert("لطفاً عنوان، نامک و متن مقاله را وارد فرمایید.");
      return;
    }

    const finalCategory =
      formData.category === "سایر..." && formData.customCategory
        ? formData.customCategory.trim()
        : formData.category;

    setIsSaving(true);
    try {
      if (editingArticle) {
        // Update
        const res = await fetch("/api/admin/articles", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingArticle.id,
            ...formData,
            category: finalCategory,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "خطا در ذخیره تغییرات");
        }

        const updated = await res.json();
        setArticles((prev) =>
          prev.map((a) => (a.id === updated.id ? updated : a))
        );
        showToast("مقاله با موفقیت ویرایش شد.");
      } else {
        // Create
        const res = await fetch("/api/admin/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            category: finalCategory,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "خطا در ایجاد مقاله");
        }

        const created = await res.json();
        setArticles((prev) => [created, ...prev]);
        showToast("مقاله جدید با موفقیت منتشر شد.");
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (error: any) {
      alert(error.message || "خطایی رخ داد.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`آیا از حذف مقاله «${title}» مطمئن هستید؟ این عملیات غیرقابل بازگشت است.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/articles?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "خطا در حذف مقاله");
      }

      setArticles((prev) => prev.filter((a) => a.id !== id));
      showToast("مقاله با موفقیت حذف گردید.");
      router.refresh();
    } catch (error: any) {
      alert(error.message || "خطا در حذف مقاله");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl font-black text-xs shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
              سامانه مدیریت مقالات و وبلاگ فروشگاه
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            تولید محتوا، راهنمای خرید و دانستنی‌های برق برای جلب اعتماد مشتریان و رتبه اول در گوگل
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/blog"
            target="_blank"
            className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>مشاهده صفحه وبلاگ سایت</span>
          </Link>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ نوشتن مقاله جدید</span>
          </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در مقالات (عنوان، تگ، دسته)..."
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-400 text-xs rounded-xl pr-9 pl-3 py-2 focus:outline-hidden focus:border-amber-400"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>
            تعداد کل مقالات:{" "}
            <strong className="text-white font-mono">{toPersianDigits(articles.length)}</strong>
          </span>
          <span>•</span>
          <span>
            منتشر شده:{" "}
            <strong className="text-emerald-400 font-mono">
              {toPersianDigits(articles.filter((a) => a.isPublished).length)}
            </strong>
          </span>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-slate-300">
            <thead className="bg-slate-850/80 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-4">تصویر</th>
                <th className="p-4">عنوان مقاله</th>
                <th className="p-4">دسته‌بندی</th>
                <th className="p-4">زمان مطالعه</th>
                <th className="p-4">وضعیت</th>
                <th className="p-4">بازدید</th>
                <th className="p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    مقاله‌ای برای نمایش وجود ندارد.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Thumbnail */}
                    <td className="p-4">
                      <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                        <Image
                          src={art.image}
                          alt={art.title}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                    </td>

                    {/* Title & Slug */}
                    <td className="p-4 max-w-xs">
                      <div className="font-extrabold text-white line-clamp-1">
                        {art.title}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block dir-ltr text-right truncate">
                        /blog/{art.slug}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="bg-slate-800 text-amber-300 border border-slate-700 px-2 py-0.5 rounded-md text-[11px] font-bold">
                        {art.category}
                      </span>
                    </td>

                    {/* Read Time */}
                    <td className="p-4 whitespace-nowrap text-slate-400 font-medium">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{art.readTime}</span>
                      </div>
                    </td>

                    {/* Published Status */}
                    <td className="p-4 whitespace-nowrap">
                      {art.isPublished ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>منتشر شده</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <span>پیش‌نویس</span>
                        </span>
                      )}
                    </td>

                    {/* Views */}
                    <td className="p-4 whitespace-nowrap font-mono text-slate-300">
                      {toPersianDigits(art.views || 0)}
                    </td>

                    {/* Action Buttons */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/blog/${art.slug}`}
                          target="_blank"
                          title="مشاهده مقاله در سایت"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(art)}
                          title="ویرایش مقاله"
                          className="p-1.5 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(art.id, art.title)}
                          title="حذف مقاله"
                          className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal (Full Page Drawer) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-white">
                    {editingArticle ? "ویرایش مقاله" : "نوشتن مقاله جدید"}
                  </h2>
                  <span className="text-[11px] text-slate-400">
                    محتوای تولید شده مستقیماً در مجله سایت و گوگل نمایش داده خواهد شد.
                  </span>
                </div>
              </div>

              {/* Tabs: Edit / Live Preview */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "edit"
                      ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  ویرایش فرم
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "preview"
                      ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  پیش‌نمایش زنده سایت
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
              {activeTab === "preview" ? (
                /* LIVE PREVIEW TAB */
                <div className="max-w-3xl mx-auto space-y-6 bg-slate-950 p-6 rounded-3xl border border-slate-800">
                  <div className="space-y-3">
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {formData.category}
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-white">
                      {formData.title || "عنوان مقاله در اینجا نمایش داده می‌شود"}
                    </h1>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{formData.authorName}</span>
                      <span>•</span>
                      <span>{formData.readTime}</span>
                    </div>
                  </div>

                  {formData.image && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-800 border border-slate-800">
                      <Image
                        src={formData.image}
                        alt="پیش‌نمایش"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {formData.summary && (
                    <div className="p-4 bg-slate-900 border-r-4 border-amber-400 rounded-xl text-xs sm:text-sm text-slate-300 font-medium">
                      {formData.summary}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800">
                    <ArticleContentRenderer content={formData.content} />
                  </div>
                </div>
              ) : (
                /* EDIT TAB FORM */
                <form id="article-form" onSubmit={handleSave} className="space-y-5">
                  {/* Row 1: Title & Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200">
                        عنوان کامل مقاله <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="مثال: راهنمای انتخاب چراغ سقفی ارزان و مدرن"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-200">
                          نامک پیوند یکتا (Slug) <span className="text-amber-400">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleGenerateSlug}
                          className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>تولید از عنوان</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="modern-ceiling-lights-guide"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 dir-ltr text-left focus:outline-hidden focus:border-amber-400 font-mono"
                      />
                    </div>
                  </div>

                  {/* Row 2: Category & Read Time & Image */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200">
                        دسته‌بندی مقاله
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-amber-400"
                      >
                        {categoriesList.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      {formData.category === "سایر..." && (
                        <input
                          type="text"
                          value={formData.customCategory}
                          onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                          placeholder="نام دسته‌بندی جدید..."
                          className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                        />
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-200">
                          زمان تخمینی مطالعه
                        </label>
                        <button
                          type="button"
                          onClick={handleCalculateReadTime}
                          className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Clock className="w-3 h-3" />
                          <span>محاسبه خودکار</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={formData.readTime}
                        onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                        placeholder="۵ دقیقه مطالعه"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200">
                        نویسنده مقاله
                      </label>
                      <input
                        type="text"
                        value={formData.authorName}
                        onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                        placeholder="کارشناس فنی فروشگاه شیاسی"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Row 3: Image URL & Tags */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200">
                        آدرس تصویر شاخص (URL)
                      </label>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 dir-ltr text-left focus:outline-hidden focus:border-amber-400 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200">
                        برچسب‌ها و تگ‌ها (با کاما جدا کنید)
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="روشنایی_مدرن, پنل_سقفی, نورپردازی"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Row 4: Summary */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-200">
                      خلاصه یا لید مقاله (نمایش در کارت‌ها و پیش‌نمایش گوگل)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      placeholder="یک یا دو جمله کوتاه در معرفی مهم‌ترین نکته این مقاله..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>

                  {/* Row 5: Content Editor with Quick Insert Bar */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-bold text-slate-200">
                        متن اصلی مقاله (فرمت مارک‌داون پیشرفته) <span className="text-amber-400">*</span>
                      </label>

                      {/* Formatting Helper Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/90 p-1.5 rounded-xl border border-slate-700">
                        <button
                          type="button"
                          onClick={() => insertFormatting("\n## عنوان بخش اصلی\n")}
                          className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-[11px] font-bold flex items-center gap-1"
                          title="افزودن تیتر ۲"
                        >
                          <Heading2 className="w-3 h-3" />
                          <span>تیتر ۲</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => insertFormatting("\n### زیرعنوان بخش\n")}
                          className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-[11px] font-bold flex items-center gap-1"
                          title="افزودن تیتر ۳"
                        >
                          <Heading3 className="w-3 h-3" />
                          <span>تیتر ۳</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => insertFormatting("**متن پررنگ**")}
                          className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-[11px] font-bold flex items-center gap-1"
                          title="متن بولد"
                        >
                          <Bold className="w-3 h-3" />
                          <span>بولد</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => insertFormatting("\n- نکته اول\n- نکته دوم\n")}
                          className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-[11px] font-bold flex items-center gap-1"
                          title="لیست نقطه‌ای"
                        >
                          <List className="w-3 h-3" />
                          <span>لیست</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            insertFormatting("\n> [!TIP]\n> نکته مهم یا ترفند کارگاهی خود را اینجا بنویسید.\n")
                          }
                          className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded text-[11px] font-bold flex items-center gap-1"
                          title="کادر نکته طلایی زرد"
                        >
                          <Lightbulb className="w-3 h-3" />
                          <span>کادر نکته</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            insertFormatting("\n> [!WARNING]\n> هشدار مهم ایمنی در کار با برق را اینجا بنویسید.\n")
                          }
                          className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded text-[11px] font-bold flex items-center gap-1"
                          title="کادر هشدار قرمز"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          <span>هشدار ایمنی</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            insertFormatting(
                              "\n| عنوان ستون ۱ | عنوان ستون ۲ |\n| :--- | :--- |\n| مقدار ردیف اول | توضیحات ردیف اول |\n| مقدار ردیف دوم | توضیحات ردیف دوم |\n"
                            )
                          }
                          className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-[11px] font-bold flex items-center gap-1"
                          title="جدول مقایسه‌ای"
                        >
                          <Table className="w-3 h-3" />
                          <span>جدول</span>
                        </button>
                      </div>
                    </div>

                    <textarea
                      id="content-editor"
                      rows={14}
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="متن کامل مقاله، پاراگراف‌ها، نکات و تجربیات کارگاهی..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 leading-relaxed focus:outline-hidden focus:border-amber-400 font-sans"
                    />
                  </div>

                  {/* Publish Switch */}
                  <div className="flex items-center gap-3 pt-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPublished}
                        onChange={(e) =>
                          setFormData({ ...formData, isPublished: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                    <span className="text-xs font-bold text-slate-200">
                      انتشار عمومی در سایت (در صورت خاموش بودن، به عنوان پیش‌نویس ذخیره می‌شود)
                    </span>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/90">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-white px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                انصراف و بستن
              </button>

              <button
                type="submit"
                form="article-form"
                disabled={isSaving}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{editingArticle ? "ذخیره تغییرات مقاله" : "انتشار مقاله"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
