"use client";

import React from "react";
import Link from "next/link";

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "amber" | "dark" | "emerald" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  prefetch?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function TactileButton({
  variant = "amber",
  size = "md",
  href,
  prefetch = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  onClick,
  type = "button",
  ...props
}: TactileButtonProps) {
  // Theme color maps for tactile 3D face and base layers
  const themes = {
    amber: {
      face: "bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]",
      base: "bg-amber-700 shadow-[inset_0_-2px_0_rgba(0,0,0,0.35)]",
    },
    dark: {
      face: "bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-750 text-white border-slate-700/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]",
      base: "bg-slate-950 dark:bg-slate-900 shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)]",
    },
    emerald: {
      face: "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]",
      base: "bg-emerald-800 shadow-[inset_0_-2px_0_rgba(0,0,0,0.4)]",
    },
    outline: {
      face: "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
      base: "bg-slate-300 dark:bg-slate-800 shadow-[inset_0_-1px_0_rgba(0,0,0,0.2)]",
    },
  };

  const sizes = {
    sm: {
      container: "h-[34px]",
      face: "h-7 px-2.5 text-[11px] rounded-lg gap-1.5",
      base: "h-7 rounded-lg",
      depth: "top-[4px] active:translate-y-[4px]",
      iconSize: "w-3.5 h-3.5",
    },
    md: {
      container: "h-[42px]",
      face: "h-9 px-4 text-xs font-bold rounded-xl gap-2",
      base: "h-9 rounded-xl",
      depth: "top-[4px] active:translate-y-[4px]",
      iconSize: "w-4 h-4",
    },
    lg: {
      container: "h-[50px]",
      face: "h-11 px-6 text-sm font-black rounded-xl gap-2.5",
      base: "h-11 rounded-xl",
      depth: "top-[5px] active:translate-y-[5px]",
      iconSize: "w-4.5 h-4.5",
    },
  };

  const currentTheme = themes[variant];
  const currentSize = sizes[size];

  const content = (
    <>
      {/* 1. Firm 3D Compressible Base (Solid foundation) */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 ${currentSize.depth.split(" ")[0]} ${currentSize.base} ${currentTheme.base} pointer-events-none transition-all duration-150`}
      />

      {/* 2. Raised Tactile Face Layer (Depresses into base on click) */}
      <span
        className={`relative flex items-center justify-center font-bold whitespace-nowrap border select-none transition-transform duration-100 ease-out active:translate-y-[4px] group-hover:-translate-y-[0.5px] ${currentSize.face} ${currentTheme.face}`}
      >
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        <span>{children}</span>
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      </span>
    </>
  );

  if (href && !disabled) {
    return (
      <Link
        href={href}
        prefetch={prefetch}
        className={`group relative inline-block cursor-pointer select-none ${currentSize.container} ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`group relative inline-block select-none ${currentSize.container} ${
        disabled ? "opacity-50 cursor-not-allowed filter grayscale" : "cursor-pointer"
      } ${className}`}
      {...props}
    >
      {content}
    </button>
  );
}
