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
  Sun,
  Flame,
  Tv,
  Plug,
  ArrowLeft,
  ChevronDown,
  SunMedium,
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
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm transition-all">
      {/* 1. Top Announcement Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>خرید و تعمیرات تخصصی لوازم برقی در نجف‌آباد و اصفهان + ارسال فوری</span>
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

          {/* Action Buttons: User Account / Repairs / WhatsApp / Wishlist / Cart */}
          <div className="flex items-center gap-2">
            {/* User Account / Login Button */}
            {session?.user ? (
              <Link
                href="/account"
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-amber-100 text-slate-800 text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 transition-colors"
                title="حساب کاربری من"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px]">
                  {session.user.name?.slice(0, 1) || "ک"}
                </div>
                <span className="hidden sm:inline-block">حساب من</span>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 transition-colors"
                title="ورود یا ثبت‌نام"
              >
                <User className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline-block">ورود / ثبت‌نام</span>
              </Link>
            )}

            {/* Repair Workshop CTA Button */}
            <Link
              href="/repair-service"
              className="hidden lg:flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-black px-3.5 py-2.5 rounded-xl border border-amber-300 transition-colors shadow-sm"
              title="پذیرش و پیگیری تعمیرات لوازم برقی در نجف‌آباد"
            >
              <Wrench className="w-4 h-4 text-amber-600" />
              <span>پذیرش تعمیرات</span>
            </Link>

            {/* Dark / Light Mode Toggle Button */}
            <ThemeToggle />

            {/* Wishlist Heart Button with Counter */}
            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/50 transition-colors"
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

      {/* 3. Category & Navigation Menu Bar with Hover Mega Menu Preview */}
      <nav className="border-t border-slate-100 bg-slate-50/90 relative hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1">
            {/* Mega Menu Trigger button */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <Link
                href="/products"
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 font-bold transition-all"
              >
                <Menu className="w-4 h-4" />
                <span>همه دسته‌بندی‌های کالا</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? "rotate-180" : ""}`} />
              </Link>

              {/* Hover Mega Menu Overlay Preview */}
              {megaMenuOpen && (
                <div
                  className="absolute top-full right-0 w-[850px] bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200 grid grid-cols-12 gap-6 text-slate-800"
                >
                  {/* Col 1: Categories Breakdown (5 cols) */}
                  <div className="col-span-5 space-y-3 border-l border-slate-100 pl-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="font-extrabold text-sm text-slate-900">
                        دسته‌بندی‌های اصلی
                      </span>
                      <Link
                        href="/products"
                        className="text-[11px] text-amber-600 hover:underline font-bold"
                      >
                        کاتالوگ کامل
                      </Link>
                    </div>

                    <div className="space-y-1">
                      <Link
                        href="/products?category=home-appliances-cooling-heating"
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-50 group transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                          <Fan className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-slate-900 group-hover:text-amber-600 block">
                            پنکه، کولر و بخاری برقی
                          </strong>
                          <span className="text-[10px] text-slate-400">
                            پارس خزر، موتوژن، اخوان
                          </span>
                        </div>
                      </Link>

                      <Link
                        href="/products?category=wiring-building"
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-blue-50 group transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-slate-900 group-hover:text-blue-600 block">
                            سیم، کابل و آنتن تلویزیون
                          </strong>
                          <span className="text-[10px] text-slate-400">
                            سیم افشان تمام مس، آنتن هانی
                          </span>
                        </div>
                      </Link>

                      <Link
                        href="/products?category=lighting-fixtures"
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50 group transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <SunMedium className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 block">
                            روشنایی و پروژکتور خورشیدی
                          </strong>
                          <span className="text-[10px] text-slate-400">
                            پنل‌های LED و نورپردازی
                          </span>
                        </div>
                      </Link>

                      <Link
                        href="/products?category=maker-diy-electronics"
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-purple-50 group transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-slate-900 group-hover:text-purple-600 block">
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
                  <div className="col-span-4 space-y-3 border-l border-slate-100 pl-4">
                    <div className="flex items-center gap-1.5 text-amber-700 font-extrabold text-xs pb-2 border-b border-slate-100">
                      <Wrench className="w-4 h-4 text-amber-600" />
                      <span>کارگاه تعمیرات نجف‌آباد</span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      پذیرش و عیب‌یابی انواع وسایل برقی با قطعات اصلی و تست حضوری در کارگاه شیاسی:
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-700">
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
                      className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] px-3.5 py-2 rounded-xl transition-all w-full justify-center shadow-sm"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>ثبت آنلاین درخواست تعمیر</span>
                    </Link>
                  </div>

                  {/* Col 3: Quick Direct Links & Bestsellers (3 cols) */}
                  <div className="col-span-3 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block pb-2 border-b border-slate-100 mb-2">
                        دسته‌بندی‌های پرتقاضا
                      </span>

                      <div className="space-y-1.5 text-xs">
                        <Link
                          href="/products?bestseller=true"
                          className="block text-slate-600 hover:text-amber-600 transition-colors"
                        >
                          🔥 پرفروش‌ترین کالاها
                        </Link>
                        <Link
                          href="/products?category=home-appliances-cooling-heating"
                          className="block text-slate-600 hover:text-amber-600 transition-colors"
                        >
                          ⚡ موتور کولر ۱/۳ و ۱/۲
                        </Link>
                        <Link
                          href="/products?category=wiring-building"
                          className="block text-slate-600 hover:text-amber-600 transition-colors"
                        >
                          🔌 کابل افشان ۲ در ۲.۵
                        </Link>
                        <Link
                          href="/products?category=lighting-fixtures"
                          className="block text-slate-600 hover:text-amber-600 transition-colors"
                        >
                          💡 پروژکتور خورشیدی ۲۰۰W
                        </Link>
                      </div>
                    </div>

                    <Link
                      href="/products"
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs p-3 rounded-2xl flex items-center justify-between group transition-colors"
                    >
                      <span>ورود به فروشگاه</span>
                      <ArrowLeft className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

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
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="flex items-center gap-1 text-slate-800 bg-slate-200/80 hover:bg-amber-400 px-2.5 py-1 rounded-md transition-colors font-bold"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>پنل مدیریت</span>
              </Link>
            )}
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
              href={session?.user ? "/account" : "/auth/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 font-bold text-slate-900 flex items-center gap-2"
            >
              <User className="w-4 h-4 text-amber-500" />
              <span>{session?.user ? "مشاهده حساب کاربری من" : "ورود یا عضویت با موبایل"}</span>
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
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl bg-amber-50 text-amber-900 font-extrabold border border-amber-200"
              >
                ورود به پنل مدیریت فروشگاه
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
