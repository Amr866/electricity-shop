"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function BrandLogosRow() {
  const brands = [
    { name: "پارس خزر (Pars Khazar)", slug: "pars-khazar" },
    { name: "الکتروموتور موتوژن", slug: "motogen" },
    { name: "صنایع اخوان", slug: "akhavan" },
    { name: "آنتن و دیجیتال هانی", slug: "hani" },
    { name: "افراتاب (Afratab)", slug: "afratab" },
    { name: "پارس شهاب", slug: "pars-shahab" },
    { name: "هیوندای الکتریک", slug: "hyundai" },
    { name: "شیوا امواج", slug: "shiva-amvaj" },
    { name: "سیم و کابل اصفهان", slug: "isfahan-cable" },
    { name: "دلند الکتریک", slug: "deland" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-200">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <span>برندهای معتبر و کارخانجات همکار</span>
        </h3>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">ضمانت اصالت و گارانتی شرکتی</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {brands.map((b) => (
          <Link
            key={b.slug}
            href={`/products?q=${encodeURIComponent(b.name.split(" ")[0])}`}
            className="group p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-amber-50/70 dark:hover:bg-slate-700/80 border border-slate-100 dark:border-slate-700/60 hover:border-amber-200 dark:hover:border-amber-500/50 transition-all text-center flex items-center justify-center min-h-[56px]"
          >
            <span className="font-extrabold text-xs text-slate-700 dark:text-slate-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {b.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
