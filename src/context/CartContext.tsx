"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string; // Product ID
  name: string;
  slug: string;
  basePrice: number; // Base single unit price
  price: number; // Effective unit price based on tiered quantity
  originalPrice?: number | null;
  image: string;
  categoryName?: string;
  sku?: string | null;
  quantity: number;
  stock: number;
}

export interface CouponData {
  code: string;
  discountPercent?: number | null;
  discountAmount?: number | null;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  appliedCoupon: CouponData | null;
  addToCart: (product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number | null;
    images?: { url: string; isPrimary?: boolean }[];
    category?: { name: string };
    sku?: string | null;
    stock?: number;
  }, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: CouponData) => void;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to compute unit price based on tiered quantity
function computeTieredUnitPrice(basePrice: number, qty: number): number {
  if (qty >= 50) {
    return Math.round(basePrice * 0.9); // 10% wholesale discount
  } else if (qty >= 10) {
    return Math.round(basePrice * 0.95); // 5% pack discount
  }
  return basePrice;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("naghsh_jahan_cart");
      const savedCoupon = localStorage.getItem("naghsh_jahan_coupon");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        // Ensure basePrice exists and prices are dynamically adjusted
        const updated = parsed.map((item: any) => {
          const basePrice = item.basePrice || item.price;
          return {
            ...item,
            basePrice,
            price: computeTieredUnitPrice(basePrice, item.quantity),
          };
        });
        setItems(updated);
      }
      if (savedCoupon) setAppliedCoupon(JSON.parse(savedCoupon));
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("naghsh_jahan_cart", JSON.stringify(items));
      if (appliedCoupon) {
        localStorage.setItem("naghsh_jahan_coupon", JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem("naghsh_jahan_coupon");
      }
    } catch (e) {
      console.error("Failed to save cart to storage", e);
    }
  }, [items, appliedCoupon, isLoaded]);

  const addToCart = (product: any, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const primaryImg = product.images?.find((img: any) => img.isPrimary)?.url || product.images?.[0]?.url || product.image || "/images/placeholder.jpg";
      const stock = product.stock ?? 20;
      const basePrice = product.price;

      if (existing) {
        const newQty = Math.min(existing.quantity + qty, stock);
        const effectivePrice = computeTieredUnitPrice(existing.basePrice || basePrice, newQty);
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: newQty, price: effectivePrice, basePrice: existing.basePrice || basePrice }
            : item
        );
      }

      const initialQty = Math.min(qty, stock);
      const effectivePrice = computeTieredUnitPrice(basePrice, initialQty);

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          basePrice: basePrice,
          price: effectivePrice,
          originalPrice: product.originalPrice,
          image: primaryImg,
          categoryName: product.category?.name,
          sku: product.sku,
          quantity: initialQty,
          stock: stock,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const validQty = Math.min(quantity, item.stock);
          const effectivePrice = computeTieredUnitPrice(item.basePrice || item.price, validQty);
          return { ...item, quantity: validQty, price: effectivePrice };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (coupon: CouponData) => {
    setAppliedCoupon(coupon);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculations
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      discount = Math.min(appliedCoupon.discountAmount, subtotal);
    }
  }

  const total = Math.max(0, subtotal - discount);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        total,
        appliedCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
