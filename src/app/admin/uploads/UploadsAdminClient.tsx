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
  Loader2,
  Sparkles,
  Maximize2,
  X,
  FileImage,
} from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

interface MediaFile {
  name: string;
  url: string;
  size: number;
  createdAt: string | Date;
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "۰ بایت";
  const k = 1024;
  const sizes = ["بایت", "کیلوبایت", "مگابایت", "گیگابایت"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
  return `${toPersianDigits(val)} ${sizes[i]}`;
}

export function UploadsAdminClient() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.url) {
          newUploaded.push({
            name: data.filename,
            url: data.url,
            size: data.size,
            createdAt: data.createdAt,
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

  const handleDelete = async (filename: string) => {
    if (!confirm("آیا از حذف این فایل تصویر از سرور اطمینان دارید؟")) return;

    try {
      const res = await fetch(`/api/admin/upload?filename=${encodeURIComponent(filename)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.name !== filename));
      } else {
        alert("خطا در حذف فایل.");
      }
    } catch {
      alert("خطای سرور.");
    }
  };

  const filteredFiles = useMemo(() => {
    return files.filter((f) => !search || f.name.toLowerCase().includes(search.toLowerCase()));
  }, [files, search]);

  return (
    <div className="space-y-6">
      
      {/* 1. Header */}
      <div>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-cyan-400" />
          <span>آپلود و مدیریت گالری تصاویر سرور</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          بارگذاری تصاویر محصولات و قطعات در مسیر <code className="text-amber-400 font-mono">/public/uploads/</code> و دریافت لینک مستقیم
        </p>
      </div>

      {/* 2. Drag & Drop Multi-file Upload Zone with Radar Pulse */}
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
        className={`bg-slate-900 rounded-3xl p-8 sm:p-10 border-2 border-dashed text-center transition-all duration-300 shadow-xl ${
          isDragOver
            ? "border-amber-400 bg-amber-500/10 scale-[1.01] ring-4 ring-amber-500/20"
            : "border-slate-700 hover:border-amber-500/60"
        }`}
      >
        <label className="cursor-pointer flex flex-col items-center justify-center space-y-3.5">
          <div className={`w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center shadow-lg transition-transform duration-300 ${isDragOver ? "scale-110 text-amber-300" : "text-amber-400"}`}>
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>

          <div>
            <span className="font-black text-sm sm:text-base text-white block">
              {uploading
                ? "در حال آپلود و بهینه‌سازی فایل‌ها..."
                : "کلیک برای انتخاب یا کشیدن و رها کردن همزمان چند فایل"}
            </span>
            <span className="text-xs text-slate-400 mt-1.5 block font-medium">
              فرمت‌های مجاز: JPG, PNG, WEBP, SVG (امکان انتخاب همزمان چند فایل)
            </span>
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            disabled={uploading}
            onChange={(e) => handleUploadFiles(e.target.files)}
            className="hidden"
          />
        </label>
      </div>

      {/* 3. Search & Gallery Header */}
      <div className="bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2">
          <FileImage className="w-4 h-4 text-amber-400" />
          <h2 className="font-black text-sm text-white">
            گالری تصاویر ذخیره‌شده ({toPersianDigits(files.length)} فایل)
          </h2>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی نام فایل..."
            className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl pr-9 pl-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
        </div>
      </div>

      {/* 4. Images Grid Gallery */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
          <span className="text-xs font-bold">در حال بارگذاری تصاویر سرور...</span>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="bg-slate-900 rounded-3xl p-10 border border-slate-800 text-center space-y-2">
          <FileImage className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">تصویری یافت نشد</h3>
          <p className="text-xs text-slate-400">می‌توانید تصویر جدیدی را در کادر بالا آپلود فرمایید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.name}
              className="group bg-slate-900 rounded-2xl p-2.5 border border-slate-800 hover:border-slate-700 space-y-2 flex flex-col justify-between shadow-xl transition-all duration-200 animate-in fade-in"
            >
              
              {/* Thumbnail with hover zoom and lightbox trigger */}
              <div
                onClick={() => setPreviewImage(file.url)}
                className="aspect-square bg-slate-950 rounded-xl overflow-hidden relative cursor-pointer group-hover:ring-2 group-hover:ring-amber-500/50 transition-all"
              >
                <Image
                  src={file.url}
                  alt={file.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="w-4 h-4 text-white drop-shadow" />
                </div>
              </div>

              {/* Filename & Size */}
              <div>
                <p className="text-[11px] font-mono text-slate-300 truncate" title={file.name} dir="ltr">
                  {file.name}
                </p>
                <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                  {formatBytes(file.size)}
                </span>
              </div>

              {/* Actions: Copy URL & Delete */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => handleCopy(file.url)}
                  className="flex-1 py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="کپی آدرس تصویر"
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
                  onClick={() => handleDelete(file.name)}
                  className="p-1 bg-rose-950/60 hover:bg-rose-900 text-rose-400 rounded-lg transition-colors cursor-pointer"
                  title="حذف فایل از سرور"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* 5. Lightbox Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl max-h-[85vh] w-full bg-slate-900 rounded-3xl p-3 border border-slate-800 shadow-2xl flex flex-col items-center justify-center"
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-950/80 text-white flex items-center justify-center hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-full h-[65vh] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
              <Image
                src={previewImage}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>

            <div className="w-full pt-3 flex items-center justify-between px-2 text-xs font-mono text-slate-400">
              <span>{previewImage}</span>
              <button
                type="button"
                onClick={() => handleCopy(previewImage)}
                className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-sans text-xs font-bold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>کپی آدرس مستقیم</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
