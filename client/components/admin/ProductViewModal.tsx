"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/src/types/product";

export default function ProductViewModal({
  product,
  onClose
}: {
  product: Product;
  onClose: () => void;
}) {
  const images = product.images || [];
  const [active, setActive] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);

  /* ================= NAVIGATION ================= */

  const prev = () =>
    setActive(i => (i === 0 ? images.length - 1 : i - 1));

  const next = () =>
    setActive(i => (i === images.length - 1 ? 0 : i + 1));

  /* ================= KEYBOARD ================= */

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ================= SWIPE ================= */

  const onTouchStart = (e: React.TouchEvent) =>
    setStartX(e.touches[0].clientX);

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (diff > 50) next();
    if (diff < -50) prev();
    setStartX(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center px-4">
      <div className="relative w-full max-w-6xl bg-[#0b0b0b] border border-white/10 rounded-3xl p-10">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition"
        >
          <X size={22} />
        </button>

        {/* TITLE */}
        <h2 className="text-3xl font-semibold text-white tracking-wide">
          {product.name}
        </h2>

        {/* SHORT DESCRIPTION */}
        {product.shortDescription && (
          <p className="mt-3 text-gray-300 text-lg leading-relaxed max-w-3xl">
            {product.shortDescription}
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-12 mt-10">
          {/* ================= IMAGE CAROUSEL ================= */}
          <div>
            <div
              className="
                relative h-95 rounded-2xl overflow-hidden
                bg-white/5 border border-white/10
              "
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {images.length > 0 && (
                <Image
                  src={images[active]}
                  alt="watch"
                  fill
                  priority
                  className="object-cover transition-all duration-500"
                />
              )}

              {/* ARROWS */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="
                      absolute left-4 top-1/2 -translate-y-1/2
                      p-2 rounded-full
                      bg-black/40 backdrop-blur
                      border border-white/10
                      text-white hover:opacity-80
                    "
                  >
                    <ChevronLeft />
                  </button>

                  <button
                    onClick={next}
                    className="
                      absolute right-4 top-1/2 -translate-y-1/2
                      p-2 rounded-full
                      bg-black/40 backdrop-blur
                      border border-white/10
                      text-white hover:opacity-80
                    "
                  >
                    <ChevronRight />
                  </button>
                </>
              )}
            </div>

            {/* THUMBNAILS */}
            {images.length > 1 && (
              <div className="mt-5 flex gap-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`
                      relative h-20 w-20 shrink-0 rounded-xl overflow-hidden
                      border transition
                      ${
                        i === active
                          ? "border-[#d4af37]"
                          : "border-white/10 opacity-70 hover:opacity-100"
                      }
                    `}
                  >
                    <Image
                      src={img}
                      alt="thumb"
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= DETAILS ================= */}
          <div className="space-y-10">
            {/* FULL DESCRIPTION */}
            {product.description && (
              <div>
                <p className="text-[#d4af37] font-semibold mb-3 tracking-wide">
                  Product Story
                </p>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* VARIANTS */}
            <div>
              <p className="text-[#d4af37] font-semibold mb-4 tracking-wide">
                Variants & Inventory
              </p>

              <div className="space-y-4 max-h-95 overflow-y-auto pr-2">
                {product.variants.map((v, i) => (
                  <div
                    key={i}
                    className="
                      p-5 rounded-2xl
                      bg-white/5 backdrop-blur
                      border border-white/10
                    "
                  >
                    <p className="text-white font-medium">
                      {v.strapType} • {v.color} • {v.sizeMM}mm
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-400">
                      <span>SKU: {v.sku}</span>
                      <span>Stock: {v.stock}</span>
                      <span>
                        Price Adj: +LKR {v.priceAdjustment.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
