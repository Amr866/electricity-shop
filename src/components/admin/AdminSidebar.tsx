"use client";

import React from "react";
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
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    {
      href: "/admin",
      label: "داشبورد و آمار فروش",
      icon: LayoutDashboard,
      color: "text-amber-400",
      exact: true,
    },
    {
      href: "/admin/products",
      label: "مدیریت محصولات و موجودی",
      icon: Package,
      color: "text-blue-400",
    },
    {
      href: "/admin/categories",
      label: "مدیریت دسته‌بندی‌ها",
      icon: Layers,
      color: "text-purple-400",
    },
    {
      href: "/admin/coupons",
      label: "کدهای تخفیف و بن خرید",
      icon: Tag,
      color: "text-rose-400",
    },
    {
      href: "/admin/orders",
      label: "مدیریت سفارشات و ارسال",
      icon: ShoppingBag,
      color: "text-emerald-400",
    },
    {
      href: "/admin/uploads",
      label: "آپلود و گالری تصاویر",
      icon: UploadCloud,
      color: "text-cyan-400",
    },
    {
      href: "/admin/settings",
      label: "تنظیمات شعبه و درگاه",
      icon: Settings,
      color: "text-amber-300",
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-l border-slate-800 p-5 space-y-6 shrink-0 flex flex-col justify-between">
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
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </aside>
  );
}
