"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const success = sessionStorage.getItem("orderSuccess");

    if (!success) {
      router.replace("/cart");
    }
  }, [router]);

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-lg w-full bg-black border border-white/10 rounded-2xl p-10 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle size={72} className="text-[#d4af37]" />
        </div>

        <h1 className="text-3xl font-bold text-white">
          Order Placed Successfully!
        </h1>

        <p className="mt-4 text-gray-400">
          Thank you for shopping with{" "}
          <span className="text-white font-medium">ChronoLux</span>.
          Your order has been confirmed and is being processed.
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/watches"
            onClick={() => sessionStorage.removeItem("orderSuccess")}
            className="px-6 py-3 rounded-full bg-[#d4af37]
            text-black font-semibold hover:opacity-90 transition"
          >
            Continue Shopping
          </Link>

          <Link
            href="/my-orders"
            onClick={() => sessionStorage.removeItem("orderSuccess")}
            className="px-6 py-3 rounded-full border border-white/20
            text-white hover:border-[#d4af37] hover:text-[#d4af37] transition"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </section>
  );
}
