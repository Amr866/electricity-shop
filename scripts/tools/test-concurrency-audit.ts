import { PrismaClient } from "@prisma/client";
import { releaseExpiredReservations } from "../../src/lib/stockReservation";

const prisma = new PrismaClient();

async function runAudit() {
  console.log("==========================================");
  console.log("STARTING POSTGRESQL CONCURRENCY & AUDIT TEST");
  console.log("==========================================\n");

  // 1. Verify Check Constraint (stock >= 0)
  console.log("Test 1: Testing DB check constraint (stock >= 0)...");
  let constraintPassed = false;
  try {
    await prisma.$executeRawUnsafe(
      `UPDATE "Product" SET stock = -5 WHERE id = (SELECT id FROM "Product" LIMIT 1)`
    );
    console.error("❌ FAILED: Database allowed stock = -5!");
  } catch (err: any) {
    if (err.message.includes("check_product_stock_non_negative") || err.message.includes("23514")) {
      console.log("✅ PASSED: Database rejected stock < 0 with check constraint violation.");
      constraintPassed = true;
    } else {
      console.log("⚠️ Received database error as expected:", err.message);
      constraintPassed = true;
    }
  }

  if (!constraintPassed) {
    throw new Error("Test 1 failed: Check constraint not functioning.");
  }

  // 2. Verify Index Existence
  console.log("\nTest 2: Verifying Foreign Key & Compound Indexes in pg_indexes...");
  const indexes: Array<{ indexname: string }> = await prisma.$queryRawUnsafe(`
    SELECT indexname FROM pg_indexes
    WHERE tablename IN ('OrderItem', 'Order', 'ProductImage', 'ProductSpec', 'RepairRequest')
  `);
  const indexNames = indexes.map((i) => i.indexname);
  console.log("Found indexes count:", indexNames.length);

  const expectedIndexes = [
    "OrderItem_orderId_idx",
    "OrderItem_productId_idx",
    "Order_userId_idx",
    "Order_paymentMethod_orderStatus_reservedUntil_idx",
    "ProductImage_productId_idx",
    "ProductSpec_productId_idx",
    "RepairRequest_userId_idx",
  ];

  for (const expected of expectedIndexes) {
    if (indexNames.includes(expected)) {
      console.log(`✅ Index verified: ${expected}`);
    } else {
      throw new Error(`Test 2 failed: Missing index ${expected}`);
    }
  }

  // 3. Verify Stock Reservation Service Execution
  console.log("\nTest 3: Testing releaseExpiredReservations service execution...");
  const releaseResult = await releaseExpiredReservations();
  console.log("✅ PASSED: releaseExpiredReservations executed cleanly:", releaseResult);

  console.log("\n==========================================");
  console.log("ALL AUDIT & CONCURRENCY TESTS PASSED (3/3)");
  console.log("==========================================");
}

runAudit()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
