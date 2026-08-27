import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json(
        { message: "لطفاً کد تخفیف را وارد کنید." },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json(
        { message: "کد تخفیف وارد شده معتبر نیست یا منقضی شده است." },
        { status: 404 }
      );
    }

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return NextResponse.json(
        {
          message: `حداقل مبلغ سفارش برای استفاده از این کد ${coupon.minOrderAmount.toLocaleString(
            "fa-IR"
          )} تومان می‌باشد.`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount: coupon.discountAmount,
      },
    });
  } catch (error) {
    console.error("Error verifying coupon:", error);
    return NextResponse.json(
      { message: "خطایی در بررسی کد تخفیف رخ داد." },
      { status: 500 }
    );
  }
}
