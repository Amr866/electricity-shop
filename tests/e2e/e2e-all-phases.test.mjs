import test from "node:test";
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "../../src/lib/password.ts";
import { toAsciiDigits, normalizeIranianPhone } from "../../src/lib/utils.ts";

const prisma = new PrismaClient();
const BASE_URL = "http://localhost:3000";

test("E2E Verification - Phase 1: Seeded Product Data & Photos", async () => {
  const motor = await prisma.product.findFirst({
    where: { slug: "motogen-cooler-motor-34hp-copper" },
    include: { images: true, reviews: true },
  });
  assert.ok(motor, "Motogen cooler motor exists");
  assert.ok(motor.images.length > 0, "Motor has images");
  assert.ok(
    motor.images.some(img => img.url.includes("adonyig-machine") || img.url.includes("موتور-کولر")),
    "Motor uses technical machine image"
  );
  assert.ok(
    !motor.images.some(img => img.url.toLowerCase().includes("generator")),
    "Generator image is removed"
  );
  assert.ok(motor.reviews.length >= 2, "Authentic cooler motor reviews seeded");
});

test("E2E Verification - Phase 2 & 7: Check User Capabilities & Security", async () => {
  // Test admin check
  const resAdmin = await fetch(`${BASE_URL}/api/auth/check-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: "09136260072" }),
  });
  const dataAdmin = await resAdmin.json();
  assert.equal(resAdmin.status, 200);
  assert.equal(dataAdmin.role, "ADMIN");
  assert.equal(dataAdmin.hasPassword, true);

  // Test non-admin customer check
  const resCust = await fetch(`${BASE_URL}/api/auth/check-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: "09350001122" }),
  });
  const dataCust = await resCust.json();
  assert.equal(resCust.status, 200);
  assert.equal(dataCust.hasPassword, false);
});

test("E2E Verification - Phase 5: Checkout Postal Code & COD Restrictions", async () => {
  // Test invalid postal code rejection
  const resBadPostal = await fetch(`${BASE_URL}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerName: "تست",
      customerPhone: "09131112233",
      province: "اصفهان",
      city: "نجف‌آباد",
      postalCode: "12345",
      address: "خیابان شریعتی",
      shippingMethod: "fast_courier_najafabad",
      paymentMethod: "zarinpal",
      items: [{ productId: "test", productName: "تست", price: 1000, quantity: 1, total: 1000 }],
      totalAmount: 1000,
    }),
  });
  const badPostalData = await resBadPostal.json();
  assert.equal(resBadPostal.status, 400);
  assert.ok(badPostalData.message.includes("۱۰ رقم"));

  // Test COD rejected on nationwide post
  const resBadCod = await fetch(`${BASE_URL}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerName: "تست",
      customerPhone: "09131112233",
      province: "اصفهان",
      city: "نجف‌آباد",
      postalCode: "8415612345",
      address: "خیابان شریعتی",
      shippingMethod: "iran_post",
      paymentMethod: "cod_isfahan",
      items: [{ productId: "test", productName: "تست", price: 1000, quantity: 1, total: 1000 }],
      totalAmount: 1000,
    }),
  });
  const badCodData = await resBadCod.json();
  assert.equal(resBadCod.status, 400);
  assert.ok(badCodData.message.includes("پرداخت در محل"));
});

test("E2E Verification - Phase 6: Admin Orders Delete Authorization Guard", async () => {
  const res = await fetch(`${BASE_URL}/api/admin/orders?orderId=non-existent`, {
    method: "DELETE",
  });
  assert.ok(
    res.status === 401 || res.status === 403,
    "Unauthenticated DELETE request must be rejected with 401 or 403"
  );
});
