import { NextRequest, NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { verifyPassword, hashPassword } from "@/lib/password";
import { checkRateLimit } from "@/lib/rateLimit";

const PASSWORD_COMPLEXITY_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export async function POST(req: NextRequest) {
  try {
    const auth = await checkAdminSession();
    if (!auth.isAdmin) {
      return auth.response;
    }
    const session = auth.session;

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const rateLimitCheck = checkRateLimit(`change-pw:${session.user.id}:${ip}`, 5, 15 * 60);

    if (!rateLimitCheck.success) {
      return NextResponse.json(
        {
          error: "TOO_MANY_REQUESTS",
          message: "تعداد دفعات تلاش ناموفق بیش از حد مجاز است. لطفاً ۱۵ دقیقه بعد تلاش کنید.",
          retryAfterSeconds: rateLimitCheck.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimitCheck.retryAfterSeconds.toString(),
          },
        }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "INVALID_INPUT", message: "اطلاعات ارسالی نامعتبر است." },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || typeof currentPassword !== "string") {
      return NextResponse.json(
        { error: "INVALID_INPUT", message: "وارد کردن کلمه عبور فعلی الزامی است." },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== "string" || !confirmPassword || typeof confirmPassword !== "string") {
      return NextResponse.json(
        { error: "INVALID_INPUT", message: "کلمه عبور جدید و تکرار آن الزامی است." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "PASSWORD_MISMATCH", message: "کلمه عبور جدید با تکرار آن مطابقت ندارد." },
        { status: 400 }
      );
    }

    if (!PASSWORD_COMPLEXITY_REGEX.test(newPassword)) {
      return NextResponse.json(
        {
          error: "INVALID_PASSWORD_COMPLEXITY",
          message: "کلمه عبور جدید باید حداقل ۸ کاراکتر و شامل حروف و ارقام باشد.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        password: true,
        tokenVersion: true,
      },
    });

    if (!user || !verifyPassword(currentPassword, user.password)) {
      return NextResponse.json(
        {
          error: "UNAUTHORIZED",
          message: "کلمه عبور فعلی نادرست است یا نشست معتبر نیست.",
        },
        { status: 401 }
      );
    }

    const hashedNewPassword = hashPassword(newPassword);

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
        tokenVersion: { increment: 1 },
      },
      select: {
        tokenVersion: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "کلمه عبور با موفقیت به‌روزرسانی شد. نشست‌های سایر دستگاه‌ها نامعتبر گردیدند.",
      newTokenVersion: updated.tokenVersion,
    });
  } catch (error) {
    console.error("[ADMIN_CHANGE_PASSWORD_ERROR]", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "خطایی در پردازش درخواست تغییر کلمه عبور رخ داد." },
      { status: 500 }
    );
  }
}
