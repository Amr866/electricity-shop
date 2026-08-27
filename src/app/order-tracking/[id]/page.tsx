import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatToman, toPersianDigits, formatJalaliDateTime } from "@/lib/utils";
import { OrderInvoiceActions } from "@/components/order/OrderInvoiceActions";
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
} from "lucide-react";

interface OrderTrackingProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; refId?: string }>;
}

export default async function OrderTrackingPage({ params, searchParams }: OrderTrackingProps) {
  const { id: orderNumber } = await params;
  const { status: paymentCallbackStatus, refId } = await searchParams;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  // Determine timeline steps
  const steps = [
    {
      id: "PENDING",
      label: "ثبت اولیه سفارش",
      desc: "اطلاعات سفارش در سیستم ثبت گردید",
      completed: true,
      current: order.orderStatus === "PENDING" && order.paymentStatus === "PENDING",
    },
    {
      id: "PROCESSING",
      label: "تایید مالی و آماده‌سازی در انبار اصفهان",
      desc: "کالاها در حال بررسی، تست و بسته‌بندی می‌باشند",
      completed: order.paymentStatus === "PAID" || order.orderStatus === "PROCESSING" || order.orderStatus === "SHIPPED" || order.orderStatus === "DELIVERED",
      current: order.orderStatus === "PROCESSING",
    },
    {
      id: "SHIPPED",
      label: "تحویل به پیک / شرکت پست",
      desc: order.trackingCode ? `کد رهگیری: ${order.trackingCode}` : "ارسال با پیک اسنپ‌باکس یا تیپاکس",
      completed: order.orderStatus === "SHIPPED" || order.orderStatus === "DELIVERED",
      current: order.orderStatus === "SHIPPED",
    },
    {
      id: "DELIVERED",
      label: "تحویل نهایی به مشتری",
      desc: "مرسوله تحویل داده شد",
      completed: order.orderStatus === "DELIVERED",
      current: order.orderStatus === "DELIVERED",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        
        {/* Payment Success/Failure Notification Banner */}
        {paymentCallbackStatus === "success" && (
          <div className="bg-emerald-500 text-white rounded-3xl p-6 shadow-lg shadow-emerald-500/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="font-extrabold text-base">پرداخت با موفقیت انجام شد!</h2>
                <p className="text-xs text-emerald-100 mt-0.5">
                  کد پیگیری درگاه: <strong className="font-mono text-white">{refId || order.paymentRefId}</strong>
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block bg-white text-emerald-800 text-xs font-black px-3 py-1.5 rounded-xl shadow-sm">
              تایید شد
            </span>
          </div>
        )}

        {paymentCallbackStatus === "failed" && (
          <div className="bg-rose-500 text-white rounded-3xl p-6 shadow-lg shadow-rose-500/20 flex items-center gap-3">
            <AlertCircle className="w-8 h-8 shrink-0" />
            <div>
              <h2 className="font-extrabold text-base">پرداخت آنلاین ناموفق بود یا لغو گردید.</h2>
              <p className="text-xs text-rose-100 mt-0.5">
                می‌توانید مجدداً جهت پرداخت اقدام نموده یا با واحد فروش اصفهان تماس حاصل فرمایید.
              </p>
            </div>
          </div>
        )}

        {/* 1. Live Order Tracker Timeline Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg text-slate-900">
                  وضعیت سفارش: <span className="text-amber-600 font-mono">{order.orderNumber}</span>
                </h1>
                <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded-md">
                  {order.paymentStatus === "PAID" ? "پرداخت شده" : "در انتظار تسویه"}
                </span>
              </div>
              <span className="text-xs text-slate-400 mt-1 block">
                زمان ثبت: {formatJalaliDateTime(order.createdAt)}
              </span>
            </div>

            {/* Client-side Action Buttons */}
            <OrderInvoiceActions
              orderNumber={order.orderNumber}
              totalAmount={order.totalAmount}
            />
          </div>

          {/* Timeline Steps Component */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className={`p-4 rounded-2xl border transition-all ${
                  step.current
                    ? "bg-amber-50 border-amber-300 ring-2 ring-amber-500/20"
                    : step.completed
                    ? "bg-emerald-50/50 border-emerald-200"
                    : "bg-slate-50 border-slate-200 opacity-60"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step.completed
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-300 text-slate-700"
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-4 h-4" /> : toPersianDigits(idx + 1)}
                  </div>
                  <strong className="text-xs text-slate-900">{step.label}</strong>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Customer & Delivery Summary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
            <div className="space-y-1.5">
              <span className="text-slate-400 font-medium block">مشخصات تحویل‌گیرنده:</span>
              <p className="font-bold text-slate-900">{order.customerName}</p>
              <p className="text-slate-600 font-mono">{toPersianDigits(order.customerPhone)}</p>
              <p className="text-slate-600 leading-relaxed">{order.address}</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-slate-400 font-medium block">نحوه ارسال و پرداخت:</span>
              <p className="text-slate-900">
                شیوه ارسال: <strong>{order.shippingMethod === "isfahan_express" ? "پیک فوری اصفهان" : order.shippingMethod}</strong>
              </p>
              <p className="text-slate-900">
                شیوه پرداخت: <strong>{order.paymentMethod === "zarinpal" ? "درگاه آنلاین بانکی" : order.paymentMethod === "cod_isfahan" ? "پرداخت در محل در اصفهان" : "کارت به کارت"}</strong>
              </p>
              {order.notes && (
                <p className="text-slate-500 italic">یادداشت: {order.notes}</p>
              )}
            </div>
          </div>
        </div>

        {/* 2. Official Printable Iranian Proforma Invoice Component */}
        <div
          id="printable-invoice"
          className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6 text-slate-900"
        >
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-slate-900 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                <Zap className="w-7 h-7 fill-slate-950" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-950">فروشگاه تخصصی شیاسی</h2>
                <span className="text-xs text-slate-600">شعبه نجف‌آباد اصفهان | تلفن: ۰۳۱-۴۲۶۲۴۵۶۷ | واحد تعمیرات: ۰۹۱۶۲۶۶۵۸۸۴</span>
              </div>
            </div>

            <div className="text-left space-y-1 text-xs">
              <div className="bg-slate-100 px-3 py-1 rounded-md">
                <span>شماره فاکتور: </span>
                <strong className="font-mono text-slate-950">{order.orderNumber}</strong>
              </div>
              <p className="text-slate-500">تاریخ: {formatJalaliDateTime(order.createdAt)}</p>
            </div>
          </div>

          {/* Buyer Information Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-slate-500">خریدار: </span>
              <strong className="text-slate-900">{order.customerName}</strong>
            </div>
            <div>
              <span className="text-slate-500">شماره تماس: </span>
              <strong className="text-slate-900 font-mono">{toPersianDigits(order.customerPhone)}</strong>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500">نشانی تحویل: </span>
              <span className="text-slate-800">{order.address}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border border-slate-200">
              <thead className="bg-slate-900 text-white font-bold">
                <tr>
                  <th className="p-2.5 border border-slate-700 text-center w-10">ردیف</th>
                  <th className="p-2.5 border border-slate-700">شرح کالا / خدمات</th>
                  <th className="p-2.5 border border-slate-700 text-center w-16">تعداد</th>
                  <th className="p-2.5 border border-slate-700 text-left w-28">قیمت واحد</th>
                  <th className="p-2.5 border border-slate-700 text-left w-32">مبلغ کل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {order.items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-2.5 border border-slate-200 text-center">{toPersianDigits(idx + 1)}</td>
                    <td className="p-2.5 border border-slate-200">{item.productName}</td>
                    <td className="p-2.5 border border-slate-200 text-center font-bold">{toPersianDigits(item.quantity)}</td>
                    <td className="p-2.5 border border-slate-200 text-left">{formatToman(item.price)}</td>
                    <td className="p-2.5 border border-slate-200 text-left font-bold">{formatToman(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Calculation & Signatures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end pt-2">
            <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center space-y-6">
              <span className="text-[11px] text-slate-500 font-bold block">مهر و امضای فروشگاه تخصصی شیاسی (نجف‌آباد)</span>
              <div className="w-20 h-20 border-2 border-emerald-600/60 rounded-full mx-auto flex items-center justify-center text-emerald-800 text-[10px] font-black rotate-[-12deg]">
                فروشگاه شیاسی
                <br />
                تایید شد
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>جمع اقلام:</span>
                <span className="font-bold">{formatToman(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex items-center justify-between text-rose-600 font-bold">
                  <span>تخفیف:</span>
                  <span>- {formatToman(order.discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>هزینه حمل و نقل:</span>
                <span className="font-bold">{order.shippingCost === 0 ? "رایگان" : formatToman(order.shippingCost)}</span>
              </div>
              <div className="border-t border-slate-300 pt-2 flex items-baseline justify-between font-black text-sm text-slate-950">
                <span>مبلغ کل فاکتور:</span>
                <span className="text-base text-emerald-700">{formatToman(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
