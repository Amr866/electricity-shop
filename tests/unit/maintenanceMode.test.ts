import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Store Maintenance Mode Suite", () => {
  test("Seam 1: Maintenance page exists with noindex metadata and workshop contacts", () => {
    const pagePath = path.join(process.cwd(), "src", "app", "maintenance", "page.tsx");
    assert.ok(fs.existsSync(pagePath), "src/app/maintenance/page.tsx must exist");

    const content = fs.readFileSync(pagePath, "utf-8");
    assert.ok(content.includes("index: false"), "Maintenance page must disable search indexing");
    assert.ok(content.includes("follow: false"), "Maintenance page must disable robot follow");
    assert.ok(content.includes("03142626116"), "Maintenance page must include workshop phone");
    assert.ok(content.includes("09136260072"), "Maintenance page must include support mobile / WhatsApp");
    assert.ok(content.includes("/auth/login"), "Maintenance page must include discreet admin login link");
  });

  test("Seam 2: Next.js Middleware supports MAINTENANCE_MODE with 503 status and Retry-After", () => {
    const middlewarePath = path.join(process.cwd(), "src", "middleware.ts");
    assert.ok(fs.existsSync(middlewarePath), "src/middleware.ts must exist");

    const content = fs.readFileSync(middlewarePath, "utf-8");
    assert.ok(content.includes("MAINTENANCE_MODE"), "Middleware must inspect MAINTENANCE_MODE");
    assert.ok(content.includes("503"), "Middleware must issue 503 status code");
    assert.ok(content.includes("Retry-After"), "Middleware must set Retry-After header for SEO protection");
    assert.ok(content.includes("role === \"ADMIN\""), "Middleware must permit ADMIN session bypass");
    assert.ok(content.includes("/maintenance"), "Middleware must whitelist /maintenance");
    assert.ok(content.includes("/auth/login"), "Middleware must whitelist /auth/login for admin entry");
  });

  test("Seam 3: Environment documentation includes MAINTENANCE_MODE", () => {
    const envExamplePath = path.join(process.cwd(), ".env.example");
    const content = fs.readFileSync(envExamplePath, "utf-8");
    assert.ok(content.includes("MAINTENANCE_MODE"), ".env.example must document MAINTENANCE_MODE");
  });

  test("Seam 4: Middleware config matcher intercepts all non-static paths", () => {
    const middlewarePath = path.join(process.cwd(), "src", "middleware.ts");
    const content = fs.readFileSync(middlewarePath, "utf-8");
    assert.ok(content.includes("_next/static"), "Matcher must exclude _next/static");
    assert.ok(content.includes("uploads"), "Matcher must exclude uploads");
    assert.ok(content.includes("images"), "Matcher must exclude images");
  });
});
