"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";
import { formatToman, toPersianDigits } from "@/lib/utils";
import {
  User,
  Package,
  Wrench,
  Heart,
  FileText,
  LogOut,
  Truck,
  ShieldCheck,
  Building,
  Phone,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ShoppingBag,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  totalAmount: number;
  shippingMethod: string;
  paymentStatus: string;
  orderStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | string;
}

export interface CustomerRepairTicket {
  id: string;
  trackingCode: string;
  applianceType: string;
  brandModel?: string | null;
  issueDesc: string;
  estimatedCost?: number | null;
  status: "SUBMITTED" | "RECEIVED" | "INSPECTING" | "REPAIRING" | "COMPLETED" | "DELIVERED" | string;
  createdAt?: string;
}

export default function CustomerAccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { wishlist, wishlistCount } = useWishlist();

  const [activeTab, setActiveTab] = useState<"orders" | "repairs" | "corporate" | "wishlist">("orders");
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [repairs, setRepairs] = useState<CustomerRepairTicket[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Corporate Invoice Settings
  const [companyName, setCompanyName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [economicCode, setEconomicCode] = useState("");
  const [savingCorporate, setSavingCorporate] = useState(false);
  const [corporateSaved, setCorporateSaved] = useState(false);

  // Load corporate data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("shiasi_corporate_info");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.companyName) setCompanyName(parsed.companyName);
        if (parsed.nationalCode) setNationalCode(parsed.nationalCode);
        if (parsed.economicCode) setEconomicCode(parsed.economicCode);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/account");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchData() {
      if (!session?.user) return;
      setLoadingData(true);
      try {
        const phone = (session.user as any).phone;

        // Fetch user orders & repairs
        const [ordersRes, repairsRes] = await Promise.all([
          fetch("/api/orders/my-orders"),
          phone ? fetch(`/api/repairs?phone=${encodeURIComponent(phone)}`) : Promise.resolve({ json: () => ({ repairs: [] }) } as any),
        ]);

        const ordersData = await ordersRes.json();
        const repairsData = await repairsRes.json();

        if (ordersData.orders) {
          setOrders(ordersData.orders);
        }
        if (repairsData.repairs) {
          setRepairs(repairsData.repairs);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingData(false);
      }
    }

    if (session?.user) {
      fetchData();
    }
  }, [session]);

  const handleSaveCorporate = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCorporate(true);

    try {
      localStorage.setItem(
        "shiasi_corporate_info",
        JSON.stringify({
          companyName: companyName.trim(),
          nationalCode: nationalCode.trim(),
          economicCode: economicCode.trim(),
        })
      );
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      setSavingCorporate(false);
      setCorporateSaved(true);
      setTimeout(() => setCorporateSaved(false), 3000);
    }, 500);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const userPhone = (session?.user as any)?.phone || "۰۹۱۳۶۲۶۰۰۷۲";
  const userName = session?.user?.name || "مشتری محترم";

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        
        {/* User Header Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-slate-900 dark:text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-amber-500 text-slate-950 font-black text-xl sm:text-2xl flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              {userName.slice(0, 1)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                  {userName}
                </h1>
                <span className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  حساب کاربری فعال
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono font-bold">
                شماره همراه: {toPersianDigits(userPhone)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="flex-1 md:flex-initial text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl border border-amber-400 shadow-sm shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>ورود به پنل مدیریت</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex-1 md:flex-initial text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 font-bold px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 flex items-center justify-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج از حساب</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-all active:scale-95 ${
              activeTab === "orders"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black scale-102"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-400"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>تاریخچه سفارش‌ها</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${activeTab === "orders" ? "bg-slate-950/20 text-slate-950" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
              {toPersianDigits(orders.length)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("repairs")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-all active:scale-95 ${
              activeTab === "repairs"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black scale-102"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-400"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>پذیرش‌های تعمیرات</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${activeTab === "repairs" ? "bg-slate-950/20 text-slate-950" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
              {toPersianDigits(repairs.length)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("corporate")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-all active:scale-95 ${
              activeTab === "corporate"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black scale-102"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-400"
            }`}
          >
            <Building className="w-4 h-4" />
            <span>فاکتور رسمی و اطلاعات حقوقی</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("wishlist")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-all active:scale-95 ${
              activeTab === "wishlist"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black scale-102"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-400"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>کالاهای ذخیره‌شده</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${activeTab === "wishlist" ? "bg-slate-950/20 text-slate-950" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
              {toPersianDigits(wishlistCount)}
            </span>
          </button>
        </div>

        {/* Tab 1: Orders History */}
        {activeTab === "orders" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 text-slate-900 dark:text-white hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-sm text-slate-900 dark:text-white font-mono font-black">
                              سفارش {order.orderNumber}
                            </strong>
                            <button
                              type="button"
                              onClick={() => handleCopy(order.orderNumber)}
                              className="text-slate-400 hover:text-amber-500 text-xs inline-flex items-center gap-0.5"
                              title="کپی شماره سفارش"
                            >
                              {copiedCode === order.orderNumber ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                            ثبت شده در: {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800 text-[11px] font-black px-3 py-1 rounded-xl flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>
                            {order.orderStatus === "PROCESSING"
                              ? "در حال پردازش / آماده‌سازی"
                              : order.orderStatus === "SHIPPED"
                              ? "تحویل به پیک / پست"
                              : order.orderStatus === "DELIVERED"
                              ? "تحویل داده شده"
                              : "ثبت شده"}
                          </span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          <a
                            href={`https://wa.me/989136260072?text=${encodeURIComponent(
                              `سلام، پیگیری سفارش شماره ${order.orderNumber} در فروشگاه شیاسی`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs p-2 rounded-xl transition-colors shadow-2xs"
                            title="پیگیری در واتساپ"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          <Link
                            href={`/order-tracking/${order.orderNumber}`}
                            className="bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1 shadow-2xs"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>مشاهده فاکتور</span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
                      <div>مبلغ کل: <strong className="text-slate-900 dark:text-amber-400 text-sm font-mono font-black">{formatToman(order.totalAmount)}</strong></div>
                      <div>شیوه ارسال: <strong className="text-slate-800 dark:text-white font-bold">{order.shippingMethod === "isfahan_express" ? "پیک نجف‌آباد / اسنپ" : "تیپاکس و پست"}</strong></div>
                      <div>وضعیت پرداخت: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{order.paymentStatus === "PAID" ? "پرداخت شده" : "در انتظار"}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm">
                <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <h3 className="font-black text-slate-700 dark:text-slate-300 text-sm">هنوز سفارشی ثبت نکرده‌اید</h3>
                <Link
                  href="/products"
                  className="inline-block bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-all hover-glow"
                >
                  مشاهده کاتالوگ و خرید کالا
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Repairs History */}
        {activeTab === "repairs" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {repairs.length > 0 ? (
              <div className="space-y-4">
                {repairs.map((rep) => (
                  <div
                    key={rep.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 text-slate-900 dark:text-white hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          <Wrench className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-sm text-slate-900 dark:text-white font-mono font-black">
                              تیکت تعمیر {rep.trackingCode}
                            </strong>
                            <button
                              type="button"
                              onClick={() => handleCopy(rep.trackingCode)}
                              className="text-slate-400 hover:text-amber-500 text-xs inline-flex items-center gap-0.5"
                              title="کپی کد رهگیری تعمیر"
                            >
                              {copiedCode === rep.trackingCode ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                            دستگاه: {rep.applianceType} {rep.brandModel ? `(${rep.brandModel})` : ""}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black px-3 py-1 rounded-xl flex items-center gap-1.5 ${
                          rep.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                            : rep.status === "REPAIRING"
                            ? "bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                            : "bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                          <span>
                            {rep.status === "SUBMITTED" && "درخواست ثبت شد - در نوبت تحویل"}
                            {rep.status === "RECEIVED" && "پذیرش شد - در نوبت عیب‌یابی"}
                            {rep.status === "INSPECTING" && "در حال بررسی فنی"}
                            {rep.status === "REPAIRING" && "در حال تعمیر در کارگاه"}
                            {rep.status === "COMPLETED" && "آماده تحویل در کارگاه"}
                            {rep.status === "DELIVERED" && "تحویل داده شده"}
                          </span>
                        </span>

                        <a
                          href={`https://wa.me/989136260072?text=${encodeURIComponent(
                            `سلام، پیگیری وضعیت تیکت تعمیر ${rep.trackingCode} (${rep.applianceType}) در کارگاه شیاسی`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs p-2 rounded-xl transition-colors shadow-2xs flex items-center gap-1"
                          title="هماهنگی تحویل در واتساپ"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">پیگیری در واتساپ</span>
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
                      <div>شرح ایراد اعلامی: <span className="text-slate-800 dark:text-white font-medium">{rep.issueDesc}</span></div>
                      {rep.estimatedCost && (
                        <div>برآورد هزینه: <strong className="text-slate-900 dark:text-amber-400 font-mono font-black">{formatToman(rep.estimatedCost)}</strong></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm">
                <Wrench className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <h3 className="font-black text-slate-700 dark:text-slate-300 text-sm">درخواست تعمیری ثبت نکرده‌اید</h3>
                <Link
                  href="/repair-service"
                  className="inline-block bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-all hover-glow"
                >
                  ثبت آنلاین درخواست تعمیر لوازم برقی
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Corporate Info Form with LocalStorage Persistence */}
        {activeTab === "corporate" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-6 text-slate-900 dark:text-white animate-in fade-in duration-200">
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                اطلاعات حقوقی جهت صدور فاکتور رسمی
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                برای شرکت‌ها، پیمانکاران و ارگان‌های دولتی جهت صدور فاکتور رسمی با کد اقتصادی معتبر
              </p>
            </div>

            <form onSubmit={handleSaveCorporate} className="space-y-4 max-w-xl text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  نام کامل شرکت / سازمان:
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="مثال: شرکت مهندسی برق آذرخش نجف‌آباد"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    شناسه ملی شرکت (۱۱ رقم):
                  </label>
                  <input
                    type="text"
                    value={nationalCode}
                    onChange={(e) => setNationalCode(e.target.value)}
                    placeholder="۱۰۱۰..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    کد اقتصادی:
                  </label>
                  <input
                    type="text"
                    value={economicCode}
                    onChange={(e) => setEconomicCode(e.target.value)}
                    placeholder="۱۲ رقمی"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingCorporate}
                className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95 hover-glow"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{savingCorporate ? "در حال ذخیره..." : "ذخیره اطلاعات حقوقی"}</span>
              </button>

              {corporateSaved && (
                <p className="text-emerald-600 dark:text-emerald-400 font-black text-xs animate-in fade-in">
                  ✓ اطلاعات حقوقی با موفقیت در حافظه مرورگر ذخیره گردید و در فاکتورهای رسمی شما اعمال خواهد شد.
                </p>
              )}
            </form>
          </div>
        )}

        {/* Tab 4: Wishlist with Electrical Fallbacks */}
        {activeTab === "wishlist" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-3 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300"
                  >
                    <Link
                      href={`/products/${item.slug}`}
                      className="relative aspect-square bg-slate-50 dark:bg-slate-800 rounded-2xl p-2 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700/60 group"
                    >
                      <Image
                        src={item.image || "/images/products/wal_172619-fans-7995865_1920.jpg"}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-contain p-2 group-hover:scale-108 transition-transform duration-300"
                      />
                    </Link>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-amber-600 dark:text-amber-400 font-black text-xs font-mono mt-1">
                        {formatToman(item.price)}
                      </p>
                    </div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl text-center block transition-all shadow-sm active:scale-95 hover-glow"
                    >
                      مشاهده و خرید کالا
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm">
                <Heart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <h3 className="font-black text-slate-700 dark:text-slate-300 text-sm">لیست کالاهای ذخیره‌شده خالی است</h3>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
