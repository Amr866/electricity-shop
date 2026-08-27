import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { checkAdminSession } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "فایلی ارسال نشده است." }, { status: 400 });
    }

    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: "حداکثر حجم مجاز تصویر ۵ مگابایت می‌باشد." }, { status: 400 });
    }

    // Whitelist allowed image extensions
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ message: "فرمت فایل مجاز نیست (فقط JPG, PNG, WEBP مجاز است)." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Generate safe file name with timestamp
    const safeName = file.name.replace(/[^\w\.-]/g, "_");
    const filename = `${Date.now()}_${safeName}`;
    const filePath = path.join(uploadsDir, filename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "خطا در بارگذاری تصویر." }, { status: 500 });
  }
}
