import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { toAsciiDigits } from "@/lib/utils";
import { evaluateCostApprovalDecision } from "@/lib/repairLifecycle";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trackingCode, action } = body;

    logger.info("Inbound repair cost approval request", { trackingCode, action });

    if (!trackingCode || !action) {
      return NextResponse.json(
        { error: "کد رهگیری و نوع عملیات تایید الزامی است." },
        { status: 400 }
      );
    }

    const cleanCode = toAsciiDigits(trackingCode).trim().toUpperCase();

    if (!["APPROVE", "DECLINE"].includes(action)) {
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
