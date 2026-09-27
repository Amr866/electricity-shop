import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Account Latency & Media Convergence Suite (TDD)", () => {
  const rootDir = process.cwd();

  it("Seam 1: Header.tsx implements instant user cache and skeleton loader during session loading", () => {
    const headerPath = path.join(rootDir, "src", "components", "layout", "Header.tsx");
    assert.ok(fs.existsSync(headerPath), "Header.tsx must exist");
    const content = fs.readFileSync(headerPath, "utf-8");

    // Must utilize shiasi_user_cache to eliminate delay/flash
    assert.ok(
      content.includes("shiasi_user_cache"),
      "Header.tsx must check and maintain 'shiasi_user_cache' in localStorage"
    );
    // Must handle status === 'loading' with cached user or skeleton rather than bare login link
    assert.ok(
      content.includes("status === \"loading\"") || content.includes("status === 'loading'"),
      "Header.tsx must specifically inspect loading status"
    );
    assert.ok(
      content.includes("animate-pulse"),
      "Header.tsx must provide a skeleton placeholder (animate-pulse) during initial session resolution"
    );
  });

  it("Seam 2: /account route is a Server Component with direct Prisma prefetching and CustomerAccountClient", () => {
    const accountPagePath = path.join(rootDir, "src", "app", "account", "page.tsx");
    const accountClientPath = path.join(rootDir, "src", "app", "account", "CustomerAccountClient.tsx");

    assert.ok(fs.existsSync(accountPagePath), "account/page.tsx must exist");
    assert.ok(fs.existsSync(accountClientPath), "account/CustomerAccountClient.tsx must exist");

    const pageContent = fs.readFileSync(accountPagePath, "utf-8");
    // page.tsx should NOT be a "use client" component
    assert.ok(
      !pageContent.startsWith('"use client"') && !pageContent.startsWith("'use client'"),
      "src/app/account/page.tsx must be a Server Component (RSC) to eliminate client waterfall"
    );
    assert.ok(
      pageContent.includes("getServerSession"),
      "account/page.tsx must resolve authentication server-side via getServerSession"
    );
    assert.ok(
      pageContent.includes("prisma.order") && pageContent.includes("prisma.repairRequest"),
      "account/page.tsx must prefetch orders and repairRequests directly from Prisma"
    );

    const clientContent = fs.readFileSync(accountClientPath, "utf-8");
    assert.ok(
      clientContent.includes('"use client"') || clientContent.includes("'use client'"),
      "CustomerAccountClient.tsx must be a Client Component"
    );
  });

  it("Seam 3: UploadsAdminClient implements pagination (T008)", () => {
    const uploadsClientPath = path.join(rootDir, "src", "app", "admin", "uploads", "UploadsAdminClient.tsx");
    assert.ok(fs.existsSync(uploadsClientPath), "UploadsAdminClient.tsx must exist");
    const content = fs.readFileSync(uploadsClientPath, "utf-8");

    // Grid: 24, Table: 50
    assert.ok(content.includes("24"), "UploadsAdminClient must support grid page size of 24");
    assert.ok(content.includes("50"), "UploadsAdminClient must support table page size of 50");
    // Page controls
    assert.ok(
      content.includes("currentPage") || content.includes("page"),
      "UploadsAdminClient must maintain pagination state"
    );
  });

  it("Seam 4: UploadsAdminClient supports 'articles' folder tab & article badge (T009)", () => {
    const uploadsClientPath = path.join(rootDir, "src", "app", "admin", "uploads", "UploadsAdminClient.tsx");
    const content = fs.readFileSync(uploadsClientPath, "utf-8");

    assert.ok(
      content.includes('"articles"'),
      "UploadsAdminClient must include 'articles' in its folder tab options"
    );
    assert.ok(
      content.includes("مقاله") || content.includes("مقالات"),
      "UploadsAdminClient must render Persian article badge or label"
    );
  });

  it("Seam 5: UploadsAdminClient wraps filenames, URLs and sizes in <bdi dir=\"ltr\"> (T010)", () => {
    const uploadsClientPath = path.join(rootDir, "src", "app", "admin", "uploads", "UploadsAdminClient.tsx");
    const content = fs.readFileSync(uploadsClientPath, "utf-8");

    assert.ok(
      content.includes("<bdi dir=\"ltr\">") || content.includes("<bdi dir='ltr'>") || content.includes('<bdi dir="ltr"'),
      "UploadsAdminClient must isolate LTR alphanumeric strings using <bdi dir=\"ltr\">"
    );
  });
});
