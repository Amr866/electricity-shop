import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  ArrowRight,
  Zap,
  Users,
  TrendingUp,
} from "lucide-react";
import { formatJalaliDate } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-l border-slate-800 p-5 space-y-6 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          
          {/* Logo & Store Info */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              <Zap className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">پنل مدیریت فروشگاه</h2>
              <span className="text-[11px] text-amber-400 font-medium">الکتریک نقش جهان اصفهان</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-amber-400 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>داشبورد و آمار فروش</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Package className="w-4 h-4 text-blue-400" />
              <span>مدیریت محصولات و موجودی</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>مدیریت سفارشات و ارسال</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4 text-purple-400" />
              <span>تنظیمات شعبه و درگاه</span>
            </Link>
          </nav>

        </div>

        {/* Bottom: Return to Website */}
        <div className="pt-4 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center justify-between text-xs text-slate-400 hover:text-amber-400 p-2 rounded-xl hover:bg-slate-800/50 transition-colors"
          >
            <span>بازگشت به نمای مشتری</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900/50">
        {/* Top Bar */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">تاریخ امروز:</span>
            <span className="text-xs font-bold text-slate-200">
              {formatJalaliDate(new Date())}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-emerald-950 border border-emerald-800 text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              دیتابیس PostgreSQL متصل است
            </span>
          </div>
        </header>

        {/* Main Body */}
        <main className="p-6 flex-1 overflow-y-auto">{children}</main>
      </div>

    </div>
  );
}
