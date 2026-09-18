/**
 * Technical Repair Workshop Lifecycle & State Machine Engine
 * Deep module encapsulating the 7-stage repair state transitions, tracking code generation,
 * cost approval invariants, and automated SMS notification formatting.
 */

export const REPAIR_STAGES = [
  "SUBMITTED",       // درخواست ثبت شده
  "RECEIVED",        // تحویل کارگاه نجف‌آباد شده
  "INSPECTING",      // در حال کارشناسی و عیب‌یابی
  "COST_ESTIMATED",  // برآورد هزینه و در انتظار تایید مشتری
  "REPAIRING",       // در حال تعمیر و تعویض قطعه
  "READY",           // آماده تحویل / آماده تسویه
  "DELIVERED",       // تحویل داده شده به مشتری
  "CANCELLED",       // انصراف از تعمیر یا مرجوع
] as const;

export type RepairStage = (typeof REPAIR_STAGES)[number];

export const COST_APPROVAL_STATUSES = ["PENDING", "APPROVED", "DECLINED"] as const;
export type CostApprovalStatus = (typeof COST_APPROVAL_STATUSES)[number];

export const APPROVAL_CHANNELS = ["PORTAL", "SMS", "PHONE"] as const;
export type ApprovalChannel = (typeof APPROVAL_CHANNELS)[number];

// Allowed state transitions graph
const VALID_TRANSITIONS: Record<RepairStage, RepairStage[]> = {
  SUBMITTED: ["RECEIVED", "INSPECTING", "CANCELLED"],
  RECEIVED: ["INSPECTING", "COST_ESTIMATED", "CANCELLED"],
  INSPECTING: ["COST_ESTIMATED", "REPAIRING", "READY", "CANCELLED"],
  COST_ESTIMATED: ["REPAIRING", "READY", "CANCELLED"],
  REPAIRING: ["READY", "CANCELLED"],
  READY: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: ["INSPECTING", "SUBMITTED"], // Re-opening if customer changes mind
};

/**
 * Validates whether a state transition is legal within the workshop lifecycle.
 */
export function isValidRepairTransition(current: RepairStage, target: RepairStage): boolean {
  if (current === target) return true;
  const allowed = VALID_TRANSITIONS[current] || [];
  return allowed.includes(target);
}

/**
 * Generates an Iranian technical workshop tracking code: REP-YYMMDD-XXXX.
 */
