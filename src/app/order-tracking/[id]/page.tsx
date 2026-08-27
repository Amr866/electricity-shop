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
      label: "تایید مالی و آماده‌سازی در انبار نجف‌آباد",
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
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        
        {/* Payment Success/Failure Notification Banner */}
        {paymentCallbackStatus === "success" && (
          <div className="bg-emerald-500 text-white rounded-3xl p-6 shadow-lg shadow-emerald-500/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="font-extrabold text-base">پرداخت آنلاین با موفقیت انجام شد!</h2>
                <p className="text-xs text-emerald-100 mt-0.5 font-mono">
                  کد رهگیری تراکنش شاپرک (RefID): {refId || "TRX-OK-1403"}
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
                می‌توانید مجدداً جهت پرداخت اقدام نموده یا با واحد فروش شیاسی تماس حاصل فرمایید.
              </p>
            </div>
          </div>
        )}

        {/* 1. Live Order Tracker Timeline Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-slate-900 dark:text-white transition-colors duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  وضعیت سفارش: <span className="text-amber-600 dark:text-amber-400 font-mono">{order.orderNumber}</span>
                </h1>
                <span className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-700">
                  {order.paymentStatus === "PAID" ? "پرداخت شده" : "در انتظار تسویه"}
                </span>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">
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
                    ? "bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 ring-2 ring-amber-500/20"
                    : step.completed
                    ? "bg-emerald-50/50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 opacity-60"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step.completed
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-4 h-4" /> : toPersianDigits(idx + 1)}
                  </div>
                  <strong className="text-xs text-slate-900 dark:text-white">{step.label}</strong>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Customer & Delivery Summary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 text-xs">
            <div className="space-y-1.5">
              <span className="text-slate-400 dark:text-slate-500 font-medium block">مشخصات تحویل‌گیرنده:</span>
              <p className="font-bold text-slate-900 dark:text-white">{order.customerName}</p>
              <p className="text-slate-600 dark:text-slate-300 font-mono">{toPersianDigits(order.customerPhone)}</p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{order.address}</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-slate-400 dark:text-slate-500 font-medium block">نحوه ارسال و پرداخت:</span>
              <p className="text-slate-900 dark:text-white">
                شیوه ارسال: <strong>{order.shippingMethod === "isfahan_express" ? "پیک فوری نجف‌آباد/اصفهان" : order.shippingMethod === "isfahan_pickup" ? "تحویل حضوری در فروشگاه" : order.shippingMethod}</strong>
              </p>
              <p className="text-slate-900 dark:text-white">
                شیوه پرداخت: <strong>{order.paymentMethod === "zarinpal" ? "درگاه آنلاین بانکی" : order.paymentMethod === "cod_isfahan" ? "پرداخت در محل با کارتخوان" : "کارت به کارت"}</strong>
              </p>
              {order.notes && (
                <p className="text-slate-500 dark:text-slate-400 italic">یادداشت: {order.notes}</p>
              )}
            </div>
          </div>
        </div>

        {/* 2. Official Printable Iranian Proforma Invoice Component */}
        <div
          id="printable-invoice"
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-slate-900 dark:text-white transition-colors duration-200"
        >
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-slate-900 dark:border-slate-700 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                <Zap className="w-7 h-7 fill-slate-950" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-950 dark:text-white">فروشگاه تخصصی شیاسی</h2>
                <span className="text-xs text-slate-600 dark:text-slate-400">شعبه نجف‌آباد اصفهان | تلفن: ۰۳۱-۴۲۶۲۴۵۶۷ | واحد تعمیرات: ۰۹۱۶۲۶۶۵۸۸۴</span>
              </div>
            </div>

            <div className="text-left space-y-1 text-xs">
              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">
                <span>شماره فاکتور: </span>
                <strong className="font-mono text-slate-950 dark:text-amber-400">{order.orderNumber}</strong>
              </div>
              <p className="text-slate-500 dark:text-slate-400">تاریخ: {formatJalaliDateTime(order.createdAt)}</p>
            </div>
          </div>

          {/* Buyer Information Box */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-slate-500 dark:text-slate-400">خریدار: </span>
              <strong className="text-slate-900 dark:text-white">{order.customerName}</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">شماره تماس: </span>
              <strong className="text-slate-900 dark:text-white font-mono">{toPersianDigits(order.customerPhone)}</strong>
            </div>
            {order.companyName && (
              <div>
                <span className="text-slate-500 dark:text-slate-400">شرکت / ارگان: </span>
                <strong className="text-slate-900 dark:text-white">{order.companyName}</strong>
              </div>
            )}
            {order.nationalCode && (
              <div>
                <span className="text-slate-500 dark:text-slate-400">شناسه ملی: </span>
                <strong className="text-slate-900 dark:text-white font-mono">{order.nationalCode}</strong>
              </div>
            )}
            <div className="sm:col-span-2">
              <span className="text-slate-500 dark:text-slate-400">نشانی تحویل: </span>
              <span className="text-slate-800 dark:text-slate-200">{order.address}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3 text-center w-12">ردیف</th>
                  <th className="p-3">شرح کالا / قطعه الکتریکی</th>
                  <th className="p-3 text-center w-20">تعداد</th>
                  <th className="p-3 text-left w-32">قیمت واحد</th>
                  <th className="p-3 text-left w-36">مبلغ کل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {order.items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 text-center text-slate-400">{toPersianDigits(idx + 1)}</td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{item.productName}</td>
                    <td className="p-3 text-center font-bold">{toPersianDigits(item.quantity)}</td>
                    <td className="p-3 text-left font-mono">{formatToman(item.price)}</td>
                    <td className="p-3 text-left font-bold font-mono">{formatToman(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invoice Totals Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs">
            <div className="space-y-1 text-slate-500 dark:text-slate-400">
              <p className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>این فاکتور رسمی دارای ضمانت اصالت ۱۰۰٪ مس و مهلت تست معتبر فروشگاه شیاسی می‌باشد.</span>
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>جمع اقلام:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{formatToman(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex items-center justify-between text-rose-600">
                  <span>تخفیف:</span>
                  <span className="font-mono font-bold">-{formatToman(order.discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>هزینه ارسال ({order.shippingMethod}):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{order.shippingCost === 0 ? "رایگان" : formatToman(order.shippingCost)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-extrabold text-slate-950 dark:text-amber-400 text-sm">
                <span>مبلغ نهایی پرداختی:</span>
                <span className="font-mono">{formatToman(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Official Stamp & Signature Area */}
          <div className="pt-6 border-t border-dashed border-slate-300 dark:border-slate-700 grid grid-cols-2 text-center text-xs text-slate-400">
            <div className="space-y-8">
              <span>امضاء و تایید خریدار / متقاضی</span>
              <div className="h-10" />
            </div>
            <div className="space-y-8">
              <span>مهر و امضاء مدیریت فروشگاه شیاسی (نجف‌آباد)</span>
              <div className="h-10" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
