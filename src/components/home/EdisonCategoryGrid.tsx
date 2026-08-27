"use client";

import React from "react";
import Link from "next/link";
import {
  Sun,
  Lightbulb,
  Sparkles,
  Zap,
  Cpu,
  Lock,
  Cable,
  RotateCw,
  ShieldAlert,
  Gift,
  AlertTriangle,
  LayoutGrid,
  ChevronLeft,
} from "lucide-react";

export function EdisonCategoryGrid() {
  const categories = [
    {
      id: "solar",
      title: "تجهیزات و برق خورشیدی",
      sub: "(SOLAR)",
      count: "۱۱۲ محصول",
      slug: "lighting-fixtures",
      icon: Sun,
      bgColor: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      id: "lighting",
      title: "روشنایی",
      sub: "",
      count: "۴۳۸ محصول",
      slug: "lighting-fixtures",
      icon: Lightbulb,
      bgColor: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      id: "camping",
      title: "کمپینگ و برق سیار",
      sub: "",
      count: "۹۵ محصول",
      slug: "lighting-fixtures",
      icon: Sparkles,
      bgColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      id: "battery",
      title: "باتری",
      sub: "",
      count: "۳۹ محصول",
      slug: "maker-diy-electronics",
      icon: Zap,
      bgColor: "bg-orange-50 text-orange-600 border-orange-100",
    },
    {
      id: "modules",
      title: "قطعات و ماژول‌های الکترونیکی",
      sub: "",
      count: "۱۳ محصول",
      slug: "maker-diy-electronics",
      icon: Cpu,
      bgColor: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      id: "doors",
      title: "دربازکن و قفل و جک",
      sub: "",
      count: "۴ محصول",
      slug: "industrial-automation",
      icon: Lock,
      bgColor: "bg-teal-50 text-teal-600 border-teal-100",
    },
    {
      id: "cables",
      title: "سیم و کابل",
      sub: "",
      count: "۵ محصول",
      slug: "wiring-building",
      icon: Cable,
      bgColor: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      id: "hvac",
      title: "تهویه و گرمایش و سرمایش برقی",
      sub: "",
      count: "۵ محصول",
      slug: "industrial-automation",
      icon: RotateCw,
      bgColor: "bg-sky-50 text-sky-600 border-sky-100",
    },
    {
      id: "safety",
      title: "لوازم جانبی برقی و ایمنی",
      sub: "",
      count: "۱۰۲ محصول",
      slug: "industrial-automation",
      icon: ShieldAlert,
      bgColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      id: "special",
      title: "محصولات ویژه",
      sub: "",
      count: "۱۸ محصول",
      slug: "products?bestseller=true",
      icon: Gift,
      bgColor: "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      id: "emergency",
      title: "روشنایی اضطراری",
      sub: "",
      count: "۲۳ محصول",
      slug: "lighting-fixtures",
      icon: AlertTriangle,
      bgColor: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      id: "track-lights",
      title: "چراغ ریلی",
      sub: "",
      count: "۱۱ محصول",
      slug: "lighting-fixtures",
      icon: LayoutGrid,
      bgColor: "bg-cyan-50 text-cyan-600 border-cyan-100",
    },
  ];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-lg sm:text-xl text-slate-900">
              خرید بر اساس دسته‌بندی
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              روشنایی، لوازم برقی و تجهیزات خورشیدی
            </p>
          </div>
        </div>

        <Link
          href="/products"
          className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-0.5 group"
        >
          <span>همه دسته‌ها</span>
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 12-Card Grid (6 per row on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {categories.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={`/products?category=${item.slug}`}
              className="group bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-amber-400 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-between text-center min-h-[160px]"
            >
              {/* Pastel Icon Box */}
              <div
                className={`w-14 h-14 rounded-2xl ${item.bgColor} border flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}
              >
                <Icon className="w-7 h-7 stroke-[2]" />
              </div>

              {/* Title & Count */}
              <div className="space-y-1 mt-3">
                <h4 className="font-bold text-xs text-slate-800 group-hover:text-amber-600 transition-colors line-clamp-2 leading-tight">
                  {item.title} {item.sub && <span className="block text-[10px] text-slate-400">{item.sub}</span>}
                </h4>
                <span className="text-[10px] text-slate-400 block font-medium">
                  {item.count}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
