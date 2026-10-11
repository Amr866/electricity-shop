import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toEnglishDigits } from "@/lib/utils";
import { checkRateLimit } from "@/lib/rateLimit";

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const rateCheck = checkRateLimit(`order-lookup-${ip}`, 5, 60);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "تعداد درخواست‌های استعلام بیش از حد مجاز است. لطفاً کمی بعد تلاش کنید." },
        { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSeconds) } }
      );
    }

    const { searchParams } = new URL(request.url);
    const rawPhone = searchParams.get("phone") || "";
    const cleanPhone = toEnglishDigits(rawPhone.trim()).replace(/[^\d]/g, "");

    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { error: "لطفاً شماره موبایل معتبر ۱۱ رقمی وارد نمایید." },
        { status: 400 }
      );
    }

    // Lookup orders matching phone with flexible formatting (e.g. 0913... or 913...)
    const normalizedQuery = cleanPhone.startsWith("0") ? cleanPhone : `0${cleanPhone}`;
    const altQuery = cleanPhone.startsWith("0") ? cleanPhone.substring(1) : cleanPhone;

    const orders = await prisma.order.findMany({
      where: {
        customerPhone: {
          in: [normalizedQuery, altQuery],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      select: {
        id: true,
        orderNumber: true,
        orderStatus: true,
        paymentStatus: true,
        totalAmount: true,
        createdAt: true,
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error looking up orders by phone:", error);
    return NextResponse.json(
      { error: "خطا در برقراری ارتباط با پایگاه داده." },
      { status: 500 }
    );
  }
}
