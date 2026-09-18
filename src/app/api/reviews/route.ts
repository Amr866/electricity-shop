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
        isVerified: false,
      },
    });

    return NextResponse.json({
      success: true,
      review,
      message: "دیدگاه شما با موفقیت ثبت گردید و پس از بازبینی و تایید مدیریت منتشر خواهد شد.",
    });
  } catch (error: any) {
    console.error("Review submission error:", error);
    return NextResponse.json({ message: "خطا در ثبت نظر." }, { status: 500 });
  }
}
