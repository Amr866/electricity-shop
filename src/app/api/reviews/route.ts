import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { productId, authorName, city, rating, comment } = await req.json();

    if (!productId || !authorName || !comment) {
      return NextResponse.json(
        { message: "لطفاً نام و متن دیدگاه را وارد نمایید." },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        productId,
        authorName: authorName.trim(),
        city: city?.trim() || "اصفهان",
        rating: Math.min(Math.max(parseInt(rating, 10) || 5, 1), 5),
        comment: comment.trim(),
        isVerified: true,
      },
    });

    // Update product average rating and reviewCount
    const allReviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const avgRating =
      allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        reviewCount: allReviews.length,
        rating: Math.round(avgRating * 10) / 10,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    console.error("Review submission error:", error);
    return NextResponse.json({ message: "خطا در ثبت نظر." }, { status: 500 });
  }
}
