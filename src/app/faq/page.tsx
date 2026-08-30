"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  ChevronDown,
  Zap,
  Wrench,
  Truck,
  ShieldCheck,
  Phone,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Fan,
  FileSpreadsheet,
} from "lucide-react";

interface FAQItem {
  id: string;
  category: "cables" | "repairs" | "shipping" | "warranty";
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  // 1. سیم و کابل استاندارد مس
  {
    id: "cable-1",
    category: "cables",
    question: "آیا سیم‌ها و کابل‌های عرضه‌شده در فروشگاه شیاسی ۱۰۰٪ مس خالص هستند؟",
    answer:
      "بله، تمامی سیم‌ها و کابل‌های ساختمانی و صنعتی عرضه‌شده در فروشگاه شیاسی از مس آنیل‌شده با خلوص ۹۹.۹٪ (استاندارد کلاس ۵ افشان و کلاس ۱ مفتول) تولید شده و دارای نشان استاندارد ملی ایران و تاییدیه توانیر می‌باشند. ما هیچ‌گونه کابل آلومینیومی با روکش مس (CCA) تقلبی عرضه نمی‌کنیم.",
  },
  {
    id: "cable-2",
    category: "cables",
    question: "آیا امکان خرید سیم و کابل به صورت متری یا خرد وجود دارد یا فقط کلاف ۱۰۰ متری؟",
    answer:
      "برای کابل‌های ضخیم صنعتی (نظیر کابل‌های ۱۰، ۱۶ و ۲۵ میلی‌متر)، امکان برش متری دقیق بر اساس نیاز پروژه فراهم است. سیم‌های ساختمانی نازک‌تر (۱.۵ و ۲.۵) عموماً در قالب کلاف‌های پلمپ ۱۰۰ متری کارخانه با برچسب اصالت عرضه می‌شوند.",
  },
  {
    id: "cable-3",
    category: "cables",
    question: "برای سیم‌کشی کولر آبی و پنکه چه سایز کابلی توصیه می‌شود؟",
    answer:
      "برای کولرهای آبی تا ۷۰۰۰، استاندارد مهندسی کابل ۴ رشته یا ۵ رشته با مقطع ۱.۵ میلی‌متر مربع (کابل ۴x۱.۵ یا ۵x۱.۵ فویل‌دار) است تا علاوه بر تحمل جریان راه‌اندازی الکتروموتور، پمپ آب و کلید راه‌انداز به صورت ایمن تغذیه شوند.",
  },
  {
    id: "cable-4",
    category: "cables",
    question: "تفاوت سیم افشان (انعطاف‌پذیر) با سیم مفتولی (خشک) در چیست؟",
    answer:
      "سیم افشان از رشته‌های نازک مس به هم تابیده تشکیل شده و بسیار منعطف است که برای لوله‌کشی‌های پرپیچ‌وخم ساختمانی و سیم‌کشی لوازم خانگی کاربرد دارد. سیم مفتول از یک رشته مس یکپارچه تشکیل شده و برای تابلوهای برق و کابل‌کشی‌های ثابت زمینی استفاده می‌شود.",
  },

  // 2. کارگاه تعمیرات تخصصی
  {
    id: "repair-1",
    category: "repairs",
    question: "شرایط و مهلت تست خدمات تعمیرات و سیم‌پیچی کارگاه شیاسی چگونه است؟",
    answer:
      "کلیه خدمات تعمیراتی (تعویض بوش و بلبرینگ، تعویض شفت، تعویض خازن راه‌انداز و سیم‌پیچی تمام‌مس موتور کولر و پنکه) دارای ۷ روز مهلت تست فنی و گارانتی کارکرد پس از تحویل می‌باشند.",
  },
  {
    id: "repair-2",
    category: "repairs",
    question: "علت کم شدن دور پنکه یا صدای ویزویز آن چیست و چطور تعمیر می‌شود؟",
    answer:
      "معمولاً خشک شدن روغن نمدی بوش‌ها، سوختن یا کاهش ظرفیت خازن راه‌انداز (۱.۵ الی ۲.۵ میکروفاراد) یا ساییدگی بلبرینگ‌ها عامل افت دور پنکه است. در کارگاه شیاسی نجف‌آباد، بوش‌ها و خازن‌ها با قطعات شرکتی تعویض و روان‌کاری تخصصی انجام می‌شود.",
  },
  {
    id: "repair-3",
    category: "repairs",
    question: "هزینه تعمیر قبل از شروع به مشتری اعلام می‌شود؟",
    answer:
      "بله، پس از پذیرش و عیب‌یابی دقیق دستگاه در کارگاه مرکزی نجف‌آباد، کارشناسان فنی هزینه قطعات و اجرت را تلفنی به شما اعلام می‌کنند و فرآیند تعمیر تنها با تایید و رضایت شما آغاز می‌گردد.",
  },
  {
    id: "repair-4",
    category: "repairs",
    question: "آیا امکان ارسال موتور کولر یا پنکه از سایر شهرهای استان اصفهان وجود دارد؟",
    answer:
      "بله، مشتریان محترم از اصفهان، تیران، خمینی‌شهر، فلاورجان و سراسر استان می‌توانند دستگاه معیوب را با هماهنگی از طریق اسنپ‌باکس یا تیپاکس به کارگاه شیاسی ارسال فرمایند.",
  },

