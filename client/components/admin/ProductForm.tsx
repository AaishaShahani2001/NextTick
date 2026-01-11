"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { Trash2 } from "lucide-react";

/* ================= TYPES ================= */

type Variant = {
  sku: string;
  strapType: string;
  color: string;
  sizeMM: number;
  stock: number;
  priceAdjustment: number;
};

type Product = {
  _id?: string;
  name: string;
  basePrice: number | string;
  category: string;
  collection: string;
  shortDescription?: string;
  description?: string;
  variants: Variant[];
};

/* ================= CONSTANTS ================= */

const CATEGORY_OPTIONS = ["Men", "Women", "Unisex"];
const COLLECTION_OPTIONS = ["Classic", "Sport", "Luxury", "Limited"];

/* ================= UI HELPERS ================= */

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] uppercase tracking-widest text-gray-400">
        {label}
      </label>
      {children}
    </div>
  );
}

/* ================= COMPONENT ================= */

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();

  const [form, setForm] = useState<Product>({
    name: product?.name || "",
    basePrice: product?.basePrice || "",
    category: product?.category || "",
    collection: product?.collection || "",
    shortDescription: product?.shortDescription || "",
    description: product?.description || "",
    variants: product?.variants || [
      {
        sku: "",
        strapType: "",
        color: "",
        sizeMM: 42,
        stock: 0,
        priceAdjustment: 0
      }
    ]
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= IMAGE HANDLER ================= */

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  /* ================= VARIANT HELPERS ================= */

  const addVariant = () => {
    setForm({
      ...form,
      variants: [
        ...form.variants,
        {
          sku: "",
          strapType: "",
          color: "",
          sizeMM: 42,
          stock: 0,
          priceAdjustment: 0
        }
      ]
    });
  };

  const removeVariant = (index: number) => {
    if (form.variants.length === 1) {
      toast.error("At least one variant is required");
      return;
    }
    setForm({
      ...form,
      variants: form.variants.filter((_, i) => i !== index)
    });
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.basePrice ||
      !form.category ||
      !form.collection
    ) {
      toast.error("Please complete all required fields");
      return;
    }

    for (const v of form.variants) {
      if (!v.sku || !v.strapType || !v.color) {
        toast.error("Each variant must be fully defined");
        return;
      }
    }

    if (!product && images.length === 0) {
      toast.error("Product images are required");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("basePrice", String(form.basePrice));
    formData.append("category", form.category);
    formData.append("collection", form.collection);
    formData.append("shortDescription", form.shortDescription || "");
    formData.append("description", form.description || "");
    formData.append("variants", JSON.stringify(form.variants));

    images.forEach(img => formData.append("images", img));

    const url = product
      ? `http://localhost:3000/api/admin/products/${product._id}`
      : "http://localhost:3000/api/admin/products";

    try {
      const res = await fetch(url, {
        method: product ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: formData
      });

      if (!res.ok) throw new Error();

      toast.success(product ? "Product updated" : "Product created");
      router.push("/admin/products");
    } catch {
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-5xl mx-auto bg-[#0b0b0b] border border-white/10 rounded-3xl p-12 space-y-14">
      <h1 className="text-4xl font-bold text-white tracking-wide">
        {product ? "Edit Luxury Watch" : "Add Luxury Watch"}
      </h1>

      {/* PRODUCT INFO */}
      <div className="grid grid-cols-2 gap-10">
        <Field label="Watch Name">
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="lux-input"
          />
        </Field>

        <Field label="Base Price (LKR)">
          <input
            type="number"
            value={form.basePrice}
            onChange={e => setForm({ ...form, basePrice: e.target.value })}
            className="lux-input"
          />
        </Field>

        <Field label="Category">
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            className="lux-input"
          >
            <option value="">Select category</option>
            {CATEGORY_OPTIONS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Collection">
          <select
            value={form.collection}
            onChange={e => setForm({ ...form, collection: e.target.value })}
            className="lux-input"
          >
            <option value="">Select collection</option>
            {COLLECTION_OPTIONS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* DESCRIPTIONS */}
      <div className="grid grid-cols-1 gap-8">
        <Field label="Short Description (Listing Summary)">
          <input
            value={form.shortDescription}
            onChange={e =>
              setForm({ ...form, shortDescription: e.target.value })
            }
            placeholder="A refined timepiece crafted for timeless elegance."
            className="lux-input"
          />
        </Field>

        <Field label="Full Description (Product Story)">
          <textarea
            value={form.description}
            onChange={e =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="Describe the inspiration, craftsmanship, materials, and experience of this watch..."
            className="lux-textarea h-40"
          />
        </Field>
      </div>

      {/* VARIANTS */}
      <div>
        <h2 className="text-xl font-semibold text-[#d4af37] mb-6">
          Watch Variants
        </h2>

        {form.variants.map((v, i) => (
          <div
            key={i}
            className="
              relative mb-8 rounded-2xl p-8
              bg-white/5 backdrop-blur-xl
              border border-white/10
              shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]
            "
          >
            <button
              onClick={() => removeVariant(i)}
              className="absolute top-6 right-6 text-red-400 hover:text-red-500"
            >
              <Trash2 size={18} />
            </button>

            <h3 className="text-[#d4af37] font-semibold mb-6">
              Variant {i + 1}
            </h3>

            <div className="grid grid-cols-3 gap-8">
              <Field label="SKU">
                <input
                  value={v.sku}
                  onChange={e => {
                    const variants = [...form.variants];
                    variants[i].sku = e.target.value;
                    setForm({ ...form, variants });
                  }}
                  className="lux-input"
                />
              </Field>

              <Field label="Strap Type">
                <input
                  value={v.strapType}
                  onChange={e => {
                    const variants = [...form.variants];
                    variants[i].strapType = e.target.value;
                    setForm({ ...form, variants });
                  }}
                  className="lux-input"
                />
              </Field>

              <Field label="Color">
                <input
                  value={v.color}
                  onChange={e => {
                    const variants = [...form.variants];
                    variants[i].color = e.target.value;
                    setForm({ ...form, variants });
                  }}
                  className="lux-input"
                />
              </Field>

              <Field label="Case Size (mm)">
                <input
                  type="number"
                  value={v.sizeMM}
                  onChange={e => {
                    const variants = [...form.variants];
                    variants[i].sizeMM = Number(e.target.value);
                    setForm({ ...form, variants });
                  }}
                  className="lux-input"
                />
              </Field>

              <Field label="Available Stock">
                <input
                  type="number"
                  value={v.stock}
                  onChange={e => {
                    const variants = [...form.variants];
                    variants[i].stock = Number(e.target.value);
                    setForm({ ...form, variants });
                  }}
                  className="lux-input"
                />
              </Field>

              <Field label="Price Adjustment (+ LKR)">
                <input
                  type="number"
                  value={v.priceAdjustment}
                  onChange={e => {
                    const variants = [...form.variants];
                    variants[i].priceAdjustment = Number(e.target.value);
                    setForm({ ...form, variants });
                  }}
                  className="lux-input"
                />
              </Field>
            </div>
          </div>
        ))}

        <button
          onClick={addVariant}
          className="text-[#d4af37] hover:underline"
        >
          + Add Variant
        </button>
      </div>

      {/* IMAGES */}
      <div>
        <label className="text-xs uppercase tracking-widest text-gray-400">
          Product Images
        </label>
        <input type="file" multiple onChange={handleImagesChange} />
        {previews.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mt-6">
            {previews.map((src, i) => (
              <div key={i} className="relative h-32 rounded-xl overflow-hidden">
                <Image src={src} alt="preview" fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-4 rounded-full bg-[#d4af37] text-black font-semibold text-lg"
      >
        {loading ? "Saving…" : product ? "Update Product" : "Create Product"}
      </button>
    </div>
  );
}
