"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Order = {
  _id: string;
  createdAt: string;
  totalAmount: number;
  status: "Processing" | "Delivered" | "Cancelled";
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:3000/api/orders/my",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-400 py-40">
        Loading orders...
      </p>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      <h1 className="text-4xl font-bold text-white mb-12">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-400">
          <p>You haven’t placed any orders yet.</p>
          <Link
            href="/watches"
            className="inline-block mt-6 px-8 py-3 rounded-full
            bg-[#d4af37] text-black font-semibold"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="block bg-black border border-white/10
              rounded-2xl p-6 hover:border-[#d4af37]/40 transition"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                <div>
                  <p className="text-sm text-gray-400">Order ID</p>
                  <p className="text-white font-medium">
                    {order._id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Date</p>
                  <p className="text-white">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Total</p>
                  <p className="text-[#d4af37] font-semibold">
                    ${order.totalAmount}
                  </p>
                </div>

                <div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium
                    ${
                      order.status === "Delivered"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
