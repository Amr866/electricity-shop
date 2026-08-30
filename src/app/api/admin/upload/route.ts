import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readdir, stat, unlink } from "fs/promises";
import path from "path";
import { checkAdminSession } from "@/lib/adminAuth";

export async function GET() {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const filenames = await readdir(uploadsDir);
    const files = [];

    for (const name of filenames) {
      if (name.startsWith(".")) continue;
      const filePath = path.join(uploadsDir, name);
      try {
        const fileStat = await stat(filePath);
        if (fileStat.isFile()) {
          files.push({
            name,
            url: `/uploads/${name}`,
            size: fileStat.size,
            createdAt: fileStat.birthtime || fileStat.mtime,
          });
        }
      } catch {}
    }

    // Sort newest first
    files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, files });
  } catch (error: any) {
    console.error("Error reading uploads:", error);
    return NextResponse.json({ message: "خطا در خواندن فایل‌های آپلود شده." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "فایلی ارسال نشده است." }, { status: 400 });
    }

    // Limit file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ message: "حداکثر حجم مجاز تصویر ۱۰ مگابایت می‌باشد." }, { status: 400 });
    }

    // Whitelist allowed image extensions
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/avif", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ message: "فرمت فایل مجاز نیست (فقط JPG, PNG, WEBP, SVG مجاز است)." }, { status: 400 });
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
      size: file.size,
      createdAt: new Date(),
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "خطا در بارگذاری تصویر." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json({ message: "نام فایل الزامی است." }, { status: 400 });
    }

    // Prevent directory traversal
    const safeFilename = path.basename(filename);
    const filePath = path.join(process.cwd(), "public", "uploads", safeFilename);

    await unlink(filePath);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete file error:", error);
    return NextResponse.json({ message: "خطا در حذف فایل از سرور." }, { status: 500 });
  }
}
