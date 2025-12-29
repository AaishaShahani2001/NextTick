"use client";

import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  collection: string;
};

export default function ProductTable({
  products,
  onDelete
}: {
  products: Product[];
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-black border border-white/10 rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-white/5 text-gray-400 text-sm">
          <tr>
            <th className="text-left px-6 py-4">Product</th>
            <th className="text-left px-6 py-4">Category</th>
            <th className="text-left px-6 py-4">Collection</th>
            <th className="text-left px-6 py-4">Price</th>
            <th className="text-right px-6 py-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product._id}
              className="border-t border-white/10 hover:bg-white/5"
            >
              <td className="px-6 py-4 text-white font-medium">
                {product.name}
              </td>

              <td className="px-6 py-4 text-gray-400">
                {product.category}
              </td>

              <td className="px-6 py-4 text-gray-400">
                {product.collection}
              </td>

              <td className="px-6 py-4 text-[#d4af37] font-semibold">
                ${product.price}
              </td>

              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-4">
                  <Link
                    href={`/admin/products/edit/${product._id}`}
                    className="text-[#d4af37] hover:opacity-80"
                  >
                    <Edit size={18} />
                  </Link>

                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to delete this product?"
                        )
                      ) {
                        onDelete(product._id);
                        toast.success("Product deleted");
                      }
                    }}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="text-center py-10 text-gray-400"
              >
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
