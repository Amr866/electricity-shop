import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  getFileType,
  normalizeUploadPath,
  formatBytes,
  isImageMedia,
  isPdfMedia,
  isExcelMedia,
  isDocMedia,
  uploadMediaFile,
} from "@/lib/utils/media";

describe("Code Judo & Codebase Design Verification Suite", () => {
  describe("1. Universal Media Utilities (@/lib/utils/media)", () => {
    test("isImageMedia identifies standard image formats and rejects documents", () => {
      assert.equal(isImageMedia({ name: "motor.webp", fileType: "image" }), true);
      assert.equal(isImageMedia({ url: "/uploads/products/cable.png" }), true);
      assert.equal(isImageMedia({ name: "diagram.svg" }), true);
      assert.equal(isImageMedia({ name: "datasheet.pdf", fileType: "pdf" }), false);
      assert.equal(isImageMedia({ url: "/uploads/products/price-list.xlsx" }), false);
    });

    test("isPdfMedia identifies PDF files correctly", () => {
      assert.equal(isPdfMedia({ name: "catalog.pdf" }), true);
      assert.equal(isPdfMedia({ url: "/uploads/boms/spec.PDF" }), true);
      assert.equal(isPdfMedia({ name: "photo.jpg" }), false);
    });

    test("isExcelMedia identifies spreadsheet formats (.xlsx, .xls, .csv)", () => {
      assert.equal(isExcelMedia({ name: "inventory.xlsx" }), true);
      assert.equal(isExcelMedia({ name: "bom.csv" }), true);
      assert.equal(isExcelMedia({ name: "legacy.xls" }), true);
      assert.equal(isExcelMedia({ name: "manual.doc" }), false);
    });

    test("isDocMedia identifies text documents (.doc, .docx, .txt)", () => {
      assert.equal(isDocMedia({ name: "contract.docx" }), true);
      assert.equal(isDocMedia({ name: "readme.txt" }), true);
      assert.equal(isDocMedia({ name: "photo.png" }), false);
    });

    test("getFileType correctly categorizes file types", () => {
      assert.equal(getFileType("photo.jpg"), "image");
      assert.equal(getFileType("guide.pdf"), "pdf");
      assert.equal(getFileType("data.xlsx"), "excel");
      assert.equal(getFileType("memo.docx"), "word");
      assert.equal(getFileType("archive.zip"), "other");
    });

    test("normalizeUploadPath resolves clean paths without node path module", () => {
      const result = normalizeUploadPath("/uploads/products/motor.webp");
      assert.equal(result.cleanRelPath, "products/motor.webp");
      assert.equal(result.baseName, "motor.webp");
      assert.ok(result.possibleUrls.includes("/uploads/products/motor.webp"));
    });

    test("formatBytes formats Persian size strings", () => {
      assert.match(formatBytes(1024), /کیلوبایت/);
      assert.match(formatBytes(1048576), /مگابایت/);
    });

    test("uploadMediaFile function signature is exported", () => {
      assert.equal(typeof uploadMediaFile, "function");
    });
  });

  describe("2. Thumbnail & Media Picker Safety (MediaPickerModal.tsx)", () => {
    test("MediaPickerModal uses isImageMedia and avoids rendering non-images as images", () => {
      const modalPath = path.join(process.cwd(), "src", "components", "admin", "MediaPickerModal.tsx");
      const content = fs.readFileSync(modalPath, "utf-8");

      assert.ok(content.includes("isImageMedia"), "MediaPickerModal must import/use isImageMedia");
      // Must not naively treat all files in products/articles folder as images
      assert.ok(
        !content.includes('f.folder === "products" ||\n      f.folder === "articles"'),
        "MediaPickerModal must not assume all files in products or articles folders are images"
      );
    });
  });

  describe("3. Uploads Admin Client Resilience (UploadsAdminClient.tsx)", () => {
    test("UploadsAdminClient uses centralized media predicates", () => {
      const clientPath = path.join(process.cwd(), "src", "app", "admin", "uploads", "UploadsAdminClient.tsx");
      const content = fs.readFileSync(clientPath, "utf-8");

      assert.ok(content.includes("isImageMedia"), "UploadsAdminClient must use isImageMedia");
      assert.ok(content.includes("isPdfMedia"), "UploadsAdminClient must use isPdfMedia");
      assert.ok(content.includes("isExcelMedia"), "UploadsAdminClient must use isExcelMedia");
    });

    test("UploadsAdminClient supports 409 conflict interactive force-retry", () => {
      const clientPath = path.join(process.cwd(), "src", "app", "admin", "uploads", "UploadsAdminClient.tsx");
      const content = fs.readFileSync(clientPath, "utf-8");

      assert.ok(content.includes("409") || content.includes("Conflict"), "UploadsAdminClient must handle 409 conflict");
      assert.ok(content.includes("force"), "UploadsAdminClient must support force deletion retry");
    });
  });

  describe("4. BiDi Isolation & Standards Compliance", () => {
    test("Maintenance page wraps phone and WhatsApp numbers in <bdi dir=\"ltr\">", () => {
      const pagePath = path.join(process.cwd(), "src", "app", "maintenance", "page.tsx");
      const content = fs.readFileSync(pagePath, "utf-8");

      assert.ok(
        content.includes('<bdi dir="ltr">۰۳۱-۴۲۶۲۶۱۱۶</bdi>') || content.includes('<bdi dir="ltr">031-42626116</bdi>'),
        "Maintenance page must wrap landline phone in <bdi dir=\"ltr\">"
      );
      assert.ok(
        content.includes('<bdi dir="ltr">۰۹۱۳۶۲۶۰۰۷۲</bdi>') || content.includes('<bdi dir="ltr">09136260072</bdi>'),
        "Maintenance page must wrap mobile phone in <bdi dir=\"ltr\">"
      );
    });

    test("ReviewsAdminClient fixes inverted BiDi boundary", () => {
      const reviewPath = path.join(process.cwd(), "src", "app", "admin", "reviews", "ReviewsAdminClient.tsx");
      const content = fs.readFileSync(reviewPath, "utf-8");

      // Must not wrap Persian prose in dir="ltr"
      assert.ok(
        !content.includes('<bdi dir="ltr">(میانگین فعلی:'),
        "ReviewsAdminClient must not wrap Persian text (میانگین فعلی) in dir=\"ltr\""
      );
    });

    test("CustomerAccountClient supports canonical READY status and avoids workshop phone fallback", () => {
      const accountPath = path.join(process.cwd(), "src", "app", "account", "CustomerAccountClient.tsx");
      const content = fs.readFileSync(accountPath, "utf-8");

      // Must support READY status
      assert.ok(content.includes("READY"), "CustomerAccountClient must handle READY repair status");
      // Must not assign store owner's phone as customer fallback
      assert.ok(
        !content.includes('user.phone || "۰۹۱۳۶۲۶۰۰۷۲"'),
        "CustomerAccountClient must not fall back user phone to workshop phone number"
      );
    });

    test("Admin upload route uses structured logger", () => {
      const routePath = path.join(process.cwd(), "src", "app", "api", "admin", "upload", "route.ts");
      const content = fs.readFileSync(routePath, "utf-8");

      assert.ok(content.includes("logger"), "Admin upload route must import and use logger");
      assert.ok(!content.includes("console.error("), "Admin upload route must avoid raw console.error");
    });
  });
});
