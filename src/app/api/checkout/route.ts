import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateTieredUnitPrice } from "@/lib/utils";

// Server-enforced shipping method rates
const SHIPPING_RATES: Record<string, number> = {
  isfahan_express: 45000,
  isfahan_pickup: 0,
  in_person_pickup: 0,
  post_pishtaz: 55000,
  tipax: 75000,
  najafabad_local: 35000,
};

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

    // 1. Validate items and quantities
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

      const qty = parseInt(item.quantity, 10);
      if (!Number.isInteger(qty) || qty <= 0 || qty > 1000) {
        return NextResponse.json(
          { message: `تعداد سفارش برای کالای «${item.name}» نامعتبر است.` },
          { status: 400 }
        );
      }

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

      if (dbProduct.stock < qty) {
        return NextResponse.json(
          { message: `موجودی کالای «${dbProduct.name}» کافی نمی‌باشد (موجودی فعلی: ${dbProduct.stock} عدد).` },
          { status: 400 }
        );
      }

      // Quantity tiered discount calculation
      const unitPrice = calculateTieredUnitPrice(dbProduct.price, qty);
      const itemTotal = unitPrice * qty;
      serverSubtotal += itemTotal;

      const primaryImg =
        dbProduct.images.find((img) => img.isPrimary)?.url ||
        dbProduct.images[0]?.url ||
        item.image ||
        null;

      validatedItems.push({
        productId: dbProduct.id,
        productName: dbProduct.name,
        productImage: primaryImg,
        price: unitPrice,
        quantity: qty,
        total: itemTotal,
      });
    }

    if (validatedItems.length === 0) {
      return NextResponse.json({ message: "سبد خرید خالی است." }, { status: 400 });
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
            serverDiscount = Math.min(coupon.discountAmount, serverSubtotal);
          }
        }
      }
    }

    // 3. Server-Calculated Shipping Rate
    const selectedMethodKey = shippingMethod || "isfahan_express";
    let serverShippingCost = SHIPPING_RATES[selectedMethodKey] ?? 45000;
    if (serverSubtotal >= 2000000 && selectedMethodKey !== "in_person_pickup") {
      serverShippingCost = 0; // Free shipping over 2M Tomans
    }

    const finalTotalAmount = Math.max(0, serverSubtotal - serverDiscount + serverShippingCost);

    // 4. Generate unique alphanumeric order number: SH-YYMMDD-XXXX
    const datePrefix = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `SH-${datePrefix}-${randomSuffix}`;

    let paymentStatus = "PENDING";
    let orderStatus = "PENDING";

    if (paymentMethod === "cod_isfahan") {
      paymentStatus = "PENDING";
      orderStatus = "PROCESSING";
    }

    // 5. Create Order & Conditionally Decrement Stock in Atomic Transaction
    const order = await prisma.$transaction(async (tx) => {
      // Conditionally decrement stock ensuring stock >= quantity
      for (const item of validatedItems) {
        const updateResult = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: { gte: item.quantity },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (updateResult.count === 0) {
          throw new Error(`موجودی کالای «${item.productName}» هم‌اکنون به اتمام رسیده است.`);
        }
      }

      // Create Order in DB
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
          shippingMethod: selectedMethodKey,
          shippingCost: serverShippingCost,
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
  } catch (error: any) {
    console.error("Checkout creation error:", error);
    return NextResponse.json(
      { message: error.message || "خطایی در ثبت سفارش رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 400 }
    );
  }
}
