import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readdir, stat, unlink } from "fs/promises";
import path from "path";
import { checkAdminSession } from "@/lib/adminAuth";

export async function GET() {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const productsDir = path.join(uploadsDir, "products");
    const articlesDir = path.join(uploadsDir, "articles");

    await mkdir(uploadsDir, { recursive: true });
    await mkdir(productsDir, { recursive: true });
    await mkdir(articlesDir, { recursive: true });

    const files: Array<{
      name: string;
      relativePath: string;
      url: string;
      folder: "general" | "products" | "articles";
      size: number;
      createdAt: Date;
    }> = [];

    // 1. General uploads
    const filenames = await readdir(uploadsDir);
    for (const name of filenames) {
      if (name.startsWith(".")) continue;
      const filePath = path.join(uploadsDir, name);
      try {
        const fileStat = await stat(filePath);
        if (fileStat.isFile()) {
          files.push({
            name,
            relativePath: name,
            url: `/uploads/${name}`,
            folder: "general",
            size: fileStat.size,
            createdAt: fileStat.birthtime || fileStat.mtime,
          });
        }
      } catch {}
    }

    // 2. Products uploads
    try {
      const productFiles = await readdir(productsDir);
      for (const name of productFiles) {
        if (name.startsWith(".")) continue;
        const filePath = path.join(productsDir, name);
        try {
          const fileStat = await stat(filePath);
          if (fileStat.isFile()) {
            files.push({
              name,
              relativePath: `products/${name}`,
              url: `/uploads/products/${name}`,
              folder: "products",
              size: fileStat.size,
              createdAt: fileStat.birthtime || fileStat.mtime,
            });
          }
        } catch {}
      }
    } catch {}

    // 3. Articles uploads
    try {
      const articleFiles = await readdir(articlesDir);
      for (const name of articleFiles) {
        if (name.startsWith(".")) continue;
        const filePath = path.join(articlesDir, name);
        try {
          const fileStat = await stat(filePath);
          if (fileStat.isFile()) {
            files.push({
              name,
              relativePath: `articles/${name}`,
              url: `/uploads/articles/${name}`,
              folder: "articles",
              size: fileStat.size,
              createdAt: fileStat.birthtime || fileStat.mtime,
            });
          }
        } catch {}
      }
    } catch {}

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
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ message: "فایلی ارسال نشده است." }, { status: 400 });
    }

    // Limit file size to 25MB
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ message: "حداکثر حجم مجاز تصویر ۲۵ مگابایت می‌باشد." }, { status: 400 });
    }

    // Whitelist allowed image extensions
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/avif", "image/svg+xml"];
    const ext = path.extname(file.name).toLowerCase();
    const allowedExts = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".avif"];

    if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
      return NextResponse.json({ message: "فرمت فایل مجاز نیست (فقط JPG, PNG, WEBP, SVG مجاز است)." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Target directory: /public/uploads/ or /public/uploads/products/ or /public/uploads/articles/
    let targetSubfolder = "";
    if (folder === "products") targetSubfolder = "products";
    else if (folder === "articles") targetSubfolder = "articles";

    const uploadsDir = path.join(process.cwd(), "public", "uploads", targetSubfolder);
    await mkdir(uploadsDir, { recursive: true });

    // Generate safe file name with timestamp
    const safeName = file.name.replace(/[^\w\.-]/g, "_");
    const filename = `${Date.now()}_${safeName}`;
    const filePath = path.join(uploadsDir, filename);

    await writeFile(filePath, buffer);

    const publicUrl = targetSubfolder ? `/uploads/${targetSubfolder}/${filename}` : `/uploads/${filename}`;
    const relativePath = targetSubfolder ? `${targetSubfolder}/${filename}` : filename;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      relativePath,
      folder,
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
    const target = searchParams.get("path") || searchParams.get("filename") || searchParams.get("url");

    if (!target) {
      return NextResponse.json({ message: "نام یا آدرس فایل الزامی است." }, { status: 400 });
    }

    let cleanRelPath = target.trim();
    if (cleanRelPath.startsWith("/uploads/")) {
      cleanRelPath = cleanRelPath.replace(/^\/uploads\//, "");
    }

    const uploadsBase = path.resolve(process.cwd(), "public", "uploads");
    const targetFilePath = path.resolve(uploadsBase, cleanRelPath);

    // Prevent directory traversal
    if (!targetFilePath.startsWith(uploadsBase)) {
      return NextResponse.json({ message: "مسیر فایل نامعتبر است." }, { status: 400 });
    }

    await unlink(targetFilePath);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete file error:", error);
    return NextResponse.json({ message: "خطا در حذف فایل از سرور." }, { status: 500 });
  }
}
