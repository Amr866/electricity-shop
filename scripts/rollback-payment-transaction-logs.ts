import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function rollbackPaymentLogMigration() {
  console.log("=================================================");
  console.log("ROLLBACK: PAYMENT TRANSACTION LOG MIGRATION");
  console.log("=================================================\n");

  console.log("Step 1: Dropping check constraint if exists...");
  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'check_payment_log_amount_non_negative'
      ) THEN
        ALTER TABLE public."PaymentTransactionLog"
        DROP CONSTRAINT check_payment_log_amount_non_negative;
        RAISE NOTICE 'Dropped check_payment_log_amount_non_negative.';
      END IF;
    END $$;
  `);

  console.log("Step 2: Dropping PaymentTransactionLog table if exists...");
  await prisma.$executeRawUnsafe(`
    DROP TABLE IF EXISTS public."PaymentTransactionLog" CASCADE;
  `);

  console.log("\n=================================================");
  console.log("ROLLBACK COMPLETED: PaymentTransactionLog table removed.");
  console.log("Core tables (Order, Product, etc.) untouched.");
  console.log("=================================================");
}

if (require.main === module) {
  rollbackPaymentLogMigration()
    .catch((e) => {
      console.error("Rollback failed:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
