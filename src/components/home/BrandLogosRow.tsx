"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";

export function BrandLogosRow() {
  const brands = [
    { name: "افراتاب (Afratab)", slug: "afratab" },
    { name: "پارس شهاب", slug: "pars-shahab" },
    { name: "هیوندای الکتریک", slug: "hyundai" },
    { name: "شیوا امواج", slug: "shiva-amvaj" },
    { name: "صنایع زانیس (Zanis)", slug: "zanis" },
    { name: "شاهچراغ پارسیان", slug: "shahcheraq" },
    { name: "مودی (Modi)", slug: "modi" },
    { name: "پرتو درخشان (GCC)", slug: "gcc" },
    { name: "دلند الکتریک", slug: "deland" },
    { name: "آوا (Awa)", slug: "awa" },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <span>برندهای معتبر و کارخانجات همکار</span>
        </h3>
        <span className="text-[11px] text-slate-400">ضمانت اصالت و گارانتی شرکتی</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {brands.map((b) => (
          <Link
            key={b.slug}
            href={`/products?q=${encodeURIComponent(b.name.split(" ")[0])}`}
            className="group p-3 rounded-2xl bg-slate-50 hover:bg-amber-50/70 border border-slate-100 hover:border-amber-200 transition-all text-center flex items-center justify-center min-h-[56px]"
          >
            <span className="font-extrabold text-xs text-slate-700 group-hover:text-amber-700 transition-colors">
              {b.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
