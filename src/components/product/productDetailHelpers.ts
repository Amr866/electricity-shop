import type { ProductReviewItem } from "./ProductReviewsTab";

export type { ProductReviewItem };

export interface ProductSpecItem {
  id?: string;
  label?: string;
  key?: string;
  value: string;
  group?: string | null;
}

export interface ProductImageItem {
  id?: string;
  url: string;
  isPrimary?: boolean;
  alt?: string | null;
}

export interface ProductDetailData {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  price: number;
  originalPrice?: number | null;
  discountPercent?: number;
  stock: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isIsfahanFast?: boolean;
  brand?: string | null;
  madeIn?: string | null;
  warranty?: string | null;
  rating?: number;
  reviewCount?: number;
  shortDesc?: string | null;
  description?: string | null;
  category?: { name: string; slug: string };
  images?: ProductImageItem[];
  specs?: ProductSpecItem[];
  reviews?: ProductReviewItem[];
  priceUnit?: string | null;
}

export interface TerminalPin {
  color: string;
  colorName: string;
  label: string;
  functionDesc: string;
}

// 1. Universal Category-Aware Specifications Generator
export function getProductTechnicalSpecs(product: ProductDetailData): ProductSpecItem[] {
  if (product.specs && product.specs.length > 0) {
    return product.specs;
  }

  const categorySlug = product.category?.slug || "";
  const brandName = product.brand || "فروشگاه شیاسی";
  const madeIn = product.madeIn || "ایران";
  const warranty = product.warranty || "ضمانت سلامت فیزیکی و اصالت کالا";

  if (categorySlug.includes("cooling") || categorySlug.includes("fan") || categorySlug.includes("appliance")) {
    return [
      { label: "نوع محصول", value: product.name },
      { label: "برند و سازنده", value: brandName },
      { label: "کشور سازنده", value: madeIn },
      { label: "ولتاژ کاری استاندارد", value: "۲۲۰ ولت متناوب شهری (AC - 50Hz)" },
      { label: "نوع سیم‌پیچی موتور", value: "۱۰۰٪ مس خالص با بازدهی بالا" },
      { label: "سطح استاندارد ایمنی", value: "دارای نشان استاندارد ملی ایران و CE اروپا" },
      { label: "مدت زمان گارانتی", value: warranty },
      { label: "وضعیت اصالت قطعه", value: "اورجینال شرکتی با تاییدیه کارگاه فنی شیاسی" },
    ];
  }

  if (categorySlug.includes("wiring") || categorySlug.includes("cable")) {
    return [
      { label: "نوع کابل / سیم", value: product.name },
      { label: "برند کارخانه", value: brandName },
      { label: "جنس هادی", value: "مس آنیل شده کلاس ۵ (تمام مس خالص)" },
      { label: "جنس عایق و روکش", value: "PVC مقاوم در برابر حرارت و سایش" },
      { label: "ولتاژ نامی", value: "۴۵۰/۷۵۰ ولت" },
      { label: "استاندارد مرجع", value: "ISIRI 607-02 و IEC 60227" },
      { label: "تاییدیه اصالت", value: "ضمانت خلوص مس و تایید ناظر تاسیسات" },
    ];
  }

  if (categorySlug.includes("lighting")) {
    return [
      { label: "نوع منبع نور", value: "LED با راندمان نوری فوق‌کم‌مصرف A+" },
      { label: "برند و شرکت سازنده", value: brandName },
      { label: "ولتاژ ورودی", value: "۱۸۰ الی ۲۴۰ ولت" },
      { label: "طول عمر مفید", value: "بیش از ۲۵,۰۰۰ ساعت کارکرد مداوم" },
      { label: "شاخص نمود رنگ (CRI)", value: "بالای ۸۰ (طبیعی‌ترین طیف نوری)" },
      { label: "شرایط گارانتی", value: warranty },
    ];
  }

  return [
    { label: "نام و مدل کالا", value: product.name },
    { label: "کد شناسایی فنی (SKU)", value: product.sku || product.id },
    { label: "برند تولیدکننده", value: brandName },
    { label: "کشور سازنده", value: madeIn },
    { label: "گارانتی و خدمات پس از فروش", value: warranty },
    { label: "اصالت کالا", value: "ضمانت اصالت شرکتی توسط فروشگاه شیاسی نجف‌آباد" },
    { label: "تست سلامت کارکرد", value: "دارای مهلت تست و عیب‌یابی حضوری در کارگاه" },
  ];
}

