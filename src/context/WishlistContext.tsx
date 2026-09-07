"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

interface WishlistContextType {
  wishlist: any[];
  wishlistCount: number;
  toggleWishlist: (product: any) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("shiasi_wishlist");
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load wishlist from storage", e);
    }
  }, []);

  const save = useCallback((items: any[]) => {
    setWishlist(items);
    try {
      localStorage.setItem("shiasi_wishlist", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save wishlist to storage", e);
    }
  }, []);

  const toggleWishlist = useCallback((product: any) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      const next = exists ? prev.filter((p) => p.id !== product.id) : [product, ...prev];
      try {
        localStorage.setItem("shiasi_wishlist", JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save wishlist", e);
      }
      return next;
    });
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some((p) => p.id === productId);
  }, [wishlist]);

  const clearWishlist = useCallback(() => {
    save([]);
  }, [save]);

  const value = useMemo(
    () => ({
      wishlist,
      wishlistCount: wishlist.length,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
    }),
    [wishlist, toggleWishlist, isInWishlist, clearWishlist]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
