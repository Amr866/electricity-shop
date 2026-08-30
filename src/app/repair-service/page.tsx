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
  Navigation,
  Activity,
  Layers,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

function toEnglishDigits(str: string): string {
  if (!str) return "";
  return str
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .trim();
}

export interface RepairTicketData {
  id: string;
  trackingCode: string;
  customerName: string;
  customerPhone: string;
  applianceType: string;
  brandModel?: string | null;
  issueDesc: string;
  deliveryType: string;
  status: string;
  photoUrl?: string | null;
  createdAt: Date;
}

export interface RepairTrackData {
  id: string;
  trackingCode: string;
  customerName: string;
  customerPhone: string;
  applianceType: string;
  brandModel?: string | null;
  issueDesc: string;
  deliveryType: string;
  status: string;
  estimatedCost?: number | null;
  adminNotes?: string | null;
  photoUrl?: string | null;
  createdAt: string;
}

// 1. Common Quick Symptom Tags per Appliance Category
const COMMON_ISSUE_TAGS: Record<string, string[]> = {
  "پنکه": [
    "روشن نمی‌شود",
    "بوی سوختگی می‌دهد",
    "عدم چرخش و گیرپژ شفت",
    "باد بسیار ضعیف و کند",
    "لرزش شدید و صدای ناهنجار",
    "خرابی کلید یا ریموت",
  ],
  "کولر آبی": [
    "موتور دود می‌کند و داغ می‌شود",
    "دور کند کار نمی‌کند",
    "دور تند استارت نمی‌زند",
    "پمپ آب سوخته و پمپاژ ندارد",
    "صدای ساییدگی بوش و بلبرینگ",
    "اتصالی و پریدن فیوز برق",
  ],
  "بخاری برقی": [
    "المنت‌ها گرم نمی‌شوند",
    "سیم‌کشی و دوشاخه آب شده",
    "کلید ترموستات قطع نمی‌کند",
    "فن بخاری کار نمی‌کند",
    "جرقه زدن سوئیچ اطمینان",
  ],
  "آنتن و دیجیتال": [
    "سیگنال ضعیف و شطرنجی تصویر",
    "بوستر آنتن روشن نمی‌شود",
    "منبع تغذیه ۱۲ ولت سوخته",
    "شکستگی فیزیکی شاخک‌ها",
  ],
  "برد الکترونیکی": [
    "خاموشی کامل مدار و سوختن فیوز",
    "باد کردن خازن‌ها",
    "سوختگی آی‌سی پاور و رگولاتور",
    "قطع و وصل مداوم رله خروجی",
  ],
  "سایر وسایل برقی (غیره)": [
    "دستگاه کاملاً خاموش است",
    "قطع و اتصالی کابل برق",
    "بوی سوختگی قطعات داخلی",
    "افت شدید توان و راندمان",
    "شکستگی بوش، چرخ‌دنده یا شفت",
  ],
};

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
  const [ticketResult, setTicketResult] = useState<RepairTicketData | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Tracking State
  const [trackCode, setTrackCode] = useState("");
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackResult, setTrackResult] = useState<RepairTrackData | null>(null);
  const [trackError, setTrackError] = useState("");
  const [isOrderCode, setIsOrderCode] = useState(false);

  // Quick symptom tag handler
  const handleToggleSymptomTag = (tag: string) => {
    if (!issueDesc.trim()) {
      setIssueDesc(tag);
      return;
    }
    if (issueDesc.includes(tag)) {
      return; // Already present
    }
    setIssueDesc((prev) => `${prev.trim()} • ${tag}`);
  };

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
    } catch {
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
        setTicketResult(data.ticket);
        setCustomerName("");
        setCustomerPhone("");
        setBrandModel("");
        setIssueDesc("");
        setPhotoUrl(null);
      } else {
        alert(data.error || "خطا در ثبت درخواست تعمیرات.");
      }
    } catch {
      alert("خطا در برقراری ارتباط با سرور.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackCode.trim()) return;

    const normalizedInput = toEnglishDigits(trackCode.trim()).toUpperCase();
    setTrackingLoading(true);
    setTrackError("");
    setTrackResult(null);
    setIsOrderCode(false);

    try {
      const res = await fetch(`/api/repairs?code=${encodeURIComponent(normalizedInput)}`);
      const data = await res.json();

      if (res.ok && data.success && data.ticket) {
        setTrackResult(data.ticket);
      } else {
        setTrackError(data.error || "درخواست تعمیری با این کد یا شماره تماس یافت نشد.");
        if (data.isOrderCode) {
          setIsOrderCode(true);
        }
      }
    } catch {
      setTrackError("خطا در برقراری ارتباط با سرور پیگیری.");
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

  const currentSymptomTags = COMMON_ISSUE_TAGS[applianceType] || COMMON_ISSUE_TAGS["سایر وسایل برقی (غیره)"];
  const attachedPhoto = trackResult?.photoUrl || trackResult?.adminNotes?.match(/\[تصویر ضمیمه\]:\s*(\S+)/)?.[1];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-xs font-black px-3.5 py-1 rounded-full border border-amber-300 dark:border-amber-700 shadow-2xs">
            <Wrench className="w-3.5 h-3.5" />
            <span>کارگاه فنی مهندسی شیاسی در نجف‌آباد</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            خدمات و کارگاه تعمیرات تخصصی لوازم برقی
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            تعمیر و عیب‌یابی تخصصی انواع پنکه، موتور کولر آبی، بخاری برقی، آنتن، چای‌ساز، اتو، جاروبرقی، محافظ و سایر وسایل برقی در نجف‌آباد اصفهان با ضمانت کارکرد
          </p>
        </div>

        {/* 4 Feature Badges with 60fps Hover Lift */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <div className="group bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3 hover:-translate-y-1 hover:border-amber-400/80 transition-all duration-300">
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                قطعات یدکی اورجینال
              </strong>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">سیم‌پیچی ۱۰۰٪ مس و قطعات اصلی</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3 hover:-translate-y-1 hover:border-emerald-400/80 transition-all duration-300">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                تحویل فوری ۲۴ تا ۴۸ ساعته
              </strong>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">تست بارداری و نهایی در کارگاه</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3 hover:-translate-y-1 hover:border-blue-400/80 transition-all duration-300">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                پیک دریافت و ارسال
              </strong>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">در سراسر نجف‌آباد و حومه</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3 hover:-translate-y-1 hover:border-purple-400/80 transition-all duration-300">
            <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                مهلت تست پس از تعمیر
              </strong>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">تضمین کیفیت و کارکرد کالا</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Symmetric Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Right Col on RTL (Desktop Span 7): New Ticket Request Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                <h2 className="font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-500" />
                  <span>ثبت آنلاین درخواست عیب‌یابی و تعمیر کالا</span>
                </h2>
                <span className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-lg border border-amber-300/60 dark:border-amber-800 font-bold">
                  شعبه مرکزی نجف‌آباد
                </span>
              </div>

              {ticketResult ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-6 text-center space-y-4 text-emerald-950 dark:text-emerald-300 animate-in fade-in zoom-in-98 duration-300">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="font-black text-lg">درخواست شما با موفقیت در کارگاه ثبت شد!</h3>
                    <p className="text-xs text-emerald-800 dark:text-emerald-400 font-medium">
                      کارشناسان کارگاه شیاسی جهت هماهنگی دریافت کالا به زودی با شما تماس می‌گیرند.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 inline-flex flex-col items-center gap-2 shadow-sm">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                      کد رهگیری پذیرش تعمیرات شما:
                    </span>
                    <div className="flex items-center gap-2">
                      <strong className="text-2xl font-mono font-black text-emerald-700 dark:text-amber-400 dir-ltr">
                        {ticketResult.trackingCode}
                      </strong>
                      <button
                        type="button"
                        onClick={() => handleCopyTrackingCode(ticketResult.trackingCode)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90"
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
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                        کد با موفقیت کپی شد!
                      </span>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setTicketResult(null)}
                      className="text-xs font-black text-emerald-800 dark:text-amber-400 hover:underline"
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
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
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
                            className={`p-3 rounded-2xl border text-right transition-all flex items-center gap-2 active:scale-98 ${
                              isSelected
                                ? "bg-amber-50 dark:bg-amber-950/80 border-amber-500 text-amber-950 dark:text-amber-300 font-bold shadow-sm shadow-amber-500/10 scale-102"
                                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
                            }`}
                          >
                            <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-amber-600 dark:text-amber-400" : "text-slate-400"}`} />
                            <span className="text-[11px] leading-tight truncate font-bold">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Appliance Name Field (If 'Other' selected) */}
                  {applianceType === "سایر وسایل برقی (غیره)" && (
                    <div className="bg-amber-50/50 dark:bg-amber-950/30 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-800 animate-in fade-in">
                      <label className="block text-xs font-bold text-amber-900 dark:text-amber-300 mb-1">
                        نام وسیله برقی خود را بنویسید <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customApplianceName}
                        onChange={(e) => setCustomApplianceName(e.target.value)}
                        placeholder="مثال: اتو بخار، جاروبرقی، پلوپز، چای‌ساز، محافظ برق..."
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
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
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  {/* Issue Description + Quick Symptom Tags */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      شرح ایراد و مشکل فنی دستگاه <span className="text-rose-500">*</span>
                    </label>

                    {/* Quick Symptom Tag Pills */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">
                        انتخاب سریع علائم خرابی (کلیک جهت درج در متن):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentSymptomTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleToggleSymptomTag(tag)}
                            className="bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-300 border border-amber-300/70 dark:border-amber-700/60 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all active:scale-95 hover-glow flex items-center gap-1"
                          >
                            <span>+</span>
                            <span>{tag}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      required
                      rows={3}
                      value={issueDesc}
                      onChange={(e) => setIssueDesc(e.target.value)}
                      placeholder="مثال: پنکه روشن نمی‌شود و بوی سوختگی می‌دهد / دور کند موتور کولر کار نمی‌کند..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed font-medium"
                    />
                  </div>

                  {/* Photo Attachment (Next.js Image) */}
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
                      <div className="relative inline-block border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden p-1 bg-slate-50 dark:bg-slate-800 shadow-sm">
                        <div className="relative w-28 h-28 rounded-xl overflow-hidden">
                          <Image
                            src={photoUrl}
                            alt="پیش‌نمایش تصویر قطعه"
                            fill
                            className="object-cover"
                            sizes="112px"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="absolute top-2 left-2 bg-rose-500 text-white rounded-full p-1 shadow-md hover:bg-rose-600 active:scale-90 transition-transform"
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
                        className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 rounded-2xl p-4 text-center transition-all flex flex-col items-center justify-center gap-1.5 bg-slate-50/50 dark:bg-slate-800/40 active:scale-99"
                      >
                        <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-2xs">
                          {uploadingPhoto ? (
                            <Clock className="w-4.5 h-4.5 animate-spin" />
                          ) : (
                            <Camera className="w-4.5 h-4.5" />
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

                  {/* Delivery / Dropoff Method + Map Picker Link */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      روش تحویل کالا به کارگاه
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDeliveryType("in_person")}
                        className={`p-3.5 rounded-2xl border text-right transition-all flex items-start gap-2.5 active:scale-98 ${
                          deliveryType === "in_person"
                            ? "bg-amber-50 dark:bg-amber-950/80 border-amber-500 text-amber-950 dark:text-amber-300 font-bold shadow-sm"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-xs block font-bold">تحویل حضوری در شعبه</strong>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                            اصفهان، نجف‌آباد، خیابان قدس
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryType("courier")}
                        className={`p-3.5 rounded-2xl border text-right transition-all flex items-start gap-2.5 active:scale-98 ${
                          deliveryType === "courier"
                            ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-950 dark:text-emerald-300 font-bold shadow-sm"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-xs block font-bold">ارسال با پیک / اسنپ</strong>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                            هماهنگی دریافت کالا درب منزل
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* Navigation Map Action */}
                    {deliveryType === "in_person" && (
                      <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs animate-in fade-in">
                        <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">مسیریابی به فروشگاه و کارگاه:</span>
                        <div className="flex items-center gap-2">
                          <a
                            href="https://nshn.ir"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-lg transition-all"
                          >
                            مسیریابی در نشان ↗
                          </a>
                          <a
                            href="https://balad.ir"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[10px] px-2.5 py-1 rounded-lg transition-all"
                          >
                            بلد ↗
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98 hover-glow"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? "در حال ثبت درخواست..." : "ثبت نهایی درخواست و دریافت کد رهگیری"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Left Col on RTL (Desktop Span 5): Tracking Box + Workshop Contact + Capabilities Widget */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Tracking Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Search className="w-4 h-4 text-amber-500" />
                <h3 className="font-black text-sm text-slate-900 dark:text-white">
                  استعلام و پیگیری وضعیت تعمیرات
                </h3>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
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
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shrink-0 transition-all disabled:opacity-50 active:scale-95 shadow-sm"
                  >
                    {trackingLoading ? "..." : "استعلام"}
                  </button>
                </div>

                {trackError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl space-y-2 animate-in fade-in">
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

              {/* Tracking Result View with 60fps Stepper */}
              {trackResult && (
                <div className="mt-4 bg-slate-50 dark:bg-slate-850 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in zoom-in-98 duration-300">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-750">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {trackResult.applianceType} {trackResult.brandModel ? `(${trackResult.brandModel})` : ""}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 dir-ltr font-bold">
                      {trackResult.trackingCode}
                    </span>
                  </div>

                  {/* Visual Lifecycle Stepper */}
                  <div className="py-2">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-3">
                      مراحل پیشرفت فرآیند تعمیر:
                    </span>
                    <div className="relative flex items-center justify-between">
                      <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-750 -z-0" />
                      
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
                                  : "bg-slate-200 dark:bg-slate-750 text-slate-400"
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
                  <div className="space-y-2 text-xs pt-2 border-t border-slate-200 dark:border-slate-750">
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

            {/* 2. Direct Workshop Contact Card (Separated Call Badges) */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-md space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-black text-xs sm:text-sm">
                <Phone className="w-4 h-4" />
                <span>واحد پذیرش و هماهنگی تعمیرات شیاسی</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                جهت هماهنگی ارسال با اسنپ یا مشاوره فنی رایگان می‌توانید با شماره‌های کارگاه تماس بگیرید:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href="tel:03142624567"
                  className="bg-white/10 hover:bg-white/15 p-3 rounded-2xl border border-white/10 text-center transition-all active:scale-95"
                >
                  <span className="text-[10px] text-slate-400 block font-medium">تلفن کارگاه نجف‌آباد</span>
                  <strong className="text-xs font-mono font-bold text-amber-300 block mt-0.5">
                    ۰۳۱-۴۲۶۲۴۵۶۷
                  </strong>
                </a>

                <a
                  href="tel:09162665884"
                  className="bg-white/10 hover:bg-white/15 p-3 rounded-2xl border border-white/10 text-center transition-all active:scale-95"
                >
                  <span className="text-[10px] text-slate-400 block font-medium">همراه پذیرش مستقیم</span>
                  <strong className="text-xs font-mono font-bold text-emerald-400 block mt-0.5">
                    ۰۹۱۶-۲۶۶-۵۸۸۴
                  </strong>
                </a>
              </div>

              <a
                href="https://wa.me/989162665884?text=%D8%B3%D9%84%D8%A7%D9%85%D8%8C%20%D8%AC%D9%87%D8%AA%20%D9%85%D8%B4%D8%A7%D9%88%D8%B1%D9%87%20%D8%AA%D8%B9%D9%85%DB%8C%D8%B1%D8%A7%D8%AA%20%D9%BE%DB%8C%D8%A7%D9%85%20%D9%85%DB%8C%E2%80%8C%D8%AF%D9%87%D9%85"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-98 hover-glow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>پیام در واتساپ واحد تعمیرات</span>
              </a>
            </div>

            {/* 3. Workshop Capabilities & Equipment Widget (Balances Column Height) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-3.5">
              <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500" />
                <span>تجهیزات و توانمندی‌های کارگاه فنی شیاسی</span>
              </h4>

              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                  <Activity className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white text-xs block mb-0.5">تست بارداری و آمپراژ دینامیکی:</strong>
                    <span className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">تست دقیق زیر بار برای اطمینان از عدم داغ کردن سیم‌پیچ و کارکرد روان.</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                  <Cog className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white text-xs block mb-0.5">تراشکاری بوش و بالانس شفت:</strong>
                    <span className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">رفع کامل لنگی و ارتعاش موتورهای فن و کولر با بلبرینگ دور بالا.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
