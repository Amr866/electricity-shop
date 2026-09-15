"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  ShoppingBag,
  UploadCloud,
  Settings,
  ArrowRight,
  Zap,
  Sparkles,
  Menu,
  X,
  Store,
  Database,
  BookOpen,
  Wrench,
  FileSpreadsheet,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    {
      href: "/admin",
      label: "داشبورد و آمار",
      icon: LayoutDashboard,
      color: "text-amber-400",
      exact: true,
    },
    {
      href: "/admin/products",
      label: "محصولات و موجودی",
      icon: Package,
      color: "text-blue-400",
    },
    {
      href: "/admin/orders",
      label: "سفارشات و ارسال",
      icon: ShoppingBag,
      color: "text-emerald-400",
    },
    {
      href: "/admin/repairs",
      label: "تعمیرات و کارگاه",
      icon: Wrench,
      color: "text-amber-400",
    },
    {
      href: "/admin/bom",
      label: "استعلام‌های BOM",
      icon: FileSpreadsheet,
      color: "text-cyan-400",
    },
    {
      href: "/admin/categories",
      label: "دسته‌بندی‌ها",
      icon: Layers,
      color: "text-purple-400",
    },
    {
      href: "/admin/coupons",
      label: "کدهای تخفیف",
      icon: Tag,
      color: "text-rose-400",
    },
    {
      href: "/admin/uploads",
      label: "تصاویر و رسانه",
      icon: UploadCloud,
      color: "text-cyan-400",
    },
    {
      href: "/admin/articles",
      label: "مقالات و وبلاگ",
      icon: BookOpen,
      color: "text-amber-400",
    },
    {
      href: "/admin/settings",
      label: "تنظیمات فروشگاه",
      icon: Settings,
      color: "text-amber-300",
    },
    {
      href: "/admin/backup",
      label: "پشتیبان‌گیری دیتابیس",
      icon: Database,
      color: "text-emerald-400",
    },
  ];

  return (
    <>
      {/* Mobile Top Header Bar */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-slate-800 rounded-xl text-slate-200 hover:text-white"
            aria-label="منوی ادمین"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Zap className="w-4 h-4 fill-slate-950" />
            </div>
            <span className="font-extrabold text-xs text-white">مدیریت شیاسی</span>
          </div>
        </div>

        <Link
          href="/"
          className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1"
        >
          <Store className="w-3.5 h-3.5" />
          <span>مشاهده سایت</span>
        </Link>
      </div>

      {/* Mobile Horizontal Quick-Nav Scroll Bar */}
      <div className="md:hidden bg-slate-950/80 border-b border-slate-800/80 px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none sticky top-[57px] z-30 backdrop-blur-md">
        {links.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "bg-slate-900 text-slate-300 border border-slate-800"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-slate-950" : link.color}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Mobile Drawer (Slide-in) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] bg-slate-950/95 z-50 p-5 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="space-y-2 text-xs font-bold">
            {links.map((link) => {
              const isActive = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                    isActive
                      ? "bg-amber-500 text-slate-950 font-black shadow-md"
                      : "bg-slate-900 text-slate-200 border border-slate-800"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : link.color}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 border-l border-slate-800 p-5 space-y-6 shrink-0 flex-col justify-between min-h-screen">
        <div className="space-y-6">
          {/* Logo & Store Info */}
          <Link href="/" className="flex items-center gap-2.5 pb-4 border-b border-slate-800 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">پنل مدیریت فروشگاه</h2>
              <span className="text-[11px] text-amber-400 font-medium">فروشگاه تخصصی شیاسی (نجف‌آباد)</span>
            </div>
          </Link>

          {/* Dynamic Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold">
            {links.map((link) => {
              const isActive = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-slate-950" : link.color
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Return to Website */}
        <div className="pt-4 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center justify-between text-xs text-slate-400 hover:text-amber-400 p-2.5 rounded-xl hover:bg-slate-800/50 transition-colors"
          >
            <span>مشاهده سایت فروشگاه</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>
      </aside>
    </>
  );
}
