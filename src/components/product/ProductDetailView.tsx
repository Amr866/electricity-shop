"use client";

import React, { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

interface ProductDetailProps {
  product: {
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
    images?: { id?: string; url: string; isPrimary?: boolean; alt?: string | null }[];
    specs?: { id?: string; label?: string; key?: string; value: string; group?: string | null }[];
    reviews?: { id?: string; authorName: string; rating: number; comment: string; city?: string | null; createdAt: Date }[];
  };
}

export function ProductDetailView({ product }: ProductDetailProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(
    product.images?.find((img) => img.isPrimary)?.url ||
      product.images?.[0]?.url ||
      "/images/products/wal_172619-fans-7995865_1920.jpg"
  );
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
  const [reviewsList, setReviewsList] = useState(product.reviews || []);

  const isFavorited = isInWishlist(product.id);

  // Calculate tiered bulk discount unit prices using unified formula
  const tier1Price = calculateTieredUnitPrice(product.price, 1);
  const tier2Price = calculateTieredUnitPrice(product.price, 10);
  const tier3Price = calculateTieredUnitPrice(product.price, 50);

  const effectiveUnitPrice = calculateTieredUnitPrice(product.price, quantity);

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
    } catch (e) {
      alert("خطا در ارسال نظر.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const isOutOfStock = product.stock <= 0;

  const contractorWhatsAppMessage = encodeURIComponent(
    `سلام وقت بخیر، جهت استعلام قیمت همکاری و خرید عمده کالا «${product.name}» (کد ${product.sku || product.id}) از فروشگاه شیاسی پیام می‌دهم.`
  );

  return (
    <div className="space-y-8">
      {/* 1. Main Product Overview Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start transition-colors duration-200">
        
        {/* Left Col (on desktop): Images & Gallery */}
        <div className="lg:col-span-5 space-y-3">
          {/* Main Image Container */}
          <div className="relative aspect-square max-h-[300px] mx-auto rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 p-4 flex items-center justify-center overflow-hidden">
            {product.discountPercent && product.discountPercent > 0 ? (
              <span className="absolute top-3 right-3 bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md z-10">
                {toPersianDigits(product.discountPercent)}٪ تخفیف
              </span>
            ) : null}

            {/* Wishlist Heart Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all shadow-sm ${
                isFavorited
                  ? "bg-rose-50 dark:bg-rose-950 text-rose-500 border border-rose-200 dark:border-rose-800"
                  : "bg-white/90 dark:bg-slate-800 text-slate-400 dark:text-slate-300 hover:text-rose-500 border border-slate-200 dark:border-slate-700"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>

            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-contain object-center transition-all duration-300"
            />
          </div>

          {/* Compact Thumbnails list menu */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-11 h-11 rounded-xl p-1 border bg-slate-50 dark:bg-slate-800 overflow-hidden transition-all shrink-0 ${
                    selectedImage === img.url
                      ? "border-amber-500 ring-2 ring-amber-500/20 scale-105"
                      : "border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Guarantees Box */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-100 dark:border-slate-700 ambient-glow">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>ضمانت ۱۰۰٪ مس و اصالت</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-100 dark:border-slate-700 ambient-glow">
              <RotateCcw className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>مهلت تست و کارکرد</span>
            </div>
          </div>
        </div>

        {/* Right Col: Product Info & Purchasing Actions */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Top Attributes */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span>دسته‌بندی:</span>
                <Link
                  href={`/products?category=${product.category?.slug}`}
                  className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  {product.category?.name}
                </Link>
              </div>

              {product.sku && (
                <span className="font-mono text-slate-400 dark:text-slate-500 text-[11px]">
                  کد: {product.sku}
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Fast Specs */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5 pb-2 border-b border-slate-100 dark:border-slate-800">
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
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                  برند: {product.brand}
                </span>
              )}

              {product.madeIn && (
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded text-[11px]">
                  ساخت: {product.madeIn}
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.shortDesc && (
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-justify line-clamp-2">
                {product.shortDesc}
              </p>
            )}

            {/* RoboEQ-style Bulk Tier Pricing Table */}
            <div className="bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 rounded-2xl p-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-950 dark:text-amber-300">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  تخفیف پله‌ای خرید تعداد بالا:
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                <div
                  className={`p-1.5 rounded-xl border ${
                    quantity < 10
                      ? "bg-white dark:bg-slate-800 border-amber-400 shadow-sm font-bold"
                      : "bg-amber-100/40 dark:bg-slate-850 border-amber-200/60 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <span className="text-[10px] block text-slate-500 dark:text-slate-400">۱ تا ۹ عدد</span>
                  <strong className="text-slate-900 dark:text-slate-100 text-xs font-mono">{formatToman(tier1Price)}</strong>
                </div>
                <div
                  className={`p-1.5 rounded-xl border ${
                    quantity >= 10 && quantity < 50
                      ? "bg-white dark:bg-slate-800 border-amber-400 shadow-sm font-bold"
                      : "bg-amber-100/40 dark:bg-slate-850 border-amber-200/60 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">۱۰ تا ۴۹ عدد (۵٪)</span>
                  <strong className="text-slate-900 dark:text-slate-100 text-xs font-mono">{formatToman(tier2Price)}</strong>
                </div>
                <div
                  className={`p-1.5 rounded-xl border ${
                    quantity >= 50
                      ? "bg-white dark:bg-slate-800 border-amber-400 shadow-sm font-bold"
                      : "bg-amber-100/40 dark:bg-slate-850 border-amber-200/60 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <span className="text-[10px] text-rose-700 dark:text-rose-400 block">۵۰+ عدد (۱۰٪)</span>
                  <strong className="text-slate-900 dark:text-slate-100 text-xs font-mono">{formatToman(tier3Price)}</strong>
                </div>
              </div>
            </div>

            {/* Fast Delivery Notice */}
            <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800 rounded-xl p-2 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-300">
              <div className="flex items-center gap-1.5 font-bold text-[11px]">
                <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>ارسال فوری در نجف‌آباد و اصفهان</span>
              </div>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400">تحویل با اسنپ‌باکس / تیپاکس</span>
            </div>
          </div>

          {/* Pricing & Checkout Action Box */}
          <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-750 space-y-3">
            
            {/* Price section */}
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">مبلغ کل قابل پرداخت:</span>
              <div className="flex flex-col items-end">
                {effectiveUnitPrice < product.price && (
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">
                    تخفیف تعداد بالا اعمال شد!
                  </span>
                )}
                <span className="text-xl font-extrabold text-slate-950 dark:text-amber-400 font-mono">
                  {formatToman(effectiveUnitPrice * quantity)}
                </span>
              </div>
            </div>

            {/* Quantity Selector, Add to Cart, and Contractor WhatsApp Inquiry Button */}
            <div className="flex items-center gap-2">
              {/* Quantity Counter */}
              <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-0.5 shrink-0 h-10">
                <button
                  onClick={() => setQuantity(Math.min(quantity + 1, product.stock))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white disabled:opacity-30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2.5 font-bold text-slate-900 dark:text-white text-xs persian-numbers">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white disabled:opacity-30"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add To Cart CTA Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 h-10 px-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-md ${
                  isOutOfStock
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none"
                    : addedToCart
                    ? "bg-emerald-600 text-white shadow-emerald-600/30"
                    : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 active:scale-[0.98] hover-glow"
                }`}
              >
                {isOutOfStock ? (
                  <span>اتمام موجودی</span>
                ) : addedToCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>به سبد اضافه شد</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>افزودن به سبد خرید</span>
                  </>
                )}
              </button>

              {/* Contractor Bulk WhatsApp Inquiry Button */}
              <a
                href={`https://wa.me/989131112233?text=${contractorWhatsAppMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all shrink-0 shadow-md shadow-emerald-600/20 active:scale-95 hover-glow"
                title="استعلام قیمت همکاری و خرید عمده در واتساپ"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">استعلام قیمت همکار</span>
              </a>
            </div>

            {/* Quick Stock & Direct Call Row */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${product.stock > 5 ? "bg-emerald-500" : product.stock > 0 ? "bg-amber-500" : "bg-rose-500"}`} />
                <span>
                  {product.stock > 5
                    ? `موجود در انبار (${toPersianDigits(product.stock)} عدد)`
                    : product.stock > 0
                    ? `تنها ${toPersianDigits(product.stock)} عدد باقی مانده`
                    : "ناموجود"}
                </span>
              </span>

              <a
                href="tel:03142624567"
                dir="ltr"
                className="text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 font-bold font-mono flex items-center gap-1"
              >
                <Phone className="w-3 h-3 text-amber-500 shrink-0" />
                <span>۰۳۱-۴۲۶۲۴۵۶۷</span>
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* 2. Tabs Section: Specs, Wiring & Datasheet, Description, Reviews, Delivery */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("specs")}
            className={`py-3.5 px-4 sm:px-5 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "specs"
                ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>مشخصات فنی قطعه</span>
          </button>

          {/* New Wiring Diagram & Datasheet Tab */}
          <button
            onClick={() => setActiveTab("wiring")}
            className={`py-3.5 px-4 sm:px-5 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "wiring"
                ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Cpu className="w-4 h-4 text-amber-500" />
            <span>نقشه سیم‌کشی و دانلود کاتالوگ</span>
          </button>

          <button
            onClick={() => setActiveTab("desc")}
            className={`py-3.5 px-4 sm:px-5 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "desc"
                ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>توضیحات و کاربرد تخصصی</span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-3.5 px-4 sm:px-5 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "reviews"
                ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Star className="w-4 h-4" />
            <span>نظرات خریداران ({toPersianDigits(reviewsList.length)})</span>
          </button>

          <button
            onClick={() => setActiveTab("isfahan")}
            className={`py-3.5 px-4 sm:px-5 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "isfahan"
                ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>تحویل فوری در نجف‌آباد</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8">
          
          {/* Tab 1: Technical Specs Table */}
          {activeTab === "specs" && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                مشخصات فنی و استانداردهای قطعه
              </h3>

              {product.specs && product.specs.length > 0 ? (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                  {product.specs.map((spec, i) => (
                    <div
                      key={i}
                      className={`grid grid-cols-3 sm:grid-cols-4 p-3 text-xs ${
                        i % 2 === 0 ? "bg-slate-50/70 dark:bg-slate-800/40" : "bg-white dark:bg-slate-900"
                      }`}
                    >
                      <span className="font-bold text-slate-600 dark:text-slate-400 col-span-1">
                        {spec.label || spec.key || "مشخصه"}
                      </span>
                      <span className="font-medium text-slate-900 dark:text-slate-100 col-span-2 sm:col-span-3">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  مشخصات تکمیلی این کالا ثبت شده است. جهت راهنمایی دقیق‌تر می‌توانید با کارشناسان کارگاه شیاسی تماس بگیرید.
                </p>
              )}
            </div>
          )}

          {/* Tab 2: Wiring Diagram & PDF Datasheet */}
          {activeTab === "wiring" && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-amber-500" />
                    <span>راهنمای فنی سیم‌کشی و دفترچه نصب کالا</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    کدهای رنگی سیم‌ها، نحوه اتصال خازن راه‌انداز، کلیدها و دیاگرام مداری
                  </p>
                </div>

                {/* PDF Download Button */}
                <button
                  onClick={handleDownloadDatasheet}
                  disabled={downloadingPdf}
                  className="px-4 py-2 bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadingPdf ? "در حال آماده‌سازی..." : "دانلود برگه مشخصات و PDF"}</span>
                </button>
              </div>

              {/* Wiring Schematic & Color-Coded Diagram Card */}
              <div className="bg-slate-950 text-slate-200 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1.5">
                    <FileCode className="w-4 h-4" />
                    <span>شماتیک مداری استاندارد (Wiring Schematic)</span>
                  </span>
                  <span className="text-[10px] bg-slate-850 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                    ولتاژ: ۲۲۰V / ۵۰Hz
                  </span>
                </div>

                {/* Visual Terminal Block */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <span className="w-3 h-3 rounded-full bg-blue-500" />
                      <span>سیم آبی (نول / COM)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">اتصال مستقیم به ترمینال نول اصلی</p>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <span className="w-3 h-3 rounded-full bg-amber-500" />
                      <span>سیم قهوه‌ای (دور کند / LO)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">اتصال به پلاتین دور اول کلید</p>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <span className="w-3 h-3 rounded-full bg-rose-500" />
                      <span>سیم مشکی (دور تند / HI)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">اتصال به پلاتین دور دوم کلید</p>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span>سیم زرد/سبز (ارت / GND)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">اتصال به بدنه فلزی جهت حفاظت</p>
                  </div>
                </div>

                {/* Safety & Technical Warnings */}
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <p className="leading-relaxed">
                    <strong>نکته مهم ایمنی:</strong> قبل از هرگونه سیم‌کشی یا تعویض قطعه، برق اصلی ساختمان را قطع کنید. در صورت بروز هرگونه ابهام در سیم‌کشی، می‌توانید دستگاه را جهت نصب و تست به کارگاه فنی شیاسی نجف‌آباد تحویل دهید.
                  </p>
                </div>
              </div>

              {/* Maintenance and Repair Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>بررسی سلامت خازن راه‌انداز</span>
                  </h4>
                  <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                    در صورت عدم راه‌اندازی یا ایجاد صدای وزوز، ظرفیت خازن روغنی را با مولتی‌متر تست کرده و در صورت نیاز از خازن فابریک موجود در فروشگاه شیاسی استفاده نمایید.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>روغن‌کاری بوش‌ها و بلبرینگ‌ها</span>
                  </h4>
                  <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                    برای جلوگیری از قفل شدن روتور و داغ شدن سیم‌پیچ، در ابتدای هر فصل بوش‌های برنجی را با روغن سیلیکون مخصوص روان‌کاری نمایید.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Full Description */}
          {activeTab === "desc" && (
            <div className="space-y-4 max-w-4xl">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                معرفی جامع و راهنمای نصب و کاربرد
              </h3>
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 text-justify">
                {product.description ? (
                  <p>{product.description}</p>
                ) : (
                  <p>
                    این محصول با بالاترین کیفیت متریال و رعایت استانداردهای ملی و بین‌المللی تولید گردیده است. مناسب جهت پروژه‌های ساختمانی، برق صنعتی، روشنایی خانگی و کارگاه‌های تعمیرات لوازم برقی.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    نظرات و تجربیات خریداران این کالا
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    شما هم می‌توانید تجربه استفاده یا خرید خود را با سایر خریداران به اشتراک بگذارید.
                  </p>
                </div>
              </div>

              {/* Review Submit Form */}
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  ثبت دیدگاه یا پرسش درباره این محصول
                </h4>

                {reviewSuccess ? (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                    دیدگاه شما با موفقیت ثبت گردید و پس از بررسی منتشر خواهد شد.
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          نام شما
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="مثال: علی رضایی"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 hover-glow"
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
                  reviewsList.map((rev: any, idx: number) => (
                    <div
                      key={rev.id || idx}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                            {rev.authorName?.slice(0, 1) || "ک"}
                          </div>
                          <div>
                            <strong className="text-xs font-bold text-slate-900 dark:text-white block">
                              {rev.authorName}
                            </strong>
                            <span className="text-[10px] text-slate-400">
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

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    هنوز دیدگاهی برای این محصول ثبت نشده است. اولین نفری باشید که نظر خود را ثبت می‌کند!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Tab 5: Najafabad Fast Delivery */}
          {activeTab === "isfahan" && (
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold text-sm sm:text-base">
                <Truck className="w-5 h-5" />
                <span>شرایط و نحوه ارسال سفارشات در نجف‌آباد و اصفهان</span>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <strong className="text-slate-900 dark:text-white block mb-0.5">ارسال فوری با اسنپ‌باکس:</strong>
                  <span>سفارش‌های ثبت شده تا ساعت ۱۷:۰۰ در محدوده شهر نجف‌آباد و اصفهان در همان روز تحویل داده می‌شوند.</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <strong className="text-slate-900 dark:text-white block mb-0.5">امکان خرید و تحویل حضوری:</strong>
                  <span>مشتریان محترم می‌توانند با هماهنگی تلفنی به فروشگاه مرکزی شیاسی در نجف‌آباد (خیابان قدس) مراجعه نمایند.</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <strong className="text-slate-900 dark:text-white block mb-0.5">ارسال به سراسر کشور:</strong>
                  <span>از طریق تیپاکس، پست پیشتاز و باربری در بسته‌بندی استاندارد و ایمن.</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
