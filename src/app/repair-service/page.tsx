"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useBrand } from "@/context/BrandContext";
import { formatToman, toPersianDigits } from "@/lib/utils";
import {
  Wrench,
  CheckCircle2,
  Phone,
  Clock,
  MapPin,
  Truck,
  ShieldCheck,
  Send,
  Search,
  MessageCircle,
  Fan,
  Sun,
  Flame,
  Tv,
  Cpu,
  Sparkles,
  Plug,
  AlertCircle,
  Camera,
  UploadCloud,
  X,
  Copy,
  Check,
  FileCheck2,
  Cog,
  PackageCheck,
} from "lucide-react";

function toEnglishDigits(str: string): string {
  if (!str) return "";
  return str
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .trim();
}

export default function RepairServicePage() {
  const { brand } = useBrand();

  // New Ticket Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [applianceType, setApplianceType] = useState("پنکه");
  const [customApplianceName, setCustomApplianceName] = useState("");
  const [brandModel, setBrandModel] = useState("");
  const [issueDesc, setIssueDesc] = useState("");
  const [deliveryType, setDeliveryType] = useState("in_person");
  
  // Photo Attachment State
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Tracking State
  const [trackCode, setTrackCode] = useState("");
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackResult, setTrackResult] = useState<any>(null);
  const [trackError, setTrackError] = useState("");
  const [isOrderCode, setIsOrderCode] = useState(false);

  // Handle Photo Upload
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("حجم تصویر نباید بیشتر از ۵ مگابایت باشد.");
      return;
    }

    setPhotoError("");
    setUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/repairs/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPhotoUrl(data.url);
      } else {
        setPhotoError(data.error || "خطا در آپلود تصویر");
      }
    } catch (err) {
      setPhotoError("خطا در برقراری ارتباط با سرور آپلود");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(null);
    setPhotoError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopyTrackingCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !issueDesc) return;

    const normalizedPhone = toEnglishDigits(customerPhone);
    const finalApplianceType =
      applianceType === "سایر وسایل برقی (غیره)" && customApplianceName.trim()
        ? `سایر: ${customApplianceName.trim()}`
        : applianceType;

    setSubmitting(true);
    try {
      const res = await fetch("/api/repairs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone: normalizedPhone,
          applianceType: finalApplianceType,
          brandModel,
          issueDesc,
          deliveryType,
          photoUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTicketResult(data.repair);
        setCustomerName("");
        setCustomerPhone("");
        setCustomApplianceName("");
        setBrandModel("");
        setIssueDesc("");
        setPhotoUrl(null);
      } else {
        alert(data.error || "خطا در ثبت درخواست تعمیر");
      }
    } catch (err) {
      alert("خطای ارتباط با سرور");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = toEnglishDigits(trackCode.trim()).toUpperCase();
    if (!clean) return;

    setIsOrderCode(false);
    if (clean.startsWith("SH-") || clean.startsWith("ORD-")) {
      setIsOrderCode(true);
      setTrackError("این یک شماره سفارش کالا است، نه کد پذیرش تعمیرات!");
      return;
    }

    setTrackingLoading(true);
    setTrackError("");
    setTrackResult(null);

    try {
      const res = await fetch(`/api/repairs?phone=${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (res.ok && data.repairs && data.repairs.length > 0) {
        setTrackResult(data.repairs[0]);
      } else {
        setTrackError("درخواستی با این شماره تماس یا کد رهگیری یافت نشد.");
      }
    } catch (err) {
      setTrackError("خطا در برقراری ارتباط.");
    } finally {
      setTrackingLoading(false);
    }
  };

  const applianceOptions = [
    { label: "پنکه (ایستاده، رومیزی، سقفی)", value: "پنکه", icon: Fan },
    { label: "موتور یا پمپ کولر آبی", value: "کولر آبی", icon: Sun },
    { label: "بخاری برقی و هیتر تابشی", value: "بخاری برقی", icon: Flame },
    { label: "آنتن تلویزیون، بوستر و دیجیتال", value: "آنتن و دیجیتال", icon: Tv },
    { label: "برد الکترونیکی و تغذیه", value: "برد الکترونیکی", icon: Cpu },
    { label: "سایر وسایل برقی و صنعتی (غیره)", value: "سایر وسایل برقی (غیره)", icon: Plug },
  ];

  // Helper for Stepper stages
  const getStepIndex = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return 0;
      case "RECEIVED":
      case "IN_PROGRESS":
        return 1;
      case "INSPECTING":
        return 2;
      case "REPAIRING":
        return 3;
      case "COMPLETED":
      case "READY":
      case "DELIVERED":
        return 4;
      default:
        return 0;
    }
  };

  const stepsList = [
    { label: "ثبت درخواست", icon: FileCheck2 },
    { label: "پذیرش کارگاه", icon: Wrench },
    { label: "بررسی و عیب‌یابی", icon: Cog },
    { label: "در حال تعمیر", icon: Sparkles },
    { label: "آماده تحویل", icon: PackageCheck },
  ];

  // Extract attached photo from adminNotes if present
  const attachedPhoto = trackResult?.adminNotes?.match(/\[تصویر ضمیمه\]:\s*(\S+)/)?.[1];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-300 dark:border-amber-700">
            <Wrench className="w-3.5 h-3.5" />
            <span>کارگاه فنی شیاسی در نجف‌آباد</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            خدمات و کارگاه تعمیرات تخصصی لوازم برقی
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            تعمیر و عیب‌یابی انواع پنکه، موتور کولر آبی، بخاری برقی، آنتن، چای‌ساز، اتو، جاروبرقی، محافظ و سایر وسایل برقی در نجف‌آباد اصفهان با ضمانت کارکرد
          </p>
        </div>

        {/* 4 Feature Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 dark:text-white block">قطعات یدکی اورجینال</strong>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">سیم‌پیچی مس و قطعات اصلی</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 dark:text-white block">تحویل فوری ۲۴ تا ۴۸ ساعته</strong>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">تست نهایی در کارگاه</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 dark:text-white block">پیک دریافت و ارسال</strong>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">در سراسر نجف‌آباد و حومه</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 dark:text-white block">مهلت تست پس از تعمیر</strong>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">تضمین کیفیت تعمیرات</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Submit Repair Form + Tracking Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Col: Request Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-500" />
                  <span>ثبت آنلاین درخواست عیب‌یابی و تعمیر کالا</span>
                </h2>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold">شعبه نجف‌آباد</span>
              </div>

              {ticketResult ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-6 text-center space-y-4 text-emerald-950 dark:text-emerald-300 animate-in fade-in">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="font-black text-lg">درخواست شما با موفقیت ثبت شد!</h3>
                    <p className="text-xs text-emerald-800 dark:text-emerald-400">
                      کارشناسان کارگاه شیاسی جهت هماهنگی دریافت کالا به زودی با شما تماس می‌گیرند.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 inline-flex flex-col items-center gap-2 shadow-sm">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      کد رهگیری پذیرش تعمیرات شما:
                    </span>
                    <div className="flex items-center gap-2">
                      <strong className="text-xl font-mono font-black text-emerald-700 dark:text-amber-400 dir-ltr">
                        {ticketResult.trackingCode}
                      </strong>
                      <button
                        type="button"
                        onClick={() => handleCopyTrackingCode(ticketResult.trackingCode)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                        title="کپی کد رهگیری"
                      >
                        {copiedCode ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {copiedCode && (
                      <span className="text-[10px] text-emerald-600 font-bold">
                        کد با موفقیت کپی شد!
                      </span>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setTicketResult(null)}
                      className="text-xs font-bold text-emerald-800 dark:text-amber-400 hover:underline"
                    >
                      ثبت یک درخواست تعمیر دیگر +
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Customer Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        نام و نام خانوادگی <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="مثال: علیرضا محمدی"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        شماره تماس همراه <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="۰۹۱۳..."
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-left"
                      />
                    </div>
                  </div>

                  {/* Appliance Type Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      نوع دستگاه یا وسیله برقی <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {applianceOptions.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = applianceType === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setApplianceType(opt.value)}
                            className={`p-3 rounded-xl border text-right transition-all flex items-center gap-2 ${
                              isSelected
                                ? "bg-amber-50 dark:bg-amber-950/80 border-amber-500 text-amber-900 dark:text-amber-300 font-bold shadow-sm"
                                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                            }`}
                          >
                            <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-amber-600 dark:text-amber-400" : "text-slate-400"}`} />
                            <span className="text-[11px] leading-tight truncate">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Appliance Name Field (If 'Other' selected) */}
                  {applianceType === "سایر وسایل برقی (غیره)" && (
                    <div className="bg-amber-50/50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-800 animate-in fade-in">
                      <label className="block text-xs font-bold text-amber-900 dark:text-amber-300 mb-1">
                        نام وسیله برقی خود را بنویسید <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customApplianceName}
                        onChange={(e) => setCustomApplianceName(e.target.value)}
                        placeholder="مثال: اتو بخار، جاروبرقی، پلوپز، چای‌ساز، محافظ برق..."
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  )}

                  {/* Brand & Model */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      برند و مدل دستگاه (اختیاری)
                    </label>
                    <input
                      type="text"
                      value={brandModel}
                      onChange={(e) => setBrandModel(e.target.value)}
                      placeholder="مثال: پارس خزر مدل سانی / موتوژن تبریز ۳/۴ / هانی 4K"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Issue Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      شرح ایراد و مشکل فنی دستگاه <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={issueDesc}
                      onChange={(e) => setIssueDesc(e.target.value)}
                      placeholder="مثال: پنکه روشن نمی‌شود و بوی سوختگی می‌دهد / دور کند موتور کولر کار نمی‌کند / المنت بخاری قطع است..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                    />
                  </div>

                  {/* Photo Attachment (Optional) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      تصویر قطعه یا پلاک مشخصات دستگاه (اختیاری جهت برآورد دقیق‌تر)
                    </label>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />

                    {photoUrl ? (
                      <div className="relative inline-block border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden p-1 bg-slate-50 dark:bg-slate-800">
                        <img
                          src={photoUrl}
                          alt="پیش‌نمایش تصویر قطعه"
                          className="w-24 h-24 object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="absolute top-2 left-2 bg-rose-500 text-white rounded-full p-1 shadow-md hover:bg-rose-600"
                          title="حذف تصویر"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingPhoto}
                        className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 rounded-2xl p-4 text-center transition-colors flex flex-col items-center justify-center gap-1.5 bg-slate-50/50 dark:bg-slate-800/40"
                      >
                        <div className="w-9 h-9 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                          {uploadingPhoto ? (
                            <Clock className="w-4 h-4 animate-spin" />
                          ) : (
                            <Camera className="w-4 h-4" />
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {uploadingPhoto ? "در حال بارگذاری تصویر..." : "بارگذاری تصویر یا عکس از پلاک دستگاه"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          فرمت‌های مجاز: JPG, PNG, WEBP (حداکثر ۵ مگابایت)
                        </span>
                      </button>
                    )}

                    {photoError && (
                      <p className="text-[11px] text-rose-500 font-bold mt-1.5">{photoError}</p>
                    )}
                  </div>

                  {/* Delivery / Dropoff Method */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      روش تحویل کالا به کارگاه
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDeliveryType("in_person")}
                        className={`p-3 rounded-xl border text-right transition-all flex items-center gap-2 ${
                          deliveryType === "in_person"
                            ? "bg-amber-50 dark:bg-amber-950/80 border-amber-500 text-amber-900 dark:text-amber-300 font-bold"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <div>
                          <strong className="text-xs block">تحویل حضوری در شعبه</strong>
                          <span className="text-[10px] text-slate-400">آدرس: نجف‌آباد، خیابان قدس</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryType("courier")}
                        className={`p-3 rounded-xl border text-right transition-all flex items-center gap-2 ${
                          deliveryType === "courier"
                            ? "bg-amber-50 dark:bg-amber-950/80 border-amber-500 text-amber-900 dark:text-amber-300 font-bold"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <strong className="text-xs block">ارسال با پیک / اسنپ</strong>
                          <span className="text-[10px] text-slate-400">هماهنگی تحویل درب منزل</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? "در حال ثبت درخواست..." : "ثبت نهایی درخواست و دریافت کد رهگیری"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Col: Track Repair Status & Contact Box */}
          <div className="lg:col-span-5 space-y-6">
            {/* Tracking Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Search className="w-4 h-4 text-amber-500" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  استعلام و پیگیری وضعیت تعمیرات
                </h3>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                شماره موبایل ثبت‌شده هنگام پذیرش یا کد رهگیری تعمیرات خود را وارد نمایید:
              </p>

              <form onSubmit={handleTrack} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={trackCode}
                    onChange={(e) => setTrackCode(e.target.value)}
                    placeholder="مثال: 0913... یا REP-1403..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-left"
                  />
                  <button
                    type="submit"
                    disabled={trackingLoading}
                    className="bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shrink-0 transition-colors disabled:opacity-50"
                  >
                    {trackingLoading ? "..." : "استعلام"}
                  </button>
                </div>

                {trackError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl space-y-2">
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{trackError}</span>
                    </p>
                    {isOrderCode && (
                      <Link
                        href={`/order-tracking/${encodeURIComponent(toEnglishDigits(trackCode.trim()).toUpperCase())}`}
                        className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-lg transition-all shadow-sm"
                      >
                        <span>انتقال به بخش پیگیری سفارشات کالا ↗</span>
                      </Link>
                    )}
                  </div>
                )}
              </form>

              {/* Tracking Result View */}
              {trackResult && (
                <div className="mt-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {trackResult.applianceType} {trackResult.brandModel ? `(${trackResult.brandModel})` : ""}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 dir-ltr">
                      {trackResult.trackingCode}
                    </span>
                  </div>

                  {/* Visual Lifecycle Stepper */}
                  <div className="py-2">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-3">
                      مراحل پیشرفت فرآیند تعمیر:
                    </span>
                    <div className="relative flex items-center justify-between">
                      {/* Connecting Line */}
                      <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-700 -z-0" />
                      
                      {stepsList.map((step, idx) => {
                        const currentIdx = getStepIndex(trackResult.status);
                        const isDone = idx < currentIdx;
                        const isCurrent = idx === currentIdx;
                        const StepIcon = step.icon;

                        return (
                          <div key={step.label} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-sm ${
                                isDone
                                  ? "bg-emerald-600 text-white"
                                  : isCurrent
                                  ? "bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 font-black scale-110"
                                  : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                              }`}
                            >
                              {isDone ? <Check className="w-3.5 h-3.5" /> : <StepIcon className="w-3.5 h-3.5" />}
                            </div>
                            <span
                              className={`text-[9px] mt-1.5 text-center font-medium ${
                                isCurrent
                                  ? "text-amber-600 dark:text-amber-400 font-bold"
                                  : isDone
                                  ? "text-emerald-700 dark:text-emerald-400 font-medium"
                                  : "text-slate-400"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Details Summary */}
                  <div className="space-y-2 text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">وضعیت فعلی:</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                        trackResult.status === "COMPLETED" || trackResult.status === "DELIVERED"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : trackResult.status === "REPAIRING"
                          ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300"
                      }`}>
                        {trackResult.status === "SUBMITTED" && "درخواست ثبت شد - در نوبت تحویل"}
                        {trackResult.status === "RECEIVED" && "پذیرش شد - در نوبت عیب‌یابی"}
                        {trackResult.status === "INSPECTING" && "در حال بررسی فنی و کارشناسی"}
                        {trackResult.status === "REPAIRING" && "در حال تعمیر و تعویض قطعه"}
                        {trackResult.status === "COMPLETED" && "تعمیر تکمیل شد - آماده تحویل"}
                        {trackResult.status === "DELIVERED" && "تحویل به مشتری گردید"}
                      </span>
                    </div>

                    {trackResult.estimatedCost && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">برآورد هزینه:</span>
                        <span className="font-bold text-slate-950 dark:text-amber-400 font-mono">
                          {formatToman(trackResult.estimatedCost)}
                        </span>
                      </div>
                    )}

                    {attachedPhoto && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">عکس ضمیمه‌شده:</span>
                        <a
                          href={attachedPhoto}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-600 dark:text-amber-400 hover:underline font-bold text-[11px]"
                        >
                          مشاهده تصویر قطعه ↗
                        </a>
                      </div>
                    )}

                    {trackResult.adminNotes && !trackResult.adminNotes.startsWith("[تصویر ضمیمه]:") && (
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                        <strong className="block text-slate-900 dark:text-white mb-0.5">گزارش کارشناس تعمیرگاه:</strong>
                        {trackResult.adminNotes}
                      </div>
                    )}

                    {/* Direct WhatsApp Follow-up */}
                    <a
                      href={`https://wa.me/989162665884?text=${encodeURIComponent(
                        `سلام، پیگیری وضعیت تعمیر دستگاه ${trackResult.applianceType} با کد رهگیری ${trackResult.trackingCode}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>پیگیری مستقیم این پرونده در واتساپ</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Workshop Phone & WhatsApp Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-lg space-y-4">
              <div className="space-y-1">
                <span className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  واحد پذیرش و هماهنگی تعمیرات:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  جهت هماهنگی ارسال با اسنپ یا مشاوره حضوری می‌توانید با شماره مستقیم کارگاه تماس بگیرید:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                <a
                  href="tel:09162665884"
                  className="bg-slate-800 hover:bg-slate-700 text-amber-300 p-2.5 rounded-xl border border-slate-700 block font-bold"
                >
                  ۰۹۱۶-۲۶۶-۵۸۸۴
                </a>
                <a
                  href={`tel:${brand.rawPhone || "03142624567"}`}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2.5 rounded-xl border border-slate-700 block font-bold"
                >
                  {brand.phone}
                </a>
              </div>

              <a
                href={`https://wa.me/989162665884?text=${encodeURIComponent("سلام، برای تعمیر وسیله برقی در کارگاه شیاسی پیام می‌دهم.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>پیام در واتساپ واحد تعمیرات</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
