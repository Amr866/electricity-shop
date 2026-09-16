import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function applyPaymentLogMigration() {
  console.log("=================================================");
  console.log("RUNNING PAYMENT TRANSACTION LOG MIGRATION");
  console.log("=================================================\n");

  // 1. Add idempotent PostgreSQL CHECK constraint (amount >= 0)
  console.log("Step 1: Applying CHECK (amount >= 0) constraint to PaymentTransactionLog...");
  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'check_payment_log_amount_non_negative'
        AND conrelid = 'public."PaymentTransactionLog"'::regclass
      ) THEN
        ALTER TABLE public."PaymentTransactionLog"
        ADD CONSTRAINT check_payment_log_amount_non_negative CHECK (amount >= 0);
        RAISE NOTICE 'Constraint check_payment_log_amount_non_negative created successfully.';
      ELSE
        RAISE NOTICE 'Constraint check_payment_log_amount_non_negative already exists.';
      END IF;
    END $$;
  `);
  console.log("✅ CHECK constraint check_payment_log_amount_non_negative verified/created.");

  // 2. Validate indexes on PaymentTransactionLog
  console.log("\nStep 2: Validating indexes on PaymentTransactionLog in pg_indexes...");
  const indexes: Array<{ indexname: string }> = await prisma.$queryRawUnsafe(`
    SELECT indexname FROM pg_indexes
    WHERE tablename = 'PaymentTransactionLog'
  `);
  const indexNames = indexes.map((i) => i.indexname);
  console.log("Found PaymentTransactionLog indexes:", indexNames);

  const requiredIndexes = [
    "PaymentTransactionLog_orderId_idx",
    "PaymentTransactionLog_orderNumber_idx",
    "PaymentTransactionLog_authority_idx",
    "PaymentTransactionLog_referenceId_idx",
    "PaymentTransactionLog_status_idx",
    "PaymentTransactionLog_createdAt_idx",
  ];

  for (const reqIdx of requiredIndexes) {
    if (indexNames.includes(reqIdx)) {
      console.log(`✅ Verified index: ${reqIdx}`);
    } else {
      throw new Error(`Migration check failed: Missing index ${reqIdx}`);
    }
  }

  console.log("\n=================================================");
  console.log("PAYMENT TRANSACTION LOG MIGRATION COMPLETED");
  console.log("=================================================");
}

if (require.main === module) {
  applyPaymentLogMigration()
    .catch((e) => {
      console.error("Migration failed:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
