import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert English digits to Persian digits
export function toPersianDigits(n: number | string | undefined | null): string {
  if (n === undefined || n === null) return "";
  const str = n.toString();
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/\d/g, (x) => persianDigits[parseInt(x, 10)]);
}

// Format numbers with thousands separators and Persian digits
export function formatNumber(num: number | string): string {
  if (!num && num !== 0) return "۰";
  const parts = Number(num).toLocaleString("en-US").split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return toPersianDigits(parts.join("."));
}

// Format price in Toman (تومان)
export function formatToman(price: number): string {
  return `${formatNumber(price)} تومان`;
}

// Calculate discount percentage
export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
  if (!originalPrice || originalPrice <= discountedPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

// Format Shamsi date
export function formatJalaliDate(dateInput?: Date | string | number): string {
  const date = dateInput ? new Date(dateInput) : new Date();
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return toPersianDigits(date.toLocaleDateString("fa-IR"));
  }
}

export function formatJalaliDateTime(dateInput?: Date | string | number): string {
  const date = dateInput ? new Date(dateInput) : new Date();
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return toPersianDigits(date.toLocaleString("fa-IR"));
  }
}

// Isfahan Shipping Methods & Pricing
export const SHIPPING_METHODS = [
  {
    id: "isfahan_express",
    title: "پیک فوری و اختصاصی اصفهان (اسنپ‌باکس)",
    description: "تحویل در همان روز در کلیه مناطق شهر اصفهان، سپاهان‌شهر و بهارستان",
    cost: 45000,
    estimatedDays: "تحویل ۳ الی ۵ ساعته",
    badge: "ویژه اصفهان",
    isLocal: true,
  },
  {
    id: "isfahan_pickup",
    title: "تحویل حضوری در فروشگاه اصفهان",
    description: "خیابان فردوسی، نرسیده به چهارراه فلسطین - ساعات کاری ۹ الی ۲۱",
    cost: 0,
    estimatedDays: "آماده تحویل در ۲ ساعت",
    badge: "رایگان",
    isLocal: true,
  },
  {
    id: "tipax",
    title: "ارسال سریع با تیپاکس",
    description: "ارسال به سراسر کشور با بیمه مرسولات شکستنی و حساس برقی",
    cost: 75000,
    estimatedDays: "۱ الی ۲ روز کاری",
    badge: "سراسر کشور",
    isLocal: false,
  },
  {
    id: "post_pishtaz",
    title: "پست پیشتاز جمهوری اسلامی",
    description: "تحویل درب منزل با کد رهگیری ۲۴ رقمی پستی",
    cost: 55000,
    estimatedDays: "۲ الی ۴ روز کاری",
    badge: "اقتصادی",
    isLocal: false,
  },
];

// Iranian Payment Methods
export const PAYMENT_METHODS = [
  {
    id: "zarinpal",
    title: "پرداخت اینترنتی با درگاه امن بانکی (زرین‌پال / شاپرک)",
    description: "با کلیه کارت‌های عضو شبکه شتاب + ۵٪ تخفیف خرید آنلاین",
    icon: "CreditCard",
    badge: "تایید آنی",
  },
  {
    id: "cod_isfahan",
    title: "پرداخت در محل با کارتخوان سیار (ویژه شهر اصفهان)",
    description: "پرداخت وجه پس از تحویل و بررسی سلامت فیزیکی کالا توسط پیک",
    icon: "Truck",
    badge: "مخصوص اصفهان",
  },
  {
    id: "card_to_card",
    title: "کارت‌به‌کارت و بارگذاری فیش واریزی",
    description: "انتقال وجه به شماره حساب بانک ملی/سامان فروشگاه نقش جهان",
    icon: "Receipt",
    badge: "حساب شرکتی",
  },
];
