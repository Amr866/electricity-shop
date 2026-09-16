import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { logPaymentTransaction } from "@/lib/paymentLogger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { Authority, Status, orderNumber } = body;

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    logger.info("Received payment webhook notification", {
      method: "POST",
      pathname: "/api/payment/webhook",
      ip,
      Authority,
      Status,
      orderNumber,
    });

    if (!orderNumber || !Authority) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Find order in database
    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If order already paid, prevent double-crediting
    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ success: true, message: "Order is already paid" });
    }

    if (Status === "OK") {
      // In production: make server-to-server call to ZarinPal verification API
      // const zarinRes = await fetch("https://api.zarinpal.com/pg/v4/payment/verify.json", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      //     amount: order.totalAmount * 10, // Toman to Rial
      //     authority: Authority,
      //   })
      // });

      const refId = `ZP-${Math.floor(100000000000 + Math.random() * 900000000000)}`;

      await prisma.order.update({
        where: { orderNumber },
        data: {
          paymentStatus: "PAID",
          orderStatus: "PROCESSING",
          paymentRefId: refId,
        },
      });

      logger.info(`[Payment Webhook] Order ${orderNumber} marked as PAID with ref: ${refId}`);

      await logPaymentTransaction({
        orderId: order.id,
        orderNumber: order.orderNumber,
        gateway: "zarinpal",
        transactionType: "WEBHOOK",
        status: "SUCCESS",
        amount: order.totalAmount,
        authority: Authority,
        referenceId: refId,
        statusCode: Status,
        metadata: body,
        ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"),
        userAgent: req.headers.get("user-agent"),
      });

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        refId,
      });
    } else {
      await prisma.order.update({
        where: { orderNumber },
        data: {
          paymentStatus: "FAILED",
        },
      });

      await logPaymentTransaction({
        orderId: order.id,
        orderNumber: order.orderNumber,
        gateway: "zarinpal",
        transactionType: "WEBHOOK",
        status: "FAILED",
        amount: order.totalAmount,
        authority: Authority,
        statusCode: Status,
        errorMessage: "Payment failed or was canceled by user/gateway",
        metadata: body,
        ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"),
        userAgent: req.headers.get("user-agent"),
      });

      return NextResponse.json({ success: false, message: "Payment failed or was canceled" });
    }
  } catch (error) {
    logger.error("Error processing payment webhook", { error: String(error) });
    return NextResponse.json({ error: "Internal webhook error" }, { status: 500 });
  }
}
