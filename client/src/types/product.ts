export type ProductType = {
  id: number | string;

  name: string;
  shortDescription: string;

  price: number;
  currency?: string;

  category: string;
  collection: string;

  colors: string[];

  images: Record<string, string>;

  isFeatured?: boolean;
};

export type ProductsType = ProductType[]
