"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { formatToman, toPersianDigits, formatJalaliDateTime } from "@/lib/utils";
import { Printer, Copy, Check, Store, Phone } from "lucide-react";
import { TactileButton } from "@/components/ui/TactileButton";
import { PerforatedStamp } from "@/components/ui/PerforatedStamp";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: {
    name: string;
  } | null;
}

interface ThermalReceiptProps {
  order: {
    orderNumber: string;
    createdAt: Date | string;
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    totalAmount: number;
    subtotalAmount?: number;
    shippingCost?: number;
    discountAmount?: number;
    paymentStatus: string;
    orderStatus: string;
    paymentMethod?: string;
    shippingMethod?: string;
    items: OrderItem[];
  };
}

export function ThermalReceipt({ order }: ThermalReceiptProps) {
  const [copied, setCopied] = useState(false);
  const [printerStage, setPrinterStage] = useState<"idle" | "printing" | "complete">("idle");
  const [feedKey, setFeedKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAutoPrintedRef = useRef(false);

  // Mathematical Procedural Tooth Edge (inspired by ReceiptPrinter)
  const { topToothClipPath, bottomToothClipPath } = useMemo(() => {
    const toothCount = 36;
    const toothDepth = 4; // px

    // Points for bottom zigzag tear
    const bottomPoints = Array.from({ length: toothCount * 2 }, (_, index) => {
      const x = 100 - ((index + 1) * 100) / (toothCount * 2);
      const y = index % 2 === 0 ? "100%" : `calc(100% - ${toothDepth}px)`;
      return `${x.toFixed(2)}% ${y}`;
    }).join(", ");

    // Points for top zigzag tear
    const topPoints = Array.from({ length: toothCount * 2 }, (_, index) => {
      const x = ((index + 1) * 100) / (toothCount * 2);
      const y = index % 2 === 0 ? "0%" : `${toothDepth}px`;
      return `${x.toFixed(2)}% ${y}`;
    }).join(", ");

    return {
      bottomToothClipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${toothDepth}px), ${bottomPoints})`,
      topToothClipPath: `polygon(0% ${toothDepth}px, ${topPoints}, 100% 100%, 0% 100%)`,
    };
  }, []);

  // Automatic trigger: when scrolling down to this section, smooth-scroll to center and auto-feed the receipt
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAutoPrintedRef.current) {
          hasAutoPrintedRef.current = true;

          // Gentle pause, then smoothly scroll window down to frame the machine and feed
          setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth", block: "center" });

            setTimeout(() => {
              setFeedKey((k) => k + 1);
              setPrinterStage("printing");

              setTimeout(() => {
                setPrinterStage("complete");
              }, 2200);
            }, 300);
          }, 200);
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReplay = () => {
    if (printerStage === "printing") return;
    setFeedKey((k) => k + 1);
    setPrinterStage("printing");
    setTimeout(() => {
      setPrinterStage("complete");
    }, 2200);
  };

  const isPaid = order.paymentStatus === "PAID";

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center w-full max-w-md mx-auto my-6 select-none"
    >
      
      {/* Quick Action Bar on Top */}
      <div className="flex flex-wrap items-center justify-between gap-2 w-full mb-3 print:hidden px-1">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          فاکتور حرارتی الکترونیک
        </span>

        <div className="flex items-center gap-2">
          <TactileButton
            variant="outline"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? "کپی شد" : "کپی کد"}
          </TactileButton>

          <TactileButton
            variant="amber"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
          >
            چاپ رسید
          </TactileButton>
        </div>
      </div>

      {/* 
        1. POS Machine Head Housing (Display & Physical Slit Aperture)
      */}
      <div
        onClick={handleReplay}
        className="w-full bg-slate-900 dark:bg-slate-950 p-3.5 pt-4 pb-2.5 rounded-t-3xl border border-b-0 border-slate-750 dark:border-slate-800 shadow-xl relative z-30 print:hidden cursor-pointer group transition-all"
        title="کلیک برای چاپ مجدد رسید"
      >
        {/* Machine Status Screen */}
        <div className="flex items-center justify-between text-[11px] font-mono px-1.5 text-slate-300">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                printerStage === "printing"
                  ? "bg-amber-400 animate-ping"
                  : isPaid
                  ? "bg-emerald-400"
                  : "bg-amber-400"
              }`}
            />
            <span className="font-bold text-white text-xs">
              {printerStage === "printing"
                ? "در حال تغذیه و چاپ کاغذ..."
                : isPaid
                ? "آماده | فاکتور پرداخت‌شده"
                : "آماده | در انتظار تسویه"}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">EPSON TM-T88</span>
        </div>

        {/* Physical Paper Slot Aperture with Metal Blade */}
        <div
          aria-hidden="true"
          className="relative mt-3 h-2.5 rounded-sm bg-black border border-slate-700/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)] mx-3 flex items-center justify-center overflow-hidden"
        >
          <div className="w-full h-[1px] bg-slate-700/70" />
        </div>
      </div>

      {/* 
        2. Thermal Receipt Paper Ejection Tunnel
        Strictly clipped with overflow-hidden so the paper feeds OUT of the machine slot.
        Nothing above y=0 is ever visible!
      */}
      <div className="relative w-full overflow-hidden flex flex-col items-center z-20 -mt-0.5 print:mt-0 print:overflow-visible">
        <div
          key={feedKey}
          id="thermal-receipt-paper"
          className={`w-[94%] bg-[#faf8f5] dark:bg-[#161a22] print:bg-white text-slate-800 dark:text-slate-200 print:text-black border-x border-slate-300 dark:border-slate-700 print:border-black shadow-2xl relative font-mono text-xs origin-top transition-transform duration-300 ${
            printerStage === "printing" ? "animate-stepped-receipt-feed" : ""
          }`}
          style={{
            clipPath: bottomToothClipPath,
            filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.15))",
            transform: printerStage === "idle" ? "translateY(calc(-100% + 4px))" : undefined,
          }}
        >
        {/* Paper Content Area */}
        <div className="p-4 sm:p-7 pt-6 pb-9 space-y-4">
          
          {/* Header & Logo */}
          <div className="text-center space-y-1.5 border-b-2 border-dashed border-slate-300 dark:border-slate-700 pb-4">
            <div className="flex items-center justify-center gap-1.5 text-amber-600 dark:text-amber-400 font-black text-sm sm:text-base">
              <Store className="w-4 h-4" />
              <span>فروشگاه الکتریک و کالای برق شیاسی</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              نجف‌آباد، خیابان شریعتی، بعد از کوچه بهمن
            </p>
            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>۰۳۱-۴۲۶۲۲۱۴۳</span>
              </span>
              <span>|</span>
              <span>کد صنف: ۶۴۰۲۳</span>
            </div>
          </div>

          {/* Order Metadata */}
          <div className="space-y-1.5 text-[11px] border-b border-dashed border-slate-300 dark:border-slate-700 pb-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">شماره رهگیری فاکتور:</span>
              <span className="font-black text-slate-900 dark:text-white tracking-widest bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                #{order.orderNumber}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">زمان صدور رسید:</span>
              <span className="text-slate-700 dark:text-slate-300">
                {formatJalaliDateTime(order.createdAt)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">مشتری گرامی:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {order.customerName} ({toPersianDigits(order.customerPhone)})
              </span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-2 border-b border-dashed border-slate-300 dark:border-slate-700 pb-3">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase pb-1">
              <span>شرح کالا / تعداد</span>
              <span>مبلغ کل</span>
            </div>

            <div className="space-y-2.5">
              {order.items.map((item, idx) => (
                <div key={item.id || idx} className="space-y-0.5">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-slate-900 dark:text-white leading-tight">
                      {item.product?.name || "کالای برقی"}
                    </span>
                    <span className="font-bold shrink-0 text-slate-900 dark:text-white">
                      {formatToman(item.totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>
                      {toPersianDigits(item.quantity)} عدد × {formatToman(item.unitPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Totals */}
          <div className="space-y-1.5 text-[11px] border-b-2 border-dashed border-slate-300 dark:border-slate-700 pb-3">
            {order.subtotalAmount && (
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>جمع اقلام:</span>
                <span>{formatToman(order.subtotalAmount)}</span>
              </div>
            )}
            {order.shippingCost !== undefined && (
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>هزینه بسته‌بندی و ارسال:</span>
                <span>{order.shippingCost === 0 ? "رایگان" : formatToman(order.shippingCost)}</span>
              </div>
            )}
            {order.discountAmount && order.discountAmount > 0 ? (
              <div className="flex justify-between text-rose-600 dark:text-rose-400 font-bold">
                <span>تخفیف ویژه:</span>
                <span>-{formatToman(order.discountAmount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between items-baseline pt-1.5 text-xs sm:text-sm font-black text-slate-950 dark:text-white border-t border-slate-200 dark:border-slate-700">
              <span>مبلغ پرداختی نهایی:</span>
              <span className="text-amber-600 dark:text-amber-400 font-mono text-base font-black">
                {formatToman(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* 3. Official Perforated Inspection Stamp (From user's procedural Stamp pattern) */}
          <div className="relative py-2 flex items-center justify-center">
            <PerforatedStamp
              variant={isPaid ? "emerald" : "amber"}
              horizontalPerforations={12}
              verticalPerforations={7}
              rotation={-3}
            >
              <div className="font-black text-xs uppercase tracking-wider px-2">
                {isPaid ? "پرداخت آنلاین تایید شد" : "در انتظار پرداخت"}
              </div>
              <div className="text-[9px] font-bold text-slate-600 dark:text-slate-300">
                فروشگاه شیاسی - شعبه نجف‌آباد
              </div>
              <div className="text-[8px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                تاییدیه انبار و تست سلامت فیزیکی
              </div>
            </PerforatedStamp>
          </div>

          {/* Barcode Graphic */}
          <div className="pt-2 flex flex-col items-center justify-center space-y-1">
            <div 
              aria-hidden="true" 
              className="w-48 h-10 opacity-80"
              style={{
                backgroundImage: "repeating-linear-gradient(90deg, #1e293b, #1e293b 2px, transparent 2px, transparent 4px, #1e293b 4px, #1e293b 7px, transparent 7px, transparent 9px, #1e293b 9px, #1e293b 13px, transparent 13px, transparent 15px)",
              }}
            />
            <span className="text-[9px] font-mono tracking-widest text-slate-500">
              * {order.orderNumber} *
            </span>
          </div>

          {/* Footer note */}
          <div className="text-center text-[10px] text-slate-400 dark:text-slate-500 pt-1">
            این فاکتور به منزله سند تحویل کالا و برگه ضمانت تست سلامت فیزیکی می‌باشد.
          </div>

        </div>
      </div>
    </div>

      <style jsx global>{`
        @keyframes stepped-feed {
          0% {
            transform: translateY(calc(-100% + 4px));
            opacity: 1;
          }
          8% {
            transform: translateY(calc(-100% + 4px));
          }
          14% {
            transform: translateY(-90%);
          }
          20% {
            transform: translateY(-90%);
          }
          28% {
            transform: translateY(-78%);
          }
          36% {
            transform: translateY(-78%);
          }
          44% {
            transform: translateY(-60%);
          }
          52% {
            transform: translateY(-60%);
          }
          62% {
            transform: translateY(-40%);
          }
          70% {
            transform: translateY(-40%);
          }
          80% {
            transform: translateY(-20%);
          }
          88% {
            transform: translateY(-20%);
          }
          96% {
            transform: translateY(-4%);
          }
          100% {
            transform: translateY(0%);
            opacity: 1;
          }
        }
        .animate-stepped-receipt-feed {
          animation: stepped-feed 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform;
        }
      `}</style>

    </div>
  );
}
