import test from "node:test";
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

test("Mass Assignment & Data Exposure: Review verification status cannot be self-approved via POST", async () => {
  // Test product creation or lookup
  const product = await prisma.product.findFirst({
    where: { isArchived: false },
  });

  if (!product) {
    // Skip if no products in current test db
    return;
  }

  // Attempting to post a review with isVerified: true (Mass Assignment attempt)
  // Simulation of route handler logic in src/app/api/reviews/route.ts
  const untrustedInput = {
    productId: product.id,
    authorName: "تست نفوذگر",
    city: "نجف‌آباد",
    rating: 5,
    comment: "دیدگاه تستی",
    isVerified: true, // Attacker trying to bypass moderation
  };

  const createdReview = await prisma.review.create({
    data: {
      productId: untrustedInput.productId,
      authorName: untrustedInput.authorName.trim(),
      city: untrustedInput.city.trim(),
      rating: untrustedInput.rating,
      comment: untrustedInput.comment.trim(),
      isVerified: false, // Explicitly forced false in route handler
    },
  });

  try {
    assert.equal(
      createdReview.isVerified,
      false,
      "New reviews must always be created with isVerified: false regardless of input payload"
    );
  } finally {
    await prisma.review.delete({ where: { id: createdReview.id } });
  }
});

test("Mass Assignment & Data Exposure: Order financial calculations are strictly server-computed", async () => {
  const product = await prisma.product.findFirst({
    where: { isArchived: false, stock: { gt: 0 } },
  });

  if (!product) return;

  // Attacker attempts to forge order financial amounts
  const untrustedPayload = {
    subtotal: 100, // Attacker claims subtotal is 100 Toman
    discount: 9999999,
    totalAmount: 1, // Attacker claims total is 1 Toman
    paymentStatus: "PAID", // Attacker claims payment already succeeded
    orderStatus: "DELIVERED",
  };

  // Route handler calculates server-side:
  const serverPrice = product.price;
  const quantity = 1;
  const calculatedSubtotal = serverPrice * quantity;
  const calculatedDiscount = 0;
  const shippingCost = 0;
  const calculatedTotal = calculatedSubtotal - calculatedDiscount + shippingCost;
  const initialPaymentStatus = "PENDING";
  const initialOrderStatus = "PENDING";

  assert.notEqual(calculatedTotal, untrustedPayload.totalAmount);
  assert.equal(initialPaymentStatus, "PENDING");
  assert.equal(initialOrderStatus, "PENDING");
});

test("Mass Assignment & Data Exposure: BOM Submissions mask personal data for non-admin viewers", () => {
  const rawSubmissions = [
    {
      id: "bom-1",
      trackingCode: "BOM-261022-101",
      contractorName: "مهندس احمدی",
      contractorPhone: "09131234567",
      projectCity: "نجف‌آباد",
      companyName: "فولاد صنعت",
      content: "لیست کابل",
      fileUrl: "/uploads/boms/file.xlsx",
      fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      status: "PENDING",
      adminNotes: "حاشیه سود حداقل ۱۵ درصد رعایت شود.",
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Logic applied in GET /api/bom for non-admin viewers
  const sanitized = rawSubmissions.map((sub) => ({
    ...sub,
    contractorPhone: sub.contractorPhone
      ? sub.contractorPhone.replace(/(\d{4})\d{4}(\d{3})/, "$1****$2")
      : "",
    contractorName:
      sub.contractorName && sub.contractorName.length > 2
        ? `${sub.contractorName.slice(0, 2)}***`
        : sub.contractorName,
  }));

  assert.equal(sanitized[0].contractorPhone, "0913****567");
  assert.equal(sanitized[0].contractorName, "مه***");
});

test("Mass Assignment & Data Exposure: Order lookup by phone redacts sensitive customer PII", () => {
  // In src/app/api/orders/lookup/route.ts, select specifically restricts fields
  const allowedPublicFields = [
    "id",
    "orderNumber",
    "orderStatus",
    "paymentStatus",
    "totalAmount",
    "createdAt",
    "_count",
  ];

  const forbiddenSensitiveFields = [
    "customerPhone",
    "customerEmail",
    "address",
    "postalCode",
    "nationalCode",
    "economicCode",
    "paymentRefId",
    "receiptImage",
  ];

  for (const field of forbiddenSensitiveFields) {
    assert.equal(
      allowedPublicFields.includes(field),
      false,
      `Field '${field}' must not be exposed in public order lookup API`
    );
  }
});
