"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatToman, toPersianDigits, formatJalaliDateTime } from "@/lib/utils";
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Search,
  ExternalLink,
  Edit,
} from "lucide-react";

interface OrdersAdminClientProps {
  initialOrders: any[];
}

export function OrdersAdminClient({ initialOrders }: OrdersAdminClientProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
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
          trackingCode: trackingCode || undefined,
        }),
      });

      if (res.ok) {
        setOrders(
          orders.map((o) =>
            o.id === orderId ? { ...o, orderStatus: newStatus, trackingCode } : o
          )
        );
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
            <span>مدیریت سفارشات و ارسال مرسولات</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            پیگیری سفارش‌های درون‌شهری اصفهان و مرسولات پستی سراسر کشور
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
            className="bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4"
          >
            {/* Order Top Summary */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono font-extrabold text-sm text-amber-400">
                  {ord.orderNumber}
                </span>
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
                <Link
                  href={`/order-tracking/${ord.orderNumber}`}
                  target="_blank"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
                >
                  <span>مشاهده فاکتور</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
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
                <span className="text-slate-500 block">آدرس ارسال:</span>
                <p className="text-slate-300 leading-relaxed">{ord.address}</p>
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
                مجموع: <span className="text-amber-400">{formatToman(ord.totalAmount)}</span>
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
                  <option value="PROCESSING">در حال پردازش در انبار (PROCESSING)</option>
                  <option value="SHIPPED">ارسال با پیک/پست (SHIPPED)</option>
                  <option value="DELIVERED">تحویل مشتری شد (DELIVERED)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
                <input
                  type="text"
                  defaultValue={ord.trackingCode || ""}
                  placeholder="ثبت کد رهگیری اسنپ/پست"
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
    </div>
  );
}
