import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
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
      couponCode,
    } = body;

    if (!customerName || !customerPhone || !address || !items || items.length === 0) {
      return NextResponse.json(
        { message: "لطفاً تمامی فیلدهای الزامی را تکمیل کنید." },
        { status: 400 }
      );
    }

    // Authenticated user linking
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    // 1. Server-Side Price & Inventory Verification
    let serverSubtotal = 0;
    const validatedItems: Array<{
      productId: string;
      productName: string;
      productImage: string | null;
      price: number;
      quantity: number;
      total: number;
    }> = [];

    for (const item of items) {
      if (!item.id) continue;

      const dbProduct = await prisma.product.findUnique({
        where: { id: item.id },
        include: { images: true },
      });

      if (!dbProduct) {
        return NextResponse.json(
          { message: `کالای «${item.name}» در فروشگاه یافت نشد.` },
          { status: 400 }
        );
      }

      if (dbProduct.stock < item.quantity) {
        return NextResponse.json(
          { message: `موجودی کالای «${dbProduct.name}» کافی نمی‌باشد (موجودی فعلی: ${dbProduct.stock} عدد).` },
          { status: 400 }
        );
      }

      // Quantity tiered discount calculation
      let unitPrice = dbProduct.price;
      if (item.quantity >= 50) {
        unitPrice = Math.round(dbProduct.price * 0.9); // 10% wholesale tier
      } else if (item.quantity >= 10) {
        unitPrice = Math.round(dbProduct.price * 0.95); // 5% pack tier
      }

      const itemTotal = unitPrice * item.quantity;
      serverSubtotal += itemTotal;

      const primaryImg = dbProduct.images.find((img) => img.isPrimary)?.url || dbProduct.images[0]?.url || item.image || null;

      validatedItems.push({
        productId: dbProduct.id,
        productName: dbProduct.name,
        productImage: primaryImg,
        price: unitPrice,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    // 2. Server-Side Coupon Verification
    let serverDiscount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });

      if (coupon && coupon.isActive) {
        const notExpired = !coupon.expiresAt || new Date(coupon.expiresAt) >= new Date();
        const meetsMin = !coupon.minOrderAmount || serverSubtotal >= coupon.minOrderAmount;

        if (notExpired && meetsMin) {
          if (coupon.discountPercent) {
            serverDiscount = Math.round((serverSubtotal * coupon.discountPercent) / 100);
          } else if (coupon.discountAmount) {
            serverDiscount = coupon.discountAmount;
          }
        }
      }
    }

    const validShippingCost = typeof shippingCost === "number" ? shippingCost : 0;
    const finalTotalAmount = Math.max(0, serverSubtotal - serverDiscount + validShippingCost);

    // 3. Generate unique order number: SH-YYMMDD-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const datePrefix = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const orderNumber = `SH-${datePrefix}-${randomSuffix}`;

    let paymentStatus = "PENDING";
    let orderStatus = "PENDING";

    if (paymentMethod === "cod_isfahan") {
      paymentStatus = "PENDING";
      orderStatus = "PROCESSING";
    }

    // 4. Create Order & Decrement Stock in Atomic Transaction
    const order = await prisma.$transaction(async (tx) => {
      // Decrement stock for each item
      for (const item of validatedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Create Order
      return await tx.order.create({
        data: {
          orderNumber,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail ? customerEmail.trim() : null,
          userId,
          province: province || "اصفهان",
          city: city || "نجف‌آباد",
          postalCode: postalCode ? postalCode.trim() : null,
          address: address.trim(),
          isCorporate: Boolean(isCorporate),
          companyName: companyName ? companyName.trim() : null,
          economicCode: economicCode ? economicCode.trim() : null,
          nationalCode: nationalCode ? nationalCode.trim() : null,
          shippingMethod: shippingMethod || "isfahan_express",
          shippingCost: validShippingCost,
          paymentMethod: paymentMethod || "zarinpal",
          paymentStatus,
          orderStatus,
          subtotal: serverSubtotal,
          discount: serverDiscount,
          totalAmount: finalTotalAmount,
          receiptImage: receiptImage || null,
          notes: notes ? notes.trim() : null,
          items: {
            create: validatedItems,
          },
        },
      });
    });

    let redirectUrl = `/order-tracking/${order.orderNumber}`;

    if (paymentMethod === "zarinpal") {
      redirectUrl = `/zarinpal-mock?orderNumber=${order.orderNumber}&amount=${finalTotalAmount}`;
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
