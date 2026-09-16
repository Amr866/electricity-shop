/**
 * Zero-Crash Static Fallback Dataset: Products
 * In compliance with Constitution Principle II (Zero-Crash Fallback Architecture & Resilient Uptime).
 * Serves catalog browsing views during transient database disruptions or cold-start latency.
 */

export interface FallbackProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock: number;
  brand: string;
  isIsfahanFast: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  category: { id: string; name: string; slug: string };
  images: Array<{ url: string; alt?: string | null; isPrimary: boolean }>;
  description?: string;
  shortDesc?: string;
}

export const FALLBACK_PRODUCTS: FallbackProduct[] = [
  {
    id: "fb-p1",
    name: "الکتروموتور کولری موتوژن ۱/۲ اسب تک‌فاز",
    slug: "motogen-cooler-motor-half-hp",
    sku: "MOT-COOL-05",
    price: 4850000,
    stock: 15,
    brand: "موتوژن",
    isIsfahanFast: true,
    isBestSeller: true,
    isFeatured: true,
    category: { id: "cat-cooling", name: "سرمایشی و گرمایشی", slug: "cooling-heating" },
    images: [{ url: "/images/products/cooler-motor.png", alt: "موتور کولر موتوژن", isPrimary: true }],
    shortDesc: "موتور دو دور خازن‌دار تمام مس موتوژن مناسب کولرهای ۴۰۰۰ تا ۵۰۰۰",
  },
  {
    id: "fb-p2",
    name: "سیم افشان ۱.۵ مس خالص البرز الکتریک نور (کلاف ۱۰۰ متری)",
    slug: "alborz-copper-wire-1-5",
    sku: "WIR-ALB-15",
    price: 1350000,
    stock: 45,
    brand: "البرز الکتریک نور",
    isIsfahanFast: true,
    isBestSeller: true,
    isFeatured: false,
    category: { id: "cat-wiring", name: "سیم، کابل و لوله", slug: "wiring-building" },
    images: [{ url: "/images/products/copper-wire-15.png", alt: "سیم ۱.۵ البرز", isPrimary: true }],
    shortDesc: "سیم انعطاف‌پذیر با عایق استاندارد PVC و مس استاندارد منطبق بر مبحث ۱۳ مقررات ملی ساختمان",
  },
  {
    id: "fb-p3",
    name: "کلید مینیاتوری تک‌پل ۲۵ آمپر هیوندای تیپ C",
    slug: "hyundai-mcb-single-pole-c25",
    sku: "MCB-HYU-C25",
    price: 340000,
    stock: 80,
    brand: "هیوندای",
    isIsfahanFast: true,
    isBestSeller: false,
    isFeatured: true,
    category: { id: "cat-wiring", name: "سیم، کابل و لوله", slug: "wiring-building" },
    images: [{ url: "/images/products/mcb-c25.png", alt: "فیوز مینیاتوری ۲۵ آمپر", isPrimary: true }],
    shortDesc: "کلید مینیاتوری ۶ کیلوآمپر با منحنی قطع موتوری تیپ C استاندارد",
  },
  {
    id: "fb-p4",
    name: "پمپ آب کولری الکتروژن مدل البرز",
    slug: "electrogen-cooler-water-pump",
    sku: "PMP-ELC-ALB",
    price: 680000,
    stock: 25,
    brand: "الکتروژن",
    isIsfahanFast: true,
    isBestSeller: true,
    isFeatured: false,
    category: { id: "cat-cooling", name: "سرمایشی و گرمایشی", slug: "cooling-heating" },
    images: [{ url: "/images/products/water-pump.png", alt: "پمپ آب کولر الکتروژن", isPrimary: true }],
    shortDesc: "پمپ ضد آب با پروانه نارسانا و مقاومت بالا در برابر رسوب‌گیری آب نجف‌آباد",
  },
];
