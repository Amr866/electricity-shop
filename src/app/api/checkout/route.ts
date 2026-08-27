import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      userId,
      province,
      city,
      postalCode,
      address,
      isCorporate,
      companyName,
      economicCode,
      nationalCode,
      shippingMethod,
      shippingCost,
      paymentMethod,
      receiptImage,
      notes,
      items,
      subtotal,
      discount,
      totalAmount,
    } = body;

    if (!customerName || !customerPhone || !address || !items || items.length === 0) {
      return NextResponse.json(
        { message: "لطفاً تمامی فیلدهای الزامی را تکمیل کنید." },
        { status: 400 }
      );
    }

    // Generate unique order number: SH-YYMMDD-XXX
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderNumber = `SH-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    // Determine initial status
    let paymentStatus = "PENDING";
    let orderStatus = "PENDING";

    if (paymentMethod === "cod_isfahan") {
      paymentStatus = "PENDING";
      orderStatus = "PROCESSING";
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        userId: userId || null,
        province: province || "اصفهان",
        city: city || "نجف‌آباد",
        postalCode: postalCode || null,
        address,
        isCorporate: Boolean(isCorporate),
        companyName: companyName || null,
        economicCode: economicCode || null,
        nationalCode: nationalCode || null,
        shippingMethod: shippingMethod || "isfahan_express",
        shippingCost: shippingCost || 0,
        paymentMethod: paymentMethod || "zarinpal",
        paymentStatus,
        orderStatus,
        subtotal,
        discount: discount || 0,
        totalAmount,
        receiptImage: receiptImage || null,
        notes: notes || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.id || null,
            productName: item.name,
            productImage: item.image || null,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
          })),
        },
      },
    });

    let redirectUrl = `/order-tracking/${order.orderNumber}`;

    if (paymentMethod === "zarinpal") {
      redirectUrl = `/zarinpal-mock?orderNumber=${order.orderNumber}&amount=${totalAmount}`;
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      redirectUrl,
    });
  } catch (error) {
    console.error("Checkout creation error:", error);
    return NextResponse.json(
      { message: "خطایی در ثبت سفارش رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
