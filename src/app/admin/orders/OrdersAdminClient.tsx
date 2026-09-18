"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  formatToman,
  toPersianDigits,
  formatJalaliDateTime,
  formatJalaliDate,
} from "@/lib/utils";
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
  FileSpreadsheet,
  Download,
  FileDown,
  AlertCircle,
  MessageCircle,
  Copy,
  Check,
  TrendingUp,
  Package,
  Building2,
  Send,
  Loader2,
  ExternalLink,
  ChevronRight,
  Filter,
  Save,
  CheckCheck,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";

export interface AdminOrderItem {
  id: string;
  productId?: string | null;
  productName: string;
  productImage?: string | null;
  price: number;
  quantity: number;
  total: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  province: string;
  city: string;
  postalCode?: string | null;
  address: string;
  isCorporate?: boolean;
  companyName?: string | null;
  economicCode?: string | null;
  nationalCode?: string | null;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  trackingCode?: string | null;
  subtotal: number;
  discount: number;
  totalAmount: number;
  notes?: string | null;
  items: AdminOrderItem[];
  createdAt: string | Date;
  updatedAt?: string | Date;
}

interface OrdersAdminClientProps {
  initialOrders: AdminOrder[];
}

export function OrdersAdminClient({ initialOrders }: OrdersAdminClientProps) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  
  // Updating states
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<{ [key: string]: string }>({});
  const [savingTrackingId, setSavingTrackingId] = useState<string | null>(null);
  const [savedTrackingId, setSavedTrackingId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Deletion states
  const [orderToDelete, setOrderToDelete] = useState<AdminOrder | null>(null);
  const [showDeleteSampleModal, setShowDeleteSampleModal] = useState(false);
  const [showDeleteAllOrdersModal, setShowDeleteAllOrdersModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Financial & Fulfillment Metrics
  const metrics = useMemo(() => {
    const totalCount = orders.length;
    const paidRevenue = orders
      .filter((o) => o.paymentStatus === "PAID")
      .reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const inWarehouseCount = orders.filter((o) => o.orderStatus === "PROCESSING").length;
    const shippedCount = orders.filter((o) => o.orderStatus === "SHIPPED").length;
    const pendingPaymentCount = orders.filter((o) => o.paymentStatus === "PENDING").length;

    return {
      totalCount,
      paidRevenue,
      inWarehouseCount,
      shippedCount,
      pendingPaymentCount,
    };
  }, [orders]);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: string,
    trackingCode?: string,
    paymentStatus?: string
  ) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          orderStatus: newStatus,
          paymentStatus,
          trackingCode,
        }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  orderStatus: newStatus || o.orderStatus,
                  paymentStatus: paymentStatus || o.paymentStatus,
                  trackingCode: trackingCode !== undefined ? trackingCode : o.trackingCode,
                }
              : o
          )
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({
            ...selectedOrder,
            orderStatus: newStatus || selectedOrder.orderStatus,
            paymentStatus: paymentStatus || selectedOrder.paymentStatus,
            trackingCode: trackingCode !== undefined ? trackingCode : selectedOrder.trackingCode,
          });
        }
      } else {
        alert("خطا در به‌روزرسانی وضعیت سفارش.");
      }
    } catch {
      alert("خطای سرور در برقراری ارتباط.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveTracking = async (orderId: string, currentStatus: string) => {
    const code = trackingInputs[orderId];
    if (code === undefined) return;

    setSavingTrackingId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          orderStatus: currentStatus,
          trackingCode: code,
        }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, trackingCode: code } : o))
        );
        setSavedTrackingId(orderId);
        setTimeout(() => setSavedTrackingId(null), 2500);
      } else {
        alert("خطا در ذخیره کد رهگیری.");
      }
    } catch {
      alert("خطای سرور.");
    } finally {
      setSavingTrackingId(null);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders?orderId=${encodeURIComponent(orderToDelete.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderToDelete.id));
        setOrderToDelete(null);
      } else {
        alert(data.message || "خطا در حذف سفارش.");
      }
    } catch {
      alert("خطای سرور در برقراری ارتباط.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSampleOrders = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleteSampleOrders: true }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders((prev) =>
          prev.filter(
            (o) =>
              !o.customerName.includes("نمونه") &&
              !o.customerName.includes("تستی") &&
              !o.customerName.includes("آزمایشی") &&
              !o.orderNumber.startsWith("SH-TEST") &&
              !o.orderNumber.startsWith("SAMPLE")
          )
        );
        setShowDeleteSampleModal(false);
        alert(data.message || "سفارش‌های نمونه با موفقیت پاکسازی شدند.");
      } else {
        alert(data.message || "خطا در حذف سفارش‌های نمونه.");
      }
    } catch {
      alert("خطای سرور در برقراری ارتباط.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAllOrders = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleteAllOrders: true }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders([]);
        setShowDeleteAllOrdersModal(false);
        alert(data.message || "تمامی سفارشات سیستم با موفقیت پاکسازی شدند.");
      } else {
        alert(data.message || "خطا در حذف تمامی سفارشات.");
      }
    } catch {
      alert("خطای سرور در برقراری ارتباط.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportExcel = () => {
    if (orders.length === 0) {
      alert("سفارشی برای خروجی اکسل وجود ندارد.");
      return;
    }

    // CSV Headers
    const headers = [
      "شماره فاکتور",
      "تاریخ ثبت",
      "نام مشتری",
      "شماره تماس",
      "استان",
      "شهر",
      "کد پستی",
      "آدرس کامل",
      "نوع فاکتور",
      "نام شرکت",
      "شناسه ملی",
      "کد اقتصادی",
      "اقلام سفارش",
      "روش ارسال",
      "هزینه ارسال (تومان)",
      "روش پرداخت",
      "وضعیت پرداخت",
      "وضعیت سفارش",
      "کد رهگیری پستی / اسنپ",
      "جمع اقلام (تومان)",
      "تخفیف (تومان)",
      "مبلغ کل فاکتور (تومان)",
      "یادداشت سفارش",
    ];

    // CSV Rows
    const rows = orders.map((o) => {
      const itemsText = o.items
        ? o.items.map((i) => `${i.productName} (${i.quantity} عدد)`).join(" + ")
        : "";

      const shippingText =
        o.shippingMethod === "isfahan_express"
          ? "پیک اختصاصی نجف‌آباد/اصفهان"
          : o.shippingMethod === "tipax"
          ? "تیپاکس"
          : "پست پیشتاز";

      const orderStatusText =
        o.orderStatus === "DELIVERED"
          ? "تحویل شده"
          : o.orderStatus === "SHIPPED"
          ? "ارسال شده با پیک/پست"
          : o.orderStatus === "PROCESSING"
          ? "در حال آماده‌سازی انبار"
          : "ثبت اولیه";

      const paymentStatusText =
        o.paymentStatus === "PAID" ? "پرداخت شده" : "در انتظار پرداخت";

      const dateStr = formatJalaliDateTime(o.createdAt);

      return [
        o.orderNumber,
        dateStr,
        o.customerName,
        o.customerPhone,
        o.province || "اصفهان",
        o.city || "نجف‌آباد",
        o.postalCode || "",
        `"${(o.address || "").replace(/"/g, '""')}"`,
        o.isCorporate ? "حقوقی (شرکتی)" : "حقیقی",
        o.companyName || "",
        o.nationalCode || "",
        o.economicCode || "",
        `"${itemsText.replace(/"/g, '""')}"`,
        shippingText,
        o.shippingCost || 0,
        o.paymentMethod || "online",
        paymentStatusText,
        orderStatusText,
        o.trackingCode || "",
        o.subtotal || o.totalAmount,
        o.discount || 0,
        o.totalAmount,
        `"${(o.notes || "").replace(/"/g, '""')}"`,
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const timestamp = new Date().toISOString().slice(0, 10);
    link.setAttribute("download", `shiasi_orders_report_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        !search ||
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.customerPhone.includes(search) ||
        (o.trackingCode && o.trackingCode.includes(search));

      let matchTab = true;
      if (statusTab === "PENDING_PAYMENT") matchTab = o.paymentStatus === "PENDING";
      else if (statusTab === "PROCESSING") matchTab = o.orderStatus === "PROCESSING";
      else if (statusTab === "SHIPPED") matchTab = o.orderStatus === "SHIPPED";
      else if (statusTab === "DELIVERED") matchTab = o.orderStatus === "DELIVERED";

      return matchSearch && matchTab;
    });
  }, [orders, search, statusTab]);

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Metrics Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <span>مدیریت سفارشات، ارسال و فاکتورها</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            هماهنگی ارسال مرسوله‌ها در نجف‌آباد و اصفهان، تخصیص بارکد پستی و چاپ فاکتور رسمی
          </p>
        </div>

        {/* Action Buttons Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Bulk Delete Sample Orders Button */}
          <button
            type="button"
            onClick={() => setShowDeleteSampleModal(true)}
            className="bg-rose-900/40 hover:bg-rose-800/80 text-rose-300 border border-rose-700/60 font-bold text-xs px-3.5 py-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm"
            title="حذف سفارش‌های تستی و پیش‌فرض"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>حذف سفارش‌های تستی / نمونه</span>
          </button>

          {/* Bulk Delete All Orders Button */}
          <button
            type="button"
            onClick={() => setShowDeleteAllOrdersModal(true)}
            className="bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-600/80 font-bold text-xs px-3.5 py-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm hover:shadow-rose-950/40"
            title="حذف و پاکسازی کامل تمامی سفارش‌های موجود در کل پایگاه داده"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>حذف تمامی سفارش‌های سیستم</span>
          </button>

          {/* Export Excel / CSV Button */}
          <button
            type="button"
            onClick={handleExportExcel}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer shrink-0"
            title="دانلود فایل اکسل و CSV کامل تمامی سفارش‌ها"
          >
            <FileSpreadsheet className="w-4 h-4 text-white" />
            <span>خروجی اکسل / CSV سفارشات</span>
            <Download className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </div>

      {/* 4 Financial & Logistics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Metric 1: Revenue */}
        <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold">فروش تسویه شده:</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-black text-white font-mono">{formatToman(metrics.paidRevenue)}</p>
          <span className="text-[10px] text-emerald-400 font-bold block">
            {toPersianDigits(orders.filter((o) => o.paymentStatus === "PAID").length)} تراکنش موفق بانکی
          </span>
        </div>

        {/* Metric 2: In Warehouse Preparation */}
        <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold">در حال آماده‌سازی انبار:</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-black text-amber-400 font-mono">{toPersianDigits(metrics.inWarehouseCount)} سفارش</p>
          <span className="text-[10px] text-amber-300/80 font-medium block">
            بسته‌بندی و تخصیص قطعات
          </span>
        </div>

        {/* Metric 3: Active Shipments */}
        <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold">تحویل به پیک و پست:</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Truck className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-black text-blue-400 font-mono">{toPersianDigits(metrics.shippedCount)} مرسوله</p>
          <span className="text-[10px] text-blue-300/80 font-medium block">
            در مسیر تحویل به خریدار
          </span>
        </div>

        {/* Metric 4: Total Orders */}
        <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold">کل سفارش‌های ثبت‌شده:</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-black text-white font-mono">{toPersianDigits(metrics.totalCount)} سفارش</p>
          <span className="text-[10px] text-purple-400 font-medium block">
            شامل فاکتورهای رسمی و عادی
          </span>
        </div>

      </div>

      {/* 2. Filter / Search & Sliding Status Tabs */}
      <div className="bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی شماره سفارش، نام خریدار، شماره تماس، کد رهگیری پستی یا اسنپ..."
            className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl pr-9 pl-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
        </div>

        {/* Sliding Status Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80 text-xs">
          {[
            { id: "ALL", label: "همه سفارش‌ها", count: orders.length },
            {
              id: "PROCESSING",
              label: "در حال پردازش انبار",
              count: orders.filter((o) => o.orderStatus === "PROCESSING").length,
            },
            {
              id: "SHIPPED",
              label: "ارسال شده با پیک/پست",
              count: orders.filter((o) => o.orderStatus === "SHIPPED").length,
            },
            {
              id: "PENDING_PAYMENT",
              label: "در انتظار پرداخت",
              count: orders.filter((o) => o.paymentStatus === "PENDING").length,
            },
            {
              id: "DELIVERED",
              label: "تحویل نهایی",
              count: orders.filter((o) => o.orderStatus === "DELIVERED").length,
            },
          ].map((tab) => {
            const isActive = statusTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                  isActive
                    ? "bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black ${
                    isActive ? "bg-slate-950 text-amber-400" : "bg-slate-900 text-slate-400"
                  }`}
                >
                  {toPersianDigits(tab.count)}
                </span>
              </button>
            );
          })}

          <span className="mr-auto text-[11px] font-mono text-slate-400">
            {toPersianDigits(filteredOrders.length)} سفارش مطابق فیلتر
          </span>
        </div>
      </div>

      {/* 3. Orders List with Visual Timeline Stepper */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-slate-900 rounded-3xl p-10 border border-slate-800 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="font-black text-sm text-white">سفارشی با مشخصات مورد نظر یافت نشد</h3>
            <p className="text-xs text-slate-400">می‌توانید عبارت جستجو یا تب فیلتر را تغییر دهید.</p>
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const currentTracking =
              trackingInputs[ord.id] !== undefined
                ? trackingInputs[ord.id]
                : ord.trackingCode || "";

            // Timeline status index: 0 = PENDING, 1 = PROCESSING, 2 = SHIPPED, 3 = DELIVERED
            const statusOrder = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
            const currentStepIdx = Math.max(0, statusOrder.indexOf(ord.orderStatus));

            return (
              <div
                key={ord.id}
                className="bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-5 hover:border-slate-700 transition-all duration-200 shadow-xl animate-in fade-in slide-in-from-bottom-2"
              >
                
                {/* Order Top Summary Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    
                    {/* Order Number with Copy */}
                    <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-xl">
                      <span className="font-mono font-black text-xs sm:text-sm text-amber-400">
                        {ord.orderNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(ord.orderNumber, `ord-${ord.id}`)}
                        className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                        title="کپی شماره سفارش"
                      >
                        {copiedCode === `ord-${ord.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <span className="text-[11px] text-slate-400 font-medium">
                      {formatJalaliDateTime(ord.createdAt)}
                    </span>

                    {/* Payment Status with 1-Click Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        const nextPay = ord.paymentStatus === "PAID" ? "PENDING" : "PAID";
                        handleUpdateStatus(ord.id, ord.orderStatus, ord.trackingCode || undefined, nextPay);
                      }}
                      className={`text-[10px] font-black px-2.5 py-1 rounded-xl border flex items-center gap-1 transition-all cursor-pointer ${
                        ord.paymentStatus === "PAID"
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-800 hover:bg-emerald-900"
                          : "bg-amber-950/80 text-amber-300 border-amber-800 hover:bg-amber-900"
                      }`}
                      title="کلیک برای تغییر وضعیت پرداخت"
                    >
                      {ord.paymentStatus === "PAID" ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>پرداخت شده</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>در انتظار پرداخت (تغییر)</span>
                        </>
                      )}
                    </button>

                    {/* Corporate Invoice Badge */}
                    {ord.isCorporate && (
                      <span className="bg-purple-950/80 text-purple-300 border border-purple-800 text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        <span>فاکتور رسمی حقوقی</span>
                      </span>
                    )}
                  </div>

                  {/* Actions: WhatsApp + Print Invoice */}
                  <div className="flex items-center gap-2">
                    {ord.customerPhone && (
                      <a
                        href={`https://wa.me/98${ord.customerPhone.replace(/^0/, "")}?text=${encodeURIComponent(
                          `سلام ${ord.customerName} عزیز،\nوضعیت سفارش شما به شماره ${ord.orderNumber} در فروشگاه و کارگاه برق شیاسی:\n📦 وضعیت: ${
                            ord.orderStatus === "DELIVERED"
                              ? "تحویل شده"
                              : ord.orderStatus === "SHIPPED"
                              ? "ارسال شده با پیک/پست"
                              : "در حال آماده‌سازی انبار"
                          }${ord.trackingCode ? `\nکد رهگیری: ${ord.trackingCode}` : ""}\nتلفن واحد پشتیبانی: ۰۳۱-۴۲۶۲۶۱۱۶`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-600/40 flex items-center gap-1.5 transition-all cursor-pointer"
                        title="ارسال پیام هماهنگی در واتساپ"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">واتساپ خریدار</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedOrder(ord)}
                      className="bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-slate-950 text-xs font-bold px-3.5 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>مشاهده و چاپ فاکتور</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderToDelete(ord)}
                      className="bg-rose-500/15 hover:bg-rose-600 text-rose-400 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-rose-500/30 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                      title="حذف دائمی این سفارش"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">حذف</span>
                    </button>
                  </div>
                </div>

                {/* Visual Order Fulfillment Stepper */}
                <div className="bg-slate-850/60 p-3.5 rounded-2xl border border-slate-800/80">
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs font-bold">
                    
                    {/* Step 1: Registered */}
                    <div className={`space-y-1 ${currentStepIdx >= 0 ? "text-amber-400" : "text-slate-500"}`}>
                      <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center ${currentStepIdx >= 0 ? "bg-amber-500 text-slate-950 font-black shadow-xs shadow-amber-500/40" : "bg-slate-800 text-slate-500"}`}>
                        ۱
                      </div>
                      <span>ثبت سفارش</span>
                    </div>

                    {/* Step 2: Processing in Warehouse */}
                    <div className={`space-y-1 ${currentStepIdx >= 1 ? "text-amber-400" : "text-slate-500"}`}>
                      <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center ${currentStepIdx >= 1 ? "bg-amber-500 text-slate-950 font-black shadow-xs shadow-amber-500/40" : "bg-slate-800 text-slate-500"}`}>
                        ۲
                      </div>
                      <span>آماده‌سازی انبار</span>
                    </div>

                    {/* Step 3: Shipped via Courier/Post */}
                    <div className={`space-y-1 ${currentStepIdx >= 2 ? "text-blue-400" : "text-slate-500"}`}>
                      <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center ${currentStepIdx >= 2 ? "bg-blue-500 text-white font-black shadow-xs shadow-blue-500/40 animate-pulse" : "bg-slate-800 text-slate-500"}`}>
                        ۳
                      </div>
                      <span>تحویل به پیک/پست</span>
                    </div>

                    {/* Step 4: Delivered */}
                    <div className={`space-y-1 ${currentStepIdx >= 3 ? "text-emerald-400" : "text-slate-500"}`}>
                      <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center ${currentStepIdx >= 3 ? "bg-emerald-500 text-white font-black shadow-xs shadow-emerald-500/40" : "bg-slate-800 text-slate-500"}`}>
                        ۴
                      </div>
                      <span>تحویل مشتری</span>
                    </div>

                  </div>
                </div>

                {/* Customer & Address Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1 bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">تحویل‌گیرنده:</span>
                    <strong className="text-white block font-bold text-sm">{ord.customerName}</strong>
                    <a
                      href={`tel:${ord.customerPhone}`}
                      className="text-amber-400 font-mono font-bold hover:underline block text-xs"
                    >
                      {toPersianDigits(ord.customerPhone)}
                    </a>
                  </div>

                  <div className="space-y-1 sm:col-span-2 bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 block text-[11px]">
                        آدرس ارسال ({ord.city || "نجف‌آباد"}):
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg border border-slate-700 font-bold">
                        روش ارسال: {ord.shippingMethod === "isfahan_express" ? "پیک اختصاصی نجف‌آباد/اصفهان" : ord.shippingMethod === "tipax" ? "تیپاکس" : "پست پیشتاز"}
                      </span>
                    </div>
                    <p className="text-slate-200 leading-relaxed font-medium pt-0.5">{ord.address}</p>
                    {ord.notes && (
                      <p className="text-[11px] text-amber-300/90 pt-1 font-medium">یادداشت سفارش: {ord.notes}</p>
                    )}
                    {ord.isCorporate && ord.companyName && (
                      <div className="pt-1.5 border-t border-slate-700/60 flex flex-wrap gap-3 text-[10px] text-purple-300">
                        <span>شرکت: <strong>{ord.companyName}</strong></span>
                        {ord.nationalCode && <span>شناسه ملی: <strong className="font-mono">{toPersianDigits(ord.nationalCode)}</strong></span>}
                        {ord.economicCode && <span>کداقتصادی: <strong className="font-mono">{toPersianDigits(ord.economicCode)}</strong></span>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Items Summary & Financial Total */}
                <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-800 text-xs flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-slate-400 text-[11px]">اقلام فاکتور:</span>
                    {ord.items?.map((item) => (
                      <span
                        key={item.id}
                        className="bg-slate-900 text-slate-200 px-2.5 py-1 rounded-xl border border-slate-750 font-bold text-[11px]"
                      >
                        {item.productName} ({toPersianDigits(item.quantity)} عدد)
                      </span>
                    ))}
                  </div>

                  <div className="font-black text-sm text-white font-mono">
                    مجموع کل: <span className="text-amber-400 font-bold">{formatToman(ord.totalAmount)}</span>
                  </div>
                </div>

                {/* Status Change & Tracking Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
                  
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-slate-400 shrink-0 font-medium">تغییر وضعیت:</span>
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleUpdateStatus(ord.id, e.target.value, ord.trackingCode || undefined)}
                      disabled={updatingId === ord.id}
                      className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-amber-500 font-bold w-full sm:w-auto transition-colors"
                    >
                      <option value="PENDING">ثبت اولیه (PENDING)</option>
                      <option value="PROCESSING">در حال آماده‌سازی انبار (PROCESSING)</option>
                      <option value="SHIPPED">ارسال شده با پیک/پست (SHIPPED)</option>
                      <option value="DELIVERED">تحویل نهایی به مشتری (DELIVERED)</option>
                    </select>
                  </div>

                  {/* Tracking Code Input + Save Button + Copy */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <input
                        type="text"
                        value={currentTracking}
                        onChange={(e) =>
                          setTrackingInputs({
                            ...trackingInputs,
                            [ord.id]: e.target.value,
                          })
                        }
                        placeholder="کد رهگیری اسنپ‌باکس / تیپاکس / پست"
                        className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl pr-3 pl-8 py-2 font-mono w-full focus:ring-2 focus:ring-amber-500"
                      />
                      {currentTracking && (
                        <button
                          type="button"
                          onClick={() => handleCopy(currentTracking, `track-${ord.id}`)}
                          className="absolute left-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                          title="کپی کد رهگیری"
                        >
                          {copiedCode === `track-${ord.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveTracking(ord.id, ord.orderStatus)}
                      disabled={savingTrackingId === ord.id}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1 active:scale-95 cursor-pointer shrink-0"
                      title="ذخیره کد رهگیری در دیتابیس"
                    >
                      {savingTrackingId === ord.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : savedTrackingId === ord.id ? (
                        <CheckCheck className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      <span className="hidden sm:inline">ذخیره کد</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Printable Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 no-print">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">
                    پیش‌فاکتور رسمی سفارش <span className="font-mono text-amber-400">{selectedOrder.orderNumber}</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    تاریخ صدور: {formatJalaliDateTime(selectedOrder.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>پرینت فاکتور A4</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Document Body */}
            <div id="printable-invoice" className="bg-white rounded-2xl p-6 text-slate-900 space-y-5 border border-slate-200 font-sans">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950">
                    <Zap className="w-6 h-6 fill-slate-950" />
                  </div>
                  <div>
                    <h2 className="font-black text-base text-slate-950">فروشگاه شیاسی</h2>
                    <span className="text-xs text-slate-600 block">
                      اصفهان، نجف‌آباد، ۱۵ خرداد مرکزی، نبش بن‌بست نرگس | تلفن: <bdi dir="ltr">۰۳۱-۴۲۶۲۶۱۱۶</bdi> - <bdi dir="ltr">۰۳۱-۴۲۶۲۶۱۰۷</bdi> | همراه: <bdi dir="ltr">۰۹۱۳۶۲۶۰۰۷۲</bdi>
                    </span>
                  </div>
                </div>

                <div className="text-left text-xs font-mono">
                  <strong>شماره فاکتور: {selectedOrder.orderNumber}</strong>
                  <p className="text-slate-500 font-sans text-[11px]">{formatJalaliDateTime(selectedOrder.createdAt)}</p>
                </div>
              </div>

              {/* Customer Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500">خریدار:</span>{" "}
                  <strong>{selectedOrder.customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">شماره تماس:</span>{" "}
                  <strong className="font-mono">{toPersianDigits(selectedOrder.customerPhone)}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">آدرس تحویل ({selectedOrder.city}):</span>{" "}
                  <span>{selectedOrder.address}</span>
                </div>
                {selectedOrder.isCorporate && selectedOrder.companyName && (
                  <div className="col-span-2 pt-2 border-t border-slate-200 flex flex-wrap gap-4 text-purple-900 font-bold">
                    <span>شرکت: {selectedOrder.companyName}</span>
                    {selectedOrder.nationalCode && <span>شناسه ملی: {toPersianDigits(selectedOrder.nationalCode)}</span>}
                    {selectedOrder.economicCode && <span>کداقتصادی: {toPersianDigits(selectedOrder.economicCode)}</span>}
                  </div>
                )}
              </div>

              {/* Items Table */}
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-slate-100 border border-slate-300 text-slate-700">
                    <th className="p-2.5 border border-slate-300">ردیف</th>
                    <th className="p-2.5 border border-slate-300">شرح کالا / قطعه الکتریکی</th>
                    <th className="p-2.5 border border-slate-300 text-center">تعداد</th>
                    <th className="p-2.5 border border-slate-300 text-left">مبلغ واحد (تومان)</th>
                    <th className="p-2.5 border border-slate-300 text-left">جمع کل (تومان)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, idx) => (
                    <tr key={item.id} className="border border-slate-300">
                      <td className="p-2.5 border border-slate-300 font-mono text-center">{toPersianDigits(idx + 1)}</td>
                      <td className="p-2.5 border border-slate-300 font-bold">{item.productName}</td>
                      <td className="p-2.5 border border-slate-300 text-center font-mono font-bold">{toPersianDigits(item.quantity)}</td>
                      <td className="p-2.5 border border-slate-300 text-left font-mono">{formatToman(item.price)}</td>
                      <td className="p-2.5 border border-slate-300 text-left font-mono font-bold">{formatToman(item.total || item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Summary */}
              <div className="flex justify-end text-xs">
                <div className="w-64 space-y-1.5 p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium">
                  <div className="flex justify-between">
                    <span>جمع اقلام:</span>
                    <span className="font-mono font-bold">{formatToman(selectedOrder.subtotal || selectedOrder.totalAmount)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>تخفیف:</span>
                      <span className="font-mono font-bold">- {formatToman(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black pt-1 border-t border-slate-300 text-slate-950">
                    <span>مبلغ نهایی فاکتور:</span>
                    <span className="font-mono text-amber-600">{formatToman(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Footer Stamp & Sign */}
              <div className="pt-6 border-t border-slate-300 flex justify-between text-xs text-slate-500">
                <p>مهر و امضای فروشگاه و کارگاه شیاسی</p>
                <p>امضای تحویل‌گیرنده</p>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Modal 1: Single Order Deletion Confirmation */}
      <ConfirmDeleteModal
        isOpen={Boolean(orderToDelete)}
        onClose={() => setOrderToDelete(null)}
        onConfirm={handleDeleteOrder}
        title="تایید حذف دائمی سفارش"
        description={
          orderToDelete
            ? `آیا از حذف دائمی سفارش شماره ${orderToDelete.orderNumber} مربوط به خریدار ${orderToDelete.customerName} به مبلغ ${formatToman(orderToDelete.totalAmount)} اطمینان دارید؟ کلیه اقلام فاکتور و سوابق مالی مرتبط به طور قطعی از پایگاه داده حذف خواهند شد.`
            : undefined
        }
        itemCount={1}
        itemType="سفارش خرید"
        isPurge={true}
        isLoading={isDeleting}
      />

      {/* Modal 2: Bulk Sample Orders Deletion Confirmation */}
      <ConfirmDeleteModal
        isOpen={showDeleteSampleModal}
        onClose={() => setShowDeleteSampleModal(false)}
        onConfirm={handleDeleteSampleOrders}
        title="حذف سفارش‌های تستی و نمونه"
        description="آیا از پاکسازی تمامی سفارش‌های آزمایشی، نمونه و دمو اطمینان دارید؟ سفارش‌های مشتریان واقعی دست‌نخورده باقی خواهند ماند."
        itemCount={10}
        itemType="سفارش تستی"
        isPurge={true}
        isLoading={isDeleting}
      />

      {/* Modal 3: Total System Orders Purge Confirmation */}
      <ConfirmDeleteModal
        isOpen={showDeleteAllOrdersModal}
        onClose={() => setShowDeleteAllOrdersModal(false)}
        onConfirm={handleDeleteAllOrders}
        title="پاکسازی کامل تمامی سفارش‌های سیستم"
        description="هشدار حیاتی: شما در حال حذف کامل تمامی سفارش‌های موجود در پایگاه داده هستید. تمام اقلام فاکتور، سوابق پرداختی و کدهای رهگیری برای همیشه پاکسازی خواهند شد. برای تایید نهایی حتماً عبارت «حذف» را تایپ کنید."
        itemCount={orders.length > 0 ? orders.length : 10}
        itemType="سفارش کل سیستم"
        isPurge={true}
        isLoading={isDeleting}
        alwaysRequireTyping={true}
      />

    </div>
  );
}
