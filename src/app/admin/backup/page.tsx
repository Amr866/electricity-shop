import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BackupAdminClient } from "./BackupAdminClient";

export const metadata = {
  title: "پشتیبان‌گیری پایگاه داده | مدیریت فروشگاه شیاسی",
};

export default async function AdminBackupPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin/backup");
  }

  // Fetch real-time count metrics
  const [
    productsCount,
    ordersCount,
    usersCount,
    categoriesCount,
    repairsCount,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.category.count(),
    prisma.repairRequest.count(),
  ]);

  return (
    <BackupAdminClient
      metrics={{
        productsCount,
        ordersCount,
        usersCount,
        categoriesCount,
        repairsCount,
      }}
    />
  );
}
