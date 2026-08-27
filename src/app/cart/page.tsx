"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
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
} from "lucide-react";

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

  if (items.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm space-y-5">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto">
              <ShoppingCart className="w-10 h-10" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">
              سبد خرید شما در حال حاضر خالی است!
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              می‌توانید انواع سیم و کابل ساختمانی، پنل‌های روشنایی ال‌ای‌دی، کلید و پریز یا قطعات الکترونیک را از بخش کاتالوگ فروشگاه انتخاب کنید.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
            >
              <span>مشاهده و خرید محصولات</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        
        {/* Title Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-amber-500" />
              <span>سبد خرید شما</span>
              <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold border border-amber-200">
                {toPersianDigits(itemCount)} قلم کالا
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              امکان ارسال سریع با اسنپ‌باکس در اصفهان یا تیپاکس سراسر کشور
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 bg-white border border-rose-200 hover:border-rose-300 px-3 py-2 rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>خالی کردن سبد</span>
          </button>
        </div>

        {/* Main Grid: Cart Items List + Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Cart Items Table */}
          <div className="lg:col-span-8 space-y-3">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-4 flex-1">
                    <Link
                      href={`/products/${item.slug}`}
                      className="w-20 h-20 bg-slate-50 rounded-2xl p-2 border border-slate-100 shrink-0 overflow-hidden"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </Link>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        {item.categoryName || "تجهیزات الکتریکی"}
                      </span>
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-bold text-xs sm:text-sm text-slate-900 hover:text-amber-600 transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <div className="text-xs text-slate-500 font-medium">
                        قیمت واحد: <span className="font-bold text-slate-800">{formatToman(item.price)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Total Calculation */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 self-end sm:self-center">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-1.5 text-slate-600 hover:text-slate-950 disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-bold text-xs text-slate-900 persian-numbers">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-slate-600 hover:text-slate-950"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total for this item */}
                    <div className="text-left sm:text-right min-w-[100px]">
                      <span className="text-[10px] text-slate-400 block">مجموع:</span>
                      <span className="font-black text-sm text-slate-950">
                        {formatToman(item.price * item.quantity)}
                      </span>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="حذف از سبد"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Isfahan Dispatch Notice */}
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3 text-emerald-900 text-xs">
              <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>سفارش‌های شهر اصفهان:</strong> در صورت ثبت سفارش تا ساعت ۱۷:۰۰، تحویل با پیک اسنپ‌باکس در همان روز انجام خواهد شد.
              </span>
            </div>
          </div>

          {/* Right Col: Summary & Coupon */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Coupon Code Box */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-500" />
                <span>کد تخفیف / بن خرید</span>
              </h3>

              {appliedCoupon ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900 font-bold">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>کد فعال: {appliedCoupon.code}</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-rose-600 hover:underline text-[11px]"
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
                      placeholder="مثال: ISFAHAN یا BAHAR1403"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase font-mono"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading || !couponCode.trim()}
                      className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl shrink-0 transition-colors"
                    >
                      {couponLoading ? "..." : "اعمال"}
                    </button>
                  </div>

                  {couponError && (
                    <p className="text-[11px] text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {couponError}
                    </p>
                  )}

                  {couponSuccess && (
                    <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {couponSuccess}
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Price Breakdown & Checkout Action */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
                خلاصه فاکتور خرید
              </h3>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>جمع مبلغ کالاها ({toPersianDigits(itemCount)} قلم):</span>
                  <span className="font-bold text-slate-900">{formatToman(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-rose-600 font-bold">
                    <span>تخفیف اعمال شده:</span>
                    <span>- {formatToman(discount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-500">
                  <span>هزینه ارسال:</span>
                  <span className="text-[11px]">محاسبه در مرحله بعد</span>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-baseline justify-between">
                  <span className="font-extrabold text-sm text-slate-900">
                    مبلغ قابل پرداخت:
                  </span>
                  <span className="font-black text-xl text-slate-950">
                    {formatToman(total)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <span>ادامه فرآیند خرید و ثبت آدرس</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              {/* Proforma Share Note */}
              <div className="pt-2 text-center">
                <span className="text-[11px] text-slate-400">
                  پس از ثبت سفارش، پیش‌فاکتور رسمی با قابلیت چاپ و ذخیره PDF ارائه می‌شود.
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
