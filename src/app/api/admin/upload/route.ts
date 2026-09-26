import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readdir, stat, unlink } from "fs/promises";
import path from "path";
import { checkAdminSession } from "@/lib/adminAuth";

type UploadFolder = "general" | "products" | "articles" | "boms";

interface FolderConfig {
  folder: UploadFolder;
  dir: string;
  prefix: string;
}

interface UploadedFileInfo {
  name: string;
  relativePath: string;
  url: string;
  folder: UploadFolder;
  size: number;
  createdAt: Date;
}

/**
 * Scan a single folder on disk and return array of valid file metadata
 */
async function scanFolderFiles({ folder, dir, prefix }: FolderConfig): Promise<UploadedFileInfo[]> {
  try {
    await mkdir(dir, { recursive: true });
    const names = await readdir(dir);
    const results = await Promise.all(
      names
        .filter((n) => !n.startsWith("."))
        .map(async (name): Promise<UploadedFileInfo | null> => {
          try {
            const filePath = path.join(dir, name);
            const fileStat = await stat(filePath);
            if (!fileStat.isFile()) return null;
            return {
              name,
              relativePath: `${prefix}${name}`,
              url: `/uploads/${prefix}${name}`,
              folder,
              size: fileStat.size,
              createdAt: fileStat.birthtime || fileStat.mtime,
            };
          } catch {
            return null;
          }
        })
    );
    return results.filter((f): f is UploadedFileInfo => f !== null);
  } catch (error) {
    console.error(`Error scanning folder ${folder}:`, error);
    return [];
  }
}

export async function GET() {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const uploadsBase = path.join(process.cwd(), "public", "uploads");
    const productsDir = path.join(uploadsBase, "products");
    const articlesDir = path.join(uploadsBase, "articles");
    const bomsDir = path.join(uploadsBase, "boms");

    const folderConfigs: FolderConfig[] = [
      { folder: "general", dir: uploadsBase, prefix: "" },
      { folder: "products", dir: productsDir, prefix: "products/" },
      { folder: "articles", dir: articlesDir, prefix: "articles/" },
      { folder: "boms", dir: bomsDir, prefix: "boms/" },
    ];

    // Scan all directories concurrently
    const fileArrays = await Promise.all(folderConfigs.map(scanFolderFiles));
    const files = fileArrays
      .flat()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, files });
  } catch (error: any) {
    console.error("Error reading uploads inventory:", error);
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

    // Whitelisted target subfolders
    const validFolders: Record<string, string> = {
      products: "products",
      articles: "articles",
      boms: "boms",
    };
    const targetSubfolder = folder === "articles" ? "articles" : validFolders[folder] || "";

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
      folder: (targetSubfolder || "general") as UploadFolder,
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

    // Strict path traversal defense
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
