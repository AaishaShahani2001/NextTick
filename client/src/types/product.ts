
export type ProductVariant = {
  sku: string;
  strapType: string;
  color: string;
  sizeMM: number;
  stock: number;
  priceAdjustment: number;
};

export type Product = {
  _id: string;
  name: string;
  basePrice: number;
  category: string;
  collection: string;
  shortDescription: string;
  description: string;
  images?: string[];
  variants: ProductVariant[];
};
