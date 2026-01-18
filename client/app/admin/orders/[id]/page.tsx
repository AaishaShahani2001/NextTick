"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

/* ---------------- TYPES ---------------- */
type OrderStatus = "Pending" | "Processing" | "Delivered" | "Cancelled";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  items: OrderItem[];
};

/* ---------------- TIMELINE ---------------- */
const OrderTimeline = ({ status }: { status: OrderStatus }) => {
  const steps: OrderStatus[] = ["Pending", "Processing", "Delivered"];

  return (
    <div className="flex items-center gap-4 mt-4">
      {steps.map((step, idx) => {
        const active =
          status !== "Cancelled" &&
          steps.indexOf(status) >= idx;

        return (
          <div key={step} className="flex items-center gap-4">
            <div
              className={`w-3 h-3 rounded-full ${
                active ? "bg-[#d4af37]" : "bg-white/20"
              }`}
            />
            {idx < steps.length - 1 && (
              <div
                className={`w-10 h-0.5 ${
                  active ? "bg-[#d4af37]" : "bg-white/10"
                }`}
              />
            )}
          </div>
        );
      })}
      {status === "Cancelled" && (
        <span className="text-sm text-red-400 ml-2">
          Cancelled
        </span>
      )}
    </div>
  );
};

/* ---------------- STATUS FLOW ---------------- */
const getAllowedNextStatuses = (status: OrderStatus) => {
  if (status === "Pending") return ["Processing"];
  if (status === "Processing") return ["Delivered"];
  return [];
};

/* ---------------- PAGE ---------------- */
export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH ORDER ---------------- */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:3000/api/admin/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setOrder(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load order");
        router.push("/admin/orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, router]);

  /* ---------------- UPDATE STATUS ---------------- */
  const updateStatus = async (newStatus: OrderStatus) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3000/api/admin/orders/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Order status updated");
      setOrder((prev) =>
        prev ? { ...prev, status: newStatus } : prev
      );
    } catch (err: any) {
      toast.error(err.message || "Status update failed");
    }
  };

  if (loading) {
    return (
      <p className="text-gray-400 text-center py-40">
        Loading order...
      </p>
    );
  }

  if (!order) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold text-white mb-8">
        Order Details
      </h1>

      <div className="bg-black border border-white/10 rounded-2xl p-8 space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="text-sm text-gray-400">Order ID</p>
            <p className="text-white break-all">
              {order._id}
            </p>

            <p className="mt-4 text-sm text-gray-400">Placed On</p>
            <p className="text-white">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-400">Customer</p>
            <p className="text-white">{order.user.name}</p>
            <p className="text-xs text-gray-400">
              {order.user.email}
            </p>

            <p className="mt-4 text-sm text-gray-400">Total</p>
            <p className="text-2xl font-bold text-[#d4af37]">
              ${order.totalAmount}
            </p>
          </div>
        </div>

        {/* STATUS */}
        <div>
          <p className="text-sm text-gray-400 mb-2">
            Order Status
          </p>

          {order.status === "Cancelled" ? (
            <p className="text-red-400 font-medium">
              Cancelled by customer (read-only)
            </p>
          ) : (
            <select
              value={order.status}
              onChange={(e) =>
                updateStatus(e.target.value as OrderStatus)
              }
              className="bg-black border border-white/20
              text-white rounded-xl px-4 py-2"
            >
              <option value={order.status}>
                {order.status}
              </option>

              {getAllowedNextStatuses(order.status).map(
                (s) => (
                  <option key={s} value={s}>
                    Move to {s}
                  </option>
                )
              )}
            </select>
          )}

          <OrderTimeline status={order.status} />
        </div>

        {/* ITEMS */}
        <div className="border-t border-white/10 pt-6">
          <h2 className="text-xl text-white mb-4">
            Ordered Items
          </h2>

          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between text-gray-300 mb-2"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* FOOTER NOTE */}
        <div className="border-t border-white/10 pt-6 text-sm text-gray-400">
          Cancelled orders are immutable audit records.  
          Status transitions are forward-only to ensure order integrity.
        </div>
      </div>
    </section>
  );
}
