import { NextRequest, NextResponse } from "next/server";
import { parseAndMatchContractorBom } from "@/lib/bomParser";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let fileBuffer: Buffer | null = null;
    let fileName = "bom_upload.xlsx";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "هیچ فایلی ارسال نشده است." }, { status: 400 });
      }

      fileName = file.name;
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    } else if (contentType.includes("application/json")) {
      const body = await req.json();
      if (body.base64) {
        fileBuffer = Buffer.from(body.base64, "base64");
      }
      if (body.fileName) fileName = body.fileName;
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return NextResponse.json(
        { error: "محتوای فایل اکسل نامعتبر یا خالی است." },
        { status: 400 }
      );
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    logger.info("Parsing contractor BOM Excel file", {
      method: "POST",
      pathname: "/api/bom/parse",
      ip,
      fileName,
      sizeBytes: fileBuffer.length,
    });

    const quotation = await parseAndMatchContractorBom(fileBuffer);

    return NextResponse.json({
      success: true,
      fileName,
      ...quotation,
    });
  } catch (error: any) {
    logger.error("Error processing contractor BOM Excel upload", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "خطا در پردازش فایل اکسل استعلام تجهیزات.",
      },
      { status: 422 }
    );
  }
}