export function generateRepairTrackingCode(date = new Date()): string {
  const datePrefix = date.toISOString().slice(2, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `REP-${datePrefix}-${randomSuffix}`;
}

/**
 * Evaluates a cost approval decision from portal, SMS, or verbal phone agreement.
 * Strictly enforces that cost approval can only happen when stage is COST_ESTIMATED
 * and costApprovalStatus is PENDING.
 */
export function evaluateCostApprovalDecision(
  currentStage: string | null | undefined,
  currentApproval: string | null | undefined,
  decision: "APPROVE" | "DECLINE",
  channel: ApprovalChannel = "PORTAL"
): {
  isValid: boolean;
  error?: string;
  nextStatus?: RepairStage;
  nextApprovalStatus?: CostApprovalStatus;
  approvalChannel?: ApprovalChannel;
  timestamp?: Date;
  noteAppend?: string;
} {
  if (currentStage !== "COST_ESTIMATED" || currentApproval !== "PENDING") {
    return {
      isValid: false,
      error: "درخواست در وضعیت برآورد هزینه یا انتظار برای تایید قرار ندارد.",
    };
  }

  const isApproved = decision === "APPROVE";
  const nextStatus: RepairStage = isApproved ? "REPAIRING" : "CANCELLED";
  const nextApprovalStatus: CostApprovalStatus = isApproved ? "APPROVED" : "DECLINED";
  const now = new Date();

  const channelLabel =
    channel === "PORTAL" ? "پرتال آنلاین" : channel === "SMS" ? "پیامک" : "تلفنی";

  const noteAppend = `[سیستم]: هزینه تعمیر توسط مشتری از طریق ${channelLabel} در تاریخ ${now.toLocaleDateString("fa-IR")} ${
    isApproved ? "تایید شد" : "رد شد"
  }.`;

  return {
    isValid: true,
    nextStatus,
    nextApprovalStatus,
    approvalChannel: channel,
    timestamp: now,
    noteAppend,
  };
}

/**
 * Generates SMS notification payload and tracking link when entering COST_ESTIMATED.
 */
export function getCostEstimationSmsPayload(ticket: {
  trackingCode: string;
  customerPhone: string;
  estimatedCost: number;
}): {
  recipient: string;
  message: string;
  trackingUrl: string;
} {
  const trackingUrl = `https://shiasi.ir/repair-service?code=${ticket.trackingCode}`;
  const formattedCost = ticket.estimatedCost.toLocaleString();
  const message = `فروشگاه و کارگاه شیاسی\nسفارش تعمیر ${ticket.trackingCode} برآورد هزینه شد: ${formattedCost} تومان\nمشاهده و تایید هزینه:\n${trackingUrl}`;

  return {
    recipient: ticket.customerPhone,
    message,
    trackingUrl,
  };
}

/**
 * Returns UI styling, Persian titles, and sequence order for any repair stage.
 */
export function getRepairStageMetadata(stage: RepairStage): {
  labelPersian: string;
  stepNumber: number;
  badgeClass: string;
} {
  switch (stage) {
    case "SUBMITTED":
      return { labelPersian: "ثبت اولیه", stepNumber: 1, badgeClass: "bg-blue-900/60 text-blue-300" };
    case "RECEIVED":
      return { labelPersian: "پذیرش در کارگاه", stepNumber: 2, badgeClass: "bg-indigo-900/60 text-indigo-300" };
    case "INSPECTING":
      return { labelPersian: "کارشناسی و عیب‌یابی", stepNumber: 3, badgeClass: "bg-purple-900/60 text-purple-300" };
    case "COST_ESTIMATED":
      return { labelPersian: "برآورد هزینه", stepNumber: 4, badgeClass: "bg-amber-900/60 text-amber-300" };
    case "REPAIRING":
      return { labelPersian: "در حال تعمیر", stepNumber: 5, badgeClass: "bg-orange-900/60 text-orange-300" };
    case "READY":
      return { labelPersian: "آماده تحویل", stepNumber: 6, badgeClass: "bg-emerald-900/60 text-emerald-300" };
    case "DELIVERED":
      return { labelPersian: "تحویل داده شد", stepNumber: 7, badgeClass: "bg-green-900/60 text-green-300" };
    case "CANCELLED":
      return { labelPersian: "لغو شده / مرجوع", stepNumber: 0, badgeClass: "bg-red-900/60 text-red-300" };
  }
}

/**
 * Checks if an unapproved repair cost estimate has exceeded the 5-business-day window (Spec Line 180).
 */
export function isCostEstimateExpired(
  estimatedAt: Date | string,
  now: Date = new Date(),
  businessDaysThreshold: number = 5
): boolean {
  const estimateDate = new Date(estimatedAt);
  const elapsedMs = now.getTime() - estimateDate.getTime();
  // 5 business days accounts for ~7 calendar days
  const thresholdMs = businessDaysThreshold * 24 * 60 * 60 * 1000 * (7 / 5);
  return elapsedMs >= thresholdMs;
}

/**
 * Sweeps and transitions stale unanswered repair estimates to CANCELLED per Spec line 180.
 */
export async function expireStaleRepairEstimates(prismaClient: any): Promise<number> {
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const stale = await prismaClient.repairRequest.findMany({
    where: {
      status: "COST_ESTIMATED",
      costApprovalStatus: "PENDING",
      updatedAt: { lt: cutoff },
    },
  });

  for (const ticket of stale) {
    await prismaClient.repairRequest.update({
      where: { id: ticket.id },
      data: {
        status: "CANCELLED",
        costApprovalStatus: "DECLINED",
        notes: (ticket.notes ? ticket.notes + "\n" : "") + "[سیستم] لغو خودکار به دلیل عدم تایید هزینه پس از ۵ روز کاری.",
      },
    });
  }

  return stale.length;
}
