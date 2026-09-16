import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  formatToman,
  toPersianDigits,
  formatJalaliDateTime,
  toEnglishDigits,
  numberToPersianWords,
  getShippingMethodTitle,
  getPaymentMethodTitle,
} from "@/lib/utils";
import { OrderInvoiceActions } from "@/components/order/OrderInvoiceActions";
import { AnimatedPriceCounter } from "@/components/order/AnimatedPriceCounter";
import {
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  Phone,
  MapPin,
  FileText,
  AlertCircle,
  Zap,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Package,
  Store,
  CreditCard,
  Receipt,
  Search,
} from "lucide-react";

interface OrderTrackingProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; refId?: string }>;
}

export default async function OrderTrackingPage({ params, searchParams }: OrderTrackingProps) {
  const { id: rawOrderNumber } = await params;
  const orderNumber = toEnglishDigits(decodeURIComponent(rawOrderNumber).trim()).toUpperCase();
  const { status: paymentCallbackStatus, refId } = await searchParams;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Calculate timeline progress percentage strictly for RTL (Right to Left)
  let progressPercent = 15;
  if (order.orderStatus === "DELIVERED") {
    progressPercent = 100;
  } else if (order.orderStatus === "SHIPPED") {
    progressPercent = 70;
  } else if (order.orderStatus === "PROCESSING" || order.paymentStatus === "PAID") {
    progressPercent = 40;
  } else if (order.orderStatus === "PENDING") {
    progressPercent = 15;
  }

  // Determine timeline steps
  const steps = [
    {
      id: "PENDING",
      stepNum: 1,
      label: "ثبت اولیه سفارش",
      desc: "اطلاعات سفارش در سیستم ثبت گردید",
      completed: true,
      current: order.orderStatus === "PENDING" && order.paymentStatus === "PENDING",
    },
    {
      id: "PROCESSING",
      stepNum: 2,
      label: "تایید مالی و آماده‌سازی در انبار",
      desc: "کالاها در حال بررسی، تست فنی و بسته‌بندی در شعبه نجف‌آباد",
      completed:
        order.paymentStatus === "PAID" ||
        order.orderStatus === "PROCESSING" ||
        order.orderStatus === "SHIPPED" ||
        order.orderStatus === "DELIVERED",
      current: order.orderStatus === "PROCESSING" || (order.paymentStatus === "PAID" && order.orderStatus === "PENDING"),
    },
    {
      id: "SHIPPED",
      stepNum: 3,
      label: "تحویل به پیک / شرکت پست",
      desc: order.trackingCode ? `کد رهگیری: ${order.trackingCode}` : "ارسال با پیک اسنپ‌باکس یا تیپاکس",
      completed: order.orderStatus === "SHIPPED" || order.orderStatus === "DELIVERED",
      current: order.orderStatus === "SHIPPED",
      trackingCode: order.trackingCode,
    },
    {
      id: "DELIVERED",
      stepNum: 4,
      label: "تحویل نهایی به مشتری",
      desc: "مرسوله با موفقیت تحویل داده شد",
      completed: order.orderStatus === "DELIVERED",
      current: order.orderStatus === "DELIVERED",
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-3 sm:py-6 transition-colors duration-200 print:bg-white print:py-0 print:min-h-0">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 space-y-3 sm:space-y-5 print:max-w-none print:px-0 print:space-y-0">
        
        {/* Navigation Breadcrumbs Bar with Seamless Lookup Link */}
        <div className="flex items-center justify-between text-xs font-semibold print:hidden bg-white dark:bg-slate-900 px-3 py-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <nav className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs truncate">
            <Link href="/" className="hover:text-amber-500 transition-colors">
              خانه
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <Link href="/order-tracking" className="hover:text-amber-500 transition-colors">
              پیگیری سفارش
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-900 dark:text-white font-mono font-bold">{order.orderNumber}</span>
          </nav>

          <Link
            href="/order-tracking"
            className="inline-flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors shrink-0 mr-2"
          >
            <Search className="w-3 h-3" />
            <span className="hidden sm:inline">استعلام سفارش دیگر</span>
            <span className="sm:hidden">استعلام جدید</span>
          </Link>
        </div>

        {/* Payment Success/Failure Notification Banner */}
        {paymentCallbackStatus === "success" && (
          <div className="bg-emerald-500 text-white rounded-2xl p-3.5 sm:p-5 shadow-md shadow-emerald-500/20 flex items-center justify-between gap-3 print:hidden animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-extrabold text-xs sm:text-sm">پرداخت آنلاین با موفقیت تایید شد!</h2>
                <p className="text-[10px] sm:text-xs text-emerald-100 font-mono">
                  کد رهگیری تراکنش شاپرک: {refId || "TRX-OK-1403"}
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block bg-white text-emerald-800 text-xs font-black px-2.5 py-1 rounded-lg">
              تایید شد
            </span>
          </div>
        )}

        {paymentCallbackStatus === "failed" && (
          <div className="bg-rose-500 text-white rounded-2xl p-3.5 sm:p-5 shadow-md shadow-rose-500/20 flex items-center gap-3 print:hidden animate-in fade-in duration-300">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <div>
              <h2 className="font-extrabold text-xs sm:text-sm">پرداخت آنلاین ناموفق بود یا لغو گردید.</h2>
              <p className="text-[10px] sm:text-xs text-rose-100">
                جهت پیگیری می‌توانید با واحد فروش شیاسی تماس حاصل فرمایید.
              </p>
            </div>
          </div>
        )}

        {/* 1. Live Order Tracker Timeline Card (Hidden in Print) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-3.5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-slate-900 dark:text-white transition-colors duration-200 print:hidden">
          
          {/* Header Row + 3 Action Buttons in 1 Line */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <h1 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  سفارش: <span className="text-amber-600 dark:text-amber-400 font-mono">{order.orderNumber}</span>
                </h1>
                
                {/* Status Badge */}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    order.paymentStatus === "PAID"
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                      : order.paymentMethod === "cod_isfahan"
                      ? "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700"
                      : "bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                  }`}
                >
                  {order.paymentStatus === "PAID"
                    ? "پرداخت شده"
                    : order.paymentMethod === "cod_isfahan"
                    ? "پرداخت در محل"
                    : "در انتظار تسویه"}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
                ثبت شده در: {formatJalaliDateTime(order.createdAt)}
              </span>
            </div>

            {/* 3 Action Buttons in 1 Line */}
            <OrderInvoiceActions
              orderNumber={order.orderNumber}
              totalAmount={order.totalAmount}
            />
          </div>

          {/* Timeline Steps: Mobile Fluid Stepper vs Desktop Horizontal Glow Line */}
          <div>
            {/* 1. Mobile Vertical Fluid Stepper (sm:hidden - Ultra Compact & Continuous) */}
            <div className="sm:hidden space-y-3 relative pr-7 before:absolute before:right-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {steps.map((step) => (
                <div key={step.id} className="relative flex items-start gap-2.5">
                  {/* Step Status Circle */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold z-10 shrink-0 -mr-7 transition-all ${
                      step.current
                        ? "bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 shadow-xs shadow-amber-500/30 scale-110"
                        : step.completed
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-3 h-3" /> : toPersianDigits(step.stepNum)}
                  </div>

                  {/* Flowing Step Information */}
                  <div className="flex-1 text-[11px] pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <strong className={`text-xs ${step.current ? "text-amber-600 dark:text-amber-400 font-black" : step.completed ? "text-slate-900 dark:text-white font-bold" : "text-slate-500 dark:text-slate-400 font-medium"}`}>
                        {step.label}
                      </strong>
                      {step.current && (
                        <span className="bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[8px] px-1.5 py-0.2 rounded-full font-black border border-amber-500/30 shrink-0">
                          جاری
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{step.desc}</p>
                    
                    {step.trackingCode && (
                      <div className="mt-1">
                        {step.trackingCode.startsWith("TIPAX") ? (
                          <a
                            href={`https://tipaxco.com/tracking?id=${encodeURIComponent(step.trackingCode)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            <span>رهگیری تیپاکس ↗</span>
                          </a>
                        ) : step.trackingCode.startsWith("SNAP") ? (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md inline-block">
                            ارسال اسنپ‌باکس
                          </span>
                        ) : (
                          <a
                            href={`https://tracking.post.ir/?id=${encodeURIComponent(step.trackingCode)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            <span>رهگیری در سامانه پست ↗</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Desktop Horizontal Stepper (hidden on mobile, visible on sm:) */}
            <div className="hidden sm:block relative pt-3 pb-1">
              <div className="absolute top-[26px] right-12 left-12 h-1 bg-slate-200 dark:bg-slate-700/80 rounded-full z-0 overflow-hidden">
                <div
                  className="absolute top-0 right-0 h-full bg-gradient-to-l from-emerald-500 via-amber-500 to-amber-400 rounded-full shadow-[0_0_14px_rgba(245,158,11,0.8)] transition-all duration-1000 ease-out overflow-hidden"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/50 to-transparent animate-pulse" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 relative z-10">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`p-3.5 rounded-2xl border transition-all duration-300 relative bg-white dark:bg-slate-900 ${
                      step.current
                        ? "bg-amber-50/90 dark:bg-amber-950/50 border-amber-400 dark:border-amber-600 ring-4 ring-amber-500/20 shadow-xs"
                        : step.completed
                        ? "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80"
                        : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-transform duration-300 shrink-0 ${
                          step.current
                            ? "bg-amber-500 text-slate-950 shadow-xs shadow-amber-500/40 ring-2 ring-white dark:ring-slate-900 scale-105"
                            : step.completed
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : toPersianDigits(step.stepNum)}
                      </div>
                      <strong className={`text-xs leading-snug ${step.current ? "text-amber-700 dark:text-amber-300 font-black" : "text-slate-900 dark:text-white"}`}>
                        {step.label}
                      </strong>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">{step.desc}</p>
                    
                    {step.trackingCode && (
                      <div className="mt-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-700/80">
                        {step.trackingCode.startsWith("TIPAX") ? (
                          <a
                            href={`https://tipaxco.com/tracking?id=${encodeURIComponent(step.trackingCode)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>رهگیری تیپاکس ↗</span>
                          </a>
                        ) : step.trackingCode.startsWith("SNAP") ? (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                            ارسال اسنپ‌باکس
                          </span>
                        ) : (
                          <a
                            href={`https://tracking.post.ir/?id=${encodeURIComponent(step.trackingCode)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>سامانه شرکت پست ↗</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compact Customer & Delivery Summary Details (Micro-grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/80 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 dark:text-slate-500 font-medium block text-[10px]">تحویل‌گیرنده:</span>
              <p className="font-bold text-slate-900 dark:text-white text-[11px] sm:text-xs">
                {order.customerName} <span className="font-mono font-normal text-slate-500 dark:text-slate-400">({toPersianDigits(order.customerPhone)})</span>
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-snug text-[10px] sm:text-[11px]">{order.address}</p>
            </div>

            <div className="space-y-1 sm:border-r sm:pr-3 border-slate-200 dark:border-slate-700 pt-2 sm:pt-0 border-t sm:border-t-0">
              <span className="text-slate-400 dark:text-slate-500 font-medium block text-[10px]">ارسال و پرداخت:</span>
              <div className="flex flex-wrap gap-1 text-[10px] sm:text-[11px]">
                <span className="bg-slate-200/70 dark:bg-slate-700/60 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200">
                  {getShippingMethodTitle(order.shippingMethod, true)}
                </span>
                <span className="bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded text-emerald-800 dark:text-emerald-300 font-medium">
                  {getPaymentMethodTitle(order.paymentMethod)}
                </span>
              </div>
              {order.notes && (
                <p className="text-slate-500 dark:text-slate-400 italic text-[10px] pt-0.5">یادداشت: {order.notes}</p>
              )}
            </div>
          </div>
        </div>

        {/* 2. Official Printable Iranian Proforma Invoice Component */}
        <div
          id="printable-invoice"
          className="bg-white dark:bg-slate-900 rounded-3xl p-3.5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 sm:space-y-5 text-slate-900 dark:text-white transition-colors duration-200 print:bg-white print:text-black print:p-4 print:border print:border-black print:rounded-none print:shadow-none print:block print:break-inside-avoid"
        >
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b-2 border-slate-900 dark:border-slate-700 print:border-b-2 print:border-black pb-3 sm:pb-4 text-center sm:text-right">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black print:border print:border-black shadow-xs shrink-0">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-950 print:text-black" />
              </div>
              <div className="text-right">
                <h2 className="text-sm sm:text-base font-black text-slate-950 dark:text-white print:text-black">فروشگاه شیاسی</h2>
                <span className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 print:text-black block">
                  اصفهان، نجف‌آباد، ۱۵ خرداد مرکزی، نبش بن‌بست نرگس | تلفن: <bdi dir="ltr">۰۳۱-۴۲۶۲۶۱۱۶</bdi> - <bdi dir="ltr">۰۳۱-۴۲۶۲۶۱۰۷</bdi> | همراه: <bdi dir="ltr">۰۹۱۳۶۲۶۰۰۷۲</bdi>
                </span>
              </div>
            </div>

            <div className="text-center sm:text-left space-y-0.5 text-xs w-full sm:w-auto flex flex-col items-center sm:items-end">
              <div className="bg-slate-100 dark:bg-slate-800 print:bg-white print:border print:border-black px-2.5 py-1 rounded-lg">
                <span className="print:text-black text-[11px]">شماره فاکتور: </span>
                <strong className="font-mono text-slate-950 dark:text-amber-400 print:text-black text-xs">{order.orderNumber}</strong>
              </div>
              <p className="text-slate-500 dark:text-slate-400 print:text-black text-[10px]">تاریخ: {formatJalaliDateTime(order.createdAt)}</p>
            </div>
          </div>

          {/* Buyer Information Box */}
          <div className="bg-slate-50 dark:bg-slate-800/80 print:bg-white print:border print:border-black p-2.5 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2 print:text-black">
            <div>
              <span className="text-slate-500 dark:text-slate-400 print:text-black text-[11px]">خریدار: </span>
              <strong className="text-slate-900 dark:text-white print:text-black text-[11px]">{order.customerName}</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 print:text-black text-[11px]">تماس: </span>
              <strong className="text-slate-900 dark:text-white print:text-black font-mono text-[11px]">{toPersianDigits(order.customerPhone)}</strong>
            </div>
            {order.companyName && (
              <div>
                <span className="text-slate-500 dark:text-slate-400 print:text-black text-[11px]">شرکت: </span>
                <strong className="text-slate-900 dark:text-white print:text-black text-[11px]">{order.companyName}</strong>
              </div>
            )}
            {order.nationalCode && (
              <div>
                <span className="text-slate-500 dark:text-slate-400 print:text-black text-[11px]">شناسه ملی: </span>
                <strong className="text-slate-900 dark:text-white print:text-black font-mono text-[11px]">{order.nationalCode}</strong>
              </div>
            )}
            {order.economicCode && (
              <div>
                <span className="text-slate-500 dark:text-slate-400 print:text-black text-[11px]">کد اقتصادی: </span>
                <strong className="text-slate-900 dark:text-white print:text-black font-mono text-[11px]">{order.economicCode}</strong>
              </div>
            )}
            <div className="sm:col-span-2">
              <span className="text-slate-500 dark:text-slate-400 print:text-black text-[11px]">نشانی: </span>
              <span className="text-slate-800 dark:text-slate-200 print:text-black text-[11px] leading-snug">{order.address}</span>
            </div>
          </div>

          {/* Items Section: Mobile Adaptive Cards vs Desktop & Print Table */}
          
          {/* 1. Mobile Adaptive Items Cards (sm:hidden print:hidden) */}
          <div className="sm:hidden space-y-2 print:hidden">
            <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 block">
              اقلام فاکتور ({toPersianDigits(order.items.length)} قلم):
            </span>
            {order.items.map((item, idx) => {
              const productImg =
                item.productImage ||
                item.product?.images?.find((img) => img.isPrimary)?.url ||
                item.product?.images?.[0]?.url;

              return (
                <div
                  key={item.id}
                  style={{ animationDelay: `${idx * 50}ms` }}
                  className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 fill-mode-both"
                >
                  <div className="flex items-center gap-2.5">
                    {productImg ? (
                      <img
                        src={productImg}
                        alt={item.productName}
                        className="w-10 h-10 rounded-xl object-contain bg-white dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                        <Package className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                        {item.productName}
                      </h4>
                      {item.product?.mpn && (
                        <span className="text-[9px] text-slate-400 font-mono block">
                          پارت: {item.product.mpn}
                        </span>
                      )}
                    </div>
                    <span className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0">
                      {toPersianDigits(item.quantity)} عدد
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/70 dark:border-slate-700/60">
                    <span className="text-slate-400 text-[10px]">
                      واحد: {formatToman(item.price)}
                    </span>
                    <div className="text-left font-bold text-slate-950 dark:text-white font-mono text-[11px]">
                      {formatToman(item.total)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2. Desktop & Print Standard Table */}
          <div className="hidden sm:block print:block rounded-xl border border-slate-200 dark:border-slate-700 print:border print:border-black overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 print:bg-slate-100 text-slate-700 dark:text-slate-300 print:text-black font-bold border-b border-slate-200 dark:border-slate-700 print:border-black">
                <tr>
                  <th className="p-2.5 text-center w-12 print:border-r print:border-black">ردیف</th>
                  <th className="p-2.5 print:border-r print:border-black">شرح کالا / قطعه الکتریکی</th>
                  <th className="p-2.5 text-center w-20 print:border-r print:border-black">تعداد</th>
                  <th className="p-2.5 text-left w-32 print:border-r print:border-black">قیمت واحد</th>
                  <th className="p-2.5 text-left w-36">مبلغ کل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 print:divide-black">
                {order.items.map((item, idx) => {
                  const productImg =
                    item.productImage ||
                    item.product?.images?.find((img) => img.isPrimary)?.url ||
                    item.product?.images?.[0]?.url;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-amber-500/5 dark:hover:bg-amber-500/10 transition-colors duration-200 group/row print:text-black"
                    >
                      <td className="p-2.5 text-center text-slate-400 print:text-black print:border-r print:border-black">
                        {toPersianDigits(idx + 1)}
                      </td>
                      <td className="p-2.5 print:border-r print:border-black">
                        <div className="flex items-center gap-2.5">
                          {productImg ? (
                            <img
                              src={productImg}
                              alt={item.productName}
                              className="w-8 h-8 rounded-lg object-contain bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 shrink-0 print:border print:border-black group-hover/row:scale-105 transition-all duration-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 print:border print:border-black">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white print:text-black block line-clamp-1 group-hover/row:text-amber-600 dark:group-hover/row:text-amber-400 transition-colors">
                              {item.productName}
                            </span>
                            {item.product?.mpn && (
                              <span className="text-[10px] text-slate-400 print:text-black font-mono">
                                پارت: {item.product.mpn}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-2.5 text-center font-bold print:text-black print:border-r print:border-black">
                        {toPersianDigits(item.quantity)}
                      </td>
                      <td className="p-2.5 text-left font-mono print:text-black print:border-r print:border-black">
                        {formatToman(item.price)}
                      </td>
                      <td className="p-2.5 text-left font-bold font-mono print:text-black">
                        {formatToman(item.total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Invoice Totals & Price in Words Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-700 print:border-black text-xs">
            
            {/* Left side: Guarantee + Price in Formal Persian Words */}
            <div className="space-y-2 flex-1 w-full sm:w-auto">
              <p className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 print:text-black text-[10px] sm:text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 print:text-black shrink-0" />
                <span>ضمانت اصالت ۱۰۰٪ مس و مهلت تست معتبر فروشگاه شیاسی.</span>
              </p>

              {/* Formal Persian Words Display */}
              <div className="p-2.5 bg-amber-50/70 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/80 print:bg-white print:border print:border-black shadow-xs">
                <span className="text-slate-500 dark:text-slate-400 print:text-black block mb-0.5 text-[9px] sm:text-[10px]">
                  مبلغ قابل پرداخت به حروف:
                </span>
                <strong className="text-amber-900 dark:text-amber-300 print:text-black font-extrabold text-xs">
                  {numberToPersianWords(order.totalAmount)}
                </strong>
              </div>
            </div>

            {/* Right side: Financial Numbers Breakdown */}
            <div className="w-full sm:w-72 space-y-1.5 bg-slate-50 dark:bg-slate-800/80 print:bg-white print:border print:border-black p-3 rounded-xl border border-slate-200 dark:border-slate-700 print:text-black shrink-0">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 print:text-black text-xs">
                <span>جمع کل اقلام:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white print:text-black">{formatToman(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex items-center justify-between text-rose-600 print:text-black text-xs">
                  <span>تخفیف:</span>
                  <span className="font-mono font-bold">-{formatToman(order.discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 print:text-black text-xs">
                <span>هزینه ارسال ({getShippingMethodTitle(order.shippingMethod, true)}):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white print:text-black">
                  {order.shippingCost === 0 ? "رایگان" : formatToman(order.shippingCost)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-200 dark:border-slate-700 print:border-black font-extrabold text-slate-950 dark:text-amber-400 print:text-black text-xs sm:text-sm">
                <span>مبلغ پرداختی:</span>
                <AnimatedPriceCounter
                  amount={order.totalAmount}
                  className="font-extrabold text-xs sm:text-sm text-slate-950 dark:text-amber-400 print:text-black"
                />
              </div>
            </div>
          </div>

          {/* Official Stamp & Signature Area */}
          <div className="pt-5 border-t border-dashed border-slate-300 dark:border-slate-700 print:border-black flex flex-col sm:grid sm:grid-cols-2 text-center text-xs text-slate-400 print:text-black gap-4 items-center">
            <div className="space-y-3 w-full">
              <span className="text-[11px]">امضاء و تایید خریدار / متقاضی</span>
              <div className="h-8 border-b border-dotted border-slate-300 dark:border-slate-700 w-36 mx-auto print:border-black" />
            </div>

            {/* Authentic Digital Stamp Seal */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-600/70 dark:border-amber-500/70 print:border-2 print:border-black flex flex-col items-center justify-center p-1.5 text-center text-[8px] text-amber-700 dark:text-amber-400 print:text-black select-none rotate-[-6deg] bg-amber-500/5 dark:bg-amber-500/10 shadow-xs animate-in zoom-in-125 fade-in-0 duration-700 ease-out">
                <span className="font-black text-[9px]">فروشگاه شیاسی</span>
                <span className="text-[8px] font-bold">شعبه نجف‌آباد</span>
                <span className="text-[7px] text-emerald-600 dark:text-emerald-400 print:text-black font-extrabold mt-0.5">اصالت ۱۰۰٪ مس</span>
                <span className="text-[6px] text-slate-400 print:text-black">تایید انبار و حسابداری</span>
              </div>
              <span className="text-[10px] text-slate-400 print:text-black font-medium">مهر و امضاء مدیریت فروشگاه شیاسی</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
