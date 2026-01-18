"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, XCircle } from "lucide-react";
import toast from "react-hot-toast";

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

        const res = await fetch("http://localhost:3000/api/orders/my", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

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

  const handleRestrictedAction = () => {
    toast(
      "This order is already confirmed. Please contact the store to modify or cancel.",
      { icon: "📞" }
    );
  };

  const cancelOrder = async (orderId: string) => {
    const confirmCancel = confirm(
      "Are you sure you want to cancel this order?\nThis action cannot be undone."
    );

    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3000/api/orders/${orderId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Order cancelled successfully");

      // update UI instantly
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "Cancelled" } : o
        )
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel order");
    }
  };


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
          {orders.map((order) => {
            const isLocked = !["Pending"].includes(order.status);

            return (
              <div
                key={order._id}
                className="bg-black border border-white/10
                rounded-2xl p-6 hover:border-[#d4af37]/40 transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  {/* ORDER ID */}
                  <div>
                    <p className="text-sm text-gray-400">Order ID</p>
                    <p className="text-white font-medium">
                      {order._id}
                    </p>
                  </div>

                  {/* DATE */}
                  <div>
                    <p className="text-sm text-gray-400">Date</p>
                    <p className="text-white">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* TOTAL */}
                  <div>
                    <p className="text-sm text-gray-400">Total</p>
                    <p className="text-[#d4af37] font-semibold">
                      ${order.totalAmount}
                    </p>
                  </div>

                  {/* STATUS */}
                  <div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium
                      ${order.status === "Delivered"
                          ? "bg-green-500/10 text-green-400"
                          : order.status === "Cancelled"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-3 justify-start md:justify-end">
                    {/* VIEW */}
                    <Link
                      href={`/orders/${order._id}`}
                      className="p-2 rounded-full border border-white/20
                      hover:border-[#d4af37] hover:text-[#d4af37] transition"
                      title="View Order"
                    >
                      <Eye size={18} />
                    </Link>

                    {/* EDIT */}
                    <button
                      onClick={
                        isLocked
                          ? handleRestrictedAction
                          : () =>
                            toast(
                              "Edit request sent to store (demo).",
                              { icon: "✏️" }
                            )
                      }
                      className={`p-2 rounded-full border
                      ${isLocked
                          ? "border-white/10 text-gray-500 cursor-not-allowed"
                          : "border-[#d4af37] text-[#d4af37]"
                        }`}
                      title="Edit Order"
                    >
                      <Pencil size={18} />
                    </button>

                    {/* CANCEL */}
                    <button
                      onClick={
                        isLocked
                          ? handleRestrictedAction
                          : () => cancelOrder(order._id)
                      }
                      className={`p-2 rounded-full border
  ${isLocked
                          ? "border-white/10 text-gray-500 cursor-not-allowed"
                          : "border-red-500 text-red-400 hover:bg-red-500/10"
                        }`}
                      title="Cancel Order"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>

                {/* LOCKED INFO */}
                {isLocked && (
                  <p className="mt-4 text-sm text-gray-400">
                    This order is already being processed or completed.
                    Please contact the store via call or email for further assistance.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
