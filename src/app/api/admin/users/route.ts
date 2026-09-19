import { NextRequest, NextResponse } from "next/server";
import { checkAdminSession, parseAdminPermissions } from "@/lib/adminAuth";
import { ADMIN_PHONES } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyPassword, hashPassword } from "@/lib/password";
import { normalizeIranianPhone } from "@/lib/utils";
import { checkRateLimit } from "@/lib/rateLimit";

const PASSWORD_COMPLEXITY_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

/**
 * GET /api/admin/users
 * Returns list of administrative accounts with assigned module permissions.
 * Accessible exclusively to Root Owner.
 */
export async function GET() {
  try {
    const auth = await checkAdminSession();
    if (!auth.isAdmin) return auth.response;

    if (!auth.isRootOwner) {
      return NextResponse.json(
        {
          error: "FORBIDDEN_ROOT_ONLY",
          message: "دسترسی به مدیریت مدیران صرفاً برای مدیر ارشد (مالک سیستم) مجاز است.",
        },
        { status: 403 }
      );
    }

    const adminUsers = await prisma.user.findMany({
      where: {
        OR: [{ role: "ADMIN" }, { phone: { in: ADMIN_PHONES } }],
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        tokenVersion: true,
        adminPermissions: true,
        isSuspended: true,
        createdAt: true,
      },
    });

    const users = adminUsers.map((u) => {
      const isRoot = ADMIN_PHONES.includes(u.phone);
      const perms = isRoot ? ["ALL"] : parseAdminPermissions(u.adminPermissions);
      return {
        id: u.id,
        name: u.name || (isRoot ? "مدیر ارشد فروشگاه" : "مدیر سیستم"),
        phone: u.phone,
        role: "ADMIN",
        isRootOwner: isRoot,
        permissions: perms,
        isSuspended: u.isSuspended,
        createdAt: u.createdAt.toISOString(),
      };
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("[GET_ADMIN_USERS_ERROR]", error instanceof Error ? error.message : "Unknown");
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "خطایی در دریافت لیست مدیران رخ داد." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users
 * Provision a new secondary administrator account.
 * Requires Root Owner password re-authentication.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await checkAdminSession();
    if (!auth.isAdmin) return auth.response;
    const { isRootOwner, session } = auth;

    if (!isRootOwner) {
      return NextResponse.json(
        {
          error: "FORBIDDEN_ROOT_ONLY",
          message: "دسترسی به مدیریت مدیران صرفاً برای مدیر ارشد (مالک سیستم) مجاز است.",
        },
        { status: 403 }
      );
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const rateLimitCheck = checkRateLimit(`provision-admin:${session.user.id}:${ip}`, 10, 15 * 60);
    if (!rateLimitCheck.success) {
      return NextResponse.json(
        {
          error: "TOO_MANY_REQUESTS",
          message: "تعداد درخواست‌های ارسالی بیش از حد مجاز است. لطفاً ۱۵ دقیقه بعد تلاش کنید.",
          retryAfterSeconds: rateLimitCheck.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "INVALID_INPUT", message: "اطلاعات ارسالی نامعتبر است." },
        { status: 400 }
      );
    }

    const { phone, name, initialPassword, permissions, rootPassword } = body;

    if (!phone || !name || !initialPassword || !permissions || !rootPassword) {
      return NextResponse.json(
        { error: "MISSING_FIELDS", message: "تکمیل کلیه فیلدهای الزامی الزامی است." },
        { status: 400 }
      );
    }

    // Mandatory Root Password Re-authentication
    const rootUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true },
    });

    if (!rootUser || !verifyPassword(rootPassword, rootUser.password)) {
      return NextResponse.json(
        {
          error: "INVALID_ROOT_CREDENTIALS",
          message: "کلمه عبور مدیر ارشد نادرست است. عملیات لغو گردید.",
        },
        { status: 401 }
      );
    }

    const normalizedPhone = normalizeIranianPhone(phone);
    if (!normalizedPhone) {
      return NextResponse.json(
        { error: "INVALID_PHONE", message: "شماره موبایل وارد شده نامعتبر است." },
        { status: 400 }
      );
    }

    if (!PASSWORD_COMPLEXITY_REGEX.test(initialPassword)) {
      return NextResponse.json(
        {
          error: "INVALID_PASSWORD_COMPLEXITY",
          message: "کلمه عبور اولیه باید حداقل ۸ کاراکتر و شامل حروف و ارقام باشد.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(permissions) || permissions.length === 0) {
      return NextResponse.json(
        {
          error: "INVALID_PERMISSIONS",
          message: "حداقل یک بخش مجاز باید برای مدیر ثانویه انتخاب شود.",
        },
        { status: 400 }
      );
    }

    // Check if phone already exists
    const existing = await prisma.user.findUnique({
      where: { phone: normalizedPhone },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: "USER_ALREADY_EXISTS",
          message: "کاربری با این شماره موبایل از قبل در سامانه ثبت شده است.",
        },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(initialPassword);

    const newUser = await prisma.user.create({
      data: {
        phone: normalizedPhone,
        name: name.trim(),
        password: hashedPassword,
        role: "ADMIN",
        isVerified: true,
        adminPermissions: JSON.stringify(permissions),
        tokenVersion: 0,
        isSuspended: false,
        city: "نجف‌آباد",
      },
      select: {
        id: true,
        name: true,
        phone: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "مدیر جدید با موفقیت ایجاد گردید.",
        user: {
          id: newUser.id,
          name: newUser.name,
          phone: newUser.phone,
          permissions,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST_ADMIN_USERS_ERROR]", error instanceof Error ? error.message : "Unknown");
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "خطایی در ایجاد مدیر جدید رخ داد." },
      { status: 500 }
    );
  }
}
