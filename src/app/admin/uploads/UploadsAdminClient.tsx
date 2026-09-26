"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  UploadCloud,
  CheckCircle2,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Search,
  FileText,
  FileSpreadsheet,
  Download,
  Loader2,
  Sparkles,
  Maximize2,
  X,
  FileImage,
  Layers,
  LayoutGrid,
  List,
} from "lucide-react";
import { toPersianDigits } from "@/lib/utils";
import { MediaFile, formatBytes } from "@/lib/utils/media";

export function UploadsAdminClient() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFolderTab, setActiveFolderTab] = useState<"all" | "products" | "general" | "docs">("all");
  const [uploadTargetFolder, setUploadTargetFolder] = useState<"products" | "general">("products");
  const [isDragOver, setIsDragOver] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/admin/upload");
      const data = await res.json();
      if (res.ok && data.files) {
        setFiles(data.files);
      }
    } catch {
      console.error("Error fetching media files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUploadFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    const newUploaded: MediaFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", uploadTargetFolder);

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.url) {
          newUploaded.push({
            name: data.filename,
            relativePath: data.relativePath || data.filename,
            url: data.url,
            folder: data.folder || uploadTargetFolder,
            fileType: data.fileType || "image",
            size: data.size,
            createdAt: data.createdAt,
            isUsedInProduct: false,
            productName: null,
          });
        }
      } catch {
        console.error("Error uploading file:", file.name);
      }
    }

    if (newUploaded.length > 0) {
      setFiles((prev) => [...newUploaded, ...prev]);
    }
    setUploading(false);
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDelete = async (file: MediaFile) => {
    let force = false;

    if (file.isUsedInProduct) {
      const confirmed = confirm(
        `⚠️ هشدار مهم:\n\nفایل «${file.name}» در حال حاضر به عنوان تصویر یا سند کالای «${file.productName || "فروشگاه"}» در سایت متصل است.\n\nدر صورت حذف، ارجاع این فایل در کالا خالی خواهد شد.\n\nآیا از حذف قطعی این فایل از سرور اطمینان دارید؟`
      );
      if (!confirmed) return;
      force = true;
    } else {
      if (!confirm(`آیا از حذف فایل «${file.name}» از سرور اطمینان دارید؟`)) return;
    }

    try {
      const query = new URLSearchParams({
        path: file.relativePath || file.name,
      });
      if (force) query.set("force", "true");

      const res = await fetch(`/api/admin/upload?${query.toString()}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFiles((prev) => prev.filter((f) => f.url !== file.url));
        if (previewFile?.url === file.url) setPreviewFile(null);
      } else {
        alert(data.message || "خطا در حذف فایل.");
      }
    } catch {
      alert("خطای سرور در برقراری ارتباط.");
    }
  };

  const productsCount = useMemo(() => files.filter((f) => f.folder === "products").length, [files]);
  const generalCount = useMemo(() => files.filter((f) => f.folder === "general" && (!f.fileType || f.fileType === "image")).length, [files]);
  const docsCount = useMemo(() => files.filter((f) => f.folder === "boms" || (f.fileType && f.fileType !== "image")).length, [files]);

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      // Folder / Document filter tab
      if (activeFolderTab === "products" && f.folder !== "products") return false;
      if (activeFolderTab === "general" && (f.folder !== "general" || (f.fileType && f.fileType !== "image"))) return false;
      if (activeFolderTab === "docs" && f.folder !== "boms" && (!f.fileType || f.fileType === "image")) return false;

      // Search query
      if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;

      return true;
    });
  }, [files, activeFolderTab, search]);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-cyan-400" />
          <span>آپلود و مدیریت گالری تصاویر و اسناد سرور</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          بارگذاری و مدیریت تصاویر محصولات در <code className="text-amber-400 font-mono">/public/uploads/products/</code>، اسناد، کاتالوگ‌ها و فایل‌های پیوست
        </p>
      </div>

      {/* 2. Drag & Drop Multi-file Upload Zone with Destination Selector */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>پوشه مقصد بارگذاری:</span>
          </span>
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setUploadTargetFolder("products")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                uploadTargetFolder === "products"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              تصاویر کاتالوگ محصولات (/products)
            </button>
            <button
              type="button"
              onClick={() => setUploadTargetFolder("general")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                uploadTargetFolder === "general"
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              آپلودهای عمومی و اسناد (/uploads)
            </button>
          </div>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            handleUploadFiles(e.dataTransfer.files);
          }}
          className={`rounded-2xl p-6 sm:p-8 border-2 border-dashed text-center transition-all duration-300 ${
            isDragOver
              ? "border-amber-400 bg-amber-500/10 scale-[1.01] ring-4 ring-amber-500/20"
              : "border-slate-700 hover:border-amber-500/60 bg-slate-950/40"
          }`}
        >
          <label className="cursor-pointer flex flex-col items-center justify-center space-y-3">
            <div
              className={`w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center shadow-lg transition-transform duration-300 ${
                isDragOver ? "scale-110 text-amber-300" : "text-amber-400"
              }`}
            >
              {uploading ? (
                <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
              ) : (
                <UploadCloud className="w-7 h-7" />
              )}
            </div>

            <div>
              <span className="font-black text-sm text-white block">
                {uploading
                  ? "در حال آپلود و پردازش فایل‌ها..."
                  : `کلیک برای انتخاب یا کشیدن و رها کردن فایل در پوشه «${
                      uploadTargetFolder === "products" ? "محصولات" : "عمومی / اسناد"
                    }»`}
              </span>
              <span className="text-xs text-slate-400 mt-1 block font-medium">
                فرمت‌های مجاز: تصاویر (JPG, PNG, WEBP, SVG) و اسناد (PDF, XLSX, CSV, DOCX) تا ۲۵ مگابایت
              </span>
            </div>

            <input
              type="file"
              multiple
              accept="image/*,.pdf,.xlsx,.xls,.csv,.doc,.docx,.txt"
              disabled={uploading}
              onChange={(e) => handleUploadFiles(e.target.files)}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 3. Search & Folder Tabs */}
      <div className="bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        {/* Folder Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveFolderTab("all")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFolderTab === "all"
                ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>همه فایل‌ها</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-900/60 font-mono">
              {toPersianDigits(files.length)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFolderTab("products")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFolderTab === "products"
                ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>تصاویر محصولات</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-900/60 font-mono">
              {toPersianDigits(productsCount)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFolderTab("general")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFolderTab === "general"
                ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>آپلودهای عمومی</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-900/60 font-mono">
              {toPersianDigits(generalCount)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFolderTab("docs")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFolderTab === "docs"
                ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>اسناد و مدارک (PDF / اکسل)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-900/60 font-mono">
              {toPersianDigits(docsCount)}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی نام فایل یا مدرک..."
              className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl pr-9 pl-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="نمایش کارتی و گرید"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="نمایش جدول ادمین"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Images & Docs Grid Gallery */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
          <span className="text-xs font-bold">در حال بارگذاری فایل‌های سرور...</span>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="bg-slate-900 rounded-3xl p-10 border border-slate-800 text-center space-y-2">
          <FileImage className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">فایلی در این بخش یافت نشد</h3>
          <p className="text-xs text-slate-400">می‌توانید تصویر یا سند جدیدی را در کادر بالا آپلود فرمایید.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredFiles.map((file) => {
            const isImage = file.fileType === "image" || (!file.fileType && !file.name.match(/\.(pdf|xlsx|xls|csv|docx|doc|txt)$/i));
            const isPdf = file.fileType === "pdf" || file.name.endsWith(".pdf");
            const isExcel = file.fileType === "excel" || file.name.match(/\.(xlsx|xls|csv)$/i);

            return (
              <div
                key={file.url}
                className="group bg-slate-900 rounded-2xl p-2.5 border border-slate-800 hover:border-slate-700 space-y-2 flex flex-col justify-between shadow-xl transition-all duration-200 animate-in fade-in"
              >
                {/* Thumbnail / Document Card with hover zoom and badges */}
                <div
                  onClick={() => setPreviewFile(file)}
                  className="aspect-square bg-slate-950 rounded-xl overflow-hidden relative cursor-pointer group-hover:ring-2 group-hover:ring-amber-500/50 transition-all flex items-center justify-center"
                >
                  {isImage ? (
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : isPdf ? (
                    <div className="flex flex-col items-center justify-center p-3 text-center space-y-1.5 w-full h-full bg-rose-950/20 group-hover:bg-rose-950/40 transition-colors">
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shadow-inner">
                        <FileText className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black font-mono text-rose-300 uppercase px-1.5 py-0.5 rounded bg-rose-900/60 border border-rose-700/60">
                        PDF مدرک
                      </span>
                    </div>
                  ) : isExcel ? (
                    <div className="flex flex-col items-center justify-center p-3 text-center space-y-1.5 w-full h-full bg-emerald-950/20 group-hover:bg-emerald-950/40 transition-colors">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
                        <FileSpreadsheet className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black font-mono text-emerald-300 uppercase px-1.5 py-0.5 rounded bg-emerald-900/60 border border-emerald-700/60">
                        اکسل / CSV
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3 text-center space-y-1.5 w-full h-full bg-blue-950/20 group-hover:bg-blue-950/40 transition-colors">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shadow-inner">
                        <FileText className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black font-mono text-blue-300 uppercase px-1.5 py-0.5 rounded bg-blue-900/60 border border-blue-700/60">
                        سند متنی
                      </span>
                    </div>
                  )}

                  {/* Badges on top */}
                  <div className="absolute top-1.5 inset-x-1.5 flex items-center justify-between pointer-events-none z-10">
                    {file.folder === "products" ? (
                      <span className="bg-amber-500/90 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
                        کالا
                      </span>
                    ) : file.folder === "boms" ? (
                      <span className="bg-cyan-500/90 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
                        BOM
                      </span>
                    ) : (
                      <span className="bg-slate-800/90 text-slate-300 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                        عمومی
                      </span>
                    )}

                    {file.isUsedInProduct && (
                      <span
                        className="bg-emerald-500/90 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5"
                        title={`متصل به: ${file.productName}`}
                      >
                        <Check className="w-2.5 h-2.5" />
                        <span>متصل</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="w-4 h-4 text-white drop-shadow" />
                  </div>
                </div>

                {/* Filename & Details */}
                <div>
                  <p className="text-[11px] font-mono text-slate-300 truncate" title={file.name} dir="ltr">
                    {file.name}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-0.5 font-mono">
                    <span>{formatBytes(file.size)}</span>
                    {file.isUsedInProduct && (
                      <span className="text-emerald-400 font-sans font-bold truncate max-w-[80px]" title={file.productName || ""}>
                        {file.productName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions: Copy URL & Delete */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                  <button
                    type="button"
                    onClick={() => handleCopy(file.url)}
                    className="flex-1 py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="کپی آدرس فایل"
                  >
                    {copiedUrl === file.url ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">کپی شد</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>کپی آدرس</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(file)}
                    className="p-1 bg-rose-950/60 hover:bg-rose-900 text-rose-400 rounded-lg transition-colors cursor-pointer"
                    title={file.isUsedInProduct ? `حذف (متصل به کالای ${file.productName})` : "حذف فایل از سرور"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5 font-bold">تصویر</th>
                  <th className="p-3.5 font-bold">نام فایل</th>
                  <th className="p-3.5 font-bold">کالای متصل</th>
                  <th className="p-3.5 font-bold">پوشه / نوع</th>
                  <th className="p-3.5 font-bold text-center">حجم</th>
                  <th className="p-3.5 font-bold text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium">
                {filteredFiles.map((file) => {
                  const isImage =
                    file.fileType === "image" ||
                    (!file.fileType && !file.name.match(/\.(pdf|xlsx|xls|csv|docx|doc|txt)$/i));
                  const isPdf = file.fileType === "pdf" || file.name.endsWith(".pdf");
                  const isExcel = file.fileType === "excel" || file.name.match(/\.(xlsx|xls|csv)$/i);

                  return (
                    <tr
                      key={file.url}
                      className="hover:bg-slate-800/50 transition-colors group animate-in fade-in"
                    >
                      {/* Thumbnail */}
                      <td className="p-3.5">
                        <div
                          onClick={() => setPreviewFile(file)}
                          className="relative w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 cursor-pointer flex items-center justify-center hover:ring-2 hover:ring-amber-500/50 transition-all"
                        >
                          {isImage ? (
                            <Image
                              src={file.url}
                              alt={file.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : isPdf ? (
                            <FileText className="w-6 h-6 text-rose-400" />
                          ) : isExcel ? (
                            <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                          ) : (
                            <FileText className="w-6 h-6 text-blue-400" />
                          )}
                        </div>
                      </td>

                      {/* File name & URL */}
                      <td className="p-3.5">
                        <div className="space-y-1 max-w-xs md:max-w-md">
                          <p
                            className="font-mono text-white text-xs truncate font-bold"
                            title={file.name}
                            dir="ltr"
                          >
                            {file.name}
                          </p>
                          <p
                            className="font-mono text-[10px] text-slate-500 truncate"
                            dir="ltr"
                          >
                            {file.url}
                          </p>
                        </div>
                      </td>

                      {/* Connected Product */}
                      <td className="p-3.5">
                        {file.isUsedInProduct ? (
                          <div className="flex items-center gap-1.5 text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                            <strong
                              className="text-xs font-bold truncate max-w-[200px]"
                              title={file.productName || ""}
                            >
                              {file.productName}
                            </strong>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-medium">
                            بدون اتصال به کالا
                          </span>
                        )}
                      </td>

                      {/* Folder & Type */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          {file.folder === "products" ? (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                              کاتالوگ محصولات
                            </span>
                          ) : file.folder === "boms" ? (
                            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                              BOM / استعلام
                            </span>
                          ) : (
                            <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                              عمومی
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Size */}
                      <td className="p-3.5 text-center font-mono text-[11px] text-slate-400">
                        {formatBytes(file.size)}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopy(file.url)}
                            className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="کپی آدرس فایل"
                          >
                            {copiedUrl === file.url ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">کپی شد</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>کپی</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setPreviewFile(file)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="پیش‌نمایش بزرگ"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(file)}
                            className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-400 rounded-lg transition-colors cursor-pointer"
                            title={
                              file.isUsedInProduct
                                ? `حذف (متصل به کالای ${file.productName})`
                                : "حذف فایل از سرور"
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Lightbox Modal for Images & Documents */}
      {previewFile && (
        <div
          onClick={() => setPreviewFile(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl max-h-[85vh] w-full bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-2xl flex flex-col items-center justify-center space-y-4"
          >
            <button
              type="button"
              onClick={() => setPreviewFile(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-950/80 text-white flex items-center justify-center hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-full h-[55vh] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
              {previewFile.fileType === "image" || (!previewFile.fileType && !previewFile.name.match(/\.(pdf|xlsx|xls|csv|docx|doc|txt)$/i)) ? (
                <Image
                  src={previewFile.url}
                  alt={previewFile.name}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3 p-6 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center shadow-lg">
                    {previewFile.name.endsWith(".pdf") ? (
                      <FileText className="w-10 h-10 text-rose-400" />
                    ) : (
                      <FileSpreadsheet className="w-10 h-10 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono" dir="ltr">
                      {previewFile.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      حجم فایل: {formatBytes(previewFile.size)}
                    </p>
                  </div>
                  <a
                    href={previewFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>مشاهده یا دانلود فایل</span>
                  </a>
                </div>
              )}
            </div>

            <div className="w-full pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 border-t border-slate-800">
              <div className="space-y-0.5">
                <p className="font-mono text-white text-xs truncate max-w-md" dir="ltr">
                  {previewFile.url}
                </p>
                {previewFile.isUsedInProduct && (
                  <p className="text-[11px] text-emerald-400 font-bold">
                    ✓ متصل به کالای: {previewFile.productName}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer font-bold bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>باز کردن لینک</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(previewFile.url)}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-bold bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>کپی آدرس</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
