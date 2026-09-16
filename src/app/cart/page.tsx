"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, CartItem } from "@/context/CartContext";
import { formatToman, toPersianDigits } from "@/lib/utils";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  FileText,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Sparkles,
  AlertTriangle,
  X,
  PackageCheck,
  Layers,
} from "lucide-react";

const FREE_SHIPPING_THRESHOLD = 2000000; // 2,000,000 Tomans threshold for free courier delivery in Isfahan/Najafabad

interface CartItemRowProps {
  item: CartItem;
  updateQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
}

const CartItemRow = React.memo(function CartItemRow({
  item,
  updateQuantity,
  removeFromCart,
}: CartItemRowProps) {
  const [imgError, setImgError] = useState(false);
  const displayImage = imgError
    ? "/images/products/wal_172619-fans-7995865_1920.jpg"
    : item.image || "/images/products/wal_172619-fans-7995865_1920.jpg";

  return (
    <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
      {/* Thumbnail & Title */}
      <div className="flex items-center gap-4 flex-1">
        <Link
          href={`/products/${item.slug}`}
          className="relative w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl p-2 border border-slate-100 dark:border-slate-700 shrink-0 overflow-hidden group"
        >
          <Image
            src={displayImage}
            alt={item.name}
            fill
            sizes="80px"
            className="object-contain p-1 group-hover:scale-108 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        </Link>

        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block">
            {item.categoryName || "تجهیزات الکتریکی"}
          </span>
          <Link
            href={`/products/${item.slug}`}
            className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-2 leading-snug"
          >
            {item.name}
          </Link>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            قیمت واحد:{" "}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {formatToman(item.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Quantity Selector, Row Total and Delete */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-4 self-end sm:self-center">
        {/* Quantity Selector */}
        <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shrink-0 shadow-2xs">
          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            aria-label="افزایش تعداد"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white disabled:opacity-30 active:scale-90 transition-transform"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 font-mono font-black text-xs text-slate-900 dark:text-white">
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
            aria-label="کاهش تعداد"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white active:scale-90 transition-transform"
          >
            {item.quantity === 1 ? (
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Total for this item */}
        <div className="text-left sm:text-right min-w-[100px]">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block">مجموع:</span>
          <span className="font-black text-sm text-slate-950 dark:text-amber-400 font-mono">
            {formatToman(item.price * item.quantity)}
          </span>
        </div>

        {/* Delete Item */}
        <button
          type="button"
          onClick={() => removeFromCart(item.id)}
          className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
          title="حذف از سبد"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    total,
    appliedCoupon,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

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

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError("");
    setCouponSuccess("");

    try {
      const res = await fetch("/api/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.trim(),
          subtotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCouponError(data.message || "کد تخفیف معتبر نمی‌باشد.");
      } else {
        applyCoupon(data.coupon);
        setCouponSuccess("کد تخفیف با موفقیت اعمال گردید!");
        setCouponCode("");
      }
    } catch (err) {
      setCouponError("خطا در برقراری ارتباط با سرور.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleExportWhatsApp = () => {
    if (items.length === 0) return;

    let msg = `سلام و احترام، استعلام قیمت و صدور پیش‌فاکتور رسمی از سبد خرید فروشگاه شیاسی:\n\n`;
    items.forEach((it, idx) => {
      msg += `${idx + 1}. ${it.name}\n   تعداد: ${it.quantity} | قیمت واحد: ${formatToman(it.price)} | مجموع: ${formatToman(it.price * it.quantity)} تومان\n`;
    });

    if (discount > 0) {
      msg += `\n🎁 تخفیف اعمال شده: ${formatToman(discount)} تومان`;
    }
    msg += `\n💰 جمع کل فاکتور: ${formatToman(total)} تومان`;
    msg += `\n📍 شهر مقصد: نجف‌آباد / اصفهان`;

    window.open(`https://wa.me/989136260072?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-[75vh] flex items-center justify-center py-12 px-4 transition-colors duration-200">
        <div className="max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 text-slate-900 dark:text-white">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <ShoppingCart className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                سبد خرید شما در حال حاضر خالی است!
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                می‌توانید انواع پنکه، موتور کولر آبی، بخاری برقی، آنتن، سیم و کابل ساختمانی و تجهیزات روشنایی را از کاتالوگ فروشگاه انتخاب کنید.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/products"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm py-3 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 hover-glow"
              >
                <span>مشاهده و خرید محصولات</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Title Bar & Top Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
              <ShoppingCart className="w-6 h-6 text-amber-500" />
              <span>سبد خرید شما</span>
              <span className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-black border border-amber-200 dark:border-amber-800">
                {toPersianDigits(itemCount)} قلم کالا
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              امکان ارسال سریع با اسنپ‌باکس در نجف‌آباد و اصفهان یا تیپاکس سراسر کشور
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportWhatsApp}
              className="text-xs text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-3.5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>استعلام پیش‌فاکتور در واتساپ</span>
            </button>

            <button
              type="button"
              onClick={() => setIsClearModalOpen(true)}
              className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 px-3 py-2.5 rounded-xl font-bold transition-colors shrink-0 flex items-center gap-1 active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>خالی کردن سبد</span>
            </button>
          </div>
        </div>

        {/* Free Shipping Dynamic Progress Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-500" />
              {isFreeShipping ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-black">
                  🎉 تبریک! سفارش شما شامل ارسال رایگان در نجف‌آباد و اصفهان شد.
                </span>
              ) : (
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  تنها <strong className="font-mono font-black text-amber-600 dark:text-amber-400">{formatToman(remainingToFreeShipping)} تومان</strong> دیگر تا دریافت ارسال رایگان با اسنپ‌باکس
                </span>
              )}
            </div>
            <span className="font-mono font-bold text-slate-500 text-[11px]">
              {toPersianDigits(shippingProgressPercent)}٪
            </span>
          </div>

          {/* Progress Track */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out rounded-full ${
                isFreeShipping
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                  : "bg-gradient-to-r from-amber-500 to-amber-400"
              }`}
              style={{ width: `${shippingProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Main Grid: Cart Items List + Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Cart Items List (Desktop Span 8) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </div>

            {/* Isfahan Dispatch Notice */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-3 text-emerald-900 dark:text-emerald-300 text-xs">
              <Truck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="leading-relaxed font-medium">
                <strong className="font-black">تحویل فوری:</strong> سفارش‌های ثبت شده در محدوده نجف‌آباد و اصفهان در همان روز با پیک اختصاصی اسنپ تحویل می‌گردند.
              </span>
            </div>
          </div>

          {/* Order Summary & Coupon (Desktop Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Coupon Code Box */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-3">
              <h3 className="font-black text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-500" />
                <span>کد تخفیف / بن خرید</span>
              </h3>

              {appliedCoupon ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-300 font-bold">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>کد فعال: {appliedCoupon.code}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-rose-600 dark:text-rose-400 hover:underline text-[11px] font-bold"
                  >
                    حذف کد
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="مثال: ISFAHAN یا SHIASI"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase font-mono"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading || !couponCode.trim()}
                      className="bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 disabled:opacity-50 text-white dark:text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shrink-0 transition-colors"
                    >
                      {couponLoading ? "..." : "اعمال"}
                    </button>
                  </div>

                  {couponError && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" />
                      {couponError}
                    </p>
                  )}

                  {couponSuccess && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      {couponSuccess}
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Price Breakdown & Checkout Action */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4">
              <h3 className="font-black text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                خلاصه فاکتور خرید
              </h3>

              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>جمع مبلغ کالاها ({toPersianDigits(itemCount)} قلم):</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{formatToman(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 font-bold">
                    <span>تخفیف اعمال شده:</span>
                    <span className="font-mono">- {formatToman(discount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>هزینه ارسال:</span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    {isFreeShipping ? "رایگان (پیک ویژه)" : "محاسبه در مرحله بعد"}
                  </span>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-baseline justify-between">
                  <span className="font-black text-sm text-slate-900 dark:text-white">
                    مبلغ قابل پرداخت:
                  </span>
                  <span className="font-black text-xl text-slate-950 dark:text-amber-400 font-mono">
                    {formatToman(total)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 hover-glow"
              >
                <span>ادامه فرآیند خرید و ثبت آدرس</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              {/* Proforma Share Note */}
              <div className="pt-2 text-center">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed font-medium">
                  پس از ثبت سفارش، پیش‌فاکتور رسمی با قابلیت چاپ و ذخیره PDF ارائه می‌شود.
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Confirmation Modal for Clear Cart */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                خالی کردن کامل سبد خرید؟
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                آیا از حذف تمامی {toPersianDigits(itemCount)} قلم کالا از سبد خرید خود اطمینان دارید؟
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
                  clearCart();
                  setIsClearModalOpen(false);
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs py-2.5 rounded-xl transition-all shadow-md shadow-rose-600/20 active:scale-95"
              >
                بله، خالی کن
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
