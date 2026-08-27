"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Layers,
  Plug,
} from "lucide-react";

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
  const [submitting, setSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState<any>(null);

  // Tracking State
  const [trackCode, setTrackCode] = useState("");
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackResult, setTrackResult] = useState<any>(null);
  const [trackError, setTrackError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !issueDesc) return;

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
          customerPhone,
          applianceType: finalApplianceType,
          brandModel,
          issueDesc,
          deliveryType,
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
    if (!trackCode.trim()) return;

    setTrackingLoading(true);
    setTrackError("");
    setTrackResult(null);

    try {
      const res = await fetch(`/api/repairs?phone=${encodeURIComponent(trackCode)}`);
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
                <span className="text-[11px] text-slate-400 dark:text-slate-500">شعبه نجف‌آباد</span>
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

                  <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 inline-block text-center space-y-1">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">کد رهگیری پذیرش تعمیرات شما:</span>
                    <strong className="text-xl font-mono font-black text-emerald-700 dark:text-amber-400 block">
                      {ticketResult.trackingCode}
                    </strong>
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
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">{trackError}</p>
                )}
              </form>

              {/* Tracking Result View */}
              {trackResult && (
                <div className="mt-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {trackResult.applianceType} {trackResult.brandModel ? `(${trackResult.brandModel})` : ""}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      {trackResult.trackingCode}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">وضعیت فعلی:</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                        trackResult.status === "COMPLETED"
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
                        <span className="font-bold text-slate-900 dark:text-amber-400">
                          {formatToman(trackResult.estimatedCost)}
                        </span>
                      </div>
                    )}

                    {trackResult.technicianNotes && (
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                        <strong className="block text-slate-900 dark:text-white mb-0.5">گزارش کارشناس تعمیرگاه:</strong>
                        {trackResult.technicianNotes}
                      </div>
                    )}
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
                  href={`tel:${brand.phone.replace(/\D/g, "")}`}
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
