"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function BrandLogosRow() {
  const brands = [
    { name: "پارس خزر", tag: "ضمانت ۲۴ ماهه", slug: "pars-khazar" },
    { name: "موتوژن تبریز", tag: "سیم مس ۱۰۰٪", slug: "motogen" },
    { name: "البرز الکتریک", tag: "کابل استاندارد", slug: "alborz" },
    { name: "صنایع اخوان", tag: "هیتر و بخاری", slug: "akhavan" },
    { name: "آنتن هانی", tag: "تقویت سیگنال", slug: "hani" },
    { name: "افراتاب", tag: "روشنایی LED", slug: "afratab" },
    { name: "پارس شهاب", tag: "لامپ فوق‌کم‌مصرف", slug: "pars-shahab" },
    { name: "شیوا امواج", tag: "کنترل و رله", slug: "shiva-amvaj" },
    { name: "سیم کابل اصفهان", tag: "هادی تمام مس", slug: "isfahan-cable" },
    { name: "دلند الکتریک", tag: "کلید و پریز", slug: "deland" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-200">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <span>عاملیت رسمی و برندهای همکار کارگاه شیاسی</span>
        </h3>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">ضمانت اصالت و گارانتی شرکتی</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {brands.map((b) => (
          <Link
            key={b.slug}
            href={`/products?q=${encodeURIComponent(b.name.split(" ")[0])}`}
            className="group p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-400 transition-all text-center flex flex-col items-center justify-center min-h-[64px] shadow-sm hover:shadow-md"
          >
            <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {b.name}
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-300 mt-0.5 font-medium">
              {b.tag}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
