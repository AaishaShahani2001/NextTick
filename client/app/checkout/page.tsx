"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/src/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: ""
  });

  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // ✅ REDIRECT SAFELY IF CART IS EMPTY
  useEffect(() => {
    if (cart.length === 0) {
      router.push("/cart");
    }
  }, [cart, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    if (!form.name || !form.email || !form.address || !form.phone) {
      alert("Please fill all fields");
      return;
    }

    const order = {
      customer: form,
      items: cart,
      total: subtotal,
      placedAt: new Date()
    };

    console.log("ORDER PLACED:", order);

    // ✅ Clear cart first
    clearCart();

    // ✅ Then redirect
    router.push("/order-success");
  };

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      <h1 className="text-4xl font-bold text-white mb-12">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* FORM */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">
            Customer Details
          </h2>

          {["name", "email", "phone", "address"].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={(form as any)[field]}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-black border border-white/10
              text-white placeholder-gray-500 focus:outline-none
              focus:border-[#d4af37]"
            />
          ))}
        </div>

        {/* SUMMARY */}
        <div className="bg-black border border-white/10 rounded-2xl p-8 h-fit">
          <h2 className="text-xl font-semibold text-white mb-6">
            Order Summary
          </h2>

          {cart.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedColor}`}
              className="flex justify-between text-gray-400 mb-3"
            >
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>
                ${item.product.price * item.quantity}
              </span>
            </div>
          ))}

          <div className="border-t border-white/10 mt-6 pt-6 flex justify-between text-lg font-bold text-white">
            <span>Total</span>
            <span className="text-[#d4af37]">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="mt-8 w-full py-3 rounded-full bg-[#d4af37]
            text-black font-semibold hover:opacity-90 transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </section>
  );
}
