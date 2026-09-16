"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { calculateTieredUnitPrice } from "@/lib/checkoutEngine";

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
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
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

// Helper to compute unit price based on tiered quantity via central checkout engine
function computeTieredUnitPrice(basePrice: number, qty: number): number {
  return calculateTieredUnitPrice(basePrice, qty).unitPrice;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const openCartDrawer = useCallback(() => setIsCartDrawerOpen(true), []);
  const closeCartDrawer = useCallback(() => setIsCartDrawerOpen(false), []);
  const toggleCartDrawer = useCallback(() => setIsCartDrawerOpen((prev) => !prev), []);

  // Storage keys with fallback to legacy keys
  const CART_KEY = "shiasi_cart_v1";
  const COUPON_KEY = "shiasi_coupon_v1";
  const LEGACY_CART_KEY = "naghsh_jahan_cart";
  const LEGACY_COUPON_KEY = "naghsh_jahan_coupon";

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_KEY) || localStorage.getItem(LEGACY_CART_KEY);
      const savedCoupon = localStorage.getItem(COUPON_KEY) || localStorage.getItem(LEGACY_COUPON_KEY);
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
      localStorage.setItem(CART_KEY, JSON.stringify(items));
      if (appliedCoupon) {
        localStorage.setItem(COUPON_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_KEY);
        localStorage.removeItem(LEGACY_COUPON_KEY);
      }
    } catch (e) {
      console.error("Failed to save cart to storage", e);
    }
  }, [items, appliedCoupon, isLoaded]);

  const addToCart = useCallback((product: any, qty = 1) => {
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

    // Automatically reveal the Slide-over Cart Drawer upon addition
    setIsCartDrawerOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== productId));
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
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
  }, []);

  const applyCoupon = useCallback((coupon: CouponData) => {
    setAppliedCoupon(coupon);
  }, []);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  // Calculations
  const itemCount = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.price * item.quantity, 0), [items]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountPercent) {
      return Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      return Math.min(appliedCoupon.discountAmount, subtotal);
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  const total = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount]);

  const contextValue = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      discount,
      total,
      appliedCoupon,
      isCartDrawerOpen,
      openCartDrawer,
      closeCartDrawer,
      toggleCartDrawer,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
    }),
    [
      items,
      itemCount,
      subtotal,
      discount,
      total,
      appliedCoupon,
      isCartDrawerOpen,
      openCartDrawer,
      closeCartDrawer,
      toggleCartDrawer,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>
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
