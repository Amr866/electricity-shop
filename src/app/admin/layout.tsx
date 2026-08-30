import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { formatJalaliDate, toPersianDigits } from "@/lib/utils";
import { Store, ShieldCheck, User, Sparkles } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin");
  }

  const adminName = session.user.name || "مدیر ارشد";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Dynamic Admin Sidebar */}
      <AdminSidebar />

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900/50">
        {/* Top Bar */}
        <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs text-slate-400 font-bold hidden sm:inline">تاریخ:</span>
              <span className="text-xs font-black text-slate-200">
                {formatJalaliDate(new Date())}
              </span>
            </div>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="text-xs text-slate-400 font-medium hidden lg:inline">
              مرکز تخصصی برق و کارگاه تعمیرات شیاسی نجف‌آباد
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700/80 flex items-center gap-1.5 transition-colors"
              title="مشاهده سایت در تب جدید"
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">مشاهده فروشگاه</span>
            </Link>

            <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-[11px] font-black px-2.5 py-1 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400/50" />
              <span className="hidden sm:inline">PostgreSQL آنلاین</span>
            </span>

            <div className="flex items-center gap-2 pr-1 border-r border-slate-800 text-xs font-bold text-slate-300">
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
                {adminName.slice(0, 1)}
              </div>
              <span className="hidden md:inline">{adminName}</span>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="p-4 sm:p-6 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
