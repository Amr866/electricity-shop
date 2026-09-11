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
  Eye,
  X,
  FileSpreadsheet,
  FileDown,
  Sparkles,
  Zap,
  Layers,
  Check,
} from "lucide-react";
import { formatToman, toPersianDigits } from "@/lib/utils";

export interface CatalogItem {
  code: string;
  name: string;
  officialPrice: number;
  contractorPrice: number;
  unit: string;
}

export interface PriceList {
  id: string;
  brand: string;
  category: string;
  title: string;
  description: string;
  date: string;
  isWeeklyUpdated?: boolean;
  contractorDiscount: string;
  fileSize: string;
  badgeColor: string;
  items: CatalogItem[];
}

const FACTORY_PRICE_LISTS: PriceList[] = [
  {
    id: "motogen-1403",
    brand: "موتوژن تبریز (Motogen)",
    category: "موتور کولر",
    title: "لیست قیمت رسمی انواع موتور کولر آبی و صنعتی موتوژن تبریز",
    description: "شامل کدهای ۱/۳، ۱/۲ و ۳/۴ اسب بخار با خازن راه‌انداز و سیم‌پیچی ۱۰۰٪ مس",
    date: "شهریور ۱۴۰۳",
    isWeeklyUpdated: false,
    contractorDiscount: "۸٪ الی ۱۲٪ تخفیف همکاری",
    fileSize: "۱.۴ مگابایت",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    items: [
      { code: "MOT-34-CRS", name: "موتور کولر آبی ۳/۴ اسب موتوژن تبریز (CRS)", officialPrice: 4850000, contractorPrice: 4365000, unit: "دستگاه" },
      { code: "MOT-12-CSIR", name: "موتور کولر آبی ۱/۲ اسب موتوژن تبریز (CSIR)", officialPrice: 4200000, contractorPrice: 3820000, unit: "دستگاه" },
      { code: "MOT-13-SPL", name: "موتور کولر آبی ۱/۳ اسب موتوژن تبریز", officialPrice: 3750000, contractorPrice: 3410000, unit: "دستگاه" },
      { code: "MOT-PUMP-01", name: "الکتروپمپ آب کولر موتوژن دوار تمام مس", officialPrice: 680000, contractorPrice: 598000, unit: "عدد" },
    ],
  },
  {
    id: "parskhazar-1403",
    brand: "پارس خزر (Pars Khazar)",
    category: "پنکه و لوازم خانگی",
    title: "کاتالوگ و لیست قیمت مصوب پنکه‌های ایستاده، رومیزی و دیواری",
    description: "قیمت‌های مصوب شرکتی مدل‌های شیبا، آدو، ریمو و اتو بخار با گارانتی ۲۴ ماهه",
    date: "مرداد ۱۴۰۳",
    isWeeklyUpdated: false,
    contractorDiscount: "۵٪ الی ۹٪ تخفیف نقدی",
    fileSize: "۲.۸ مگابایت",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
    items: [
      { code: "PK-FAN-SHIBA", name: "پنکه ایستاده پارس خزر مدل شیبا با ریموت کنترل", officialPrice: 3450000, contractorPrice: 3174000, unit: "دستگاه" },
      { code: "PK-FAN-ADO", name: "پنکه رومیزی ۴ پره پارس خزر مدل آدو", officialPrice: 2280000, contractorPrice: 2097000, unit: "دستگاه" },
      { code: "PK-FAN-RIMO", name: "پنکه دیواری صنعتی پارس خزر مدل ریمو تایمردار", officialPrice: 3100000, contractorPrice: 2852000, unit: "دستگاه" },
      { code: "PK-BLADE-5B", name: "پره یدکی ۵ شاخه پنکه پارس خزر شفاف نشکن", officialPrice: 195000, contractorPrice: 175000, unit: "عدد" },
    ],
  },
  {
    id: "alborz-wire-1403",
    brand: "البرز الکتریک نور (Alborz)",
    category: "سیم و کابل",
    title: "لیست قیمت رسمی سیم‌های افشان ساختمانی و کابل‌های مفتولی",
    description: "سایزهای ۱.۵، ۲.۵، ۴، ۶ و ۱۰ میلیمتر تمام مس آنیل شده کلاف ۱۰۰ متری",
    date: "شهریور ۱۴۰۳",
    isWeeklyUpdated: true,
    contractorDiscount: "تخفیف نقدی پای فاکتور بر اساس متراژ",
    fileSize: "۹۵۰ کیلوبایت",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    items: [
      { code: "ALB-WIRE-15", name: "سیم افشان ۱.۵ تمام مس البرز الکتریک نور (کلاف ۱۰۰متر)", officialPrice: 1250000, contractorPrice: 1087000, unit: "کلاف" },
      { code: "ALB-WIRE-25", name: "سیم افشان ۲.۵ تمام مس البرز الکتریک نور (کلاف ۱۰۰متر)", officialPrice: 1980000, contractorPrice: 1722000, unit: "کلاف" },
      { code: "ALB-WIRE-40", name: "سیم افشان ۴ تمام مس البرز الکتریک نور", officialPrice: 3150000, contractorPrice: 2740000, unit: "کلاف" },
      { code: "ALB-CAB-2X15", name: "کابل افشان ۲ در ۱.۵ مس استاندارد البرز", officialPrice: 2850000, contractorPrice: 2479000, unit: "کلاف" },
    ],
  },
  {
    id: "shahcheragh-1403",
    brand: "صنایع روشنایی شاهچراغ",
    category: "روشنایی",
    title: "لیست قیمت انواع پنل‌های سنسوردار هوشمند، پروژکتور و SMD",
    description: "مدل‌های روکار و توکار روژان، پرتو و پروژکتورهای خورشیدی با ضمانت تعویض",
    date: "مرداد ۱۴۰۳",
    isWeeklyUpdated: false,
    contractorDiscount: "۱۵٪ تخفیف تابلوساز و پیمانکار",
    fileSize: "۳.۲ مگابایت",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    items: [
      { code: "SHC-PNL-6060", name: "پنل سقفی ۶۰ در ۶۰ شاهچراغ ۶۰ وات توکار SMD", officialPrice: 790000, contractorPrice: 671500, unit: "عدد" },
      { code: "SHC-PRJ-100", name: "پروژکتور ۱۰۰ وات ال‌ای‌دی ضدآب شاهچراغ (IP66)", officialPrice: 1150000, contractorPrice: 977500, unit: "عدد" },
      { code: "SHC-SNS-RAD", name: "چراغ سنسوردار سقفی هوشمند راداری شاهچراغ", officialPrice: 340000, contractorPrice: 289000, unit: "عدد" },
    ],
  },
  {
    id: "afratab-1403",
    brand: "صنایع روشنایی افراتاب (Afratab)",
    category: "روشنایی",
    title: "لیست قیمت انواع لامپ‌های حبابی، استوانه‌ای و هالوژنی افراتاب",
    description: "شامل توان‌های ۹ تا ۸۰ وات E27 و E40 با هیت‌سینک آلومینیومی و ۱۸ ماه گارانتی",
    date: "شهریور ۱۴۰۳",
    isWeeklyUpdated: false,
    contractorDiscount: "۱۲٪ تخفیف کارتنی و خرید عمده",
    fileSize: "۱.۱ مگابایت",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
    items: [
      { code: "AFR-LED-20W", name: "لامپ ال‌ای‌دی ۲۰ وات حبابی افراتاب پایه E27", officialPrice: 145000, contractorPrice: 127600, unit: "عدد" },
      { code: "AFR-LED-50W", name: "لامپ ال‌ای‌دی ۵۰ وات استوانه‌ای سالنی افراتاب", officialPrice: 395000, contractorPrice: 347600, unit: "عدد" },
      { code: "AFR-HLG-7W", name: "لامپ هالوژنی ۷ وات SMD افراتاب پایه سوزنی", officialPrice: 58000, contractorPrice: 51000, unit: "عدد" },
    ],
  },
  {
    id: "hani-antenna-1403",
    brand: "آنتن هانی (Hani)",
    category: "آنتن و تصویر",
    title: "لیست قیمت رسمی آنتن‌های هوایی چرخشی، برقی و کابل‌های کواکسیال هانی",
    description: "به همراه راهنمای تنظیم گیرندگی و مشخصات تقویت‌کننده‌های نویز پایین (LNA)",
    date: "تیر ۱۴۰۳",
    isWeeklyUpdated: false,
    contractorDiscount: "۱۰٪ تخفیف الکتریکی و همکار",
    fileSize: "۱.۸ مگابایت",
    badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
    items: [
      { code: "HNI-ANT-2020", name: "آنتن برقی گردان هانی مدل 2020 همراه با بوستر تقویت‌کننده", officialPrice: 650000, contractorPrice: 585000, unit: "دستگاه" },
      { code: "HNI-ANT-4K", name: "آنتن دیجیتال هوایی ثابت هانی مناسب گیرنده 4K", officialPrice: 420000, contractorPrice: 378000, unit: "دستگاه" },
      { code: "HNI-CAB-RG6", name: "کابل کواکسیال صادراتی RG6 تمام مس هانی (حلقه ۱۰۰متری)", officialPrice: 1350000, contractorPrice: 1215000, unit: "حلقه" },
    ],
  },
];

