import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export type PaymentGatewayType = "zarinpal" | "card_to_card" | "cod_isfahan" | string;

export type PaymentTransactionType =
  | "INITIATE"
  | "VERIFY"
  | "WEBHOOK"
  | "ADMIN_CONFIRM"
  | "REVERT"
  | string;

export type PaymentStatusType = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | string;

export interface CreatePaymentLogInput {
  orderId: string;
  orderNumber: string;
  gateway: PaymentGatewayType;
  transactionType: PaymentTransactionType;
  status: PaymentStatusType;
  amount: number;
  authority?: string | null;
  referenceId?: string | null;
  cardPan?: string | null;
  cardHash?: string | null;
  statusCode?: string | null;
  errorMessage?: string | null;
  metadata?: Record<string, any> | string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Creates an immutable audit record for a payment transaction event.
 * Fail-safe: handles and logs any database logging error without blocking
 * the primary financial flow.
 */
export async function logPaymentTransaction(input: CreatePaymentLogInput) {
  try {
    const formattedMetadata =
      typeof input.metadata === "object" && input.metadata !== null
        ? JSON.stringify(input.metadata)
        : input.metadata || null;

    const logEntry = await prisma.paymentTransactionLog.create({
      data: {
        orderId: input.orderId,
        orderNumber: input.orderNumber,
        gateway: input.gateway,
        transactionType: input.transactionType,
        status: input.status,
        amount: Math.max(0, Math.round(input.amount)),
        authority: input.authority || null,
        referenceId: input.referenceId || null,
        cardPan: input.cardPan || null,
        cardHash: input.cardHash || null,
        statusCode: input.statusCode ? String(input.statusCode) : null,
        errorMessage: input.errorMessage || null,
        metadata: formattedMetadata,
        ipAddress: input.ipAddress || null,
        userAgent: input.userAgent || null,
      },
    });

    logger.info("Recorded payment transaction log", {
      logId: logEntry.id,
      orderNumber: input.orderNumber,
      gateway: input.gateway,
      type: input.transactionType,
      status: input.status,
      amount: input.amount,
      ref: input.referenceId || input.authority,
    });

    return logEntry;
  } catch (error) {
    logger.error("Failed to record payment transaction log", {
      orderNumber: input.orderNumber,
      error,
    });
    return null;
  }
}

/**
 * Retrieves all chronological payment transaction logs for an order.
 */
export async function getPaymentLogsForOrder(orderIdOrNumber: string) {
  try {
    return await prisma.paymentTransactionLog.findMany({
      where: {
        OR: [{ orderId: orderIdOrNumber }, { orderNumber: orderIdOrNumber }],
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  } catch (error) {
    logger.error("Failed to query payment transaction logs", {
      orderIdOrNumber,
      error,
    });
    return [];
  }
}
