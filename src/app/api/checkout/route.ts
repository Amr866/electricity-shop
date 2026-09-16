import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeIranianPhone } from "@/lib/utils";
import { logger } from "@/lib/logger";
import { logPaymentTransaction } from "@/lib/paymentLogger";
import {
  SHIPPING_RATES,
  calculateTieredUnitPrice,
  calculateOrderFinancials,
  sortItemsForDeterministicLock,
  generateOrderNumber,
  calculateReservationExpiry,
  validateCorporateInvoice,
} from "@/lib/checkoutEngine";

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

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    logger.info("Inbound checkout order creation request", {
      method: "POST",
      pathname: "/api/checkout",
      ip,
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
    const corpCheck = validateCorporateInvoice({
      isCorporate: Boolean(isCorporate),
      companyName,
      nationalCode,
      economicCode,
    });
    if (!corpCheck.isValid) {
      const firstError = Object.values(corpCheck.errors)[0];
      return NextResponse.json({ message: firstError }, { status: 400 });
    }

    // 1. Batch fetch products, auth session, and coupon concurrently (Vercel async-parallel pattern)
    const requestedProductIds: string[] = Array.from(
      new Set<string>(
        items
          .map((item: any) => item.productId || item.id)
          .filter((id: any): id is string => typeof id === "string" && Boolean(id.trim()))
      )
    );

    const [session, dbProducts, coupon] = await Promise.all([
      getServerSession(authOptions),
      prisma.product.findMany({
        where: { id: { in: requestedProductIds } },
        include: { images: true },
      }),
      couponCode
        ? prisma.coupon.findUnique({
            where: { code: couponCode.trim().toUpperCase() },
          })
        : Promise.resolve(null),
    ]);

    const userId = session?.user?.id || null;

    type ProductWithImages = (typeof dbProducts)[number];
    const productMap = new Map<string, ProductWithImages>(
      dbProducts.map((p) => [p.id, p])
    );

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

      const dbProduct = productMap.get(productId);

      if (!dbProduct) {
        return NextResponse.json(
          { message: `کالای «${item.name || item.productName || productId}» در سیستم یافت نشد.` },
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

      // Server-authoritative quantity tiered discount calculation via checkoutEngine
      const { unitPrice, discountPercent } = calculateTieredUnitPrice(dbProduct.price, qty);
      const itemTotal = unitPrice * qty;

      const primaryImg =
        dbProduct.images?.find((img: any) => img.isPrimary)?.url ||
        dbProduct.images?.[0]?.url ||
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

    // 2. Server-Side Financials, Tiered Wholesale Discounts, Coupon & Shipping Calculation via checkoutEngine
    const selectedMethodKey = shippingMethod || "isfahan_express";
    const rawItemsForEngine = validatedItems.map((it) => ({
      productId: it.productId,
      basePrice: productMap.get(it.productId)!.price,
      quantity: it.quantity,
      productName: it.productName,
      productImage: it.productImage || undefined,
    }));

    const financials = calculateOrderFinancials(
      rawItemsForEngine,
      selectedMethodKey,
      coupon,
      { enableFreeShippingThreshold: true }
    );

    const totalWholesaleDiscountSavings = financials.wholesaleSavings;
    const serverSubtotal = financials.netItemsTotal;
    const serverCouponDiscount = financials.couponDiscount;
    const serverShippingCost = financials.shippingCost;
    const totalDiscount = totalWholesaleDiscountSavings + serverCouponDiscount;
    const finalTotalAmount = financials.finalTotalAmount;

    // 4. Generate unique alphanumeric order number: SH-YYMMDD-XXX
    const orderNumber = generateOrderNumber();

    let paymentStatus = "PENDING";
    let orderStatus = "PENDING";

    if (paymentMethod === "cod_isfahan") {
      paymentStatus = "PENDING";
      orderStatus = "PROCESSING";
    }

    // Card-to-Card 8-Hour Inventory Hold Window
    const reservedUntil = calculateReservationExpiry(paymentMethod);

    // 5. Create Order & Atomically Decrement Stock within Prisma $transaction
    // CRITICAL: Sort items deterministically by productId to prevent PostgreSQL 40P01 deadlocks
    const sortedItemsToLock = sortItemsForDeterministicLock(validatedItems);

    const order = await prisma.$transaction(async (tx) => {
      for (const item of sortedItemsToLock) {
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

    // Record initial transaction audit log
    await logPaymentTransaction({
      orderId: order.id,
      orderNumber: order.orderNumber,
      gateway: order.paymentMethod,
      transactionType: "INITIATE",
      status: "PENDING",
      amount: order.totalAmount,
      metadata: {
        shippingMethod: order.shippingMethod,
        isCorporate: order.isCorporate,
      },
      ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"),
      userAgent: req.headers.get("user-agent"),
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
