import React from "react";
import Link from "next/link";
import {
  Zap,
  ShieldCheck,
  Award,
  Truck,
  Building,
  Users,
  CheckCircle2,
  ArrowLeft,
  MapPin,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 space-y-10">
        
        {/* Header Hero */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Zap className="w-8 h-8 fill-slate-950" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            درباره فروشگاه الکتریک نقش جهان اصفهان
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            بیش از یک دهه تجربه در تامین و توزیع تخصصی تجهیزات برق ساختمانی، اتوماسیون صنعتی و قطعات الکترونیک در قلب بازار برق اصفهان.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6 text-slate-800 leading-loose text-xs sm:text-sm text-justify">
          <h2 className="text-lg font-extrabold text-slate-900 border-r-4 border-amber-500 pr-3">
            داستان ما و تعهد به کیفیت در نصف جهان
          </h2>
          <p>
            فروشگاه کالای برق و الکترونیک نقش جهان با هدف ارائه کالاهای باکیفیت و استاندارد برقی با قیمت دست‌اول در خیابان فردوسی اصفهان پایه‌گذاری شد. امروزه ما با همکاری مستقیم با برترین کارخانجات تولیدی سیم و کابل کشور (مانند سیم و کابل اصفهان، البرز الکتریک، کات کابل) و برترین برندهای روشنایی و صنعتی (پارس شعاع توس، پارس شهاب، هیوندای، شیوا امواج)، پاسخگوی نیازهای سازندگان، مهندسین ناظر، برق‌کاران و پژوهشگران الکترونیک در استان اصفهان و سراسر کشور هستیم.
          </p>
          <p>
            یکی از مهم‌ترین چالش‌های سازندگان محترم در بازار، وجود سیم‌های تقلبی با هادی‌های ناخالص مس یا CCA است. ما در الکتریک نقش جهان اصالت ۱۰۰٪ مس و تطابق کامل با استانداردهای نظام مهندسی را تضمین می‌نماییم.
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">تضمین ۱۰۰٪ اصالت مس</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              ارائه سیم و کابل دارای گواهی استاندارد ملی ایران و تاییدیه توانیر بدون افت ولتاژ.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">ارسال فوری در اصفهان</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              تحویل ۲ الی ۳ ساعته با اسنپ‌باکس در کلیه مناطق شهری اصفهان و ارسال تیپاکس کشوری.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">فاکتور رسمی پروژه‌ای</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              امکان صدور پیش‌فاکتور و فاکتور رسمی با مهر معتبر برای ارگان‌ها و پیمانکاران.
            </p>
          </div>
        </div>

        {/* Visit Us CTA */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-right">
            <h3 className="font-extrabold text-base text-amber-400">مشتاق دیدار شما در شعبه اصفهان هستیم</h3>
            <p className="text-xs text-slate-400">اصفهان، خیابان فردوسی، نرسیده به چهارراه فلسطین، پلاک ۱۲۸</p>
          </div>
          <Link
            href="/contact"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>اطلاعات تماس و نقشه</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
