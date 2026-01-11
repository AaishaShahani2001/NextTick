import { Product } from "./product";

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  increaseQty: (productId: string | number, color: string) => void;
  decreaseQty: (productId: string | number, color: string) => void;
  removeFromCart: (productId: string | number, color: string) => void;
  clearCart: () => void;
};
