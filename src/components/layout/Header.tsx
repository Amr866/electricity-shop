"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useBrand } from "@/context/BrandContext";
import { toPersianDigits, formatToman } from "@/lib/utils";
import { LiveSearchBar } from "@/components/search/LiveSearchBar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
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
  Heart,
  Cpu,
  Wrench,
  User,
  Fan,
  SunMedium,
  ArrowLeft,
  ChevronDown,
  Calculator,
  FileSpreadsheet,
} from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const { itemCount, subtotal } = useCart();
  const { wishlistCount } = useWishlist();
  const { brand } = useBrand();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-950/75 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/40 shadow-sm transition-all duration-300">
      {/* 1. Top Announcement Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white text-xs py-2 px-4 border-b border-slate-850/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>خرید و تعمیرات تخصصی لوازم برقی در نجف‌آباد و اصفهان + ارسال فوری</span>
            </span>
            <span className="hidden md:inline-block text-slate-600">•</span>
            <Link href="/contact#map" className="hidden md:flex items-center gap-1 text-slate-300 hover:text-amber-400 transition-colors">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{brand.address}</span>
            </Link>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            {/* Quick Conversion Action Buttons (Barghsan-style) */}
            <div className="flex items-center gap-1.5">
              <Link
                href="/bom-upload"
                className="bg-rose-600 hover:bg-rose-500 text-white text-[10px] sm:text-[11px] font-black px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1 shadow-sm transition-all active:scale-95 hover-glow"
              >
                <span>صدور پیش‌فاکتور</span>
                <span className="font-mono text-[10px] font-bold">»</span>
              </Link>
              <Link
                href="/price-lists"
                className="bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/40 text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1 shadow-sm transition-all active:scale-95"
              >
                <span>لیست قیمت</span>
                <span className="font-mono text-[10px] font-bold">»</span>
              </Link>
            </div>

            <span className="hidden sm:inline-block text-slate-600">•</span>
            <a
              href="tel:03142624567"
              dir="ltr"
              className="hidden sm:flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold font-mono text-left"
            >
              <Phone className="w-3 h-3 shrink-0" />
              <span>۰۳۱-۴۲۶۲۴۵۶۷</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <div className={`max-w-7xl mx-auto px-4 transition-all ${isScrolled ? "py-2" : "py-3"}`}>
        <div className="flex items-center justify-between gap-4">
          
          {/* Dynamic Logo & Store Title */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6" style={{ fill: '#020617', color: '#020617' }} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
                  {brand.nameFa}
                </span>
                <span className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-700 whitespace-nowrap">
                  {brand.badge}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                {brand.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Interactive Live Search with Real-time Dropdown */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <LiveSearchBar isMobile={false} />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* User Account / Login Button */}
            {session?.user ? (
              <Link
                href="/account"
                className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 hover:bg-amber-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-colors"
                title="حساب کاربری من"
              >
                <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="hidden lg:inline">{session.user.name || "حساب من"}</span>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 hover:bg-amber-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">ورود / ثبت‌نام</span>
              </Link>
            )}

            {/* Quick Repair Service Admission CTA Button */}
            <Link
              href="/repair-service"
              className="hidden sm:flex items-center gap-1.5 bg-amber-500/15 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-700 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold px-3 py-2.5 rounded-xl transition-all shadow-sm"
              title="پذیرش تعمیرات پنکه، کولر و وسایل برقی"
            >
              <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>پذیرش تعمیرات</span>
            </Link>

            {/* Theme Toggle (Sun/Moon for Dark Mode) */}
            <ThemeToggle />

            {/* Wishlist Icon with Dynamic Badge */}
            <Link
              href="/wishlist"
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center relative transition-colors border border-slate-200 dark:border-slate-700/80"
              title="کالاهای ذخیره‌شده (علاقه‌مندی‌ها)"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? "text-rose-500 fill-rose-500" : ""}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                  {toPersianDigits(wishlistCount)}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-black px-3.5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 dark:bg-slate-950 text-slate-950 dark:text-amber-400 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-slate-900 dark:border-amber-400">
                    {toPersianDigits(itemCount)}
                  </span>
                )}
              </div>
              <div className="hidden lg:flex flex-col text-right leading-tight">
                <span className="text-[10px] font-normal opacity-80">سبد خرید</span>
                <span className="font-bold font-mono">
                  {subtotal > 0 ? formatToman(subtotal) : "۰ تومان"}
                </span>
              </div>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
              aria-label="منوی موبایل"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar Row (Under Header Logo) */}
        <div className="mt-3 md:hidden">
          <LiveSearchBar isMobile={true} />
        </div>
      </div>

      {/* 3. Category & Navigation Menu Bar with Hover Mega Menu Preview */}
      <nav className="border-t border-slate-100 dark:border-slate-800/40 bg-slate-50/80 dark:bg-slate-950/50 backdrop-blur-xl relative hidden md:block transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1">
            {/* Mega Menu Trigger button */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <Link
                href="/products"
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 font-bold transition-all rounded-r-2xl shadow-sm hover-glow"
              >
                <Menu className="w-4 h-4" />
                <span>همه دسته‌بندی‌های کالا</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? "rotate-180" : ""}`} />
              </Link>

              {/* Hover Mega Menu Overlay Preview */}
              {megaMenuOpen && (
                <div
                  className="absolute top-full right-0 w-[850px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200 grid grid-cols-12 gap-6 text-slate-800 dark:text-slate-200"
                >
                  {/* Col 1: Categories Breakdown (5 cols) */}
                  <div className="col-span-5 space-y-3 border-l border-slate-100 dark:border-slate-800 pl-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        دسته‌بندی‌های اصلی
                      </span>
                      <Link
                        href="/products"
                        className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-bold"
                      >
                        کاتالوگ کامل
                      </Link>
                    </div>

                    <div className="space-y-1">
                      <Link
                        href="/products?category=home-appliances-cooling-heating"
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800 group transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                          <Fan className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 block">
                            پنکه، کولر و بخاری برقی
                          </strong>
                          <span className="text-[10px] text-slate-400">
                            پارس خزر، موتوژن، اخوان
                          </span>
                        </div>
                      </Link>

                      <Link
                        href="/products?category=wiring-building"
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 group transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 block">
                            سیم، کابل و آنتن تلویزیون
                          </strong>
                          <span className="text-[10px] text-slate-400">
                            سیم افشان تمام مس، آنتن هانی
                          </span>
                        </div>
                      </Link>

                      <Link
                        href="/products?category=lighting-fixtures"
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-800 group transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <SunMedium className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 block">
                            روشنایی و پروژکتور خورشیدی
                          </strong>
                          <span className="text-[10px] text-slate-400">
                            پنل‌های LED و نورپردازی
                          </span>
                        </div>
                      </Link>

                      <Link
                        href="/products?category=maker-diy-electronics"
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-purple-50 dark:hover:bg-slate-800 group transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 block">
                            بردهای آردوینو و الکترونیک
                          </strong>
                          <span className="text-[10px] text-slate-400">
                            ماژول‌ها و ابزار لحیم‌کاری
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Col 2: Repair Workshop Live Preview (4 cols) */}
                  <div className="col-span-4 space-y-3 border-l border-slate-100 dark:border-slate-800 pl-4">
                    <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-extrabold text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
                      <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>کارگاه تعمیرات نجف‌آباد</span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      پذیرش و عیب‌یابی انواع وسایل برقی با قطعات اصلی و تست حضوری در کارگاه شیاسی:
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>تعمیر و سرویس انواع پنکه ایستاده و رومیزی</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>تعویض پلاتین و کلاچ موتور کولر آبی</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>تعویض المنت و کلید بخاری برقی و هیتر</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>تعمیر بوستر آنتن و منابع تغذیه</span>
                      </div>
                    </div>

                    <Link
                      href="/repair-service"
                      className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] px-3.5 py-2 rounded-xl transition-all w-full justify-center shadow-sm"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>ثبت آنلاین درخواست تعمیر</span>
                    </Link>
                  </div>

                  {/* Col 3: Quick Direct Links & Bestsellers (3 cols) */}
                  <div className="col-span-3 space-y-3">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white block pb-2 border-b border-slate-100 dark:border-slate-800">
                      لینک‌های سریع
                    </span>
                    <div className="space-y-2 text-xs">
                      <Link
                        href="/products?bestseller=true"
                        className="block p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-300"
                      >
                        ⚡ پرفروش‌ترین کالاها
                      </Link>
                      <Link
                        href="/products?fast=true"
                        className="block p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-emerald-700 dark:text-emerald-400"
                      >
                        🛵 ارسال فوری در نجف‌آباد
                      </Link>
                      <Link
                        href="/bom-upload"
                        className="block p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-blue-700 dark:text-blue-400"
                      >
                        📋 بارگذاری لیست قطعات (BOM)
                      </Link>
                      <Link
                        href="/price-lists"
                        className="block p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-amber-600 dark:text-amber-400"
                      >
                        📄 لیست قیمت رسمی کارخانجات
                      </Link>
                      <Link
                        href="/order-tracking"
                        className="block p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-300"
                      >
                        🔍 پیگیری وضعیت سفارش
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Navigation Links */}
            <Link
              href="/products?category=home-appliances-cooling-heating"
              className="px-3 py-2.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              پنکه، کولر و بخاری برقی
            </Link>

            <Link
              href="/repair-service"
              className="px-3 py-2.5 text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-bold transition-colors flex items-center gap-1"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>کارگاه تعمیرات لوازم برقی</span>
            </Link>

            <Link
              href="/products?category=wiring-building"
              className="px-3 py-2.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              سیم، کابل و آنتن
            </Link>

            <Link
              href="/products?category=lighting-fixtures"
              className="px-3 py-2.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              روشنایی و پروژکتور خورشیدی
            </Link>

            <Link
              href="/products?category=maker-diy-electronics"
              className="px-3 py-2.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              بردهای آردوینو و ابزار
            </Link>
          </div>

          {/* Left Side: BOM, Price-Lists, Tracking & Contact */}
          <div className="flex items-center gap-2.5 text-[11px] text-slate-500 dark:text-slate-400">
            <Link
              href="/bom-upload"
              className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition-colors border border-blue-200/60 dark:border-blue-800/60"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>استعلام BOM</span>
            </Link>

            <Link
              href="/price-lists"
              className="hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 font-semibold transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span>لیست قیمت</span>
            </Link>

            <Link
              href="/order-tracking"
              className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              <span>پیگیری</span>
            </Link>

            <span className="text-slate-300 dark:text-slate-700">|</span>

            <Link
              href="/contact"
              className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-bold flex items-center gap-1 transition-colors px-3 py-1.5 rounded-l-2xl hover:bg-amber-50 dark:hover:bg-slate-800"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>ارتباط با ما</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Ambient gradient glow line at bottom of header */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-500/20 dark:via-amber-500/30 to-transparent pointer-events-none" />

      {/* Mobile Drawer Menu (Slide-in) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4 animate-in slide-in-from-top duration-200 shadow-xl">
          <div className="space-y-1 text-xs font-bold">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-400 hover:bg-amber-500/20"
            >
              📦 همه دسته‌بندی‌های کالا
            </Link>
            <Link
              href="/bom-upload"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            >
              📋 خرید عمده و استعلام لیست قطعات (BOM)
            </Link>
            <Link
              href="/price-lists"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
            >
              📄 دانلود لیست قیمت رسمی کارخانجات
            </Link>
            <Link
              href="/products?category=home-appliances-cooling-heating"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              🌀 پنکه، موتور کولر و بخاری برقی
            </Link>
            <Link
              href="/repair-service"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
            >
              🛠️ کارگاه تعمیرات تخصصی نجف‌آباد
            </Link>
            <Link
              href="/products?category=wiring-building"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              🔌 سیم، کابل استاندارد و آنتن
            </Link>
            <Link
              href="/products?category=lighting-fixtures"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              💡 روشنایی و پروژکتور خورشیدی
            </Link>
            <Link
              href="/products?category=maker-diy-electronics"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              🤖 بردهای آردوینو و قطعات الکترونیک
            </Link>
            <Link
              href="/order-tracking"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              🔍 پیگیری سفارشات و مشاهده فاکتور
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              📞 تماس با ما و نشانی شعبه نجف‌آباد
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
