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

  // Match BOM items against store database
  const handleMatchBom = async () => {
    setIsProcessing(true);
    setAddedSuccess(false);

    try {
      const updated = await Promise.all(
        items.map(async (item) => {
          if (!item.query.trim()) return item;

          try {
            const res = await fetch(
              `/api/search?q=${encodeURIComponent(item.query.trim())}`
            );
            const data = await res.json();
            if (data.products && data.products.length > 0) {
              return {
                ...item,
                matchedProduct: data.products[0],
                status: "matched" as const,
              };
            } else {
              return {
                ...item,
                status: "not_found" as const,
              };
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
    let addedCount = 0;
    items.forEach((item) => {
      if (item.status === "matched" && item.matchedProduct) {
        addToCart(item.matchedProduct, item.qty);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setAddedSuccess(true);
    }
  };

  const matchedCount = items.filter((i) => i.status === "matched").length;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 text-xs font-bold px-3 py-1 rounded-full border border-blue-300">
            <Cpu className="w-3.5 h-3.5" />
            <span>ابزار ویژه مهندسان، مجریان برق و کارگاه‌ها</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            خرید گروهی و بارگذاری لیست قطعات (BOM)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            لیست پارت‌نامبرها، سیم و کابل، یا قطعات پروژه خود را وارد نمایید تا به صورت خودکار در انبار فروشگاه شیاسی تطبیق و به سبد خرید افزوده شوند.
          </p>
        </div>

        {/* BOM Form Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-500" />
              <span>جدول اقلام و تعداد درخواستی (BOM List)</span>
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addItemRow}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4 text-amber-600" />
                <span>افزودن ردیف جدید</span>
              </button>
            </div>
          </div>

          {/* Table of Rows */}
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-2 sm:gap-3 items-center bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs"
              >
                <div className="col-span-1 text-center font-bold text-slate-400">
                  {toPersianDigits(index + 1)}
                </div>

                <div className="col-span-6 sm:col-span-6">
                  <input
                    type="text"
                    value={item.query}
                    onChange={(e) => updateItemQuery(item.id, e.target.value)}
                    placeholder="نام قطعه، پارت‌نامبر یا مدل (مثال: سیم ۱.۵، موتور موتوژن)"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="col-span-3 sm:col-span-2 flex items-center gap-1">
                  <span className="text-[10px] text-slate-400 hidden sm:inline">تعداد:</span>
                  <input
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(e) => updateItemQty(item.id, parseInt(e.target.value) || 1)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-center font-bold text-xs"
                  />
                </div>

                <div className="col-span-2 sm:col-span-3 flex items-center justify-end gap-2">
                  {item.status === "matched" && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 truncate max-w-[140px]">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.matchedProduct.name}</span>
                    </span>
                  )}

                  {item.status === "not_found" && (
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>یافت نشد</span>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => removeItemRow(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleMatchBom}
              disabled={isProcessing}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isProcessing ? "در حال تطبیق با موجودی انبار..." : "بررسی و تطبیق موجودی انبار"}</span>
            </button>

            {matchedCount > 0 && (
              <button
                type="button"
                onClick={handleAddAllToCart}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-amber-500/25 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>افزودن همه {toPersianDigits(matchedCount)} قلم تطبیق‌یافته به سبد خرید</span>
              </button>
            )}
          </div>

          {addedSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-900 text-xs font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>کلیه اقلام تطبیق‌یافته به سبد خرید شما اضافه گردیدند.</span>
              </div>
              <Link
                href="/cart"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1"
              >
                <span>مشاهده سبد و تسویه</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
