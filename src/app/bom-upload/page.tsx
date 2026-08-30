"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatToman, toPersianDigits } from "@/lib/utils";
import {
  FileSpreadsheet,
  Upload,
  Plus,
  Trash2,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Cpu,
  ArrowLeft,
  Download,
  ClipboardPaste,
  MessageCircle,
  FileDown,
  Layers,
  Check,
  RefreshCw,
  Package,
  Wrench,
  Zap,
} from "lucide-react";

export interface BomMatchedProduct {
  id: string;
  name: string;
  price: number;
  slug: string;
  stock: number;
  images?: string | null;
}

export interface BomItem {
  id: string;
  query: string;
  qty: number;
  matchedProduct?: BomMatchedProduct | null;
  status: "pending" | "matched" | "not_found";
}

function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Preset Project Packages for Electrical Contractors
const PRESET_PROJECTS = [
  {
    title: "پکیج کابل‌کشی ساختمان",
    icon: Zap,
    items: [
      { query: "سیم افشان ۱.۵", qty: 4 },
      { query: "سیم افشان ۲.۵", qty: 3 },
      { query: "کابل ۲ در ۱.۵", qty: 2 },
      { query: "فیوز مینیاتوری ۱۶ آمپر", qty: 6 },
    ],
  },
  {
    title: "پکیج سرویس ۵ کولر آبی",
    icon: Wrench,
    items: [
      { query: "موتور کولر موتوژن ۳/۴", qty: 2 },
      { query: "پمپ آب کولر الکتروژن", qty: 5 },
      { query: "خازن راه‌انداز موتور", qty: 4 },
      { query: "کلید کولر آبی توکار", qty: 5 },
    ],
  },
  {
    title: "پکیج روشنایی و تهویه",
    icon: Layers,
    items: [
      { query: "پنکه پارس خزر", qty: 2 },
      { query: "لامپ ال‌ای‌دی ۲۰ وات", qty: 10 },
      { query: "آنتن هانی بوستردار", qty: 2 },
    ],
  },
];

