"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Product } from "@/src/types/product";
import { useCart } from "@/src/context/CartContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function WatchDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("token");

  const [selectedVariant, setSelectedVariant] =
    useState<Product["variants"][0] | null>(null);


  /* IMAGE STATE */
  const [activeImage, setActiveImage] = useState(0);

  /* ================= FETCH PRODUCT ================= */

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:3000/api/products/${id}`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error();

      const data: Product = await res.json();
      setProduct(data);
    } catch {
      toast.error("Failed to load watch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  /* ================= LOADING / ERROR ================= */

  if (loading) {
    return (
      <div className="py-25 text-center text-gray-400">
        Loading watch…
      </div>
    );
  }

  const canPurchase =
    selectedVariant !== null && selectedVariant.stock > 0 && isLoggedIn;



  if (!product) {
    return (
      <div className="py-25 text-center">
        <h2 className="text-2xl font-semibold text-white">
          Watch not found
        </h2>
        <p className="mt-2 text-gray-400">
          The requested timepiece does not exist.
        </p>
      </div>
    );
  }

  const images = product.images || [];

  /* ================= UI ================= */

  return (
    <section className="max-w-7xl mx-auto px-1 md:px-3 py-5">
      {/* BREADCRUMB */}
      <nav className="mb-6 text-sm text-gray-500">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              href="/"
              className="hover:text-[#d4af37] transition"
            >
              Home
            </Link>
          </li>

          <li className="opacity-60">/</li>

          <li>
            <Link
              href="/watches"
              className="hover:text-[#d4af37] transition"
            >
              Watches
            </Link>
          </li>

          <li className="opacity-60">/</li>

          <li className="text-white font-medium truncate max-w-xs">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* ================= IMAGES ================= */}
        <div>
          {/* MAIN IMAGE */}
          <div
            className="
              relative h-130 rounded-3xl overflow-hidden
              bg-white/5 backdrop-blur
              border border-white/10
            "
          >
            {images.length > 0 && (
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                priority
                className="object-cover transition-all duration-700"
              />
            )}

            {/* ARROWS */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImage(i =>
                      i === 0 ? images.length - 1 : i - 1
                    )
                  }
                  className="
                    absolute left-4 top-1/2 -translate-y-1/2
                    p-2 rounded-full bg-black/40
                    border border-white/10 text-white
                  "
                >
                  <ChevronLeft />
                </button>

                <button
                  onClick={() =>
                    setActiveImage(i =>
                      i === images.length - 1 ? 0 : i + 1
                    )
                  }
                  className="
                    absolute right-4 top-1/2 -translate-y-1/2
                    p-2 rounded-full bg-black/40
                    border border-white/10 text-white
                  "
                >
                  <ChevronRight />
                </button>
              </>
            )}
          </div>

          {/* THUMBNAILS */}
          {images.length > 1 && (
            <div className="mt-6 flex gap-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`
                    relative h-20 w-20 rounded-xl overflow-hidden
                    border transition
                    ${i === activeImage
                      ? "border-[#d4af37]"
                      : "border-white/10 opacity-70 hover:opacity-100"
                    }
                  `}
                >
                  <Image src={img} alt="thumb" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= DETAILS ================= */}
        <div>
          <p className="text-xs uppercase tracking-widest text-[#d4af37]">
            {product.collection} • {product.category}
          </p>

          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-white">
            {product.name}
          </h1>

          <p className="mt-6 text-gray-400 leading-relaxed">
            {product.shortDescription}
          </p>

          <p className="mt-4 text-gray-500 leading-relaxed">
            {product.description}
          </p>

          <p className="mt-8 text-3xl font-semibold text-[#d4af37]">
            LKR {product.basePrice.toLocaleString()}
          </p>

          {/* ACTIONS */}
          <div className="mt-10 flex gap-4">
            <button
              disabled={!canPurchase}
              onClick={() => {
                if (!isLoggedIn) {
                  toast.error("Please login to add items to your cart");
                  return;
                }
                if (!canPurchase) {
                  toast.error("Please select an available variant");
                  return;
                }

                addToCart({
                  product,
                  quantity: 1,
                  selectedVariant
                });

                toast.success("Added to cart");
              }}
              className={`
    px-8 py-3 rounded-full font-semibold transition
    ${!canPurchase
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-[#d4af37] text-black hover:opacity-90"
                }
  `}
            >
              Add to Cart
            </button>



            <Link
              href={canPurchase && isLoggedIn ? "/checkout" : "#"}
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  toast.error("Please login to continue with purchase");
                  return;
                }
                if (!canPurchase) {
                  e.preventDefault();
                  toast.error("Please select an available variant");
                  return;
                }

                addToCart({
                  product,
                  quantity: 1,
                  selectedVariant
                });
              }}
              className={`
    px-8 py-3 rounded-full border font-semibold transition
    ${!canPurchase
                  ? "border-gray-600 text-gray-400 cursor-not-allowed"
                  : "border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black"
                }
  `}
            >
              Buy Now
            </Link>


          </div>

          <p className="mt-2 text-sm text-gray-400">
            {!isLoggedIn
              ? "Please login to add items to cart or buy."
              : "Please select an available variant before adding to cart or buying."}
          </p>


          {/* VARIANTS */}
          <div className="mt-16">
            <h3 className="text-xl font-semibold text-[#d4af37] mb-6 tracking-wide">
              Available Variants
            </h3>

            <div className="grid gap-6">
              {product.variants.map((v, i) => {
                const stockStatus =
                  v.stock === 0
                    ? {
                      label: "Out of Stock",
                      style:
                        "bg-red-500/10 text-red-400 border-red-500/20"
                    }
                    : v.stock <= 3
                      ? {
                        label: "Low Stock",
                        style:
                          "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }
                      : {
                        label: "In Stock",
                        style:
                          "bg-green-500/10 text-green-400 border-green-500/20"
                      };

                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (v.stock === 0) return;
                      setSelectedVariant(v);
                    }}
                    className={`
    relative p-6 rounded-3xl cursor-pointer
    bg-white/5 backdrop-blur-xl
    border transition
    ${selectedVariant?.sku === v.sku
                        ? "border-[#d4af37]"
                        : "border-white/10 hover:border-[#d4af37]/40"
                      }
    ${v.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}
  `}
                  >

                    {/* STOCK BADGE */}
                    <span
                      className={`
              absolute top-5 right-5
              px-3 py-1 rounded-full
              text-xs font-semibold
              border ${stockStatus.style}
            `}
                    >
                      {stockStatus.label}
                    </span>

                    {/* VARIANT INFO */}
                    <p className="text-white text-lg font-medium">
                      {v.strapType}
                      <span className="text-gray-400 font-normal">
                        {" "}• {v.color} • {v.sizeMM}mm
                      </span>
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm text-gray-400">
                      <span>
                        <span className="text-gray-500">SKU:</span> {v.sku}
                      </span>

                      <span>
                        <span className="text-gray-500">Price Adj:</span>{" "}
                        +LKR {v.priceAdjustment.toLocaleString()}
                      </span>
                      {selectedVariant && (
                        <p className="mt-4 text-sm text-gray-400">
                          Selected: {selectedVariant.strapType} •{" "}
                          {selectedVariant.color} • {selectedVariant.sizeMM}mm
                        </p>
                      )}


                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
