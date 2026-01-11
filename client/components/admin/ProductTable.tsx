"use client";

import Link from "next/link";
import { Edit, Trash2, Eye, Layers } from "lucide-react";
import { useState } from "react";
import ProductViewModal from "./ProductViewModal";
import { Product } from "@/src/types/product";

export default function ProductTable({
  products,
  onDelete
}: {
  products: Product[];
  onDelete: (id: string) => void;
}) {
  const [viewProduct, setViewProduct] =
    useState<Product | null>(null);

  return (
    <>
      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-[#0b0b0b] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/80 text-gray-400">
            <tr>
              <th className="px-6 py-4 text-left">Image</th>
              <th className="px-6 py-4 text-left">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Collection</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map(p => {
              const totalStock = p.variants.reduce(
                (sum, v) => sum + v.stock,
                0
              );

              const stockColor =
              totalStock === 0
                ? "bg-red-500/10 text-red-400 border-red-500/20"
                : totalStock <= 3
                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                : "bg-green-500/10 text-green-400 border-green-500/20";

              return (
                <tr
                  key={p._id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  {/* IMAGE */}
                  <td className="px-6 py-4">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-14 h-14 rounded-xl object-cover border border-white/10"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-white/5" />
                    )}
                  </td>

                  {/* PRODUCT */}
                  <td className="px-6 py-4">
                    <p className="text-white font-semibold">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-500 flex gap-1 items-center">
                      <Layers size={12} />
                      {p.variants.length} variants
                    </p>
                  </td>

                  {/* CATEGORY */}
                  <td className="px-6 py-4 text-gray-400">
                    {p.category}
                  </td>

                  {/* COLLECTION */}
                  <td className="px-6 py-4 text-gray-400">
                    {p.collection}
                  </td>

                  {/* PRICE */}
                  <td className="px-6 py-4 text-[#d4af37]">
                    LKR {p.basePrice.toLocaleString()}
                  </td>

                  {/* STOCK */}
                  <td className="px-6 py-4 text-gray-300">
                    <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${stockColor}`}
                  >
                    {totalStock} units
                  </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => setViewProduct(p)}
                        className="text-gray-400 hover:text-white"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>

                      <Link
                        href={`/admin/products/edit/${p._id}`}
                        className="text-[#d4af37]"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>

                      <button
                        onClick={() => onDelete(p._id)}
                        className="text-red-400 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {viewProduct && (
        <ProductViewModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
        />
      )}
    </>
  );
}
