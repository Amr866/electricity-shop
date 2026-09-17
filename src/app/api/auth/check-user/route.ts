import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeIranianPhone } from "@/lib/utils";
import { ADMIN_PHONES } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawPhone = body?.phone;

    if (!rawPhone || typeof rawPhone !== "string") {
      return NextResponse.json(
        { error: "شماره موبایل الزامی است." },
        { status: 400 }
      );
    }

    const phone = normalizeIranianPhone(rawPhone);
    if (!phone) {
      return NextResponse.json(
        { error: "شماره موبایل وارد شده نامعتبر است (فرمت صحیح: ۰۹۱۲۳۴۵۶۷۸۹)." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { phone },
      select: {
        id: true,
        name: true,
        role: true,
        password: true,
      },
    });

    const isMasterAdmin = ADMIN_PHONES.includes(phone);
    const isAdmin = isMasterAdmin || user?.role === "ADMIN";
    const role = isAdmin ? "ADMIN" : (user?.role || "CUSTOMER");
    const hasPassword = Boolean(user?.password);

    return NextResponse.json({
      exists: Boolean(user),
      role,
      hasPassword,
      name: user?.name || null,
    });
  } catch (error: unknown) {
    console.error("Error in /api/auth/check-user:", error);
    return NextResponse.json(
      { error: "خطایی در بررسی وضعیت حساب کاربری رخ داد." },
      { status: 500 }
    );
  }
}
