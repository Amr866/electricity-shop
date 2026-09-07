"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toPersianDigits } from "@/lib/utils";
import {
  Home,
  LayoutGrid,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const [badgeBump, setBadgeBump] = useState(false);

  // Trigger bounce effect on cart badge when item count increases
  useEffect(() => {
    if (itemCount > 0) {
      setBadgeBump(true);
      const timer = setTimeout(() => setBadgeBump(false), 400);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  // Hide bottom nav on admin pages or print
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const links = [
    {
      href: "/",
      label: "خانه",
      icon: Home,
      exact: true,
    },
    {
      href: "/categories",
      label: "دسته‌ها",
      icon: LayoutGrid,
    },
    {
      href: "/cart",
      label: "سبد خرید",
      icon: ShoppingCart,
      badge: itemCount,
    },
    {
      href: "/wishlist",
      label: "علاقه‌مندی",
      icon: Heart,
      badge: wishlistCount,
    },
    {
      href: "/account",
      label: "حساب من",
      icon: User,
    },
  ];

  // Determine active tab index (0 to 4)
  const activeIndex = links.findIndex((item) =>
    item.exact
      ? pathname === item.href
      : pathname.startsWith(item.href.split("?")[0]) && item.href !== "/"
  );

  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800 pt-1.5 pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))] px-2 shadow-xl no-print transition-colors duration-200">
      <div className="relative max-w-md mx-auto">
        {/* 5. Smooth Sliding Tab Indicator Capsule (Slide Morph in RTL) */}
        <div
          className="absolute top-0.5 bottom-0.5 w-[20%] rounded-2xl bg-amber-500/10 dark:bg-amber-500/25 border border-amber-500/25 dark:border-amber-500/40 shadow-2xs transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none"
          style={{
            transform: `translateX(-${safeActiveIndex * 100}%)`,
          }}
        />

        <div className="flex items-center justify-around relative z-10">
          {links.map((item, idx) => {
            const isActive = idx === safeActiveIndex;
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.label === "سبد خرید" && pathname !== "/cart") {
                    e.preventDefault();
                    openCartDrawer();
                  }
                }}
                className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl transition-all duration-200 active:scale-90 ${
                  isActive
                    ? "text-amber-600 dark:text-amber-400 font-black scale-105"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? "stroke-[2.5] scale-110" : ""
                    }`}
                  />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      key={item.label === "سبد خرید" ? itemCount : wishlistCount}
                      className={`absolute -top-1.5 -right-2.5 bg-amber-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs transition-transform duration-200 ${
                        badgeBump && item.label === "سبد خرید" ? "scale-130 animate-bounce" : "scale-100"
                      }`}
                    >
                      {toPersianDigits(item.badge)}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
