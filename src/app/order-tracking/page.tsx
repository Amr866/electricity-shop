"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, FileText, Package, Truck, ArrowLeft, AlertCircle, Wrench } from "lucide-react";

export default function OrderLookupPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");
  const [isRepairCode, setIsRepairCode] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = orderNumber.trim().toUpperCase();
    setIsRepairCode(false);

    if (!cleanId) {
      setError("لطفاً شماره سفارش خود را وارد نمایید.");
      return;
    }

    // Smart Validation: Detect if user entered a Repair Tracking Code instead of an Order Code
    if (cleanId.startsWith("REP-") || cleanId.startsWith("REP") || cleanId.includes("REPAIR")) {
      setIsRepairCode(true);
      setError("این یک کد رهگیری تعمیرات است، نه شماره سفارش کالا!");
      return;
    }

    router.push(`/order-tracking/${cleanId}`);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 transition-colors duration-200">
      <div className="max-w-xl mx-auto px-4 space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            پیگیری وضعیت سفارش و مشاهده فاکتور
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            شماره سفارش درج شده در پیامک یا پیش‌فاکتور خود را وارد نمایید (مانند SH-140306-089)
          </p>
        </div>

        {/* Search Box Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                شماره سفارش کالا (مانند SH-140306-089)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => {
                    setOrderNumber(e.target.value);
                    setError("");
                    setIsRepairCode(false);
                  }}
                  placeholder="SH-..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-mono uppercase rounded-xl pr-10 pl-4 py-3 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <FileText className="w-5 h-5 text-slate-400 absolute right-3 top-3.5" />
              </div>
              
              {/* Error Box with Smart Repair Redirect */}
              {error && (
                <div className="mt-3 p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl space-y-2">
                  <p className="text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </p>
                  {isRepairCode && (
                    <div className="pt-1">
                      <Link
                        href={`/repair-service?code=${encodeURIComponent(orderNumber.trim().toUpperCase())}`}
                        className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all shadow-sm"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>انتقال به بخش پیگیری تعمیرات ↗</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>استعلام و پیگیری سفارش</span>
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>سفارش نمونه تستی:</span>
            <Link
              href="/order-tracking/SH-140306-089"
              className="text-amber-600 dark:text-amber-400 font-bold hover:underline font-mono"
            >
              SH-140306-089
            </Link>
          </div>
        </div>

        {/* Guarantees Box */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-300">
          <Truck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            سفارش‌های شهر نجف‌آباد و اصفهان به صورت لحظه‌ای با پیک اسنپ‌باکس و کد اختصاصی تحویل داده می‌شوند.
          </span>
        </div>

      </div>
    </div>
  );
}
