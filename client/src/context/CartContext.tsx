"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { CartContextType, CartItem } from "@/src/types/cart";
import toast from "react-hot-toast";

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  
   /* ---------- LOAD CART ---------- */
useEffect(() => {
  const stored = localStorage.getItem("cart");

  if (stored) {
    try {
      const parsed: CartItem[] = JSON.parse(stored);

      // REMOVE corrupted cart items
      const cleaned = parsed.filter(
        (item) => item.selectedVariant && item.selectedVariant.sku
      );

      setCart(cleaned);
    } catch {
      localStorage.removeItem("cart");
    }
  }

  setMounted(true);
}, []);

 
  /* ---------- SAVE CART ---------- */
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, mounted]);

  /* ---------- CLEAR CART ---------- */
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

   /* ---------- ADD TO CART ---------- */
  const addToCart = (item: CartItem) => {
  if (!item.selectedVariant) {
    console.error("Attempted to add item without variant", item);
    return;
  }

  setCart((prev) => {
    const existing = prev.find(
  (c) =>
    c.product._id === item.product._id &&
    c.selectedVariant &&
    c.selectedVariant.sku === item.selectedVariant.sku
);


    if (existing) {
  if (existing.quantity >= existing.selectedVariant.stock) {
    return prev;
  }
  return prev.map((c) =>
    c.product._id === item.product._id &&
    c.selectedVariant.sku === item.selectedVariant.sku
      ? { ...c, quantity: c.quantity + 1 }
      : c
  );
}


    return [...prev, item];
  });
};

  
/* ---------- INCREASE QTY ---------- */
  const increaseQty = (productId: string, sku: string) => {
  setCart((prev) =>
    prev.map((item) => {
      if (
        item.product._id === productId &&
        item.selectedVariant &&
        item.selectedVariant.sku === sku
      ) {
        if (item.quantity >= item.selectedVariant.stock) return item;
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    })
  );
};


/* ---------- DECREASE QTY ---------- */
  const decreaseQty = (productId: string | number, sku: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product._id === productId &&
          item.selectedVariant &&
          item.selectedVariant.sku === sku
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string, sku: string) => {
  setCart((prev) =>
    prev.filter(
      (item) =>
        !(
          item.product._id === productId &&
          item.selectedVariant &&
          item.selectedVariant.sku === sku
        )
    )
  );
};


  // block rendering until mounted
  if (!mounted) return null;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart
      }}
    >
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
