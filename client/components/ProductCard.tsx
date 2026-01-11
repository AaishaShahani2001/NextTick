"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/src/types/product";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const image = product.images?.[0];

  /* ================= STOCK LOGIC ================= */
  const totalStock = product.variants.reduce(
    (sum, v) => sum + v.stock,
    0
  );

  const stockBadge =
    totalStock === 0
      ? {
          label: "Out of Stock",
          style:
            "bg-red-500/10 text-red-400 border-red-500/20"
        }
      : totalStock <= 3
      ? {
          label: "Low Stock",
          style:
            "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
        }
      : {
          label: "In Stock",
          style:
            "bg-green-500/10 text-green-400 border-green-500/20"
        };

  return (
    <div
      className="
        group relative overflow-hidden
        rounded-3xl
        bg-white/5 backdrop-blur-xl
        border border-white/10
        transition-all duration-500
        hover:-translate-y-1
        hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]
      "
    >
      {/* IMAGE */}
      <div className="relative h-64 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="
              object-cover
              transition-transform duration-700
              group-hover:scale-105
            "
          />
        ) : (
          <div className="h-full bg-white/5" />
        )}

        {/* BADGES */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 text-xs rounded-full bg-black/60 backdrop-blur border border-white/10 text-gray-300">
            {product.category}
          </span>

          <span className="px-3 py-1 text-xs rounded-full bg-black/60 backdrop-blur border border-white/10 text-gray-300">
            {product.collection}
          </span>

          {/* STOCK BADGE */}
          <span
            className={`
              px-3 py-1 text-xs rounded-full
              backdrop-blur border
              font-semibold
              ${stockBadge.style}
            `}
          >
            {stockBadge.label}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white leading-tight">
          {product.name}
        </h3>

        <p className="text-sm text-gray-400 line-clamp-2">
          {product.shortDescription}
        </p>

        <div className="flex items-center justify-between pt-2">
          <p className="text-[#d4af37] text-lg font-semibold">
            LKR {product.basePrice.toLocaleString()}
          </p>

          <Link href={`/watches/${product._id}`}>
            <button
              className="
                px-5 py-2 rounded-full
                border border-[#d4af37]
                text-[#d4af37]
                text-sm font-medium
                transition-all
                hover:bg-[#d4af37] hover:text-black
              "
            >
              View
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
