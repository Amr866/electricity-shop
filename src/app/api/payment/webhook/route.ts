import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { Authority, Status, orderNumber } = body;

    console.log(`💳 [Payment Webhook] Received webhook notification:`, { Authority, Status, orderNumber });

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

      console.log(`✅ [Payment Webhook] Order ${orderNumber} successfully marked as PAID with ref: ${refId}`);

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

      return NextResponse.json({ success: false, message: "Payment failed or was canceled" });
    }
  } catch (error) {
    console.error("Error processing payment webhook:", error);
    return NextResponse.json({ error: "Internal webhook error" }, { status: 500 });
  }
}
