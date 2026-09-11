import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert Persian and Arabic digits to ASCII English digits
export function toAsciiDigits(str: string | undefined | null): string {
  if (!str) return "";
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  let res = str.toString();
  for (let i = 0; i < 10; i++) {
    res = res.replaceAll(persianDigits[i], i.toString()).replaceAll(arabicDigits[i], i.toString());
  }
  return res;
}

export const toEnglishDigits = toAsciiDigits;

// Clean phone number for tel: or wa.me: links (pure ASCII digits)
export function cleanPhoneNumber(phone: string | undefined | null): string {
  if (!phone) return "";
  return toAsciiDigits(phone).replace(/\D/g, "");
}

// Robust Iranian phone number normalizer (handles +98, 0098, Persian digits, spaces, hyphens)
export function normalizeIranianPhone(input: string | undefined | null): string {
  if (!input) return "";
  let digits = toAsciiDigits(input).replace(/\D/g, "");
  if (digits.startsWith("0098")) {
    digits = "0" + digits.slice(4);
  } else if (digits.startsWith("98") && (digits.length === 12 || digits.length === 11)) {
    digits = "0" + digits.slice(2);
  } else if (digits.startsWith("9") && digits.length === 10) {
    digits = "0" + digits;
  }
  return digits;
}

// Verify if phone is a valid Iranian 11-digit mobile (09xxxxxxxxx)
export function isValidIranianMobile(phone: string | undefined | null): boolean {
  const normalized = normalizeIranianPhone(phone);
  return /^09\d{9}$/.test(normalized);
}

// Convert English digits to Persian digits
export function toPersianDigits(n: number | string | undefined | null): string {
  if (n === undefined || n === null) return "";
  const str = n.toString();
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/\d/g, (x) => persianDigits[parseInt(x, 10)]);
}

// Format numbers with thousands separators and Persian digits safely without NaN or gibberish
export function formatNumber(num: number | string | undefined | null): string {
  if (num === undefined || num === null || num === "") return "۰";
  const n = typeof num === "number" ? num : Number(toAsciiDigits(String(num)).replace(/[^\d.-]/g, ""));
  if (isNaN(n)) return "۰";
  const parts = Math.round(n).toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return toPersianDigits(parts.join("."));
}

// Format price in Toman (تومان)
export function formatToman(price: number | string | undefined | null): string {
  return `${formatNumber(price)} تومان`;
}

