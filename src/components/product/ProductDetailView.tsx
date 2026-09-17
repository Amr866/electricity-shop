"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatToman, toPersianDigits, calculateTieredUnitPrice } from "@/lib/utils";

const ProductWiringTab = dynamic(
  () => import("./ProductWiringTab").then((mod) => mod.ProductWiringTab),
  {
    loading: () => (
      <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse flex items-center justify-center text-xs text-slate-400">
        در حال بارگذاری نقشه سیم‌بندی...
      </div>
    ),
  }
);

const ProductReviewsTab = dynamic(
  () => import("./ProductReviewsTab").then((mod) => mod.ProductReviewsTab),
  {
    loading: () => (
      <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse flex items-center justify-center text-xs text-slate-400">
        در حال بارگذاری نظرات خریداران...
      </div>
    ),
  }
);
import {
  ShoppingCart,
  Check,
  Star,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  MessageCircle,
  Share2,
  Heart,
  FileText,
  Layers,
  Phone,
  Clock,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  User,
  Send,
  Download,
  BookOpen,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Award,
  ExternalLink,
  Navigation,
  HelpCircle,
  Wrench,
  Activity,
  Package,
  Copy,
  Printer,
  QrCode,
} from "lucide-react";

export interface ProductSpecItem {
  id?: string;
  label?: string;
  key?: string;
  value: string;
  group?: string | null;
}

import type { ProductReviewItem } from "./ProductReviewsTab";
export type { ProductReviewItem };

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
}

interface ProductDetailProps {
  product: ProductDetailData;
}

interface TerminalPin {
  color: string;
  colorName: string;
  label: string;
  functionDesc: string;
}

