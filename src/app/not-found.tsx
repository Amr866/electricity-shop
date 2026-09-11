import React from "react";
import Link from "next/link";
import {
  ZapOff,
  Home,
  ShoppingBag,
  Wrench,
  Search,
  ArrowLeft,
  Phone,
  RotateCcw,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-16 px-4 transition-colors duration-200 relative overflow-hidden">
      
      {/* Ambient Electric Glow Highlights */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full text-center space-y-6 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Animated ZapOff Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="w-24 h-24 rounded-3xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center border-2 border-dashed border-amber-500/40 animate-pulse">
            <ZapOff className="w-12 h-12" />
          </div>
          <span className="absolute -bottom-2 -right-2 bg-rose-600 text-white font-mono font-black text-xs px-2.5 py-1 rounded-full shadow-md">
            ۴۰۴
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            اتصال مدار برق قطع شده است! (صفحه یافت نشد)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            متأسفانه صفحه‌ای که به دنبال آن بودید جابجا شده، حذف گردیده یا آدرس وارد شده نادرست است.
          </p>
        </div>

        {/* Quick Search Form */}
        <form
          action="/products"
          method="GET"
          className="relative max-w-md mx-auto"
        >
          <input
            type="text"
            name="q"
            placeholder="جستجوی کالا، برند یا قطعه (مثال: موتوژن، سیم مس)..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-2xl pr-10 pl-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
        </form>

        {/* Quick Navigation Chips */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 text-xs">
          <Link
            href="/"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>صفحه اصلی فروشگاه</span>
          </Link>

          <Link
            href="/products"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
            <span>فروشگاه محصولات</span>
          </Link>

          <Link
            href="/repair-service"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Wrench className="w-3.5 h-3.5 text-cyan-400" />
            <span>کارگاه تعمیرات</span>
          </Link>
        </div>

        {/* Support Note */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
          <span>نیاز به راهنمایی دارید؟</span>
          <Link href="/contact" className="text-amber-600 dark:text-amber-400 font-bold hover:underline inline-flex items-center gap-1">
            <span>تماس با پشتیبانی فروشگاه شیاسی (</span>
            <bdi dir="ltr">۰۳۱-۴۲۶۲۶۱۱۶</bdi>
            <span>)</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
