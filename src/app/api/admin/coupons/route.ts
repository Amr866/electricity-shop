import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/adminAuth";

export async function GET() {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, coupons });
  } catch (error: any) {
    return NextResponse.json({ message: "خطا در دریافت کدهای تخفیف." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const { code, discountPercent, discountAmount, minOrderAmount, maxDiscount, expiresAt, isActive } = await req.json();

    if (!code) {
      return NextResponse.json({ message: "کد تخفیف الزامی است." }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    const coupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        discountPercent: discountPercent ? parseInt(discountPercent, 10) : null,
        discountAmount: discountAmount ? parseInt(discountAmount, 10) : null,
        minOrderAmount: minOrderAmount ? parseInt(minOrderAmount, 10) : 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    console.error("Error creating coupon:", error);
    return NextResponse.json({ message: error.message || "خطا در ایجاد کد تخفیف." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const { id, code, discountPercent, discountAmount, minOrderAmount, isActive } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "شناسه کد تخفیف الزامی است." }, { status: 400 });
    }

    const cleanCode = code ? code.trim().toUpperCase() : undefined;

    const updated = await prisma.coupon.update({
      where: { id },
      data: {
        code: cleanCode,
        discountPercent: discountPercent !== undefined ? (discountPercent ? parseInt(discountPercent, 10) : null) : undefined,
        discountAmount: discountAmount !== undefined ? (discountAmount ? parseInt(discountAmount, 10) : null) : undefined,
        minOrderAmount: minOrderAmount !== undefined ? (minOrderAmount ? parseInt(minOrderAmount, 10) : 0) : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });

    return NextResponse.json({ success: true, coupon: updated });
  } catch (error: any) {
    console.error("Error updating coupon:", error);
    return NextResponse.json({ message: "خطا در ویرایش کد تخفیف." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "شناسه کد تخفیف الزامی است." }, { status: 400 });
    }

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: "خطا در حذف کد تخفیف." }, { status: 500 });
  }
}
