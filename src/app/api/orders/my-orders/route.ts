import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "لطفاً ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
    }

    const userId = session.user.id;
    const userPhone = session.user.phone;

    const whereConditions: any[] = [];
    if (userId) whereConditions.push({ userId });
    if (userPhone) whereConditions.push({ customerPhone: userPhone });

    if (whereConditions.length === 0) {
      return NextResponse.json({ success: true, orders: [] });
    }

    const orders = await prisma.order.findMany({
      where: {
        OR: whereConditions,
      },
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json({ error: "خطا در دریافت لیست سفارش‌ها" }, { status: 500 });
  }
}