export default function BomUploadPage() {
  const { addToCart } = useCart();
  
  const [items, setItems] = useState<BomItem[]>([
    { id: generateUniqueId(), query: "پنکه پارس خزر", qty: 1, status: "pending" },
    { id: generateUniqueId(), query: "موتور کولر موتوژن", qty: 1, status: "pending" },
    { id: generateUniqueId(), query: "آنتن هانی", qty: 2, status: "pending" },
    { id: generateUniqueId(), query: "سیم افشان ۱.۵", qty: 3, status: "pending" },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addItemRow = () => {
    setItems((prev) => [
      ...prev,
      { id: generateUniqueId(), query: "", qty: 1, status: "pending" },
    ]);
  };

  const removeItemRow = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearAllRows = () => {
    setItems([]);
  };

  const updateItemQuery = (id: string, query: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, query, status: "pending", matchedProduct: null } : i))
    );
  };

  const updateItemQty = (id: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
    );
  };

  // Load Preset Project Package
  const handleLoadPreset = (presetItems: { query: string; qty: number }[]) => {
    const newItems: BomItem[] = presetItems.map((p) => ({
      id: generateUniqueId(),
      query: p.query,
      qty: p.qty,
      status: "pending",
    }));
    setItems(newItems);
  };

  // Parse Text or CSV lines
  const parseRawLinesToItems = (text: string) => {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const parsed: BomItem[] = [];

    lines.forEach((line) => {
      // Split by comma, tab, or hyphen
      const parts = line.split(/[,\t;|]/).map((p) => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        const query = parts[0];
        const qtyNum = parseInt(parts[1].replace(/[^\d]/g, "")) || 1;
        if (query) {
          parsed.push({
            id: generateUniqueId(),
            query,
            qty: qtyNum,
            status: "pending",
          });
        }
      } else if (parts.length === 1 && parts[0]) {
        parsed.push({
          id: generateUniqueId(),
          query: parts[0],
          qty: 1,
          status: "pending",
        });
      }
    });

    if (parsed.length > 0) {
      setItems((prev) => [...prev, ...parsed]);
    }
  };

  // Handle File Upload (CSV or Text)
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        parseRawLinesToItems(content);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Download Sample Template CSV
  const handleDownloadSampleTemplate = () => {
    const csvContent = "نام کالا یا پارت نامبر,تعداد\nسیم افشان ۱.۵ خراسان,۵\nموتور کولر موتوژن تبریز ۳/۴,۱\nپمپ آب کولر الکتروژن,۲\nآنتن برقی هانی,۳\n";
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sample-bom-electricity-shop.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Batch Chunked Auto-Match with Database (Avoids server burst flooding)
  const handleAutoMatch = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);

    try {
      const chunkSize = 4;
      const updatedItems = [...items];

      for (let i = 0; i < updatedItems.length; i += chunkSize) {
        const chunk = updatedItems.slice(i, i + chunkSize);
        await Promise.all(
          chunk.map(async (item, chunkIdx) => {
            const actualIndex = i + chunkIdx;
            if (!item.query.trim()) return;

            try {
              const res = await fetch(`/api/search?q=${encodeURIComponent(item.query.trim())}`);
              const data = await res.json();
              if (res.ok && data.products && data.products.length > 0) {
                const best = data.products[0];
                updatedItems[actualIndex] = {
                  ...item,
                  matchedProduct: {
                    id: best.id,
                    name: best.name,
                    price: best.price,
                    slug: best.slug,
                    stock: best.stock ?? 10,
                    images: best.images,
                  },
                  status: "matched",
                };
              } else {
                updatedItems[actualIndex] = { ...item, status: "not_found", matchedProduct: null };
              }
            } catch {
              updatedItems[actualIndex] = { ...item, status: "not_found", matchedProduct: null };
            }
          })
        );
      }

      setItems([...updatedItems]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Add all matched items to cart
  const handleAddAllToCart = () => {
    const matched = items.filter((i) => i.status === "matched" && i.matchedProduct);
    if (matched.length === 0) return;

    matched.forEach((i) => {
      if (i.matchedProduct) {
        addToCart(i.matchedProduct as any, i.qty);
      }
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3500);
  };

  // Calculate Total Financials
  const matchedItems = items.filter((i) => i.status === "matched" && i.matchedProduct);
  const matchedCount = matchedItems.length;
  const totalBomPrice = matchedItems.reduce(
    (sum, item) => sum + (item.matchedProduct?.price || 0) * item.qty,
    0
  );

  // Generate WhatsApp Proforma Text
  const handleWhatsAppQuote = () => {
    if (matchedItems.length === 0) {
      alert("ابتدا دکمه تطبیق هوشمند لیست را بزنید تا قیمت اقلام مشخص گردد.");
      return;
    }

    let msg = `سلام و احترام، استعلام پیش‌فاکتور لیست قطعات (BOM) از فروشگاه شیاسی:\n\n`;
    matchedItems.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.matchedProduct?.name} - تعداد: ${item.qty} عدد - فی: ${formatToman(item.matchedProduct?.price || 0)}\n`;
    });
    msg += `\n💰 مجموع برآورد تقریبی: ${formatToman(totalBomPrice)}\nلطفاً موجودی نهایی و پیش‌فاکتور رسمی را تأیید بفرمایید.`;

    window.open(`https://wa.me/989162665884?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-xs font-black px-3.5 py-1 rounded-full border border-amber-300 dark:border-amber-700 shadow-2xs">
            <Cpu className="w-3.5 h-3.5" />
            <span>سامانه هوشمند مهندسان، مجریان برق و کارگاه‌ها</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            خرید گروهی و بارگذاری لیست قطعات (BOM)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            لیست پارت‌نامبرها، سیم و کابل، یا قطعات پروژه خود را با فایل اکسل یا متن وارد نمایید تا به صورت خودکار در انبار فروشگاه شیاسی تطبیق و قیمت‌گذاری شوند.
          </p>
        </div>

        {/* 3 Preset Project Packages */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>پکیج‌های مهندسی آماده (کلیک جهت درج سریع اقلام):</span>
            </span>
            <button
              type="button"
              onClick={handleDownloadSampleTemplate}
              className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>دانلود نمونه فایل اکسل استاندارد BOM</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRESET_PROJECTS.map((pkg) => {
              const PkgIcon = pkg.icon;
              return (
                <button
                  key={pkg.title}
                  type="button"
                  onClick={() => handleLoadPreset(pkg.items)}
                  className="bg-white dark:bg-slate-900 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 text-right transition-all flex items-center justify-between group active:scale-98 shadow-2xs hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <PkgIcon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <strong className="text-xs block text-slate-900 dark:text-white font-bold group-hover:text-amber-600 dark:group-hover:text-amber-400">
                        {pkg.title}
                      </strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {toPersianDigits(pkg.items.length)} قلم کالای منتخب
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg">
                    درج لیست +
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Drag & Drop File Upload Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? "border-amber-500 bg-amber-50/80 dark:bg-amber-950/60 scale-101 shadow-lg shadow-amber-500/10"
              : "border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 hover:border-amber-400 dark:hover:border-amber-500"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, .txt, .xlsx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-2xs">
            <Upload className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <strong className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
              فایل اکسل یا CSV لیست قطعات خود را اینجا بکشید یا کلیک کنید
            </strong>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              فرمت پشتیبانی‌شده: فایل متنی، CSV و Excel (ستون اول: نام کالا، ستون دوم: تعداد)
            </p>
          </div>
        </div>

        {/* BOM Form & Table Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-6 transition-colors duration-200">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-amber-500" />
              <h2 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                جدول اقلام و تعداد درخواستی (BOM List)
              </h2>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold px-2 py-0.5 rounded-full">
                {toPersianDigits(items.length)} ردیف
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setShowPasteModal(true)}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all active:scale-95"
              >
                <ClipboardPaste className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>چسباندن متن چندخطی</span>
              </button>

              <button
                type="button"
                onClick={addItemRow}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95 hover-glow"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن ردیف</span>
              </button>

              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllRows}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  title="پاک‌کردن همه ردیف‌ها"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Table of Rows with Scanning Feedback */}
          {items.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <Package className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                هیچ ردیفی در جدول نیست. با دکمه «افزودن ردیف» یا بارگذاری فایل اکسل شروع کنید.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-2 sm:gap-3 items-center bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-750 text-xs transition-all hover:border-amber-400/50"
                >
                  <div className="col-span-1 text-center font-black text-slate-400 dark:text-slate-500 text-xs">
                    {toPersianDigits(index + 1)}
                  </div>

                  <div className="col-span-6 sm:col-span-5">
                    <input
                      type="text"
                      value={item.query}
                      onChange={(e) => updateItemQuery(item.id, e.target.value)}
                      placeholder="نام قطعه، پارت‌نامبر یا مدل (مثال: سیم ۱.۵، موتور موتوژن)"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-2 flex items-center gap-1">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:inline font-bold">تعداد:</span>
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => updateItemQty(item.id, parseInt(e.target.value) || 1)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-2 py-2 text-center font-mono font-bold text-xs"
                    />
                  </div>

                  {/* Status & Matched Info */}
                  <div className="col-span-2 sm:col-span-4 flex items-center justify-end gap-2">
                    {item.status === "matched" && item.matchedProduct && (
                      <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-300 px-2.5 py-1 rounded-xl truncate animate-in zoom-in-95 duration-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div className="truncate text-[11px]">
                          <span className="font-bold block truncate">{item.matchedProduct.name}</span>
                          <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                            فی: {formatToman(item.matchedProduct.price)}
                          </span>
                        </div>
                      </div>
                    )}

                    {item.status === "not_found" && (
                      <span className="bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 border border-rose-200 dark:border-rose-800 animate-in fade-in">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>یافت نشد</span>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => removeItemRow(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                      title="حذف ردیف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Financial Summary Box (When matches exist) */}
          {matchedCount > 0 && (
            <div className="bg-gradient-to-r from-amber-50 via-amber-100/50 to-amber-50 dark:from-slate-800/90 dark:via-slate-800/60 dark:to-slate-800/90 border border-amber-300 dark:border-amber-700/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
              <div className="space-y-1 text-center sm:text-right">
                <span className="text-[11px] text-amber-900 dark:text-amber-300 font-bold block">
                  خلاصه پیش‌فاکتور اقلام تطبیق‌یافته انبار ({toPersianDigits(matchedCount)} قلم):
                </span>
                <div className="flex items-baseline gap-1.5 justify-center sm:justify-start">
                  <strong className="text-xl sm:text-2xl font-mono font-black text-slate-900 dark:text-amber-400">
                    {formatToman(totalBomPrice)}
                  </strong>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">تومان</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleWhatsAppQuote}
                  className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>استعلام و تایید در واتساپ</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddAllToCart}
                  className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 active:scale-95 hover-glow"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>افزودن همه به سبد</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleAutoMatch}
              disabled={isProcessing || items.length === 0}
              className="w-full sm:w-auto bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
            >
              {isProcessing ? (
                <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-400" />
              )}
              <span>{isProcessing ? "در حال تطبیق با موجودی انبار..." : "تطبیق هوشمند لیست با کاتالوگ"}</span>
            </button>

            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              تضمین اصالت کالا و استعلام بلادرنگ انبار مرکزی شیاسی نجف‌آباد
            </span>
          </div>

          {addedSuccess && (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-bold p-4 rounded-2xl flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>اقلام تطبیق‌یافته با موفقیت به سبد خرید افزوده شدند!</span>
              </div>
              <Link href="/cart" className="text-amber-700 dark:text-amber-400 underline font-bold">
                مشاهده سبد خرید ↗
              </Link>
            </div>
          )}

        </div>

      </div>

      {/* Multi-Line Text Paste Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ClipboardPaste className="w-4 h-4 text-amber-500" />
                <span>چسباندن متن لیست اقلام (BOM)</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              هر قلم کالا را در یک خط بنویسید یا از اکسل کپی کنید (می‌توانید با کاما یا خط تیره تعداد را هم مشخص کنید):
            </p>

            <textarea
              rows={6}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="مثال:&#10;سیم افشان ۱.۵, ۵&#10;موتور موتوژن تبریز ۳/۴, ۱&#10;پمپ آب کولر, ۲&#10;پنکه پارس خزر"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono leading-relaxed"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className="text-xs font-bold text-slate-500 dark:text-slate-400 px-4 py-2"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => {
                  if (pasteText.trim()) {
                    parseRawLinesToItems(pasteText);
                    setPasteText("");
                    setShowPasteModal(false);
                  }
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm"
              >
                افزودن به جدول لیست
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
