import path from "path";
import { readdir, stat, unlink, writeFile, mkdir } from "fs/promises";
import { prisma } from "@/lib/core/prisma";
import { MediaFile, MediaFolder, getFileType, normalizeUploadPath } from "@/lib/utils/media";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/avif",
  "image/svg+xml",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const ALLOWED_EXTENSIONS = [
  ".jpg", ".jpeg", ".png", ".webp", ".svg", ".avif",
  ".pdf", ".xlsx", ".xls", ".csv", ".doc", ".docx", ".txt",
];

export class MediaService {
  private static getUploadsBase(): string {
    return path.resolve(process.cwd(), "public", "uploads");
  }

  /**
   * Scan directories and return a unified list of uploaded media cross-referenced with products
   */
  public static async listUploadedMedia(): Promise<MediaFile[]> {
    const uploadsBase = this.getUploadsBase();
    const productsDir = path.join(uploadsBase, "products");
    const bomsDir = path.join(uploadsBase, "boms");

    // Fetch active product images from database to map usage
    const productImages = await prisma.productImage.findMany({
      select: {
        url: true,
        product: { select: { name: true } },
      },
    });

    const productMap = new Map<string, string>();
    for (const pi of productImages) {
      if (pi.url) {
        const prodName = pi.product?.name || "کالای فروشگاه";
        productMap.set(pi.url, prodName);
        productMap.set(path.basename(pi.url), prodName);
      }
    }

    const files: MediaFile[] = [];

    // Helper to scan a directory
    async function scanFolder(folderDir: string, folderName: MediaFolder, urlPrefix: string) {
      try {
        const items = await readdir(folderDir);
        for (const name of items) {
          if (name.startsWith(".")) continue;
          const filePath = path.join(folderDir, name);
          try {
            const fileStat = await stat(filePath);
            if (fileStat.isFile()) {
              const publicUrl = `${urlPrefix}/${name}`;
              const isUsed = productMap.has(publicUrl) || productMap.has(name);
              const productName = productMap.get(publicUrl) || productMap.get(name) || null;

              files.push({
                name,
                relativePath: folderName === "general" ? name : `${folderName}/${name}`,
                url: publicUrl,
                folder: folderName,
                fileType: getFileType(name),
                size: fileStat.size,
                createdAt: fileStat.birthtime || fileStat.mtime,
                isUsedInProduct: isUsed,
                productName,
              });
            }
          } catch {
            // Ignore individual file stat error
          }
        }
      } catch {
        // Ignore missing folder error
      }
    }

    // 1. Scan Root Uploads (/public/uploads/)
    await scanFolder(uploadsBase, "general", "/uploads");

    // 2. Scan Products Uploads (/public/uploads/products/)
    await scanFolder(productsDir, "products", "/uploads/products");

    // 3. Scan BOM Inquiry Documents (/public/uploads/boms/)
    await scanFolder(bomsDir, "boms", "/uploads/boms");

    // Sort newest first
    return files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Validate and save an uploaded file to the specified category folder
   */
  public static async saveUploadedFile(file: File, folder: string = "general"): Promise<MediaFile> {
    if (!file) {
      throw new Error("فایلی ارسال نشده است.");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("حداکثر حجم مجاز فایل ۲۵ مگابایت می‌باشد.");
    }

    const fileExt = path.extname(file.name).toLowerCase();
    if (!ALLOWED_MIME_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(fileExt)) {
      throw new Error("فرمت فایل مجاز نیست (فقط تصاویر JPG, PNG, WEBP, SVG و اسناد PDF, XLSX, DOCX مجاز است).");
    }

    let targetSubfolder = "";
    let folderType: MediaFolder = "general";
    if (folder === "products") {
      targetSubfolder = "products";
      folderType = "products";
    } else if (folder === "boms") {
      targetSubfolder = "boms";
      folderType = "boms";
    }

    const uploadsBase = this.getUploadsBase();
    const targetDir = path.join(uploadsBase, targetSubfolder);
    await mkdir(targetDir, { recursive: true });

    // Generate safe timestamped filename
    const ext = path.extname(file.name);
    const base = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_\-\u0600-\u06FF]/g, "_");
    const filename = `${base}_${Date.now()}${ext}`;
    const filePath = path.join(targetDir, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const publicUrl = targetSubfolder ? `/uploads/${targetSubfolder}/${filename}` : `/uploads/${filename}`;
    const relativePath = targetSubfolder ? `${targetSubfolder}/${filename}` : filename;

    return {
      name: filename,
      relativePath,
      url: publicUrl,
      folder: folderType,
      fileType: getFileType(filename),
      size: file.size,
      createdAt: new Date(),
      isUsedInProduct: false,
      productName: null,
    };
  }

  /**
   * Delete an uploaded file safely, verifying directory boundaries and product linkage
   */
  public static async deleteUploadedFile(
    target: string,
    force: boolean = false
  ): Promise<{ success: boolean; conflict?: { isUsedInProduct: boolean; productName: string } }> {
    if (!target) {
      throw new Error("آدرس یا نام فایل الزامی است.");
    }

    const { cleanRelPath, possibleUrls } = normalizeUploadPath(target);
    const uploadsBase = this.getUploadsBase();
    const targetFilePath = path.resolve(uploadsBase, cleanRelPath);

    // Traversal check
    if (!targetFilePath.startsWith(uploadsBase)) {
      throw new Error("مسیر فایل نامعتبر است.");
    }

    // Check if the file is connected to an active product in DB
    const connectedUsage = await prisma.productImage.findFirst({
      where: {
        url: { in: possibleUrls },
      },
      include: {
        product: { select: { name: true } },
      },
    });

    if (connectedUsage && !force) {
      return {
        success: false,
        conflict: {
          isUsedInProduct: true,
          productName: connectedUsage.product?.name || "کالای فروشگاه",
        },
      };
    }

    // Delete file on disk
    await unlink(targetFilePath);

    // Clean up DB references if force
    if (connectedUsage && force) {
      await prisma.productImage.deleteMany({
        where: {
          url: { in: possibleUrls },
        },
      });
    }

    return { success: true };
  }
}
