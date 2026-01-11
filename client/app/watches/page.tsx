"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import toast from "react-hot-toast";
import { Product } from "@/src/types/product";

/* ================= FILTER OPTIONS ================= */

const CATEGORY_OPTIONS = ["All", "Men", "Women", "Unisex", "Luxury", "Sport"];
const COLLECTION_OPTIONS = ["All", "Classic", "Sport", "Luxury", "Limited"];

/* ================= COMPONENT ================= */

export default function WatchesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /* Filters */
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [collection, setCollection] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  /* ================= FETCH PRODUCTS ================= */

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/api/products", {
        cache: "no-store"
      });

      if (!res.ok) throw new Error();

      const data: Product[] = await res.json();
      setProducts(data);
    } catch {
      toast.error("Failed to load watches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= FILTER LOGIC ================= */

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.collection.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || p.category === category;

      const matchesCollection =
        collection === "All" || p.collection === collection;

      const matchesMin =
        !minPrice || p.basePrice >= Number(minPrice);

      const matchesMax =
        !maxPrice || p.basePrice <= Number(maxPrice);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesCollection &&
        matchesMin &&
        matchesMax
      );
    });
  }, [products, search, category, collection, minPrice, maxPrice]);

  /* ================= UI ================= */

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-14">
      {/* HEADER */}
      <div className="mb-14 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wide">
          All Watches
        </h1>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          Discover our curated selection of luxury timepieces,
          crafted with precision and timeless elegance.
        </p>
      </div>

      {/* FILTER BAR */}
      <div
        className="
          mb-14 p-6 rounded-3xl
          bg-white/5 backdrop-blur-xl
          border border-white/10
          grid grid-cols-1 md:grid-cols-5 gap-6
        "
      >
        <input
          placeholder="Search watches..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="lux-input md:col-span-2"
        />

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="lux-input"
        >
          {CATEGORY_OPTIONS.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={collection}
          onChange={e => setCollection(e.target.value)}
          className="lux-input"
        >
          {COLLECTION_OPTIONS.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="lux-input"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="lux-input"
          />
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="py-20 text-center text-gray-400">
          Loading watches...
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {filteredProducts.map(product => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-20">
          No watches match your filters.
        </div>
      )}
    </section>
  );
}
