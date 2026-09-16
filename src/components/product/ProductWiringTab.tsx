"use client";

import React, { useState } from "react";
import { Cpu, Printer, Activity, AlertTriangle } from "lucide-react";

export interface TerminalPin {
  color: string;
  colorName: string;
  label: string;
  functionDesc: string;
}

export interface WiringSchematicData {
  title: string;
  diagramSubtitle: string;
  terminals: TerminalPin[];
}

interface ProductWiringTabProps {
  wiringSchematic: WiringSchematicData;
}

export function ProductWiringTab({ wiringSchematic }: ProductWiringTabProps) {
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const handleDownloadDatasheet = () => {
    setDownloadingPdf(true);
    setTimeout(() => {
      setDownloadingPdf(false);
      window.print();
    }, 400);
  };

  return (
    <div
      id="panel-wiring"
      role="tabpanel"
      aria-labelledby="tab-wiring"
      className="space-y-6 max-w-4xl animate-in fade-in zoom-in-98 duration-200"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-500" />
            <span>{wiringSchematic.title}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {wiringSchematic.diagramSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadDatasheet}
          disabled={downloadingPdf}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0 active:scale-95 hover-glow"
        >
          <Printer className="w-4 h-4" />
          <span>{downloadingPdf ? "در حال آماده‌سازی پرینت..." : "چاپ شناسنامه فنی (Datasheet)"}</span>
        </button>
      </div>

      {/* Interactive Visual Color-Coded Terminal Block Diagram */}
      <div className="bg-slate-50 dark:bg-slate-850 p-4 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-750 space-y-4">
        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          <span>راهنمای رنگ‌بندی و پین‌های ترمینال اتصال:</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {wiringSchematic.terminals.map((term, i) => (
            <div
              key={i}
              className="group bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3 hover:border-amber-400/80 transition-all shadow-2xs hover:-translate-y-0.5"
            >
              <div
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold shrink-0 shadow-2xs border ${term.color}`}
              >
                {term.colorName}
              </div>
              <div className="min-w-0">
                <strong className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {term.label}
                </strong>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed block mt-0.5 font-medium">
                  {term.functionDesc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Alert Box */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 rounded-2xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-amber-950 dark:text-amber-300 leading-relaxed font-medium">
          <strong className="block font-bold">نکته ایمنی و نصب تخصصی کارگاه شیاسی:</strong>
          <p>
            قبل از هرگونه اقدام به اتصال، سیم‌کشی یا تعویض قطعه، جریان برق اصلی را از فیوز یا کلید مینیاتوری قطع نمایید. در صورت نیاز به راهنمایی در نقشه سیم‌بندی، کارشناسان کارگاه فنی شیاسی نجف‌آباد آماده پاسخگویی هستند.
          </p>
        </div>
      </div>
    </div>
  );
}
