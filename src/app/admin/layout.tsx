import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { formatJalaliDate } from "@/lib/utils";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Dynamic Admin Sidebar */}
      <AdminSidebar />

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900/50">
        {/* Top Bar */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">تاریخ امروز:</span>
            <span className="text-xs font-bold text-slate-200">
              {formatJalaliDate(new Date())}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-emerald-950 border border-emerald-800 text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              دیتابیس PostgreSQL متصل است
            </span>
          </div>
        </header>

        {/* Main Body */}
        <main className="p-6 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
