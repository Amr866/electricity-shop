import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/core/auth";
import { MediaService } from "@/lib/services/mediaService";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session && session.user && session.user.role === "ADMIN";
}

/**
 * GET: List all uploaded media files across directories
 * Scans uploadsBase, productsDir, articlesDir, and bomsDir via MediaService
 */
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const files = await MediaService.listUploadedMedia();
    return NextResponse.json({ success: true, files });
  } catch (error) {
    console.error("Media list error:", error);
    return NextResponse.json({ message: "خطا در دریافت لیست تصاویر." }, { status: 500 });
  }
}

/**
 * POST: Upload and persist media files with format validation and category routing
 * Supports folder === "articles" (stored in articlesDir), folder === "products", and "boms"
 */
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "general";

    // MediaService routes folder === "articles" to /uploads/articles/ (articlesDir)
    const saved = await MediaService.saveUploadedFile(file, folder);
    return NextResponse.json({
      success: true,
      ...saved,
      filename: saved.name,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "خطا در بارگذاری فایل.";
    const status = msg.includes("فرمت") || msg.includes("حجم") || msg.includes("فایلی") ? 400 : 500;
    return NextResponse.json({ message: msg }, { status });
  }
}

/**
 * DELETE: Guarded file deletion with product connection checks and force override
 */
export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const target = searchParams.get("path") || searchParams.get("filename") || searchParams.get("url");
    const force = searchParams.get("force") === "true";

    if (!target) {
      return NextResponse.json({ message: "آدرس یا نام فایل الزامی است." }, { status: 400 });
    }

    const result = await MediaService.deleteUploadedFile(target, force);
    if (!result.success && result.conflict) {
      return NextResponse.json(
        {
          success: false,
          isUsedInProduct: true,
          productName: result.conflict.productName,
          message: `این تصویر در حال حاضر به عنوان تصویر کالای «${result.conflict.productName}» در سایت متصل است. جهت حذف، تایید اجباری نیاز است.`,
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "خطا در حذف فایل از سرور.";
    const status = msg.includes("نامعتبر") || msg.includes("الزامی") ? 400 : 500;
    return NextResponse.json({ message: msg }, { status });
  }
}
