"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, FileText, Package, Truck, ArrowLeft, AlertCircle, ShieldCheck } from "lucide-react";

export default function OrderLookupPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = orderNumber.trim().toUpperCase();
    if (!cleanId) {
      setError("لطفاً شماره سفارش خود را وارد نمایید.");
      return;
    }
    router.push(`/order-tracking/${cleanId}`);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-xl mx-auto px-4 space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            پیگیری وضعیت سفارش و مشاهده فاکتور
          </h1>
          <p className="text-xs text-slate-500">
            شماره سفارش درج شده در پیامک یا پیش‌فاکتور خود را وارد نمایید
          </p>
        </div>

        {/* Search Box Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                شماره سفارش (مانند NJ-140306-089)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => {
                    setOrderNumber(e.target.value);
                    setError("");
                  }}
                  placeholder="NJ-..."
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm font-mono uppercase rounded-xl pr-10 pl-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <FileText className="w-5 h-5 text-slate-400 absolute right-3 top-3.5" />
              </div>
              {error && (
                <p className="text-rose-600 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>استعلام و پیگیری سفارش</span>
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>سفارش نمونه تستی:</span>
            <Link
              href="/order-tracking/SH-140306-089"
              className="text-amber-600 font-bold hover:underline font-mono"
            >
              SH-140306-089
            </Link>
          </div>
        </div>

        {/* Guarantees Box */}
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3 text-xs text-emerald-900">
          <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            سفارش‌های شهر اصفهان به صورت لحظه‌ای با پیک اسنپ‌باکس و کد اختصاصی تحویل داده می‌شوند.
          </span>
        </div>

      </div>
    </div>
  );
}
