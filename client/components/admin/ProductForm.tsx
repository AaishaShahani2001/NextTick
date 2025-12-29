"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProductForm({ product }: any) {
  const router = useRouter();
  const [form, setForm] = useState(
    product || {
      name: "",
      price: "",
      category: "",
      collection: ""
    }
  );

  const handleSubmit = async () => {
    const url = product
      ? `http://localhost:3000/api/admin/products/${product._id}`
      : "http://localhost:3000/api/admin/products";

    await fetch(url, {
      method: product ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(form)
    });

    toast.success("Product saved");
    router.push("/admin/products");
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl text-white mb-6">
        {product ? "Edit Product" : "Add Product"}
      </h1>

      {["name", "price", "category", "collection"].map((field) => (
        <input
          key={field}
          placeholder={field}
          value={(form as any)[field]}
          onChange={(e) =>
            setForm({ ...form, [field]: e.target.value })
          }
          className="w-full mb-4 p-4 bg-black border border-white/10 rounded-xl text-white"
        />
      ))}

      <button
        onClick={handleSubmit}
        className="px-6 py-3 rounded-full bg-[#d4af37] text-black"
      >
        Save
      </button>
    </div>
  );
}
