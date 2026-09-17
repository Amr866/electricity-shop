import test from "node:test";
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

test("Phase 1: Seeded Motogen 3/4 cooler motor has authentic images and real reviews", async (t) => {
  const motor = await prisma.product.findFirst({
    where: { sku: "APP-CLR-MOT75" },
    include: { images: true, reviews: true },
  });

  assert.ok(motor, "Motogen 3/4 motor (APP-CLR-MOT75) must exist in DB");

  // Check images: must not have generator image
  const hasGeneratorImage = motor.images.some((img) =>
    img.url.toLowerCase().includes("generator")
  );
  assert.equal(
    hasGeneratorImage,
    false,
    "Motor images should not contain a generator thumbnail"
  );

  // Check reviews: must have real reviews seeded
  assert.ok(
    motor.reviews && motor.reviews.length >= 3,
    `Motor must have at least 3 real seeded reviews, found: ${motor.reviews?.length || 0}`
  );

  // Check review count parity
  assert.equal(
    motor.reviews.length,
    motor.reviewCount,
    `Review records count (${motor.reviews.length}) must match reviewCount field (${motor.reviewCount})`
  );
});
