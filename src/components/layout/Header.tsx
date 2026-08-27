"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useBrand } from "@/context/BrandContext";
import { toPersianDigits, formatToman } from "@/lib/utils";
import { LiveSearchBar } from "@/components/search/LiveSearchBar";
import {
  Zap,
  ShoppingCart,
  Phone,
  MapPin,
  Clock,
  Menu,
  X,
  FileText,
  Sparkles,
  LayoutDashboard,
  MessageCircle,
  Heart,
  Cpu,
  Wrench,
} from "lucide-react";

export function Header() {
  const { itemCount, subtotal } = useCart();
  const { wishlistCount } = useWishlist();
  const { brand } = useBrand();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm transition-all">
      {/* 1. Top Announcement Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>خرید و تعمیرات تخصصی لوازم برقی در نجف‌آباد و اصفهان + ارسال با اسنپ‌باکس و تیپاکس</span>
            </span>
            <span className="hidden md:inline-block text-slate-600">•</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{brand.address}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span className="hidden sm:flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>ساعات کاری: ۸:۳۰ الی ۲۱:۰۰</span>
            </span>
            <span className="hidden sm:inline-block text-slate-600">•</span>
            <a
              href={`tel:${brand.phone.replace(/\D/g, "")}`}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
            >
              <Phone className="w-3 h-3" />
              <span className="font-mono">{brand.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <div className={`max-w-7xl mx-auto px-4 transition-all ${isScrolled ? "py-2.5" : "py-3.5"}`}>
        <div className="flex items-center justify-between gap-4">
          
          {/* Dynamic Logo & Store Title */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
              {brand.logoIcon === "circuit" ? (
                <Cpu className="w-6 h-6 stroke-[2.5]" />
              ) : (
                <Zap className="w-6 h-6 fill-slate-950" />
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-slate-900 tracking-tight">
                  {brand.nameFa}
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-300">
                  {brand.badge}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium line-clamp-1">
                {brand.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Interactive Live Search with Real-time Dropdown */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <LiveSearchBar isMobile={false} />
          </div>

          {/* Action Buttons: Repairs / WhatsApp / Wishlist / Cart */}
          <div className="flex items-center gap-2">
            {/* Repair Workshop CTA Button */}
            <Link
              href="/repair-service"
              className="hidden lg:flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-black px-3.5 py-2.5 rounded-xl border border-amber-300 transition-colors shadow-sm"
              title="پذیرش و پیگیری تعمیرات لوازم برقی در نجف‌آباد"
            >
              <Wrench className="w-4 h-4 text-amber-600" />
              <span>پذیرش تعمیرات</span>
            </Link>

            {/* Quick WhatsApp Inquiry */}
            <a
              href={`https://wa.me/98${brand.mobile.replace(/^0/, "")}?text=سلام،%20برای%20استعلام%20قیمت%20یا%20تعمیرات%20لوازم%20برقی%20از%20فروشگاه%20شیاسی%20پیام%20می‌دهم`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-2.5 rounded-xl border border-emerald-200 transition-colors"
              title="استعلام فوری در واتساپ"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>واتساپ</span>
            </a>

            {/* Wishlist Heart Button with Counter */}
            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/50 transition-colors"
              title="کالاهای ذخیره شده"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {toPersianDigits(wishlistCount)}
                </span>
              )}
            </Link>

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

        {/* Mobile Interactive Live Search */}
        <div className="mt-3 md:hidden">
          <LiveSearchBar isMobile={true} />
        </div>
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
              href="/products?category=home-appliances-cooling-heating"
              className="px-3.5 py-2.5 hover:text-amber-600 hover:bg-slate-100 transition-colors font-bold text-slate-900"
            >
              پنکه، کولر و بخاری برقی
            </Link>
            <Link
              href="/repair-service"
              className="px-3.5 py-2.5 text-amber-700 hover:text-amber-800 hover:bg-amber-50 transition-colors font-black flex items-center gap-1"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>کارگاه تعمیرات لوازم برقی</span>
            </Link>
            <Link
              href="/products?category=wiring-building"
              className="px-3.5 py-2.5 hover:text-amber-600 hover:bg-slate-100 transition-colors"
            >
              سیم، کابل و آنتن
            </Link>
            <Link
              href="/products?category=lighting-fixtures"
              className="px-3.5 py-2.5 hover:text-amber-600 hover:bg-slate-100 transition-colors"
            >
              روشنایی و پروژکتور خورشیدی
            </Link>
            <Link
              href="/products?category=maker-diy-electronics"
              className="px-3.5 py-2.5 hover:text-amber-600 hover:bg-slate-100 transition-colors"
            >
              بردهای آردوینو و ابزار
            </Link>
          </div>

          <div className="flex items-center gap-3 text-slate-600">
            <Link
              href="/order-tracking"
              className="flex items-center gap-1 hover:text-amber-600 transition-colors py-2.5"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>پیگیری سفارشات</span>
            </Link>
            <Link
              href="/contact"
              className="hover:text-amber-600 transition-colors py-2.5"
            >
              شعبه نجف‌آباد
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-1 text-slate-800 bg-slate-200/80 hover:bg-amber-400 px-2.5 py-1 rounded-md transition-colors font-bold"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>پنل مدیریت</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-1 font-medium text-sm text-slate-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              صفحه اصلی
            </Link>
            <Link
              href="/repair-service"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 font-extrabold text-amber-900 flex items-center gap-2"
            >
              <Wrench className="w-4 h-4 text-amber-600" />
              <span>پذیرش تعمیرات پنکه، کولر و لوازم برقی</span>
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 font-bold text-amber-600"
            >
              کاتالوگ کلیه محصولات
            </Link>
            <Link
              href="/products?category=home-appliances-cooling-heating"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 pr-6 text-xs"
            >
              • پنکه، موتور کولر آبی، بخاری برقی و آنتن
            </Link>
            <Link
              href="/products?category=wiring-building"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-600 pr-6 text-xs"
            >
              • سیم، کابل، لوله و کلید پریز
            </Link>
            <Link
              href="/products?category=lighting-fixtures"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-600 pr-6 text-xs"
            >
              • پنل ال‌ای‌دی و پروژکتور خورشیدی
            </Link>
            <Link
              href="/products?category=maker-diy-electronics"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-600 pr-6 text-xs"
            >
              • بردهای آردوینو، قطعات و ابزار تعمیر
            </Link>
            <hr className="my-2 border-slate-100" />
            <Link
              href="/order-tracking"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 font-bold text-slate-900"
            >
              پیگیری سفارشات و مشاهده فاکتور
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              آدرس و نقشه شعبه نجف‌آباد
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl bg-amber-50 text-amber-900 font-extrabold border border-amber-200"
            >
              ورود به پنل مدیریت فروشگاه
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
