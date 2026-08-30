"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toPersianDigits } from "@/lib/utils";
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft, LayoutGrid } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalCount,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageSizeChange = (newSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", newSize.toString());
    params.delete("page"); // Reset to page 1 on limit change
    router.push(`${pathname}?${params.toString()}`);
  };

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    return `${pathname}?${params.toString()}`;
  };

  // Generate page numbers array with dots
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  if (totalCount === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      
      {/* 1. Page Size Selector & Count Info */}
      <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
        <span className="font-bold">
          نمایش {toPersianDigits(startItem)} تا {toPersianDigits(endItem)} از {toPersianDigits(totalCount)} کالا
        </span>

        <span className="text-slate-300 dark:text-slate-700">|</span>

        {/* Page size toggle */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400">تعداد در صفحه:</span>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
            {[12, 60, 120].map((size) => (
              <button
                key={size}
                onClick={() => handlePageSizeChange(size)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  pageSize === size
                    ? "bg-amber-500 text-slate-950 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {toPersianDigits(size)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Pagination Navigation Buttons */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5 text-xs">
          {/* First Page */}
          <Link
            href={getPageUrl(1)}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : undefined}
            className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-colors ${
              currentPage === 1
                ? "border-slate-100 dark:border-slate-800/60 text-slate-300 dark:text-slate-700 pointer-events-none"
                : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
            title="صفحه اول"
          >
            <ChevronsRight className="w-4 h-4" />
          </Link>

          {/* Prev Page */}
          <Link
            href={getPageUrl(currentPage - 1)}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : undefined}
            className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-colors ${
              currentPage === 1
                ? "border-slate-100 dark:border-slate-800/60 text-slate-300 dark:text-slate-700 pointer-events-none"
                : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
            title="صفحه قبلی"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>

          {/* Number Links */}
          {getPageNumbers().map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`dot-${idx}`}
                  className="w-7 h-8 flex items-center justify-center text-slate-400 font-bold"
                >
                  ...
                </span>
              );
            }
            const isCurrent = p === currentPage;
            return (
              <Link
                key={`page-${p}`}
                href={getPageUrl(Number(p))}
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                  isCurrent
                    ? "bg-amber-500 text-slate-950 font-black shadow-sm scale-105"
                    : "border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {toPersianDigits(p)}
              </Link>
            );
          })}

          {/* Next Page */}
          <Link
            href={getPageUrl(currentPage + 1)}
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : undefined}
            className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-colors ${
              currentPage === totalPages
                ? "border-slate-100 dark:border-slate-800/60 text-slate-300 dark:text-slate-700 pointer-events-none"
                : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
            title="صفحه بعدی"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>

          {/* Last Page */}
          <Link
            href={getPageUrl(totalPages)}
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : undefined}
            className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-colors ${
              currentPage === totalPages
                ? "border-slate-100 dark:border-slate-800/60 text-slate-300 dark:text-slate-700 pointer-events-none"
                : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
            title="صفحه آخر"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Link>
        </div>
      )}

    </div>
  );
}
