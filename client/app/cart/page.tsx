"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/src/context/CartContext";

export default function CartPage() {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();

  const subtotal = cart.reduce((total, item) => {
  const adjustment = item.selectedVariant?.priceAdjustment ?? 0;
  return (
    total +
    (item.product.basePrice + adjustment) * item.quantity
  );
}, 0);

  if (cart.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 text-center">
        <h1 className="text-3xl font-bold text-white">
          Your Cart is Empty
        </h1>
        <p className="mt-4 text-gray-400">
          Looks like you haven’t added any watches yet.
        </p>
        <Link
          href="/watches"
          className="inline-block mt-8 px-8 py-3 rounded-full
          bg-[#d4af37] text-black font-semibold hover:opacity-90 transition"
        >
          Browse Watches
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      <h1 className="text-4xl font-bold text-white mb-12">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ITEMS */}
        <div className="lg:col-span-2 space-y-8">
          {cart.map((item) => {
            if (!item.selectedVariant) return null;
            const imageSrc =
              item.product.images?.[0] || "/placeholder-watch.jpg";

            return (
              <div
                key={`${item.product._id}-${item.selectedVariant.sku}`}
                className="flex gap-6 p-6 rounded-2xl bg-black border border-white/10"
              >
                {/* IMAGE */}
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src={imageSrc}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* DETAILS */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {item.product.name}
                  </h3>

                  {/* VARIANT INFO */}
                  <p className="mt-1 text-sm text-gray-400">
                    {item.selectedVariant.strapType} •{" "}
                    {item.selectedVariant.color} •{" "}
                    {item.selectedVariant.sizeMM}mm
                  </p>

                  <p className="mt-3 text-[#d4af37] font-semibold">
                    LKR{" "}
                    {(
                      item.product.basePrice +
                      item.selectedVariant.priceAdjustment
                    ).toFixed(2)}
                  </p>

                  {/* QUANTITY CONTROLS */}
                  <div className="mt-4 flex items-center gap-4">
                    <button
                      onClick={() =>
                        decreaseQty(
                          item.product._id,
                          item.selectedVariant.sku
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center
                      rounded-full border border-white/20 text-white
                      hover:border-red-500 hover:text-red-500 transition"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="text-white font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQty(
                          item.product._id,
                          item.selectedVariant.sku
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center
                      rounded-full border border-white/20 text-white
                      hover:border-[#d4af37] hover:text-[#d4af37] transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* REMOVE */}
                <button
                  onClick={() =>
                    removeFromCart(
                      item.product._id,
                      item.selectedVariant.sku
                    )
                  }
                  className="text-red-400 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* SUMMARY */}
        <div className="bg-black border border-white/10 rounded-2xl p-8 h-fit">
          <h2 className="text-xl font-semibold text-white mb-6">
            Order Summary
          </h2>

          <div className="flex justify-between text-gray-400 mb-4">
            <span>Items</span>
            <span>{cart.length}</span>
          </div>

          <div className="flex justify-between text-gray-400 mb-6">
            <span>Subtotal</span>
            <span>LKR {subtotal.toFixed(2)}</span>
          </div>

          <div className="border-t border-white/10 pt-6 flex justify-between text-lg font-bold text-white">
            <span>Total</span>
            <span className="text-[#d4af37]">
              LKR {subtotal.toFixed(2)}
            </span>
          </div>

          <Link href="/checkout">
            <button
              className="mt-8 w-full py-3 rounded-full bg-[#d4af37]
              text-black font-semibold hover:opacity-90 transition"
            >
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
