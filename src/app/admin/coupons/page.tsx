import React from "react";
import { prisma } from "@/lib/prisma";
import { CouponsAdminClient } from "./CouponsAdminClient";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <CouponsAdminClient initialCoupons={coupons} />;
}
