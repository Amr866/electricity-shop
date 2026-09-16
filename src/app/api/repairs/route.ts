import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeIranianPhone, toAsciiDigits } from "@/lib/utils";
import { logger } from "@/lib/logger";
import {
  generateRepairTrackingCode,
  getCostEstimationSmsPayload,
} from "@/lib/repairLifecycle";

// GET: Search repair requests by exact phone or tracking code, or return list for admin
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawQuery = searchParams.get("q") || "";
    const code = searchParams.get("code") || "";
    const phone = searchParams.get("phone") || "";

    logger.info("Inbound GET repairs request", { rawQuery, code, phone });

    let where: any = {};
    const query = (code || phone || rawQuery).trim();

    if (query) {
      const cleanQuery = query.trim();
      const englishQuery = toAsciiDigits(cleanQuery);
      const normalizedPhone = normalizeIranianPhone(cleanQuery);

      where = {
        OR: [
          { customerPhone: cleanQuery },
          { customerPhone: englishQuery },
          { customerPhone: normalizedPhone },
          { trackingCode: cleanQuery.toUpperCase() },
          { trackingCode: englishQuery.toUpperCase() },
        ],
      };
    }

    const repairs = await prisma.repairRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, repairs, ticket: repairs[0] || null });
  } catch (error) {
    logger.error("Error fetching repairs", error);
    return NextResponse.json({ error: "Failed to fetch repairs" }, { status: 500 });
  }
}

// POST: Submit new repair request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      applianceType,
      brandModel,
      issueDesc,
      deliveryType,
      photoUrl,
    } = body;

    logger.info("Inbound POST new repair request", { customerName, applianceType });

    if (!customerName || !customerPhone || !applianceType || !issueDesc) {
      return NextResponse.json({ error: "اطلاعات ضروری تکمیل نشده است." }, { status: 400 });
    }

    const normalizedPhone = normalizeIranianPhone(customerPhone) || toAsciiDigits(customerPhone).trim();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    // Generate collision-safe repair tracking code: REP-YYMMDD-XXXX
    const trackingCode = generateRepairTrackingCode();

    // Format admin notes with photo attachment if present
    const initialNotes = photoUrl ? `[تصویر ضمیمه]: ${photoUrl}` : null;

    const repair = await prisma.repairRequest.create({
      data: {
        trackingCode,
        customerName: customerName.trim(),
        customerPhone: normalizedPhone,
        userId,
        applianceType: applianceType.trim(),
        brandModel: brandModel ? brandModel.trim() : null,
        issueDesc: issueDesc.trim(),
        deliveryType: deliveryType || "in_person",
        status: "SUBMITTED",
        costApprovalStatus: "PENDING",
        adminNotes: initialNotes,
      },
    });

    logger.info("New repair ticket created", { trackingCode });

    return NextResponse.json({ success: true, repair, trackingCode }, { status: 201 });
  } catch (error) {
    logger.error("Error submitting repair request", error);
    return NextResponse.json({ error: "خطا در ثبت درخواست تعمیر." }, { status: 500 });
  }
}

// PATCH: Update repair status, costs, notes, or verbal phone approval (Admin/Technician)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isMasterAdmin = session?.user?.role === "ADMIN";

    if (!isMasterAdmin) {
      return NextResponse.json({ error: "دسترسی غیرمجاز. فقط مدیران یا تکنسین‌ها مجاز هستند." }, { status: 403 });
    }

    const body = await req.json();
    const { id, status, estimatedCost, finalCost, adminNotes, costApprovalStatus, approvalChannel } = body;

    if (!id) {
      return NextResponse.json({ error: "شناسه درخواست تعمیر الزامی است." }, { status: 400 });
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (estimatedCost !== undefined) updateData.estimatedCost = estimatedCost ? parseInt(estimatedCost, 10) : null;
    if (finalCost !== undefined) updateData.finalCost = finalCost ? parseInt(finalCost, 10) : null;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (costApprovalStatus !== undefined) {
      updateData.costApprovalStatus = costApprovalStatus;
      if (costApprovalStatus === "APPROVED") {
        updateData.approvalTimestamp = new Date();
      }
    }
    if (approvalChannel !== undefined) updateData.approvalChannel = approvalChannel;

    const updated = await prisma.repairRequest.update({
      where: { id },
      data: updateData,
    });

    logger.info("Repair ticket updated by admin", { id, status, costApprovalStatus });

    // Automated SMS notification dispatch per FR-016 when entering COST_ESTIMATED
    if (updateData.status === "COST_ESTIMATED" && updated.estimatedCost) {
      const smsPayload = getCostEstimationSmsPayload({
        trackingCode: updated.trackingCode,
        customerPhone: updated.customerPhone,
        estimatedCost: updated.estimatedCost,
      });
      console.log(`📱 [SMS Gateway] Repair cost estimation notification to ${smsPayload.recipient}: ${smsPayload.message}`);
      logger.info("Dispatched automated repair cost estimation SMS", smsPayload);
    }

    return NextResponse.json({ success: true, repair: updated });
  } catch (error) {
    logger.error("Error updating repair request", error);
    return NextResponse.json({ error: "خطا در به‌روزرسانی وضعیت تعمیر." }, { status: 500 });
  }
}
