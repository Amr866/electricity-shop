import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { logPaymentTransaction } from "@/lib/paymentLogger";

export interface ReleaseResult {
  releasedCount: number;
  restoredItemsCount: number;
}

/**
 * Atomically releases expired Card-to-Card reservations.
 * Uses atomic status check (orderStatus: PENDING -> CANCELLED) before restoring inventory,
 * preventing race conditions and double-restocking across concurrent workers.
 *
 * Invariant: Orders with an uploaded payment receipt (receiptImage != null) are preserved
 * for administrative manual verification and are never auto-cancelled.
 */
export async function releaseExpiredReservations(): Promise<ReleaseResult> {
  const now = new Date();

  // Find candidate expired orders using compound index: @@index([paymentMethod, orderStatus, reservedUntil])
  // Protect orders that have uploaded payment proof from premature auto-expiration
  const expiredOrders = await prisma.order.findMany({
    where: {
      paymentMethod: "card_to_card",
      paymentStatus: "PENDING",
      orderStatus: "PENDING",
      receiptImage: null,
      reservedUntil: { lt: now },
    },
    include: {
      items: true,
    },
    take: 50, // Batch limit per cycle to avoid long transaction locks
  });

  if (expiredOrders.length === 0) {
    return { releasedCount: 0, restoredItemsCount: 0 };
  }

  let releasedCount = 0;
  let restoredItemsCount = 0;

  for (const order of expiredOrders) {
    try {
      await prisma.$transaction(async (tx) => {
        // Atomic status claim: ensure no other concurrent worker already processed this order
        const claimResult = await tx.order.updateMany({
          where: {
            id: order.id,
            orderStatus: "PENDING",
          },
          data: {
            orderStatus: "CANCELLED",
            paymentStatus: "FAILED",
          },
        });

        // If count is 0, another concurrent request claimed this order; skip restocking
        if (claimResult.count === 0) {
          return;
        }

        // Deterministically sort items by productId before restocking to prevent deadlocks
        const validItems = order.items
          .filter((it): it is typeof it & { productId: string } => Boolean(it.productId))
          .sort((a, b) => a.productId.localeCompare(b.productId));

        for (const item of validItems) {
          // Use updateMany to prevent crashing the transaction if a product was deleted
          const updateProduct = await tx.product.updateMany({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
          if (updateProduct.count > 0) {
            restoredItemsCount += item.quantity;
          }
        }

        releasedCount++;
      });

      // Audit trail: record transaction log for inventory release
      await logPaymentTransaction({
        orderId: order.id,
        orderNumber: order.orderNumber,
        gateway: "card_to_card",
        transactionType: "INVENTORY_RELEASE",
        status: "CANCELLED",
        amount: order.totalAmount,
        metadata: {
          reason: "8-hour Card-to-Card reservation expired without receipt upload",
          itemsCount: order.items.length,
        },
      });

      logger.info("Released expired order stock reservation", {
        orderNumber: order.orderNumber,
        itemsCount: order.items.length,
      });
    } catch (err) {
      logger.error("Failed to release expired order stock", {
        orderId: order.id,
        error: err,
      });
    }
  }

  return { releasedCount, restoredItemsCount };
}
