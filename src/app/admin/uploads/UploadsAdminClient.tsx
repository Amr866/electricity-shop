"use client";

import React, { useState } from "react";
import { UploadCloud, CheckCircle2, Copy, Image as ImageIcon, Sparkles } from "lucide-react";

export function UploadsAdminClient() {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
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
        setUploadedImages([data.url, ...uploadedImages]);
      } else {
        alert(data.message || "خطا در آپلود.");
      }
    } catch (e) {
      alert("خطای سرور.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-cyan-400" />
          <span>آپلود و مدیریت تصاویر محصولات</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          تصاویر انتخابی شما در مسیر <code className="text-amber-400 font-mono">/public/uploads/</code> ذخیره شده و آدرس مستقیم دریافت می‌کنید.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="bg-slate-900 rounded-3xl p-8 border-2 border-dashed border-slate-700 hover:border-amber-400 text-center transition-colors">
        <label className="cursor-pointer flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center shadow-lg">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-white block">
              {uploading ? "در حال آپلود تصویر..." : "کلیک برای انتخاب فایل از کامپیوتر یا موبایل"}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              فرمت‌های مجاز: JPG, PNG, WEBP, SVG
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Uploaded Images List */}
      {uploadedImages.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-sm text-white">تصاویر تازه آپلود شده:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedImages.map((url) => (
              <div
                key={url}
                className="bg-slate-900 rounded-2xl p-3 border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div className="aspect-square bg-slate-950 rounded-xl overflow-hidden p-2 flex items-center justify-center">
                  <img
                    src={url}
                    alt="Uploaded"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-[10px] text-slate-400 font-mono truncate block">
                    {url}
                  </span>
                  <button
                    onClick={() => handleCopy(url)}
                    className="w-full py-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 font-bold rounded-lg transition-colors flex items-center justify-center gap-1 text-[11px]"
                  >
                    {copiedUrl === url ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>کپی شد!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>کپی لینک برای درج در کالا</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guide Note */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
        <strong className="text-amber-400 flex items-center gap-1">
          <Sparkles className="w-4 h-4" />
          راهنمای استفاده از تصاویر در فروشگاه:
        </strong>
        <p className="leading-relaxed">
          پس از آپلود هر تصویر، دکمه «کپی لینک» را بزنید و در فرم افزودن محصول در فیلد <strong>آدرس اینترنتی تصویر</strong> قرار دهید. همچنین می‌توانید تصاویر را مستقیماً در پوشه <code className="text-amber-400 font-mono">public/images</code> پروژه کپی کنید.
        </p>
      </div>

    </div>
  );
}
