"use client";

import React, { useState } from "react";
import { Printer, MessageCircle, Copy, Check } from "lucide-react";
import { formatToman } from "@/lib/utils";
import { useBrand } from "@/context/BrandContext";

interface OrderInvoiceActionsProps {
  orderNumber: string;
  totalAmount: number;
}

export function OrderInvoiceActions({
  orderNumber,
  totalAmount,
}: OrderInvoiceActionsProps) {
  const { brand } = useBrand();
  const [copied, setCopied] = useState(false);

  const whatsappNumber = brand.mobile ? `98${brand.mobile.replace(/^0/, "")}` : "989162665884";

  const whatsappShareText = encodeURIComponent(
    `سلام، سفارش من در فروشگاه تخصصی شیاسی با شماره فاکتور ${orderNumber} به مبلغ ${formatToman(
      totalAmount
    )} ثبت گردید.`
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto sm:flex sm:items-center sm:gap-2 print:hidden">
      {/* 1. Copy Order ID */}
      <button
        type="button"
        onClick={handleCopy}
        className="h-10 sm:h-9 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-200 text-xs font-bold px-2 sm:px-3 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer group shadow-2xs backdrop-blur-xs"
        title="کپی شماره سفارش"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-500 animate-in zoom-in-50 duration-200 shrink-0" />
            <span className="text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap">کپی شد!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 group-hover:scale-110 transition-transform shrink-0" />
            <span className="whitespace-nowrap">کپی کد</span>
          </>
        )}
      </button>

      {/* 2. WhatsApp Inquiry */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappShareText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="h-10 sm:h-9 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/70 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 text-xs font-bold px-2 sm:px-3 rounded-xl border border-emerald-200 dark:border-emerald-800/70 flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 group shadow-2xs whitespace-nowrap backdrop-blur-xs"
      >
        <MessageCircle className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-200 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>واتساپ</span>
      </a>

      {/* 3. Print Official Invoice Button */}
      <button
        type="button"
        onClick={() => window.print()}
        className="h-10 sm:h-9 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-2 sm:px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer group shadow-sm shadow-amber-500/15 whitespace-nowrap"
      >
        <Printer className="w-3.5 h-3.5 text-slate-950 group-hover:scale-110 transition-transform shrink-0" />
        <span>چاپ فاکتور</span>
      </button>
    </div>
  );
}
