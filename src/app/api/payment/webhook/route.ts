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

    if (!orderNumber || typeof orderNumber !== "string" || !Authority || typeof Authority !== "string") {
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
      let refId: string | null = null;
      const merchantId = process.env.ZARINPAL_MERCHANT_ID;
      const isProduction = process.env.NODE_ENV === "production";
      const isConfiguredMerchant = Boolean(
        merchantId &&
        merchantId !== "00000000-0000-0000-0000-000000000000" &&
        merchantId.length >= 30
      );

      // In production or when live merchant credentials are set, enforce outbound ZarinPal verification
      if (isProduction || isConfiguredMerchant) {
        if (!isConfiguredMerchant) {
          logger.error("[Payment Webhook] Missing valid ZARINPAL_MERCHANT_ID in production environment");
          return NextResponse.json({ error: "Payment gateway configuration error" }, { status: 500 });
        }

        const zarinRes = await fetch("https://api.zarinpal.com/pg/v4/payment/verify.json", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            merchant_id: merchantId,
            amount: order.totalAmount * 10, // Toman to Rial conversion
            authority: Authority,
          }),
        });

        const zarinData = await zarinRes.json();
        // ZarinPal code 100 = Transaction verified, 101 = Transaction already verified
        if (zarinData.data?.code !== 100 && zarinData.data?.code !== 101) {
          logger.warn(`[Payment Webhook] Gateway verification failed for order ${orderNumber}`, zarinData);
          await prisma.order.update({
            where: { orderNumber },
            data: { paymentStatus: "FAILED" },
          });
          return NextResponse.json({ error: "Payment verification failed with gateway" }, { status: 400 });
        }

        refId = String(zarinData.data.ref_id);
      } else {
        // Non-production local sandbox / mock fallback
        // Require explicit mock authority prefix or shared mock gateway secret
        const mockSecret = req.headers.get("x-mock-gateway-secret");
        const isAllowedMock = Authority.startsWith("ZP-MOCK-") || (Boolean(process.env.NEXTAUTH_SECRET) && mockSecret === process.env.NEXTAUTH_SECRET);

        if (!isAllowedMock) {
          logger.warn(`[Payment Webhook] Blocked unauthenticated mock payment attempt for order ${orderNumber}`);
          return NextResponse.json({ error: "Unauthorized simulated payment attempt" }, { status: 403 });
        }

        refId = `ZP-MOCK-${Date.now()}`;
      }

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
