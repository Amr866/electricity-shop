import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Scale,
  Cookie,
  CreditCard,
  UserCheck,
  EyeOff,
  Server,
  FileCheck2,
  HelpCircle,
  Phone,
  AlertTriangle,
  Database,
  Truck,
  CheckCircle2,
  Cpu,
  Mail,
  MapPin,
} from "lucide-react";

export const metadata = {
  title: "سیاست حفظ حریم خصوصی و امنیت داده‌ها | فروشگاه و کارگاه برق شیاسی",
  description:
    "تعهدنامه رسمی فروشگاه برق شیاسی نجف‌آباد در حفظ و صیانت از حریم خصوصی، امنیت پرداخت از طریق شبکه شاپرک، حفاظت از داده‌های هویتی و عدم افشای اطلاعات کاربران منطبق بر قوانین تجارت الکترونیک.",
};

export default function PrivacyPage() {
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 shadow-sm"
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
        <header className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-850 text-center space-y-3.5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
            <Lock className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white">
            سیاست حفظ حریم خصوصی و امنیت اطلاعات کاربران
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            تعهدنامه رسمی فروشگاه و کارگاه تخصصی برق شیاسی در راستای امانت‌داری، صیانت از اطلاعات فردی، تراکنش‌های بانکی امن و پایبندی به قانون تجارت الکترونیک جمهوری اسلامی ایران
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] text-emerald-400 font-bold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>رمزنگاری سراسری ۲۵۶ بیتی SSL / TLS</span>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center gap-1">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>پرداخت مستقیم در بستر امن شاپرک</span>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center gap-1">
              <EyeOff className="w-4 h-4 text-cyan-400" />
              <span>عدم فروش یا افشای اطلاعات به اشخاص ثالث</span>
            </span>
          </div>
        </header>

        {/* Section 1: Legal Framework */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-850 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-850 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <h2>ماده ۱: مقدمه و چارچوب قانونی صیانت از داده‌ها</h2>
          </div>

          <p className="text-justify">
            فروشگاه و کارگاه تخصصی برق شیاسی (به نشانی اینترنتی <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">shiasistore.ir</span>) به حریم خصوصی تمامی افرادی که از وب‌سایت بازدید نموده، سفارش ثبت می‌کنند یا از خدمات کارگاه تعمیرات استفاده می‌نمایند، احترام کامل می‌گذارد. کلیه رویه‌های جمع‌آوری، نگهداری و پردازش اطلاعات در این سامانه بر پایه اصول اخلاقی امانت‌داری، مفاد قانون تجارت الکترونیک مصوب سال ۱۳۸۲، قوانین حمایت از حقوق مصرف‌کنندگان و الزامات مرکز توسعه تجارت الکترونیکی (نماد اعتماد الکترونیکی - اینماد) تنظیم گردیده است.
          </p>

          <p className="text-justify">
            استفاده از خدمات سایت، ایجاد حساب کاربری، بارگذاری صورت کسری تجهیزات (BOM) یا ثبت سفارش خرید، به منزله مطالعه دقیق، آگاهی کامل و پذیرش صریح مفاد این سند از سوی کاربر تلقی می‌گردد.
          </p>
        </section>

        {/* Section 2: Collected Data */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-850 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-850 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <h2>ماده ۲: داده‌ها و اطلاعاتی که گردآوری می‌شوند</h2>
          </div>

          <p>
            فروشگاه شیاسی صرفاً اطلاعاتی را گردآوری می‌نماید که برای پردازش قانونی سفارش، ارسال مرسوله، صدور فاکتور و ارائه خدمات پس از فروش ضرورت فنی و حقوقی دارند:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <span>اطلاعات هویتی و تماسی</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-normal">
                شامل نام و نام‌خانوادگی، شماره تلفن همراه معتبر (جهت احراز هویت با رمز یکبارمصرف پیامکی OTP) و در صورت تمایل آدرس ایمیل کاربر.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Truck className="w-4 h-4 text-amber-500" />
                <span>اطلاعات ارسال و نشانی پستی</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-normal">
                استان، شهر، نشانی دقیق پستی، کد پستی ده‌رقمی معتبر و شماره تماس تحویل‌گیرنده جهت هماهنگی مأمورین شرکت ملی پست، تیپاکس و باربری‌های مجاز.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Scale className="w-4 h-4 text-purple-500" />
                <span>اطلاعات مالیاتی (فاکتور رسمی)</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-normal">
                صرفاً در صورت تقاضای خریدار مبنی بر صدور فاکتور رسمی مالیات بر ارزش افزوده و ثبت در سامانه مودیان، کد ملی (اشخاص حقیقی) یا شناسه ملی و کد اقتصادی (اشخاص حقوقی) اخذ می‌گردد.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Cpu className="w-4 h-4 text-cyan-500" />
                <span>مشخصات فنی دستگاه‌های تعمیری</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-normal">
                شامل مدل، شماره سریال و ایراد اظهارشده الکتروموتورها، پمپ‌های آب، بردهای الکترونیکی و تجهیزاتی که جهت تعمیر به کارگاه شیاسی در نجف‌آباد تحویل داده می‌شوند.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Financial & Banking Safety Disclaimer */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-500/30 dark:border-emerald-500/20 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-850 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <h2>ماده ۳: امنیت کامل اطلاعات بانکی و سلب دسترسی به اطلاعات کارت</h2>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>فروشگاه شیاسی هرگز به اطلاعات کارت بانکی شما دسترسی ندارد</span>
            </div>
            <p className="text-justify leading-relaxed">
              پرداخت کلیه سفارشات در سایت فروشگاه شیاسی منحصراً از طریق اتصال مستقیم و امن به درگاه‌های پرداخت اینترنتی مجاز تحت نظارت بانک مرکزی جمهوری اسلامی ایران (شبکه الکترونیکی پرداخت کارت - شاپرک / زرین‌پال) صورت می‌پذیرد.
            </p>
          </div>

          <ul className="space-y-2 list-disc list-inside text-slate-700 dark:text-slate-300">
            <li>
              <strong>عدم ذخیره رمز و CVV2:</strong> شماره ۱۶ رقمی کارت، رمز دوم (رمز پویا)، تاریخ انقضا و کد اعتبارسنجی (CVV2) منحصراً در صفحه رسمی درگاه شاپرک وارد شده و هیچ‌یک از سرورها یا پرسنل فروشگاه شیاسی امکان مشاهده، رهگیری یا ذخیره‌سازی این اطلاعات را ندارند.
            </li>
            <li>
              <strong>تاییدیه سلامت تراکنش:</strong> تنها اطلاعاتی که پس از پرداخت موفق به سامانه ما مخابره می‌شود، شماره تراکنش بانکی (شماره پیگیری و شماره مرجع RRN) به همراه مبلغ پرداختی است که جهت ثبت وضعیت سفارش در فاکتور استفاده می‌شود.
            </li>
            <li>
              <strong>هشدار امنیتی فیشینگ:</strong> به کاربران گرامی یادآوری می‌گردد هنگام پرداخت اینترنتی، همواره آدرس نوار مرورگر خود را بررسی کرده و اطمینان حاصل نمایند که درگاه بر روی دامنه معتبر <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">shaparak.ir</span> قرار دارد. فروشگاه شیاسی هیچ‌گاه از طریق پیامک یا شبکه‌های اجتماعی لینکی غیر از درگاه رسمی ارسال نخواهد کرد.
            </li>
          </ul>
        </section>

        {/* Section 4: Use of Information */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-850 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-850 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <h2>ماده ۴: اهداف استفاده و پردازش داده‌ها</h2>
          </div>

          <p>
            اطلاعات ثبت‌شده توسط کاربران صرفاً در راستای ارائه خدمات بهینه تجاری و فنی زیر به کار گرفته می‌شود:
          </p>

          <ol className="space-y-2.5 list-decimal list-inside text-slate-700 dark:text-slate-300">
            <li>
              <strong>تأیید هویت و امنیت ورود:</strong> ارسال کدهای یکبارمصرف پیامکی (OTP) برای ورود امن بدون رمز عبور به پنل کاربری و جلوگیری از دسترسی‌های غیرمجاز.
            </li>
            <li>
              <strong>انجام تعهدات خرید و بسته‌بندی:</strong> آماده‌سازی تجهیزات برقی، بسته‌بندی ایمن کابل‌ها، قطعات حساس صنعتی و صدور بارنامه حمل‌ونقل پستی یا باربری.
            </li>
            <li>
              <strong>اطلاع‌رسانی وضعیت سفارش و تعمیرات:</strong> ارسال پیامک‌های سیستمی شامل کد پیگیری پستی، بارنامه، تایید پرداخت و اطلاعیه آماده‌باش تحویل کالای تعمیری از کارگاه نجف‌آباد.
            </li>
            <li>
              <strong>رسیدگی به شکایات و خدمات پس از فروش:</strong> بررسی ادعاهای نقص فنی، مطابقت استانداردهای خلوص مس سیم و کابل، و اعمال مهلت تست ۷ روزه قانونی کالا.
            </li>
            <li>
              <strong>پاسخ به سوالات فنی و پیش‌فاکتور BOM:</strong> بررسی لیست اقلام برقی پروژه‌ای که کاربران در فرم استعلام قیمت و BOM بارگذاری می‌کنند.
            </li>
          </ol>
        </section>

        {/* Section 5: Non-Disclosure & Third Parties */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-850 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-850 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <EyeOff className="w-4 h-4" />
            </div>
            <h2>ماده ۵: اصل عدم افشا و حدود دسترسی اشخاص ثالث</h2>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-850 border border-slate-300 dark:border-slate-750 text-slate-800 dark:text-slate-200">
            <p className="font-bold text-slate-900 dark:text-white mb-1">
              ضمانت صریح عدم فروش اطلاعات شخصی:
            </p>
            <p className="text-justify leading-relaxed">
              فروشگاه شیاسی تحت هیچ شرایطی اطلاعات هویتی، شماره تماس، آدرس‌ها یا سوابق خرید مشتریان را به اشخاص، شرکت‌های بازاریابی، آژانس‌های تبلیغاتی ثالث نفروخته، اجاره نداده و معاوضه نمی‌نماید.
            </p>
          </div>

          <p>
            اشتراک‌گذاری اطلاعات کاربران منحصراً به دو حالت زیر و با حداقل اطلاعات لازم محدود است:
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-500" />
                <span>۱. مأموران حمل‌ونقل و شرکت‌های پستی طرف قرارداد:</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 text-justify">
                صرفاً نام تحویل‌گیرنده، شماره تماس و نشانی پستی همراه با کد پستی جهت رساندن فیزیکی کالا در اختیار پست جمهوری اسلامی ایران، شرکت تیپاکس، چاپار یا باربری‌های شهری قرار می‌گیرد.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-purple-500" />
                <span>۲. دستور صریح مراجع قضایی و انتظامی ذی‌صلاح:</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 text-justify">
                چنانچه بر اساس حکم مکتوب و رسمی دادستانی، پلیس فتا یا سایر مراجع رسمی قضایی طبق مقررات جاری کشور، ارائه اطلاعات حساب کاربری یا سوابق تراکنش مطالبه گردد، فروشگاه شیاسی قانوناً مکلف به همکاری در حدود حکم صادره خواهد بود.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Security Safeguards */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-850 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-850 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2>ماده ۶: اقدامات فنی در حفظ امنیت سرور و داده‌ها</h2>
          </div>

          <p className="text-justify">
            فروشگاه اینترنتی شیاسی از مجموعه‌ای از استانداردها و فناوری‌های روز دنیا جهت حفاظت از داده‌ها در برابر دسترسی غیرمجاز، نفوذ یا افشا بهره می‌برد:
          </p>

          <ul className="space-y-2 list-disc list-inside text-slate-700 dark:text-slate-300">
            <li>
              <strong>گواهینامه امنیتی SSL/TLS:</strong> کلیه تبادلات داده میان مرورگر کاربر و سرورهای فروشگاه از طریق پروتکل رمزنگاری‌شده HTTPS انجام می‌شود.
            </li>
            <li>
              <strong>احراز هویت بدون رمز (Passwordless OTP):</strong> سامانه احراز هویت ما خطرات ناشی از لو رفتن رمزهای عبور ضعیف را با به‌کارگیری کدهای یکبارمصرف پیامکی ایمن به صفر رسانده است.
            </li>
            <li>
              <strong>کوکی‌های امنیتی ایمن با پرچم‌های سه‌گانه:</strong> توکن‌های ورود و نشست‌ها با ویژگی‌های امنیتی <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">HttpOnly</code>, <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">Secure</code> و <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">SameSite=Lax</code> حفاظت می‌شوند تا از حملات XSS و CSRF ممانعت به عمل آید.
            </li>
            <li>
              <strong>سطوح دسترسی محدود کارکنان:</strong> صرفاً پرسنل تأیید هویت شده کارگاه و بخش مالی در محدوده وظایف خود امکان مشاهده نشانی فاکتورها را جهت آماده‌سازی سفارش دارند.
            </li>
          </ul>
        </section>

        {/* Section 7: User Rights */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-850 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-850 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <h2>ماده ۷: حقوق کاربران و امکان ویرایش اطلاعات</h2>
          </div>

          <p className="text-justify">
            کاربران در هر زمان حق دارند به اطلاعات شخصی خود در پنل کاربری دسترسی داشته و نسبت به اصلاح، تغییر آدرس‌های تحویل یا شماره‌های تماس اقدام نمایند.
          </p>

          <p className="text-justify">
            همچنین کاربر می‌تواند در صورت تمایل درخواست حذف یا غیرفعال‌سازی حساب کاربری خود را ثبت نماید؛ مشروط بر اینکه سفارش جاری در حال ارسال، صورت‌حساب مالی تسویه‌نشده، کالای در دست تعمیر در کارگاه یا پرونده گارانتی باز نداشته باشد. داده‌های مالیاتی و سوابق فاکتورهای رسمی بر اساس الزامات قانونی اداره مالیات به مدت ۵ سال در آرشیو حسابداری نگهداری می‌شوند.
          </p>
        </section>

        {/* Section 8: Minors & Hazardous Electrical Goods */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-850 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-850 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h2>ماده ۸: محدودیت سنی و خرید تجهیزات تخصصی برق</h2>
          </div>

          <p className="text-justify">
            با توجه به اینکه محصولات عرضه شده در فروشگاه شیاسی شامل تجهیزات برق فشار قوی، کابل‌های صنعتی، دینام و خازن‌های الکتریکی با پتانسیل خطرات جانی و آتش‌سوزی در صورت نصب ناصحیح می‌باشد، ثبت سفارش آنلاین منحصراً برای افراد دارای حداقل ۱۸ سال تمام خورشیدی یا با نظارت و مسئولیت مستقیم والدین و سرپرستان قانونی مجاز است.
          </p>
        </section>

        {/* Section 9: Data Officer & Contact */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-850 shadow-sm space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed transition-colors duration-200">
          <div className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-base border-b border-slate-100 dark:border-slate-850 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <h2>ماده ۹: راه‌های ارتباطی و طرح سوالات درباره حریم خصوصی</h2>
          </div>

          <p className="text-justify">
            در صورت وجود هرگونه پرسش، ابهام، پیشنهاد یا درخواست بررسی پیرامون سیاست حفظ حریم خصوصی، می‌توانید مستقیماً از طریق راه‌های زیر با واحد حقوقی و پشتیبانی فروشگاه برق شیاسی ارتباط برقرار فرمایید:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-center space-y-1">
              <Phone className="w-5 h-5 text-emerald-500 mx-auto" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">تلفن‌های ثابت فروشگاه</div>
              <div className="font-mono text-xs text-amber-600 dark:text-amber-400 font-bold" dir="ltr">
                ۰۳۱-۴۲۶۲۶۱۱۶ | ۴۲۶۲۶۱۰۷
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-center space-y-1">
              <Phone className="w-5 h-5 text-emerald-500 mx-auto" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">پشتیبانی همراه و پیام‌رسان</div>
              <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold" dir="ltr">
                ۰۹۱۳-۶۲۶-۰۰۷۲
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-center space-y-1">
              <MapPin className="w-5 h-5 text-amber-500 mx-auto" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">نشانی فیزیکی کارگاه و فروشگاه</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                نجف‌آباد، خیابان امام، روبروی مسجد ارشاد
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
