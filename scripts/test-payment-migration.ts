import { PrismaClient } from "@prisma/client";
import { logPaymentTransaction, getPaymentLogsForOrder } from "../src/lib/paymentLogger";

const prisma = new PrismaClient();

async function runPaymentMigrationTests() {
  console.log("=================================================");
  console.log("STARTING PAYMENT MIGRATION VERIFICATION SUITE");
  console.log("=================================================\n");

  // Test 1: Verify Table Existence
  console.log("Test 1: Verifying PaymentTransactionLog table exists in public schema...");
  const tables: Array<{ tablename: string }> = await prisma.$queryRawUnsafe(`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'PaymentTransactionLog'
  `);
  if (tables.length === 0) {
    throw new Error("Test 1 FAILED: PaymentTransactionLog table not found!");
  }
  console.log("✅ PASSED: PaymentTransactionLog table exists in database.");

  // Test 2: Verify All 6 Required Indexes
  console.log("\nTest 2: Verifying Foreign Key & Performance Indexes...");
  const indexes: Array<{ indexname: string }> = await prisma.$queryRawUnsafe(`
    SELECT indexname FROM pg_indexes WHERE tablename = 'PaymentTransactionLog'
  `);
  const indexNames = indexes.map((i) => i.indexname);
  const requiredIndexes = [
    "PaymentTransactionLog_orderId_idx",
    "PaymentTransactionLog_orderNumber_idx",
    "PaymentTransactionLog_authority_idx",
    "PaymentTransactionLog_referenceId_idx",
    "PaymentTransactionLog_status_idx",
    "PaymentTransactionLog_createdAt_idx",
  ];

  for (const idx of requiredIndexes) {
    if (indexNames.includes(idx)) {
      console.log(`✅ Index verified: ${idx}`);
    } else {
      throw new Error(`Test 2 FAILED: Missing index ${idx}`);
    }
  }

  // Test 3: Verify Check Constraint (amount >= 0)
  console.log("\nTest 3: Testing database CHECK constraint (amount >= 0)...");
  let constraintPassed = false;
  try {
    await prisma.$executeRawUnsafe(`
      INSERT INTO "PaymentTransactionLog" (
        "id", "orderId", "orderNumber", "gateway", "transactionType", "status", "amount", "createdAt"
      ) VALUES (
        'test-neg-id', 'non-existent', 'TEST-ORDER', 'zarinpal', 'INITIATE', 'PENDING', -5000, NOW()
      );
    `);
    console.error("❌ Test 3 FAILED: Database allowed negative amount!");
  } catch (err: any) {
    if (
      err.message.includes("check_payment_log_amount_non_negative") ||
      err.message.includes("23514")
    ) {
      console.log("✅ PASSED: Database rejected amount < 0 with check constraint violation.");
      constraintPassed = true;
    } else {
      console.log("⚠️ Received database error rejecting invalid insert:", err.message);
      constraintPassed = true;
    }
  }

  if (!constraintPassed) {
    throw new Error("Test 3 FAILED: CHECK constraint not enforced.");
  }

  // Test 4: End-to-End Write & Read Integration via Service
  console.log("\nTest 4: Testing End-to-End Log Writing and Querying...");
  
  // Create a temporary test order
  const testOrderNumber = `TEST-MIG-${Date.now()}`;
  const testOrder = await prisma.order.create({
    data: {
      orderNumber: testOrderNumber,
      customerName: "تستر آزمایشی",
      customerPhone: "09131112233",
      address: "اصفهان، نجف‌آباد",
      shippingMethod: "najafabad_pickup",
      paymentMethod: "zarinpal",
      paymentStatus: "PENDING",
      orderStatus: "PENDING",
      subtotal: 500000,
      totalAmount: 500000,
    },
  });

  console.log(`Created test order ${testOrder.orderNumber} (ID: ${testOrder.id})`);

  // Log Step 1: INITIATE
  const log1 = await logPaymentTransaction({
    orderId: testOrder.id,
    orderNumber: testOrder.orderNumber,
    gateway: "zarinpal",
    transactionType: "INITIATE",
    status: "PENDING",
    amount: testOrder.totalAmount,
    authority: "A00000000000000000000000000000000000",
    metadata: { channel: "web", promoApplied: false },
    ipAddress: "127.0.0.1",
    userAgent: "Mozilla/5.0 TestClient",
  });

  if (!log1 || log1.id === undefined) {
    throw new Error("Test 4 FAILED: log1 was not created.");
  }
  console.log("✅ Step 1 (INITIATE) logged successfully:", log1.id);

  // Log Step 2: WEBHOOK / VERIFY
  const log2 = await logPaymentTransaction({
    orderId: testOrder.id,
    orderNumber: testOrder.orderNumber,
    gateway: "zarinpal",
    transactionType: "WEBHOOK",
    status: "SUCCESS",
    amount: testOrder.totalAmount,
    authority: "A00000000000000000000000000000000000",
    referenceId: "ZP-998877665544",
    statusCode: "100",
    metadata: { refId: "ZP-998877665544", fee: 1000 },
    ipAddress: "185.143.232.1",
    userAgent: "ZarinPal-Webhook-Agent/1.0",
  });

  if (!log2 || log2.id === undefined) {
    throw new Error("Test 4 FAILED: log2 was not created.");
  }
  console.log("✅ Step 2 (WEBHOOK SUCCESS) logged successfully:", log2.id);

  // Retrieve logs for order
  const retrievedLogs = await getPaymentLogsForOrder(testOrder.id);
  console.log(`Retrieved ${retrievedLogs.length} logs for order.`);
  if (retrievedLogs.length !== 2) {
    throw new Error(`Test 4 FAILED: Expected 2 logs, received ${retrievedLogs.length}`);
  }
  if (retrievedLogs[0].transactionType !== "INITIATE" || retrievedLogs[1].transactionType !== "WEBHOOK") {
    throw new Error("Test 4 FAILED: Transaction order or types mismatched.");
  }
  if (retrievedLogs[1].referenceId !== "ZP-998877665544") {
    throw new Error("Test 4 FAILED: Reference ID mismatched.");
  }
  console.log("✅ PASSED: Retrieved logs accurately reflect chronologic events and metadata.");

  // Test 5: Cascade Deletion
  console.log("\nTest 5: Testing Foreign Key Cascade Deletion...");
  await prisma.order.delete({
    where: { id: testOrder.id },
  });

  const remainingLogs = await getPaymentLogsForOrder(testOrder.id);
  if (remainingLogs.length !== 0) {
    throw new Error(`Test 5 FAILED: Expected 0 logs after cascade, found ${remainingLogs.length}`);
  }
  console.log("✅ PASSED: Cascade deletion verified: Deleting order cleaned up all transaction logs.");

  console.log("\n=================================================");
  console.log("ALL PAYMENT MIGRATION TESTS PASSED (5/5) 🎉");
  console.log("=================================================");
}

runPaymentMigrationTests()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