const CATEGORY_TABS = [
  { id: "all", label: "همه دسته‌بندی‌ها" },
  { id: "موتور کولر", label: "موتور کولر و پمپ" },
  { id: "سیم و کابل", label: "سیم و کابل مس" },
  { id: "پنکه و لوازم خانگی", label: "پنکه و خانگی" },
  { id: "روشنایی", label: "روشنایی LED" },
  { id: "آنتن و تصویر", label: "آنتن و دیجیتال" },
];

export default function PriceListsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activePreviewCatalog, setActivePreviewCatalog] = useState<PriceList | null>(null);

  const filteredLists = FACTORY_PRICE_LISTS.filter((item) => {
    const matchesSearch =
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || item.category.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const handleDownloadCsv = (catalog: PriceList) => {
    let csvContent = "کد فنی,نام کالا,قیمت مصوب شرکتی (تومان),قیمت همکار (تومان),واحد\n";
    catalog.items.forEach((item) => {
      csvContent += `${item.code},${item.name},${item.officialPrice},${item.contractorPrice},${item.unit}\n`;
    });

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `لیست-قیمت-${catalog.brand.replace(/\s+/g, "-")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-amber-500/30 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-black">
                <FileText className="w-3.5 h-3.5" />
                <span>مرکز اسناد و لیست‌های قیمت رسمی کارخانجات</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                دانلود لیست قیمت رسمی کارخانجات با درصد تخفیف همکاری
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                جهت رفاه حال برقکاران، تابلوسازان و همکاران محترم نجف‌آباد و استان اصفهان، آخرین کاتالوگ‌ها و لیست قیمت‌های مصوب شرکتی به صورت منظم و روزآمد منتشر می‌گردد.
              </p>
            </div>

            <a
              href="https://wa.me/989136260072?text=%D8%B3%D9%84%D8%A7%D9%85%D8%8C%20%D8%AC%D9%87%D8%AA%20%D8%A7%D8%B3%D8%AA%D8%B9%D9%84%D8%A7%D9%85%20%D9%82%DB%8C%D9%85%D8%AA%20%D9%87%D9%85%DA%A9%D8%A7%D8%B1%DB%8C%20%D9%88%20%D8%B5%D8%AF%D9%88%D8%B1%20%D9%BE%DB%8C%D8%B4%E2%80%8C%D9%81%D8%A7%DA%A9%D8%AA%D9%88%D8%B1%20%D9%BE%DB%8C%D8%A7%D9%85%20%D9%85%DB%8C%E2%80%8C%D8%AF%D9%87%D9%85."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 shrink-0 transition-all active:scale-95 hover-glow"
            >
              <MessageCircle className="w-4 h-4" />
              <span>استعلام قیمت همکار در واتساپ (۰۹۱۳۶۲۶۰۰۷۲)</span>
            </a>
          </div>

          {/* Search Bar */}
          <div className="relative z-10 pt-2">
            <div className="relative max-w-2xl">
              <Search className="w-4 h-4 text-slate-400 absolute right-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو بر اساس نام کارخانه، برند یا نوع کالا (مثال: موتوژن، سیم البرز، پارس خزر)..."
                className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pr-11 pl-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Horizontal Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isSelected = selectedCategory === tab.id;
            const count =
              tab.id === "all"
                ? FACTORY_PRICE_LISTS.length
                : FACTORY_PRICE_LISTS.filter((i) => i.category.includes(tab.id)).length;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 active:scale-95 ${
                  isSelected
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-102 font-black"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isSelected
                      ? "bg-slate-950/20 text-slate-950"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {toPersianDigits(count)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Price Lists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLists.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
              <p className="font-bold text-sm text-slate-700 dark:text-slate-300">هیچ لیست قیمتی مطابق با جستجوی شما یافت نشد.</p>
              <p className="text-xs text-slate-400 font-medium">می‌توانید عبارت جستجو یا فیلتر دسته‌بندی را تغییر دهید.</p>
            </div>
          ) : (
            filteredLists.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl hover:border-amber-400 dark:hover:border-amber-500 transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1 group"
              >
                <div className="space-y-3">
                  {/* Brand and Category Badges + Weekly Pulse */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-xl border ${item.badgeColor}`}>
                      {item.brand}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                      {item.isWeeklyUpdated && (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md border border-emerald-300/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>به‌روزرسانی هفتگی</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {item.date}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-black text-sm text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {item.description}
                  </p>

                  {/* Contractor Discount Notice */}
                  <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60 flex items-center justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-300 font-bold">تخفیف همکاری:</span>
                    <strong className="text-amber-800 dark:text-amber-300 font-black">
                      {item.contractorDiscount}
                    </strong>
                  </div>
                </div>

                {/* Actions: Preview Modal + Brand WhatsApp Inquiry + CSV Download */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>حجم فایل: {item.fileSize}</span>
                    <span>{toPersianDigits(item.items.length)} ردیف کالای شاخص</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setActivePreviewCatalog(item)}
                      className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-500" />
                      <span>مشاهده جدول قیمت</span>
                    </button>

                    <a
                      href={`https://wa.me/989136260072?text=${encodeURIComponent(
                        `سلام، جهت استعلام درصد تخفیف همکاری و موجودی لیست قیمت ${item.brand} پیام می‌دهم.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>استعلام در واتساپ</span>
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Contractor Callout Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm dark:shadow-xl text-center sm:text-right">
          <div className="space-y-1 max-w-xl">
            <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
              نیاز به استعلام پیش‌فاکتور برای مناقصات و پروژه‌های ساختمانی دارید؟
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              لیست اقلام خود را در واتساپ یا بخش خرید گروهی BOM بارگذاری فرمایید تا ظرف حداکثر ۲ ساعت پیش‌فاکتور رسمی صادر گردد.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Link
              href="/bom-upload"
              className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-5 py-3 rounded-xl transition-all shadow-md shadow-amber-500/20 text-center active:scale-95 hover-glow"
            >
              بارگذاری فایل اقلام (BOM)
            </Link>
            <a
              href="tel:03142626116"
              className="flex-1 sm:flex-none bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold px-4 py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center"
            >
              تماس: ۰۳۱-۴۲۶۲۶۱۱۶
            </a>
          </div>
        </div>

      </div>

      {/* Catalog Price Preview Modal */}
      {activePreviewCatalog && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-3xl w-full rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${activePreviewCatalog.badgeColor}`}>
                  {activePreviewCatalog.brand}
                </span>
                <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white mt-1">
                  {activePreviewCatalog.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePreviewCatalog(null)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Discount Summary Alert */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-2xl border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>تخفیف همکاری مصوب: {activePreviewCatalog.contractorDiscount}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">تاریخ مصوبه: {activePreviewCatalog.date}</span>
            </div>

            {/* Items Table */}
            <div className="overflow-y-auto flex-1 rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black border-b border-slate-200 dark:border-slate-700 sticky top-0">
                  <tr>
                    <th className="p-3">کد کالا</th>
                    <th className="p-3">شرح محصول</th>
                    <th className="p-3 text-center">قیمت مصوب</th>
                    <th className="p-3 text-center text-amber-600 dark:text-amber-400">قیمت همکار</th>
                    <th className="p-3 text-center">واحد</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                  {activePreviewCatalog.items.map((it) => (
                    <tr key={it.code} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-bold text-slate-500 text-[11px] dir-ltr text-right">{it.code}</td>
                      <td className="p-3 font-bold">{it.name}</td>
                      <td className="p-3 text-center font-mono line-through text-slate-400 text-[11px]">{formatToman(it.officialPrice)}</td>
                      <td className="p-3 text-center font-mono font-black text-emerald-600 dark:text-amber-400">{formatToman(it.contractorPrice)}</td>
                      <td className="p-3 text-center text-slate-400 text-[11px]">{it.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 gap-3">
              <button
                type="button"
                onClick={() => handleDownloadCsv(activePreviewCatalog)}
                className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>دانلود اکسل کاتالوگ (CSV)</span>
              </button>

              <a
                href={`https://wa.me/989136260072?text=${encodeURIComponent(
                  `سلام، استعلام قیمت همکاری برای لیست ${activePreviewCatalog.brand}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>استعلام مستقیم در واتساپ</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
