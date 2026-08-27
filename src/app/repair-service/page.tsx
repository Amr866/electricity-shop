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
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
            <Wrench className="w-3.5 h-3.5" />
            <span>کارگاه فنی شیاسی در نجف‌آباد</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            خدمات و کارگاه تعمیرات تخصصی لوازم برقی
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            تعمیر و عیب‌یابی انواع پنکه، موتور کولر آبی، بخاری برقی، آنتن، چای‌ساز، اتو، جاروبرقی، محافظ و سایر وسایل برقی در نجف‌آباد اصفهان با ضمانت کارکرد
          </p>
        </div>

        {/* 4 Feature Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 block">قطعات یدکی اورجینال</strong>
              <span className="text-[11px] text-slate-400">سیم‌پیچی مس و قطعات اصلی</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 block">تحویل فوری ۲۴ تا ۴۸ ساعته</strong>
              <span className="text-[11px] text-slate-400">تست نهایی در کارگاه</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 block">پیک دریافت و ارسال</strong>
              <span className="text-[11px] text-slate-400">در سراسر نجف‌آباد و حومه</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 block">مهلت تست پس از تعمیر</strong>
              <span className="text-[11px] text-slate-400">تضمین کیفیت تعمیرات</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Submit Repair Form + Tracking Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Col: Request Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-500" />
                  <span>ثبت آنلاین درخواست عیب‌یابی و تعمیر کالا</span>
                </h2>
                <span className="text-[11px] text-slate-400">شعبه نجف‌آباد</span>
              </div>

              {ticketResult ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-4 text-emerald-950 animate-in fade-in">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="font-black text-lg text-emerald-900">
                      درخواست تعمیر شما با موفقیت ثبت شد!
                    </h3>
                    <p className="text-xs text-emerald-700">
                      کد رهگیری پذیرش کارگاه شما:
                    </p>
                    <div className="inline-block bg-white text-slate-900 font-mono font-black text-xl px-5 py-2 rounded-2xl border border-emerald-300 shadow-sm my-2">
                      {ticketResult.trackingCode}
                    </div>
                  </div>

                  <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                    می‌توانید دستگاه خود را به آدرس فروشگاه شیاسی در نجف‌آباد تحویل دهید یا جهت هماهنگی پیک با شماره ۰۹۱۶۲۶۶۵۸۸۴ تماس حاصل فرمایید.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <a
                      href={`https://wa.me/989131112233?text=${encodeURIComponent(
                        `سلام، درخواست تعمیر با کد رهگیری ${ticketResult.trackingCode} برای دستگاه ${ticketResult.applianceType} ثبت کردم.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>ارسال در واتساپ جهت بررسی سریع</span>
                    </a>

                    <button
                      onClick={() => setTicketResult(null)}
                      className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl"
                    >
                      ثبت درخواست جدید
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  
                  {/* Select Appliance Type Chips */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-2">
                      نوع دستگاه تعمیری را انتخاب کنید: <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {applianceOptions.map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setApplianceType(opt.value)}
                            className={`p-3 rounded-2xl border text-right transition-all flex items-center gap-2 ${
                              applianceType === opt.value
                                ? "bg-amber-50 border-amber-500 text-slate-950 font-bold ring-2 ring-amber-500/20"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <Icon className={`w-4 h-4 shrink-0 ${applianceType === opt.value ? "text-amber-600" : "text-slate-400"}`} />
                            <span className="truncate">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Conditional input when 'سایر وسایل برقی (غیره)' is selected */}
                  {applianceType === "سایر وسایل برقی (غیره)" && (
                    <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200 animate-in fade-in space-y-1">
                      <label className="block font-bold text-slate-800 mb-1">
                        نام یا نوع وسیله برقی خود را مشخص کنید: <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customApplianceName}
                        onChange={(e) => setCustomApplianceName(e.target.value)}
                        placeholder="مثلا: چای‌ساز، جاروبرقی، اتو بخار، محافظ برق، سشوار، دریل برقی، آبمیوه‌گیری..."
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">
                        نام و نام خانوادگی <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="مثال: علیرضا شیاسی"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">
                        شماره همراه مشتری <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="۰۹۱۳..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-amber-500 text-left font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      برند و مدل دستگاه (در صورت مشخص بودن)
                    </label>
                    <input
                      type="text"
                      value={brandModel}
                      onChange={(e) => setBrandModel(e.target.value)}
                      placeholder="مثلا: پارس خزر، فیلیپس، تفال، موتوژن، اخوان..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      شرح خرابی یا مشکل دستگاه <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={issueDesc}
                      onChange={(e) => setIssueDesc(e.target.value)}
                      placeholder="مثلا: روشن نمی‌شود، بوی سوختگی می‌دهد، داغ می‌کند، کلید قطع است، قطع و وصل می‌شود..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-amber-500 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      نحوه تحویل به کارگاه
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer ${deliveryType === "in_person" ? "bg-amber-50 border-amber-500 text-amber-950 font-bold" : "bg-slate-50 border-slate-200"}`}>
                        <input
                          type="radio"
                          name="delType"
                          value="in_person"
                          checked={deliveryType === "in_person"}
                          onChange={() => setDeliveryType("in_person")}
                        />
                        <span>تحویل حضوری در نجف‌آباد</span>
                      </label>

                      <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer ${deliveryType === "courier" ? "bg-amber-50 border-amber-500 text-amber-950 font-bold" : "bg-slate-50 border-slate-200"}`}>
                        <input
                          type="radio"
                          name="delType"
                          value="courier"
                          checked={deliveryType === "courier"}
                          onChange={() => setDeliveryType("courier")}
                        />
                        <span>ارسال با پیک در نجف‌آباد</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>{submitting ? "در حال ثبت..." : "ثبت درخواست تعمیر و دریافت کد پذیرش"}</span>
                  </button>

                </form>
              )}
            </div>
          </div>

          {/* Right Col: Track Repair Status + Workshop Contacts */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Tracking Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-500" />
                <span>پیگیری وضعیت تعمیر دستگاه پذیرش شده</span>
              </h3>

              <form onSubmit={handleTrack} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    شماره همراه ثبت شده هنگام پذیرش:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={trackCode}
                      onChange={(e) => setTrackCode(e.target.value)}
                      placeholder="۰۹۱۳..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-left font-mono"
                    />
                    <button
                      type="submit"
                      disabled={trackingLoading}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shrink-0"
                    >
                      {trackingLoading ? "..." : "استعلام"}
                    </button>
                  </div>
                </div>
              </form>

              {trackError && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  {trackError}
                </p>
              )}

              {trackResult && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-900">{trackResult.applianceType}</span>
                    <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                      {trackResult.status === "SUBMITTED"
                        ? "ثبت شده / در انتظار نوبت"
                        : trackResult.status === "IN_PROGRESS"
                        ? "در حال تعمیر در کارگاه"
                        : trackResult.status === "READY"
                        ? "آماده تحویل"
                        : "تحویل داده شده"}
                    </span>
                  </div>

                  <div className="text-slate-600">
                    <div>کد پذیرش: <strong className="font-mono text-slate-900">{trackResult.trackingCode}</strong></div>
                    <div>شرح مشکل: {trackResult.issueDesc}</div>
                    {trackResult.estimatedCost && (
                      <div className="text-emerald-700 font-bold mt-1">
                        برآورد هزینه: {formatToman(trackResult.estimatedCost)}
                      </div>
                    )}
                    {trackResult.adminNotes && (
                      <div className="bg-amber-50/70 p-2 rounded-lg border border-amber-200 text-amber-950 mt-2">
                        یادداشت کارشناس: {trackResult.adminNotes}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Workshop Address & Support Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <MapPin className="w-5 h-5" />
                <span>موقعیت کارگاه تعمیرات شیاسی</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                نجف‌آباد اصفهان، پذیرش انواع لوازم خانگی برقی، پنکه، موتور کولر، بخاری، آنتن، چای‌ساز، اتو، جاروبرقی، محافظ و بردهای الکترونیک.
              </p>

              <div className="space-y-2 text-xs text-slate-200 pt-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>تلفن کارگاه و پذیرش: <strong className="text-white persian-numbers">۰۹۱۶-۲۶۶-۵۸۸۴</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>تلفن ثابت فروشگاه: <strong className="text-white persian-numbers">۰۳۱-۴۲۶۲۴۵۶۷</strong></span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={brand.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3 rounded-xl text-center flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <MapPin className="w-4 h-4" />
                  <span>مسیریابی در گوگل‌مپ (نجف‌آباد)</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
