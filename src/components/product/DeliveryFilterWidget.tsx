"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Truck, Zap, Check, ChevronDown } from "lucide-react";

interface DeliveryFilterWidgetProps {
  fastDeliveryOnly: boolean;
  inStockOnly: boolean;
  params: Record<string, any>;
}

export function DeliveryFilterWidget({
  fastDeliveryOnly,
  inStockOnly,
  params,
}: DeliveryFilterWidgetProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
      {/* Clickable Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-right font-bold text-sm text-slate-900 dark:text-white hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors select-none"
      >
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>وضعیت ارسال و موجودی</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180 text-amber-500" : ""
          }`}
        />
      </button>

      {/* Smooth Animated Collapsible Content via CSS Grid */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 sm:p-5 pt-0 space-y-2.5 text-xs border-t border-slate-100 dark:border-slate-800/60">
            <Link
              href={{
                pathname: "/products",
                query: { ...params, fast: fastDeliveryOnly ? undefined : "true", page: undefined },
              }}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                fastDeliveryOnly
                  ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300 font-bold"
                  : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>تحویل فوری در نجف‌آباد</span>
              </div>
              <div
                className={`w-4 h-4 rounded flex items-center justify-center ${
                  fastDeliveryOnly ? "bg-emerald-600 text-white" : "border border-slate-300 dark:border-slate-600"
                }`}
              >
                {fastDeliveryOnly && <Check className="w-3 h-3" />}
              </div>
            </Link>

            <Link
              href={{
                pathname: "/products",
                query: { ...params, instock: inStockOnly ? undefined : "true", page: undefined },
              }}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                inStockOnly
                  ? "bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-300 font-bold"
                  : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>فقط کالاهای موجود در انبار</span>
              </div>
              <div
                className={`w-4 h-4 rounded flex items-center justify-center ${
                  inStockOnly ? "bg-blue-600 text-white" : "border border-slate-300 dark:border-slate-600"
                }`}
              >
                {inStockOnly && <Check className="w-3 h-3" />}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
