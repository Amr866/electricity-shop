import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatToman, toPersianDigits, formatJalaliDateTime } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  Truck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Zap,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const [
    totalOrdersCount,
    paidOrders,
    totalProductsCount,
    lowStockProducts,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({
      where: { paymentStatus: "PAID" },
      select: { totalAmount: true },
    }),
    prisma.product.count(),
    prisma.product.findMany({
      where: { stock: { lte: 5 } },
      take: 5,
    }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
  ]);

  const totalRevenue = paidOrders.reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>داشبورد وضعیت فروشگاه تخصصی شیاسی</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            گزارش عملکرد لحظه‌ای، وضعیت سفارش‌های نجف‌آباد و اصفهان و کنترل موجودی انبار
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/products"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            + افزودن کالا جدید
          </Link>
          <Link
            href="/admin/orders"
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-colors"
          >
            مدیریت و چاپ فاکتورها
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Revenue */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">مجموع فروش تسویه شده:</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-white">{formatToman(totalRevenue)}</p>
          <span className="text-[10px] text-emerald-400 font-semibold block">
            {toPersianDigits(paidOrders.length)} سفارش موفق بانکی
          </span>
        </div>

        {/* Orders Count */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">کل سفارشات ثبت شده:</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-white">{toPersianDigits(totalOrdersCount)} سفارش</p>
          <span className="text-[10px] text-slate-400 block">شامل پیک اصفهان و تیپاکس</span>
        </div>

        {/* Products Count */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">تنوع اقلام کاتالوگ:</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-white">{toPersianDigits(totalProductsCount)} کالا</p>
          <span className="text-[10px] text-purple-400 block">در ۴ رسته ساختمانی و صنعتی</span>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">کالاهای رو به اتمام:</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-rose-400">
            {toPersianDigits(lowStockProducts.length)} مورد
          </p>
          <span className="text-[10px] text-slate-400 block">موجودی کمتر از ۵ عدد</span>
        </div>

      </div>

      {/* 3. Recent Orders & Low Stock Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-extrabold text-sm text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>آخرین سفارشات مشتریان</span>
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>مشاهده و مدیریت همه سفارشات</span>
              <ArrowLeft className="w-3 h-3" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">سفارشی ثبت نشده است.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800">
                    <th className="pb-2.5">شماره سفارش</th>
                    <th className="pb-2.5">مشتری</th>
                    <th className="pb-2.5">شهر</th>
                    <th className="pb-2.5">مبلغ کل</th>
                    <th className="pb-2.5">وضعیت پرداخت</th>
                    <th className="pb-2.5">وضعیت سفارش</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-800/40">
                      <td className="py-3 font-mono text-amber-400 font-bold">
                        <Link href="/admin/orders" className="hover:underline">
                          {ord.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3 font-bold text-white">{ord.customerName}</td>
                      <td className="py-3">{ord.city}</td>
                      <td className="py-3 font-bold text-slate-100">{formatToman(ord.totalAmount)}</td>
                      <td className="py-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ord.paymentStatus === "PAID"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              : "bg-amber-950 text-amber-400 border border-amber-800"
                          }`}
                        >
                          {ord.paymentStatus === "PAID" ? "پرداخت شده" : "در انتظار پرداخت"}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-semibold">
                          {ord.orderStatus === "PENDING"
                            ? "ثبت شده"
                            : ord.orderStatus === "PROCESSING"
                            ? "در حال پردازش"
                            : ord.orderStatus === "SHIPPED"
                            ? "ارسال شده"
                            : "تحویل شده"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Warning Sidebar */}
        <div className="lg:col-span-4 bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
          <h2 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>هشدار موجودی انبار اصفهان</span>
          </h2>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              موجودی کلیه کالاها در سطح استاندارد است.
            </p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5 max-w-[170px]">
                    <span className="font-bold text-white block truncate">{p.name}</span>
                    <span className="text-[10px] text-slate-400">{formatToman(p.price)}</span>
                  </div>
                  <span className="text-xs font-black text-rose-400 bg-rose-950/80 border border-rose-800 px-2 py-1 rounded-lg">
                    {toPersianDigits(p.stock)} عدد
                  </span>
                </div>
              ))}
            </div>
          )}

          <Link
            href="/admin/products"
            className="block text-center bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2.5 rounded-xl transition-colors"
          >
            مدیریت موجودی‌ها
          </Link>
        </div>

      </div>

    </div>
  );
}
