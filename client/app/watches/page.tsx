"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import toast from "react-hot-toast";
import { Product } from "@/src/types/product";

const CATEGORY_OPTIONS = ["All", "Men", "Women", "Unisex"];
const COLLECTION_OPTIONS = ["All", "Classic", "Sport", "Luxury", "Limited"];

export default function WatchesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  /* URL PARAMS */
  const collectionParam = searchParams.get("collection") || "All";
  const categoryParam = searchParams.get("category") || "All";

  /* STATE */
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(categoryParam);
  const [collection, setCollection] = useState(collectionParam);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/products", {
          cache: "no-store"
        });
        if (!res.ok) throw new Error();
        setProducts(await res.json());
      } catch {
        toast.error("Failed to load watches");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= SYNC FILTERS → URL ================= */

  useEffect(() => {
    const params = new URLSearchParams();

    if (collection !== "All") params.set("collection", collection);
    if (category !== "All") params.set("category", category);

    router.replace(`/watches?${params.toString()}`);
  }, [collection, category]);

  /* ================= FILTER LOGIC ================= */

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(search.toLowerCase());

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
    <section className="max-w-7xl mx-auto px-6 py-14">
      <h1 className="text-4xl font-bold text-white mb-10 text-center">
        {collection === "All" ? "All Watches" : `${collection} Watches`}
      </h1>

      {/* FILTER BAR */}
      <div className="mb-12 grid grid-cols-1 md:grid-cols-5 gap-6
        bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl"
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
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={collection}
          onChange={e => setCollection(e.target.value)}
          className="lux-input"
        >
          {COLLECTION_OPTIONS.map(c => (
            <option key={c}>{c}</option>
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

      {/* GRID */}
      {loading ? (
        <p className="text-center text-gray-400 py-20">
          Loading watches…
        </p>
      ) : filteredProducts.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {filteredProducts.map(p => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-20">
          No watches found.
        </p>
      )}
    </section>
  );
}
