import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const MIME_EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "فایلی ارسال نشده است." }, { status: 400 });
    }

    // 1. Max file size: 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "حداکثر حجم مجاز تصویر ۵ مگابایت است." }, { status: 400 });
    }

    // 2. Strict MIME Whitelist
    const extension = MIME_EXTENSION_MAP[file.type];
    if (!extension) {
      return NextResponse.json(
        { error: "فرمت فایل مجاز نیست (فقط تصاویر JPG, PNG, WEBP مجاز هستند)." },
        { status: 400 }
      );
    }

    // 3. Isolated namespace: public/uploads/repairs/
    const repairsDir = path.join(process.cwd(), "public", "uploads", "repairs");
    await mkdir(repairsDir, { recursive: true });

    // 4. Safe random filename without preserving user path / name
    const randomId = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
    const filename = `repair_${Date.now()}_${randomId}.${extension}`;
    const targetPath = path.join(repairsDir, filename);

    const bytes = await file.arrayBuffer();
    await writeFile(targetPath, Buffer.from(bytes));

    return NextResponse.json({
      success: true,
      url: `/uploads/repairs/${filename}`,
    });
  } catch (error) {
    console.error("Secure repair upload error:", error);
    return NextResponse.json({ error: "خطا در ذخیره‌سازی تصویر." }, { status: 500 });
  }
}
