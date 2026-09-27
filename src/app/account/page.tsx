import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CustomerAccountClient, CustomerOrder, CustomerRepairTicket } from "./CustomerAccountClient";

export const metadata = {
  title: "حساب کاربری من | الکتریکی شیاسی نجف‌آباد",
  description: "پیگیری سفارش‌ها، درخواست‌های تعمیرات و مدیریت حساب کاربری در فروشگاه کالای برق شیاسی",
};

export default async function CustomerAccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/account");
  }

  const userId = session.user.id;
  const userPhone = (session.user as any).phone;

  const whereOrderConditions: any[] = [];
  if (userId) whereOrderConditions.push({ userId });
  if (userPhone) whereOrderConditions.push({ customerPhone: userPhone });

  const [dbOrders, dbRepairs] = await Promise.all([
    whereOrderConditions.length > 0
      ? prisma.order.findMany({
          where: {
            OR: whereOrderConditions,
          },
          orderBy: { createdAt: "desc" },
          take: 50,
        })
      : Promise.resolve([]),
    userPhone || userId
      ? prisma.repairRequest.findMany({
          where: {
            OR: [
              ...(userPhone ? [{ customerPhone: userPhone }] : []),
              ...(userId ? [{ userId }] : []),
            ],
          },
          orderBy: { createdAt: "desc" },
          take: 50,
        })
      : Promise.resolve([]),
  ]);

  const initialOrders: CustomerOrder[] = dbOrders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    createdAt: o.createdAt.toISOString(),
    totalAmount: o.totalAmount,
    shippingMethod: o.shippingMethod,
    paymentStatus: o.paymentStatus,
    orderStatus: o.orderStatus,
  }));

  const initialRepairs: CustomerRepairTicket[] = dbRepairs.map((r) => ({
    id: r.id,
    trackingCode: r.trackingCode,
    applianceType: r.applianceType,
    brandModel: r.brandModel,
    issueDesc: r.issueDesc,
    estimatedCost: r.estimatedCost,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <CustomerAccountClient
      initialOrders={initialOrders}
      initialRepairs={initialRepairs}
      user={session.user}
    />
  );
}
