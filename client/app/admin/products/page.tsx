"use client";

import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminProductsPage() {
  // TEMP products
  const products = [
    { id: 1, name: "ChronoLux Steel Royale", price: 399 },
    { id: 2, name: "ChronoLux Sport Pro X", price: 349 }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <button className="flex items-center gap-2 px-4 py-2
          rounded-full bg-[#d4af37] text-black font-semibold">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="bg-black border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-400 text-sm">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-white/10">
                <td className="p-4">{p.name}</td>
                <td className="p-4 text-[#d4af37]">${p.price}</td>
                <td className="p-4 flex justify-end gap-3">
                  <button className="hover:text-[#d4af37]">
                    <Pencil size={18} />
                  </button>
                  <button className="hover:text-red-400">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
