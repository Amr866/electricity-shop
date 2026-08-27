"use client";

import React, { useState } from "react";
import { formatToman, toPersianDigits, formatJalaliDateTime } from "@/lib/utils";
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Search,
  Printer,
  X,
  Zap,
  ShieldCheck,
  FileText,
  AlertCircle,
} from "lucide-react";

interface OrdersAdminClientProps {
  initialOrders: any[];
}

export function OrdersAdminClient({ initialOrders }: OrdersAdminClientProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: string,
    trackingCode?: string
  ) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          orderStatus: newStatus,
          trackingCode: trackingCode !== undefined ? trackingCode : undefined,
        }),
      });

      if (res.ok) {
        setOrders(
          orders.map((o) =>
            o.id === orderId ? { ...o, orderStatus: newStatus, trackingCode } : o
          )
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus, trackingCode });
        }
      } else {
        alert("خطا در بروزرسانی وضعیت سفارش.");
      }
    } catch (e) {
      alert("خطای سرور.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    const matchStatus = !statusFilter || o.orderStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <span>مدیریت سفارشات و صدور فاکتور</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            مشاهده جزییات سفارش، چاپ پیش‌فاکتور رسمی درون پنل و تخصیص کد رهگیری پیک اصفهان
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی شماره سفارش، نام مشتری یا شماره تماس..."
            className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl pr-9 pl-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-2.5"
        >
          <option value="">همه وضعیت‌ها</option>
          <option value="PENDING">در انتظار پرداخت / تایید</option>
          <option value="PROCESSING">در حال پردازش و انبار</option>
          <option value="SHIPPED">ارسال شده با پیک / پست</option>
          <option value="DELIVERED">تحویل نهایی شده</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((ord) => (
          <div
            key={ord.id}
            className="bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
          >
            {/* Order Top Summary */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedOrder(ord)}
                  className="font-mono font-extrabold text-sm text-amber-400 hover:underline"
                >
                  {ord.orderNumber}
                </button>
                <span className="text-[11px] text-slate-400">
                  {formatJalaliDateTime(ord.createdAt)}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ord.paymentStatus === "PAID"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : "bg-amber-950 text-amber-400 border border-amber-800"
                  }`}
                >
                  {ord.paymentStatus === "PAID" ? "پرداخت شده" : "در انتظار پرداخت"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedOrder(ord)}
                  className="bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 text-xs font-bold px-3.5 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5 transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>مشاهده و چاپ فاکتور</span>
                </button>
              </div>
            </div>

            {/* Customer & Address Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 block">تحویل‌گیرنده:</span>
                <strong className="text-white block">{ord.customerName}</strong>
                <a
                  href={`tel:${ord.customerPhone}`}
                  className="text-amber-400 font-mono hover:underline block"
                >
                  {toPersianDigits(ord.customerPhone)}
                </a>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="text-slate-500 block">آدرس ارسال ({ord.city}):</span>
                <p className="text-slate-300 leading-relaxed">{ord.address}</p>
                {ord.postalCode && (
                  <p className="text-slate-400 text-[11px]">کد پستی: <span className="font-mono text-white">{toPersianDigits(ord.postalCode)}</span></p>
                )}
                {ord.notes && (
                  <p className="text-[11px] text-amber-300/80">یادداشت: {ord.notes}</p>
                )}
              </div>
            </div>

            {/* Items summary */}
            <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-800/80 text-xs flex flex-wrap gap-2 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {ord.items?.map((item: any) => (
                  <span
                    key={item.id}
                    className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 font-medium"
                  >
                    {item.productName} ({toPersianDigits(item.quantity)} عدد)
                  </span>
                ))}
              </div>

              <div className="font-black text-sm text-white">
                مجموع فاکتور: <span className="text-amber-400">{formatToman(ord.totalAmount)}</span>
              </div>
            </div>

            {/* Status Change & Tracking Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">تغییر وضعیت سفارش:</span>
                <select
                  value={ord.orderStatus}
                  onChange={(e) => handleUpdateStatus(ord.id, e.target.value, ord.trackingCode)}
                  disabled={updatingId === ord.id}
                  className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="PENDING">ثبت اولیه (PENDING)</option>
                  <option value="PROCESSING">در حال آماده‌سازی در انبار اصفهان (PROCESSING)</option>
                  <option value="SHIPPED">ارسال شده با پیک/پست (SHIPPED)</option>
                  <option value="DELIVERED">تحویل مشتری شد (DELIVERED)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
                <input
                  type="text"
                  defaultValue={ord.trackingCode || ""}
                  placeholder="ثبت کد رهگیری اسنپ‌باکس/تیپاکس"
                  onBlur={(e) => {
                    if (e.target.value !== ord.trackingCode) {
                      handleUpdateStatus(ord.id, ord.orderStatus, e.target.value);
                    }
                  }}
                  className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 font-mono w-full sm:w-56"
                />
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* In-Admin Order & Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 no-print">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">
                    جزئیات سفارش <span className="font-mono text-amber-400">{selectedOrder.orderNumber}</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    تاریخ: {formatJalaliDateTime(selectedOrder.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>چاپ فاکتور</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-slate-400 hover:text-white p-1.5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Body */}
            <div id="printable-invoice" className="bg-white rounded-2xl p-6 text-slate-900 space-y-5 border border-slate-200">
              
              {/* Invoice Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950">
                    <Zap className="w-6 h-6 fill-slate-950" />
                  </div>
                  <div>
                    <h2 className="font-black text-base text-slate-950">پیش‌فاکتور فروشگاه کالای برق و الکترونیک نقش جهان</h2>
                    <span className="text-xs text-slate-600">شعبه مرکزی: اصفهان، خیابان فردوسی، پلاک ۱۲۸ | تلفن: ۰۳۱-۳۲۲۰۴۵۶۷</span>
                  </div>
                </div>

                <div className="text-left text-xs font-mono">
                  <strong>شماره: {selectedOrder.orderNumber}</strong>
                  <p className="text-slate-500 font-sans">{formatJalaliDateTime(selectedOrder.createdAt)}</p>
                </div>
              </div>

              {/* Customer Box */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">خریدار: </span>
                  <strong className="text-slate-900">{selectedOrder.customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">تلفن همراه: </span>
                  <strong className="font-mono text-slate-900">{toPersianDigits(selectedOrder.customerPhone)}</strong>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500">نشانی ارسال: </span>
                  <span className="text-slate-800">{selectedOrder.address}</span>
                  {selectedOrder.postalCode && (
                    <span className="mr-2 text-slate-600">(کد پستی: {toPersianDigits(selectedOrder.postalCode)})</span>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-xs text-right border border-slate-200">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="p-2 border border-slate-700 text-center w-8">#</th>
                    <th className="p-2 border border-slate-700">شرح کالا</th>
                    <th className="p-2 border border-slate-700 text-center w-14">تعداد</th>
                    <th className="p-2 border border-slate-700 text-left w-24">قیمت واحد</th>
                    <th className="p-2 border border-slate-700 text-left w-28">مجموع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <tr key={item.id}>
                      <td className="p-2 border border-slate-200 text-center">{toPersianDigits(idx + 1)}</td>
                      <td className="p-2 border border-slate-200 font-bold">{item.productName}</td>
                      <td className="p-2 border border-slate-200 text-center font-bold">{toPersianDigits(item.quantity)}</td>
                      <td className="p-2 border border-slate-200 text-left">{formatToman(item.price)}</td>
                      <td className="p-2 border border-slate-200 text-left font-bold">{formatToman(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals & Stamp */}
              <div className="flex items-center justify-between pt-2">
                <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center text-[10px] text-slate-500">
                  مهر و امضای فروشگاه نقش جهان اصفهان
                </div>
                <div className="space-y-1 text-xs text-left min-w-[200px]">
                  <div className="flex justify-between">
                    <span>جمع اقلام:</span>
                    <strong>{formatToman(selectedOrder.subtotal)}</strong>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>تخفیف:</span>
                      <strong>- {formatToman(selectedOrder.discount)}</strong>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>هزینه ارسال:</span>
                    <strong>{selectedOrder.shippingCost === 0 ? "رایگان" : formatToman(selectedOrder.shippingCost)}</strong>
                  </div>
                  <div className="border-t border-slate-300 pt-1 flex justify-between font-black text-sm text-slate-950">
                    <span>مبلغ کل:</span>
                    <span className="text-emerald-700">{formatToman(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
