"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, CartItem } from "@/context/CartContext";
import { formatToman, toPersianDigits } from "@/lib/utils";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Truck,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  Tag,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";

const FREE_SHIPPING_THRESHOLD = 2000000; // 2,000,000 Tomans threshold

function DrawerItemRow({
  item,
  updateQuantity,
  removeFromCart,
  onClose,
  index,
}: {
  item: CartItem;
  updateQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  onClose: () => void;
  index: number;
}) {
  const [imgError, setImgError] = useState(false);
  const displayImage = imgError
    ? "/images/products/wal_172619-fans-7995865_1920.jpg"
    : item.image || "/images/products/wal_172619-fans-7995865_1920.jpg";

  return (
    <div
      className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all duration-200 group animate-in fade-in slide-in-from-bottom-2"
      style={{ animationDelay: `${Math.min(index * 40, 200)}ms` }}
    >
      {/* Thumbnail */}
      <Link
        href={`/products/${item.slug}`}
        onClick={onClose}
        className="relative w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl p-1.5 border border-slate-100 dark:border-slate-700/80 shrink-0 overflow-hidden shadow-2xs group-hover:scale-105 transition-transform duration-300"
      >
        <Image
          src={displayImage}
          alt={item.name}
          fill
          sizes="64px"
          className="object-contain p-1"
          onError={() => setImgError(true)}
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <Link
          href={`/products/${item.slug}`}
          onClick={onClose}
          className="font-black text-xs text-slate-900 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-1 block leading-snug"
        >
          {item.name}
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black text-slate-900 dark:text-amber-400 font-mono">
            {formatToman(item.price * item.quantity)}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-medium">
            ({formatToman(item.price)} × {toPersianDigits(item.quantity)})
          </span>
        </div>
      </div>

      {/* Quantity & Delete Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            aria-label="افزایش"
            className="p-1 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white disabled:opacity-30 active:scale-80 hover:scale-110 transition-transform cursor-pointer"
          >
            <Plus className="w-3 h-3" />
          </button>
          <span className="px-2 font-mono font-black text-xs text-slate-900 dark:text-white transition-all duration-150">
            {toPersianDigits(item.quantity)}
          </span>
          <button
            type="button"
            onClick={() => {
              if (item.quantity > 1) {
                updateQuantity(item.id, item.quantity - 1);
              } else {
                removeFromCart(item.id);
              }
            }}
            aria-label="کاهش"
            className="p-1 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white active:scale-80 hover:scale-110 transition-transform cursor-pointer"
          >
            {item.quantity === 1 ? (
              <Trash2 className="w-3 h-3 text-rose-500" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={() => removeFromCart(item.id)}
          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 active:scale-90 transition-all cursor-pointer"
          title="حذف از سبد"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    total,
    appliedCoupon,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [shouldRender, setShouldRender] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle smooth enter/exit transitions
  useEffect(() => {
    if (isCartDrawerOpen) {
      setShouldRender(true);
      // Small timeout to allow mount before triggering CSS transition
      const timer = setTimeout(() => setIsTransitioning(true), 15);
      return () => clearTimeout(timer);
    } else {
      setIsTransitioning(false);
      // Wait for transition duration before unmounting
      const timer = setTimeout(() => setShouldRender(false), 350);
      return () => clearTimeout(timer);
    }
  }, [isCartDrawerOpen]);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartDrawerOpen) {
        closeCartDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartDrawerOpen, closeCartDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartDrawerOpen]);

  // Free shipping calculations
  const { isFreeShipping, shippingProgressPercent, remainingToFreeShipping } = useMemo(() => {
    const isFree = subtotal >= FREE_SHIPPING_THRESHOLD;
    const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    return {
      isFreeShipping: isFree,
      shippingProgressPercent: progress,
      remainingToFreeShipping: remaining,
    };
  }, [subtotal]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay with ultra-smooth cubic-bezier fade & blur */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isTransitioning ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCartDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pointer-events-none">
        {/* Slide-over panel with smooth iOS-style spring easing (cubic-bezier) */}
        <div
          className={`w-screen max-w-md bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col justify-between pointer-events-auto transform-gpu transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isTransitioning
              ? "translate-x-0 opacity-100 shadow-2xl"
              : "-translate-x-full opacity-0 shadow-none"
          }`}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-ping" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
              </div>
              <div>
                <h2 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>سبد خرید شما</span>
                  <span className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    {toPersianDigits(itemCount)} قلم
                  </span>
                </h2>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  آماده ارسال فوری در نجف‌آباد و اصفهان
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={closeCartDrawer}
              className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
              aria-label="بستن سبد خرید"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Dynamic Progress */}
          {items.length > 0 && (
            <div className="px-4 py-3 bg-amber-50/60 dark:bg-slate-850/80 border-b border-slate-100 dark:border-slate-800 space-y-1.5 transition-colors">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  {isFreeShipping ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-1 animate-in zoom-in-95">
                      <span>ارسال رایگان در نجف‌آباد و اصفهان</span>
                      <Sparkles className="w-3 h-3 animate-spin" />
                    </span>
                  ) : (
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      تنها <strong className="font-mono font-black text-amber-600 dark:text-amber-400">{formatToman(remainingToFreeShipping)} تومان</strong> تا ارسال رایگان با اسنپ
                    </span>
                  )}
                </div>
                <span className="font-mono font-bold text-slate-500 text-[10px]">
                  {toPersianDigits(shippingProgressPercent)}٪
                </span>
              </div>

              <div className="w-full bg-slate-200/80 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ease-out rounded-full ${
                    isFreeShipping
                      ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 shadow-xs shadow-emerald-500/50"
                      : "bg-gradient-to-r from-amber-500 to-amber-400 shadow-xs shadow-amber-500/30"
                  }`}
                  style={{ width: `${shippingProgressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {items.length > 0 ? (
              items.map((item, index) => (
                <DrawerItemRow
                  key={item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  onClose={closeCartDrawer}
                  index={index}
                />
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">
                    سبد خرید شما در حال حاضر خالی است
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed font-medium">
                    می‌توانید انواع پنکه، موتور کولر، بخاری، کابل و تجهیزات برق را از کاتالوگ انتخاب کنید.
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={closeCartDrawer}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 hover-glow"
                >
                  مشاهده کاتالوگ محصولات
                </Link>
              </div>
            )}
          </div>

          {/* Footer Actions and Financial Breakdown */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/95 space-y-3 shadow-lg">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>جمع کل کالاها ({toPersianDigits(itemCount)} قلم):</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{formatToman(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 font-bold">
                    <span>تخفیف اعمال شده:</span>
                    <span className="font-mono">- {formatToman(discount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-slate-800">
                  <span className="font-black text-xs text-slate-900 dark:text-white">مبلغ قابل پرداخت:</span>
                  <span className="font-black text-base text-slate-950 dark:text-amber-400 font-mono">
                    {formatToman(total)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* Primary CTA: Checkout with metallic shimmer animation */}
                <Link
                  href="/checkout"
                  onClick={closeCartDrawer}
                  className="relative w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 hover-glow overflow-hidden group"
                >
                  <span>تکمیل خرید و ثبت آدرس</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </Link>

                {/* Secondary CTA: Full Cart Page */}
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/cart"
                    onClick={closeCartDrawer}
                    className="py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-center transition-all flex items-center justify-center gap-1 active:scale-95"
                  >
                    <span>مشاهده سبد کامل</span>
                  </Link>

                  <button
                    type="button"
                    onClick={closeCartDrawer}
                    className="py-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-xs rounded-xl text-center transition-colors cursor-pointer"
                  >
                    ادامه خرید
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
