import ProductCard from "./ProductCard";
import { ProductsType } from "@/src/types/product";

// TEMP PRODUCTS – PHASE 1 (UI Development)
const products: ProductsType = [
  {
    id: 1,
    name: "ChronoLux Steel Royale",
    shortDescription:
      "A premium stainless steel watch crafted for everyday elegance.",
    price: 399,
    collection: "Classic Collection",
    category: "Luxury",
    colors: ["silver", "black"],
    images: {
      silver: "/products/steel-royale-silver.webp",
      black: "/products/steel-royale-black.jpg"
    },
    isFeatured: true
  },
  {
    id: 2,
    name: "ChronoLux Midnight Leather",
    shortDescription:
      "A refined leather watch designed for timeless sophistication.",
    price: 279,
    collection: "Heritage Collection",
    category: "Classic",
    colors: ["black", "brown"],
    images: {
      black: "/products/midnight-leather-black.jpeg",
      brown: "/products/midnight-leather-brown.jpg"
    },
    isFeatured: false
  },
  {
    id: 3,
    name: "ChronoLux Sport Pro X",
    shortDescription:
      "A bold sport watch built for performance and durability.",
    price: 349,
    collection: "Sport Collection",
    category: "Sport",
    colors: ["black", "blue", "green"],
    images: {
      black: "/products/sport-pro-black.png",
      blue: "/products/sport-pro-blue.jpg",
      green: "/products/sport-pro-green.webp"
    },
    isFeatured: true
  }
];

const ProductList = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
