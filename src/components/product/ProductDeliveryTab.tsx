import React from "react";
import { Truck, Navigation, Package } from "lucide-react";

export function ProductDeliveryTab() {
  return (
    <div
      id="panel-isfahan"
      role="tabpanel"
      aria-labelledby="tab-isfahan"
      className="space-y-5 max-w-4xl animate-in fade-in zoom-in-98 duration-200"
    >
      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold text-sm sm:text-base">
        <Truck className="w-5 h-5" />
        <span>روش‌ها و زمان‌بندی ارسال سفارشات در نجف‌آباد، اصفهان و کشور</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1: Snapp Fast Delivery */}
        <div className="group bg-slate-50 dark:bg-slate-850 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-750 space-y-2 hover:border-emerald-500/60 transition-all shadow-2xs hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Truck className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
              زیر ۲ ساعت
            </span>
          </div>
          <strong className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            ارسال فوری با اسنپ‌باکس
          </strong>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            تحویل سریع در کلیه مناطق نجف‌آباد، ویلاشهر، گلدشت، یزدانشهر و اصفهان در همان روز.
          </p>
        </div>

        {/* Step 2: Store Pickup */}
        <div className="group bg-slate-50 dark:bg-slate-850 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-750 space-y-2 hover:border-amber-500/60 transition-all shadow-2xs hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Navigation className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
              تست حضوری
            </span>
          </div>
          <strong className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            تحویل حضوری در فروشگاه
          </strong>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            امکان مراجعه مستقیم به شعبه مرکزی نجف‌آباد (۱۵ خرداد مرکزی، نبش بن‌بست نرگس) با امکان تست سلامت کالا قبل از تحویل.
          </p>
        </div>

        {/* Step 3: Nationwide Tipax */}
        <div className="group bg-slate-50 dark:bg-slate-850 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-750 space-y-2 hover:border-blue-500/60 transition-all shadow-2xs hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Package className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-300 dark:border-blue-700">
              ۲۴ تا ۴۸ ساعت
            </span>
          </div>
          <strong className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            ارسال تیپاکس و پست پیشتاز
          </strong>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            ارسال بسته‌بندی ایمن و استاندارد به سراسر کشور با بیمه کامل و کد رهگیری مرسوله.
          </p>
        </div>
      </div>
    </div>
  );
}
