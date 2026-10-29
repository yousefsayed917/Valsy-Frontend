"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import type { CartItem } from "@/types";
import { sanitizeText } from "@/lib/security";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productVariantId: number) => void;
  updateQuantity: (productVariantId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const STORAGE_KEY = "valsy_luxury_cart_v1";
const MAX_ITEM_QTY = 99;

function sanitizeCartItem(raw: unknown): CartItem | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const productId = Number(item.productId);
  const productVariantId = Number(item.productVariantId);
  const unitPrice = Number(item.unitPrice);
  const quantity = Math.floor(Number(item.quantity));

  if (
    !Number.isSafeInteger(productId) ||
    productId <= 0 ||
    !Number.isSafeInteger(productVariantId) ||
    productVariantId <= 0 ||
    !Number.isFinite(unitPrice) ||
    unitPrice < 0 ||
    !Number.isFinite(quantity) ||
    quantity < 1
  ) {
    return null;
  }

  return {
    productId,
    productVariantId,
    productName: sanitizeText(String(item.productName ?? "Atelier Piece"), 200),
    size: sanitizeText(String(item.size ?? ""), 50),
    color: sanitizeText(String(item.color ?? ""), 100),
    unitPrice,
    quantity: Math.min(MAX_ITEM_QTY, quantity),
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate safely from localStorage on client mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const valid = parsed
            .map(sanitizeCartItem)
            .filter((i): i is CartItem => i !== null);
          setItems(valid);
        }
      }
    } catch {
      // Ignore corrupted localStorage state
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist to localStorage after hydration
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage quota or private mode
    }
  }, [items, hydrated]);

  const addItem = useCallback((newItem: CartItem) => {
    const clean = sanitizeCartItem(newItem);
    if (!clean) return;

    setItems((prev) => {
      const existing = prev.find((i) => i.productVariantId === clean.productVariantId);
      if (existing) {
        return prev.map((i) =>
          i.productVariantId === clean.productVariantId
            ? { ...i, quantity: Math.min(MAX_ITEM_QTY, i.quantity + clean.quantity) }
            : i
        );
      }
      return [...prev, clean];
    });
  }, []);

  const removeItem = useCallback((productVariantId: number) => {
    setItems((prev) => prev.filter((i) => i.productVariantId !== productVariantId));
  }, []);

  const updateQuantity = useCallback((productVariantId: number, quantity: number) => {
    const safeQty = Math.floor(Number(quantity) || 0);
    if (safeQty <= 0) {
      setItems((prev) => prev.filter((i) => i.productVariantId !== productVariantId));
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.productVariantId === productVariantId
            ? { ...i, quantity: Math.min(MAX_ITEM_QTY, safeQty) }
            : i
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
