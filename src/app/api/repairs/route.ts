import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function toEnglishDigits(str: string): string {
  if (!str) return "";
  return str
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .trim();
}

// GET: Search repair requests by exact phone or tracking code
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawQuery = searchParams.get("phone") || searchParams.get("trackingCode") || searchParams.get("q");

    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN";

    if (!rawQuery && !isAdmin) {
      return NextResponse.json({ error: "کد پیگیری یا شماره تماس الزامی است." }, { status: 400 });
    }

    let where: any = {};
    if (rawQuery) {
      const cleanQuery = rawQuery.trim();
      const englishQuery = toEnglishDigits(cleanQuery);
      
      where = {
        OR: [
          { customerPhone: cleanQuery },
          { customerPhone: englishQuery },
          { trackingCode: cleanQuery.toUpperCase() },
          { trackingCode: englishQuery.toUpperCase() },
        ],
      };
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
    const {
      customerName,
      customerPhone,
      applianceType,
      brandModel,
      issueDesc,
      deliveryType,
      photoUrl,
    } = body;

    if (!customerName || !customerPhone || !applianceType || !issueDesc) {
      return NextResponse.json({ error: "اطلاعات ضروری تکمیل نشده است." }, { status: 400 });
    }

    const normalizedPhone = toEnglishDigits(customerPhone);
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    // Generate collision-safe repair tracking code: REP-YYMMDD-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const datePrefix = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const trackingCode = `REP-${datePrefix}-${randomSuffix}`;

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
        adminNotes: initialNotes,
      },
    });

    return NextResponse.json({ success: true, repair, trackingCode }, { status: 201 });
  } catch (error) {
    console.error("Error submitting repair request:", error);
    return NextResponse.json({ error: "خطا در ثبت درخواست تعمیر." }, { status: 500 });
  }
}
