"use client";

import { useEffect, useState } from "react";
import CollectionCard from "@/components/CollectionCard";
import toast from "react-hot-toast";

type Collection = {
  _id: string;
  count: number;
  image?: string[];
};

const COLLECTION_META: Record<string, string> = {
  Classic: "Timeless designs crafted with precision and elegance.",
  Sport: "Built for performance, durability, and active lifestyles.",
  Luxury: "Refined timepieces made with premium materials.",
  Limited: "Exclusive editions produced in limited quantities.",
  SmartWatch: "bbbbbbbbbbbbbbbbbbbb",
};

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:5000/api/products/collections",
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setCollections(data);
    } catch {
      toast.error("Failed to load collections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      {/* HEADER */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Our <span className="text-[#d4af37]">Collections</span>
        </h1>

        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          Explore curated watch collections crafted to match
          your lifestyle and ambition.
        </p>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="py-20 text-center text-gray-400">
          Loading collections…
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {collections.map(c => (
            <CollectionCard
              key={c._id}
              title={c._id}
              description={
                COLLECTION_META[c._id] ??
                "Explore our exclusive watch collection."
              }
              image={c.image?.[0] ?? "/collections/default.jpg"}
              count={c.count}
              href={`/watches?collection=${encodeURIComponent(c._id)}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
