import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone || !/^09\d{9}$/.test(phone.trim())) {
      return NextResponse.json(
        { error: "شماره موبایل وارد شده معتبر نمی‌باشد (مثال: 09131112233)" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();

    // Generate 5-digit OTP
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    // Delete old tokens for this phone
    await prisma.verificationToken.deleteMany({
      where: { phone: cleanPhone },
    });

    // Save token
    await prisma.verificationToken.create({
      data: {
        phone: cleanPhone,
        code,
        expiresAt,
      },
    });

    console.log(`📱 [SMS Gateway] OTP for ${cleanPhone}: ${code}`);

    return NextResponse.json({
      success: true,
      message: `کد تایید ۵ رقمی به شماره ${cleanPhone} ارسال گردید.`,
      // Return code in dev for testing convenience
      devCode: code,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "خطا در ارسال پیامک کد تایید." }, { status: 500 });
  }
}
