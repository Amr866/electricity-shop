import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { releaseExpiredReservations } from "@/lib/stockReservation";
import { expireStaleRepairEstimates } from "@/lib/repairLifecycle";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
async function handleCron(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    logger.info("Inbound cron invocation for releasing reservations and stale repairs", {
      method: req.method,
      pathname: "/api/cron/release-reservations",
      ip,
    });

    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Optional bearer authentication if CRON_SECRET is configured
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const [stockResult, expiredRepairsCount] = await Promise.all([
      releaseExpiredReservations(),
      expireStaleRepairEstimates(prisma),
    ]);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      expiredRepairsCount,
      ...stockResult,
    });
  } catch (error: any) {
    logger.error("Error in release-reservations cron handler", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return handleCron(req);
}

export async function POST(req: NextRequest) {
  return handleCron(req);
}

