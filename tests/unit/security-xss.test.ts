import test from "node:test";
import assert from "node:assert/strict";
import {
  safeJsonLd,
  isSafeUrl,
  isSafeAttachmentUrl,
  sanitizeUrl,
} from "../../src/lib/utils/security";

test("Cross-Site Scripting (XSS) Defenses: safeJsonLd serialization", async () => {
  // 1. Script breakout attempt in JSON-LD string
  const maliciousPayload = {
    name: 'Electric Motor </script><script>alert("xss")</script>',
    description: "Reliable motor with <img src=x onerror=alert(1)> description",
  };

  const serialized = safeJsonLd(maliciousPayload);

  // Must not contain raw '<' characters
  assert.equal(
    serialized.includes("<"),
    false,
    "safeJsonLd must never output raw '<' characters"
  );
  assert.equal(
    serialized.includes("</script>"),
    false,
    "safeJsonLd must never contain raw </script> tag"
  );
  assert.equal(
    serialized.includes("\\u003c"),
    true,
    "safeJsonLd must escape '<' with '\\u003c'"
  );

  // Must still be valid parseable JSON in client/search engine
  const parsed = JSON.parse(serialized);
  assert.equal(parsed.name, maliciousPayload.name);
  assert.equal(parsed.description, maliciousPayload.description);
});

test("Cross-Site Scripting (XSS) Defenses: isSafeUrl validation", async () => {
  // 1. Dangerous scheme vectors
  const dangerousUrls = [
    "javascript:alert(1)",
    "JAVASCRIPT:alert(1)",
    "JavaScript:void(0)",
    "javascript :alert(1)",
    "  javascript:alert(1)  ",
    "\u0000javascript:alert(1)",
    "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
    "DATA:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
    "//attacker.com/evil.js", // protocol-relative URL
    "jav\tascript:alert(1)",
    "",
    "   ",
    null,
    undefined,
    12345,
    {},
  ];

  for (const url of dangerousUrls) {
    assert.equal(
      isSafeUrl(url),
      false,
      `Expected "${url}" to be rejected by isSafeUrl`
    );
  }

  // 2. Safe URL patterns
  const safeUrls = [
    "/products/motogen-3-4",
    "/uploads/boms/project-bill.xlsx",
    "/uploads/repairs/motor-coil.jpg",
    "https://shiasi-electric.ir/products",
    "https://example.com/datasheet.pdf",
    "http://example.com/datasheet.pdf",
  ];

  for (const url of safeUrls) {
    assert.equal(
      isSafeUrl(url),
      true,
      `Expected "${url}" to be accepted by isSafeUrl`
    );
  }
});

test("Cross-Site Scripting (XSS) Defenses: isSafeAttachmentUrl validation", async () => {
  // Only internal uploads and standard external HTTP(S) links allowed
  assert.equal(isSafeAttachmentUrl("/uploads/boms/file.xlsx"), true);
  assert.equal(isSafeAttachmentUrl("/uploads/repairs/plate.jpg"), true);
  assert.equal(isSafeAttachmentUrl("https://cdn.vendor.com/sheet.pdf"), true);
  assert.equal(isSafeAttachmentUrl("http://cdn.vendor.com/sheet.pdf"), true);

  // Unsafe / invalid attachments
  assert.equal(isSafeAttachmentUrl("javascript:alert(1)"), false);
  assert.equal(isSafeAttachmentUrl("data:application/pdf;base64,123"), false);
  assert.equal(isSafeAttachmentUrl("//attacker.com/sheet.pdf"), false);
  assert.equal(isSafeAttachmentUrl("/etc/passwd"), false);
  assert.equal(isSafeAttachmentUrl("/api/admin/backup"), false);
  assert.equal(isSafeAttachmentUrl(null), false);
  assert.equal(isSafeAttachmentUrl(""), false);
});

test("Cross-Site Scripting (XSS) Defenses: sanitizeUrl fallback behavior", async () => {
  assert.equal(sanitizeUrl("javascript:alert(1)", "#"), "#");
  assert.equal(sanitizeUrl(null, "#"), "#");
  assert.equal(
    sanitizeUrl("/uploads/file.pdf", "#"),
    "/uploads/file.pdf"
  );
  assert.equal(
    sanitizeUrl("https://shiasi-electric.ir", "#"),
    "https://shiasi-electric.ir"
  );
});
