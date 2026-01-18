import { Product } from "./product";

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  increaseQty: (productId: string | number) => void;
  decreaseQty: (productId: string | number) => void;
  removeFromCart: (productId: string | number) => void;
  clearCart: () => void;
};
