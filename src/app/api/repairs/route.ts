import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: List recent repairs or search
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    const where: any = {};
    if (phone) {
      where.customerPhone = phone;
    }

    const repairs = await prisma.repairRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, repairs });
  } catch (error) {
    console.error("Error fetching repairs:", error);
    return NextResponse.json({ error: "Failed to fetch repairs" }, { status: 500 });
  }
}

// POST: Submit new repair request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, applianceType, brandModel, issueDesc, deliveryType } = body;

    if (!customerName || !customerPhone || !applianceType || !issueDesc) {
      return NextResponse.json({ error: "اطلاعات ضروری تکمیل نشده است." }, { status: 400 });
    }

    // Generate unique repair tracking code (e.g. REP-1403-XXXX)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `REP-1403-${randomSuffix}`;

    const repair = await prisma.repairRequest.create({
      data: {
        trackingCode,
        customerName,
        customerPhone,
        applianceType,
        brandModel: brandModel || null,
        issueDesc,
        deliveryType: deliveryType || "in_person",
        status: "SUBMITTED",
      },
    });

    return NextResponse.json({ success: true, repair, trackingCode }, { status: 201 });
  } catch (error) {
    console.error("Error submitting repair request:", error);
    return NextResponse.json({ error: "خطا در ثبت درخواست تعمیر." }, { status: 500 });
  }
}