  // 3. ارسال و لجستیک
  {
    id: "ship-1",
    category: "shipping",
    question: "سفارشات در نجف‌آباد و اصفهان چگونه و با چه سرعتی ارسال می‌شوند؟",
    answer:
      "سفارشات درون‌شهری نجف‌آباد ظرف کمتر از ۲ الی ۴ ساعت کاری با پیک اختصاصی تحویل داده می‌شوند. برای شهر اصفهان و حومه، ارسال با پیک اکسپرس و برای سایر شهرستان‌ها با تیپاکس، باربری و پست پیشتاز انجام می‌گردد.",
  },
  {
    id: "ship-2",
    category: "shipping",
    question: "شرایط ارسال رایگان فاکتور چگونه است؟",
    answer:
      "سفارش‌های با مبلغ فاکتور بالاتر از ۲,۰۰۰,۰۰۰ تومان در شهر نجف‌آباد و حومه به صورت کاملاً رایگان ارسال می‌گردند.",
  },

  // 4. گارانتی و تسویه
  {
    id: "war-1",
    category: "warranty",
    question: "آیا امکان دریافت پیش‌فاکتور و فاکتور رسمی شرکتی با کد اقتصادی وجود دارد؟",
    answer:
      "بله، در مرحله تسویه حساب با فعال کردن گزینه «خرید شرکتی و حقوقی»، پیش‌فاکتور معتبر رسمی به همراه شناسه ملی و کد اقتصادی صادر می‌گردد.",
  },
  {
    id: "war-2",
    category: "warranty",
    question: "رویه ۷ روزه بازگشت کالا در صورت عدم رضایت یا مغایرت چیست؟",
    answer:
      "در صورت وجود هرگونه نقص فنی اولیه یا مغایرت مشخصات، خریدار تا ۷ روز فرصت دارد کالا را در بسته‌بندی اولیه مرجوع کند تا وجه پرداختی ظرف ۲۴ ساعت عودت داده شود.",
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [openIds, setOpenIds] = useState<string[]>(["cable-1", "repair-1", "repair-2"]);

  const toggleFAQ = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((item) => {
      const matchCat = activeCategory === "ALL" || item.category === activeCategory;
      const matchSearch =
        !search ||
        item.question.toLowerCase().includes(search.toLowerCase()) ||
        item.answer.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        
        {/* Header Hero - Balanced Light & Dark Mode */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl relative overflow-hidden transition-all duration-300">
          
          {/* Ambient Amber Glow Background */}
          <div className="absolute -top-12 right-1/2 translate-x-1/2 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/25 relative z-10">
            <HelpCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2 relative z-10">
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
              سوالات متداول و راهنمای مشتریان
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
              پاسخ جامع به پرسش‌های پرتکرار پیرامون اصالت کابل مس، عیب‌یابی پنکه و کولر، زمان‌بندی ارسال و گارانتی
            </p>
          </div>

          {/* Live Search Bar with High Contrast in Both Modes */}
          <div className="relative max-w-lg mx-auto pt-2 relative z-10">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو در سوالات (مثال: سیم مس، پنکه، موتور کولر، فاکتور، ارسال)..."
              className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm rounded-2xl pr-11 pl-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-400 absolute right-4 top-6 pointer-events-none" />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 text-xs font-bold">
          {[
            { id: "ALL", label: "همه سوالات", icon: HelpCircle },
            { id: "cables", label: "سیم و کابل مس", icon: Zap },
            { id: "repairs", label: "کارگاه تعمیرات", icon: Wrench },
            { id: "shipping", label: "ارسال و لجستیک", icon: Truck },
            { id: "warranty", label: "گارانتی و فاکتور", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2.5 rounded-2xl border transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  isSelected
                    ? "bg-amber-500 text-slate-950 border-amber-500 font-black shadow-md shadow-amber-500/20"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-500/50 shadow-xs"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-slate-950" : "text-amber-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-sm">
              <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">سوالی با این عبارت یافت نشد</h3>
              <p className="text-xs text-slate-500">می‌توانید با پشتیبانی کارگاه و فروشگاه شیاسی تماس حاصل فرمایید.</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className={`bg-white dark:bg-slate-900 rounded-3xl border transition-all duration-200 shadow-sm overflow-hidden ${
                    isOpen
                      ? "border-amber-500/60 dark:border-amber-500/40 shadow-md shadow-amber-500/5"
                      : "border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full p-5 sm:p-6 text-right flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition-colors"
                  >
                    <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 transition-colors ${isOpen ? "bg-amber-500 shadow-xs shadow-amber-500/50" : "bg-slate-300 dark:bg-slate-600"}`} />
                      <span>{faq.question}</span>
                    </span>

                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isOpen
                          ? "rotate-180 text-amber-500 bg-amber-500/10 dark:bg-amber-500/20"
                          : "text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in duration-200">
                      <div className="bg-amber-50/40 dark:bg-slate-850/80 p-4 sm:p-5 rounded-2xl border border-amber-200/40 dark:border-slate-800 leading-loose">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Contact Assistance Box - Harmonious in Light & Dark Mode */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center sm:text-right">
            <h3 className="font-black text-sm text-white flex items-center justify-center sm:justify-start gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>پاسخ سوال خود را پیدا نکردید؟</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              کارشناسان فنی کارگاه و فروشگاه شیاسی نجف‌آباد در ساعات کاری آماده راهنمایی شما هستند.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:03142624567"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>۰۳۱-۴۲۶۲۴۵۶۷</span>
            </a>

            <Link
              href="/contact"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              فرم تماس و آدرس
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
