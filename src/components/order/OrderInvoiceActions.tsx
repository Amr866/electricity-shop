"use client";

import React from "react";
import { Printer, MessageCircle } from "lucide-react";
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
  const whatsappNumber = brand.mobile ? `98${brand.mobile.replace(/^0/, "")}` : "989162665884";

  const whatsappShareText = encodeURIComponent(
    `سلام، سفارش من در فروشگاه تخصصی شیاسی با شماره فاکتور ${orderNumber} به مبلغ ${formatToman(
      totalAmount
    )} ثبت گردید.`
  );

  return (
    <div className="flex items-center gap-2 no-print">
      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappShareText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>پیگیری در واتساپ</span>
      </a>

      <button
        onClick={() => window.print()}
        className="bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-black px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
      >
        <Printer className="w-3.5 h-3.5 text-amber-400 dark:text-slate-950" />
        <span>چاپ فاکتور رسمی</span>
      </button>
    </div>
  );
}
