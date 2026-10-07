import React from "react";
import { Check, ShoppingCart } from "lucide-react";
import { formatToman } from "@/lib/utils";
import type { ProductDetailData } from "./productDetailHelpers";

interface ProductStickyBarProps {
  product: ProductDetailData;
  effectiveUnitPrice: number;
  showStickyBar: boolean;
  isOutOfStock: boolean;
  addedToCart: boolean;
  onAddToCart: () => void;
}

export function ProductStickyBar({
  product,
  effectiveUnitPrice,
  showStickyBar,
  isOutOfStock,
  addedToCart,
  onAddToCart,
}: ProductStickyBarProps) {
  return (
    <div
      className={`print:hidden sm:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 border-t border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between gap-3 transition-all duration-300 ${
        showStickyBar
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">قیمت واحد:</span>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-black text-slate-950 dark:text-amber-400 font-mono">
            {formatToman(effectiveUnitPrice)}
          </span>
          {product.priceUnit && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
              / {product.priceUnit.replace(/^\//, "")}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onAddToCart}
        disabled={isOutOfStock}
        className={`flex-1 h-10 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 ${
          isOutOfStock
            ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            : addedToCart
            ? "bg-emerald-600 text-white"
            : "bg-amber-500 text-slate-950"
        }`}
      >
        {isOutOfStock ? (
          <span>اتمام موجودی</span>
        ) : addedToCart ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>اضافه شد</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>افزودن به سبد</span>
          </>
        )}
      </button>
    </div>
  );
}
