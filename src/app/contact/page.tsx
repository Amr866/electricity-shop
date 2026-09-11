"use client";

import React, { useState, useEffect } from "react";
import { useBrand } from "@/context/BrandContext";
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  Send,
  MessageCircle,
  CheckCircle2,
  Building,
  Truck,
  Sparkles,
  Navigation,
  Copy,
  Check,
  ExternalLink,
  Map,
  Compass,
} from "lucide-react";
import { ConsultationBanner } from "@/components/home/ConsultationBanner";

function toEnglishDigits(str: string): string {
  if (!str) return "";
  return str
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .trim();
}

const STORE_GEO = {
  lat: 32.6365457,
  lng: 51.3551911,
  addressFa: "اصفهان، نجف‌آباد، ۱۵ خرداد مرکزی، نبش بن‌بست نرگس (فروشگاه شیاسی)",
  phoneLandline: "۰۳۱-۴۲۶۲۶۱۱۶",
  rawLandline: "03142626116",
  phoneLandline2: "۰۳۱-۴۲۶۲۶۱۰۷",
  rawLandline2: "03142626107",
  mobileWorkshop: "۰۹۱۳-۶۲۶-۰۰۷۲",
  rawMobile: "09136260072",
  // Map App Deep Links
  neshanUrl: "https://neshan.org/maps/places/vbZnI32x4clP",
  baladUrl: "https://balad.ir/location?latitude=32.6365457&longitude=51.3551911",
  googleMapsUrl: "https://maps.app.goo.gl/cXf7MouMBVSPUKDo9",
  snappUrl: "https://app.snapp.taxi",
};

