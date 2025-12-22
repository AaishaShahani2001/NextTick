"use client";

import { createContext, useContext, useState } from "react";
import { CartContextType, CartItem } from "@/src/types/cart";

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (c) =>
          c.product.id === item.product.id &&
          c.selectedColor === item.selectedColor
      );

      if (existing) {
        return prev.map((c) =>
          c.product.id === item.product.id &&
          c.selectedColor === item.selectedColor
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }

      return [...prev, item];
    });
  };

  const removeFromCart = (productId: string | number) => {
    setCart((prev) =>
      prev.filter((item) => item.product.id !== productId)
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
