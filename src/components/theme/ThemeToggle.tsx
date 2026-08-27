"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ showLabel = false }: { showLabel?: boolean }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="تغییر تم تاریک / روشن"
      className={`rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center shadow-sm active:scale-95 ${
        showLabel ? "px-3 py-1.5 gap-1.5 text-xs font-bold" : "w-9 h-9 sm:w-10 sm:h-10"
      }`}
      title={theme === "dark" ? "تغییر به حالت روشن (Light Mode)" : "تغییر به حالت تاریک (Dark Mode)"}
    >
      {mounted && theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
      )}
      {showLabel && <span>{mounted && theme === "dark" ? "تم روز" : "تم شب"}</span>}
    </button>
  );
}
