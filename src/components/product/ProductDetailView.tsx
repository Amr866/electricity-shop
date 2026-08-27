"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatToman, toPersianDigits } from "@/lib/utils";
import {
  ShoppingCart,
  Check,
  Star,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  MapPin,
  Share2,
  PhoneCall,
  Plus,
  Minus,
  MessageCircle,
  FileCheck,
  Send,
  CheckCircle2,
  Heart,
  Download,
  Layers,
} from "lucide-react";

interface ProductDetailViewProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku?: string | null;
    shortDesc?: string | null;
    description: string;
    price: number;
    originalPrice?: number | null;
    discountPercent?: number;
    stock: number;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isNewArrival?: boolean;
    isIsfahanFast?: boolean;
    brand?: string | null;
    warranty?: string | null;
    madeIn?: string | null;
    rating?: number;
    reviewCount?: number;
    category?: { name: string; slug: string };
    images: { id: string; url: string; isPrimary?: boolean; alt?: string | null }[];
    specs: { id: string; label: string; value: string }[];
    reviews: {
      id: string;
      authorName: string;
      city?: string | null;
      rating: number;
      comment: string;
      createdAt: any;
    }[];
  };
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);

  const [selectedImage, setSelectedImage] = useState(
    product.images?.find((img) => img.isPrimary)?.url ||
      product.images?.[0]?.url ||
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "bulk" | "desc" | "reviews">("specs");

  // Review Form States
  const [reviewsList, setReviewsList] = useState(product.reviews || []);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerCity, setReviewerCity] = useState("اصفهان");
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Bulk Tier Pricing (RoboEQ & Shiasi style)
  const tier1Price = product.price;
  const tier2Price = Math.round(product.price * 0.95);
  const tier3Price = Math.round(product.price * 0.9);

  const effectiveUnitPrice =
    quantity >= 50 ? tier3Price : quantity >= 10 ? tier2Price : tier1Price;

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart({ ...product, price: effectiveUnitPrice }, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
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

  const whatsappMessage = encodeURIComponent(
    `سلام، در رابطه با خرید و استعلام قیمت کالا «${product.name}» با کد ${product.sku || product.id} از فروشگاه پیام می‌دهم.`
  );

  return (
    <div className="space-y-8">
      {/* 1. Main Product Overview Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col (on desktop): Images & Gallery */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square rounded-2xl bg-slate-50 border border-slate-100 p-6 flex items-center justify-center overflow-hidden">
            {product.discountPercent && product.discountPercent > 0 ? (
              <span className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md z-10">
                {toPersianDigits(product.discountPercent)}٪ تخفیف
              </span>
            ) : null}

            {/* Wishlist Heart Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center z-10 transition-all shadow-md ${
                isFavorited
                  ? "bg-rose-50 text-rose-500 border border-rose-200"
                  : "bg-white/90 text-slate-400 hover:text-rose-500 border border-slate-200"
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? "fill-rose-500" : ""}`} />
            </button>

            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-contain object-center transition-all duration-300"
            />
          </div>

          {/* Thumbnails list */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-18 h-18 aspect-square rounded-xl p-1 bg-slate-50 border-2 transition-all shrink-0 ${
                    selectedImage === img.url
                      ? "border-amber-500 ring-2 ring-amber-500/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt || product.name}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Guarantees Box */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>ضمانت اصالت و سلامت ۱۰۰٪</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <RotateCcw className="w-4 h-4 text-purple-600 shrink-0" />
              <span>۷ روز ضمانت بازگشت</span>
            </div>
          </div>
        </div>

        {/* Right Col: Product Info & Purchasing Actions */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          
          {/* Top Attributes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span>دسته‌بندی:</span>
                <Link
                  href={`/products?category=${product.category?.slug}`}
                  className="font-bold text-amber-600 hover:underline"
                >
                  {product.category?.name}
                </Link>
              </div>

              {product.sku && (
                <span className="font-mono text-slate-400">
                  کد کالا: {product.sku}
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Fast Specs */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-800">
                  {toPersianDigits(product.rating || 4.9)}
                </span>
                <span className="text-slate-400">
                  ({toPersianDigits(reviewsList.length)} نظر مشتریان)
                </span>
              </div>

              {product.brand && (
                <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-semibold">
                  برند: {product.brand}
                </span>
              )}

              {product.madeIn && (
                <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                  ساخت: {product.madeIn}
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.shortDesc && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
                {product.shortDesc}
              </p>
            )}

            {/* RoboEQ-style Bulk Tier Pricing Table */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-600" />
                  جدول تخفیف پله‌ای خرید تعداد بالا (ویژه همکاران):
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div
                  className={`p-2 rounded-xl border ${
                    quantity < 10
                      ? "bg-white border-amber-400 shadow-sm font-bold"
                      : "bg-amber-100/50 border-amber-200 text-slate-600"
                  }`}
                >
                  <span className="text-[10px] block">۱ تا ۹ عدد</span>
                  <strong className="text-slate-900">{formatToman(tier1Price)}</strong>
                </div>
                <div
                  className={`p-2 rounded-xl border ${
                    quantity >= 10 && quantity < 50
                      ? "bg-white border-amber-400 shadow-sm font-bold"
                      : "bg-amber-100/50 border-amber-200 text-slate-600"
                  }`}
                >
                  <span className="text-[10px] text-emerald-700 block">۱۰ تا ۴۹ عدد (۵٪ تخفیف)</span>
                  <strong className="text-slate-900">{formatToman(tier2Price)}</strong>
                </div>
                <div
                  className={`p-2 rounded-xl border ${
                    quantity >= 50
                      ? "bg-white border-amber-400 shadow-sm font-bold"
                      : "bg-amber-100/50 border-amber-200 text-slate-600"
                  }`}
                >
                  <span className="text-[10px] text-rose-700 block">۵۰ عدد به بالا (۱۲٪ تخفیف)</span>
                  <strong className="text-slate-900">{formatToman(tier3Price)}</strong>
                </div>
              </div>
            </div>

            {/* Isfahan Local Delivery Notice */}
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 space-y-1">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>ارسال اختصاصی با اسنپ‌باکس در اصفهان</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                تحویل ۲ الی ۳ ساعته در تمامی مناطق اصفهان و امکان تحویل حضوری در شعبه.
              </p>
            </div>
          </div>

          {/* Pricing & Checkout Action Box */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
            
            {/* Price section */}
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500 font-semibold">مبلغ نهایی بر اساس تعداد:</span>
              <div className="flex flex-col items-end">
                {effectiveUnitPrice < product.price && (
                  <span className="text-xs text-rose-600 font-bold">
                    تخفیف تعداد بالا اعمال شد!
                  </span>
                )}
                <span className="text-2xl font-black text-slate-950">
                  {formatToman(effectiveUnitPrice * quantity)}
                </span>
              </div>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {/* Quantity Counter */}
              <div className="flex items-center bg-white border border-slate-300 rounded-xl p-1 shrink-0 w-full sm:w-auto justify-between sm:justify-center">
                <button
                  onClick={() => setQuantity(Math.min(quantity + 1, product.stock))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="p-2 text-slate-600 hover:text-slate-950 disabled:opacity-30"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="px-4 font-bold text-slate-900 text-sm persian-numbers">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2 text-slate-600 hover:text-slate-950 disabled:opacity-30"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>

              {/* Add To Cart CTA Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 w-full py-3.5 px-6 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                  isOutOfStock
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    : addedToCart
                    ? "bg-emerald-600 text-white shadow-emerald-600/30"
                    : "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/25 active:scale-[0.98]"
                }`}
              >
                {isOutOfStock ? (
                  <span>اتمام موجودی در انبار</span>
                ) : addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>به سبد خرید اضافه شد</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>افزودن به سبد خرید</span>
                  </>
                )}
              </button>
            </div>

            {/* Alternative Inquiry Links: WhatsApp & Phone */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://wa.me/989131112233?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-100/70 hover:bg-emerald-100 text-emerald-800 font-bold text-xs py-2.5 rounded-xl border border-emerald-300/60 flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>استعلام واتساپ</span>
              </a>

              <a
                href="tel:03132204567"
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-slate-700" />
                <span>تماس با کارشناس</span>
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* 2. Tabs Section: Technical Specs / Full Description / Reviews */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("specs")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shrink-0 transition-colors ${
              activeTab === "specs"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            مشخصات فنی و استانداردها
          </button>
          <button
            onClick={() => setActiveTab("bulk")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shrink-0 transition-colors ${
              activeTab === "bulk"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            دیتاشیت و خرید عمده
          </button>
          <button
            onClick={() => setActiveTab("desc")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shrink-0 transition-colors ${
              activeTab === "desc"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            توضیحات و کاربرد
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shrink-0 transition-colors ${
              activeTab === "reviews"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            نظرات کاربران ({toPersianDigits(reviewsList.length)})
          </button>
        </div>

        {/* Tab 1: Specs Table */}
        {activeTab === "specs" && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-500" />
              <span>جدول مشخصات فنی دستگاه / قطعه</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {product.specs && product.specs.length > 0 ? (
                product.specs.map((spec) => (
                  <div
                    key={spec.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <span className="text-slate-500 font-medium">{spec.label}</span>
                    <span className="font-bold text-slate-900 text-left">{spec.value}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">مشخصات تکمیلی درج نشده است.</p>
              )}

              {product.warranty && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">گارانتی و خدمات</span>
                  <span className="font-bold text-emerald-700">{product.warranty}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Datasheet & Bulk Table (RoboEQ style) */}
        {activeTab === "bulk" && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">دانلود فایل‌های فنی و دیتاشیت:</h4>
              <p className="text-slate-600 leading-relaxed">
                نقشه‌های شماتیک، کاتالوگ ابعادی و مشخصات الکتریکی دقیق طبق استاندارد IEC جهت استفاده مهندسین و طراحان مدار:
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("دیتاشیت فنی این محصول در حال آماده‌سازی و بارگذاری است.");
                  }}
                  className="bg-white border border-slate-300 hover:border-amber-500 px-4 py-2.5 rounded-xl font-bold text-slate-800 flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4 text-amber-600" />
                  <span>دانلود کاتالوگ فنی (PDF Datasheet)</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Full Description */}
        {activeTab === "desc" && (
          <div className="prose prose-sm max-w-none text-slate-700 text-xs sm:text-sm leading-loose text-justify">
            <p className="whitespace-pre-line">{product.description}</p>
          </div>
        )}

        {/* Tab 4: Customer Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">
                دیدگاه‌ها و نظرات خریداران
              </h3>
              <span className="text-xs text-slate-500">
                {toPersianDigits(reviewsList.length)} نظر ثبت شده
              </span>
            </div>

            {/* Reviews List */}
            {reviewsList.length > 0 ? (
              <div className="space-y-4">
                {reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                          {rev.authorName.slice(0, 1)}
                        </div>
                        <strong className="text-xs text-slate-900">{rev.authorName}</strong>
                        <span className="text-[10px] text-slate-400">
                          ({rev.city || "اصفهان"})
                        </span>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed text-justify">
                      «{rev.comment}»
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4">
                هنوز نظری برای این کالا ثبت نشده است. اولین نفری باشید که دیدگاه خود را ثبت می‌کند.
              </p>
            )}

            {/* Write a review form */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4 mt-6">
              <h4 className="font-bold text-xs text-slate-900">
                ثبت دیدگاه یا تجربه خرید درباره این محصول:
              </h4>

              {reviewSuccess && (
                <div className="bg-emerald-100 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>دیدگاه شما با موفقیت ثبت گردید.</span>
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">نام شما *</label>
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="مثال: علی رضایی"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">شهر / محله</label>
                    <input
                      type="text"
                      value={reviewerCity}
                      onChange={(e) => setReviewerCity(e.target.value)}
                      placeholder="اصفهان (مرداویج)"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">امتیاز شما</label>
                    <select
                      value={reviewerRating}
                      onChange={(e) => setReviewerRating(parseInt(e.target.value, 10))}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                    >
                      <option value="5">۵ ستاره (عالی)</option>
                      <option value="4">۴ ستاره (خوب)</option>
                      <option value="3">۳ ستاره (متوسط)</option>
                      <option value="2">۲ ستاره (ضعیف)</option>
                      <option value="1">۱ ستاره (بسیار ضعیف)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">متن نظر یا تجربه کاری با کالا *</label>
                  <textarea
                    required
                    rows={3}
                    value={reviewerComment}
                    onChange={(e) => setReviewerComment(e.target.value)}
                    placeholder="تجربه خود در مورد کیفیت، بسته‌بندی یا ارسال را بنویسید..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingReview ? "در حال ثبت..." : "ارسال دیدگاه"}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
