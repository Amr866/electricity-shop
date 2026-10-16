import path from "path";
import crypto from "crypto";
import { writeFile, mkdir } from "fs/promises";
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

    // Security Hardening: Cap upload size to 10MB to prevent memory exhaustion DoS
    const MAX_BOM_BYTES = 10 * 1024 * 1024;
    if (fileBuffer.length > MAX_BOM_BYTES) {
      return NextResponse.json(
        { error: "حجم فایل اکسل ارسالی بیش از حد مجاز است (حداکثر ۱۰ مگابایت)." },
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

    // Persist uploaded BOM spreadsheet to /public/uploads/boms/ for admin access & audit
    let fileUrl: string | null = null;
    let fileType: string | null = null;
    try {
      const bomsDir = path.resolve(process.cwd(), "public", "uploads", "boms");
      await mkdir(bomsDir, { recursive: true });

      const ext = path.extname(fileName) || ".xlsx";
      const cleanBase = path.basename(fileName, ext)
        .replace(/[^a-zA-Z0-9_\-\u0600-\u06FF]/g, "_")
        .slice(0, 35);
      const uniqueSuffix = crypto.randomBytes(4).toString("hex");
      const safeName = `bom_${Date.now()}_${uniqueSuffix}_${cleanBase}${ext}`;
      const destPath = path.join(bomsDir, safeName);

      await writeFile(destPath, fileBuffer);
      fileUrl = `/uploads/boms/${safeName}`;
      fileType = ext.toLowerCase().includes("xls")
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv";
    } catch (saveErr) {
      logger.error("Could not persist uploaded BOM file to disk", saveErr);
    }

    return NextResponse.json({
      success: true,
      fileName,
      fileUrl,
      fileType,
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
