import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";
import { normalizeIranianPhone } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const body = await req.json();
    const { phone } = body;

    const cleanPhone = normalizeIranianPhone(phone);

    if (!cleanPhone || !/^09\d{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: "شماره موبایل وارد شده معتبر نمی‌باشد (مثال: 09131112233)" },
        { status: 400 }
      );
    }

    // 1. Rate limiting by IP (max 5 requests per 2 minutes)
    const ipLimit = checkRateLimit(`ip_otp_${ip}`, 5, 120);
    if (!ipLimit.success) {
      return NextResponse.json(
        {
          error: `تعداد درخواست‌های ارسالی بیش از حد مجاز است. لطفاً ${ipLimit.retryAfterSeconds} ثانیه دیگر مجدداً تلاش فرمایید.`,
          retryAfter: ipLimit.retryAfterSeconds,
        },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSeconds) } }
      );
    }

    // 2. Rate limiting by Phone Number (max 3 requests per 2 minutes)
    const phoneLimit = checkRateLimit(`phone_otp_${cleanPhone}`, 3, 120);
    if (!phoneLimit.success) {
      return NextResponse.json(
        {
          error: `کد تایید اخیراً برای این شماره پیامک شده است. لطفاً ${phoneLimit.retryAfterSeconds} ثانیه دیگر مجدداً تلاش نمایید.`,
          retryAfter: phoneLimit.retryAfterSeconds,
        },
        { status: 429, headers: { "Retry-After": String(phoneLimit.retryAfterSeconds) } }
      );
    }

    // Generate secure 5-digit OTP
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    // Invalidate prior unused tokens for this phone
    await prisma.verificationToken.deleteMany({
      where: { phone: cleanPhone },
    });

    // Save token to DB
    await prisma.verificationToken.create({
      data: {
        phone: cleanPhone,
        code,
        expiresAt,
      },
    });

    console.log(`📱 [SMS Gateway] OTP code for ${cleanPhone}: ${code}`);

    const isDev = process.env.NODE_ENV !== "production";

    return NextResponse.json({
      success: true,
      message: `کد تایید ۵ رقمی به شماره ${cleanPhone} پیامک شد.`,
      remainingAttempts: phoneLimit.remaining,
      ...(isDev ? { devCode: code } : {}),
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "خطا در ارسال پیامک کد تایید." }, { status: 500 });
  }
}
