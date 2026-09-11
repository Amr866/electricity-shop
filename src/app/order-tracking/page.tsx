"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  FileText,
  Package,
  Truck,
  AlertCircle,
  Wrench,
  Phone,
  Store,
  ShieldCheck,
  ChevronDown,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { toPersianDigits, toEnglishDigits, formatToman, formatJalaliDateTime } from "@/lib/utils";

interface OrderSummary {
  id: string;
  orderNumber: string;
  customerName: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  _count: {
    items: number;
  };
}

export default function OrderLookupPage() {
  const router = useRouter();

  // Active Tab: 'orderNumber' or 'phone'
  const [activeTab, setActiveTab] = useState<"orderNumber" | "phone">("orderNumber");

  // Order Number search state
  const [orderNumber, setOrderNumber] = useState("");
  const [orderError, setOrderError] = useState("");
  const [isRepairCode, setIsRepairCode] = useState(false);

  // Phone search state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [phoneOrders, setPhoneOrders] = useState<OrderSummary[] | null>(null);

  // FAQ Accordion open states
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleOrderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = toEnglishDigits(orderNumber.trim()).toUpperCase();
    setIsRepairCode(false);

    if (!cleanId) {
      setOrderError("لطفاً شماره سفارش خود را وارد نمایید.");
      return;
    }

    // Smart Detection: Detect if user entered a Repair Code instead of Order Code
    if (cleanId.startsWith("REP-") || cleanId.startsWith("REP") || cleanId.includes("REPAIR")) {
      setIsRepairCode(true);
      setOrderError("این یک کد رهگیری تعمیرات است، نه شماره سفارش کالا!");
      return;
    }

    router.push(`/order-tracking/${cleanId}`);
  };

  const handlePhoneSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = toEnglishDigits(phoneNumber.trim()).replace(/[^\d]/g, "");

    if (!cleanPhone || cleanPhone.length < 10) {
      setPhoneError("لطفاً شماره موبایل معتبر ۱۱ رقمی وارد نمایید (مثال: ۰۹۱۳۲۴۵۶۷۸۹).");
      return;
    }

    setPhoneLoading(true);
    setPhoneError("");
    setPhoneOrders(null);

    try {
      const res = await fetch(`/api/orders/lookup?phone=${encodeURIComponent(cleanPhone)}`);
      const data = await res.json();

      if (!res.ok) {
        setPhoneError(data.error || "سفارشی با این شماره موبایل یافت نشد.");
      } else {
        if (data.orders.length === 0) {
          setPhoneError("هیچ سفارشی با این شماره همراه در سیستم ثبت نشده است.");
        } else {
          setPhoneOrders(data.orders);
        }
      }
    } catch {
      setPhoneError("خطا در برقراری ارتباط با سرور. لطفاً دوباره تلاش فرمایید.");
    } finally {
      setPhoneLoading(false);
    }
  };

  const faqs = [
    {
      q: "شماره سفارش (فاکتور) را از کجا بیابم؟",
      a: "پس از ثبت نهایی خرید، شماره فاکتور (مانند SH-140306-089) از طریق پیامک برای شماره همراه شما ارسال می‌شود و در صفحه تایید پرداخت نیز نمایش داده می‌شود.",
    },
    {
      q: "سفارش‌های نجف‌آباد و اصفهان چقدر زمان می‌برند؟",
      a: "سفارش‌های نجف‌آباد در ساعات کاری معمولاً ظرف ۱ الی ۳ ساعت با پیک اسنپ‌باکس یا پیک اختصاصی شیاسی تحویل داده می‌شوند. برای اصفهان و سایر شهرستان‌ها ارسال همان روز با اسنپ‌باکس یا تیپاکس انجام می‌پذیرد.",
    },
    {
      q: "چگونه کد رهگیری پستی مرسوله را مشاهده کنم؟",
      a: "پس از تحویل بسته به شرکت پست یا تیپاکس، وضعیت سفارش به «ارسال شده» تغییر یافته و کد رهگیری ۲۴ رقمی پست در صفحه فاکتور شما ثبت و پیامک می‌شود.",
    },
    {
      q: "آیا امکان تغییر آدرس یا لغو سفارش پس از ثبت وجود دارد؟",
      a: "تا زمانی که وضعیت سفارش در حالت «ثبت اولیه» یا «در حال آماده‌سازی» باشد، می‌توانید با تماس مستقیم با واحد فروش (۰۳۱-۴۲۶۲۶۱۱۶) آدرس را تغییر داده یا سفارش را ویرایش نمایید.",
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 space-y-10">
        
        {/* 1. Header Hero Title */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            پیگیری وضعیت سفارش و مشاهده فاکتور
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            جهت استعلام لحظه‌ای مرسوله، بررسی وضعیت آماده‌سازی در انبار و دریافت فاکتور رسمی فروشگاه شیاسی
          </p>
        </div>

        {/* 2. Main Search Card with Dual Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          
          {/* Tab Switcher with Smooth Animated Pill */}
          <div className="relative rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1.5 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
            {/* Sliding Pill Indicator */}
            <div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-amber-500 rounded-xl shadow-sm transition-all duration-300 ease-in-out ${
                activeTab === "orderNumber" ? "right-1.5" : "right-[calc(50%+1.5px)]"
              }`}
            />

            <div className="relative z-10 flex gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("orderNumber")}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors duration-300 select-none ${
                  activeTab === "orderNumber"
                    ? "text-slate-950"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>استعلام با شماره سفارش</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("phone")}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors duration-300 select-none ${
                  activeTab === "phone"
                    ? "text-slate-950"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>استعلام با شماره موبایل</span>
              </button>
            </div>
          </div>

          {/* Smooth Tab Panels Container */}
          <div className="relative min-h-[220px]">
            {/* TAB 1: Search By Order Number */}
            {activeTab === "orderNumber" && (
              <div
                key="tab-order"
                className="animate-in fade-in-0 slide-in-from-right-4 duration-300 ease-out"
              >
                <form onSubmit={handleOrderSearch} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      شماره فاکتور / سفارش (مانند SH-140306-089)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={orderNumber}
                        onChange={(e) => {
                          setOrderNumber(e.target.value);
                          setOrderError("");
                          setIsRepairCode(false);
                        }}
                        placeholder="SH-..."
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-mono uppercase rounded-xl pr-10 pl-4 py-3.5 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                      />
                      <FileText className="w-5 h-5 text-slate-400 absolute right-3 top-4" />
                    </div>

                    {/* Error Box with Smart Repair Redirect */}
                    {orderError && (
                      <div className="mt-3 p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl space-y-2">
                        <p className="text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{orderError}</span>
                        </p>
                        {isRepairCode && (
                          <div className="pt-1">
                            <Link
                              href={`/repair-service?code=${encodeURIComponent(toEnglishDigits(orderNumber.trim()).toUpperCase())}`}
                              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all shadow-sm"
                            >
                              <Wrench className="w-3.5 h-3.5" />
                              <span>انتقال به بخش پیگیری تعمیرات ↗</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Search className="w-4 h-4" />
                    <span>استعلام و پیگیری سفارش</span>
                  </button>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>سفارش نمونه تستی فعال:</span>
                    <Link
                      href="/order-tracking/SH-140306-089"
                      className="text-amber-600 dark:text-amber-400 font-bold hover:underline font-mono bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800"
                    >
                      SH-140306-089
                    </Link>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: Search By Phone Number */}
            {activeTab === "phone" && (
              <div
                key="tab-phone"
                className="animate-in fade-in-0 slide-in-from-left-4 duration-300 ease-out space-y-4"
              >
                <form onSubmit={handlePhoneSearch} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      شماره همراه ثبت‌شده هنگام خرید
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          setPhoneError("");
                        }}
                        placeholder="۰۹۱۳۲۴۵۶۷۸۹"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-mono rounded-xl pr-10 pl-4 py-3.5 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-left"
                        dir="ltr"
                      />
                      <Phone className="w-5 h-5 text-slate-400 absolute right-3 top-4" />
                    </div>

                    {phoneError && (
                      <div className="mt-3 p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{phoneError}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={phoneLoading}
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Search className="w-4 h-4" />
                    <span>{phoneLoading ? "در حال جستجو در فاکتورها..." : "یافتن سفارشات من"}</span>
                  </button>
                </form>

                {/* Matching Orders List Result with Staggered Cascade Animation */}
                {phoneOrders && phoneOrders.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                      سفارش‌های یافت شده ({toPersianDigits(phoneOrders.length)} مورد):
                    </span>
                    <div className="space-y-2">
                      {phoneOrders.map((ord, idx) => (
                        <Link
                          key={ord.id}
                          href={`/order-tracking/${ord.orderNumber}`}
                          style={{ animationDelay: `${idx * 80}ms` }}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-amber-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:shadow-md transition-all duration-300 group animate-in fade-in-0 slide-in-from-bottom-3 duration-300 fill-mode-both"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                {ord.orderNumber}
                              </span>
                              <span className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                {ord.paymentStatus === "PAID" ? "پرداخت شده" : "در انتظار پرداخت"}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 block">
                              {formatJalaliDateTime(ord.createdAt)} • {toPersianDigits(ord._count.items)} قلم کالا
                            </span>
                          </div>

                          <div className="text-left flex items-center gap-3">
                            <span className="font-bold text-xs text-slate-900 dark:text-white font-mono">
                              {formatToman(ord.totalAmount)}
                            </span>
                            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-transform group-hover:-translate-x-1.5" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* 3. Delivery Methods & Guarantees (3-Column Grid with Smooth Hover Lift & Icon Scale) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5 group hover:-translate-y-1.5 hover:shadow-lg hover:border-emerald-400 dark:hover:border-emerald-500/50 transition-all duration-300 ease-out cursor-default">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ease-out">
              <Truck className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              پیک فوری نجف‌آباد و اصفهان
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              تحویل لحظه‌ای ۱ تا ۳ ساعته در نجف‌آباد با اسنپ‌باکس و ارسال سریع همان‌روز به شهر اصفهان.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5 group hover:-translate-y-1.5 hover:shadow-lg hover:border-amber-400 dark:hover:border-amber-500/50 transition-all duration-300 ease-out cursor-default">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ease-out">
              <Package className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              ارسال سراسری تیپاکس و پست
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              بسته‌بندی ضربه‌گیر استاندارد کارگاهی و ارسال روزانه به سراسر کشور همراه با بیمه کالا و کد رهگیری.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5 group hover:-translate-y-1.5 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500/50 transition-all duration-300 ease-out cursor-default">
            <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ease-out">
              <Store className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              تحویل حضوری در فروشگاه
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              امکان دریافت و تست سلامت حضوری سفارش در شعبه شریعت نجف‌آباد بدون هزینه ارسال.
            </p>
          </div>

        </div>

        {/* 4. FAQ Accordion Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              سوالات متداول پیگیری و ارسال سفارش
            </h2>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-right font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-amber-500" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
