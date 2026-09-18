"use client";

import React, { useState, useEffect, useRef } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description?: string;
  itemCount: number;
  itemType?: string;
  isPurge?: boolean;
  isLoading?: boolean;
  alwaysRequireTyping?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemCount,
  itemType = "مورد",
  isPurge = true,
  isLoading = false,
  alwaysRequireTyping = false,
}: ConfirmDeleteModalProps) {
  const [typedConfirmation, setTypedConfirmation] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  const requiresTyping = alwaysRequireTyping || itemCount > 3;
  const isTypingValid =
    !requiresTyping ||
    typedConfirmation.trim().replace(/\u200c/g, "") === "حذف";

  useEffect(() => {
    if (isOpen) {
      setTypedConfirmation("");
      const timer = setTimeout(() => {
        if (requiresTyping && inputRef.current) {
          inputRef.current.focus();
        } else if (cancelBtnRef.current) {
          cancelBtnRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, requiresTyping]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape" && !isLoading) {
        onClose();
        return;
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTypingValid || isLoading) return;
    await onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-desc"
    >
      <div ref={modalRef} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-right">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 id="confirm-delete-title" className="text-base font-black text-white">
                {title}
              </h2>
              <span className="text-xs text-rose-400 font-bold mt-0.5 inline-block">
                تعداد: <bdi dir="rtl">{toPersianDigits(itemCount)}</bdi> {itemType}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-white p-1 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-700"
            aria-label="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <div id="confirm-delete-desc" className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
          {description ? (
            <p>{description}</p>
          ) : isPurge ? (
            <p>
              این عملیات <strong className="text-rose-400">غیرقابل بازگشت</strong> است. داده‌های انتخاب‌شده و تمامی فایل‌های وابسته به طور دائمی از پایگاه داده و دیسک سرور حذف خواهند شد.
            </p>
          ) : (
            <p>
              موارد انتخاب‌شده به بخش بایگانی منتقل می‌شوند و از دید بخش فعال خارج خواهند شد. در صورت نیاز بعداً قابل بازیابی خواهند بود.
            </p>
          )}
        </div>

        {/* High Friction Confirmation Input for > 3 items */}
        {requiresTyping && (
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              جهت تایید قطعی حذف گروهی (<bdi dir="rtl">{toPersianDigits(itemCount)}</bdi> {itemType})، کلمه{" "}
              <span className="text-rose-400 font-mono underline underline-offset-4">حذف</span> را تایپ کنید:
            </label>
            <input
              ref={inputRef}
              type="text"
              value={typedConfirmation}
              onChange={(e) => setTypedConfirmation(e.target.value)}
              placeholder="کلمه «حذف» را تایپ کنید"
              disabled={isLoading}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-bold"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 transition-all border border-slate-700"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isTypingValid || isLoading}
            className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              !isTypingValid || isLoading
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800"
                : isPurge
                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/30 active:scale-95"
                : "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/30 active:scale-95"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>در حال پردازش...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>{isPurge ? "تایید و حذف قطعی" : "تایید انتقال به بایگانی"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
