"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import ProductTable from "@/components/admin/ProductTable";

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  collection: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/admin/products",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
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
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">
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
        <p className="text-gray-400">Loading products...</p>
      ) : (
        <ProductTable
          products={products}
          onDelete={deleteProduct}
        />
      )}
    </>
  );
}
