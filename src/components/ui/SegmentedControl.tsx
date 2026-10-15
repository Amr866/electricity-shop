"use client";

import React from "react";

interface Option<T extends string> {
  value: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface SegmentedControlProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: "sm" | "md";
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = "",
  size = "md",
}: SegmentedControlProps<T>) {
  const selectedIndex = options.findIndex((opt) => opt.value === value);
  const activeIndex = selectedIndex >= 0 ? selectedIndex : 0;
  const count = options.length;

  const sizeClasses = {
    sm: "p-0.5 text-xs h-8",
    md: "p-1 text-xs sm:text-sm h-10 sm:h-11",
  };

  return (
    <div
      role="radiogroup"
      className={`relative flex items-center rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-inner select-none ${sizeClasses[size]} ${className}`}
    >
      {/* Sliding Active Indicator Pill (RTL compatible) */}
      <div
        aria-hidden="true"
        className="absolute top-1 bottom-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 shadow-sm transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{
          width: `calc((100% - ${size === "sm" ? "4px" : "8px"}) / ${count})`,
          transform: `translateX(-${activeIndex * 100}%)`,
        }}
      />

      {options.map((option) => {
        const isSelected = option.value === value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 px-3 rounded-lg font-bold transition-colors duration-150 active:scale-95 cursor-pointer ${
              isSelected
                ? "text-slate-950 dark:text-amber-400 font-black"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
            <span>{option.label}</span>
            {option.badge && (
              <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                {option.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
