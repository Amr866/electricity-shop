"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  Building,
  Tag,
  Percent,
  Search,
  CheckCircle2,
  Calendar,
  Phone,
  MessageCircle,
  ExternalLink,
  Filter,
} from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

interface PriceList {
  id: string;
  brand: string;
  category: string;
  title: string;
  description: string;
  date: string;
  contractorDiscount: string;
  fileSize: string;
  pdfUrl: string;
  badgeColor: string;
}

const FACTORY_PRICE_LISTS: PriceList[] = [
  {
    id: "motogen-1403",
    brand: "موتوژن تبریز (Motogen)",
    category: "موتور کولر و الکتروموتور",
    title: "لیست قیمت رسمی انواع موتور کولر آبی و صنعتی موتوژن تبریز",
    description: "شامل کدهای ۱/۳، ۱/۲ و ۳/۴ اسب بخار با خازن راه‌انداز و سیم‌پیچی ۱۰۰٪ مس",
    date: "شهریور ۱۴۰۳",
    contractorDiscount: "۸٪ الی ۱۲٪ تخفیف همکاری",
    fileSize: "۱.۴ مگابایت",
    pdfUrl: "#",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  },
  {
    id: "parskhazar-1403",
    brand: "پارس خزر (Pars Khazar)",
    category: "پنکه و لوازم خانگی برقی",
    title: "کاتالوگ و لیست قیمت مصوب پنکه‌های ایستاده، رومیزی و دیواری",
    description: "قیمت‌های مصوب شرکتی مدل‌های شیبا، آدو، ریمو و اتو بخار با گارانتی ۲۴ ماهه",
    date: "مرداد ۱۴۰۳",
    contractorDiscount: "۵٪ الی ۹٪ تخفیف نقدی",
    fileSize: "۲.۸ مگابایت",
    pdfUrl: "#",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  },
  {
    id: "alborz-wire-1403",
    brand: "البرز الکتریک نور (Alborz)",
    category: "سیم و کابل تمام مس",
    title: "لیست قیمت رسمی سیم‌های افشان ساختمانی و کابل‌های مفتولی",
    description: "سایزهای ۱.۵، ۲.۵، ۴، ۶ و ۱۰ میلیمتر تمام مس آنیل شده کلاف ۱۰۰ متری",
    date: "شهریور ۱۴۰۳ (به‌روزرسانی هفتگی مس)",
    contractorDiscount: "تخفیف نقدی پای فاکتور بر اساس متراژ",
    fileSize: "۹۵۰ کیلوبایت",
    pdfUrl: "#",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  {
    id: "shahcheragh-1403",
    brand: "صنایع روشنایی شاهچراغ",
    category: "روشنایی و پنل‌های LED",
    title: "لیست قیمت انواع پنل‌های سنسوردار هوشمند، پروژکتور و SMD",
    description: "مدل‌های روکار و توکار روژان، پرتو و پروژکتورهای خورشیدی با ضمانت تعویض",
    date: "مرداد ۱۴۰۳",
    contractorDiscount: "۱۵٪ تخفیف تابلوساز و پیمانکار",
    fileSize: "۳.۲ مگابایت",
    pdfUrl: "#",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "afratab-1403",
    brand: "صنایع روشنایی افراتاب (Afratab)",
    category: "لامپ و چراغ‌های فوق کم‌مصرف",
    title: "لیست قیمت انواع لامپ‌های حبابی، استوانه‌ای و هالوژنی افراتاب",
    description: "شامل توان‌های ۹ تا ۸۰ وات E27 و E40 با هیت‌سینک آلومینیومی و ۱۸ ماه گارانتی",
    date: "شهریور ۱۴۰۳",
    contractorDiscount: "۱۲٪ تخفیف کارتنی و خرید عمده",
    fileSize: "۱.۱ مگابایت",
    pdfUrl: "#",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  },
  {
    id: "hani-antenna-1403",
    brand: "آنتن هانی (Hani)",
    category: "آنتن تلویزیون و تقویت‌کننده",
    title: "لیست قیمت رسمی آنتن‌های هوایی چرخشی، برقی و کابل‌های کواکسیال هانی",
    description: "به همراه راهنمای تنظیم گیرندگی و مشخصات تقویت‌کننده‌های نویز پایین (LNA)",
    date: "تیر ۱۴۰۳",
    contractorDiscount: "۱۰٪ تخفیف الکتریکی و همکار",
    fileSize: "۱.۸ مگابایت",
    pdfUrl: "#",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  },
];

export default function PriceListsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredLists = FACTORY_PRICE_LISTS.filter((item) => {
    const matchesSearch =
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || item.category.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-amber-500/30 shadow-2xl relative overflow-hidden space-y-4">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold">
              <FileText className="w-3.5 h-3.5" />
              <span>مرکز اسناد و لیست‌های قیمت رسمی کارخانجات</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white">
              دانلود لیست قیمت رسمی کارخانجات با درصد تخفیف همکاری
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              جهت رفاه حال برقکاران، تابلوسازان و همکاران محترم نجف‌آباد و استان اصفهان، آخرین کاتالوگ‌ها و لیست قیمت‌های مصوب شرکتی به صورت منظم و روزآمد در این بخش منتشر می‌گردد.
            </p>
          </div>

          <a
            href="https://wa.me/989131112233?text=%D8%B3%D9%84%D8%A7%D9%85%D8%8C%20%D8%AC%D9%87%D8%AA%20%D8%A7%D8%B3%D8%AA%D8%B9%D9%84%D8%A7%D9%85%20%D9%82%DB%8C%D9%85%D8%AA%20%D9%87%D9%85%DA%A9%D8%A7%D8%B1%DB%8C%20%D9%88%20%D8%B5%D8%AF%D9%88%D8%B1%20%D9%BE%DB%8C%D8%B4%E2%80%8C%D9%81%D8%A7%DA%A9%D8%AA%D9%88%D8%B1%20%D9%BE%DB%8C%D8%A7%D9%85%20%D9%85%DB%8C%E2%80%8C%D8%AF%D9%87%D9%85."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 shrink-0 transition-all active:scale-95 hover-glow"
          >
            <MessageCircle className="w-4 h-4" />
            <span>استعلام قیمت همکار در واتساپ</span>
          </a>
        </div>

        {/* Search and Category Filter Row */}
        <div className="relative z-10 pt-4 grid grid-cols-1 sm:grid-cols-12 gap-3 border-t border-slate-800">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو بر اساس نام کارخانه، برند یا نوع کالا (مثال: موتوژن، سیم و کابل، پارس خزر)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
            >
              <option value="all">همه دسته‌بندی‌ها</option>
              <option value="موتور کولر">موتور کولر و پمپ</option>
              <option value="پنکه">پنکه و لوازم خانگی</option>
              <option value="سیم و کابل">سیم و کابل استاندارد</option>
              <option value="روشنایی">روشنایی و LED</option>
              <option value="آنتن">آنتن و تجهیزات تصویر</option>
            </select>
          </div>
        </div>
      </div>

      {/* Price Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLists.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Brand and Category Badges */}
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border ${item.badgeColor}`}>
                  {item.brand}
                </span>
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {item.date}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                {item.description}
              </p>

              {/* Contractor Discount Notice */}
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium">تخفیف همکار:</span>
                <strong className="text-amber-700 dark:text-amber-300 font-bold">
                  {item.contractorDiscount}
                </strong>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                حجم فایل: {item.fileSize}
              </span>

              <button
                onClick={() => {
                  window.print();
                }}
                className="bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95 hover-glow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>دانلود PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Contractor Callout Banner */}
      <div className="bg-slate-50 dark:bg-slate-900/80 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
        <div className="space-y-1">
          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
            نیاز به استعلام پیش‌فاکتور برای مناقصات و پروژه‌های ساختمانی دارید؟
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            لیست اقلام خود را در واتساپ یا بخش آپلود BOM بارگذاری فرمایید تا ظرف حداکثر ۲ ساعت پیش‌فاکتور رسمی صادر گردد.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/bom-upload"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            بارگذاری فایل اقلام (BOM)
          </Link>
          <a
            href="tel:03142624567"
            className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            تماس با واحد فروش
          </a>
        </div>
      </div>
    </div>
  );
}
