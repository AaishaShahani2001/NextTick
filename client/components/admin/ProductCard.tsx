"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, Edit, Trash2, Layers } from "lucide-react";
import ProductViewModal from "./ProductViewModal";
import { Product } from "@/src/types/product";

export default function ProductCardList({
  products,
  onDelete
}: {
  products: Product[];
  onDelete: (id: string) => void;
}) {
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  return (
    <>
      <div className="md:hidden space-y-4">
        {products.map(p => {
          const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);

          const stockBadge =
            totalStock === 0
              ? "bg-red-500/10 text-red-400 border-red-500/20"
              : totalStock <= 3
              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
              : "bg-green-500/10 text-green-400 border-green-500/20";

          return (
            <div
              key={p._id}
              className="
                rounded-3xl p-5
                bg-white/5 backdrop-blur-xl
                border border-white/10
                shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]
              "
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10">
                {p.images?.[0] ? (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-white/5" />
                )}

                {/* Stock badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${stockBadge}`}
                  >
                    {totalStock} in stock
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="mt-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-white font-semibold text-lg leading-tight">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Layers size={12} />
                      {p.variants.length} variants • {p.category} • {p.collection}
                    </p>
                  </div>

                  <p className="text-[#d4af37] font-semibold whitespace-nowrap">
                    LKR {p.basePrice.toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3">
                  <button
                    onClick={() => setViewProduct(p)}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition"
                  >
                    <Eye size={18} />
                    <span className="text-sm">View</span>
                  </button>

                  <div className="flex items-center gap-5">
                    <Link
                      href={`/admin/products/edit/${p._id}`}
                      className="text-[#d4af37] hover:opacity-80 transition"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </Link>

                    <button
                      onClick={() => {
                        if (confirm("Delete this product?")) onDelete(p._id);
                      }}
                      className="text-red-400 hover:text-red-500 transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {products.length === 0 && (
          <div className="py-14 text-center text-gray-500">
            No products found
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewProduct && (
        <ProductViewModal product={viewProduct} onClose={() => setViewProduct(null)} />
      )}
    </>
  );
}
