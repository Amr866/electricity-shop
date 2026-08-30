"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatToman, toPersianDigits, calculateTieredUnitPrice } from "@/lib/utils";
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
} from "lucide-react";

export interface ProductSpecItem {
  id?: string;
  label?: string;
  key?: string;
  value: string;
  group?: string | null;
}

export interface ProductReviewItem {
  id?: string;
  authorName: string;
  rating: number;
  comment: string;
  city?: string | null;
  createdAt?: Date;
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
}

interface ProductDetailProps {
  product: ProductDetailData;
}

// 1. Smart Category-Aware Default Specifications Generator
function getProductTechnicalSpecs(product: ProductDetailData): ProductSpecItem[] {
  if (product.specs && product.specs.length > 0) {
    return product.specs;
  }

  const categorySlug = product.category?.slug || "";
  const brandName = product.brand || "فروشگاه شیاسی";
  const madeIn = product.madeIn || "ایران";
  const warranty = product.warranty || "ضمانت سلامت فیزیکی و اصالت کالا";

  // Category specific engineering attributes
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

  // Default Universal Electrical Specifications
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
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // New Review Form State
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerCity, setReviewerCity] = useState("نجف‌آباد");
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewsList, setReviewsList] = useState<ProductReviewItem[]>(product.reviews || []);

  const isFavorited = isInWishlist(product.id);

  // Calculate tiered bulk discount unit prices
  const tier1Price = calculateTieredUnitPrice(product.price, 1);
  const tier2Price = calculateTieredUnitPrice(product.price, 10);
  const tier3Price = calculateTieredUnitPrice(product.price, 50);

  const effectiveUnitPrice = calculateTieredUnitPrice(product.price, quantity);
  const totalSavings = (product.price - effectiveUnitPrice) * quantity;

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart({ ...product, price: effectiveUnitPrice }, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleDownloadDatasheet = () => {
    setDownloadingPdf(true);
    setTimeout(() => {
      setDownloadingPdf(false);
      window.print();
    }, 600);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          authorName: reviewerName,
          city: reviewerCity,
          rating: reviewerRating,
          comment: reviewerComment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setReviewsList([data.review, ...reviewsList]);
        setReviewSuccess(true);
        setReviewerName("");
        setReviewerComment("");
        setTimeout(() => setReviewSuccess(false), 3000);
      }
    } catch {
      alert("خطا در ارسال نظر.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const isOutOfStock = product.stock <= 0;
  const technicalSpecs = getProductTechnicalSpecs(product);

  // Official Contractor WhatsApp Inquiry URL with Official Line 09162665884
  const contractorWhatsAppMessage = encodeURIComponent(
    `سلام وقت بخیر، جهت استعلام قیمت همکاری و خرید عمده کالا «${product.name}» (کد فنی: ${product.sku || product.id} - قیمت واحد: ${effectiveUnitPrice.toLocaleString("fa-IR")} تومان) از فروشگاه شیاسی پیام می‌دهم.`
  );
  const contractorWhatsAppUrl = `https://wa.me/989162665884?text=${contractorWhatsAppMessage}`;

  return (
    <div className="space-y-8">
      {/* 1. Main Product Overview Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start transition-colors duration-200">
        
        {/* Left Col (on desktop): Images & Gallery */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Image Container with 60fps Smooth Zoom */}
          <div className="group relative aspect-square w-full max-h-[380px] mx-auto rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 p-6 flex items-center justify-center overflow-hidden shadow-inner">
            {product.discountPercent && product.discountPercent > 0 ? (
              <span className="absolute top-4 right-4 bg-rose-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-md shadow-rose-500/20 z-10">
                {toPersianDigits(product.discountPercent)}٪ تخفیف
              </span>
            ) : null}

            {/* Wishlist Heart Button */}
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

            {/* Next.js Optimized Image with 60fps Smooth Hover Zoom */}
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

          {/* Compact Thumbnails list menu */}
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

          {/* Guarantees Box with Glowing Highlights */}
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

        {/* Right Col: Product Info & Purchasing Actions */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Top Attributes */}
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

              {product.sku && (
                <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 font-bold">
                  کد: {product.sku}
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-snug tracking-tight">
              {product.name}
            </h1>

            {/* Ratings & Fast Specs Badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  {toPersianDigits(product.rating || 4.9)}
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                  ({toPersianDigits(reviewsList.length)} نظر)
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

            {/* Bulk Tier Pricing Table with Live Highlight & Pulse */}
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 dark:border-amber-500/30 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-amber-900 dark:text-amber-300">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>تخفیف پله‌ای خرید عمده و متراژ بالا:</span>
                </span>
                {totalSavings > 0 && (
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-700 animate-pulse">
                    سود همکاری شما: {formatToman(totalSavings)}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {/* Tier 1: 1-9 */}
                <div
                  className={`p-2 rounded-xl border transition-all duration-300 ${
                    quantity < 10
                      ? "bg-white dark:bg-slate-800 border-amber-500 shadow-md shadow-amber-500/10 font-bold text-slate-900 dark:text-white scale-102"
                      : "bg-white/50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <span className="text-[10px] block font-medium mb-0.5">۱ تا ۹ عدد</span>
                  <strong className="text-slate-900 dark:text-slate-100 text-xs font-mono">{formatToman(tier1Price)}</strong>
                </div>

                {/* Tier 2: 10-49 */}
                <div
                  className={`p-2 rounded-xl border transition-all duration-300 ${
                    quantity >= 10 && quantity < 50
                      ? "bg-white dark:bg-slate-800 border-emerald-500 shadow-md shadow-emerald-500/10 font-bold text-slate-900 dark:text-white scale-102"
                      : "bg-white/50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-bold mb-0.5">۱۰ تا ۴۹ عدد (۵٪)</span>
                  <strong className="text-slate-900 dark:text-slate-100 text-xs font-mono">{formatToman(tier2Price)}</strong>
                </div>

                {/* Tier 3: 50+ */}
                <div
                  className={`p-2 rounded-xl border transition-all duration-300 ${
                    quantity >= 50
                      ? "bg-white dark:bg-slate-800 border-rose-500 shadow-md shadow-rose-500/10 font-bold text-slate-900 dark:text-white scale-102"
                      : "bg-white/50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <span className="text-[10px] text-rose-700 dark:text-rose-400 block font-bold mb-0.5">۵۰+ عدد (۱۰٪)</span>
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

          {/* Pricing & Checkout Action Box */}
          <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-750 space-y-3.5 shadow-sm">
            
            {/* Price section */}
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

            {/* Quantity Selector, Add to Cart, and Official Contractor WhatsApp Button */}
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

              {/* Official Contractor WhatsApp Inquiry Button */}
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
                href="tel:03142624567"
                aria-label="تماس تلفنی با فروشگاه شیاسی: ۰۳۱-۴۲۶۲۴۵۶۷"
                className="text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 font-bold font-mono flex items-center gap-1 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <bdi dir="ltr">۰۳۱-۴۲۶۲۴۵۶۷</bdi>
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* 2. Tabs Section: Specs, Wiring & Datasheet, Description, Reviews, Delivery */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl overflow-hidden transition-colors duration-200">
        {/* Tabs Bar with WAI-ARIA Role */}
        <div role="tablist" aria-label="بخش‌های اطلاعات فنی کالا" className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-4 overflow-x-auto scrollbar-none">
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

          {/* Wiring Diagram & Datasheet Tab */}
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
            <span>نقشه سیم‌کشی و دانلود کاتالوگ</span>
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
            <Sparkles className="w-4 h-4" />
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
            <Star className="w-4 h-4" />
            <span>نظرات خریداران ({toPersianDigits(reviewsList.length)})</span>
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

        {/* Tab Contents */}
        <div className="p-5 sm:p-8 bg-white dark:bg-slate-900">
          
          {/* Tab 1: Technical Specs Table (Dynamic & Rich) */}
          {activeTab === "specs" && (
            <div id="panel-specs" role="tabpanel" aria-labelledby="tab-specs" className="space-y-4">
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

          {/* Tab 2: Wiring Diagram & PDF Datasheet */}
          {activeTab === "wiring" && (
            <div id="panel-wiring" role="tabpanel" aria-labelledby="tab-wiring" className="space-y-6 max-w-4xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-amber-500" />
                    <span>راهنمای فنی سیم‌کشی و دفترچه نصب کالا</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    دیاگرام اتصالات استاندارد، نقشه رنگ‌بندی سیم‌ها و دفترچه راهنمای فارسی
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadDatasheet}
                  disabled={downloadingPdf}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0 active:scale-95 hover-glow"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadingPdf ? "در حال آماده‌سازی..." : "دانلود کاتالوگ (PDF)"}</span>
                </button>
              </div>

              {/* Technical Notice Box */}
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-amber-950 dark:text-amber-300 leading-relaxed font-medium">
                  <strong className="block font-bold">نکته ایمنی و نصب تخصصی:</strong>
                  <p>
                    قبل از هرگونه اقدام به اتصال، سیم‌کشی یا تعویض قطعه، جریان برق اصلی را از فیوز یا کلید مینیاتوری قطع نمایید. در صورت نیاز به راهنمایی در نقشه سیم‌بندی، کارشناسان کارگاه فنی شیاسی نجف‌آباد آماده پاسخگویی هستند.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Description */}
          {activeTab === "desc" && (
            <div id="panel-desc" role="tabpanel" aria-labelledby="tab-desc" className="space-y-4 max-w-4xl text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed text-justify font-medium">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>توضیحات و کاربرد تخصصی</span>
              </h3>
              <p>
                {product.description ||
                  product.shortDesc ||
                  "این کالا از برندهای معتبر و با کیفیت صنعتی تامین شده و دارای تاییدیه فنی و سلامت کارکرد از کارگاه شیاسی نجف‌آباد می‌باشد. استفاده از قطعات استاندارد با سیم‌پیچ تمام مس و متریال مرغوب، افزایش طول عمر مفید دستگاه و صرفه‌جویی در مصرف برق را تضمین می‌نماید."}
              </p>
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === "reviews" && (
            <div id="panel-reviews" role="tabpanel" aria-labelledby="tab-reviews" className="space-y-6 max-w-3xl">
              {/* Form */}
              <div className="bg-slate-50 dark:bg-slate-850 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-750">
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span>ثبت نظر و تجربه استفاده از این محصول</span>
                </h4>

                {reviewSuccess ? (
                  <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>دیدگاه شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          نام و نام خانوادگی
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="مثال: علی رضایی"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          شهر محل سکونت
                        </label>
                        <input
                          type="text"
                          value={reviewerCity}
                          onChange={(e) => setReviewerCity(e.target.value)}
                          placeholder="نجف‌آباد"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          امتیاز شما به کالا
                        </label>
                        <select
                          value={reviewerRating}
                          onChange={(e) => setReviewerRating(Number(e.target.value))}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ (عالی - ۵ از ۵)</option>
                          <option value={4}>⭐⭐⭐⭐ (خوب - ۴ از ۵)</option>
                          <option value={3}>⭐⭐⭐ (متوسط - ۳ از ۵)</option>
                          <option value={2}>⭐⭐ (ضعیف - ۲ از ۵)</option>
                          <option value={1}>⭐ (خیلی ضعیف - ۱ از ۵)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        متن دیدگاه یا نقد و بررسی
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={reviewerComment}
                        onChange={(e) => setReviewerComment(e.target.value)}
                        placeholder="کیفیت ساخت، سهولت در استفاده و عملکرد کالا را بنویسید..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 hover-glow active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingReview ? "در حال ارسال..." : "ثبت دیدگاه"}</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                {reviewsList.length > 0 ? (
                  reviewsList.map((rev, idx) => (
                    <div
                      key={rev.id || idx}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                            {rev.authorName?.slice(0, 1) || "ک"}
                          </div>
                          <div>
                            <strong className="text-xs font-bold text-slate-900 dark:text-white block">
                              {rev.authorName}
                            </strong>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {rev.city || "نجف‌آباد"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-justify font-medium">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    هنوز دیدگاهی برای این محصول ثبت نشده است. اولین نفری باشید که نظر خود را ثبت می‌کند!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Tab 5: Najafabad Fast Delivery */}
          {activeTab === "isfahan" && (
            <div id="panel-isfahan" role="tabpanel" aria-labelledby="tab-isfahan" className="space-y-4 max-w-3xl">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold text-sm sm:text-base">
                <Truck className="w-5 h-5" />
                <span>شرایط و نحوه ارسال سفارشات در نجف‌آباد و اصفهان</span>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-750">
                  <strong className="text-slate-900 dark:text-white block mb-0.5">ارسال فوری با اسنپ‌باکس:</strong>
                  <span>سفارش‌های ثبت شده تا ساعت ۱۷:۰۰ در محدوده شهر نجف‌آباد و اصفهان در همان روز تحویل داده می‌شوند.</span>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-750">
                  <strong className="text-slate-900 dark:text-white block mb-0.5">امکان خرید و تحویل حضوری:</strong>
                  <span>مشتریان محترم می‌توانند با هماهنگی تلفنی به فروشگاه مرکزی شیاسی در نجف‌آباد (خیابان قدس) مراجعه نمایند.</span>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-750">
                  <strong className="text-slate-900 dark:text-white block mb-0.5">ارسال به سراسر کشور:</strong>
                  <span>از طریق تیپاکس، پست پیشتاز و باربری در بسته‌بندی استاندارد و ایمن.</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 3. Mobile Sticky Bottom Buy Bar (Shows on Mobile for Quick Action) */}
      <div className="sm:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 border-t border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
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
