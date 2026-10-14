import React from "react";
import Link from "next/link";
import {
  Scale,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Truck,
  RotateCcw,
  Wrench,
  HelpCircle,
  Phone,
  ArrowLeft,
  Zap,
  Lock,
  Cookie,
  CheckCircle2,
  Cpu,
  BadgeAlert,
  Flame,
} from "lucide-react";

export const metadata = {
  title: "شرایط و قوانین و مقررات جامع | فروشگاه و کارگاه تخصصی برق شیاسی",
  description:
    "شرایط و ضوابط خرید تجهیزات برقی و صنعتی، استانداردهای خلوص مس سیم و کابل، مسئولیت‌های ایمنی برق، رویه بازگشت کالا و خدمات کارگاه تعمیرات تخصصی شیاسی نجف‌آباد.",
};

export default function TermsPage() {
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 shadow-sm"
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <Cookie className="w-3.5 h-3.5" />
            <span>سیاست کوکی‌ها</span>
          </Link>
        </nav>

        {/* Header Hero */}
        <header className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 text-center space-y-3.5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/25">
            <Scale className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white">
            شرایط و قوانین و مقررات استفاده از فروشگاه شیاسی
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            رویه شفاف ثبت سفارشات، خرید تجهیزات برق و الکترونیک، الزامات ایمنی و فنی، ضوابط کارگاه تعمیرات تخصصی و رویه بازگشت کالا منطبق با قانون تجارت الکترونیک
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] text-amber-400 font-bold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ضمانت اصالت ۱۰۰٪ مس سیم و کابل</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>۷ روز مهلت تست کالا طبق قانون</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>گارانتی تست کارگاه تعمیرات نجف‌آباد</span>
            </span>
          </div>
        </header>

        {/* Section 1: Definitions */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h2>ماده ۱: تعاریف و اصطلاحات</h2>
          </div>

          <p>
            اصطلاحات مندرج در این توافق‌نامه در معانی مشروحه ذیل به کار می‌روند:
          </p>

          <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300 pr-1 text-xs sm:text-[13px]">
            <li>
              <strong>فروشگاه شیاسی (ما / مجموعه):</strong> پایگاه اینترنتی به نشانی shiasistore.ir متعلق به واحد صنفی الکتریکی و کارگاه سیم‌پیچی شیاسی مستقر در نجف‌آباد اصفهان.
            </li>
            <li>
              <strong>کاربر یا خریدار (شما):</strong> هر شخص حقیقی یا حقوقی که با ثبت شماره همراه و احراز هویت پیامکی اقدام به مرور کاتالوگ، استعلام لیست کالا (BOM)، ثبت سفارش یا ارسال دستگاه جهت تعمیر می‌نماید.
            </li>
            <li>
              <strong>کالا و تجهیزات:</strong> کلیه ملزومات سیم و کابل، الکتروموتورها، لوازم سرمایش و گرمایش، تجهیزات روشنایی، قطعات الکترونیک و ابزارآلات ارائه‌شده در وب‌سایت.
            </li>
            <li>
              <strong>کارگاه تعمیرات:</strong> بخش تخصصی عیب‌یابی، سیم‌پیچی و تعمیرات لوازم خانگی و صنعتی مجموعه شیاسی در نجف‌آباد.
            </li>
          </ul>
        </section>

        {/* Section 2: General & Account Rules */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2>ماده ۲: قوانین عمومی و حساب کاربری</h2>
          </div>

          <p>
            ورود، ثبت‌نام و استفاده از هر یک از خدمات فروشگاه تخصصی شیاسی به منزله مطالعه دقیق، آگاهی کامل و پذیرش بدون قید و شرط کلیه مفاد این قرارداد است.
          </p>

          <ul className="space-y-2.5 list-disc list-inside text-slate-600 dark:text-slate-300 pr-1 text-xs sm:text-[13px]">
            <li>
              <strong>احراز هویت پیامکی (OTP):</strong> ورود به سامانه با شماره تلفن همراه خریدار انجام می‌شود. مسئولیت حفظ سیم‌کارت، دستگاه و عدم در اختیار گذاشتن کدهای تایید به افراد غیر بر عهده شخص کاربر است.
            </li>
            <li>
              <strong>صحت اطلاعات:</strong> خریدار متعهد است اطلاعات هویتی، کدپستی، نشانی تحویل و شماره‌های تماس را با دقت وارد نماید. هرگونه تاخیر یا خسارت ناشی از نقص در اطلاعات ارائه‌شده بر عهده خریدار خواهد بود.
            </li>
            <li>
              <strong>فاکتور رسمی شرکتی:</strong> در صورت نیاز به صدور فاکتور رسمی جهت شرکت‌ها و پیمانکاران محترم، ارائه شناسه ملی، کد اقتصادی، کد پستی ثبت‌شده در سامانه مودیان و آدرس رسمی شرکت الزامی است.
            </li>
            <li>
              کلیه رویه‌ها و فرآیندهای فروشگاه شیاسی منطبق با قوانین جاری جمهوری اسلامی ایران، قانون تجارت الکترونیک مصوب ۱۳۸۲ و قانون حمایت از حقوق مصرف‌کننده است.
            </li>
          </ul>
        </section>

        {/* Section 3: Pricing & Metals Market Volatility */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h2>ماده ۳: ثبت سفارش، قیمت‌گذاری و نوسانات بازار فلزات</h2>
          </div>

          <p>
            با توجه به ماهیت فنی و وابستگی مستقیم قیمت سیم و کابل استاندارد به نرخ بورس فلزات مس و نوسانات مواد پلیمری عایق:
          </p>

          <div className="space-y-3 text-xs sm:text-[13px]">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
              <strong className="text-amber-600 dark:text-amber-400 font-bold block">تثبیت قطعی قیمت پس از تسویه:</strong>
              <p className="text-slate-600 dark:text-slate-300">
                قیمت کلیه اقلام در لحظه پرداخت موفق از طریق درگاه بانکی نهایی شده و هرگونه افزایش بعدی نرخ مس، دلار یا تعرفه حمل هیچ‌گونه تاثیری در قیمت فاکتور تسویه‌شده خریدار نخواهد داشت.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
              <strong className="text-rose-600 dark:text-rose-400 font-bold block">حق لغو در صورت خطای آشکار سیستمی:</strong>
              <p className="text-slate-600 dark:text-slate-300">
                در صورتی که به دلیل خطای نرم‌افزاری یا محاسباتی، کالایی با قیمتی نامتعارف و بسیار کمتر از بهای تمام‌شده روز (مانند از قلم افتادن یک صفر) ثبت شود، فروشگاه شیاسی مختار به ابطال سفارش بوده و موظف است حداکثر ظرف ۱۲ ساعت کاری کل مبلغ دریافتی را به شماره شبای مبدا خریدار مسترد نماید.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Electrical Safety Disclaimer - VITAL FOR LIABILITY */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-300 dark:border-amber-800/70 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
          
          <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400 font-black text-base border-b border-amber-200 dark:border-amber-900/50 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h2>ماده ۴: سلب مسئولیت‌های ایمنی برق و الزامات نصب تخصصی</h2>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 space-y-2 text-xs sm:text-[13px] text-amber-950 dark:text-amber-200 font-medium">
            <p className="leading-relaxed">
              <strong>هشدار حیاتی ایمنی:</strong> برق ۲۲۰ ولت و جریان‌های صنعتی دارای خطرات جانی، آتش‌سوزی و آسیب شدید به تجهیزات هستند. خریدار با آگاهی کامل از ماهیت کالاهای الکتریکی اقرار می‌نماید که کلیه فرآیندهای نصب، راه‌اندازی و سیم‌کشی را صرفاً توسط <strong>تکنسین‌ها و برق‌کاران دارای صلاحیت و گواهینامه معتبر فنی و حرفه‌ای</strong> و با رعایت استانداردهای ملی و مبحث ۱۳ مقررات ملی ساختمان انجام خواهد داد.
            </p>
          </div>

          <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300 pr-1 text-xs sm:text-[13px]">
            <li>
              فروشگاه شیاسی هیچ‌گونه مسئولیتی در قبال حوادث ناشی از نصب غیراصولی، بی‌دقتی در اتصالات، اتصال کوتاه فاز و نول، فقدان سیم اتصال به زمین (ارت استاندارد) یا عدم نصب کلید محافظ جان (RCCB) بر عهده نخواهد داشت.
            </li>
            <li>
              سوختگی سیم‌پیچ الکتروموتورهای کولر، پمپ‌ها یا بخاری‌ها ناشی از <strong>نوسانات ناگهانی ولتاژ شبکه برق، دوفاز شدن، برخورد صاعقه، کارکرد خشک پمپ بدون آب، یا گیرپاژ مکانیکی یاتاقان‌های کولر</strong> خارج از تعهدات فروشگاه بوده و شامل گارانتی مرجوعی نمی‌باشد.
            </li>
            <li>
              بردهای الکترونیکی و ماژول‌های DIY ارائه‌شده قبل از ارسال از نظر سلامت فیزیکی بازرسی می‌شوند. اتصال معکوس قطبیت منبع تغذیه، اعمال ولتاژ بیش از آستانه مجاز و یا لحیم‌کاری غیراصولی منجر به ابطال هرگونه ضمانت تعویض قطعه خواهد شد.
            </li>
          </ul>
        </section>

        {/* Section 5: Shipping, Freight and Transit Rules */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <h2>ماده ۵: روش‌های ارسال، باربری و بازرسی بسته مرسوله</h2>
          </div>

          <p>
            توزیع سفارشات در منطقه نجف‌آباد و اصفهان با پیک اختصاصی یا تحویل حضوری در کارگاه، و در سایر استان‌ها از طریق شرکت‌های معتبر پستی، تیپاکس و باربری‌های دارای بیمه نامه معتبر انجام می‌پذیرد:
          </p>

          <ul className="space-y-2.5 list-disc list-inside text-slate-600 dark:text-slate-300 pr-1 text-xs sm:text-[13px]">
            <li>
              <strong>الزام خریدار به بازرسی فیزیکی در حضور مامور توزیع:</strong> خریدار موظف است در لحظه دریافت مرسوله از مامور پست، تیپاکس یا باربری، ظاهر کارتن و بسته‌بندی را از نظر شکستگی، پارگی چسب اختصاصی یا مخدوش بودن پلمپ بررسی نماید. در صورت وجود آسیب فیزیکی، خریدار باید از دریافت بسته امتناع نموده و صورت‌جلسه خسارت در حضور مامور تنظیم نماید.
            </li>
            <li>
              امضای رسید تحویل بدون قید نقص به منزله تایید سلامت ظاهری بسته‌بندی تلقی شده و ادعای شکستگی بدنه بخاری یا قاب فن پس از تحویل قابل استناد در مراجع باربری نخواهد بود.
            </li>
            <li>
              هزینه‌های حمل بین‌شهری کلاف‌های سنگین سیم و کابل یا الکتروموتورهای حجیم به صورت پس‌کرایه طبق تعرفه رسمی باربری دریافت می‌گردد.
            </li>
          </ul>
        </section>

        {/* Section 6: 7-Day Returns & Legal Exceptions */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <h2>ماده ۶: رویه ۷ روزه انصراف و بازگشت کالا و استثنائات قانونی</h2>
          </div>

          <p>
            مطابق با ماده ۳۷ قانون تجارت الکترونیک، خریدار تا ۷ روز کاری از زمان تحویل کالا حق انصراف و عودت دارد. شرایط استفاده و استثنائات قانونی صنف ملزومات الکتریک عبارتند از:
          </p>

          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900 space-y-2 text-xs sm:text-[13px]">
            <strong className="text-emerald-800 dark:text-emerald-300 font-bold block">شرایط عمومی کالای مرجوعی:</strong>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              کالا باید در شرایط اولیه، در کارتن اصلی، با کلیه متعلقات، بدون پارگی هولوگرام شرکتی و بدون هرگونه اثر نصب، اثر پیچ شدن، بوی سوختگی یا لکه روغن به انبار فروشگاه مسترد شود.
            </p>
          </div>

          <div className="bg-rose-50 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 space-y-2 text-xs sm:text-[13px]">
            <strong className="text-rose-800 dark:text-rose-300 font-bold block">استثنائات قانونی و غیرقابل عودت:</strong>
            <ul className="space-y-1.5 list-disc list-inside text-slate-600 dark:text-slate-300 pr-1">
              <li>
                <strong>سیم و کابل‌های متراژی:</strong> سیم‌ها و کابل‌هایی که بنا به درخواست خریدار در متراژهای خاص از کلاف ۱۰۰ متری برش داده شده‌اند، به دلیل از بین رفتن یکپارچگی استاندارد تجاری، غیرقابل انصراف و عودت می‌باشند.
              </li>
              <li>
                <strong>قطعات و بردهای الکترونیکی:</strong> بردهای راه‌انداز، ترانزیستورها و ماژول‌هایی که از بسته‌بندی ضدالکتریسیته خارج یا لحیم‌کاری شده‌اند.
              </li>
              <li>
                <strong>الکتروموتورهای کارکرده:</strong> موتور کولر، دینام یا پمپی که به پایه‌های دستگاه پیچ شده یا علائم استفاده آب و خاک روی آن مشهود است.
              </li>
            </ul>
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-xs">
            در صورت تایید کارشناسان فنی انبار مبنی بر سلامت کامل کالای مرجوعی، کل وجه سفارش ظرف حداکثر ۲۴ ساعت کاری به حساب خریدار واریز خواهد شد.
          </p>
        </section>

        {/* Section 7: Repair Workshop Regulations */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <h2>ماده ۷: ضوابط کارگاه تعمیرات تخصصی شیاسی نجف‌آباد</h2>
          </div>

          <p>
            خدمات سیم‌پیچی، رفع عیب بردهای کنترلی و تعمیرات انواع پنکه، موتور کولر و بخاری برقی تابع مقررات زیر است:
          </p>

          <ul className="space-y-2.5 list-disc list-inside text-slate-600 dark:text-slate-300 pr-1 text-xs sm:text-[13px]">
            <li>
              <strong>اعلام هزینه و اخذ تاییدیه:</strong> پس از بررسی مقدماتی و تشخیص عیب توسط استادکاران کارگاه، هزینه تخمینی قطعات و اجرت به مشتری اعلام شده و صرفاً پس از تایید مشتری اقدام به تعمیر خواهد شد.
            </li>
            <li>
              <strong>مهلت تست تعمیرات:</strong> کلیه خدمات سیم‌پیچی و تعمیرات انجام‌شده در این کارگاه دارای <strong>۷ روز مهلت تست فنی از تاریخ تحویل</strong> هستند. در صورت بروز مجدد همان نقص بدون دخالت عوامل محیطی (نوسان ولتاژ، آب‌خوردگی یا ضربه)، رفع عیب بدون هزینه انجام می‌پذیرد.
            </li>
            <li>
              <strong>مهلت تحویل دستگاه تعمیری (حداکثر ۳۰ روز):</strong> مشتری موظف است حداکثر ظرف مدت ۳۰ روز تقویمی پس از اعلام پیامکی اتمام تعمیر، جهت تسویه و دریافت دستگاه به کارگاه مراجعه نماید. پس از گذشت ۳۰ روز، کارگاه هیچ‌گونه مسئولیتی در قبال حفظ، خسارت احتمالی یا انبارداری دستگاه و قطعات داغی بر عهده نخواهد داشت.
            </li>
          </ul>
        </section>

        {/* Section 8: Force Majeure & Dispute Resolution */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <h2>ماده ۸: حوادث غیرمترقبه و مراجع حل اختلاف</h2>
          </div>

          <p>
            کلیه شرایط مندرج در این صفحه در شرایط عادی نافذ است. در موارد فورس‌ماژور (بلایای طبیعی، قطعی سراسری ارتباطات و اینترنت کشوری، بحران‌های حمل‌ونقل عمومی و اعتصابات)، فروشگاه شیاسی مسئولیتی در قبال تاخیرهای ناشی از حوادث خارج از کنترل نخواهد داشت.
          </p>

          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-[13px]">
            در صورت بروز هرگونه ابهام یا اختلاف، طرفین در وهله نخست تلاش خواهند نمود از طریق مذاکره صلح‌آمیز و بخش پشتیبانی شیاسی موضوع را حل نمایند. در صورت عدم حصول توافق، مراجع قضایی و اتحادیه صنف الکتریک شهرستان نجف‌آباد صالح به رسیدگی خواهند بود.
          </p>
        </section>

        {/* Support Box */}
        <aside className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center sm:text-right">
            <h3 className="font-black text-sm text-white flex items-center justify-center sm:justify-start gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>نیاز به راهنمایی بیشتر درباره قوانین و ضمانت کالا دارید؟</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              کارشناسان فروش و فنی فروشگاه شیاسی صمیمانه پاسخگوی ابهامات شما هستند.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>تماس با فروشگاه</span>
            </Link>

            <Link
              href="/"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              صفحه اصلی
            </Link>
          </div>
        </aside>

      </div>
    </div>
  );
}
