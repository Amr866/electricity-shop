import path from "path";

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

import { toPersianDigits } from "@/lib/utils";

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
  const ext = path.extname(filename).toLowerCase();
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
 * Clean and normalize a relative upload path and generate matching database URLs
 */
export function normalizeUploadPath(target: string) {
  let cleanRelPath = target.trim();
  if (cleanRelPath.startsWith("/uploads/")) {
    cleanRelPath = cleanRelPath.replace(/^\/uploads\//, "");
  } else if (cleanRelPath.startsWith("/images/products/")) {
    cleanRelPath = `products/${cleanRelPath.replace(/^\/images\/products\//, "")}`;
  }

  const baseName = path.basename(cleanRelPath);
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
