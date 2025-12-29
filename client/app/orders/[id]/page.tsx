"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  image: string;
};

type Order = {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
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
      setOrder(data);
    };

    fetchOrder();
  }, [id]);

  if (!order) {
    return (
      <p className="text-center text-gray-400 py-40">
        Loading order...
      </p>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-12 py-20">
      <h1 className="text-4xl font-bold text-white mb-8">
        Order Details
      </h1>

      {/* ORDER META */}
      <div className="bg-black border border-white/10 rounded-2xl p-6 mb-10">
        <p className="text-gray-400">
          Order ID: <span className="text-white">{order._id}</span>
        </p>
        <p className="text-gray-400">
          Date:{" "}
          <span className="text-white">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </p>
        <p className="text-gray-400">
          Status:{" "}
          <span className="text-[#d4af37]">{order.status}</span>
        </p>
      </div>

      {/* ITEMS */}
      <div className="space-y-6">
        {order.items.map((item) => (
          <div
            key={item.productId}
            className="flex gap-6 bg-black border border-white/10
            rounded-2xl p-6"
          >
            <div className="relative w-28 h-28 rounded-xl overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-white font-semibold">
                {item.name}
              </h3>
              <p className="text-gray-400 text-sm capitalize">
                Color: {item.color}
              </p>
              <p className="text-gray-400 text-sm">
                Quantity: {item.quantity}
              </p>
              <p className="text-[#d4af37] font-semibold mt-2">
                ${item.price * item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="mt-10 text-right">
        <p className="text-xl font-bold text-white">
          Total:{" "}
          <span className="text-[#d4af37]">
            ${order.totalAmount}
          </span>
        </p>
      </div>
    </section>
  );
}
