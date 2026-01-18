import { Product, ProductVariant } from "./product";

export type CartItem = {
  product: Product;
  quantity: number;
  selectedVariant: ProductVariant;
};

export type CartContextType = {
  cart: CartItem[];

  addToCart: (item: CartItem) => void;

  increaseQty: (productId: string, sku: string) => void;
  decreaseQty: (productId: string, sku: string) => void;
  removeFromCart: (productId: string, sku: string) => void;

  clearCart: () => void;
};
