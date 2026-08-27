"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { formatToman, toPersianDigits } from "@/lib/utils";
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
} from "lucide-react";

function ZarinpalMockContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderNumber = searchParams.get("orderNumber") || "NJ-140306-000";
  const amountStr = searchParams.get("amount") || "0";
  const amount = parseInt(amountStr, 10) || 0;

  const [cardNumber, setCardNumber] = useState("6037 9975 1234 5678");
  const [cvv2, setCvv2] = useState("1234");
  const [expMonth, setExpMonth] = useState("06");
  const [expYear, setExpYear] = useState("06");
  const [pin, setPin] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes timer

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${toPersianDigits(m)}:${toPersianDigits(s < 10 ? `0${s}` : s)}`;
  };

  const handlePayment = async (isSuccess: boolean) => {
    setLoading(true);
    const refId = `ZP-SHP-${Date.now().toString().slice(-8)}`;

    try {
      await fetch("/api/orders/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          status: isSuccess ? "SUCCESS" : "FAILED",
          refId,
        }),
      });

      if (isSuccess) {
        router.push(`/order-tracking/${orderNumber}?status=success&refId=${refId}`);
      } else {
        router.push(`/order-tracking/${orderNumber}?status=failed`);
      }
    } catch (e) {
      console.error(e);
      alert("خطایی رخ داد.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen py-10 flex items-center justify-center px-4 font-sans">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Gateway Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 p-5 text-slate-950 flex items-center justify-between border-b border-amber-400">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-black">
              <Zap className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-slate-950">درگاه پرداخت اینترنتی زرین‌پال</h1>
              <span className="text-[11px] text-slate-800 font-medium">اتصال به شاپرک (بانک مرکزی)</span>
            </div>
          </div>

          <div className="bg-slate-950/10 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold">
            <Clock className="w-4 h-4 text-slate-950" />
            <span>{formatTimer(timeLeft)}</span>
          </div>
        </div>

        {/* Merchant & Order Details Bar */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 text-xs text-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">پذیرنده:</span>
            <strong className="text-slate-900">کالای برق و الکترونیک نقش جهان (اصفهان)</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">شماره سفارش:</span>
            <strong className="font-mono text-slate-900">{orderNumber}</strong>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-200">
            <span className="text-slate-500 font-bold">مبلغ قابل پرداخت:</span>
            <span className="font-black text-base text-emerald-700">{formatToman(amount)}</span>
          </div>
        </div>

        {/* Payment Form Fields */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              شماره کارت بانکی (۱۶ رقم عضو شتاب)
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm font-mono tracking-widest text-center rounded-xl py-2.5 focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
              <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                کد امنیتی CVV2
              </label>
              <input
                type="password"
                maxLength={4}
                value={cvv2}
                onChange={(e) => setCvv2(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm font-mono text-center rounded-xl py-2 focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                تاریخ انقضا (ماه / سال)
              </label>
              <div className="flex gap-1.5 items-center">
                <input
                  type="text"
                  maxLength={2}
                  value={expMonth}
                  onChange={(e) => setExpMonth(e.target.value)}
                  placeholder="ماه"
                  className="w-1/2 bg-slate-50 border border-slate-300 text-slate-900 text-sm font-mono text-center rounded-xl py-2"
                />
                <span>/</span>
                <input
                  type="text"
                  maxLength={2}
                  value={expYear}
                  onChange={(e) => setExpYear(e.target.value)}
                  placeholder="سال"
                  className="w-1/2 bg-slate-50 border border-slate-300 text-slate-900 text-sm font-mono text-center rounded-xl py-2"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                رمز دوم پویا
              </label>
              <button
                type="button"
                className="text-[11px] text-amber-600 font-bold hover:underline"
              >
                دریافت پیامکی رمز پویا
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm font-mono text-center rounded-xl py-2.5 focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          {/* Test Buttons */}
          <div className="pt-3 space-y-2.5">
            <button
              onClick={() => handlePayment(true)}
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>پرداخت موفق و بازگشت به الکتریک نقش جهان</span>
            </button>

            <button
              onClick={() => handlePayment(false)}
              disabled={loading}
              className="w-full py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>انصراف از پرداخت و بازگشت</span>
            </button>
          </div>

          <div className="pt-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>پروتکل امن انتقال اطلاعات بانکی شاپرک (SSL 256-bit)</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ZarinpalMockPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs">در حال بارگذاری درگاه پرداخت شاپرک...</div>}>
      <ZarinpalMockContent />
    </Suspense>
  );
}
