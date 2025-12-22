import { ProductType } from "./product";

export type CartItem = {
  product: ProductType;
  quantity: number;
  selectedColor: string;
};

export type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string | number) => void;
};