// 1. Universal Category-Aware Specifications Generator (Applies to 100% current & future products)
function getProductTechnicalSpecs(product: ProductDetailData): ProductSpecItem[] {
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
function getCategoryWiringSchematic(product: ProductDetailData): {
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

export function ProductDetailView({ product }: ProductDetailProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "/images/products/wal_172619-fans-7995865_1920.jpg";

  const [selectedImage, setSelectedImage] = useState(primaryImage);
  const [activeTab, setActiveTab] = useState<"specs" | "wiring" | "desc" | "reviews" | "isfahan">("specs");
  const [addedToCart, setAddedToCart] = useState(false);
  const [copiedSku, setCopiedSku] = useState(false);
  const isFavorited = isInWishlist(product.id);

  const buyCardRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const target = buyCardRef.current;
    if (!target) return;

    const checkVisibility = () => {
      const rect = target.getBoundingClientRect();
      // Show sticky bar ONLY when main buy card has scrolled off the top of the screen
      setShowStickyBar(rect.bottom < 0);
    };

    window.addEventListener("scroll", checkVisibility, { passive: true });

    const observer = new IntersectionObserver(
      () => {
        checkVisibility();
      },
      { threshold: [0, 0.5, 1] }
    );
    observer.observe(target);

    checkVisibility();

    return () => {
      window.removeEventListener("scroll", checkVisibility);
      observer.disconnect();
    };
  }, []);

  const isWiring =
    product.category?.slug === "wiring" ||
    product.category?.slug === "cable" ||
    product.category?.slug === "wiring-building" ||
    (product.name.includes("کابل") && !product.name.includes("کولر"));

  const unitLabel = isWiring ? "متر" : "عدد";
  const tierTitle = isWiring
    ? "تخفیف پله‌ای خرید عمده و متراژ بالا:"
    : "تخفیف پله‌ای خرید عمده و تعداد بالا:";

  // Calculate tiered bulk discount unit prices
  const tier1Price = calculateTieredUnitPrice(product.price, 1);
  const tier2Price = calculateTieredUnitPrice(product.price, 10);
  const tier3Price = calculateTieredUnitPrice(product.price, 50);

  const effectiveUnitPrice = calculateTieredUnitPrice(product.price, quantity);
  const totalSavings = (product.price - effectiveUnitPrice) * quantity;

  // Rating Analytics
  const totalReviews = product.reviews?.length || product.reviewCount || 0;
  const averageRating = (product.rating || 4.9).toFixed(1);

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart({ ...product, price: effectiveUnitPrice }, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleCopySku = () => {
    const textToCopy = `${product.name}\nکد فنی: ${product.sku || product.id}\nقیمت: ${effectiveUnitPrice.toLocaleString("fa-IR")} تومان\nفروشگاه شیاسی نجف‌آباد`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSku(true);
    setTimeout(() => setCopiedSku(false), 2500);
  };

  const isOutOfStock = product.stock <= 0;
  const technicalSpecs = getProductTechnicalSpecs(product);
  const wiringSchematic = getCategoryWiringSchematic(product);

  // Official Contractor WhatsApp Inquiry URL with Official Line 09136260072
  const contractorWhatsAppMessage = encodeURIComponent(
    `سلام وقت بخیر، جهت استعلام قیمت همکاری و خرید عمده کالا «${product.name}» (کد فنی: ${product.sku || product.id} - قیمت واحد: ${effectiveUnitPrice.toLocaleString("fa-IR")} تومان) از فروشگاه شیاسی پیام می‌دهم.`
  );
  const contractorWhatsAppUrl = `https://wa.me/989136260072?text=${contractorWhatsAppMessage}`;

  return (
    <div className="space-y-8 pb-32 sm:pb-12">
      
      {/* ========================================================================= */}
      {/* 0. DEDICATED OFFICIAL PRINT-ONLY ENGINEERING DATASHEET (Visible only on print) */}
      {/* ========================================================================= */}
      <div className="hidden print:block bg-white text-black p-8 font-sans space-y-6" dir="rtl">
        {/* Printable Header */}
        <div className="border-b-2 border-black pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black">فروشگاه و مرکز خدمات فنی مهندسی شیاسی نجف‌آباد</h1>
            <p className="text-xs text-gray-700 mt-1">
              شناسنامه فنی و برگه مشخصات مهندسی کالا (Datasheet) • تاسیس ۱۳۷۸
            </p>
          </div>
          <div className="text-left text-xs font-mono">
            <div>تاریخ صدور: {new Date().toLocaleDateString("fa-IR")}</div>
            <div>تلفن کارگاه: <bdi dir="ltr">۰۳۱-۴۲۶۲۶۱۱۶</bdi></div>
            <div>همراه فنی: <bdi dir="ltr">۰۹۱۳-۶۲۶-۰۰۷۲</bdi></div>
          </div>
        </div>

        {/* Product Identity */}
        <div className="grid grid-cols-3 gap-6 items-center border border-gray-300 rounded-xl p-4">
          <div className="col-span-2 space-y-2">
            <h2 className="text-base font-black">{product.name}</h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><strong>کد شناسایی (SKU):</strong> {product.sku || product.id}</div>
              <div><strong>برند سازنده:</strong> {product.brand || "فروشگاه شیاسی"}</div>
              <div><strong>دسته‌بندی:</strong> {product.category?.name}</div>
              <div><strong>کشور سازنده:</strong> {product.madeIn || "ایران"}</div>
              <div><strong>وضعیت گارانتی:</strong> {product.warranty || "اصالت و سلامت فیزیکی"}</div>
              <div><strong>قیمت رسمی:</strong> {effectiveUnitPrice.toLocaleString("fa-IR")} تومان</div>
            </div>
          </div>
          <div className="col-span-1 text-center">
            <div className="w-28 h-28 mx-auto relative border border-gray-200 rounded-lg p-2">
              <img src={selectedImage} alt={product.name} className="w-full h-full object-contain" />
            </div>
          </div>
        </div>

        {/* Technical Specs Table */}
        <div className="space-y-2">
          <h3 className="text-sm font-black border-b border-gray-400 pb-1">جدول مشخصات و استانداردهای فنی</h3>
          <table className="w-full text-xs border-collapse border border-gray-300">
            <tbody>
              {technicalSpecs.map((s, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="border border-gray-300 p-2 font-bold w-1/3">{s.label || s.key}</td>
                  <td className="border border-gray-300 p-2">{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Wiring Diagram Pins */}
        <div className="space-y-2">
          <h3 className="text-sm font-black border-b border-gray-400 pb-1">{wiringSchematic.title}</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {wiringSchematic.terminals.map((t, idx) => (
              <div key={idx} className="border border-gray-300 p-2 rounded">
                <strong>{t.colorName} ({t.label}):</strong> {t.functionDesc}
              </div>
            ))}
          </div>
        </div>

        {/* Workshop Seal & Address */}
        <div className="border-t border-gray-300 pt-4 flex items-center justify-between text-xs text-gray-600">
          <div>آدرس: اصفهان، نجف‌آباد، ۱۵ خرداد مرکزی، نبش بن‌بست نرگس (فروشگاه شیاسی)</div>
          <div className="font-bold">مهر و تاییدیه اصالت کارگاه فنی شیاسی</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. SCREEN VIEW: Main Product Overview Section (Interactive UI) */}
      {/* ========================================================================= */}
      <div className="print:hidden bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start transition-colors duration-200">
        
        {/* Left Col: Images & Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="group relative aspect-square w-full max-h-[380px] mx-auto rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 p-6 flex items-center justify-center overflow-hidden shadow-inner">
            {product.discountPercent && product.discountPercent > 0 ? (
              <span className="absolute top-4 right-4 bg-rose-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-md shadow-rose-500/20 z-10">
                {toPersianDigits(product.discountPercent)}٪ تخفیف
              </span>
            ) : null}

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              aria-label={isFavorited ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
              className={`absolute top-4 left-4 w-9 h-9 rounded-2xl flex items-center justify-center z-10 transition-all shadow-sm active:scale-90 ${
                isFavorited
                  ? "bg-rose-50 dark:bg-rose-950 text-rose-500 border border-rose-200 dark:border-rose-800 shadow-rose-500/10"
                  : "bg-white/90 dark:bg-slate-800 text-slate-400 dark:text-slate-300 hover:text-rose-500 border border-slate-200 dark:border-slate-700"
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>

            {/* Next.js Optimized Image with 60fps Smooth Zoom */}
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-contain object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                priority
              />
            </div>
          </div>

          {/* Thumbnails list */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative w-12 h-12 rounded-xl p-1 border bg-slate-50 dark:bg-slate-800 overflow-hidden transition-all shrink-0 active:scale-95 ${
                    selectedImage === img.url
                      ? "border-amber-500 ring-2 ring-amber-500/30 scale-105"
                      : "border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img.url} alt="" fill className="object-contain p-1" sizes="48px" />
                </button>
              ))}
            </div>
          )}

          {/* Guarantees Box */}
          <div className="grid grid-cols-2 gap-2.5 pt-1 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-750 shadow-2xs hover:border-emerald-500/40 transition-colors">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>ضمانت ۱۰۰٪ مس و اصالت</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-750 shadow-2xs hover:border-purple-500/40 transition-colors">
              <RotateCcw className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>مهلت تست در کارگاه</span>
            </div>
          </div>
        </div>

        {/* Right Col: Product Info & Actions */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 font-medium">
                <span>دسته‌بندی:</span>
                <Link
                  href={`/products?category=${product.category?.slug}`}
                  className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  {product.category?.name}
                </Link>
              </div>

              {/* 1-Click Copy SKU Button */}
              <button
                type="button"
                onClick={handleCopySku}
                title="کپی کد فنی و مشخصات کالا جهت ارسال به همکاران"
                className="flex items-center gap-1 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-750 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 font-bold transition-all active:scale-95 text-slate-700 dark:text-slate-300"
              >
                {copiedSku ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400">کپی شد!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>کد: {product.sku || product.id}</span>
                  </>
                )}
              </button>
            </div>

            <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-snug tracking-tight">
              {product.name}
            </h1>

            {/* Ratings & Fast Specs Badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  {toPersianDigits(averageRating)}
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                  ({toPersianDigits(totalReviews)} نظر)
                </span>
              </div>

              {product.brand && (
                <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border border-amber-500/20">
                  برند: {product.brand}
                </span>
              )}

              {product.madeIn && (
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-0.5 rounded-lg text-[11px] font-medium border border-slate-200/60 dark:border-slate-700">
                  ساخت: {product.madeIn}
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.shortDesc && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify font-medium">
                {product.shortDesc}
              </p>
            )}

            {/* Bulk Tier Pricing Table */}
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 dark:border-amber-500/30 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-amber-900 dark:text-amber-300">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{tierTitle}</span>
                </span>
                {totalSavings > 0 && (
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-700 animate-pulse">
                    سود همکاری شما: {formatToman(totalSavings)}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div
                  className={`p-2 rounded-xl border transition-all duration-300 ${
                    quantity < 10
                      ? "bg-white dark:bg-slate-800 border-amber-500 shadow-md shadow-amber-500/10 font-bold text-slate-900 dark:text-white scale-102"
                      : "bg-white/50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <span className="text-[10px] block font-medium mb-0.5">۱ تا ۹ {unitLabel}</span>
                  <strong className="text-slate-900 dark:text-slate-100 text-xs font-mono">{formatToman(tier1Price)}</strong>
                </div>

                <div
                  className={`p-2 rounded-xl border transition-all duration-300 ${
                    quantity >= 10 && quantity < 50
                      ? "bg-white dark:bg-slate-800 border-emerald-500 shadow-md shadow-emerald-500/10 font-bold text-slate-900 dark:text-white scale-102"
                      : "bg-white/50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-bold mb-0.5">۱۰ تا ۴۹ {unitLabel} (۵٪)</span>
                  <strong className="text-slate-900 dark:text-slate-100 text-xs font-mono">{formatToman(tier2Price)}</strong>
                </div>

                <div
                  className={`p-2 rounded-xl border transition-all duration-300 ${
                    quantity >= 50
                      ? "bg-white dark:bg-slate-800 border-rose-500 shadow-md shadow-rose-500/10 font-bold text-slate-900 dark:text-white scale-102"
                      : "bg-white/50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <span className="text-[10px] text-rose-700 dark:text-rose-400 block font-bold mb-0.5">۵۰+ {unitLabel} (۱۰٪)</span>
                  <strong className="text-slate-900 dark:text-slate-100 text-xs font-mono">{formatToman(tier3Price)}</strong>
                </div>
              </div>
            </div>

            {/* Fast Delivery Notice */}
            <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800 rounded-xl p-2.5 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-300 font-medium">
              <div className="flex items-center gap-1.5 font-bold text-[11px]">
                <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>ارسال فوری با اسنپ در نجف‌آباد و اصفهان</span>
              </div>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">تحویل حضوری یا اسنپ‌باکس</span>
            </div>
          </div>

          {/* Pricing & Checkout Box */}
          <div ref={buyCardRef} className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-750 space-y-3.5 shadow-sm">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">مبلغ کل قابل پرداخت:</span>
              <div className="flex flex-col items-end">
                {effectiveUnitPrice < product.price && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    تخفیف همکاری پله‌ای اعمال شد!
                  </span>
                )}
                <span className="text-xl sm:text-2xl font-black text-slate-950 dark:text-amber-400 font-mono">
                  {formatToman(effectiveUnitPrice * quantity)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Quantity Counter */}
              <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-0.5 shrink-0 h-11 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(quantity + 1, product.stock))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  aria-label="افزایش تعداد"
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white disabled:opacity-30 active:scale-90"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 font-black text-slate-900 dark:text-white text-xs font-mono">
                  {toPersianDigits(quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  aria-label="کاهش تعداد"
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white disabled:opacity-30 active:scale-90"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add To Cart CTA Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 h-11 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md active:scale-98 ${
                  isOutOfStock
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none"
                    : addedToCart
                    ? "bg-emerald-600 text-white shadow-emerald-600/30"
                    : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25 hover-glow"
                }`}
              >
                {isOutOfStock ? (
                  <span>اتمام موجودی در انبار</span>
                ) : addedToCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>به سبد خرید اضافه شد</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>افزودن به سبد خرید</span>
                  </>
                )}
              </button>

              {/* Official Contractor WhatsApp Button */}
              <a
                href={contractorWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="استعلام قیمت همکاری و خرید عمده در واتساپ"
                className="h-11 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all shrink-0 shadow-md shadow-emerald-600/20 active:scale-95 hover-glow"
                title="استعلام قیمت همکاری و خرید عمده در واتساپ"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">استعلام همکاری</span>
              </a>
            </div>

            {/* Quick Stock & Direct Call Row */}
            <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${product.stock > 5 ? "bg-emerald-500" : product.stock > 0 ? "bg-amber-500 animate-ping" : "bg-rose-500"}`} />
                <span>
                  {product.stock > 5
                    ? `موجود در انبار نجف‌آباد (${toPersianDigits(product.stock)} عدد)`
                    : product.stock > 0
                    ? `تنها ${toPersianDigits(product.stock)} عدد باقی مانده`
                    : "ناموجود"}
                </span>
              </span>

              <a
                href="tel:03142626116"
                aria-label="تماس تلفنی با فروشگاه شیاسی: ۰۳۱-۴۲۶۲۶۱۱۶"
                className="text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 font-bold font-mono flex items-center gap-1 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <bdi dir="ltr">۰۳۱-۴۲۶۲۶۱۱۶</bdi>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. Enhanced Tabs Section: Specs, Wiring, Description, Reviews, Delivery */}
      {/* ========================================================================= */}
      <div className="print:hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl overflow-hidden transition-colors duration-200">
        {/* Tabs Bar with WAI-ARIA Role */}
        <div role="tablist" aria-label="بخش‌های اطلاعات فنی کالا" className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-4 overflow-x-auto scrollbar-none">
          <button
            role="tab"
            aria-selected={activeTab === "specs"}
            aria-controls="panel-specs"
            id="tab-specs"
            onClick={() => setActiveTab("specs")}
            className={`py-3.5 px-4 sm:px-5 font-extrabold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "specs"
                ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900 shadow-2xs"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>مشخصات فنی قطعه</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "wiring"}
            aria-controls="panel-wiring"
            id="tab-wiring"
            onClick={() => setActiveTab("wiring")}
            className={`py-3.5 px-4 sm:px-5 font-extrabold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "wiring"
                ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900 shadow-2xs"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Cpu className="w-4 h-4 text-amber-500" />
            <span>نقشه سیم‌کشی و کاتالوگ</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "desc"}
            aria-controls="panel-desc"
            id="tab-desc"
            onClick={() => setActiveTab("desc")}
            className={`py-3.5 px-4 sm:px-5 font-extrabold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "desc"
                ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900 shadow-2xs"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>توضیحات و کاربرد تخصصی</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "reviews"}
            aria-controls="panel-reviews"
            id="tab-reviews"
            onClick={() => setActiveTab("reviews")}
            className={`py-3.5 px-4 sm:px-5 font-extrabold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "reviews"
                ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900 shadow-2xs"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Star className="w-4 h-4 text-amber-500" />
            <span>نظرات خریداران ({toPersianDigits(totalReviews)})</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "isfahan"}
            aria-controls="panel-isfahan"
            id="tab-isfahan"
            onClick={() => setActiveTab("isfahan")}
            className={`py-3.5 px-4 sm:px-5 font-extrabold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "isfahan"
                ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900 shadow-2xs"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>تحویل فوری در نجف‌آباد</span>
          </button>
        </div>

        {/* Tab Contents Container */}
        <div className="p-5 sm:p-8 bg-white dark:bg-slate-900 transition-colors">
          
          {/* Tab 1: Technical Specs Table */}
          {activeTab === "specs" && (
            <div id="panel-specs" role="tabpanel" aria-labelledby="tab-specs" className="space-y-4 animate-in fade-in zoom-in-98 duration-200">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                <span>مشخصات فنی و استانداردهای قطعه</span>
              </h3>

              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-2xs">
                {technicalSpecs.map((spec, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-3 sm:grid-cols-4 p-3.5 text-xs ${
                      i % 2 === 0 ? "bg-slate-50/70 dark:bg-slate-850" : "bg-white dark:bg-slate-900"
                    }`}
                  >
                    <span className="font-bold text-slate-600 dark:text-slate-400 col-span-1">
                      {spec.label || spec.key || "مشخصه"}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 col-span-2 sm:col-span-3">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Visual Wiring Diagram & Schematics (Lazy-loaded) */}
          {activeTab === "wiring" && (
            <ProductWiringTab wiringSchematic={wiringSchematic} />
          )}

          {/* Tab 3: Structured 3-Card Description */}
          {activeTab === "desc" && (
            <div id="panel-desc" role="tabpanel" aria-labelledby="tab-desc" className="space-y-5 max-w-4xl animate-in fade-in zoom-in-98 duration-200">
              {/* Card 1: Overview */}
              <div className="bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-750 space-y-2">
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>معرفی تخصصی و اصالت قطعه</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify font-medium">
                  {product.description ||
                    product.shortDesc ||
                    "این کالا از برندهای معتبر و با کیفیت صنعتی تامین شده و دارای تاییدیه فنی و سلامت کارکرد از کارگاه شیاسی نجف‌آباد می‌باشد. استفاده از قطعات استاندارد با سیم‌پیچ تمام مس و متریال مرغوب، افزایش طول عمر مفید دستگاه و صرفه‌جویی در مصرف برق را تضمین می‌نماید."}
                </p>
              </div>

              {/* Card 2 & 3: Features & Workshop Tips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-850 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-750 space-y-2.5">
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>ویژگی‌ها و مزایای برجسته کالا</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>تولید شده با متریال مس خالص و بازدهی حداکثری</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>دارای نشان استاندارد ملی و گواهی اصالت شرکتی</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>مهلت تست و کارکرد در کارگاه فنی شیاسی</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-50 dark:bg-slate-850 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-750 space-y-2.5">
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-purple-500" />
                    <span>توصیه‌های تکنسین‌های کارگاه شیاسی</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-justify font-medium">
                    جهت طول عمر بیشتر، از فیوز مینیاتوری متناسب استفاده کرده و در صورت هرگونه نوسان ولتاژ، از محافظ برق استاندارد بهره ببرید.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Reviews with Analytics Summary (Lazy-loaded) */}
          {activeTab === "reviews" && (
            <ProductReviewsTab
              productId={product.id}
              initialReviews={product.reviews || []}
              defaultRating={product.rating || 4.9}
            />
          )}

          {/* Tab 5: 3-Step Illustrated Delivery Timeline */}
          {activeTab === "isfahan" && (
            <div id="panel-isfahan" role="tabpanel" aria-labelledby="tab-isfahan" className="space-y-5 max-w-4xl animate-in fade-in zoom-in-98 duration-200">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold text-sm sm:text-base">
                <Truck className="w-5 h-5" />
                <span>روش‌ها و زمان‌بندی ارسال سفارشات در نجف‌آباد، اصفهان و کشور</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Step 1: Snapp Fast Delivery */}
                <div className="group bg-slate-50 dark:bg-slate-850 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-750 space-y-2 hover:border-emerald-500/60 transition-all shadow-2xs hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                      <Truck className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                      زیر ۲ ساعت
                    </span>
                  </div>
                  <strong className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    ارسال فوری با اسنپ‌باکس
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    تحویل سریع در کلیه مناطق نجف‌آباد، ویلاشهر، گلدشت، یزدانشهر و اصفهان در همان روز.
                  </p>
                </div>

                {/* Step 2: Store Pickup */}
                <div className="group bg-slate-50 dark:bg-slate-850 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-750 space-y-2 hover:border-amber-500/60 transition-all shadow-2xs hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                      <Navigation className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                      تست حضوری
                    </span>
                  </div>
                  <strong className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    تحویل حضوری در فروشگاه
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    امکان مراجعه مستقیم به شعبه مرکزی نجف‌آباد (۱۵ خرداد مرکزی، نبش بن‌بست نرگس) با امکان تست سلامت کالا قبل از تحویل.
                  </p>
                </div>

                {/* Step 3: Nationwide Tipax */}
                <div className="group bg-slate-50 dark:bg-slate-850 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-750 space-y-2 hover:border-blue-500/60 transition-all shadow-2xs hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                      <Package className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-300 dark:border-blue-700">
                      ۲۴ تا ۴۸ ساعت
                    </span>
                  </div>
                  <strong className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    ارسال تیپاکس و پست پیشتاز
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    ارسال بسته‌بندی ایمن و استاندارد به سراسر کشور با بیمه کامل و کد رهگیری مرسوله.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. Mobile Sticky Bottom Buy Bar (Only visible when scrolled past main buy box) */}
      {/* ========================================================================= */}
      <div
        className={`print:hidden sm:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 border-t border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between gap-3 transition-all duration-300 ${
          showStickyBar
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">قیمت واحد:</span>
          <span className="text-sm font-black text-slate-950 dark:text-amber-400 font-mono">
            {formatToman(effectiveUnitPrice)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`flex-1 h-10 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 ${
            isOutOfStock
              ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              : addedToCart
              ? "bg-emerald-600 text-white"
              : "bg-amber-500 text-slate-950"
          }`}
        >
          {isOutOfStock ? (
            <span>اتمام موجودی</span>
          ) : addedToCart ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>اضافه شد</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>افزودن به سبد</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
