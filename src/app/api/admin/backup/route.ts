import { NextRequest, NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const auth = await checkAdminSession();
  if (!auth.isAdmin) return auth.response!;

  try {
    const { searchParams } = new URL(req.url);
    const isDownload = searchParams.get("download") === "true";

    // 1. Fetch complete relational dataset from PostgreSQL
    const [
      categories,
      products,
      users,
      orders,
      repairs,
      reviews,
      coupons,
      settings,
    ] = await Promise.all([
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.product.findMany({
        include: {
          images: true,
          specs: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          role: true,
          address: true,
          city: true,
          postalCode: true,
          companyName: true,
          economicCode: true,
          nationalCode: true,
          isVerified: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.findMany({
        include: {
          items: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.repairRequest.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.coupon.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.storeSetting.findMany({
        orderBy: { key: "asc" },
      }),
    ]);

    const timestamp = new Date().toISOString();
    const formattedDate = new Date()
      .toLocaleDateString("fa-IR")
      .replace(/\//g, "-");

    const backupPayload = {
      metadata: {
        application: "فروشگاه و کارگاه تخصصی برق شیاسی نجف‌آباد",
        version: "1.0.0",
        engine: "PostgreSQL with Prisma ORM",
        exportedAt: timestamp,
        exportedBy: auth.session?.user?.name || "مدیریت ارشد",
        stats: {
          categoriesCount: categories.length,
          productsCount: products.length,
          usersCount: users.length,
          ordersCount: orders.length,
          repairsCount: repairs.length,
          reviewsCount: reviews.length,
          couponsCount: coupons.length,
          settingsCount: settings.length,
        },
      },
      data: {
        categories,
        products,
        users,
        orders,
        repairs,
        reviews,
        coupons,
        settings,
      },
    };

    // If download requested: return as downloadable file attachment
    if (isDownload) {
      const jsonString = JSON.stringify(backupPayload, null, 2);
      const filename = `shiasi-electric-backup-${formattedDate}.json`;

      return new NextResponse(jsonString, {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }

    // Otherwise return metadata and status preview
    return NextResponse.json({
      success: true,
      metadata: backupPayload.metadata,
    });
  } catch (error) {
    console.error("Database backup generation error:", error);
    return NextResponse.json(
      { error: "خطا در استخراج فایل پشتیبان پایگاه داده." },
      { status: 500 }
    );
  }
}
