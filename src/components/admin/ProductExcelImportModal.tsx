"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  X,
  Download,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { toPersianDigits, toAsciiDigits } from "@/lib/utils";

interface ProductExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductExcelImportModal({
  isOpen,
  onClose,
  onSuccess,
}: ProductExcelImportModalProps) {
  const [csvText, setCsvText] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!isOpen) return null;

  // Sample CSV Template download or copy
  const sampleCsv = `نام کالا,کد محصول (SKU),قیمت (تومان),موجودی,برند,نام دسته‌بندی,اسلاگ دسته‌بندی
موتور کولر آبی ۳/۴ اسب موتوژن,MOT-34-MOTO,3850000,15,موتوژن تبریز,پنکه، کولر و بخاری برقی,home-appliances-cooling-heating
سیم افشان ۱.۵ تمام مس کلاف ۱۰۰ متری,WIRE-15-ALB,980000,50,البرز الکتریک,سیم، کابل و آنتن,wiring-building
پنل سنسوردار ۲۴ وات هوشمند,PNL-24-SHAH,460000,30,شاهچراغ,روشنایی و پروژکتور خورشیدی,lighting-fixtures`;

  const handleLoadSample = () => {
    setCsvText(sampleCsv);
  };

  const handleParseAndUpload = async () => {
    if (!csvText.trim()) {
      setResultMsg({ type: "error", text: "لطفاً داده‌های فایل اکسل/CSV را وارد نمایید." });
      return;
    }

    setLoading(true);
    setResultMsg(null);

    try {
      const lines = csvText.trim().split("\n");
      if (lines.length < 2) {
        throw new Error("فایل باید حداقل دارای یک ردیف عنوان و یک ردیف داده باشد.");
      }

      // Parse CSV rows
      const products: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Split by comma or semicolon or tab
        const parts = line.includes("\t")
          ? line.split("\t")
          : line.includes(";")
          ? line.split(";")
          : line.split(",");

        if (parts.length >= 3) {
          const rawPrice = toAsciiDigits(parts[2] || "").replace(/\D/g, "");
          const rawStock = toAsciiDigits(parts[3] || "").replace(/\D/g, "");

          products.push({
            name: parts[0]?.trim(),
            sku: parts[1]?.trim() || undefined,
            price: rawPrice ? Number(rawPrice) : 0,
            stock: rawStock ? Number(rawStock) : 10,
            brand: parts[4]?.trim() || "متفرقه",
            categoryName: parts[5]?.trim() || "پنکه، کولر و بخاری برقی",
            categorySlug: parts[6]?.trim() || "home-appliances-cooling-heating",
          });
        }
      }

      if (products.length === 0) {
        throw new Error("هیچ ردیف معتبری در متن وارد شده یافت نشد.");
      }

      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطا در آپلود دسته‌ای کالاها");
      }

      setResultMsg({ type: "success", text: data.message });
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      setResultMsg({ type: "error", text: err.message || "خطا در پردازش فایل" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                بارگذاری دسته‌ای کالاها از اکسل (Excel / CSV)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                ایمپورت سریع قیمت‌ها، موجودی و کالاها از نرم‌افزارهای حسابداری هلو، سپیدار و اکسل
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {resultMsg && (
            <div
              className={`p-3.5 rounded-2xl flex items-center gap-2 font-bold ${
                resultMsg.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  : "bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
              }`}
            >
              {resultMsg.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{resultMsg.text}</span>
            </div>
          )}

          {/* Quick Guidance */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 text-slate-700 dark:text-slate-300 space-y-1">
            <div className="flex items-center justify-between">
              <strong className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>فرمت ستون‌های فایل اکسل / CSV:</span>
              </strong>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-[11px] text-amber-700 dark:text-amber-400 font-bold underline hover:text-amber-900"
              >
                بارگذاری نمونه آماده
              </button>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              ستون‌ها به ترتیب: <code>نام کالا</code>، <code>کد SKU</code>، <code>قیمت (تومان)</code>، <code>موجودی</code>، <code>برند</code>، <code>دسته‌بندی</code>
            </p>
          </div>

          {/* Textarea / Input area */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 block">
              محتوای فایل CSV را اینجا الصاق (Paste) نمایید:
            </label>
            <textarea
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="نام کالا,کد محصول,قیمت,موجودی,برند..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-xs"
          >
            انصراف
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleParseAndUpload}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all hover-glow disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{loading ? "در حال ایمپورت اطلاعات..." : "پردازش و ذخیره در کاتالوگ"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
