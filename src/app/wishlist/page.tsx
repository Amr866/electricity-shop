"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/product/ProductCard";
import { formatToman, toPersianDigits } from "@/lib/utils";
import {
  Heart,
  ArrowLeft,
  Trash2,
  ShoppingCart,
  CheckCircle2,
  Sparkles,
  Zap,
  Tag,
  Share2,
  MessageCircle,
  Search,
  AlertTriangle,
  X,
  PackageCheck,
  Percent,
} from "lucide-react";

export default function WishlistPage() {
  const { wishlist, wishlistCount, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const [addedAll, setAddedAll] = useState(false);
  const [filterStockOnly, setFilterStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Financial aggregates calculated with useMemo
  const { totalListPrice, totalDiscount, totalPayable, inStockCount } = useMemo(() => {
    let listPriceSum = 0;
    let finalPriceSum = 0;
    let stockItems = 0;

    wishlist.forEach((p) => {
      const orig = p.originalPrice || p.price;
      listPriceSum += orig;
      finalPriceSum += p.price;
      if (p.stock > 0) stockItems += 1;
    });

    const discountSum = Math.max(0, listPriceSum - finalPriceSum);

    return {
      totalListPrice: listPriceSum,
      totalDiscount: discountSum,
      totalPayable: finalPriceSum,
      inStockCount: stockItems,
    };
  }, [wishlist]);

  // Filtered displayed products
  const displayedList = useMemo(() => {
    return wishlist.filter((p) => {
      const matchesStock = filterStockOnly ? p.stock > 0 : true;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStock && matchesSearch;
    });
  }, [wishlist, filterStockOnly, searchQuery]);

  const handleAddAllToCart = () => {
    wishlist.forEach((product) => {
      if (product.stock > 0) {
        addToCart(product, 1);
      }
    });
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2500);
  };

  const handleExportWhatsApp = () => {
    if (wishlist.length === 0) return;

    let msg = `سلام و احترام، استعلام قیمت و صدور پیش‌فاکتور برای اقلام ذخیره‌شده از سایت فروشگاه شیاسی:\n\n`;
    wishlist.forEach((p, idx) => {
      msg += `${idx + 1}. ${p.name} | قیمت: ${formatToman(p.price)} تومان | وضعیت: ${p.stock > 0 ? "موجود" : "ناموجود"}\n`;
    });
    msg += `\n💰 جمع کل پیش‌فاکتور: ${formatToman(totalPayable)} تومان`;

    window.open(`https://wa.me/989162665884?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (wishlistCount === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-[75vh] flex items-center justify-center py-12 px-4 transition-colors duration-200">
        <div className="max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 text-slate-900 dark:text-white">
            <div className="relative w-20 h-20 bg-rose-50 dark:bg-rose-950/60 text-rose-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <Heart className="w-10 h-10 animate-pulse fill-rose-500/20 text-rose-500" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 text-[10px] font-black">
                ۰
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                لیست کالاهای ذخیره‌شده شما خالی است!
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto font-medium">
                با زدن دکمه قلب روی هر محصول، آن را در این لیست ذخیره فرمایید تا قیمت روز، تخفیف‌ها و موجودی آن را همیشه در دسترس داشته باشید.
              </p>
            </div>

            {/* Quick Categories to explore */}
            <div className="pt-2 flex flex-wrap justify-center gap-1.5 text-[11px]">
              <Link
                href="/products?category=home-appliances-cooling-heating"
                className="bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 px-3 py-1.5 rounded-xl font-bold transition-colors"
              >
                🌀 پنکه و موتور کولر
              </Link>
              <Link
                href="/products?category=wiring-building"
                className="bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 px-3 py-1.5 rounded-xl font-bold transition-colors"
              >
                🔌 سیم و کابل مس
              </Link>
              <Link
                href="/products?category=lighting-fixtures"
                className="bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 px-3 py-1.5 rounded-xl font-bold transition-colors"
              >
                💡 روشنایی LED
              </Link>
            </div>

            <div className="pt-2">
              <Link
                href="/products"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm py-3 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 hover-glow"
              >
                <span>مشاهده کاتالوگ و خرید</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-6 sm:py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 space-y-5">
        
        {/* Top Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shrink-0 shadow-sm">
              <Heart className="w-6 h-6 fill-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  کالاهای ذخیره‌شده و علاقه‌مندی‌ها
                </h1>
                <span className="text-[11px] bg-rose-500 text-white px-2.5 py-0.5 rounded-full font-black">
                  {toPersianDigits(wishlistCount)} کالا
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                لیست اقلام انتخابی شما در مرورگر ذخیره شده و به صورت روزآمد قیمت‌گذاری می‌شود
              </p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleExportWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
              title="استعلام قیمت کل در واتساپ"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">استعلام در واتساپ</span>
            </button>

            <button
              onClick={handleAddAllToCart}
              className={`flex-1 sm:flex-initial text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95 ${
                addedAll
                  ? "bg-emerald-600 text-white shadow-emerald-600/30"
                  : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 hover-glow"
              }`}
            >
              {addedAll ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>همه به سبد اضافه شدند</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>افزودن همه به سبد</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsClearModalOpen(true)}
              className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 px-3 py-2.5 rounded-xl font-bold transition-colors shrink-0 flex items-center gap-1 active:scale-95"
              title="پاک کردن همه علاقه‌مندی‌ها"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">حذف همه</span>
            </button>
          </div>
        </div>

        {/* Live Financial Proforma Summary Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-4 sm:p-5 border border-amber-500/20 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-amber-400" />
              <span>اقلام موجود در انبار:</span>
              <strong className="text-white font-mono font-black">{toPersianDigits(inStockCount)} از {toPersianDigits(wishlistCount)}</strong>
            </div>

            {totalDiscount > 0 && (
              <div className="flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-emerald-400" />
                <span>سود شما از تخفیف‌ها:</span>
                <strong className="text-emerald-400 font-mono font-black">{formatToman(totalDiscount)} تومان</strong>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <span>مجموع ارزش کل اقلام:</span>
              <strong className="text-amber-400 font-mono font-black text-sm sm:text-base">{formatToman(totalPayable)} تومان</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Link
              href="/cart"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-4 py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 w-full md:w-auto active:scale-95 hover-glow"
            >
              <span>مشاهده سبد خرید نهایی</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterStockOnly(false)}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all text-xs active:scale-95 ${
                !filterStockOnly
                  ? "bg-amber-500 text-slate-950 shadow-sm font-black"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
              }`}
            >
              همه اقلام ({toPersianDigits(wishlistCount)})
            </button>

            <button
              onClick={() => setFilterStockOnly(true)}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all text-xs active:scale-95 ${
                filterStockOnly
                  ? "bg-amber-500 text-slate-950 shadow-sm font-black"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
              }`}
            >
              فقط موجود در انبار ({toPersianDigits(inStockCount)})
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در لیست ذخیره‌شده..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>
        </div>

        {/* Products Grid or Empty Filter State */}
        {displayedList.length === 0 ? (
          <div className="py-16 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
            <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
              هیچ کالایی مطابق با فیلتر یا جستجوی شما در لیست ذخیره‌شده‌ها یافت نشد.
            </p>
            <button
              type="button"
              onClick={() => {
                setFilterStockOnly(false);
                setSearchQuery("");
              }}
              className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              نمایش تمام {toPersianDigits(wishlistCount)} کالای ذخیره‌شده
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {displayedList.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>

      {/* Confirmation Modal for Clear Wishlist */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                پاک کردن تمام علاقه‌مندی‌ها؟
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                آیا از حذف تمامی {toPersianDigits(wishlistCount)} قلم کالای ذخیره‌شده خود از حافظه مرورگر اطمینان دارید؟
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsClearModalOpen(false)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs py-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={() => {
                  clearWishlist();
                  setIsClearModalOpen(false);
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs py-2.5 rounded-xl transition-all shadow-md shadow-rose-600/20 active:scale-95"
              >
                بله، حذف همه
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
