"use client";

import Link from "next/link";

export default function MyOrdersPage() {
  // TEMP ORDERS (replace with backend later)
  const orders = [
    {
      id: "ORD-1021",
      date: "2025-01-18",
      total: 678,
      status: "Delivered"
    },
    {
      id: "ORD-1022",
      date: "2025-02-03",
      total: 349,
      status: "Processing"
    }
  ];

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
            <div
              key={order.id}
              className="bg-black border border-white/10
              rounded-2xl p-6 flex flex-col md:flex-row
              md:items-center md:justify-between gap-4"
            >
              <div>
                <p className="text-sm text-gray-400">
                  Order ID
                </p>
                <p className="text-white font-medium">
                  {order.id}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  Date
                </p>
                <p className="text-white">
                  {order.date}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  Total
                </p>
                <p className="text-[#d4af37] font-semibold">
                  ${order.total}
                </p>
              </div>

              <div>
                <p
                  className={`px-4 py-2 rounded-full text-sm font-medium
                  ${
                    order.status === "Delivered"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {order.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
