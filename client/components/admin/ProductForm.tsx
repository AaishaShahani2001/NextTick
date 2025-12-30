"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

type Product = {
  _id?: string;
  name: string;
  price: number | string;
  category: string;
  collection: string;
  image?: string;
};

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();

  const [form, setForm] = useState<Product>({
    name: product?.name || "",
    price: product?.price || "",
    category: product?.category || "",
    collection: product?.collection || "",
    image: product?.image || ""
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    product?.image || null
  );
  const [loading, setLoading] = useState(false);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= HANDLE IMAGE ================= */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category || !form.collection) {
      toast.error("All fields are required");
      return;
    }

    if (!product && !imageFile) {
      toast.error("Product image is required");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", String(form.price));
    formData.append("category", form.category);
    formData.append("collection", form.collection);
    //formData.append("image", imageFile);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const url = product
      ? `http://localhost:3000/api/admin/products/${product._id}`
      : "http://localhost:3000/api/admin/products";

    try {
      const res = await fetch(url, {
        method: product ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      });

      if (!res.ok) throw new Error();

      toast.success(
        product ? "Product updated successfully" : "Product created successfully"
      );

      router.push("/admin/products");
    } catch {
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl bg-black border border-white/10 p-8 rounded-2xl">
      <h1 className="text-3xl font-bold text-white mb-8">
        {product ? "Edit Product" : "Add New Product"}
      </h1>

      <div className="space-y-5">
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-black border border-white/10 text-white"
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-black border border-white/10 text-white"
        />

        <input
          name="category"
          placeholder="Category (Luxury / Sport / Classic)"
          value={form.category}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-black border border-white/10 text-white"
        />

        <input
          name="collection"
          placeholder="Collection"
          value={form.collection}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-black border border-white/10 text-white"
        />

        {/* IMAGE UPLOAD */}
        <div className="space-y-3">
          <label className="text-sm text-gray-400">
            Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-gray-400"
          />

          {preview && (
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-full bg-[#d4af37]
          text-black font-semibold hover:opacity-90 transition"
        >
          {loading
            ? product
              ? "Updating..."
              : "Creating..."
            : product
            ? "Update Product"
            : "Create Product"}
        </button>
      </div>
    </div>
  );
}
