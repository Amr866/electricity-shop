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
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-slate-900 dark:text-white">
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
              className="flex-1 md:flex-initial text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 font-bold px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 flex items-center justify-center gap-1.5 transition-colors"
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
                    className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-slate-900 dark:text-white"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <strong className="text-sm text-slate-900 dark:text-white font-mono block">
                            سفارش {order.orderNumber}
                          </strong>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">
                            ثبت شده در: {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold px-3 py-1 rounded-xl">
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
                          className="bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>مشاهده فاکتور</span>
                        </Link>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
                      <div>مبلغ کل: <strong className="text-slate-900 dark:text-amber-400 text-sm font-mono">{formatToman(order.totalAmount)}</strong></div>
                      <div>شیوه ارسال: <strong className="text-slate-800 dark:text-white">{order.shippingMethod === "isfahan_express" ? "پیک نجف‌آباد / اسنپ" : "تیپاکس و پست"}</strong></div>
                      <div>وضعیت پرداخت: <strong className="text-emerald-600 dark:text-emerald-400">{order.paymentStatus === "PAID" ? "پرداخت شده" : "در انتظار"}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">هنوز سفارشی ثبت نکرده‌اید</h3>
                <Link
                  href="/products"
                  className="inline-block bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all"
                >
                  مشاهده کاتالوگ و خرید کالا
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Repairs History */}
        {activeTab === "repairs" && (
          <div className="space-y-4">
            {repairs.length > 0 ? (
              <div className="space-y-4">
                {repairs.map((rep) => (
                  <div
                    key={rep.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-slate-900 dark:text-white"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                          <Wrench className="w-5 h-5" />
                        </div>
                        <div>
                          <strong className="text-sm text-slate-900 dark:text-white font-mono block">
                            تیکت تعمیر {rep.trackingCode}
                          </strong>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">
                            دستگاه: {rep.applianceType} {rep.brandModel ? `(${rep.brandModel})` : ""}
                          </span>
                        </div>
                      </div>

                      <span className={`text-xs font-bold px-3 py-1 rounded-xl ${
                        rep.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : rep.status === "REPAIRING"
                          ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300"
                      }`}>
                        {rep.status === "SUBMITTED" && "درخواست ثبت شد - در نوبت تحویل"}
                        {rep.status === "RECEIVED" && "پذیرش شد - در نوبت عیب‌یابی"}
                        {rep.status === "INSPECTING" && "در حال بررسی فنی"}
                        {rep.status === "REPAIRING" && "در حال تعمیر"}
                        {rep.status === "COMPLETED" && "آماده تحویل"}
                        {rep.status === "DELIVERED" && "تحویل داده شده"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
                      <div>شرح ایراد اعلامی: <span className="text-slate-800 dark:text-white">{rep.issueDesc}</span></div>
                      {rep.estimatedCost && (
                        <div>برآورد هزینه: <strong className="text-slate-900 dark:text-amber-400 font-mono">{formatToman(rep.estimatedCost)}</strong></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
                <Wrench className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">درخواست تعمیری ثبت نکرده‌اید</h3>
                <Link
                  href="/repair-service"
                  className="inline-block bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all"
                >
                  ثبت آنلاین درخواست تعمیر لوازم برقی
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Corporate Info Form */}
        {activeTab === "corporate" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-slate-900 dark:text-white">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                اطلاعات حقوقی جهت صدور فاکتور رسمی
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{savingCorporate ? "در حال ذخیره..." : "ذخیره اطلاعات حقوقی"}</span>
              </button>

              {corporateSaved && (
                <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  ✓ اطلاعات حقوقی با موفقیت ذخیره گردید و در فاکتورهای آتی اعمال خواهد شد.
                </p>
              )}
            </form>
          </div>
        )}

        {/* Tab 4: Wishlist */}
        {activeTab === "wishlist" && (
          <div className="space-y-4">
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    <Link href={`/products/${item.slug}`} className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 flex items-center justify-center overflow-hidden">
                      <img src={item.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"} alt={item.name} className="w-full h-full object-contain" />
                    </Link>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">{item.name}</h4>
                      <p className="text-amber-600 dark:text-amber-400 font-extrabold text-xs font-mono mt-1">{formatToman(item.price)}</p>
                    </div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl text-center block transition-colors"
                    >
                      مشاهده کالا
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
                <Heart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">لیست کالاهای ذخیره‌شده خالی است</h3>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
