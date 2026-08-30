import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Fan,
  Zap,
  SunMedium,
  Cpu,
  ChevronLeft,
  Search,
  Wrench,
  Calculator,
  FileSpreadsheet,
  FileText,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Package,
  Layers,
  Flame,
  ShieldCheck,
  Truck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "دسته‌بندی‌های کالا و قطعات | فروشگاه تخصصی شیاسی نجف‌آباد",
  description:
    "مشاهده و دسترسی سریع به دسته‌بندی‌های تخصصی انواع موتور کولر، پنکه، بخاری برقی، سیم و کابل استاندارد مس، روشنایی LED و بردهای آردوینو.",
};

const categories = [
  {
    id: "cooling-heating",
    title: "موتور کولر، پنکه و تجهیزات گرمایشی",
    subtitle: "تأمین موتور موتوژن، قطعات یدکی پنکه ریموت‌دار، پمپ آب و المنت",
    icon: Fan,
    href: "/products?category=home-appliances-cooling-heating",
    color: "amber",
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    border: "border-amber-200 dark:border-amber-800/80 hover:border-amber-500",
    badge: "پرفروش‌ترین فصل",
    brands: ["موتوژن تبریز", "الکتروژن", "پارس خزر", "البرز"],
    subcategories: [
      { name: "موتور کولر آبی (۱/۳، ۱/۲، ۳/۴)", href: "/products?category=home-appliances-cooling-heating&q=موتور" },
      { name: "قطعات یدکی و پروانه پنکه", href: "/products?category=home-appliances-cooling-heating&q=پنکه" },
      { name: "پمپ آب کولر و کلیدهای هوشمند", href: "/products?category=home-appliances-cooling-heating&q=پمپ" },
      { name: "المنت و کلید بخاری برقی", href: "/products?category=home-appliances-cooling-heating&q=بخاری" },
      { name: "خازن، بوش و بلبرینگ موتور", href: "/products?category=home-appliances-cooling-heating&q=خازن" },
    ],
  },
  {
    id: "wiring-cables",
    title: "سیم، کابل استاندارد مس و آنتن دیجیتال",
    subtitle: "سیم‌های افشان ساختمانی تمام مس، کابل‌های شیلددار، کواکسیال و آنتن هانی",
    icon: Zap,
    href: "/products?category=wiring-building",
    color: "blue",
    gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
    border: "border-blue-200 dark:border-blue-800/80 hover:border-blue-500",
    badge: "۱۰۰٪ مس استاندارد",
    brands: ["سیمیا", "خراسان افشارنژاد", "هانی", "رسانا"],
    subcategories: [
      { name: "سیم تک‌رشته ساختمانی (۱.۵ و ۲.۵)", href: "/products?category=wiring-building&q=سیم" },
      { name: "کابل افشان و کابل کولری", href: "/products?category=wiring-building&q=کابل" },
      { name: "کابل کواکسیال و ترکیبی دوربین", href: "/products?category=wiring-building&q=کواکسیال" },
      { name: "آنتن تلویزیون برقی و هوایی هانی", href: "/products?category=wiring-building&q=آنتن" },
      { name: "داکت، لوله برق و بست‌های صنعتی", href: "/products?category=wiring-building&q=داکت" },
    ],
  },
  {
    id: "lighting-solar",
    title: "روشنایی LED، سولار و نورپردازی",
    subtitle: "پروژکتورهای خورشیدی هوشمند، لامپ‌های کم‌مصرف، پنل‌های اداری و صنعتی",
    icon: SunMedium,
    href: "/products?category=lighting-fixtures",
    color: "emerald",
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    border: "border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-500",
    badge: "فوق کم‌مصرف +A",
    brands: ["پارس شعاع توس", "آوا لایت", "سولار کینگ", "افراتاب"],
    subcategories: [
      { name: "پروژکتور خورشیدی (سولار) بدون سیم", href: "/products?category=lighting-fixtures&q=خورشیدی" },
      { name: "لامپ‌های حبابی و استوانه‌ای LED", href: "/products?category=lighting-fixtures&q=لامپ" },
      { name: "پنل‌های ۶۰×۶۰ و هالوژن‌های توکار", href: "/products?category=lighting-fixtures&q=پنل" },
      { name: "پروژکتورهای COB و SMD محوطه", href: "/products?category=lighting-fixtures&q=پروژکتور" },
      { name: "سنسورهای حرکتی و فتوسل نوری", href: "/products?category=lighting-fixtures&q=سنسور" },
    ],
  },
  {
    id: "maker-diy",
    title: "الکترونیک، ماژول‌ها و بردهای Maker DIY",
    subtitle: "بردهای هوشمند آردوینو، سنسورهای اینترنت اشیاء، درایور موتور و رباتیک",
    icon: Cpu,
    href: "/products?category=maker-diy-electronics",
    color: "purple",
    gradient: "from-purple-500/20 via-purple-500/5 to-transparent",
    badge: "پروژه‌های مهندسی",
    border: "border-purple-200 dark:border-purple-800/80 hover:border-purple-500",
    brands: ["Arduino", "Espressif", "STMicroelectronics", "Waveshare"],
    subcategories: [
      { name: "بردهای کنترلر Uno, Nano و ESP32", href: "/products?category=maker-diy-electronics&q=برد" },
      { name: "ماژول‌های رله، بلوتوث و وای‌فای", href: "/products?category=maker-diy-electronics&q=ماژول" },
      { name: "سنسورهای دما، رطوبت، گاز و فاصله", href: "/products?category=maker-diy-electronics&q=سنسور" },
      { name: "درایور موتور L298 و شیلدهای رباتیک", href: "/products?category=maker-diy-electronics&q=درایور" },
      { name: "هویه، قلع و ملزومات مونتاژ", href: "/products?category=maker-diy-electronics&q=هویه" },
    ],
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 py-4 sm:py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 text-right">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs">
                <Layers className="w-4 h-4" />
              </div>
              <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-white">
                دسته‌بندی‌های تخصصی کالای برق و الکترونیک
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              دسترسی سریع به کاتالوگ محصولات اورجینال، مشخصات فنی و استعلام قطعات در شعبه نجف‌آباد
            </p>
          </div>

          <Link
            href="/products"
            className="w-full md:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
          >
            <Package className="w-4 h-4" />
            <span>مشاهده همه محصولات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Main Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all duration-300 relative overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between ${cat.border}`}
              >
                {/* Background Ambient Glow */}
                <div className={`absolute top-0 right-0 w-64 h-32 bg-gradient-to-br ${cat.gradient} pointer-events-none rounded-tr-3xl blur-2xl`} />

                <div>
                  {/* Category Header */}
                  <div className="flex items-start justify-between gap-3 relative z-10 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                        cat.color === "amber" ? "bg-amber-500 text-slate-950" :
                        cat.color === "blue" ? "bg-blue-600 text-white" :
                        cat.color === "emerald" ? "bg-emerald-600 text-white" :
                        "bg-purple-600 text-white"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-right">
                        <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                          {cat.title}
                        </h2>
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                          {cat.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-right">
                    {cat.subtitle}
                  </p>

                  {/* Brand Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[11px]">
                    <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold">برندهای معتبر:</span>
                    {cat.brands.map((b) => (
                      <span
                        key={b}
                        className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-medium text-[10px]"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Subcategories List */}
                  <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 block mb-1.5 text-right">
                      زیر‌دسته‌های پرطرفدار:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300 text-xs transition-colors group"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-amber-500 shrink-0" />
                            <span className="truncate text-[11px]">{sub.name}</span>
                          </div>
                          <ChevronLeft className="w-3 h-3 text-slate-400 group-hover:text-amber-500 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 relative z-10">
                  <Link
                    href={cat.href}
                    className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>مشاهده تمام کالاهای این دسته</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

        {/* Engineering & Direct Services Hub */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-500" />
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                خدمات و ابزارهای مهندسی شیاسی
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <Link
              href="/repair-service"
              className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 hover:shadow-xs transition-all flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                <Wrench className="w-4 h-4" />
              </div>
              <div className="text-right">
                <strong className="block text-amber-950 dark:text-amber-200 font-bold">کارگاه تعمیرات</strong>
                <span className="text-[10px] text-amber-700 dark:text-amber-400">عیب‌یابی تخصصی پنکه و موتور</span>
              </div>
            </Link>

            <Link
              href="/#calculator"
              className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 hover:shadow-xs transition-all flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                <Calculator className="w-4 h-4" />
              </div>
              <div className="text-right">
                <strong className="block text-blue-950 dark:text-blue-200 font-bold">محاسبه‌گر کابل</strong>
                <span className="text-[10px] text-blue-700 dark:text-blue-400">محاسبه سطح مقطع و افت ولتاژ</span>
              </div>
            </Link>

            <Link
              href="/bom-upload"
              className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 hover:shadow-xs transition-all flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="text-right">
                <strong className="block text-emerald-950 dark:text-emerald-200 font-bold">استعلام پیش‌فاکتور (BOM)</strong>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400">بارگذاری لیست اقلام پروژه</span>
              </div>
            </Link>

            <Link
              href="/price-lists"
              className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xs transition-all flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center font-bold shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-right">
                <strong className="block text-slate-900 dark:text-white font-bold">لیست قیمت کارخانجات</strong>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">دانلود PDF رسمی روز</span>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
