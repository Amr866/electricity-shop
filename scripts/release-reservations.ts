import { prisma } from "../src/lib/prisma";
import { releaseExpiredReservations } from "../src/lib/domain/stockReservation";
import { expireStaleRepairEstimates } from "../src/lib/domain/repairLifecycle";

async function main() {
  console.log("⏱️  [Cron Job] Starting automated release for expired stock reservations and stale repairs...");
  const startTime = Date.now();

  try {
    const [stockResult, expiredRepairsCount] = await Promise.all([
      releaseExpiredReservations(),
      expireStaleRepairEstimates(prisma),
    ]);

    const duration = Date.now() - startTime;
    console.log(`✅ [Cron Job] Completed in ${duration}ms:`);
    console.log(`   - سفارشات پرداخت‌نشده منقضی و لغو شده: ${stockResult.releasedCount}`);
    console.log(`   - اقلام بازگردانده شده به موجودی انبار: ${stockResult.restoredItemsCount}`);
    console.log(`   - پیش‌فاکتورهای منقضی شده تعمیرگاه: ${expiredRepairsCount}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ [Cron Job Error]:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