// Calculate discount percentage
export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
  if (!originalPrice || originalPrice <= discountedPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

// Unified tiered quantity discount pricing calculation
export function calculateTieredUnitPrice(basePrice: number, quantity: number): number {
  if (quantity >= 50) {
    return Math.round(basePrice * 0.9); // 10% wholesale discount
  } else if (quantity >= 10) {
    return Math.round(basePrice * 0.95); // 5% pack discount
  }
  return basePrice;
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

// Isfahan Districts & Neighborhoods
export const ISFAHAN_DISTRICTS = [
  "منطقه ۱ (خیابان کاوه، طالقانی، چهارباغ عباسی)",
  "منطقه ۲ (خیابان امام خمینی، کهندژ)",
  "منطقه ۳ (خیابان فردوسی، چهارباغ خواجو، نشاط)",
  "منطقه ۴ (خیابان بزرگمهر، مشتاق، ۲۲ بهمن)",
  "منطقه ۵ (سی‌وسه‌پل، توحید، حکیم نظامی)",
  "منطقه ۶ (مرداویج، مصلی، شیخ صدوق، سعادت‌آباد)",
  "منطقه ۷ (خیابان لاله، چمران، آل‌محمد)",
  "منطقه ۸ (خانه اصفهان، رزمندگان، جابر انصاری)",
  "منطقه ۹ (خیابان آتشگاه، کهندژ، ناژوان)",
  "منطقه ۱۰ (خیابان پروین، عسگریه، دشتستان)",
  "منطقه ۱۱ (رهنان، درخشان)",
  "منطقه ۱۲ (ملک‌شهر، بهارستان، نگین)",
  "منطقه ۱۳ (خیابان سیمین، کشاورزی، باغ ابریشم)",
  "منطقه ۱۴ (زینبیه، عمان سامانی)",
  "منطقه ۱۵ (خوراسگان، جی)",
  "شهرک سپاهان‌شهر",
  "شهر بهارستان",
  "شهر شاهین‌شهر",
  "شهر نجف‌آباد",
];

// Isfahan & Najafabad Shipping Methods & Pricing
export const SHIPPING_METHODS = [
  {
    id: "isfahan_express",
    title: "پیک فوری و اختصاصی نجف‌آباد و اصفهان (اسنپ‌باکس)",
    description: "تحویل در همان روز در کلیه مناطق نجف‌آباد، ویلاشهر، گلدشت و اصفهان",
    cost: 45000,
    estimatedDays: "تحویل ۲ الی ۴ ساعته",
    badge: "ویژه نجف‌آباد و اصفهان",
    isLocal: true,
  },
  {
    id: "isfahan_pickup",
    title: "تحویل حضوری در فروشگاه شیاسی (نجف‌آباد)",
    description: "نجف‌آباد، ۱۵ خرداد مرکزی، نبش بن‌بست نرگس (فروشگاه شیاسی) - شنبه تا چهارشنبه ۸:۳۰ الی ۱۳:۰۰ و ۱۶:۳۰ الی ۲۱:۰۰ (پنجشنبه شیفت صبح)",
    cost: 0,
    estimatedDays: "آماده تحویل فوری",
    badge: "رایگان",
    isLocal: true,
  },
  {
    id: "post_pishtaz",
    title: "پست پیشتاز سراسری",
    description: "تحویل درب منزل با بسته‌بندی ایمن و کد رهگیری مرسوله پستی",
    cost: 55000,
    estimatedDays: "۲ الی ۴ روز کاری",
    badge: "سراسر ایران",
    isLocal: false,
  },
  {
    id: "tipax",
    title: "ارسال سریع با تیپاکس",
    description: "ارسال به سراسر کشور با بیمه مرسولات شکستنی و حساس برقی",
    cost: 75000,
    estimatedDays: "۱ الی ۲ روز کاری",
    badge: "سریع و بیمه‌شده",
    isLocal: false,
  },
];

// Iranian Payment Methods
export const PAYMENT_METHODS = [
  {
    id: "zarinpal",
    title: "پرداخت اینترنتی با درگاه امن بانکی (زرین‌پال / شاپرک)",
    description: "با کلیه کارت‌های عضو شبکه شتاب + تایید آنی سفارش",
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
    description: "انتقال وجه به شماره حساب بانک ملی فروشگاه تخصصی شیاسی",
    icon: "Receipt",
    badge: "حساب شرکتی",
  },
];

// Helper to get friendly Persian title for any shipping method
export function getShippingMethodTitle(methodId?: string | null, short = false): string {
  if (!methodId) return short ? "ارسال اختصاصی" : "ارسال اختصاصی فروشگاه";
  if (short) {
    if (methodId === "isfahan_express" || methodId === "najafabad_local") return "پیک اسنپ‌باکس";
    if (methodId === "isfahan_pickup" || methodId === "in_person_pickup") return "تحویل در فروشگاه";
    if (methodId === "post_pishtaz") return "پست پیشتاز";
    if (methodId === "tipax") return "تیپاکس";
  }
  const found = SHIPPING_METHODS.find((m) => m.id === methodId);
  if (found) return found.title;
  if (methodId === "in_person_pickup" || methodId === "isfahan_pickup") return "تحویل حضوری در فروشگاه شیاسی";
  if (methodId === "isfahan_express" || methodId === "najafabad_local") return "پیک فوری نجف‌آباد و اصفهان (اسنپ‌باکس)";
  if (methodId === "post_pishtaz") return "پست پیشتاز سراسری";
  if (methodId === "tipax") return "تیپاکس (ارسال سریع)";
  return methodId;
}

// Helper to get friendly Persian title for any payment method
export function getPaymentMethodTitle(methodId?: string | null): string {
  if (!methodId) return "پرداخت آنلاین";
  const found = PAYMENT_METHODS.find((m) => m.id === methodId);
  if (found) return found.title;
  if (methodId === "zarinpal") return "درگاه امن آنلاین بانکی (شاپرک)";
  if (methodId === "cod_isfahan") return "پرداخت در محل با کارتخوان سیار";
  if (methodId === "card_to_card") return "کارت به کارت و ثبت فیش";
  return methodId;
}

// Convert numbers to formal Persian words (e.g., 4995000 -> "چهار میلیون و نهصد و نود و پنج هزار تومان")
export function numberToPersianWords(inputNumber: number | string | undefined | null): string {
  if (inputNumber === undefined || inputNumber === null || inputNumber === "") return "صفر تومان";
  const num = parseInt(toAsciiDigits(inputNumber.toString()), 10);
  if (isNaN(num) || num === 0) return "صفر تومان";

  const ones = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
  const teens = ["ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده"];
  const tens = ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
  const hundreds = ["", "یکصد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"];
  const thousands = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];

  const convertGroup = (n: number): string => {
    const parts: string[] = [];
    const h = Math.floor(n / 100);
    const remainder = n % 100;
    const t = Math.floor(remainder / 10);
    const o = remainder % 10;

    if (h > 0) parts.push(hundreds[h]);

    if (remainder >= 10 && remainder < 20) {
      parts.push(teens[remainder - 10]);
    } else {
      if (t > 0) parts.push(tens[t]);
      if (o > 0) parts.push(ones[o]);
    }

    return parts.join(" و ");
  };

  let tempNum = Math.abs(num);
  const groups: string[] = [];
  let groupIdx = 0;

  while (tempNum > 0) {
    const chunk = tempNum % 1000;
    if (chunk > 0) {
      const text = convertGroup(chunk);
      if (thousands[groupIdx]) {
        groups.unshift(`${text} ${thousands[groupIdx]}`);
      } else {
        groups.unshift(text);
      }
    }
    tempNum = Math.floor(tempNum / 1000);
    groupIdx++;
  }

  const result = groups.join(" و ");
  return `${num < 0 ? "منفی " : ""}${result} تومان`;
}
