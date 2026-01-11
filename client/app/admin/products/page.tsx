"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import ProductTable from "@/components/admin/ProductTable";
import ProductCardList from "@/components/admin/ProductCard";
import { Product } from "@/src/types/product";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PRODUCTS ================= */

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:3000/api/admin/products",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`
          }
        }
      );

      if (!res.ok) throw new Error();

      const data: Product[] = await res.json();
      setProducts(data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE PRODUCT ================= */

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`
          }
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Product deleted successfully");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  /* ================= EFFECT ================= */

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= UI ================= */

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white tracking-wide">
          Products
        </h1>

        <Link
          href="/admin/products/create"
          className="px-6 py-2 rounded-full bg-[#d4af37]
          text-black font-semibold hover:opacity-90 transition"
        >
          + Add Product
        </Link>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="py-20 text-center text-gray-400">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center text-gray-500">No products found</div>
      ) : (
        <>
          {/* Mobile */}
          <ProductCardList products={products} onDelete={deleteProduct} />

          {/* Desktop */}
          <ProductTable products={products} onDelete={deleteProduct} />
        </>
      )}

    </div>
  );
}
