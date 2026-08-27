import React from "react";
import { prisma } from "@/lib/prisma";
import { OrdersAdminClient } from "./OrdersAdminClient";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  return <OrdersAdminClient initialOrders={orders} />;
}
