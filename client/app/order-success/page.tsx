"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-32 text-center">
      <CheckCircle size={64} className="mx-auto text-[#d4af37]" />

      <h1 className="mt-6 text-4xl font-bold text-white">
        Order Confirmed
      </h1>

      <p className="mt-4 text-gray-400 max-w-xl mx-auto">
        Thank you for shopping with ChronoLux.
        Your order has been successfully placed and will be
        processed shortly.
      </p>

      <div className="mt-10 flex justify-center gap-6">
        <Link
          href="/watches"
          className="px-8 py-3 rounded-full border border-[#d4af37]
          text-[#d4af37] hover:bg-[#d4af37]
          hover:text-black transition"
        >
          Continue Shopping
        </Link>

        <Link
          href="/"
          className="px-8 py-3 rounded-full bg-[#d4af37]
          text-black font-semibold hover:opacity-90 transition"
        >
          Go Home
        </Link>
      </div>
    </section>
  );
}
