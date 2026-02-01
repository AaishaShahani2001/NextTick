"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

type Variant = {
  sku: string;
  strapType: string;
  color: string;
  sizeMM: number;
  stock: number;
};

type Product = {
  _id: string;
  name: string;
  basePrice: number;
  variants: Variant[];
};

export default function AdminProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:5000/api/admin/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setProduct(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <p className="text-gray-400 text-center py-40">
        Loading product...
      </p>
    );
  }

  if (!product) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold text-white mb-8">
        {product.name}
      </h1>

      <div className="bg-black border border-white/10 rounded-xl p-6">
        <p className="text-gray-400 mb-4">
          Base Price:{" "}
          <span className="text-[#d4af37] font-semibold">
            ${product.basePrice}
          </span>
        </p>

        <h2 className="text-xl text-white mb-4">
          Variants & Stock
        </h2>

        <div className="space-y-4">
          {product.variants.map((v) => (
            <div
              key={v.sku}
              className="flex justify-between items-center
              border border-white/10 rounded-lg p-4"
            >
              <div>
                <p className="text-white text-sm font-medium">
                  {v.strapType} • {v.color} • {v.sizeMM}mm
                </p>
                <p className="text-xs text-gray-400">
                  SKU: {v.sku}
                </p>
              </div>

              <div
                className={`text-sm font-semibold ${
                  v.stock <= 2
                    ? "text-red-400"
                    : v.stock <= 5
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                Stock: {v.stock}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
