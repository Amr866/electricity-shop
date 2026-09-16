import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Applying PostgreSQL database constraints...");

  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'check_product_stock_non_negative'
        AND conrelid = 'public."Product"'::regclass
      ) THEN
        ALTER TABLE public."Product"
        ADD CONSTRAINT check_product_stock_non_negative CHECK (stock >= 0);
        RAISE NOTICE 'Constraint check_product_stock_non_negative created successfully.';
      ELSE
        RAISE NOTICE 'Constraint check_product_stock_non_negative already exists.';
      END IF;
    END $$;
  `);

  console.log("Database constraints verification complete.");
}

main()
  .catch((e) => {
    console.error("Failed to apply constraints:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
