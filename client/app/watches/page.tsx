"use client";

import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { ProductsType } from "@/src/types/product";

// TEMP PRODUCTS (later replace with API)
const products: ProductsType = [
  {
    id: 1,
    name: "ChronoLux Steel Royale",
    shortDescription: "A premium stainless steel watch crafted for everyday elegance.",
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
    shortDescription: "A refined leather watch designed for timeless sophistication.",
    price: 279,
    collection: "Heritage Collection",
    category: "Classic",
    colors: ["black", "brown"],
    images: {
      black: "/products/midnight-leather-black.jpeg",
      brown: "/products/midnight-leather-brown.jpg"
    }
  },
  {
    id: 3,
    name: "ChronoLux Sport Pro X",
    shortDescription: "A bold sport watch built for performance and durability.",
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

export default function WatchesPage() {
  const searchParams = useSearchParams();
  const selectedCollection = searchParams.get("collection");

  const filteredProducts = selectedCollection
    ? products.filter(
        (product) => product.collection === selectedCollection
      )
    : products;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold">
          {selectedCollection
            ? selectedCollection
            : "All Watches"}
        </h1>

        <p className="mt-3 text-gray-400">
          {selectedCollection
            ? `Explore watches from the ${selectedCollection}.`
            : "Discover our complete range of luxury timepieces."}
        </p>
      </div>

      {/* GRID */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No watches found.</p>
      )}
    </section>
  );
}
