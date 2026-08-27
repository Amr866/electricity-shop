"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toPersianDigits } from "@/lib/utils";
import {
  Home,
  LayoutGrid,
  Flame,
  Heart,
  ShoppingCart,
} from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

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
      href: "/products",
      label: "دسته‌ها",
      icon: LayoutGrid,
    },
    {
      href: "/products?bestseller=true",
      label: "تخفیف‌ها",
      icon: Flame,
    },
    {
      href: "/wishlist",
      label: "ذخیره‌شده‌ها",
      icon: Heart,
      badge: wishlistCount,
    },
    {
      href: "/cart",
      label: "سبد خرید",
      icon: ShoppingCart,
      badge: itemCount,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800 py-2 px-3 shadow-lg no-print transition-colors duration-200">
      <div className="flex items-center justify-around">
        {links.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href.split("?")[0]) && item.href !== "/";
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? "text-amber-500 font-extrabold scale-105"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                    {toPersianDigits(item.badge)}
                  </span>
                )}
              </div>
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
