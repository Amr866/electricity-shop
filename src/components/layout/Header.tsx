"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Search,
  ShieldCheck,
  ChevronLeft,
  Info,
  Package,
  Clock,
  ExternalLink,
  LayoutGrid,
} from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { itemCount, subtotal, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { brand } = useBrand();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [cartBump, setCartBump] = useState(false);

  // Trigger bounce effect on desktop cart button when items added
  useEffect(() => {
    if (itemCount > 0) {
      setCartBump(true);
      const timer = setTimeout(() => setCartBump(false), 400);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  useEffect(() => {
    let ticking = false;
    let lastScrolled = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const shouldBeScrolled = currentY > 110;
          if (shouldBeScrolled !== lastScrolled) {
            setIsScrolled(shouldBeScrolled);
            lastScrolled = shouldBeScrolled;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    };
  }, []);

  // Debounced Mega Menu hover handlers
  const handleMouseEnterMega = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    setMegaMenuOpen(true);
  };

  const handleMouseLeaveMega = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    megaMenuTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 180);
  };

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
        setMegaMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    };
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Smooth scroll handler for calculator (in-page or cross-page)
  const handleCalculatorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      const el = document.getElementById("calculator");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", "/#calculator");
      }
    } else {
      router.push("/?scroll=calculator");
    }
  };

  // Suppress public store header in admin panel (Placed AFTER all hooks to obey React Rules of Hooks)
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header className={`sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 ${
        isScrolled ? "shadow-md shadow-slate-900/5 dark:shadow-black/30" : "shadow-xs"
      }`}>
        
        {/* 1. Super Top Utility Bar (Hidden on mobile to save 36px vertical real-estate) */}
        <div className={`hidden sm:block bg-slate-100/90 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-[11px] px-4 transition-all duration-300 overflow-hidden ${
          isScrolled ? "max-h-0 opacity-0 py-0 border-none" : "max-h-12 opacity-100 py-1.5 border-b border-slate-200/80 dark:border-slate-800/80"
        }`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Shop Location */}
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
                href="tel:03142626116"
                className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-bold font-mono"
              >
                <Phone className="w-3 h-3 shrink-0" />
                <bdi dir="ltr">۰۳۱-۴۲۶۲۶۱۱۶</bdi>
              </a>
            </div>

          </div>
        </div>

        {/* 2. Main Middle Header: Brand + Search + Clean Actions */}
        <div className={`max-w-7xl mx-auto px-4 transition-all duration-300 ${isScrolled ? "py-2" : "py-2.5 sm:py-3"}`}>
          <div className="flex items-center justify-between gap-2.5 sm:gap-4 lg:gap-6">
            
            {/* Logo & Brand Identity */}
            <Link href="/" className="flex items-center gap-2 group shrink-0 min-w-0 max-w-[210px] sm:max-w-none">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Zap className="w-5 h-5 fill-slate-950 text-slate-950" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-extrabold text-sm sm:text-lg text-slate-900 dark:text-white tracking-tight truncate">
                    {brand.nameFa}
                  </span>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shrink-0">
                    {brand.badge}
                  </span>
                </div>
                <span className="hidden sm:block text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                  {brand.tagline}
                </span>
              </div>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg">
              <LiveSearchBar isMobile={false} />
            </div>

            {/* Action Cluster (Responsive: [Theme, Account, Menu] on Mobile | [Account, Theme, Wishlist, Cart] on Desktop) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* Desktop User Account / Login Button */}
              {session?.user ? (
                <div className="hidden md:flex items-center gap-1.5">
                  <Link
                    href="/account"
                    className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-colors"
                    title="حساب کاربری من"
                  >
                    <User className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                    <span className="hidden xl:inline">{session.user.name || "حساب من"}</span>
                  </Link>

                  {/* Conditionally rendered ONLY for authenticated ADMIN */}
                  {session.user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-3 py-2 rounded-xl border border-amber-400 shadow-sm shadow-amber-500/20 transition-all active:scale-95"
                      title="پنل مدیریت فروشگاه"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>پنل مدیریت</span>
                    </Link>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden md:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>ورود / ثبت‌نام</span>
                </Link>
              )}

              {/* Dark / Light Theme Toggle (Always Visible) */}
              <div className="shrink-0">
                <ThemeToggle />
              </div>

              {/* Desktop Wishlist Button */}
              <Link
                href="/wishlist"
                className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 items-center justify-center relative transition-colors border border-slate-200 dark:border-slate-700/80"
                title="کالاهای ذخیره‌شده"
              >
                <Heart className={`w-4 h-4 ${wishlistCount > 0 ? "text-rose-500 fill-rose-500" : ""}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                    {toPersianDigits(wishlistCount)}
                  </span>
                )}
              </Link>

              {/* Desktop Cart Button with Dynamic Pulse Bump */}
              <button
                type="button"
                onClick={openCartDrawer}
                className={`hidden md:flex items-center gap-1.5 sm:gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-700/60 shadow-xs transition-all duration-300 active:scale-95 shrink-0 cursor-pointer ${
                  cartBump ? "scale-105 ring-2 ring-amber-400 shadow-md shadow-amber-500/20" : ""
                }`}
              >
                <div className="relative">
                  <ShoppingCart className="w-4 h-4 text-amber-400" />
                  {itemCount > 0 && (
                    <span className={`absolute -top-2 -right-2 bg-amber-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center transition-transform duration-200 ${cartBump ? "scale-125 animate-bounce" : "scale-100"}`}>
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
              </button>

              {/* Mobile Menu Toggle Button (Guaranteed Visible and Accessible) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 active:scale-95 flex items-center justify-center cursor-pointer border border-slate-200/80 dark:border-slate-700/80 shrink-0"
                aria-label="منوی سایت"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Mobile Search Bar Row */}
          <div className="mt-2 md:hidden">
            <LiveSearchBar isMobile={true} />
          </div>

        </div>

        {/* 3. Desktop Bottom Navigation Bar (Clean single-line nowrap layout) */}
        <div className="hidden md:block bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-bold h-11">
            
            <div className="flex items-center gap-1 xl:gap-1.5 whitespace-nowrap">
              
              {/* All Categories Mega Menu Button */}
              <div
                ref={megaMenuRef}
                className="relative shrink-0"
                onMouseEnter={handleMouseEnterMega}
                onMouseLeave={handleMouseLeaveMega}
              >
                <button
                  type="button"
                  onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    megaMenuOpen
                      ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                      : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 font-bold"
                  }`}
                >
                  <Menu className="w-4 h-4" />
                  <span>دسته‌بندی‌های کالا</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Mega Menu Dropdown */}
                {megaMenuOpen && (
                  <div className="absolute top-full right-0 pt-1.5 w-[680px] z-[60] animate-in fade-in zoom-in-95 duration-150">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 ring-1 ring-slate-900/5 dark:ring-slate-100/10">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <Link
                          href="/products?category=home-appliances-cooling-heating"
                          onClick={() => setMegaMenuOpen(false)}
                          className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all flex items-start gap-3"
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <Fan className="w-4 h-4" />
                          </div>
                          <div>
                            <strong className="text-slate-900 dark:text-white block">موتور کولر، پنکه و بخاری</strong>
                            <span className="text-[11px] text-slate-400 font-normal">موتور موتوژن، الکتروژن، قطعات پنکه و هیتر</span>
                          </div>
                        </Link>

                        <Link
                          href="/products?category=wiring-building"
                          onClick={() => setMegaMenuOpen(false)}
                          className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all flex items-start gap-3"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <Zap className="w-4 h-4" />
                          </div>
                          <div>
                            <strong className="text-slate-900 dark:text-white block">سیم، کابل و آنتن دیجیتال</strong>
                            <span className="text-[11px] text-slate-400 font-normal">سیم استاندارد مس، کابل کواکسیال و آنتن هانی</span>
                          </div>
                        </Link>

                        <Link
                          href="/products?category=lighting-fixtures"
                          onClick={() => setMegaMenuOpen(false)}
                          className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all flex items-start gap-3"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <SunMedium className="w-4 h-4" />
                          </div>
                          <div>
                            <strong className="text-slate-900 dark:text-white block">روشنایی و پروژکتور خورشیدی</strong>
                            <span className="text-[11px] text-slate-400 font-normal">لامپ LED، پروژکتورهای سولار و نورپردازی</span>
                          </div>
                        </Link>

                        <Link
                          href="/products?category=maker-diy-electronics"
                          onClick={() => setMegaMenuOpen(false)}
                          className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all flex items-start gap-3"
                        >
                          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                            <Cpu className="w-4 h-4" />
                          </div>
                          <div>
                            <strong className="text-slate-900 dark:text-white block">بردهای آردوینو و الکترونیک</strong>
                            <span className="text-[11px] text-slate-400 font-normal">ماژول‌های هوشمند، سنسورها و قطعات آموزشی</span>
                          </div>
                        </Link>

                        {/* View All Categories Hub Button in Mega Menu */}
                        <div className="col-span-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            دسترسی به کاتالوگ تصویری، برندهای همکار و ابزارهای مهندسی
                          </span>
                          <Link
                            href="/categories"
                            onClick={() => setMegaMenuOpen(false)}
                            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 group"
                          >
                            <span>ورود به هاب جامع دسته‌بندی‌ها</span>
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Categorized Links with whitespace-nowrap */}
              <Link
                href="/products?category=home-appliances-cooling-heating"
                className="text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 px-2.5 py-2 transition-colors whitespace-nowrap shrink-0"
              >
                پنکه و کولر
              </Link>
              <Link
                href="/products?category=wiring-building"
                className="text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 px-2.5 py-2 transition-colors whitespace-nowrap shrink-0"
              >
                سیم و کابل
              </Link>
              <Link
                href="/products?category=lighting-fixtures"
                className="text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 px-2.5 py-2 transition-colors whitespace-nowrap shrink-0"
              >
                روشنایی LED
              </Link>
              <Link
                href="/repair-service"
                className="text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 px-2.5 py-2 flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
              >
                <Wrench className="w-3.5 h-3.5 text-slate-400" />
                <span>کارگاه تعمیرات</span>
              </Link>
              <Link
                href="/#calculator"
                onClick={handleCalculatorClick}
                className="text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 px-2.5 py-2 flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
              >
                <Calculator className="w-3.5 h-3.5 text-slate-400" />
                <span>محاسبه‌گر کابل</span>
              </Link>
              <Link
                href="/bom-upload"
                className="text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 px-2.5 py-2 flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                <span>استعلام BOM</span>
              </Link>
              <Link
                href="/price-lists"
                className="text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 px-2.5 py-2 flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>لیست قیمت</span>
              </Link>
            </div>

            {/* Left Utility Links with whitespace-nowrap */}
            <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
              <Link
                href="/order-tracking"
                className="text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 text-[11px] transition-colors whitespace-nowrap"
              >
                <span>پیگیری سفارشات</span>
              </Link>
              <span className="text-slate-200 dark:text-slate-800">|</span>
              <Link
                href="/contact"
                className="text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 text-[11px] transition-colors whitespace-nowrap"
              >
                <Phone className="w-3 h-3 text-amber-500" />
                <span>تماس و آدرس</span>
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* 4. Full Native Slide-over Mobile Drawer (Rendered OUTSIDE <header> to avoid any backdrop-filter stacking context trap!) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] md:hidden">
          
          {/* Full Screen Dimming Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
          />

          {/* Slide-over Sheet from Right (Clean Full Height App Drawer) */}
          <div className="fixed inset-y-0 right-0 z-[10000] w-full max-w-xs sm:max-w-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-250 border-l border-slate-200 dark:border-slate-800">
            
            {/* Drawer Header: Brand + Theme Toggle + Close (X) */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <Zap className="w-4 h-4 fill-slate-950" />
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white block">منوی اصلی فروشگاه</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">شیاسی نجف‌آباد</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                  aria-label="بستن منو"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* User Account / Auth Banner */}
              {session?.user ? (
                <div className="space-y-2">
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 flex items-center justify-between text-xs font-bold active:scale-98"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block font-black text-slate-900 dark:text-slate-100">{session.user.name || "حساب کاربری من"}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">مشاهده پروفایل و سفارش‌ها</span>
                      </div>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                  </Link>

                  {/* Mobile Admin Link ONLY for authenticated ADMIN */}
                  {session.user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-between shadow-md shadow-amber-500/20 active:scale-98"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span>ورود به پنل مدیریت کارگاه</span>
                      </div>
                      <ChevronLeft className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-between shadow-xs active:scale-98"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>ورود / عضویت در فروشگاه</span>
                  </div>
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              )}

              {/* Quick 2x2 Feature Cards */}
              <div>
                <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 block mb-2 px-1">
                  ابزارهای مهندسی و پیگیری:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <Link
                    href="/order-tracking"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-purple-50 dark:hover:bg-purple-950/30 border border-slate-200 dark:border-slate-700 flex items-center gap-2 active:scale-98"
                  >
                    <Search className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                    <span className="text-[11px]">رهگیری فاکتور</span>
                  </Link>

                  <Link
                    href="/repair-service"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-slate-200 dark:border-slate-700 flex items-center gap-2 active:scale-98"
                  >
                    <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="text-[11px]">کارگاه تعمیرات</span>
                  </Link>

                  <Link
                    href="/#calculator"
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      handleCalculatorClick(e);
                    }}
                    className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-200 dark:border-slate-700 flex items-center gap-2 active:scale-98"
                  >
                    <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="text-[11px]">محاسبه کابل</span>
                  </Link>

                  <Link
                    href="/bom-upload"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200 dark:border-slate-700 flex items-center gap-2 active:scale-98"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-[11px]">استعلام BOM</span>
                  </Link>
                </div>
              </div>

              {/* Categories Navigation with Expandable Items */}
              <div className="space-y-1 text-xs font-semibold pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 block mb-2 px-1">
                  دسته‌بندی‌های کالا و قطعات:
                </span>

                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-500" />
                    <span>مشاهده همه محصولات فروشگاه</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-amber-500" />
                </Link>

                <Link
                  href="/products?category=home-appliances-cooling-heating"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  <div className="flex items-center gap-2">
                    <Fan className="w-4 h-4 text-amber-500" />
                    <span>موتور کولر، پنکه و بخاری برقی</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/products?category=wiring-building"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span>سیم، کابل مس و آنتن دیجیتال</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/products?category=lighting-fixtures"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  <div className="flex items-center gap-2">
                    <SunMedium className="w-4 h-4 text-emerald-500" />
                    <span>روشنایی LED و پروژکتور سولار</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/products?category=maker-diy-electronics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-500" />
                    <span>آردوینو، ماژول‌ها و قطعات DIY</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/price-lists"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span>دانلود لیست قیمت رسمی کارخانجات</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>

              {/* Store & Direct Support Links */}
              <div className="space-y-1 text-xs font-semibold pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 block mb-2 px-1">
                  اطلاعات و تماس:
                </span>

                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>نشانی و مسیریابی شعبه نجف‌آباد</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    <span>درباره فروشگاه شیاسی</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>

            </div>

            {/* Fixed Drawer Bottom Phone Button */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0">
              <a
                href="tel:03142626116"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-98"
              >
                <Phone className="w-4 h-4" />
                <span>تماس مستقیم: </span>
                <bdi dir="ltr" className="font-mono font-bold">۰۳۱-۴۲۶۲۶۱۱۶</bdi>
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
