"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PackageCheck, Headphones } from "lucide-react";
import toast from "react-hot-toast";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: "Processing" | "Delivered" | "Cancelled";
  createdAt: string;
};

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

  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-white mb-10">
        Order Summary
      </h1>

      <div className="bg-black border border-white/10 rounded-2xl p-8 space-y-8">
        {/* HEADER */}
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
              ${
                order.status === "Delivered"
                  ? "bg-green-500/10 text-green-400"
                  : order.status === "Cancelled"
                  ? "bg-red-500/10 text-red-400"
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

        {/* ITEMS */}
        <div className="border-t border-white/10 pt-6">
          <h2 className="text-xl text-white mb-4">
            Ordered Items
          </h2>

          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between text-gray-300"
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
        </div>

        {/* SUPPORT NOTICE */}
        <div className="border-t border-white/10 pt-6 flex gap-4 items-start">
          <Headphones className="text-[#d4af37]" />
          <p className="text-sm text-gray-400 leading-relaxed">
            Need to modify or cancel this order?  
            Once an order is confirmed, changes must be handled by our support team.
            Please contact us via phone or email for assistance.
          </p>
        </div>

        {/* FOOTER ICON */}
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
