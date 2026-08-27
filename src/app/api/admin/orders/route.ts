import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/adminAuth";

export async function GET() {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const { orderId, orderStatus, paymentStatus, trackingCode } = await req.json();

    if (!orderId) {
      return NextResponse.json({ message: "شناسه سفارش الزامی است." }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: orderStatus || undefined,
        paymentStatus: paymentStatus || undefined,
        trackingCode: trackingCode !== undefined ? trackingCode : undefined,
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json({ message: "خطا در بروزرسانی سفارش." }, { status: 500 });
  }
}