// 2. Category Wiring & Schematics Generator
export function getCategoryWiringSchematic(product: ProductDetailData): {
  title: string;
  diagramSubtitle: string;
  terminals: TerminalPin[];
} {
  const categorySlug = product.category?.slug || "";

  if (categorySlug.includes("cooling") || categorySlug.includes("fan")) {
    return {
      title: "دیاگرام شماتیک اتصالات الکتروموتور و پنکه (سیم‌بندی ۴ و ۵ رشته)",
      diagramSubtitle: "نقشه سیم‌بندی استاندارد ترمینال‌های دور تند، کند، نول و خازن راه‌انداز",
      terminals: [
        {
          color: "bg-slate-900 dark:bg-slate-300 text-white dark:text-slate-950 border-slate-700",
          colorName: "مشکی (Black)",
          label: "ترمینال COM (نول مشترک)",
          functionDesc: "اتصال مستقیم به نول شبکه برق (N)",
        },
        {
          color: "bg-rose-600 text-white border-rose-700",
          colorName: "قرمز (Red)",
          label: "ترمینال HI (دور تند)",
          functionDesc: "اتصال به کلید وضعیت دور تند (High Speed)",
        },
        {
          color: "bg-amber-600 text-white border-amber-700",
          colorName: "قهوه‌ای (Brown)",
          label: "ترمینال MED (دور متوسط)",
          functionDesc: "اتصال به کلید وضعیت دور متوسط (در مدل‌های ۳ سرعته)",
        },
        {
          color: "bg-blue-600 text-white border-blue-700",
          colorName: "آبی / زرد (Blue)",
          label: "ترمینال LOW / CAP (دور کند و خازن)",
          functionDesc: "اتصال به دور کند و سر خازن روغنی راه‌انداز",
        },
      ],
    };
  }

  if (categorySlug.includes("wiring") || categorySlug.includes("cable")) {
    return {
      title: "راهنمای رنگ‌بندی استاندارد سیم‌ها و کابل‌های ساختمانی (IEC 60227)",
      diagramSubtitle: "کد رنگ‌بندی فاز، نول و ارت مطابق با مقررات ملی ساختمان مبحث ۱۳",
      terminals: [
        {
          color: "bg-amber-700 text-white border-amber-800",
          colorName: "قهوه‌ای / قرمز",
          label: "سیم فاز (Phase - L)",
          functionDesc: "حامل جریان برق متناوب اصلی ۲۲۰ ولت",
        },
        {
          color: "bg-blue-600 text-white border-blue-700",
          colorName: "آبی روشن",
          label: "سیم نول (Neutral - N)",
          functionDesc: "مسیر برگشت جریان با پتانسیل صفر",
        },
        {
          color: "bg-emerald-600 text-white border-emerald-700",
          colorName: "زرد با خط سبز",
          label: "سیم ارت حفاظتی (Earth - PE)",
          functionDesc: "اتصال ایمنی به چاه ارت و حفاظت در برابر برق‌گرفتگی",
        },
      ],
    };
  }

  return {
    title: "راهنمای نصب، سربندی و اتصالات ایمن قطعه الکتریکی",
    diagramSubtitle: "دیاگرام اتصالات استاندارد ترمینال با رعایت موازین ایمنی",
    terminals: [
      {
        color: "bg-rose-600 text-white border-rose-700",
        colorName: "قرمز / قهوه‌ای",
        label: "ورودی فاز (L)",
        functionDesc: "اتصال به فاز شبکه از طریق فیوز محافظتی",
      },
      {
        color: "bg-blue-600 text-white border-blue-700",
        colorName: "آبی",
        label: "ورودی نول (N)",
        functionDesc: "اتصال به نول پایدار تابلوی برق",
      },
    ],
  };
}
