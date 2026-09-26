import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { INITIAL_ARTICLES } from "@/data/articles";

describe("Article Media & Local Storage Suite (TDD)", () => {
  test("Seam 1: INITIAL_ARTICLES use local /uploads/articles/ paths and not external Unsplash URLs", () => {
    assert.ok(INITIAL_ARTICLES.length > 0, "Articles list must not be empty");

    for (const article of INITIAL_ARTICLES) {
      assert.ok(
        article.image.startsWith("/uploads/articles/"),
        `Article '${article.title}' image must use local path /uploads/articles/, got: ${article.image}`
      );
      assert.ok(
        !article.image.includes("unsplash.com"),
        `Article '${article.title}' image must not use external Unsplash URL: ${article.image}`
      );

      // Verify physical file exists on disk
      const localFilePath = path.join(process.cwd(), "public", article.image);
      assert.ok(
        fs.existsSync(localFilePath),
        `Physical image file must exist on disk at ${localFilePath}`
      );
    }
  });

  test("Seam 2: /public/uploads/articles directory exists and contains images", () => {
    const articlesDir = path.join(process.cwd(), "public", "uploads", "articles");
    assert.ok(fs.existsSync(articlesDir), "public/uploads/articles directory must exist");

    const files = fs.readdirSync(articlesDir);
    assert.ok(files.length >= 3, `Expected at least 3 article images, found ${files.length}`);
  });

  test("Seam 3: src/app/api/admin/upload/route.ts supports folder === 'articles'", () => {
    const routeCode = fs.readFileSync(
      path.join(process.cwd(), "src", "app", "api", "admin", "upload", "route.ts"),
      "utf-8"
    );
    assert.ok(
      routeCode.includes('folder === "articles"') || routeCode.includes("folder === 'articles'"),
      "Upload route must handle folder === 'articles'"
    );
    assert.ok(
      routeCode.includes('articlesDir'),
      "Upload route must scan articlesDir"
    );
  });
});
