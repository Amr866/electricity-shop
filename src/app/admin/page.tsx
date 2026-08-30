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
  Wrench,
  MessageCircle,
  FileText,
  Printer,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
  Copy,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalOrdersCount,
    paidOrders,
    totalProductsCount,
    lowStockProducts,
    recentOrders,
    activeRepairsCount,
    recentRepairs,
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
    prisma.repairRequest.count({
      where: {
        status: { in: ["SUBMITTED", "IN_PROGRESS", "RECEIVED", "INSPECTING", "REPAIRING"] },
      },
    }),
    prisma.repairRequest.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalRevenue = paidOrders.reduce((acc: number, o: { totalAmount: number }) => acc + (o.totalAmount || 0), 0);

  return (
    <div className="space-y-6 text-slate-100">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              <Zap className="w-4 h-4 fill-slate-950" />
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
              داشبورد جامع مدیریت و کارگاه تخصصی شیاسی
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">
            نظارت لحظه‌ای بر تراکنش‌های مالی، سفارش‌های نجف‌آباد و اصفهان، و تیکت‌های فعال کارگاه تعمیرات
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/products"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 active:scale-95 hover-glow"
          >
            <span>+ افزودن کالای جدید</span>
          </Link>
          <Link
            href="/admin/orders"
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>مدیریت و چاپ فاکتورها</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Grid (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* Metric 1: Revenue */}
        <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-sm space-y-2 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold">فروش تسویه شده:</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-black text-white font-mono">{formatToman(totalRevenue)}</p>
          <span className="text-[10px] text-emerald-400 font-bold block">
            {toPersianDigits(paidOrders.length)} تراکنش موفق
          </span>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-sm space-y-2 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold">کل سفارشات:</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-black text-white font-mono">{toPersianDigits(totalOrdersCount)} سفارش</p>
          <span className="text-[10px] text-blue-400 font-medium block">
            پیک اصفهان / تیپاکس
          </span>
        </div>

        {/* Metric 3: Active Repairs */}
        <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-sm space-y-2 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold">تعمیرات در کارگاه:</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Wrench className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-black text-amber-400 font-mono">
            {toPersianDigits(activeRepairsCount)} دستگاه
          </p>
          <span className="text-[10px] text-amber-300/80 font-medium block">
            پنکه، کولر و بخاری
          </span>
        </div>

        {/* Metric 4: Catalog Products */}
        <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-sm space-y-2 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold">تنوع کاتالوگ:</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-black text-white font-mono">{toPersianDigits(totalProductsCount)} کالا</p>
          <span className="text-[10px] text-purple-400 font-medium block">
            کالای استاندارد برق
          </span>
        </div>

        {/* Metric 5: Low Stock Warning */}
        <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-sm space-y-2 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold">کسری موجودی:</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${lowStockProducts.length > 0 ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"}`}>
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className={`text-lg sm:text-xl font-black font-mono ${lowStockProducts.length > 0 ? "text-rose-400" : "text-emerald-400"}`}>
            {toPersianDigits(lowStockProducts.length)} قلم
          </p>
          <span className="text-[10px] text-slate-400 block">
            {lowStockProducts.length > 0 ? "موجودی کمتر از ۵ عدد" : "وضعیت انبار پایدار"}
          </span>
        </div>

      </div>

      {/* 3. Main Operational Grid: Recent Orders + Workshop Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Recent Orders Table (Span 8) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
            <h2 className="font-black text-sm text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>آخرین سفارشات ثبت‌شده مشتریان</span>
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
            >
              <span>مشاهده و مدیریت همه سفارشات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center font-medium">سفارشی ثبت نشده است.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800 text-[11px]">
                    <th className="pb-3 font-bold">شماره سفارش</th>
                    <th className="pb-3 font-bold">مشتری</th>
                    <th className="pb-3 font-bold">شهر</th>
                    <th className="pb-3 font-bold">مبلغ کل</th>
                    <th className="pb-3 font-bold">وضعیت پرداخت</th>
                    <th className="pb-3 font-bold">وضعیت سفارش</th>
                    <th className="pb-3 font-bold text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                  {recentOrders.map((ord: any) => (
                    <tr key={ord.id} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="py-3.5 font-mono text-amber-400 font-bold">
                        <Link href="/admin/orders" className="hover:underline">
                          {ord.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3.5 font-bold text-white">{ord.customerName}</td>
                      <td className="py-3.5 text-slate-400">{ord.city || "نجف‌آباد"}</td>
                      <td className="py-3.5 font-bold text-slate-100 font-mono">{formatToman(ord.totalAmount)}</td>
                      <td className="py-3.5">
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                            ord.paymentStatus === "PAID"
                              ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                              : "bg-amber-950/80 text-amber-400 border border-amber-800"
                          }`}
                        >
                          {ord.paymentStatus === "PAID" ? "پرداخت شده" : "در انتظار پرداخت"}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md font-bold border border-slate-700">
                          {ord.orderStatus === "PENDING"
                            ? "ثبت شده"
                            : ord.orderStatus === "PROCESSING"
                            ? "در حال پردازش"
                            : ord.orderStatus === "SHIPPED"
                            ? "ارسال شده"
                            : "تحویل شده"}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          {ord.customerPhone && (
                            <a
                              href={`https://wa.me/98${ord.customerPhone.replace(/^0/, "")}?text=${encodeURIComponent(
                                `سلام ${ord.customerName} عزیز، وضعیت سفارش شما به شماره ${ord.orderNumber} در فروشگاه شیاسی`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg transition-colors"
                              title="ارسال پیام واتساپ به خریدار"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <Link
                            href="/admin/orders"
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                            title="چاپ فاکتور رسمی"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Workshop Repair Center & Warehouse Health (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Recent Repair Requests in Workshop */}
          <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-black text-sm text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>پذیرش‌های اخیر کارگاه شیاسی</span>
              </h2>
              <span className="text-[10px] bg-amber-950 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-800">
                {toPersianDigits(activeRepairsCount)} فعال
              </span>
            </div>

            {recentRepairs.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center font-medium">
                تیکت تعمیراتی فعالی وجود ندارد.
              </p>
            ) : (
              <div className="space-y-2.5">
                {recentRepairs.map((rep: any) => (
                  <div
                    key={rep.id}
                    className="bg-slate-850 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs hover:border-amber-500/40 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <strong className="font-mono text-amber-400 font-bold">{rep.trackingCode}</strong>
                        <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                          ({rep.applianceType})
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{rep.issueDesc}</p>
                    </div>

                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg shrink-0 ${
                      rep.status === "READY" || rep.status === "COMPLETED"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        : rep.status === "IN_PROGRESS" || rep.status === "REPAIRING"
                        ? "bg-amber-950 text-amber-300 border border-amber-800"
                        : "bg-blue-950 text-blue-300 border border-blue-800"
                    }`}>
                      {rep.status === "READY" || rep.status === "COMPLETED" ? "آماده تحویل" : rep.status === "IN_PROGRESS" || rep.status === "REPAIRING" ? "در حال تعمیر" : "پذیرش شد"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Warehouse Stock Health & Fast-Moving Items */}
          <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
            <h2 className="font-black text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <AlertTriangle className={`w-4 h-4 ${lowStockProducts.length > 0 ? "text-rose-400" : "text-emerald-400"}`} />
              <span>وضعیت موجودی انبار نجف‌آباد</span>
            </h2>

            {lowStockProducts.length === 0 ? (
              <div className="bg-emerald-950/30 border border-emerald-900/60 rounded-2xl p-3.5 text-center space-y-1 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                <p className="font-bold text-emerald-300">موجودی کلیه کالاها در حد مطلوب است</p>
                <p className="text-[10px] text-slate-400">انبار سیم، کابل، موتور کولر و پنکه آماده تامین فوری سفارش‌ها می‌باشد.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {lowStockProducts.map((p: any) => (
                  <div
                    key={p.id}
                    className="bg-slate-850 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5 max-w-[170px]">
                      <span className="font-bold text-white block truncate">{p.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{formatToman(p.price)}</span>
                    </div>
                    <span className="text-[11px] font-black text-rose-400 bg-rose-950/80 border border-rose-800 px-2 py-0.5 rounded-lg font-mono">
                      {toPersianDigits(p.stock)} عدد
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Link
              href="/admin/products"
              className="block text-center bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2.5 rounded-xl transition-colors border border-slate-700"
            >
              مدیریت موجودی انبار و کاتالوگ
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
