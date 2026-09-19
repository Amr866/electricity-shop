import React from "react";
import { checkAdminSession } from "@/lib/adminAuth";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ADMIN_PHONES, parseAdminPermissions } from "@/lib/auth";
import { AdminUsersClient, AdminUserItem } from "./AdminUsersClient";

export const metadata = {
  title: "مدیریت مدیران و دسترسی‌ها | پنل مدیریت شیاسی",
};

export default async function AdminUsersPage() {
  const { isAdmin, isRootOwner, session } = await checkAdminSession();

  if (!isAdmin || !session?.user) {
    redirect("/auth/login");
  }

  if (!isRootOwner) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-slate-900 border border-red-500/30 rounded-2xl text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-white">دسترسی غیرمجاز</h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          مدیریت حساب‌های مدیران و تخصیص دسترسی‌ها صرفاً در اختیار مدیر ارشد (مالک اصلی سیستم) می‌باشد.
        </p>
      </div>
    );
  }

  const adminUsers = await prisma.user.findMany({
    where: {
      OR: [{ role: "ADMIN" }, { phone: { in: ADMIN_PHONES } }],
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      phone: true,
      role: true,
      adminPermissions: true,
      isSuspended: true,
      createdAt: true,
    },
  });

  const initialUsers: AdminUserItem[] = adminUsers.map((u) => {
    const isRoot = ADMIN_PHONES.includes(u.phone);
    const perms = isRoot ? ["ALL"] : parseAdminPermissions(u.adminPermissions);
    return {
      id: u.id,
      name: u.name || (isRoot ? "مدیر ارشد فروشگاه" : "مدیر سیستم"),
      phone: u.phone,
      role: "ADMIN",
      isRootOwner: isRoot,
      permissions: perms,
      isSuspended: u.isSuspended,
      createdAt: u.createdAt.toISOString(),
    };
  });

  return <AdminUsersClient initialUsers={initialUsers} />;
}
