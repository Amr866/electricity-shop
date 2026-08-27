"use client";

import React from "react";
import { Printer, MessageCircle } from "lucide-react";
import { formatToman } from "@/lib/utils";

interface OrderInvoiceActionsProps {
  orderNumber: string;
  totalAmount: number;
}

export function OrderInvoiceActions({
  orderNumber,
  totalAmount,
}: OrderInvoiceActionsProps) {
  const whatsappShareText = encodeURIComponent(
    `سلام، سفارش من در فروشگاه تخصصی شیاسی با شماره فاکتور ${orderNumber} به مبلغ ${formatToman(
      totalAmount
    )} ثبت گردید.`
  );

  return (
    <div className="flex items-center gap-2 no-print">
      <a
        href={`https://wa.me/989131112233?text=${whatsappShareText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-2 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>پیگیری در واتساپ</span>
      </a>

      <button
        onClick={() => window.print()}
        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
      >
        <Printer className="w-3.5 h-3.5 text-amber-400" />
        <span>چاپ فاکتور رسمی</span>
      </button>
    </div>
  );
}
