import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeIranianPhone, toAsciiDigits } from "@/lib/utils";
import { isSafeAttachmentUrl } from "@/lib/utils/security";
import { logger } from "@/lib/logger";

// GET: Retrieve BOM inquiries for admin or lookup by tracking code / phone for contractors
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN";

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code") || "";
    const phone = searchParams.get("phone") || "";
    const q = searchParams.get("q") || "";

    logger.info("Inbound GET BOM submissions", { code, phone, q, isAdmin });

    const query = (code || phone || q).trim();

    // Data Exposure Protection: Anonymous callers MUST supply an exact tracking code or phone
    if (!query) {
      if (!isAdmin) {
        return NextResponse.json(
          { error: "کد پیگیری یا شماره تماس جهت استعلام الزامی است." },
          { status: 400 }
        );
      }

      const submissions = await prisma.bOMSubmission.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      });
      return NextResponse.json({ success: true, submissions });
    }

    const clean = query.trim();
    const asciiClean = toAsciiDigits(clean);
    const normalizedPhone = normalizeIranianPhone(clean);

    let where: any;

    if (isAdmin) {
      // Admins can search across tracking code, phone, contractor name, or company name
      where = {
        OR: [
          { trackingCode: clean.toUpperCase() },
          { trackingCode: asciiClean.toUpperCase() },
          { contractorPhone: clean },
          { contractorPhone: asciiClean },
          { contractorPhone: normalizedPhone },
          { contractorName: { contains: clean, mode: "insensitive" } },
          { companyName: { contains: clean, mode: "insensitive" } },
        ],
      };
    } else {
      // Non-admins can strictly query by exact tracking code or exact phone (prevents contractor enumeration)
      where = {
        OR: [
          { trackingCode: clean.toUpperCase() },
          { trackingCode: asciiClean.toUpperCase() },
          { contractorPhone: clean },
          { contractorPhone: asciiClean },
          { contractorPhone: normalizedPhone },
        ],
      };
    }

    const submissions = await prisma.bOMSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: isAdmin ? 50 : 10,
    });

    // Mask sensitive personal information for public viewers
    const sanitizedSubmissions = isAdmin
      ? submissions
      : submissions.map((sub) => ({
          ...sub,
          contractorPhone: sub.contractorPhone
            ? sub.contractorPhone.replace(/(\d{4})\d{4}(\d{3})/, "$1****$2")
            : "",
          contractorName:
            sub.contractorName && sub.contractorName.length > 2
              ? `${sub.contractorName.slice(0, 2)}***`
              : sub.contractorName,
        }));

    return NextResponse.json({ success: true, submissions: sanitizedSubmissions });
  } catch (error) {
    logger.error("Error fetching BOM submissions", error);
    return NextResponse.json({ error: "Failed to fetch BOM inquiries" }, { status: 500 });
  }
}

// POST: Submit new contractor BOM inquiry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      contractorName,
      contractorPhone,
      projectCity,
      companyName,
      content,
      fileUrl,
      fileType,
    } = body;

    logger.info("Inbound POST BOM inquiry", { contractorName, projectCity });

    let safeFileUrl: string | null = null;
    if (fileUrl) {
      if (typeof fileUrl !== "string" || !isSafeAttachmentUrl(fileUrl)) {
        return NextResponse.json(
          { error: "آدرس فایل ضمیمه نامعتبر یا غیرمجاز است." },
          { status: 400 }
        );
      }
      safeFileUrl = fileUrl.trim();
    }

    if (!contractorName || !contractorPhone || (!content && !safeFileUrl)) {
      return NextResponse.json(
        { error: "نام، شماره موبایل و لیست اقلام یا فایل ضمیمه الزامی است." },
        { status: 400 }
      );
    }

    const cleanPhone = normalizeIranianPhone(contractorPhone) || toAsciiDigits(contractorPhone).trim();

    // Generate unique inquiry code: BOM-YYMMDD-XXX
    const datePrefix = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const trackingCode = `BOM-${datePrefix}-${randomSuffix}`;

    const submission = await prisma.bOMSubmission.create({
      data: {
        trackingCode,
        contractorName: contractorName.trim(),
        contractorPhone: cleanPhone,
        projectCity: projectCity ? projectCity.trim() : "نجف‌آباد / اصفهان",
        companyName: companyName ? companyName.trim() : null,
        content: content ? content.trim() : null,
        fileUrl: safeFileUrl,
        fileType: fileType || null,
        status: "PENDING",
      },
    });

    logger.info("BOM inquiry successfully created", { trackingCode });

    return NextResponse.json(
      {
        success: true,
        trackingCode,
        message: "استعلام اقلام با موفقیت ثبت شد و به واحد فروش عمده ارجاع گردید.",
        submission,
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Error creating BOM submission", error);
    return NextResponse.json(
      { error: "خطا در ثبت استعلام اقلام." },
      { status: 500 }
    );
  }
}

// PATCH: Update BOM inquiry status and quotation notes (Admin/Sales Desk)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isMasterAdmin = session?.user?.role === "ADMIN";

    if (!isMasterAdmin) {
      return NextResponse.json({ error: "دسترسی غیرمجاز." }, { status: 403 });
    }

    const body = await req.json();
    const { id, status, adminNotes } = body;

    if (!id) {
      return NextResponse.json({ error: "شناسه استعلام الزامی است." }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const updated = await prisma.bOMSubmission.update({
      where: { id },
      data: updateData,
    });

    logger.info("BOM submission updated by admin", { id, status });

    return NextResponse.json({ success: true, submission: updated });
  } catch (error) {
    logger.error("Error updating BOM submission", error);
    return NextResponse.json({ error: "خطا در به‌روزرسانی استعلام BOM." }, { status: 500 });
  }
}
