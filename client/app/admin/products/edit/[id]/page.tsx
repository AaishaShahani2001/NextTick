"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProductForm from "@/components/admin/ProductForm";

type Variant = {
  sku: string;
  strapType: string;
  color: string;
  sizeMM: number;
  stock: number;
  priceAdjustment: number;
};

type Product = {
  _id: string;
  name: string;
  price: number;
  basePrice: number | string;
  category: string;
  collection: string;
  image?: string;
  variants: Variant[];
};

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/admin/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();
        setProduct(data);
      } catch {
        toast.error("Failed to load product");
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  if (loading) {
    return <p className="text-gray-400">Loading product...</p>;
  }

  if (!product) return null;

  return <ProductForm product={product} />;
}
