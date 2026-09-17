import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { normalizeIranianPhone, toAsciiDigits } from "../src/lib/utils.ts";
import { hashPassword, verifyPassword } from "../src/lib/password.ts";

describe("Phase 2 - Backend Auth & Security Tests", () => {
  test("Password hashing and verification with scrypt/crypto", () => {
    const rawPass = "SecretAdmin123!";
    const hashed = hashPassword(rawPass);
    assert.ok(hashed.includes(":"), "Hash must contain salt separator");
    assert.strictEqual(verifyPassword(rawPass, hashed), true, "Valid password must verify");
    assert.strictEqual(verifyPassword("WrongPass", hashed), false, "Invalid password must fail");
    assert.strictEqual(verifyPassword(rawPass, "legacyPassword123"), false);
    assert.strictEqual(verifyPassword("legacyPassword123", "legacyPassword123"), false, "Plaintext passwords without salt must be rejected");
  });

  test("Postal code normalization and 10-digit validation", () => {
    const validAscii = "8415612345";
    const validPersian = "۸۴۱۵۶۱۲۳۴۵";
    const invalidShort = "84156";
    const invalidLong = "84156123456";
    const invalidChars = "841561234a";

    const regex = /^\d{10}$/;

    assert.ok(regex.test(toAsciiDigits(validAscii)));
    assert.ok(regex.test(toAsciiDigits(validPersian)));
    assert.strictEqual(regex.test(toAsciiDigits(invalidShort)), false);
    assert.strictEqual(regex.test(toAsciiDigits(invalidLong)), false);
    assert.strictEqual(regex.test(toAsciiDigits(invalidChars)), false);
  });

  test("COD eligibility logic", () => {
    const isCodEligible = (paymentMethod, shippingMethod) => {
      if (paymentMethod !== "cod_isfahan") return true;
      const allowedShipping = ["najafabad_courier", "isfahan_express", "store_pickup"];
      return allowedShipping.includes(shippingMethod);
    };

    assert.strictEqual(isCodEligible("cod_isfahan", "isfahan_express"), true);
    assert.strictEqual(isCodEligible("cod_isfahan", "najafabad_courier"), true);
    assert.strictEqual(isCodEligible("cod_isfahan", "store_pickup"), true);
    assert.strictEqual(isCodEligible("cod_isfahan", "iran_post"), false);
    assert.strictEqual(isCodEligible("cod_isfahan", "tipax"), false);
    assert.strictEqual(isCodEligible("zarinpal", "iran_post"), true);
  });

  test("Integration: /api/auth/check-user on running server", async () => {
    const res = await fetch("http://localhost:3000/api/auth/check-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "09136260072" }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.role, "ADMIN");
    assert.strictEqual(data.hasPassword, true);

    // New customer phone
    const res2 = await fetch("http://localhost:3000/api/auth/check-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "09998887766" }),
    });
    assert.strictEqual(res2.status, 200);
    const data2 = await res2.json();
    assert.strictEqual(data2.role, "CUSTOMER");
    assert.strictEqual(data2.hasPassword, false);
  });

  test("Integration: /api/checkout rejects invalid postal code", async () => {
    const res = await fetch("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "تست کننده",
        customerPhone: "09131234567",
        address: "اصفهان، نجف آباد",
        postalCode: "12345", // Invalid (only 5 digits)
        items: [{ id: "cmu4yfb123", productId: "cmu4yfb123", quantity: 1, name: "کالا" }],
      }),
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.match(data.message, /کد پستی باید دقیقاً ۱۰ رقم عددی باشد/);
  });

  test("Integration: /api/checkout rejects COD on iran_post", async () => {
    const res = await fetch("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "تست کننده",
        customerPhone: "09131234567",
        address: "اصفهان، نجف آباد",
        postalCode: "8415612345",
        shippingMethod: "iran_post",
        paymentMethod: "cod_isfahan",
        items: [{ id: "cmu4yfb123", productId: "cmu4yfb123", quantity: 1, name: "کالا" }],
      }),
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.match(data.message, /پرداخت در محل فقط برای ارسال فوری/);
  });

  test("Integration: DELETE /api/admin/orders requires ADMIN session", async () => {
    const res = await fetch("http://localhost:3000/api/admin/orders?orderId=fake-id", {
      method: "DELETE",
    });
    assert.ok([401, 403].includes(res.status), `Expected 401 or 403, got ${res.status}`);
  });
});