export default function ContactPage() {
  const { brand } = useBrand();
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("استعلام قیمت و خرید سیم و تجهیزات");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isOpenNow, setIsOpenNow] = useState(true);

  // Calculate live store open/closed status (Tehran Time)
  // شنبه تا چهارشنبه: ۸:۳۰ الی ۱۳:۰۰ و ۱۶:۳۰ الی ۲۱:۰۰ | پنجشنبه: ۸:۳۰ الی ۱۳:۰۰ | جمعه: تعطیل
  useEffect(() => {
    const checkStoreStatus = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const iranTime = new Date(utc + 3600000 * 3.5);
      const day = iranTime.getDay(); // 0: Sunday, 4: Thursday, 5: Friday, 6: Saturday
      const hour = iranTime.getHours() + iranTime.getMinutes() / 60;

      // جمعه تعطیل
      if (day === 5) {
        setIsOpenNow(false);
        return;
      }
      // پنجشنبه فقط شیفت صبح: ۸:۳۰ الی ۱۳:۰۰
      if (day === 4) {
        setIsOpenNow(hour >= 8.5 && hour < 13);
        return;
      }
      // شنبه تا چهارشنبه: ۸:۳۰ الی ۱۳:۰۰ و ۱۶:۳۰ الی ۲۱:۰۰
      setIsOpenNow((hour >= 8.5 && hour < 13) || (hour >= 16.5 && hour < 21));
    };

    checkStoreStatus();
    const interval = setInterval(checkStoreStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyText = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;

    setSubmitted(true);
    setTimeout(() => {
      setName("");
      setPhone("");
      setMessage("");
      setSubmitted(false);
    }, 4000);
  };

  // Direct WhatsApp Inquiry from Form
  const handleSendViaWhatsApp = () => {
    if (!name.trim() || !message.trim()) {
      alert("لطفاً نام و متن پیام خود را وارد نمایید.");
      return;
    }

    const cleanPhone = toEnglishDigits(phone);
    const msg = `سلام و احترام، پیام استعلام از سایت فروشگاه شیاسی:\n\n👤 فرستنده: ${name}\n📞 شماره تماس: ${cleanPhone || "ثبت نشده"}\n📌 موضوع: ${subject}\n\n📝 متن پیام:\n${message}`;

    window.open(`https://wa.me/989136260072?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-xs font-black px-3.5 py-1 rounded-full border border-amber-300 dark:border-amber-700 shadow-2xs">
            <Building className="w-3.5 h-3.5" />
            <span>شعبه مرکزی و کارگاه تخصصی نجف‌آباد</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            تماس و نشانی فروشگاه و کارگاه شیاسی
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            پاسخگویی به سوالات فنی، صدور پیش‌فاکتور رسمی، پذیرش تعمیرات و پیگیری سفارشات در نجف‌آباد، اصفهان و سراسر کشور
          </p>
        </div>

        {/* Main Grid: Contact Info Cards + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Col on RTL (Desktop Span 5): Contact Info, 1-Click Copy & Multi-App Nav */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-5 text-slate-900 dark:text-white">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                <h2 className="font-black text-sm sm:text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>اطلاعات تماس و نشانی دقیق فروشگاه</span>
                </h2>

                {/* Live Store Open / Closed Status Pill */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                    isOpenNow
                      ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                      : "bg-rose-50 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isOpenNow ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                    }`}
                  />
                  <span>{isOpenNow ? "هم‌اکنون فروشگاه باز است" : "فروشگاه بسته است"}</span>
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                
                {/* Address Card with 1-Click Copy */}
                <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-750 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                    <span>نشانی شعبه مرکزی نجف‌آباد:</span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(STORE_GEO.addressFa, "address")}
                      className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 hover:underline text-[10px] font-bold"
                      title="کپی آدرس"
                    >
                      {copiedField === "address" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-600 dark:text-emerald-400">آدرس کپی شد!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>کپی آدرس</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-slate-900 dark:text-white font-medium leading-relaxed">
                    {STORE_GEO.addressFa}
                  </p>
                </div>

                {/* 3 Phone Cards with 1-Click Copy & Direct Calling */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-755">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1">
                      <span>تلفن ۱ فروشگاه:</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(STORE_GEO.rawLandline, "phone")}
                        className="text-slate-400 hover:text-amber-600"
                        title="کپی شماره"
                      >
                        {copiedField === "phone" ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <a
                      href={`tel:${STORE_GEO.rawLandline}`}
                      className="font-black text-slate-900 dark:text-amber-400 text-xs sm:text-sm font-mono hover:text-amber-600 block dir-ltr text-right"
                    >
                      {STORE_GEO.phoneLandline}
                    </a>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-755">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1">
                      <span>تلفن ۲ فروشگاه:</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(STORE_GEO.rawLandline2, "phone2")}
                        className="text-slate-400 hover:text-amber-600"
                        title="کپی شماره"
                      >
                        {copiedField === "phone2" ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <a
                      href={`tel:${STORE_GEO.rawLandline2}`}
                      className="font-black text-slate-900 dark:text-amber-400 text-xs sm:text-sm font-mono hover:text-amber-600 block dir-ltr text-right"
                    >
                      {STORE_GEO.phoneLandline2}
                    </a>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-755">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1">
                      <span>همراه و واتساپ:</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(STORE_GEO.rawMobile, "mobile")}
                        className="text-slate-400 hover:text-emerald-500"
                        title="کپی شماره"
                      >
                        {copiedField === "mobile" ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <a
                      href={`tel:${STORE_GEO.rawMobile}`}
                      className="font-black text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-mono hover:text-emerald-500 block dir-ltr text-right"
                    >
                      {STORE_GEO.mobileWorkshop}
                    </a>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-750 flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong className="text-slate-900 dark:text-white block font-bold text-xs">ساعات کاری فروشگاه و کارگاه:</strong>
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 block leading-relaxed font-medium">
                      شنبه تا چهارشنبه: ۸:۳۰ الی ۱۳:۰۰ و ۱۶:۳۰ الی ۲۱:۰۰
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                      پنج‌شنبه‌ها: ۸:۳۰ الی ۱۳:۰۰ (شیفت عصر تعطیل) • جمعه‌ها: تعطیل
                    </span>
                  </div>
                </div>
              </div>

              {/* Multi-App Navigation Picker */}
              <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                  مسیریابی مستقیم با اپلیکیشن‌های نقشه:
                </span>
                
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={STORE_GEO.neshanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 hover-glow"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>نشان</span>
                  </a>

                  <a
                    href={STORE_GEO.baladUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-900 dark:text-white font-bold text-xs py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
                  >
                    <Map className="w-3.5 h-3.5 text-blue-500" />
                    <span>بلد</span>
                  </a>

                  <a
                    href={STORE_GEO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-900 dark:text-white font-bold text-xs py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
                  >
                    <Navigation className="w-3.5 h-3.5 text-rose-500" />
                    <span>گوگل‌مپ</span>
                  </a>
                </div>

                <a
                  href={`https://wa.me/989136260072?text=%D8%B3%D9%84%D8%A7%D9%85%D8%8C%20%D8%AC%D9%87%D8%AA%20%D9%85%D8%B4%D8%A7%D9%88%D8%B1%D9%87%20%D9%88%20%D8%A7%D8%B3%D8%AA%D8%B9%D9%84%D8%A7%D9%85%20%D9%BE%DB%8C%D8%A7%D9%85%20%D9%85%DB%8C%E2%80%8C%D8%AF%D9%87%D9%85`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3 rounded-xl text-center flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-98 hover-glow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>گفتگو و استعلام قیمت در واتساپ (۰۹۱۳۶۲۶۰۰۷۲)</span>
                </a>
              </div>
            </div>

            {/* Express Delivery Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-slate-800 space-y-2 shadow-md">
              <span className="text-amber-400 font-black text-xs flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                تحویل سریع در سراسر نجف‌آباد، اصفهان و کشور
              </span>
              <p className="text-xs leading-relaxed text-slate-300 font-medium">
                پیمانکاران و مشتریان عزیز در نجف‌آباد و اصفهان می‌توانند پس از ثبت سفارش، مرسوله خود را در همان روز توسط اسنپ‌باکس یا پیک اختصاصی تحویل بگیرند.
              </p>
            </div>
          </div>

          {/* Right Col on RTL (Desktop Span 7): Interactive Inquiry Form & Embedded Map */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Form Box */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-5 text-slate-900 dark:text-white">
              <h2 className="font-black text-base border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-500" />
                <span>ارسال پیام مستقیم به کارشناسان فروشگاه شیاسی</span>
              </h2>

              {submitted ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-6 text-center space-y-2 text-emerald-950 dark:text-emerald-300 animate-in fade-in zoom-in-98 duration-300">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <h3 className="font-black text-sm">پیام شما با موفقیت ثبت شد!</h3>
                  <p className="text-xs text-emerald-800 dark:text-emerald-400 font-medium">
                    کارشناسان فنی فروشگاه در اسرع وقت با شماره تماس شما ارتباط برقرار خواهند کرد.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        نام و نام خانوادگی <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="مثال: مهندس کاظمی"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        شماره همراه <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="۰۹۱۳..."
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 text-left font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      موضوع استعلام
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    >
                      <option value="استعلام قیمت و خرید سیم و تجهیزات">استعلام قیمت و خرید سیم و تجهیزات</option>
                      <option value="مشاوره پروژه‌های ساختمانی و صنعتی">مشاوره پروژه‌های ساختمانی و صنعتی</option>
                      <option value="درخواست پیش‌فاکتور رسمی با مهر">درخواست پیش‌فاکتور رسمی با مهر</option>
                      <option value="پیگیری مرسوله پستی / پیک">پیگیری مرسوله پستی / پیک در نجف‌آباد و اصفهان</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      متن پیام یا لیست اقلام مورد نیاز <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="متن پیام خود یا متراژ کابل و تعداد کلید و پریزهای مورد نیاز را بنویسید..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed font-medium"
                    />
                  </div>

                  {/* Dual Submit Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="submit"
                      className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-98 hover-glow"
                    >
                      <Send className="w-4 h-4" />
                      <span>ثبت پیام در سامانه</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSendViaWhatsApp}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-98 hover-glow"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>ارسال آنی به واتساپ</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Google Maps Visual Box */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  موقعیت ثبت شده فروشگاه شیاسی در نقشه:
                </span>
                <a
                  href={STORE_GEO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline"
                >
                  مشاهده تمام‌صفحه در Google Maps ↗
                </a>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-[16/7] relative bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <iframe
                  title="Google Maps Location - Shiasi Store"
                  src={`https://maps.google.com/maps?q=${STORE_GEO.lat},${STORE_GEO.lng}&hl=fa&z=17&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Dedicated Technical Consultation Banner */}
        <ConsultationBanner />

      </div>
    </div>
  );
}
