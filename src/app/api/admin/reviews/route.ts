import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/adminAuth";
import {
  moderateReview,
  deleteReviewWithRecalc,
  deleteReviewsBulkWithRecalc,
} from "@/lib/admin-review-moderation";

export async function GET(req: NextRequest) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // "pending" | "verified" | "all"
    const productId = searchParams.get("productId");
    const search = searchParams.get("search")?.trim();

    const where: any = {};

    if (status === "pending") {
      where.isVerified = false;
    } else if (status === "verified") {
      where.isVerified = true;
    }

    if (productId) {
      where.productId = productId;
    }

    if (search) {
      where.OR = [
        { authorName: { contains: search, mode: "insensitive" } },
        { comment: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { product: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            rating: true,
            reviewCount: true,
            images: {
              where: { isPrimary: true },
              take: 1,
              select: { url: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const baseCountFilter = productId ? { productId } : {};
    const [total, pending, verified] = await Promise.all([
      prisma.review.count({ where: baseCountFilter }),
      prisma.review.count({ where: { ...baseCountFilter, isVerified: false } }),
      prisma.review.count({ where: { ...baseCountFilter, isVerified: true } }),
    ]);

    return NextResponse.json({
      success: true,
      reviews,
      stats: {
        total,
        pending,
        verified,
      },
    });
  } catch (error: any) {
    console.error("Error fetching admin reviews:", error);
    return NextResponse.json(
      { message: error.message || "خطا در دریافت لیست نظرات." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const data = await req.json();
    const { reviewId, isVerified } = data;

    if (!reviewId || typeof isVerified !== "boolean") {
      return NextResponse.json(
        { message: "شناسه نظر (reviewId) و وضعیت تایید (isVerified) الزامی است." },
        { status: 400 }
      );
    }

    const result = await moderateReview(reviewId, isVerified);

    return NextResponse.json({
      success: true,
      ...result,
      message: isVerified ? "نظر با موفقیت تایید و منتشر شد." : "وضعیت انتشار نظر لغو شد.",
    });
  } catch (error: any) {
    console.error("Error moderating review:", error);
    return NextResponse.json(
      { message: error.message || "خطا در ویرایش وضعیت نظر." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const data = await req.json();
    const { reviewId, reviewIds } = data;

    if (reviewId) {
      const result = await deleteReviewWithRecalc(reviewId);
      return NextResponse.json({
        ...result,
        message: "نظر مورد نظر با موفقیت حذف گردید.",
      });
    }

    if (Array.isArray(reviewIds) && reviewIds.length > 0) {
      const result = await deleteReviewsBulkWithRecalc(reviewIds);
      return NextResponse.json({
        ...result,
        message: `${result.deletedCount} نظر با موفقیت حذف شدند.`,
      });
    }

    return NextResponse.json(
      { message: "شناسه نظر یا آرایه‌ای از شناسه‌های نظرات جهت حذف الزامی است." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error deleting review(s):", error);
    return NextResponse.json(
      { message: error.message || "خطا در حذف نظر." },
      { status: 500 }
    );
  }
}
