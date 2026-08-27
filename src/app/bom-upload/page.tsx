"use client";

import React, { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

interface BomItem {
  id: string;
  query: string;
  qty: number;
  matchedProduct?: any;
  status: "pending" | "matched" | "not_found";
}

export default function BomUploadPage() {
  const { addToCart } = useCart();
  const [items, setItems] = useState<BomItem[]>([
    { id: "1", query: "پنکه پارس خزر", qty: 1, status: "pending" },
    { id: "2", query: "موتور کولر موتوژن", qty: 1, status: "pending" },
    { id: "3", query: "آنتن هانی", qty: 2, status: "pending" },
    { id: "4", query: "سیم افشان ۱.۵", qty: 3, status: "pending" },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const addItemRow = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), query: "", qty: 1, status: "pending" },
    ]);
  };

  const removeItemRow = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItemQuery = (id: string, query: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, query, status: "pending" } : i))
    );
  };

  const updateItemQty = (id: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
    );
  };

  // Match items with products in DB
  const handleAutoMatch = async () => {
    setIsProcessing(true);
    try {
      const updated = await Promise.all(
        items.map(async (item) => {
          if (!item.query.trim()) return item;

          try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(item.query.trim())}`);
            const data = await res.json();
            if (res.ok && data.products && data.products.length > 0) {
              return {
                ...item,
                matchedProduct: data.products[0],
                status: "matched" as const,
              };
            } else {
              return { ...item, status: "not_found" as const };
            }
          } catch {
            return { ...item, status: "not_found" as const };
          }
        })
      );
      setItems(updated);
    } finally {
      setIsProcessing(false);
    }
  };

  // Add all matched items to cart
  const handleAddAllToCart = () => {
    const matched = items.filter((i) => i.status === "matched" && i.matchedProduct);
    if (matched.length === 0) return;

    matched.forEach((i) => {
      addToCart(i.matchedProduct, i.qty);
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  const matchedCount = items.filter((i) => i.status === "matched").length;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-300 dark:border-blue-800">
            <Cpu className="w-3.5 h-3.5" />
            <span>ابزار ویژه مهندسان، مجریان برق و کارگاه‌ها</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            خرید گروهی و بارگذاری لیست قطعات (BOM)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            لیست پارت‌نامبرها، سیم و کابل، یا قطعات پروژه خود را وارد نمایید تا به صورت خودکار در انبار فروشگاه شیاسی تطبیق و به سبد خرید افزوده شوند.
          </p>
        </div>

        {/* BOM Form Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors duration-200">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-500" />
              <span>جدول اقلام و تعداد درخواستی (BOM List)</span>
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addItemRow}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>افزودن ردیف جدید</span>
              </button>
            </div>
          </div>

          {/* Table of Rows */}
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-2 sm:gap-3 items-center bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs"
              >
                <div className="col-span-1 text-center font-bold text-slate-400 dark:text-slate-500">
                  {toPersianDigits(index + 1)}
                </div>

                <div className="col-span-6 sm:col-span-6">
                  <input
                    type="text"
                    value={item.query}
                    onChange={(e) => updateItemQuery(item.id, e.target.value)}
                    placeholder="نام قطعه، پارت‌نامبر یا مدل (مثال: سیم ۱.۵، موتور موتوژن)"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="col-span-3 sm:col-span-2 flex items-center gap-1">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:inline">تعداد:</span>
                  <input
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(e) => updateItemQty(item.id, parseInt(e.target.value) || 1)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-2 py-2 text-center font-bold text-xs"
                  />
                </div>

                <div className="col-span-2 sm:col-span-3 flex items-center justify-end gap-2">
                  {item.status === "matched" && (
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 truncate max-w-[140px] border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.matchedProduct.name}</span>
                    </span>
                  )}

                  {item.status === "not_found" && (
                    <span className="bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 border border-rose-200 dark:border-rose-800">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>یافت نشد</span>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => removeItemRow(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleAutoMatch}
              disabled={isProcessing}
              className="w-full sm:w-auto bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isProcessing ? "در حال تطبیق با موجودی انبار..." : "تطبیق هوشمند لیست با کاتالوگ"}</span>
            </button>

            {matchedCount > 0 && (
              <button
                type="button"
                onClick={handleAddAllToCart}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>افزودن ({toPersianDigits(matchedCount)}) قلم منطبق به سبد خرید</span>
              </button>
            )}
          </div>

          {addedSuccess && (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-bold p-4 rounded-2xl flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>اقلام تطبیق‌یافته با موفقیت به سبد خرید افزوده شدند!</span>
              </div>
              <Link href="/cart" className="text-amber-700 dark:text-amber-400 underline font-bold">
                مشاهده سبد خرید
              </Link>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
