"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  RotateCcw,
  Home,
  Phone,
  Zap,
} from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-16 px-4 transition-colors duration-200">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95">
        
        {/* Error Warning Icon */}
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto border-2 border-dashed border-rose-500/40">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            خطای موقت در اتصال مدار سیستم!
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            در برقراری ارتباط یا پردازش درخواست شما خطایی رخ داده است. لطفاً مجدداً تلاش فرمایید.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>تلاش مجدد و بارگذاری دوباره مدار</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>بازگشت به خانه</span>
          </Link>
        </div>

        {/* Support Note */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500">
          پشتیبانی تلفنی نجف‌آباد:{" "}
          <a href="tel:03142626116" className="text-amber-600 dark:text-amber-400 font-bold font-mono">
            ۰۳۱-۴۲۶۲۶۱۱۶
          </a>
        </div>

      </div>
    </div>
  );
}
