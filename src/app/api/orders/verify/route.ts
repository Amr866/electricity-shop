import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logPaymentTransaction } from "@/lib/paymentLogger";

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
      const isSuccess = status === "SUCCESS";
      const resolvedRefId = refId || (isSuccess ? `ZP-${Date.now()}` : null);

      if (isSuccess) {
        await prisma.order.update({
          where: { orderNumber },
          data: {
            paymentStatus: "PAID",
            orderStatus: "PROCESSING",
            paymentRefId: resolvedRefId,
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

      await logPaymentTransaction({
        orderId: order.id,
        orderNumber: order.orderNumber,
        gateway: order.paymentMethod,
        transactionType: "VERIFY",
        status: isSuccess ? "SUCCESS" : "FAILED",
        amount: order.totalAmount,
        referenceId: resolvedRefId,
        statusCode: status,
        ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"),
        userAgent: req.headers.get("user-agent"),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ message: "خطا در ثبت وضعیت پرداخت." }, { status: 500 });
  }
}
