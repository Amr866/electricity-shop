import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Scale,
  Lock,
  Truck,
  RotateCcw,
  Wrench,
  HelpCircle,
  Phone,
  ArrowLeft,
  Zap,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "قوانین و حریم خصوصی | فروشگاه و کارگاه تخصصی برق شیاسی نجف‌آباد",
  description:
    "شرایط و ضوابط خرید آنلاین لوازم برقی، سفارش سیم و کابل استاندارد، خدمات کارگاه تعمیرات تخصصی و رویه بازگشت کالا در فروشگاه شیاسی نجف‌آباد.",
};

export default function TermsPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        
        {/* Header Hero */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 text-center space-y-3.5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/25">
            <Scale className="w-7 h-7" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white">
            شرایط و قوانین و حریم خصوصی کاربران
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            رویه شفاف ثبت سفارشات، خرید تجهیزات برقی و صنعتی، خدمات کارگاه تعمیرات تخصصی و خط‌مشی حفظ حریم خصوصی در فروشگاه شیاسی
          </p>

          <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-amber-400 font-bold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ضمانت اصالت ۱۰۰٪ مس و کالا</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>۷ روز مهلت تست و تعویض</span>
            </span>
          </div>
        </div>

        {/* Section 1: General & Auth Rules */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h2>۱. قوانین عمومی، احراز هویت و حساب کاربری</h2>
          </div>

          <p>
            ورود، ثبت‌نام و استفاده از خدمات فروشگاه تخصصی شیاسی به منزله آگاهی کامل و پذیرش کلیه شرایط و قوانین مندرج در این صفحه است.
          </p>

          <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300 pr-1 text-xs">
            <li>
              احراز هویت خریداران از طریق شماره تلفن همراه و ارسال <strong>کد تایید یکبار مصرف (OTP)</strong> انجام می‌شود. مسئولیت حفظ خط تلفن و حساب کاربری بر عهده کاربر است.
            </li>
            <li>
              خریداران محترم موظفند اطلاعات هویتی و نشانی تحویل بار را به صورت دقیق وارد نمایند. در صورت درخواست فاکتور رسمی شرکتی، درج کد اقتصادی و شناسه ملی الزامی است.
            </li>
            <li>
              تمامی تعاملات، قیمت‌ها و مراودات فروشگاه شیاسی منطبق بر قوانین جمهوری اسلامی ایران و قانون تجارت الکترونیک است.
            </li>
          </ul>
        </div>

        {/* Section 2: Products & Copper Standard Warranty */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h2>۲. ضمانت اصالت سیم و کابل، الکتروموتورها و لوازم خانگی</h2>
          </div>

          <p>
            فروشگاه شیاسی به عنوان مرکز پخش و تامین مستقیم ملزومات برق، اصالت و استاندارد کلیه اجناس عرضه‌شده را تضمین می‌نماید:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
              <strong className="text-amber-600 dark:text-amber-400 font-bold block">سیم و کابل استاندارد مس:</strong>
              <span className="text-slate-600 dark:text-slate-300">
                تضمین مس آنیل‌شده با خلوص ۹۹.۹٪، عایق استاندارد و تاییدیه اداره استاندارد و توانیر.
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
              <strong className="text-blue-600 dark:text-blue-400 font-bold block">موتور کولر و پنکه و بخاری:</strong>
              <span className="text-slate-600 dark:text-slate-300">
                تامین مستقیم از برندهای معتبر با کارت گارانتی اصلی کارخانه و قطعات شرکتی.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Workshop Repairs & Service Warranty */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <h2>۳. شرایط خدمات کارگاه تعمیرات تخصصی نجف‌آباد</h2>
          </div>

          <p>
            کارگاه تخصصی شیاسی با دارا بودن تکنسین‌های مجرب، خدمات تعمیرات انواع پنکه، موتور کولر آبی، بخاری برقی، آنتن و بردهای الکترونیک را با شرایط زیر ارائه می‌دهد:
          </p>

          <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300 pr-1 text-xs">
            <li>
              <strong>مهلت تست تعمیرات:</strong> تمامی خدمات سیم‌پیچی و تعمیرات انجام‌شده دارای <strong>۷ روز مهلت تست فنی</strong> از تاریخ تحویل به مشتری می‌باشند.
            </li>
            <li>
              <strong>اعلام هزینه قبل از اقدام:</strong> پس از عیب‌یابی اولیه در کارگاه، هزینه تعمیر به مشتری اعلام شده و پس از تایید نهایی، فرآیند تعمیر آغاز می‌گردد.
            </li>
            <li>
              <strong>استفاده از قطعات اصلی:</strong> کلیه بلبرینگ‌ها، بوش‌ها، خازن‌ها و کلیدهای تعویض‌شده از نوع درجه‌یک و اورجینال می‌باشند.
            </li>
          </ul>
        </div>

        {/* Section 4: Shipping, Delivery & 7-Day Returns */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <h2>۴. روش‌های ارسال و رویه ۷ روزه مرجوعی کالا</h2>
          </div>

          <p>
            سفارشات شهر نجف‌آباد و اصفهان در سریع‌ترین زمان با <strong>پیک اختصاصی</strong> و سفارشات سایر شهرستان‌ها از طریق <strong>تیپاکس، باربری و پست پیشتاز</strong> ارسال می‌گردند.
          </p>

          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900 space-y-2 text-xs">
            <strong className="text-emerald-800 dark:text-emerald-300 font-bold block">شرایط استفاده از ضمانت بازگشت وجه و تعویض:</strong>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              در صورت وجود نقص فنی اولیه یا مغایرت کالا با مشخصات درج‌شده در سایت، خریدار می‌تواند ظرف مدت <strong>۷ روز کاری</strong> کالا را در بسته‌بندی اولیه مرجوع نماید. وجه پرداختی ظرف حداکثر ۲۴ ساعت پس از دریافت کالا در انبار به حساب خریدار عودت داده می‌شود.
            </p>
          </div>
        </div>

        {/* Section 5: Privacy Policy */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h2>۵. خط‌مشی حفظ حریم خصوصی و امنیت داده‌ها</h2>
          </div>

          <p>
            فروشگاه شیاسی خود را متعهد به حفظ کامل حریم خصوصی و اطلاعات کاربران می‌داند:
          </p>

          <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300 pr-1 text-xs">
            <li>
              شماره تلفن همراه، آدرس و مشخصات خریداران صرفاً جهت پردازش سفارشات، ارسال کالا و صدور فاکتور رسمی استفاده شده و تحت هیچ شرایطی در اختیار اشخاص ثالث قرار نخواهد گرفت.
            </li>
            <li>
              پرداخت‌های آنلاین در درگاه‌های امن شاپرک و با پروتکل‌های امنیتی استاندارد رمزنگاری انجام می‌پذیرد.
            </li>
          </ul>
        </div>

        {/* Contact & Support Box */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center sm:text-right">
            <h3 className="font-black text-sm text-white flex items-center justify-center sm:justify-start gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>نیاز به راهنمایی یا مشاوره حقوقی دارید؟</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              تیم پشتیبانی فروشگاه و کارگاه شیاسی همواره آماده پاسخگویی به سوالات شماست.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>تماس با پشتیبانی</span>
            </Link>

            <Link
              href="/"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              بازگشت به فروشگاه
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
