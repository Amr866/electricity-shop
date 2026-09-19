import { NextRequest, NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { ADMIN_PHONES } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyPassword, hashPassword } from "@/lib/password";

import { checkRateLimit } from "@/lib/rateLimit";

const PASSWORD_COMPLEXITY_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

/**
 * PATCH /api/admin/users/[id]
 * Modifies permissions, suspension status, or resets password of a secondary admin.
 * Requires Root Owner password re-authentication.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    const rateLimitCheck = checkRateLimit(`modify-admin:${session.user.id}:${ip}`, 15, 15 * 60);
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

    const { name, permissions, isSuspended, resetPassword, rootPassword } = body;

    if (!rootPassword || typeof rootPassword !== "string") {
      return NextResponse.json(
        { error: "MISSING_ROOT_PASSWORD", message: "تایید کلمه عبور مدیر ارشد الزامی است." },
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

    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, phone: true, role: true, isSuspended: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "USER_NOT_FOUND", message: "حساب مدیر مورد نظر یافت نشد." },
        { status: 404 }
      );
    }

    // SuperAdmin Immutability Guard: Root Owner accounts cannot be suspended or demoted
    const isTargetRootOwner = ADMIN_PHONES.includes(targetUser.phone);
    if (isTargetRootOwner && isSuspended === true) {
      return NextResponse.json(
        {
          error: "CANNOT_MODIFY_ROOT_OWNER",
          message: "امکان تعلیق حساب مالک اصلی فروشگاه وجود ندارد.",
        },
        { status: 400 }
      );
    }

    const updateData: {
      name?: string;
      adminPermissions?: string;
      isSuspended?: boolean;
      tokenVersion?: { increment: number };
      password?: string;
    } = {};

    if (typeof name === "string" && name.trim()) {
      updateData.name = name.trim();
    }

    if (Array.isArray(permissions) && !isTargetRootOwner) {
      updateData.adminPermissions = JSON.stringify(permissions);
    }

    if (typeof isSuspended === "boolean" && !isTargetRootOwner) {
      updateData.isSuspended = isSuspended;
      // Per FR-063 & FR-065: If suspending, atomically increment tokenVersion to terminate active JWTs immediately
      if (isSuspended) {
        updateData.tokenVersion = { increment: 1 };
      }
    }

    if (typeof resetPassword === "string" && resetPassword.trim()) {
      if (!PASSWORD_COMPLEXITY_REGEX.test(resetPassword)) {
        return NextResponse.json(
          {
            error: "INVALID_PASSWORD_COMPLEXITY",
            message: "کلمه عبور جدید باید حداقل ۸ کاراکتر و شامل حروف و ارقام باشد.",
          },
          { status: 400 }
        );
      }
      updateData.password = hashPassword(resetPassword);
      updateData.tokenVersion = { increment: 1 };
    }

    await prisma.user.update({
      where: { id: targetUser.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "مشخصات حساب مدیر با موفقیت به‌روزرسانی شد.",
    });
  } catch (error) {
    console.error("[PATCH_ADMIN_USER_ERROR]", error instanceof Error ? error.message : "Unknown");
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "خطایی در ویرایش حساب مدیر رخ داد." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Permanently revoke and delete a secondary administrator account.
 * Root Owner is strictly protected from deletion.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    const rateLimitCheck = checkRateLimit(`delete-admin:${session.user.id}:${ip}`, 10, 15 * 60);
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
    const rootPassword = body?.rootPassword;

    if (!rootPassword || typeof rootPassword !== "string") {
      return NextResponse.json(
        { error: "MISSING_ROOT_PASSWORD", message: "تایید کلمه عبور مدیر ارشد الزامی است." },
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

    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, phone: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "USER_NOT_FOUND", message: "حساب مدیر مورد نظر یافت نشد." },
        { status: 404 }
      );
    }

    // SuperAdmin Immutability Guard: Root Owner accounts cannot be deleted
    if (ADMIN_PHONES.includes(targetUser.phone) || targetUser.id === rootUser.id) {
      return NextResponse.json(
        {
          error: "CANNOT_DELETE_ROOT_OWNER",
          message: "امکان حذف حساب مالک اصلی فروشگاه وجود ندارد.",
        },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: targetUser.id },
    });

    return NextResponse.json({
      success: true,
      message: "حساب مدیر با موفقیت حذف گردید.",
    });
  } catch (error) {
    console.error("[DELETE_ADMIN_USER_ERROR]", error instanceof Error ? error.message : "Unknown");
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "خطایی در حذف حساب مدیر رخ داد." },
      { status: 500 }
    );
  }
}
