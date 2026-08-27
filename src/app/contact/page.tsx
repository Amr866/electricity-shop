"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("استعلام قیمت و خرید");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName("");
      setPhone("");
      setMessage("");
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
            <Building className="w-3.5 h-3.5" />
            <span>شعبه مرکزی اصفهان</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            تماس با فروشگاه کالای برق نقش جهان
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            پاسخگویی به سوالات فنی، صدور پیش‌فاکتور رسمی و پیگیری سفارشات در شهر اصفهان
          </p>
        </div>

        {/* Main Grid: Contact Info Cards + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Col: Contact Info & Address */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>اطلاعات تماس و نشانی فروشگاه</span>
              </h2>

              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-bold block">نشانی شعبه اصفهان:</span>
                  <p className="text-slate-900 font-medium leading-relaxed">
                    اصفهان، خیابان فردوسی، نرسیده به چهارراه فلسطین، روبروی بانک ملی، پلاک ۱۲۸
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 font-bold block mb-1">تلفن ثابت:</span>
                    <a href="tel:03132204567" className="font-bold text-slate-900 text-sm persian-numbers hover:text-amber-600">
                      ۰۳۱-۳۲۲۰۴۵۶۷
                    </a>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 font-bold block mb-1">موبایل / پشتیبانی:</span>
                    <a href="tel:09131112233" className="font-bold text-emerald-700 text-sm persian-numbers hover:text-emerald-800">
                      ۰۹۱۳-۱۱۱-۲۲۳۳
                    </a>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                  <div>
                    <strong className="text-slate-900 block">ساعات کاری فروشگاه:</strong>
                    <span className="text-[11px] text-slate-500">
                      شنبه تا چهارشنبه ۸:۳۰ الی ۲۱:۰۰ | پنجشنبه‌ها ۸:۳۰ الی ۱۸:۰۰
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp/Eitaa buttons */}
              <div className="pt-2 flex gap-2">
                <a
                  href="https://wa.me/989131112233"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>پیام در واتساپ</span>
                </a>
                <a
                  href="https://eitaa.com/naghshejahan_bargh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-3 rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>کانال ایتا</span>
                </a>
              </div>
            </div>

            {/* Isfahan Express Delivery Card */}
            <div className="bg-emerald-950 text-emerald-100 rounded-3xl p-6 border border-emerald-800 space-y-2">
              <span className="text-amber-400 font-extrabold text-xs flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                تحویل سریع در شهر اصفهان
              </span>
              <p className="text-xs leading-relaxed text-slate-300">
                پیمانکاران و مشتریان عزیز در شهر اصفهان می‌توانند پس از ثبت سفارش، مرسوله خود را در کمتر از ۳ ساعت توسط اسنپ‌باکس یا پیک ویژه تحویل بگیرند.
              </p>
            </div>
          </div>

          {/* Right Col: Interactive Contact / Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <h2 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-500" />
                <span>ارسال پیام مستقیم به کارشناسان فروشگاه</span>
              </h2>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2 text-emerald-900">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="font-extrabold text-sm">پیام شما با موفقیت دریافت شد!</h3>
                  <p className="text-xs text-emerald-700">
                    کارشناسان الکتریک نقش جهان در اسرع وقت با شماره تماس شما تماس خواهند گرفت.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        نام و نام خانوادگی <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="مثال: مهندس کاظمی"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        شماره همراه <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="۰۹۱۳..."
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-left font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      موضوع استعلام
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    >
                      <option value="استعلام قیمت و خرید">استعلام قیمت و خرید سیم و تجهیزات</option>
                      <option value="مشاوره پروژه‌های ساختمانی و صنعتی">مشاوره پروژه‌های ساختمانی و صنعتی</option>
                      <option value="درخواست پیش‌فاکتور رسمی">درخواست پیش‌فاکتور رسمی با مهر</option>
                      <option value="پیگیری مرسوله پستی / پیک">پیگیری مرسوله پستی / پیک در اصفهان</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      متن پیام یا لیست اقلام مورد نیاز <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="متن پیام خود یا متراژ کابل و تعداد کلید و پریزهای مورد نیاز را بنویسید..."
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>ارسال پیام استعلام</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
