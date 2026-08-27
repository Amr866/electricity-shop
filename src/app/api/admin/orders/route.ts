import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
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
