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
  Menu,
  X,
  FileText,
  Sparkles,
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
  Layers,
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
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all duration-300">
      
      {/* 1. Super Top Utility Bar: Unified Tonal Family (No Jarring Background Flips) */}
      <div className="bg-slate-100/90 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-[11px] py-1.5 px-4 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Shop Location & Fast Courier Notice */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>فروشگاه و کارگاه شیاسی نجف‌آباد</span>
            </span>
            <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
            <Link
              href="/contact#map"
              className="hidden md:flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>{brand.address}</span>
            </Link>
          </div>

          {/* Phone Number & Direct Support */}
          <div className="flex items-center gap-3">
            <a
              href="tel:03142624567"
              dir="ltr"
              className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-bold font-mono text-left"
            >
              <Phone className="w-3 h-3 shrink-0" />
              <span>۰۳۱-۴۲۶۲۴۵۶۷</span>
            </a>
          </div>

        </div>
      </div>

      {/* 2. Main Middle Header: Brand + Well-Proportioned Search + Clean Actions */}
      <div className={`max-w-7xl mx-auto px-4 transition-all duration-300 ${isScrolled ? "py-2" : "py-3"}`}>
        <div className="flex items-center justify-between gap-4 lg:gap-6">
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-slate-950 text-slate-950" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                  {brand.nameFa}
                </span>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  {brand.badge}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                {brand.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar (Balanced max-w-lg) */}
          <div className="hidden md:flex flex-1 max-w-lg">
            <LiveSearchBar isMobile={false} />
          </div>

          {/* Action Cluster (User, Theme, Wishlist, Cart) */}
          <div className="flex items-center gap-2">
            
            {/* User Account / Login Button */}
            {session?.user ? (
              <Link
                href="/account"
                className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-colors"
                title="حساب کاربری من"
              >
                <User className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                <span className="hidden xl:inline">{session.user.name || "حساب من"}</span>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ورود / ثبت‌نام</span>
              </Link>
            )}

            {/* Dark / Light Theme Toggle */}
            <ThemeToggle />

            {/* Wishlist Button with Counter */}
            <Link
              href="/wishlist"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center relative transition-colors border border-slate-200 dark:border-slate-700/80"
              title="کالاهای ذخیره‌شده"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? "text-rose-500 fill-rose-500" : ""}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                  {toPersianDigits(wishlistCount)}
                </span>
              )}
            </Link>

            {/* Cart Button: Sleek Dark Slate with Amber Counter */}
            <Link
              href="/cart"
              className="flex items-center gap-1.5 sm:gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-sm transition-all active:scale-95"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {toPersianDigits(itemCount)}
                  </span>
                )}
              </div>
              <div className="hidden lg:flex flex-col text-right leading-tight">
                <span className="text-[9px] font-normal text-slate-400">سبد خرید</span>
                <span className="font-bold font-mono text-[11px] text-white">
                  {subtotal > 0 ? formatToman(subtotal) : "۰ تومان"}
                </span>
              </div>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 active:scale-95"
              aria-label="منوی سایت"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar Row */}
        <div className="mt-2.5 md:hidden">
          <LiveSearchBar isMobile={true} />
        </div>

        {/* Mobile Horizontal Quick Category Chips */}
        <div className="mt-2.5 md:hidden flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-semibold">
          <Link
            href="/products"
            className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold whitespace-nowrap shrink-0 flex items-center gap-1 shadow-sm"
          >
            <Layers className="w-3 h-3" />
            <span>همه کالاها</span>
          </Link>
          <Link
            href="/products?category=home-appliances-cooling-heating"
            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 whitespace-nowrap border border-slate-200 dark:border-slate-700 shrink-0"
          >
            🌀 موتور و پنکه
          </Link>
          <Link
            href="/repair-service"
            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 whitespace-nowrap border border-slate-200 dark:border-slate-700 shrink-0 flex items-center gap-1"
          >
            <Wrench className="w-3 h-3 text-slate-500" />
            <span>کارگاه تعمیرات</span>
          </Link>
          <Link
            href="/products?category=wiring-building"
            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 whitespace-nowrap border border-slate-200 dark:border-slate-700 shrink-0"
          >
            🔌 سیم و کابل
          </Link>
          <Link
            href="/#calculator"
            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 whitespace-nowrap border border-slate-200 dark:border-slate-700 shrink-0 flex items-center gap-1"
          >
            <Calculator className="w-3 h-3 text-slate-500" />
            <span>محاسبه‌گر کابل</span>
          </Link>
          <Link
            href="/bom-upload"
            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 whitespace-nowrap border border-slate-200 dark:border-slate-700 shrink-0 flex items-center gap-1"
          >
            <FileSpreadsheet className="w-3 h-3 text-slate-500" />
            <span>استعلام BOM</span>
          </Link>
          <Link
            href="/price-lists"
            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 whitespace-nowrap border border-slate-200 dark:border-slate-700 shrink-0 flex items-center gap-1"
          >
            <FileText className="w-3 h-3 text-slate-500" />
            <span>لیست قیمت</span>
          </Link>
        </div>
      </div>

      {/* 3. Disciplined Desktop Navigation Row: Unified Tonal Background & High Contrast Amber Catalog Button */}
      <nav className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl relative hidden md:block transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          
          {/* Right: High-Contrast Amber Mega-Menu Button + Consistent Nav Links */}
          <div className="flex items-center gap-1">
            {/* Mega Menu Button (Unmistakable Amber Catalog Button with Dark Text) */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <Link
                href="/products"
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 font-black transition-all rounded-r-2xl shadow-sm hover-glow"
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
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 group transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-amber-500 flex items-center justify-center shrink-0">
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
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 group transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-amber-500 flex items-center justify-center shrink-0">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 block">
                            سیم، کابل و آنتن تلویزیون
                          </strong>
                          <span className="text-[10px] text-slate-400">
                            سیم افشان تمام مس، آنتن هانی
                          </span>
                        </div>
                      </Link>

                      <Link
                        href="/products?category=lighting-fixtures"
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 group transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-amber-500 flex items-center justify-center shrink-0">
                          <SunMedium className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 block">
                            روشنایی و پروژکتور خورشیدی
                          </strong>
                          <span className="text-[10px] text-slate-400">
                            پنل‌های LED و نورپردازی
                          </span>
                        </div>
                      </Link>

                      <Link
                        href="/products?category=maker-diy-electronics"
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 group transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-amber-500 flex items-center justify-center shrink-0">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 block">
                            بردهای آردوینو و الکترونیک
                          </strong>
                          <span className="text-[10px] text-slate-400">
                            ماژول‌ها و ابزار لحیم‌کاری
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Col 2: Repair Workshop Preview (4 cols) */}
                  <div className="col-span-4 space-y-3 border-l border-slate-100 dark:border-slate-800 pl-4">
                    <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-extrabold text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
                      <Wrench className="w-4 h-4 text-amber-500" />
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
                    </div>

                    <Link
                      href="/repair-service"
                      className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-bold hover:gap-2 transition-all pt-2"
                    >
                      <span>ثبت درخواست آنلاین تعمیرات</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Col 3: Quick Tools (3 cols) */}
                  <div className="col-span-3 space-y-3">
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                      ابزارها و خدمات ویژه
                    </div>

                    <div className="space-y-2 text-xs">
                      <Link
                        href="/#calculator"
                        className="block p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                      >
                        🧮 محاسبه‌گر کابل و فیوز
                      </Link>

                      <Link
                        href="/bom-upload"
                        className="block p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                      >
                        📋 استعلام لیست قطعات (BOM)
                      </Link>

                      <Link
                        href="/price-lists"
                        className="block p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                      >
                        📄 لیست قیمت کارخانجات
                      </Link>

                      <Link
                        href="/order-tracking"
                        className="block p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-300"
                      >
                        🔍 پیگیری وضعیت سفارش
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Consistent Navigation Links */}
            <Link
              href="/products?category=home-appliances-cooling-heating"
              className="px-3 py-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              پنکه و موتور کولر
            </Link>

            <Link
              href="/products?category=wiring-building"
              className="px-3 py-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              سیم و کابل
            </Link>

            <Link
              href="/products?category=lighting-fixtures"
              className="px-3 py-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              روشنایی LED
            </Link>

            <Link
              href="/repair-service"
              className="px-3 py-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Wrench className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>کارگاه تعمیرات</span>
            </Link>

            <Link
              href="/#calculator"
              className="px-3 py-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Calculator className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>محاسبه‌گر کابل</span>
            </Link>

            <Link
              href="/bom-upload"
              className="px-3 py-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>استعلام BOM</span>
            </Link>

            <Link
              href="/price-lists"
              className="px-3 py-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>لیست قیمت رسمی</span>
            </Link>
          </div>

          {/* Left: Tracking & Contact */}
          <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
            <Link
              href="/order-tracking"
              className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              <span>پیگیری سفارشات</span>
            </Link>

            <span className="text-slate-300 dark:text-slate-700">|</span>

            <Link
              href="/contact"
              className="text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 font-semibold flex items-center gap-1 transition-colors px-3 py-1.5 rounded-l-2xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>تماس و آدرس</span>
            </Link>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer Menu (Slide-in) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 animate-in slide-in-from-top duration-200 shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="space-y-1.5 text-xs font-semibold">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-2xl bg-amber-500 text-slate-950 font-black shadow-sm"
            >
              📦 مشاهده همه دسته‌بندی‌های کالا
            </Link>
            <Link
              href="/repair-service"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              🛠️ کارگاه تعمیرات تخصصی نجف‌آباد
            </Link>
            <Link
              href="/#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              🧮 محاسبه‌گر سایز کابل و فیوز ساختمان
            </Link>
            <Link
              href="/bom-upload"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              📋 خرید عمده و استعلام لیست قطعات (BOM)
            </Link>
            <Link
              href="/price-lists"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              📄 دانلود لیست قیمت رسمی کارخانجات
            </Link>
            <Link
              href="/products?category=home-appliances-cooling-heating"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              🌀 پنکه، موتور کولر و بخاری برقی
            </Link>
            <Link
              href="/products?category=wiring-building"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              🔌 سیم، کابل استاندارد و آنتن
            </Link>
            <Link
              href="/products?category=lighting-fixtures"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              💡 روشنایی و پروژکتور خورشیدی
            </Link>
            <Link
              href="/products?category=maker-diy-electronics"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              🤖 بردهای آردوینو و قطعات الکترونیک
            </Link>
            <Link
              href="/order-tracking"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              🔍 پیگیری سفارشات و مشاهده فاکتور
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              📞 تماس با ما و نشانی شعبه نجف‌آباد
            </Link>
          </div>
        </div>
      )}

    </header>
  );
}
