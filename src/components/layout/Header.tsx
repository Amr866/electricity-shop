"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { toPersianDigits, formatToman } from "@/lib/utils";
import {
  Zap,
  Search,
  ShoppingCart,
  Phone,
  MapPin,
  Clock,
  Menu,
  X,
  FileText,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  LayoutDashboard,
  MessageCircle,
} from "lucide-react";

export function Header() {
  const router = useRouter();
  const { itemCount, subtotal } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm transition-all">
      {/* 1. Top Announcement Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white text-xs py-2 px-4 border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>ارسال فوری با اسنپ‌باکس در شهر اصفهان (تحویل ۲ الی ۳ ساعته)</span>
            </span>
            <span className="hidden md:inline-block text-slate-500">•</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>فروشگاه مرکزی: اصفهان، خیابان فردوسی، نرسیده به چهارراه فلسطین</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span className="hidden sm:flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>ساعات کاری: ۸:۳۰ الی ۲۱:۰۰</span>
            </span>
            <span className="hidden sm:inline-block text-slate-500">•</span>
            <a
              href="tel:03132204567"
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
            >
              <Phone className="w-3 h-3" />
              <span className="persian-numbers">۰۳۱-۳۲۲۰۴۵۶۷</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <div className={`max-w-7xl mx-auto px-4 py-3.5 transition-all ${isScrolled ? "py-2.5" : "py-3.5"}`}>
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Shop Title */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 fill-slate-950" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">الکتریک نقش جهان</span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-300">اصفهان</span>
              </div>
              <span className="text-[11px] text-slate-500 font-normal">تجهیزات برق ساختمانی، صنعتی و الکترونیک</span>
            </div>
          </Link>

          {/* Persian Live Search Form */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی سیم و کابل، کلید و پریز، پروژکتور، آردوینو، کنتاکتور..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pr-10 pl-24 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all shadow-inner placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              <button
                type="submit"
                className="absolute left-1.5 top-1.5 bottom-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3.5 rounded-lg transition-colors flex items-center gap-1"
              >
                جستجو
              </button>
            </div>
          </form>

          {/* Action Buttons: Phone / Cart / WhatsApp */}
          <div className="flex items-center gap-2.5">
            {/* Quick WhatsApp Inquiry */}
            <a
              href="https://wa.me/989131112233?text=سلام،%20برای%20استعلام%20قیمت%20و%20خرید%20از%20فروشگاه%20پیام%20می‌دهم"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-2.5 rounded-xl border border-emerald-200 transition-colors"
              title="استعلام فوری در واتساپ"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>استعلام واتساپ</span>
            </a>

            {/* Shopping Cart Button */}
            <Link
              href="/cart"
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2.5 rounded-xl transition-all shadow-sm group"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-900">
                    {toPersianDigits(itemCount)}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[10px] text-slate-300">سبد خرید</span>
                <span className="text-xs font-bold text-amber-400">
                  {itemCount > 0 ? formatToman(subtotal) : "خالی"}
                </span>
              </div>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="mt-3 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی کالا در الکتریک نقش جهان..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pr-10 pl-20 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <button
              type="submit"
              className="absolute left-1 top-1 bottom-1 bg-amber-500 text-slate-950 text-xs font-bold px-3 rounded-lg"
            >
              بیاب
            </button>
          </div>
        </form>
      </div>

      {/* 3. Category & Navigation Menu Bar */}
      <nav className="border-t border-slate-100 bg-slate-50/80 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1">
            <Link
              href="/products"
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 font-bold transition-colors"
            >
              <Menu className="w-4 h-4" />
              <span>همه دسته‌بندی‌های کالا</span>
            </Link>

            <Link
              href="/products?category=wiring-building"
              className="px-3.5 py-2.5 hover:text-amber-600 hover:bg-slate-100 transition-colors"
            >
              سیم و کابل ساختمانی
            </Link>
            <Link
              href="/products?category=lighting-fixtures"
              className="px-3.5 py-2.5 hover:text-amber-600 hover:bg-slate-100 transition-colors"
            >
              روشنایی و نورپردازی
            </Link>
            <Link
              href="/products?category=industrial-automation"
              className="px-3.5 py-2.5 hover:text-amber-600 hover:bg-slate-100 transition-colors"
            >
              برق صنعتی و تابلو برق
            </Link>
            <Link
              href="/products?category=maker-diy-electronics"
              className="px-3.5 py-2.5 hover:text-amber-600 hover:bg-slate-100 transition-colors"
            >
              بردهای آردوینو و DIY
            </Link>
          </div>

          <div className="flex items-center gap-3 text-slate-600">
            <Link
              href="/order-tracking/NJ-140306-089"
              className="flex items-center gap-1 hover:text-amber-600 transition-colors py-2.5"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>پیگیری سفارش</span>
            </Link>
            <Link
              href="/contact"
              className="hover:text-amber-600 transition-colors py-2.5"
            >
              شعبه اصفهان
            </Link>
            <Link
              href="/about"
              className="hover:text-amber-600 transition-colors py-2.5"
            >
              درباره فروشگاه
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-1 text-slate-800 bg-slate-200/80 hover:bg-amber-400 px-2.5 py-1 rounded-md transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>پنل مدیریت</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <div className="space-y-1 font-medium text-sm text-slate-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              صفحه اصلی
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 font-bold text-amber-600"
            >
              کاتالوگ کلیه محصولات
            </Link>
            <Link
              href="/products?category=wiring-building"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-600 pr-6 text-xs"
            >
              • سیم، کابل و لوله برق
            </Link>
            <Link
              href="/products?category=lighting-fixtures"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-600 pr-6 text-xs"
            >
              • پنل و روشنایی ال‌ای‌دی
            </Link>
            <Link
              href="/products?category=industrial-automation"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-600 pr-6 text-xs"
            >
              • تجهیزات برق صنعتی
            </Link>
            <Link
              href="/products?category=maker-diy-electronics"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-600 pr-6 text-xs"
            >
              • بردهای آردوینو و سنسورها
            </Link>
            <hr className="my-2 border-slate-100" />
            <Link
              href="/order-tracking/NJ-140306-089"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              پیگیری سفارشات
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              تماس و آدرس فروشگاه در اصفهان
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg bg-amber-50 text-amber-800 font-bold"
            >
              پنل مدیریت فروشگاه
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
