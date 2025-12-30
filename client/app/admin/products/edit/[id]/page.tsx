"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  collection: string;
};

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    collection: ""
  });

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/admin/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        if (!res.ok) throw new Error("Failed to fetch product");

        const data: Product = await res.json();

        setForm({
          name: data.name,
          price: String(data.price),
          category: data.category,
          collection: data.collection
        });
      } catch {
        toast.error("Failed to load product");
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= UPDATE PRODUCT ================= */
  const handleUpdate = async () => {
    if (!form.name || !form.price || !form.category || !form.collection) {
      toast.error("All fields are required");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            name: form.name,
            price: Number(form.price),
            category: form.category,
            collection: form.collection
          })
        }
      );

      if (!res.ok) throw new Error("Update failed");

      toast.success("Product updated");
      router.push("/admin/products");
    } catch {
      toast.error("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-gray-400">Loading product...</p>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-8">
        Edit Product
      </h1>

      <div className="max-w-xl bg-black border border-white/10 p-8 rounded-2xl space-y-6">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full p-4 rounded-xl bg-black border border-white/10 text-white"
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-4 rounded-xl bg-black border border-white/10 text-white"
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full p-4 rounded-xl bg-black border border-white/10 text-white"
        />

        <input
          name="collection"
          value={form.collection}
          onChange={handleChange}
          placeholder="Collection"
          className="w-full p-4 rounded-xl bg-black border border-white/10 text-white"
        />

        <div className="flex gap-4">
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="px-6 py-3 rounded-full bg-[#d4af37] text-black font-semibold"
          >
            {saving ? "Saving..." : "Update Product"}
          </button>

          <button
            onClick={() => router.push("/admin/products")}
            className="px-6 py-3 rounded-full border border-white/20 text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
