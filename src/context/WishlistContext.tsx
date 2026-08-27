"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
      console.error(e);
    }
  }, []);

  const save = (items: any[]) => {
    setWishlist(items);
    localStorage.setItem("shiasi_wishlist", JSON.stringify(items));
  };

  const toggleWishlist = (product: any) => {
    const exists = wishlist.some((p) => p.id === product.id);
    if (exists) {
      save(wishlist.filter((p) => p.id !== product.id));
    } else {
      save([product, ...wishlist]);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const clearWishlist = () => {
    save([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
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
