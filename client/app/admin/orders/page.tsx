"use client";

export default function AdminOrdersPage() {
  // TEMP orders
  const orders = [
    { id: "ORD001", customer: "Aaisha", total: 399, status: "Processing" },
    { id: "ORD002", customer: "Hishaam", total: 678, status: "Delivered" }
  ];

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      <div className="bg-black border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5 text-gray-400 text-sm">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-white/10">
                <td className="p-4">{o.id}</td>
                <td className="p-4">{o.customer}</td>
                <td className="p-4 text-[#d4af37]">${o.total}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm
                    ${
                      o.status === "Delivered"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
