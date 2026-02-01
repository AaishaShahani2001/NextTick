"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CreditCard, Lock } from "lucide-react";
import { useCart } from "@/src/context/CartContext";

export default function PaymentPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });

  /* ---------------- LOAD CHECKOUT DATA ---------------- */
  useEffect(() => {
    const data = sessionStorage.getItem("checkoutData");
    if (!data) router.replace("/checkout");
  }, [router]);

  /* ---------------- HELPERS ---------------- */
  const isExpiryValid = (value: string) => {
    if (!/^\d{2}\/\d{2}$/.test(value)) return false;
    const [mm, yy] = value.split("/").map(Number);
    if (mm < 1 || mm > 12) return false;
    return new Date(2000 + yy, mm) > new Date();
  };

  const luhnCheck = (num: string) => {
    let sum = 0;
    let dbl = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let d = Number(num[i]);
      if (dbl) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
      dbl = !dbl;
    }
    return sum % 10 === 0;
  };

  const isFormValid = useMemo(() => {
    return (
      card.number.length === 16 &&
      luhnCheck(card.number) &&
      card.name.trim().length >= 3 &&
      isExpiryValid(card.expiry) &&
      card.cvv.length === 3
    );
  }, [card]);

  /* ---------------- PAY HANDLER ---------------- */
  const handlePay = async () => {
    if (!isFormValid) {
      toast.error("Please enter valid payment details");
      return;
    }

    const orderId = sessionStorage.getItem("orderId");
    if (!orderId) {
      toast.error("Order not found. Please checkout again.");
      router.replace("/checkout");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}/payment-success`,
        { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Payment successful 🎉");
      sessionStorage.clear();
      sessionStorage.setItem("orderSuccess", "true");

      clearCart();
      router.push("/order-success");
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-lg mx-auto px-6 py-24">
      <div className="bg-black border border-white/10 rounded-3xl p-8 shadow-xl">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-full bg-[#d4af37]/10">
            <CreditCard className="text-[#d4af37]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Secure Online Payment
            </h1>
            <p className="text-sm text-gray-400">
              Enter your card details to complete payment
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="space-y-6">
          {/* CARD NUMBER */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
              Card Number
            </label>
            <input
              value={card.number}
              maxLength={16}
              onChange={(e) =>
                setCard({
                  ...card,
                  number: e.target.value.replace(/\D/g, "")
                })
              }
              className="
                w-full h-12 rounded-xl bg-black border border-white/20
                px-4 text-white text-sm
                focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]
                outline-none transition
              "
              placeholder="1234 5678 9012 3456"
            />
          </div>

          {/* CARD HOLDER */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
              Card Holder Name
            </label>
            <input
              value={card.name}
              onChange={(e) =>
                setCard({ ...card, name: e.target.value })
              }
              className="
                w-full h-12 rounded-xl bg-black border border-white/20
                px-4 text-white text-sm
                focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]
                outline-none transition
              "
              placeholder="John Doe"
            />
          </div>

          {/* EXPIRY + CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
                Expiry
              </label>
              <input
                value={card.expiry}
                maxLength={5}
                onChange={(e) =>
                  setCard({ ...card, expiry: e.target.value })
                }
                className="
                  w-full h-12 rounded-xl bg-black border border-white/20
                  px-4 text-white text-sm
                  focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]
                  outline-none transition
                "
                placeholder="MM/YY"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
                CVV
              </label>
              <input
                value={card.cvv}
                maxLength={3}
                onChange={(e) =>
                  setCard({
                    ...card,
                    cvv: e.target.value.replace(/\D/g, "")
                  })
                }
                className="
                  w-full h-12 rounded-xl bg-black border border-white/20
                  px-4 text-white text-sm
                  focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]
                  outline-none transition
                "
                placeholder="123"
              />
            </div>
          </div>
        </div>

        {/* PAY BUTTON */}
        <button
          onClick={handlePay}
          disabled={!isFormValid || loading}
          className={`
            mt-10 w-full h-12 rounded-full font-semibold transition
            ${
              isFormValid
                ? "bg-[#d4af37] text-black hover:opacity-90"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {loading ? "Processing Payment..." : "Pay Securely"}
        </button>

        {/* FOOTER */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <Lock size={14} />
          256-bit SSL encrypted • Secure checkout
        </div>
      </div>
    </section>
  );
}
