"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  PackageCheck,
  Headphones,
  Clock,
  Truck,
  CheckCircle,
  XCircle
} from "lucide-react";
import toast from "react-hot-toast";

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type StatusHistoryItem = {
  status: OrderStatus;
  at: string;
  comment?: string;
};

type Order = {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  trackingId?: string;
  courier?: string;
  createdAt: string;
  statusHistory?: StatusHistoryItem[];

};

/* ---------------- STATUS HISTORY (UI LOGIC) ---------------- */
const statusSteps: {
  key: OrderStatus;
  label: string;
  icon: React.ReactNode;
}[] = [
    { key: "Processing", label: "Order Processing", icon: <Clock size={18} /> },
    { key: "Shipped", label: "Order Shipped", icon: <Truck size={18} /> },
    { key: "Delivered", label: "Order Delivered", icon: <CheckCircle size={18} /> }
  ];


export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:3000/api/orders/${id}`,
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
        toast.error(err.message);
        router.push("/my-orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, router]);

  if (loading) {
    return (
      <p className="text-center py-40 text-gray-400">
        Loading order details...
      </p>
    );
  }

  if (!order) return null;

  const getStatusTime = (status: OrderStatus) => {
    return order.statusHistory?.find(s => s.status === status)?.at;
  };


  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-white mb-10">
        Order Details
      </h1>

      <div className="bg-black border border-white/10 rounded-2xl p-8 space-y-10">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="text-sm text-gray-400">Order ID</p>
            <p className="text-white font-medium break-all">
              {order._id}
            </p>

            <p className="text-sm text-gray-400 mt-4">Order Date</p>
            <p className="text-white">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <span
              className={`px-5 py-2 rounded-full text-sm font-semibold
              ${order.status === "Delivered"
                  ? "bg-green-500/10 text-green-400"
                  : order.status === "Cancelled"
                    ? "bg-red-500/10 text-red-400"
                    : order.status === "Shipped"
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-yellow-500/10 text-yellow-400"
                }`}
            >
              {order.status}
            </span>

            <p className="mt-4 text-sm text-gray-400">
              Total Amount
            </p>
            <p className="text-2xl font-bold text-[#d4af37]">
              LKR {order.totalAmount}
            </p>
          </div>
        </div>

        {/* ================= STATUS HISTORY ================= */}

        <div className="border-t border-white/10 pt-6">
          <h2 className="text-xl text-white mb-6">
            Order Status History
          </h2>

          <div className="space-y-5">
            {order.statusHistory?.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 rounded-xl
      border border-white/10 bg-black/40 p-4"
              >
                {/* DOT */}
                <div className="mt-1 w-3 h-3 rounded-full bg-[#d4af37]" />

                {/* CONTENT */}
                <div className="flex-1">
                  <p className="flex items-center gap-2 text-white font-medium">
                    {step.status === "Processing" && <Clock size={14} />}
                    {step.status === "Shipped" && <Truck size={14} />}
                    {step.status === "Delivered" && <CheckCircle size={14} />}
                    {step.status === "Cancelled" && <XCircle size={14} />}
                    {step.status}
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(step.at).toLocaleString()}
                  </p>

                  {/* ADMIN COMMENT */}
                  {step.comment && (
                    <p className="mt-2 text-sm text-gray-300 italic">
                      “{step.comment}”
                    </p>
                  )}
                </div>
              </div>
            ))}

            {!order.statusHistory?.length && (
              <p className="text-sm text-gray-500">
                Status history not available for this order.
              </p>
            )}
          </div>

        </div>


        {/* ================= SHIPPING INFO ================= */}
        {order.trackingId && (
          <div className="rounded-2xl border border-white/10 bg-black/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Shipping Information
            </h3>

            <p className="text-gray-400 text-sm">
              Courier:
              <span className="ml-2 text-white font-medium">
                {order.courier}
              </span>
            </p>

            <p className="text-gray-400 text-sm mt-2">
              Tracking ID:
              <span className="ml-2 text-[#d4af37] font-semibold">
                {order.trackingId}
              </span>
            </p>
          </div>
        )}

        {/* ================= ITEMS ================= */}
        <div>
          <h2 className="text-xl text-white mb-4">
            Ordered Items
          </h2>

          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between text-gray-300 border-b border-white/10 pb-2"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>
                  LKR {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= SUPPORT ================= */}
        <div className="border-t border-white/10 pt-6 flex gap-4 items-start">
          <Headphones className="text-[#d4af37]" />
          <p className="text-sm text-gray-400 leading-relaxed">
            Need help with this order? Once an order is confirmed,
            changes must be handled by our support team.
            Please contact us via phone or email.
          </p>
        </div>

        {/* ================= FOOTER ICON ================= */}
        <div className="flex justify-center pt-6">
          <PackageCheck
            size={48}
            className="text-[#d4af37] opacity-80"
          />
        </div>
      </div>
    </section>
  );
}
