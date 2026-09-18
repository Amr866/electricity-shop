/**
 * E-Commerce Checkout & Pricing Engine
 * Deep module encapsulating line-item pricing, tiered wholesale volume discounts,
 * shipping fee calculations, coupon deductions, deterministic lock ordering,
 * 8-hour Card-to-Card reservation expiry, and corporate invoicing invariants.
 */

// Statutory shipping fee matrix (in Iranian Toman)
export const SHIPPING_RATES: Record<string, number> = {
  isfahan_express: 45000,
  isfahan_pickup: 0,
  najafabad_pickup: 0,
  in_person_pickup: 0,
  post_pishtaz: 55000,
  tipax: 75000,
  najafabad_local: 35000,
};

export interface RawLineItem {
  productId: string;
  quantity: number;
  basePrice: number;
  productName?: string;
  productImage?: string;
}

export interface EvaluatedLineItem {
  productId: string;
  productName: string;
  productImage: string | null;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  discountPercent: 0 | 5 | 10;
  lineTotal: number;
  savings: number;
}

export interface CouponDiscountInput {
  code: string;
  discountPercent?: number | null;
  discountAmount?: number | null;
  maxDiscount?: number | null;
  minOrderAmount?: number | null;
  expiresAt?: Date | string | null;
  isActive?: boolean | null;
}

export interface OrderFinancialSummary {
  items: EvaluatedLineItem[];
  subtotal: number;                 // Gross subtotal (basePrice * quantity)
  wholesaleSavings: number;         // Total volume discount savings
  netItemsTotal: number;            // Subtotal after volume discounts
  couponDiscount: number;           // Deduction from coupon
  shippingCost: number;             // Calculated shipping fee
  finalTotalAmount: number;         // Payable amount in Toman
}

export interface CorporateInvoiceValidation {
  isCorporate: boolean;
  companyName?: string | null;
  nationalCode?: string | null;
  economicCode?: string | null;
}

/**
 * Calculates tiered wholesale volume discount in compliance with Constitution Principle III:
 * - >= 50 units: 10% volume discount
 * - >= 10 units: 5% pack discount
 * - < 10 units: 0% discount
 */
export function calculateTieredUnitPrice(basePrice: number, quantity: number): {
  unitPrice: number;
  discountPercent: 0 | 5 | 10;
} {
  const safeQty = Math.max(1, Math.floor(quantity));
  if (safeQty >= 50) {
    return {
      unitPrice: Math.round(basePrice * 0.9),
      discountPercent: 10,
    };
  } else if (safeQty >= 10) {
    return {
      unitPrice: Math.round(basePrice * 0.95),
      discountPercent: 5,
    };
  }
  return {
    unitPrice: basePrice,
    discountPercent: 0,
  };
}

/**
 * Evaluates individual line item, applying tiered pricing and computing line subtotals.
 */
export function evaluateLineItem(item: RawLineItem): EvaluatedLineItem {
  const safeQuantity = Math.max(1, Math.floor(item.quantity));
  const { unitPrice, discountPercent } = calculateTieredUnitPrice(item.basePrice, safeQuantity);
  const lineTotal = unitPrice * safeQuantity;
  const grossTotal = item.basePrice * safeQuantity;
  const savings = Math.max(0, grossTotal - lineTotal);

  return {
    productId: item.productId,
    productName: item.productName || "محصول فروشگاه",
    productImage: item.productImage || null,
    basePrice: item.basePrice,
    unitPrice,
    quantity: safeQuantity,
    discountPercent,
    lineTotal,
    savings,
  };
}

/**
 * Server-authoritative calculation of entire order financial breakdown.
 */
export function calculateOrderFinancials(
  items: RawLineItem[],
  shippingMethodKey: string,
  coupon?: CouponDiscountInput | null,
  options?: { enableFreeShippingThreshold?: boolean }
): OrderFinancialSummary {
  const evaluatedItems = items.map(evaluateLineItem);

  let grossSubtotal = 0;
  let wholesaleSavings = 0;
  let netItemsTotal = 0;

  for (const item of evaluatedItems) {
    grossSubtotal += item.basePrice * item.quantity;
    wholesaleSavings += item.savings;
    netItemsTotal += item.lineTotal;
  }

  // Shipping fee
  let shippingCost = SHIPPING_RATES[shippingMethodKey] ?? 45000;
  if (
    options?.enableFreeShippingThreshold &&
    netItemsTotal >= 2000000 &&
    shippingMethodKey !== "in_person_pickup" &&
    shippingMethodKey !== "najafabad_pickup"
  ) {
    shippingCost = 0; // Free shipping over 2M Tomans
  }

  // Coupon evaluation
  let couponDiscount = 0;
  if (coupon && coupon.isActive !== false) {
    const notExpired = !coupon.expiresAt || new Date(coupon.expiresAt) >= new Date();
    const minAmount = coupon.minOrderAmount || 0;
    const meetsMin = netItemsTotal >= minAmount;

    if (notExpired && meetsMin) {
      if (coupon.discountPercent) {
        const calcDiscount = Math.round((netItemsTotal * coupon.discountPercent) / 100);
        const maxCap = coupon.maxDiscount || Infinity;
        couponDiscount = Math.min(calcDiscount, maxCap);
      } else if (coupon.discountAmount) {
        couponDiscount = Math.min(coupon.discountAmount, netItemsTotal);
      }
    }
  }

  const finalTotalAmount = Math.max(0, netItemsTotal - couponDiscount + shippingCost);

  return {
    items: evaluatedItems,
    subtotal: grossSubtotal,
    wholesaleSavings,
    netItemsTotal,
    couponDiscount,
    shippingCost,
    finalTotalAmount,
  };
}

/**
 * Generates an Iranian commercial order number adhering to format SH-YYMMDD-XXX.
 */
export function generateOrderNumber(date = new Date()): string {
  const dateStr = date.toISOString().slice(2, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `SH-${dateStr}-${randomSuffix}`;
}

/**
 * Deterministically sorts items by productId ascending to eliminate
 * PostgreSQL 40P01 cyclic wait deadlocks during concurrent multi-item transactions.
 */
export function sortItemsForDeterministicLock<T extends { productId: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.productId.localeCompare(b.productId));
}

/**
 * Computes 8-hour inventory reservation expiry for Card-to-Card payments.
 */
export function calculateReservationExpiry(paymentMethod: string, fromDate = new Date()): Date | null {
  if (paymentMethod === "card_to_card") {
    return new Date(fromDate.getTime() + 8 * 60 * 60 * 1000);
  }
  return null;
}

/**
 * Validates mandatory legal corporate tax invoicing fields.
 */
export function validateCorporateInvoice(input: CorporateInvoiceValidation): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (input.isCorporate) {
    if (!input.companyName || input.companyName.trim().length < 2) {
      errors.companyName = "نام رسمی شرکت یا سازمان الزامی است.";
    }
    if (!input.nationalCode || input.nationalCode.trim().length < 10) {
      errors.nationalCode = "شناسه ملی شرکت باید حداقل ۱۰ رقم باشد.";
    }
    if (!input.economicCode || input.economicCode.trim().length < 10) {
      errors.economicCode = "کد اقتصادی شرکت معتبر نیست.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
