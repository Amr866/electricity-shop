import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateTieredUnitPrice, normalizeIranianPhone } from "@/lib/utils";
import { logger } from "@/lib/logger";

// Server-enforced shipping method rates
const SHIPPING_RATES: Record<string, number> = {
  isfahan_express: 45000,
  isfahan_pickup: 0,
  najafabad_pickup: 0,
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

    logger.info("Inbound checkout order creation request", {
      customerName,
      isCorporate,
      paymentMethod,
      shippingMethod,
    });

    if (!customerName || !customerPhone || !address || !items || items.length === 0) {
      return NextResponse.json(
        { message: "لطفاً تمامی فیلدهای الزامی را تکمیل کنید." },
        { status: 400 }
      );
    }

    // Corporate tax invoice validation per Iranian Ministry of Finance standard
    if (isCorporate) {
      if (!companyName || !companyName.trim()) {
        return NextResponse.json(
          { message: "برای فاکتور رسمی حقوقی، نام شرکت / سازمان الزامی است." },
          { status: 400 }
        );
      }
      if (!nationalCode || nationalCode.trim().length < 10) {
        return NextResponse.json(
          { message: "شناسه ملی شرکت جهت صدور فاکتور رسمی نامعتبر است (حداقل ۱۰ رقم)." },
          { status: 400 }
        );
      }
      if (!economicCode || economicCode.trim().length < 11) {
        return NextResponse.json(
          { message: "کد اقتصادی ۱۲ رقمی شرکت جهت صدور فاکتور رسمی الزامی و نامعتبر است." },
          { status: 400 }
        );
      }
    }

    // Auto-release any expired Card-to-Card reservations (> 8h unverified)
    try {
      const expiredOrders = await prisma.order.findMany({
        where: {
          paymentMethod: "card_to_card",
          paymentStatus: "PENDING",
          orderStatus: "PENDING",
          reservedUntil: { lt: new Date() },
        },
        include: { items: true },
      });

      if (expiredOrders.length > 0) {
        for (const expOrder of expiredOrders) {
          await prisma.$transaction(async (tx) => {
            for (const it of expOrder.items) {
              if (it.productId) {
                await tx.product.update({
                  where: { id: it.productId },
                  data: { stock: { increment: it.quantity } },
                });
              }
            }
            await tx.order.update({
              where: { id: expOrder.id },
              data: { orderStatus: "EXPIRED" },
            });
          });
          logger.info("Expired Card-to-Card order auto-released stock", {
            orderNumber: expOrder.orderNumber,
          });
        }
      }
    } catch (cleanupErr) {
      logger.error("Error running auto-expiry stock cleanup", cleanupErr);
    }

    // Authenticated user linking
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    // 1. Validate items, recalculate tiered volume discounts server-authoritatively
    let serverSubtotal = 0;
    let totalWholesaleDiscountSavings = 0;
    const validatedItems: Array<{
      productId: string;
      productName: string;
      productImage: string | null;
      price: number;
      quantity: number;
      discountPercent: number;
      total: number;
    }> = [];

    for (const item of items) {
      const productId = item.productId || item.id;
      if (!productId) continue;

      const qty = parseInt(item.quantity, 10);
      if (!Number.isInteger(qty) || qty <= 0 || qty > 1000) {
        return NextResponse.json(
          { message: `تعداد سفارش برای کالای «${item.name || item.productName || "انتخابی"}» نامعتبر است.` },
          { status: 400 }
        );
      }

      const dbProduct = await prisma.product.findUnique({
        where: { id: productId },
        include: { images: true },
      });

      if (!dbProduct) {
        return NextResponse.json(
          { message: `کالای «${item.name || "مورد نظر"}» در فروشگاه یافت نشد.` },
          { status: 400 }
        );
      }

      if (dbProduct.stock < qty) {
        return NextResponse.json(
          {
            message: `موجودی کالای «${dbProduct.name}» کافی نمی‌باشد (موجودی فعلی: ${dbProduct.stock} عدد).`,
          },
          { status: 400 }
        );
      }

      // Quantity tiered discount calculation (5% at >= 10 units, 10% at >= 50 units)
      let discountPercent = 0;
      if (qty >= 50) {
        discountPercent = 10;
      } else if (qty >= 10) {
        discountPercent = 5;
      }

      const unitPrice = calculateTieredUnitPrice(dbProduct.price, qty);
      const itemTotal = unitPrice * qty;
      const rawItemTotal = dbProduct.price * qty;
      totalWholesaleDiscountSavings += rawItemTotal - itemTotal;
      serverSubtotal += itemTotal;

      const primaryImg =
        dbProduct.images.find((img) => img.isPrimary)?.url ||
        dbProduct.images[0]?.url ||
        item.image ||
        item.productImage ||
        null;

      validatedItems.push({
        productId: dbProduct.id,
        productName: dbProduct.name,
        productImage: primaryImg,
        price: unitPrice,
        quantity: qty,
        discountPercent,
        total: itemTotal,
      });
    }

    if (validatedItems.length === 0) {
      return NextResponse.json({ message: "سبد خرید خالی است." }, { status: 400 });
    }

    // 2. Server-Side Coupon Verification
    let serverCouponDiscount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });

      if (coupon && coupon.isActive) {
        const notExpired = !coupon.expiresAt || new Date(coupon.expiresAt) >= new Date();
        const meetsMin = !coupon.minOrderAmount || serverSubtotal >= coupon.minOrderAmount;

        if (notExpired && meetsMin) {
          if (coupon.discountPercent) {
            serverCouponDiscount = Math.round((serverSubtotal * coupon.discountPercent) / 100);
          } else if (coupon.discountAmount) {
            serverCouponDiscount = Math.min(coupon.discountAmount, serverSubtotal);
          }
        }
      }
    }

    // 3. Server-Calculated Shipping Rate
    const selectedMethodKey = shippingMethod || "isfahan_express";
    let serverShippingCost = SHIPPING_RATES[selectedMethodKey] ?? 45000;
    if (serverSubtotal >= 2000000 && selectedMethodKey !== "in_person_pickup" && selectedMethodKey !== "najafabad_pickup") {
      serverShippingCost = 0; // Free shipping over 2M Tomans
    }

    const totalDiscount = totalWholesaleDiscountSavings + serverCouponDiscount;
    const finalTotalAmount = Math.max(0, serverSubtotal - serverCouponDiscount + serverShippingCost);

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

    // Card-to-Card 8-Hour Inventory Hold Window
    const isCardToCard = paymentMethod === "card_to_card";
    const reservedUntil = isCardToCard ? new Date(Date.now() + 8 * 60 * 60 * 1000) : null;

    // 5. Create Order & Atomically Decrement Stock within Prisma $transaction
    const order = await prisma.$transaction(async (tx) => {
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

      return await tx.order.create({
        data: {
          orderNumber,
          customerName: customerName.trim(),
          customerPhone: normalizeIranianPhone(customerPhone) || customerPhone.trim(),
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
          subtotal: serverSubtotal + totalWholesaleDiscountSavings,
          discount: totalDiscount,
          totalAmount: finalTotalAmount,
          receiptImage: receiptImage || null,
          reservedUntil,
          notes: notes ? notes.trim() : null,
          items: {
            create: validatedItems,
          },
        },
      });
    });

    logger.info("Order successfully created", {
      orderNumber: order.orderNumber,
      totalAmount: finalTotalAmount,
      reservedUntil,
    });

    let redirectUrl = `/order-tracking/${order.orderNumber}`;
    if (paymentMethod === "zarinpal") {
      redirectUrl = `/zarinpal-mock?orderNumber=${order.orderNumber}&amount=${finalTotalAmount}`;
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      subtotal: serverSubtotal + totalWholesaleDiscountSavings,
      discount: totalDiscount,
      shippingCost: serverShippingCost,
      totalAmount: finalTotalAmount,
      paymentMethod: order.paymentMethod,
      reservedUntil: reservedUntil ? reservedUntil.toISOString() : null,
      redirectUrl,
    });
  } catch (error: any) {
    logger.error("Checkout creation error", error);
    return NextResponse.json(
      { message: error.message || "خطایی در ثبت سفارش رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 400 }
    );
  }
}
