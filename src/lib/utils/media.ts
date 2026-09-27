import { toPersianDigits } from "@/lib/utils";

export type MediaFolder = "products" | "boms" | "articles" | "general";
export type FileType = "image" | "pdf" | "excel" | "word" | "doc" | "document" | "spreadsheet" | "other";

export interface MediaFile {
  name: string;
  relativePath: string;
  url: string;
  folder: MediaFolder;
  fileType: FileType;
  size: number;
  createdAt: string | Date;
  isUsedInProduct?: boolean;
  productName?: string | null;
}

/**
 * Pure string extraction of file extension (isomorphic, no Node.js 'path' dependency)
 */
function getExt(filename: string): string {
  if (!filename) return "";
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1 || lastDot === 0) return "";
  return filename.slice(lastDot).toLowerCase();
}

/**
 * Pure string extraction of basename (handles both / and \)
 */
function getBaseName(filepath: string): string {
  if (!filepath) return "";
  const normalized = filepath.replace(/\\/g, "/");
  const lastSlash = normalized.lastIndexOf("/");
  if (lastSlash === -1) return normalized;
  return normalized.slice(lastSlash + 1);
}

/**
 * Format bytes into human-readable Persian strings (بایت, کیلوبایت, مگابایت)
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "۰ بایت";
  const k = 1024;
  const sizes = ["بایت", "کیلوبایت", "مگابایت", "گیگابایت"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
  return `${toPersianDigits(val)} ${sizes[i]}`;
}

/**
 * Identify file type from extension
 */
export function getFileType(filename: string): FileType {
  const ext = getExt(filename);
  if ([".jpg", ".jpeg", ".png", ".webp", ".svg", ".avif"].includes(ext)) {
    return "image";
  }
  if (ext === ".pdf") {
    return "pdf";
  }
  if ([".xlsx", ".xls", ".csv"].includes(ext)) {
    return "excel";
  }
  if ([".doc", ".docx"].includes(ext)) {
    return "word";
  }
  return "other";
}

/**
 * Predicates for file categorization across client and server
 */
export function isImageMedia(file: { name?: string; url?: string; fileType?: string }): boolean {
  if (file.fileType === "image") return true;
  const target = file.url || file.name || "";
  const ext = getExt(target);
  return [".jpg", ".jpeg", ".png", ".webp", ".svg", ".avif"].includes(ext);
}

export function isPdfMedia(file: { name?: string; url?: string; fileType?: string }): boolean {
  if (file.fileType === "pdf") return true;
  const target = file.url || file.name || "";
  return getExt(target) === ".pdf";
}

export function isExcelMedia(file: { name?: string; url?: string; fileType?: string }): boolean {
  if (file.fileType === "excel" || file.fileType === "spreadsheet") return true;
  const target = file.url || file.name || "";
  return [".xlsx", ".xls", ".csv"].includes(getExt(target));
}

export function isSpreadsheetMedia(file: { name?: string; url?: string; fileType?: string }): boolean {
  return isExcelMedia(file);
}

export function isDocMedia(file: { name?: string; url?: string; fileType?: string }): boolean {
  if (file.fileType === "word" || file.fileType === "doc" || file.fileType === "document") return true;
  const target = file.url || file.name || "";
  return [".doc", ".docx", ".txt"].includes(getExt(target));
}

/**
 * Clean and normalize a relative upload path and generate matching database URLs
 */
export function normalizeUploadPath(target: string) {
  let cleanRelPath = target.trim();
  if (cleanRelPath.startsWith("/uploads/")) {
    cleanRelPath = cleanRelPath.replace(/^\/uploads\//, "");
  } else if (cleanRelPath.startsWith("/images/products/")) {
    cleanRelPath = `products/${cleanRelPath.replace(/^\/images\/products\//, "")}`;
  }

  const baseName = getBaseName(cleanRelPath);
  const possibleUrls = [
    `/uploads/${cleanRelPath}`,
    `/uploads/products/${baseName}`,
    `/images/products/${baseName}`,
  ];

  return {
    cleanRelPath,
    baseName,
    possibleUrls,
  };
}

/**
 * Canonical client-side media upload function
 */
export async function uploadMediaFile(
  file: File,
  folder: MediaFolder = "general"
): Promise<MediaFile> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "خطا در بارگذاری فایل در سرور.");
  }

  return {
    name: data.filename || data.name || file.name,
    relativePath: data.relativePath || data.filename || file.name,
    url: data.url,
    folder: data.folder || folder,
    fileType: data.fileType || getFileType(data.filename || file.name),
    size: typeof data.size === "number" ? data.size : file.size,
    createdAt: data.createdAt || new Date().toISOString(),
    isUsedInProduct: Boolean(data.isUsedInProduct),
    productName: data.productName || null,
  };
}
