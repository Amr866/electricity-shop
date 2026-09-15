import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { toAsciiDigits } from "@/lib/utils";

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

    if (existingRepair.status !== "COST_ESTIMATED" && existingRepair.costApprovalStatus !== "PENDING") {
      return NextResponse.json(
        {
          error: "این درخواست در وضعیت انتظار برای تایید هزینه قرار ندارد.",
          currentStatus: existingRepair.status,
          currentApproval: existingRepair.costApprovalStatus,
        },
        { status: 400 }
      );
    }

    const isApproved = action === "APPROVE";
    const newStatus = isApproved ? "REPAIRING" : "CANCELLED";
    const costApprovalStatus = isApproved ? "APPROVED" : "DECLINED";

    const updatedRepair = await prisma.repairRequest.update({
      where: { trackingCode: cleanCode },
      data: {
        status: newStatus,
        costApprovalStatus,
        approvalChannel: "PORTAL",
        approvalTimestamp: new Date(),
        adminNotes: existingRepair.adminNotes
          ? `${existingRepair.adminNotes}\n[سیستم]: هزینه تعمیر توسط مشتری از طریق پرتال آنلاین در تاریخ ${new Date().toLocaleDateString("fa-IR")} ${isApproved ? "تایید شد" : "رد شد"}.`
          : `[سیستم]: هزینه تعمیر توسط مشتری از طریق پرتال آنلاین ${isApproved ? "تایید شد" : "رد شد"}.`,
      },
    });

    logger.info("Repair cost approval updated successfully", {
      trackingCode: cleanCode,
      newStatus,
      costApprovalStatus,
    });

    return NextResponse.json({
      success: true,
      newStatus,
      costApprovalStatus,
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
