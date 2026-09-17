import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/adminAuth";

export async function GET() {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const { orderId, orderStatus, paymentStatus, trackingCode } = await req.json();

    if (!orderId) {
      return NextResponse.json({ message: "شناسه سفارش الزامی است." }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: orderStatus || undefined,
        paymentStatus: paymentStatus || undefined,
        trackingCode: trackingCode !== undefined ? trackingCode : undefined,
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json({ message: "خطا در بروزرسانی سفارش." }, { status: 500 });
  }
}

async function deleteOrdersCascade(ids: string[]): Promise<number> {
  if (ids.length === 0) return 0;
  return await prisma.$transaction(async (tx) => {
    await tx.orderItem.deleteMany({
      where: { orderId: { in: ids } },
    });
    const res = await tx.order.deleteMany({
      where: { id: { in: ids } },
    });
    return res.count;
  });
}

export async function DELETE(req: NextRequest) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const url = new URL(req.url);
    let orderId: string | undefined = url.searchParams.get("orderId") || undefined;
    let deleteSampleOrders: boolean = url.searchParams.get("deleteSampleOrders") === "true";
    let orderIds: string[] | undefined;

    try {
      const body = await req.json();
      if (body.orderId) orderId = body.orderId;
      if (body.deleteSampleOrders !== undefined) deleteSampleOrders = Boolean(body.deleteSampleOrders);
      if (Array.isArray(body.orderIds)) orderIds = body.orderIds;
    } catch {
      // Body may be empty when using query parameters
    }

    // 1. Bulk purge sample/test orders
    if (deleteSampleOrders) {
      const sampleOrders = await prisma.order.findMany({
        where: {
          OR: [
            { orderNumber: { startsWith: "SH-TEST" } },
            { customerName: { contains: "تست" } },
            { customerPhone: { in: ["09130000000", "09120000000", "09000000000"] } },
            { notes: { contains: "تستی" } },
            { notes: { contains: "آزمایشی" } },
          ],
        },
        select: { id: true },
      });

      if (sampleOrders.length === 0) {
        return NextResponse.json({
          success: true,
          message: "هیچ سفارش نمونه یا تستی برای حذف یافت نشد.",
          deletedCount: 0,
        });
      }

      const sampleIds = sampleOrders.map((o) => o.id);
      const deletedCount = await deleteOrdersCascade(sampleIds);

      return NextResponse.json({
        success: true,
        message: `${deletedCount} سفارش آزمایشی با موفقیت پاکسازی شد.`,
        deletedCount,
      });
    }

    // 2. Bulk array of IDs
    if (orderIds && orderIds.length > 0) {
      const deletedCount = await deleteOrdersCascade(orderIds);

      return NextResponse.json({
        success: true,
        message: `${deletedCount} سفارش با موفقیت حذف شدند.`,
        deletedCount,
      });
    }

    // 3. Single order deletion
    if (!orderId) {
      return NextResponse.json(
        { message: "شناسه سفارش جهت حذف الزامی است." },
        { status: 400 }
      );
    }

    const existing = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, orderNumber: true },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "سفارش مورد نظر یافت نشد." },
        { status: 404 }
      );
    }

    await deleteOrdersCascade([existing.id]);

    return NextResponse.json({
      success: true,
      message: `سفارش شماره ${existing.orderNumber} با موفقیت حذف شد.`,
      deletedCount: 1,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "خطای نامشخص";
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { message: "خطا در حذف سفارش.", error: errorMsg },
      { status: 500 }
    );
  }
}

