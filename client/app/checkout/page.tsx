"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/src/context/CartContext";
import toast from "react-hot-toast";
import { DISCOUNT_THRESHOLD, DISCOUNT_PERCENT } from "@/src/constants/discount";
import Image from "next/image";



export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");


  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    city: "",
    province: "",
    country: "",
    postalCode: ""
  });

  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((total, item) => {
    const adjustment = item.selectedVariant?.priceAdjustment ?? 0;
    return (
      total +
      (item.product.basePrice + adjustment) * item.quantity
    );
  }, 0);

  // Calculate discount
  const discount =
    subtotal >= DISCOUNT_THRESHOLD
      ? (subtotal * DISCOUNT_PERCENT) / 100
      : 0;

  const totalAfterDiscount = subtotal - discount;


  // Redirect if cart empty
  useEffect(() => {
    const orderPlaced = sessionStorage.getItem("orderSuccess");
    if (cart.length === 0 && !orderPlaced) {
      router.push("/cart");
    }
  }, [cart, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    // FORM VALIDATION
    for (const key of Object.keys(form)) {
      if (!(form as any)[key]) {
        toast.error("Please fill all shipping fields");
        return;
      }
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // ONLINE PAYMENT → REDIRECT
    if (paymentMethod === "ONLINE") {
      setLoading(true);

      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` })
          },
          body: JSON.stringify({
            items: cart.map((item) => ({
              productId: item.product._id,
              sku: item.selectedVariant.sku,
              name: item.product.name,
              price:
                item.product.basePrice +
                item.selectedVariant.priceAdjustment,
              quantity: item.quantity
            })),
            shippingAddress: form,
            paymentMethod: "ONLINE"
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        // SAVE ORDER ID
        sessionStorage.setItem("orderId", data.orderId);

        sessionStorage.setItem(
          "checkoutData",
          JSON.stringify({
            cart,
            form,
            subtotal,
            discount,
            total: totalAfterDiscount
          })
        );

        router.push("/payment");
        return;
      } catch (err: any) {
        toast.error(err.message || "Failed to initiate payment");
      } finally {
        setLoading(false);
      }
    }


    // COD → PLACE ORDER DIRECTLY
    await placeOrderCOD();
  };


  useEffect(() => {
    if (cart.length === 0) {
      router.replace("/cart");
    }
  }, [cart, router]);

  const placeOrderCOD = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.product._id,
            sku: item.selectedVariant.sku,
            name: item.product.name,
            price:
              item.product.basePrice +
              item.selectedVariant.priceAdjustment,
            quantity: item.quantity
          })),
          shippingAddress: form,
          subtotal,
          discount,
          totalAmount: totalAfterDiscount,
          paymentMethod: "COD",
          paymentStatus: "Pending"
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Order placed successfully 🎉");

      sessionStorage.setItem("orderSuccess", "true");
      router.push("/order-success");

      setTimeout(() => clearCart(), 0);
    } catch (err: any) {
      toast.error(err.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };




  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-24">
      <h1 className="text-4xl font-bold text-white mb-14 tracking-wide">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* ================= LEFT: SHIPPING DETAILS ================= */}
        <div className="bg-black/80 border border-white/10 rounded-3xl p-8 md:p-10 space-y-8 backdrop-blur">
          <h2 className="text-2xl font-semibold text-white tracking-wide">
            Shipping Details
          </h2>

          {/* BASIC INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["name", "email", "phone"].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={(form as any)[field]}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-xl bg-black
              border border-white/10 text-white placeholder-gray-500
              focus:outline-none focus:border-[#d4af37] transition"
              />
            ))}
          </div>

          {/* ADDRESS */}
          <input
            name="address"
            placeholder="Street Address"
            value={form.address}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-xl bg-black
          border border-white/10 text-white placeholder-gray-500
          focus:outline-none focus:border-[#d4af37]"
          />

          {/* LOCATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["city", "province", "postalCode", "country"].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={
                  field === "postalCode"
                    ? "Postal Code"
                    : field.charAt(0).toUpperCase() + field.slice(1)
                }
                value={(form as any)[field]}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-xl bg-black
              border border-white/10 text-white placeholder-gray-500
              focus:outline-none focus:border-[#d4af37]"
              />
            ))}
          </div>
        </div>

        {/* ================= RIGHT: ORDER SUMMARY ================= */}
        <div className="bg-black/80 border border-white/10 rounded-3xl p-8 md:p-10 h-fit backdrop-blur">
          <h2 className="text-2xl font-semibold text-white mb-8 tracking-wide">
            Order Summary
          </h2>

          <div className="space-y-6">
            {cart.map((item) => {
              const image =
                Object.values(item.product.images ?? {})[0] ||
                "/placeholder-watch.jpg";

              return (
                <div
                  key={item.product._id}
                  className="flex items-center justify-between gap-4"
                >
                  {/* IMAGE + DETAILS */}
                  <div className="flex items-center gap-4">
                    {/* IMAGE */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                      <Image
                        src={image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* TEXT */}
                    <div>
                      <p className="text-white font-medium">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.selectedVariant.strapType} •{" "}
                        {item.selectedVariant.color} •{" "}
                        {item.selectedVariant.sizeMM}mm
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* PRICE */}
                  <p className="text-sm font-semibold text-[#d4af37] whitespace-nowrap">
                    LKR{" "}
                    {(
                      (item.product.basePrice +
                        item.selectedVariant.priceAdjustment) *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>


          {/* DISCOUNT */}
          {subtotal >= DISCOUNT_THRESHOLD && (
            <div className="mt-6 flex justify-between text-green-400 text-sm">
              <span>Discount ({DISCOUNT_PERCENT}%)</span>
              <span>- LKR {discount.toFixed(2)}</span>
            </div>
          )}

          {/* TOTAL */}
          <div className="border-t border-white/10 mt-6 pt-6 flex justify-between text-lg font-bold text-white">
            <span>Total</span>
            <span className="text-[#d4af37]">
              LKR {totalAfterDiscount.toFixed(2)}
            </span>
          </div>

          {/* ================= PAYMENT METHOD ================= */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-white mb-4">
              Payment Method
            </h3>

            <div className="space-y-3">
              {/* COD */}
              <label
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer
      ${paymentMethod === "COD"
                    ? "border-[#d4af37] bg-[#d4af37]/10"
                    : "border-white/10 bg-black"
                  }`}
              >
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="accent-[#d4af37]"
                />
                <span className="text-white font-medium">
                  Cash on Delivery
                </span>
              </label>

              {/* ONLINE */}
              <label
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer
      ${paymentMethod === "ONLINE"
                    ? "border-[#d4af37] bg-[#d4af37]/10"
                    : "border-white/10 bg-black"
                  }`}
              >
                <input
                  type="radio"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                  className="accent-[#d4af37]"
                />
                <span className="text-white font-medium">
                  Online Payment (Card / Wallet)
                </span>
              </label>
            </div>
          </div>


          {/* CTA */}
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="mt-10 w-full py-4 rounded-full bg-[#d4af37]
          text-black font-semibold tracking-wide
          hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Placing Order..." : "Confirm & Place Order"}
          </button>

          <p className="mt-4 text-xs text-gray-500 text-center">
            Secure checkout ·{" "}
            {paymentMethod === "COD"
              ? "Cash on Delivery"
              : "Online Payment"}
          </p>

        </div>
      </div>
    </section>
  );

}
