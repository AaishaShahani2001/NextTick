import { ProductType } from "./product";

export type CartItem = {
  product: ProductType;
  quantity: number;
  selectedColor: string;
};

export type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  increaseQty: (productId: string | number, color: string) => void;
  decreaseQty: (productId: string | number, color: string) => void;
  removeFromCart: (productId: string | number, color: string) => void;
};
