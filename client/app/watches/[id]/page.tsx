"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { ProductsType, ProductType } from "@/src/types/product";
import { useCart } from "@/src/context/CartContext";

// TEMP PRODUCTS – PHASE 1
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
    }
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

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id;
  const { addToCart } = useCart();

  const product: ProductType | undefined = products.find(
    (p) => String(p.id) === productId
  );

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold text-white">
          Product not found
        </h2>
        <p className="text-gray-400 mt-2">
          The watch you are looking for does not exist.
        </p>
      </div>
    );
  }

  // 🔥 Color → Image logic
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0]
  );

  const imageSrc =
    product.images[selectedColor] ??
    product.images[product.colors[0]];

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-500 mb-6">
        Home / Watches / {product.name}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* IMAGE */}
        <div className="relative w-full h-130 rounded-2xl overflow-hidden border border-white/10 bg-black">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500"
          />
        </div>

        {/* DETAILS */}
        <div>
          <p className="text-sm text-[#d4af37] uppercase tracking-widest">
            {product.collection}
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white">
            {product.name}
          </h1>

          <p className="mt-4 text-gray-400 max-w-xl">
            {product.shortDescription}
          </p>

          <p className="mt-6 text-3xl font-bold text-[#d4af37]">
            ${product.price}
          </p>

          {/* COLORS */}
          <div className="mt-8">
            <p className="text-sm text-gray-400 mb-3">
              Available Colors
            </p>

            <div className="flex gap-4">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-7 h-7 rounded-full border transition
                    ${selectedColor === color
                      ? "border-[#d4af37] scale-110"
                      : "border-white/30"
                    }`}
                  style={{ backgroundColor: color }}
                  aria-label={color}
                />
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-10 flex gap-4">
            <button
              onClick={() =>
                addToCart({
                  product,
                  quantity: 1,
                  selectedColor
                })
              }
              className="px-8 py-3 rounded-full bg-[#d4af37]
  text-black font-semibold hover:opacity-90 transition"
            >
              Add to Cart
            </button>

            <button
              className="px-8 py-3 rounded-full border border-[#d4af37]
              text-[#d4af37] hover:bg-[#d4af37]
              hover:text-black transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
