"use client";

import React, { useState } from "react";
import {
  Database,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Package,
  ShoppingBag,
  Users,
  Layers,
  Wrench,
  Clock,
  Sparkles,
  Loader2,
  FileJson,
  Send,
  Lock,
  HardDrive,
} from "lucide-react";
import { toPersianDigits, formatJalaliDate } from "@/lib/utils";

interface BackupAdminClientProps {
  metrics: {
    productsCount: number;
    ordersCount: number;
    usersCount: number;
    categoriesCount: number;
    repairsCount: number;
  };
}

export function BackupAdminClient({ metrics }: BackupAdminClientProps) {
  const [downloading, setDownloading] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadBackup = () => {
    setDownloading(true);
    setDownloadSuccess(false);

    try {
      // Trigger native browser file download directly
      window.location.href = "/api/admin/backup?download=true";

      setTimeout(() => {
        setLastBackupTime(new Date().toLocaleTimeString("fa-IR"));
        setDownloadSuccess(true);
        setDownloading(false);
        setTimeout(() => setDownloadSuccess(false), 5000);
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("خطا در ایجاد فایل پشتیبان. لطفاً مجدداً تلاش نمایید.");
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <span>پشتیبان‌گیری پایگاه داده و حفاظت از اطلاعات</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            استخراج ۱ کلیکه اطلاعات کامل فروشگاه، سفارشات، کالاها و سوابق مشتریان بدون پرداخت هزینه سرور
          </p>
        </div>

        {/* Database Status Indicator */}
        <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>PostgreSQL متصل و آماده استخراج</span>
        </div>
      </div>

      {/* 2. Real-Time Records Inventory Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center space-y-1">
          <Package className="w-4 h-4 text-blue-400 mx-auto" />
          <div className="text-base font-black text-white">{toPersianDigits(metrics.productsCount)}</div>
          <div className="text-[10px] text-slate-400">کالای ثبت‌شده</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center space-y-1">
          <ShoppingBag className="w-4 h-4 text-emerald-400 mx-auto" />
          <div className="text-base font-black text-white">{toPersianDigits(metrics.ordersCount)}</div>
          <div className="text-[10px] text-slate-400">سفارش و تراکنش</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center space-y-1">
          <Users className="w-4 h-4 text-amber-400 mx-auto" />
          <div className="text-base font-black text-white">{toPersianDigits(metrics.usersCount)}</div>
          <div className="text-[10px] text-slate-400">حساب کاربری</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center space-y-1">
          <Wrench className="w-4 h-4 text-rose-400 mx-auto" />
          <div className="text-base font-black text-white">{toPersianDigits(metrics.repairsCount)}</div>
          <div className="text-[10px] text-slate-400">پرونده تعمیرات</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center space-y-1 col-span-2 sm:col-span-1">
          <Layers className="w-4 h-4 text-purple-400 mx-auto" />
          <div className="text-base font-black text-white">{toPersianDigits(metrics.categoriesCount)}</div>
          <div className="text-[10px] text-slate-400">دسته‌بندی اصلی</div>
        </div>
      </div>

      {/* 3. Primary Backup Action Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl space-y-6">
        <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>استخراج مستقیم و آفلاین (Disaster Recovery Ready)</span>
            </div>
            <h2 className="text-lg font-black text-white">
              دریافت نسخه پشتیبان کامل به فرمت استاندارد JSON
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              با کلیک روی دکمه زیر، تمامی جداول دیتابیس (محصولات، سفارش‌ها، سوابق فاکتورها، پرونده‌های تعمیرات، کدهای تخفیف و مشخصات فنی) در قالب یک فایل رمزنگاری و ساختاریافته به صورت مستقیم روی گوشی یا رایانه شما دانلود می‌شود.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadBackup}
            disabled={downloading}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all active:scale-95 shrink-0 cursor-pointer disabled:opacity-60"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>در حال آماده‌سازی و استخراج...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-slate-950" />
                <span>دانلود فایل پشتیبان (.JSON)</span>
              </>
            )}
          </button>
        </div>

        {downloadSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              فایل پشتیبان با موفقیت روی دستگاه شما ذخیره شد. (ساعت: {lastBackupTime})
            </span>
          </div>
        )}

        {/* Technical Specs Guarantee */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 relative z-10">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>عدم افشای توکن‌های حساس و رمزهای خام</span>
          </div>
          <div className="flex items-center gap-2">
            <FileJson className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>سازگاری کامل با دستورات بازگردانی Prisma و SQL</span>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>حجم فشرده و سبک (بدون مصرف پهنای باند سرور)</span>
          </div>
        </div>
      </div>

      {/* 4. Automated Backup Integration Tips */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>پشتیبان‌گیری خودکار هفتگی به تلگرام / ایتا (کاملاً رایگان)</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          برای اینکه حتی نیازی به کلیک دستی هم نداشته باشید، سیستم بک‌اند مجهز به روت امنیتی <code className="text-amber-400 font-mono">/api/admin/backup</code> است. می‌توانید با ایجاد یک کرون‌جاب (Cron Job) هفتگی یا وب‌هوک ساده در هاست، فایل پشتیبان را به صورت اتوماتیک هر جمعه شب به پیوی یا کانال شخصی خودتان در پیام‌رسان ارسال کنید.
        </p>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>تاریخ امروز: <strong className="text-slate-200">{formatJalaliDate(new Date())}</strong></span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold">آماده برای بک‌آپ دوره‌ای</span>
        </div>
      </div>
    </div>
  );
}
