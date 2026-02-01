"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { Product } from "@/src/types/product";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function LatestArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/products/onlyfour?limit=4&sort=createdAt_desc",
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error();

        const data: Product[] = await res.json();
        setProducts(data);
      } catch {
        toast.error("Failed to load latest arrivals");
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-28">
      {/* HEADER */}
      <div className="mb-14 flex justify-between items-end">
        <div>
          <p className="text-xs tracking-[0.3em] text-[#d4af37] uppercase">
            New In Store
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">
            Latest Arrivals
          </h2>
          <p className="mt-3 text-gray-400 max-w-lg">
            Discover the newest additions to our luxury timepiece collection.
          </p>
        </div>

        <Link
          href="/watches"
          className="text-sm text-[#d4af37] hover:underline"
        >
          View All →
        </Link>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-107.5 rounded-3xl bg-white/5 animate-pulse"
              />
            ))
          : products.map((p) => {
              /* ---------------- STOCK LOGIC ---------------- */
              const totalStock = p.variants.reduce(
                (sum, v) => sum + v.stock,
                0
              );

              const lowStock = p.variants.some(
                (v) => v.stock > 0 && v.stock <= 3
              );

              /* ---------------- COLORS ---------------- */
              const colors = Array.from(
                new Set(p.variants.map((v) => v.color))
              );

              return (
                <Link
                  key={p._id}
                  href={`${API_URL}/watches/${p._id}`}
                  className="
                    group relative rounded-3xl overflow-hidden
                    bg-black/60 backdrop-blur
                    border border-white/10
                    hover:border-[#d4af37]/50
                    hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]
                    transition-all duration-500
                  "
                >
                  {/* IMAGE */}
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={
                        Object.values(p.images ?? {})[0] ||
                        "/placeholder-watch.jpg"
                      }
                      alt={p.name}
                      fill
                      className="
                        object-cover
                        group-hover:scale-110
                        transition-transform duration-700
                      "
                    />

                    {/* GRADIENT */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                    {/* BADGES */}
                    {totalStock === 0 ? (
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/90 text-white">
                        Sold Out
                      </span>
                    ) : lowStock ? (
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/90 text-black">
                        Low Stock
                      </span>
                    ) : (
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-linear-to-r from-[#d4af37] to-[#f5e7b2] text-black">
                        NEW
                      </span>
                    )}

                    {/* HOVER CTA */}
                    <div
                      className="
                        absolute inset-0 flex items-center justify-center
                        opacity-0 group-hover:opacity-100
                        transition
                      "
                    >
                      <span
                        className="
                          px-6 py-3 rounded-full
                          bg-[#d4af37]
                          text-black font-semibold
                          shadow-lg
                        "
                      >
                        View Details
                      </span>
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-widest text-gray-400">
                      {p.collection}
                    </p>

                    <h3 className="mt-2 text-lg font-semibold text-white line-clamp-1">
                      {p.name}
                    </h3>


                    <p className="mt-4 text-[#d4af37] font-semibold text-lg">
                      LKR {p.basePrice.toLocaleString()}
                    </p>
                  </div>
                </Link>
              );
            })}
      </div>
    </section>
  );
}
