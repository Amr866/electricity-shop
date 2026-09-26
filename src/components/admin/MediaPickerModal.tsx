"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { Sparkles, Search, Loader2, Check, X, ImageIcon } from "lucide-react";
import { MediaFile } from "@/lib/utils/media";

export interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentUrl?: string;
  title?: string;
  description?: string;
  folderFilter?: "articles" | "products" | "general" | "boms" | "all";
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  currentUrl = "",
  title = "انتخاب تصویر از رسانه و تصاویر سرور",
  description = "یک تصویر را جهت اتصال انتخاب فرمایید",
  folderFilter = "all",
}: MediaPickerModalProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Fetch media files on modal open
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function loadMedia() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/upload");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.files)) {
            setMediaFiles(data.files);
          }
        }
      } catch (err) {
        console.error("Failed to load server media files:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadMedia();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Keyboard navigation: Escape key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter image files by search term and optional folder filter
  const filteredFiles = useMemo(() => {
    let imagesOnly = mediaFiles.filter((f) =>
      f.fileType === "image" ||
      /\.(jpg|jpeg|png|webp|svg|avif)$/i.test(f.name || f.url) ||
      f.folder === "products" ||
      f.folder === "articles"
    );

    if (folderFilter !== "all") {
      imagesOnly = imagesOnly.filter((f) => f.folder === folderFilter);
    }

    if (!search.trim()) return imagesOnly;
    const q = search.toLowerCase();
    return imagesOnly.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.url.toLowerCase().includes(q) ||
        (f.productName && f.productName.toLowerCase().includes(q))
    );
  }, [mediaFiles, search, folderFilter]);

  const handleSelect = useCallback(
    (url: string) => {
      onSelect(url);
      onClose();
    },
    [onSelect, onClose]
  );

  const handleImageError = useCallback((url: string) => {
    setFailedImages((prev) => ({ ...prev, [url]: true }));
  }, []);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full max-h-[85vh] bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">{title}</h3>
              <p className="text-[11px] text-slate-400">{description}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
            title="بستن پنجره"
            aria-label="بستن"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی نام یا آدرس تصویر..."
            className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl pr-9 pl-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono"
            aria-label="جستجوی تصویر"
          />
          <Search
            className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* Images Grid */}
        <div className="overflow-y-auto max-h-[50vh] pr-1">
          {loading ? (
            <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-amber-400" aria-hidden="true" />
              <span className="text-xs font-bold">در حال بارگذاری تصاویر سرور...</span>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="p-10 text-center text-slate-500 text-xs">تصویری یافت نشد.</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {filteredFiles.map((m) => {
                const isSelected = currentUrl === m.url;
                const hasFailed = failedImages[m.url];

                return (
                  <button
                    key={m.url}
                    type="button"
                    onClick={() => handleSelect(m.url)}
                    className={`group rounded-xl p-2 border text-right cursor-pointer transition-all flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-amber-500 ${
                      isSelected
                        ? "bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/40"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="aspect-square relative w-full rounded-lg overflow-hidden bg-slate-900 mb-1.5 flex items-center justify-center">
                      {!hasFailed ? (
                        <Image
                          src={m.url}
                          alt={m.name}
                          fill
                          unoptimized
                          sizes="80px"
                          onError={() => handleImageError(m.url)}
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-600" aria-hidden="true" />
                      )}
                      {isSelected && (
                        <div className="absolute inset-0 bg-amber-500/40 flex items-center justify-center">
                          <Check className="w-5 h-5 text-slate-950 stroke-[3]" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <bdi
                      dir="ltr"
                      className="text-[10px] font-mono text-slate-300 truncate w-full block text-left"
                      title={m.name}
                    >
                      {m.name}
                    </bdi>
                  </button>
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
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}
