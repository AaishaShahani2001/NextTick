"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/src/context/CartContext";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: ""
  });

  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // 🔒 Redirect if cart empty
  useEffect(() => {
    if (cart.length === 0) {
      router.push("/cart");
    }
  }, [cart, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!form.name || !form.email || !form.address || !form.phone) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            color: item.selectedColor,
            image:
              item.product.images[item.selectedColor] ??
              item.product.images[item.product.colors[0]]
          })),
          shippingAddress: form,
          totalAmount: subtotal
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Order failed");
      }

      // ✅ Clear cart only after success
      clearCart();

      toast.success("Order placed successfully 🎉");

      router.push("/order-success");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
            className="mt-8 w-full py-3 rounded-full bg-[#d4af37]
            text-black font-semibold hover:opacity-90 transition"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </section>
  );
}
