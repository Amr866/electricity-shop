import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { toAsciiDigits, normalizeIranianPhone } from "@/lib/utils";
import { evaluateCostApprovalDecision } from "@/lib/repairLifecycle";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trackingCode, action } = body;

    logger.info("Inbound repair cost approval request", { trackingCode, action });

    if (!trackingCode || typeof trackingCode !== "string" || !action || typeof action !== "string") {
      return NextResponse.json(
        { error: "کد رهگیری و نوع عملیات تایید الزامی است." },
        { status: 400 }
      );
    }

    const cleanCode = toAsciiDigits(trackingCode).trim().toUpperCase();

    if (action !== "APPROVE" && action !== "DECLINE") {
      return NextResponse.json(
        { error: "عملیات ارسالی نامعتبر است (APPROVE یا DECLINE)." },
        { status: 400 }
      );
    }

    const existingRepair = await prisma.repairRequest.findUnique({
      where: { trackingCode: cleanCode },
    });

    if (!existingRepair) {
      return NextResponse.json(
        { error: "درخواست تعمیری با این کد رهگیری یافت نشد." },
        { status: 404 }
      );
    }

    // Access Control Gate: Verify session ownership, admin authority, or matching customer phone
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN";
    const isOwner = Boolean(
      session?.user && (
        (existingRepair.userId && session.user.id === existingRepair.userId) ||
        (existingRepair.customerPhone && session.user.phone === existingRepair.customerPhone)
      )
    );

    const inputPhone = body.phone ? normalizeIranianPhone(String(body.phone)) : null;
    const isPhoneMatched = Boolean(inputPhone && inputPhone === existingRepair.customerPhone);

    if (!isAdmin && !isOwner && !isPhoneMatched) {
      logger.warn("[Repair Approval] Unauthorized attempt to modify repair quote status", {
        trackingCode: cleanCode,
        ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"),
      });
      return NextResponse.json(
        { error: "جهت تایید یا انصراف هزینه تعمیر، ورود به حساب کاربری یا درج شماره تماس ثبت‌شده الزامی است." },
        { status: 403 }
      );
    }

    const decisionResult = evaluateCostApprovalDecision(
      existingRepair.status,
      existingRepair.costApprovalStatus,
      action,
      "PORTAL"
    );

    if (!decisionResult.isValid) {
      return NextResponse.json(
        {
          error: decisionResult.error,
          currentStatus: existingRepair.status,
          currentApproval: existingRepair.costApprovalStatus,
        },
        { status: 400 }
      );
    }

    const isApproved = action === "APPROVE";

    const updatedRepair = await prisma.repairRequest.update({
      where: { trackingCode: cleanCode },
      data: {
        status: decisionResult.nextStatus,
        costApprovalStatus: decisionResult.nextApprovalStatus,
        approvalChannel: decisionResult.approvalChannel,
        approvalTimestamp: decisionResult.timestamp,
        adminNotes: existingRepair.adminNotes
          ? `${existingRepair.adminNotes}\n${decisionResult.noteAppend}`
          : decisionResult.noteAppend,
      },
    });

    logger.info("Repair cost approval updated successfully", {
      trackingCode: cleanCode,
      newStatus: decisionResult.nextStatus,
      costApprovalStatus: decisionResult.nextApprovalStatus,
    });

    return NextResponse.json({
      success: true,
      newStatus: decisionResult.nextStatus,
      costApprovalStatus: decisionResult.nextApprovalStatus,
      message: isApproved
        ? "هزینه تعمیر با موفقیت تایید شد و دستگاه وارد مرحله تعمیر گردید."
        : "انصراف از تعمیر ثبت شد. دستگاه بدون تعمیر جهت تحویل آماده خواهد شد.",
      repair: updatedRepair,
    });
  } catch (error) {
    logger.error("Error processing repair cost approval", error);
    return NextResponse.json(
      { error: "خطای سرور در ثبت تایید هزینه تعمیر." },
      { status: 500 }
    );
  }
}
