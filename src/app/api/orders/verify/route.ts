import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, status, refId } = await req.json();

    if (!orderNumber) {
      return NextResponse.json({ message: "شماره سفارش نامعتبر است." }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return NextResponse.json({ message: "سفارش یافت نشد." }, { status: 404 });
    }

    // Only update if currently pending
    if (order.paymentStatus === "PENDING") {
      if (status === "SUCCESS") {
        await prisma.order.update({
          where: { orderNumber },
          data: {
            paymentStatus: "PAID",
            orderStatus: "PROCESSING",
            paymentRefId: refId || `ZP-${Date.now()}`,
          },
        });
      } else {
        await prisma.order.update({
          where: { orderNumber },
          data: {
            paymentStatus: "FAILED",
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ message: "خطا در ثبت وضعیت پرداخت." }, { status: 500 });
  }
}
