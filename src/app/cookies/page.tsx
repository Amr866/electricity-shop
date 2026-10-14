import React from "react";
import Link from "next/link";
import {
  Cookie,
  Scale,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Settings,
  HelpCircle,
  AlertTriangle,
  Info,
  Server,
  Smartphone,
  Laptop,
  Flame,
  Phone,
  EyeOff,
  ShoppingBag,
} from "lucide-react";

export const metadata = {
  title: "سیاست استفاده از کوکی‌ها و حافظه محلی | فروشگاه برق شیاسی",
  description:
    "شفاف‌سازی کامل درباره انواع کوکی‌های ضروری، توکن‌های نشست امن NextAuth، ذخیره‌سازی سبد خرید و نحوه مدیریت کوکی‌ها در مرورگرهای کاربران فروشگاه شیاسی نجف‌آباد.",
};

export default function CookiesPolicyPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 sm:py-14 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        
        {/* Navigation Tabs between Legal Documents */}
        <nav
          aria-label="فهرست اسناد حقوقی"
          className="flex items-center justify-center gap-2 p-1.5 bg-slate-200/80 dark:bg-slate-900 rounded-2xl border border-slate-300/80 dark:border-slate-800 text-xs font-bold"
        >
          <Link
            href="/terms"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>قوانین و مقررات</span>
          </Link>
          <Link
            href="/privacy"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>حریم خصوصی</span>
          </Link>
          <Link
            href="/cookies"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 shadow-sm"
          >
            <Cookie className="w-3.5 h-3.5" />
            <span>سیاست کوکی‌ها</span>
          </Link>
        </nav>

        {/* Header Hero */}
        <header className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-850 text-center space-y-3.5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/25">
            <Cookie className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white">
            سیاست استفاده از کوکی‌ها و فناوری‌های ذخیره‌سازی
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            شفاف‌سازی صریح پیرامون نحوه عملکرد کوکی‌های امنیتی، حفظ اقلام سبد خرید، تنظیمات تم و ردگیری عملکرد بدون به کارگیری ابزارهای تبلیغاتی مزاحم
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] text-amber-400 font-bold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>کوکی‌های امنیتی با پرچم HttpOnly</span>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center gap-1">
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span>پایداری اقلام سبد خرید با LocalStorage</span>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center gap-1">
              <EyeOff className="w-4 h-4 text-amber-400" />
              <span>فاقد هرگونه کوکی ردیابی تبلیغاتی شخص ثالث</span>
            </span>
          </div>
        </header>

        {/* Section 1: What is a Cookie? */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-850 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-850 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
            <h2>بخش ۱: کوکی چیست و چرا استفاده می‌شود؟</h2>
          </div>

          <p className="text-justify">
            کوکی‌ها (Cookies) و داده‌های حافظه محلی مرورگر (Local Storage) فایل‌های متنی بسیار کوچک و رمزگذاری‌شده‌ای هستند که هنگام بازدید از وب‌سایت‌ها توسط مرورگر دستگاه شما (رایانه، تبلت یا تلفن همراه) ذخیره می‌گردند. هدف اصلی از به‌کارگیری این فناوری‌ها، فراهم ساختن تجربه‌ای روان، جلوگیری از خروج ناخواسته از حساب کاربری هنگام گشت‌وگذار میان صفحات، حفظ اقلام موجود در سبد خرید تجهیزات برقی و اعمال تنظیمات ظاهری دلخواه شما (نظیر تم تیره یا روشن) است.
          </p>

          <p className="text-justify">
            کوکی‌های مورد استفاده در وب‌سایت فروشگاه شیاسی به هیچ عنوان فایل اجرایی نبوده، قابلیت انتقال بدافزار یا ویروس را ندارند و دسترسی به اطلاعات شخصی محرمانه فایل‌های رایانه شما را به دست نخواهند آورد.
          </p>
        </section>

        {/* Section 2: Cookie Categories Table / Cards */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-850 shadow-sm space-y-5 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-850 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <h2>بخش ۲: انواع کوکی‌ها و داده‌های محلی در فروشگاه شیاسی</h2>
          </div>

          <div className="space-y-4">
            
            {/* Category A: Essential & Security Cookies */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-950 dark:text-white text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span>۱. کوکی‌های کاملاً ضروری و امنیتی (Strictly Necessary)</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold mr-auto">
                  غیرقابل غیرفعال‌سازی
                </span>
              </div>
              <p className="text-justify text-slate-600 dark:text-slate-300">
                این کوکی‌ها برای عملکرد بنیادین وب‌سایت و امنیت حساب کاربری ضروری هستند. بدون آنها، ثبت سفارش، ورود به حساب کاربری با OTP و ارتباط امن با درگاه بانکی ناممکن خواهد بود:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-[11px]">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="font-mono font-bold text-amber-600 dark:text-amber-400">next-auth.session-token</div>
                  <div className="text-slate-600 dark:text-slate-400">
                    شناسه نشست امن ورود کاربر؛ با پرچم‌های سه‌گانه HttpOnly و Secure در برابر سرقت یا نفوذ اسکریپت‌های مخرب حفاظت می‌شود.
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">__Host-next-auth.csrf-token</div>
                  <div className="text-slate-600 dark:text-slate-400">
                    توکن یکتای پیشگیری از حملات جعل درخواست متقابل (CSRF Protection) در هنگام ارسال فرم‌ها یا تکمیل تسویه‌حساب.
                  </div>
                </div>
              </div>
            </div>

            {/* Category B: Functional & Storage */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-950 dark:text-white text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0" />
                <span>۲. کوکی‌ها و حافظه عملکردی و ترجیحات (Functional Storage)</span>
              </div>
              <p className="text-justify text-slate-600 dark:text-slate-300">
                این داده‌ها برای به خاطر سپردن گزینه‌ها و انتخاب‌های شما در طول استفاده از سامانه استفاده می‌شوند:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-[11px]">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="font-mono font-bold text-cyan-600 dark:text-cyan-400">shiasi_cart (Local Storage)</div>
                  <div className="text-slate-600 dark:text-slate-400">
                    نگهداری موقت متراژ سیم، کابل، قطعات کولر یا بردهای انتخاب‌شده در سبد خرید حتی در صورت بارگذاری مجدد یا قطعی موقت مرورگر.
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="font-mono font-bold text-purple-600 dark:text-purple-400">theme (Cookie / Storage)</div>
                  <div className="text-slate-600 dark:text-slate-400">
                    ذخیره ترجیح حالت تیره (Dark Mode) یا روشن (Light Mode) تا صفحات با رنگ‌بندی مورد پسند چشمان کاربر بارگذاری گردند.
                  </div>
                </div>
              </div>
            </div>

            {/* Category C: Performance & Crash Analysis */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-950 dark:text-white text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span>۳. داده‌های پایش عملکرد و سلامت سرور (Performance & Telemetry)</span>
              </div>
              <p className="text-justify text-slate-600 dark:text-slate-300">
                جهت نظارت بر سرعت لود تصاویر کاتالوگ محصولات، شناسایی خطاهای ۴۰۴ یا ۵۰۰ و سنجش زمان پاسخگویی سرور در خطوط مختلف اینترنت کشور به شکل ناشناس (Anonymous) استفاده می‌گردد تا زیرساخت فنی سایت همواره با کیفیت بالا در دسترس کاربران باشد.
              </p>
            </div>

          </div>
        </section>

        {/* Section 3: Absolute Rejection of 3rd-Party Tracking */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-500/30 dark:border-emerald-500/20 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-850 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center">
              <EyeOff className="w-4 h-4" />
            </div>
            <h2>بخش ۳: عدم استفاده از کوکی‌های تبلیغاتی شخص ثالث</h2>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>محیط خرید فروشگاه شیاسی کاملاً عاری از ره‌گیری تجاری و تبلیغات است</span>
            </div>
            <p className="text-justify leading-relaxed">
              برخلاف بسیاری از وب‌سایت‌ها، ما از کوکی‌های تبلیغاتی شبکه‌های خارجی، بنرهای هدف‌گذاری مجدد (Retargeting) یا پیکسلهای جاسوسی رفتار کاربر استفاده نمی‌کنیم. هیچ اطلاعاتی از جستجوهای شما در کاتالوگ فروشگاه به شبکه‌های تبلیغاتی فروخته یا منتقل نمی‌شود.
            </p>
          </div>
        </section>

        {/* Section 4: How to Manage Cookies in Browsers */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-850 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-850 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <h2>بخش ۴: نحوه مدیریت یا غیرفعال‌سازی کوکی‌ها در مرورگرها</h2>
          </div>

          <p className="text-justify">
            شما این امکان را دارید که از طریق بخش تنظیمات مرورگر خود (در رایانه یا گوشی تلفن همراه)، کوکی‌ها را مسدود نموده یا کوکی‌های ذخیره‌شده پیشین را حذف فرمایید. راهنمای کلی دسترسی به تنظیمات در محبوب‌ترین مرورگرها به شرح زیر است:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">گوگل کروم (Google Chrome):</div>
              <p className="text-slate-600 dark:text-slate-400 leading-normal">
                تنظیمات (Settings) &gt; حریم خصوصی و امنیت (Privacy and Security) &gt; کوکی‌های شخص ثالث (Third-party cookies).
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-850 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">فایرفاکس (Mozilla Firefox):</div>
              <p className="text-slate-600 dark:text-slate-400 leading-normal">
                گزینه‌ها (Options) &gt; حریم خصوصی و امنیت (Privacy &amp; Security) &gt; بخش کوکی‌ها و داده‌های سایت (Cookies and Site Data).
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-850 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">سافاری اپل (Apple Safari):</div>
              <p className="text-slate-600 dark:text-slate-400 leading-normal">
                تنظیمات (Preferences) &gt; حریم خصوصی (Privacy) &gt; مسدودسازی کوکی‌ها (Block all cookies).
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-850 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">مایکروسافت اج (Microsoft Edge):</div>
              <p className="text-slate-600 dark:text-slate-400 leading-normal">
                تنظیمات (Settings) &gt; کوکی‌ها و مجوزهای سایت (Cookies and site permissions) &gt; مدیریت و حذف کوکی‌ها.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-slate-800 dark:text-slate-200">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-amber-700 dark:text-amber-400 text-xs">
                پیامدهای مسدودسازی کلی کوکی‌ها:
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                لطفاً توجه داشته باشید در صورت مسدود کردن کامل تمامی کوکی‌ها در مرورگر خود، ورود به حساب کاربری، افزودن کالا به سبد خرید و تکمیل فرایند پرداخت غیرفعال خواهد شد، با این حال امکان مشاهده عمومی مشخصات فنی محصولات، مقالات وبلاگ و آدرس فروشگاه برقرار خواهد ماند.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Updates & Inquiries */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-850 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-850 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <h2>بخش ۵: تغییرات سیاست کوکی‌ها و راه‌های ارتباطی</h2>
          </div>

          <p className="text-justify">
            ممکن است سیاست حاضر به تناسب به‌روزرسانی سیستم‌های امنیتی وب‌سایت یا تغییر استانداردهای وب ارتقا یابد. آخرین نسخه همواره در همین صفحه با قابلیت دسترسی عمومی منتشر خواهد بود.
          </p>

          <p className="text-justify">
            جهت طرح پرسش‌های فنی پیرامون کوکی‌ها یا درخواست‌های مرتبط، تیم فنی و پشتیبانی فروشگاه برق شیاسی از طریق شماره همراه <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold" dir="ltr">۰۹۱۳-۶۲۶-۰۰۷۲</span> و شماره ثابت <span className="font-mono text-amber-600 dark:text-amber-400 font-bold" dir="ltr">۰۳۱-۴۲۶۲۶۱۱۶</span> پاسخگوی شما عزیزان خواهد بود.
          </p>
        </section>

      </div>
    </div>
  );
}
