"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Sparkles, Search, Loader2, Check, X } from "lucide-react";
import { MediaFile } from "@/lib/utils/media";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentUrl?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  currentUrl = "",
}: MediaPickerModalProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch media files on modal open
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function loadMedia() {
      setLoadingMedia(true);
      try {
        const res = await fetch("/api/admin/upload");
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setMediaFiles(data.files || []);
          }
        }
      } catch (err) {
        console.error("Failed to load media for picker:", err);
      } finally {
        if (isMounted) setLoadingMedia(false);
      }
    }

    loadMedia();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter image files by search
  const filteredFiles = useMemo(() => {
    const imagesOnly = mediaFiles.filter(
      (f) =>
        f.fileType === "image" ||
        f.url.match(/\.(jpg|jpeg|png|webp|svg|avif)$/i) ||
        f.folder === "products"
    );

    if (!search.trim()) return imagesOnly;
    const q = search.toLowerCase();
    return imagesOnly.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.url.toLowerCase().includes(q) ||
        (f.productName && f.productName.toLowerCase().includes(q))
    );
  }, [mediaFiles, search]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="انتخاب تصویر از رسانه و گالری"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full max-h-[85vh] bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">انتخاب تصویر از رسانه و تصاویر سرور</h3>
              <p className="text-[11px] text-slate-400">یک تصویر را جهت اتصال به کالا انتخاب فرمایید</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
            title="بستن پنجره"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی نام فایل تصویر..."
            className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl pr-9 pl-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
        </div>

        {/* Image Grid */}
        <div className="overflow-y-auto max-h-[50vh] pr-1">
          {loadingMedia ? (
            <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
              <span className="text-xs font-bold">در حال بارگذاری تصاویر سرور...</span>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="p-10 text-center text-slate-500 text-xs">تصویری یافت نشد.</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {filteredFiles.map((m) => {
                const isSelected = currentUrl === m.url;
                return (
                  <div
                    key={m.url}
                    onClick={() => {
                      onSelect(m.url);
                      onClose();
                    }}
                    className={`group rounded-xl p-2 border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/40"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="aspect-square relative rounded-lg overflow-hidden bg-slate-900 mb-1.5 flex items-center justify-center">
                      <Image
                        src={m.url}
                        alt={m.name}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-amber-500/40 flex items-center justify-center">
                          <Check className="w-5 h-5 text-slate-950 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] font-mono text-slate-300 truncate" title={m.name} dir="ltr">
                      {m.name}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{filteredFiles.length} تصویر در دسترس</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}
