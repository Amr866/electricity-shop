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
  Wrench,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 space-y-10">
        
        {/* Header Hero */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Zap className="w-8 h-8 fill-slate-950" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            درباره فروشگاه تخصصی شیاسی
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            مرکز معتبر تامین و توزیع تجهیزات برق ساختمانی، روشنایی، لوازم برقی خانگی و کارگاه تخصصی تعمیرات انواع پنکه، موتور کولر، بخاری و آنتن در نجف‌آباد اصفهان.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-slate-800 dark:text-slate-200 leading-loose text-xs sm:text-sm text-justify transition-colors duration-200">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white border-r-4 border-amber-500 pr-3">
            داستان ما و تعهد به کیفیت و خدمات تخصصی
          </h2>
          <p>
            فروشگاه تخصصی شیاسی با هدف ارائه کالاهای باکیفیت و استاندارد برقی و لوازم خانگی به قیمت دست‌اول در نجف‌آباد اصفهان پایه‌گذاری شد. امروزه ما با همکاری مستقیم با برترین کارخانجات تولیدی لوازم برقی (پارس خزر، موتوژن تبریز، اخوان، هانی) و تولیدکنندگان سیم و کابل استاندارد مس، علاوه بر فروش مطمئن، مجهز به کارگاه فنی تعمیرات و سیم‌پیچی الکتروموتورها و لوازم خانگی هستیم.
          </p>
          <p>
            ما در فروشگاه شیاسی اصالت ۱۰۰٪ مس، گارانتی معتبر قطعات و ضمانت مهلت تست تعمیرات را برای کلیه همشهریان عزیز و مشتریان سراسر کشور تضمین می‌نماییم.
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 transition-colors duration-200">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">کارگاه تعمیرات تخصصی</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              عیب‌یابی و تعمیر انواع پنکه، موتور کولر آبی، بخاری برقی، آنتن و بردهای الکترونیک با قطعات اصلی.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 transition-colors duration-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">ارسال فوری در نجف‌آباد و اصفهان</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              تحویل سریع با اسنپ‌باکس و پیک اختصاصی در نجف‌آباد، ویلاشهر، گلدشت، یزدانشهر و اصفهان.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 transition-colors duration-200">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">ضمانت اصالت و سلامت</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              فروش کالاهای اورجینال با مهلت تست، گارانتی شرکتی و ارائه فاکتور رسمی پروژه‌ای.
            </p>
          </div>
        </div>

        {/* Visit Us CTA */}
        <div className="bg-slate-900 dark:bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
          <div className="space-y-1 text-center sm:text-right">
            <h3 className="font-extrabold text-base text-amber-400">مشتاق دیدار شما در فروشگاه شیاسی هستیم</h3>
            <p className="text-xs text-slate-400">اصفهان، نجف‌آباد، ۱۵ خرداد مرکزی، نبش بن‌بست نرگس (فروشگاه شیاسی)</p>
          </div>
          <Link
            href="/contact"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 active:scale-95"
          >
            <span>اطلاعات تماس و نقشه</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
