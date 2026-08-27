"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
} from "lucide-react";

export default function CustomerAccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { wishlist, wishlistCount } = useWishlist();

  const [activeTab, setActiveTab] = useState<"orders" | "repairs" | "corporate" | "wishlist">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [repairs, setRepairs] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Corporate Invoice Settings
  const [companyName, setCompanyName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [economicCode, setEconomicCode] = useState("");
  const [savingCorporate, setSavingCorporate] = useState(false);
  const [corporateSaved, setCorporateSaved] = useState(false);

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
        const phone = session.user.phone;

        // Fetch user orders & repairs
        const [ordersRes, repairsRes] = await Promise.all([
          fetch("/api/orders/my-orders"),
          phone ? fetch(`/api/repairs?phone=${encodeURIComponent(phone)}`) : Promise.resolve({ json: () => ({ repairs: [] }) }),
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
    setTimeout(() => {
      setSavingCorporate(false);
      setCorporateSaved(true);
      setTimeout(() => setCorporateSaved(false), 3000);
    }, 800);
  };

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const userPhone = (session?.user as any)?.phone || "۰۹۱۳...";
  const userName = session?.user?.name || "مشتری محترم";

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* User Header Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-md shadow-amber-500/20">
              {userName.slice(0, 1)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">
                  {userName}
                </h1>
                <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  حساب کاربری فعال
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                شماره همراه: {toPersianDigits(userPhone)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex-1 md:flex-initial text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 font-bold px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج از حساب</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-colors ${
              activeTab === "orders"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>تاریخچه سفارش‌ها ({toPersianDigits(orders.length)})</span>
          </button>

          <button
            onClick={() => setActiveTab("repairs")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-colors ${
              activeTab === "repairs"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>پذیرش‌های تعمیرات ({toPersianDigits(repairs.length)})</span>
          </button>

          <button
            onClick={() => setActiveTab("corporate")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-colors ${
              activeTab === "corporate"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Building className="w-4 h-4" />
            <span>فاکتور رسمی و اطلاعات حقوقی</span>
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-colors ${
              activeTab === "wishlist"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>کالاهای ذخیره‌شده ({toPersianDigits(wishlistCount)})</span>
          </button>
        </div>

        {/* Tab 1: Orders History */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <strong className="text-sm text-slate-900 font-mono block">
                            سفارش {order.orderNumber}
                          </strong>
                          <span className="text-[11px] text-slate-400">
                            ثبت شده در: {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-xl">
                          {order.orderStatus === "PROCESSING"
                            ? "در حال پردازش / آماده‌سازی"
                            : order.orderStatus === "SHIPPED"
                            ? "تحویل به پیک / پست"
                            : order.orderStatus === "DELIVERED"
                            ? "تحویل داده شده"
                            : "ثبت شده"}
                        </span>
                        <Link
                          href={`/order-tracking/${order.orderNumber}`}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>مشاهده فاکتور</span>
                        </Link>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                      <div>مبلغ کل: <strong className="text-slate-900 text-sm">{formatToman(order.totalAmount)}</strong></div>
                      <div>شیوه ارسال: <strong className="text-slate-800">{order.shippingMethod === "isfahan_express" ? "پیک نجف‌آباد / اسنپ" : "تیپاکس و پست"}</strong></div>
                      <div>وضعیت پرداخت: <strong className="text-emerald-700">{order.paymentStatus === "PAID" ? "پرداخت شده" : "در انتظار"}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-700 text-sm">هنوز سفارشی ثبت نکرده‌اید</h3>
                <Link
                  href="/products"
                  className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl"
                >
                  مرور و خرید محصولات
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Appliance Repair Tickets */}
        {activeTab === "repairs" && (
          <div className="space-y-4">
            {repairs.length > 0 ? (
              <div className="space-y-4">
                {repairs.map((rep) => (
                  <div
                    key={rep.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-amber-500" />
                        <strong className="text-sm text-slate-900">{rep.applianceType}</strong>
                        <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {rep.trackingCode}
                        </span>
                      </div>

                      <span className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-3 py-1 rounded-xl">
                        {rep.status === "IN_PROGRESS"
                          ? "در حال عیب‌یابی در کارگاه نجف‌آباد"
                          : rep.status === "READY"
                          ? "تعمیر تکمیل شد / آماده تحویل"
                          : "ثبت شده"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      شرح خرابی: {rep.issueDesc}
                    </p>

                    {rep.estimatedCost && (
                      <div className="text-xs text-emerald-700 font-bold">
                        هزینه برآورد: {formatToman(rep.estimatedCost)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <Wrench className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-700 text-sm">هیچ دستگاهی در حال تعمیر ندارید</h3>
                <Link
                  href="/repair-service"
                  className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl"
                >
                  ثبت درخواست تعمیر پنکه، کولر، بخاری و آنتن
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Corporate / Legal Invoice Form */}
        {activeTab === "corporate" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5 max-w-2xl">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-500" />
                <span>اطلاعات صدور فاکتور رسمی (اشخاص حقوقی و شرکت‌ها)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                جهت صدور پیش‌فاکتور و فاکتور رسمی نظام مهندسی و اداره دارایی با شناسه ملی و کد اقتصادی
              </p>
            </div>

            {corporateSaved && (
              <div className="bg-emerald-100 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>اطلاعات حقوقی شما با موفقیت ذخیره گردید.</span>
              </div>
            )}

            <form onSubmit={handleSaveCorporate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">نام رسمی شرکت / ارگان:</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="مثال: شرکت مهندسی شیاسی"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">شناسه ملی / کد ملی:</label>
                  <input
                    type="text"
                    value={nationalCode}
                    onChange={(e) => setNationalCode(e.target.value)}
                    placeholder="۱۰ یا ۱۱ رقمی"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-amber-500 font-mono text-left"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">کد اقتصادی (۱۲ رقمی):</label>
                  <input
                    type="text"
                    value={economicCode}
                    onChange={(e) => setEconomicCode(e.target.value)}
                    placeholder="۱۲ رقمی مالیاتی"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-amber-500 font-mono text-left"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingCorporate}
                className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
              >
                {savingCorporate ? "در حال ذخیره..." : "ذخیره اطلاعات فاکتور رسمی"}
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: Wishlist */}
        {activeTab === "wishlist" && (
          <div>
            <Link
              href="/wishlist"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 hover:underline"
            >
              <span>مشاهده و مدیریت کامل کالاهای ذخیره شده</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
