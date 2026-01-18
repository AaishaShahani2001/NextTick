"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Eye } from "lucide-react";

/* ---------------- TYPES ---------------- */
type OrderStatus = "Pending" | "Processing" | "Delivered" | "Cancelled";

type Order = {
  _id: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
};

const STATUS_OPTIONS: OrderStatus[] = [
  "Pending",
  "Processing",
  "Delivered",
  "Cancelled"
];

const getAllowedNextStatuses = (status: OrderStatus) => {
  if (status === "Pending") return ["Processing"];
  if (status === "Processing") return ["Delivered"];
  return [];
};

const ITEMS_PER_PAGE = 6;

/* ---------------- PAGE ---------------- */
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  /* filters */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);

  /* ---------------- FETCH ORDERS ---------------- */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3000/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setOrders(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* ---------------- STATUS UPDATE ---------------- */
  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3000/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Order status updated");

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status } : o
        )
      );
    } catch (err: any) {
      toast.error(err.message || "Status update failed");
    }
  };

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) =>
        statusFilter === "all" ? true : o.status === statusFilter
      )
      .filter((o) =>
        dateFilter
          ? new Date(o.createdAt).toISOString().slice(0, 10) === dateFilter
          : true
      )
      .filter((o) => {
        const q = search.toLowerCase();
        return (
          o._id.toLowerCase().includes(q) ||
          o.user?.name.toLowerCase().includes(q) ||
          o.user?.email.toLowerCase().includes(q)
        );
      });
  }, [orders, search, statusFilter, dateFilter]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <p className="text-gray-400 text-center py-40">
        Loading orders...
      </p>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-8">
        Orders Management
      </h1>

      {/* FILTER BAR */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          placeholder="Search order / customer / email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl bg-black border border-white/10
          text-white text-sm focus:border-[#d4af37] outline-none"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as any)
          }
          className="px-4 py-2 rounded-xl bg-black border border-white/10
          text-white text-sm"
        >
          <option value="all">All Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-black border border-white/10
          text-white text-sm"
        />

        <div className="text-sm text-gray-400 flex items-center">
          {filteredOrders.length} orders found
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-black border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full hidden md:table">
          <thead className="bg-white/5 text-gray-400 text-sm">
            <tr>
              <th className="p-4 text-left">Order</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map((o) => (
              <tr
                key={o._id}
                className="border-t border-white/10 hover:bg-white/5"
              >
                <td className="p-4 text-gray-300 text-sm">
                  {o._id}
                </td>

                <td className="p-4">
                  <p className="text-white">{o.user?.name}</p>
                  <p className="text-xs text-gray-400">
                    {o.user?.email}
                  </p>
                </td>

                <td className="p-4 text-gray-300 text-sm">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4 text-[#d4af37] font-semibold">
                  ${o.totalAmount}
                </td>

                <td className="p-4">
                  {o.status === "Cancelled" ? (
                    <span className="text-red-400 text-sm">
                      Cancelled by customer
                    </span>
                  ) : (
                    <select
                      value={o.status}
                      onChange={(e) =>
                        updateStatus(
                          o._id,
                          e.target.value as OrderStatus
                        )
                      }
                      className="bg-black border border-white/20
      text-white text-sm rounded-lg px-3 py-1"
                    >
                      <option value={o.status}>{o.status}</option>

                      {getAllowedNextStatuses(o.status).map((s) => (
                        <option key={s} value={s}>
                          Move to {s}
                        </option>
                      ))}
                    </select>
                  )}
                </td>


                <td className="p-4 text-center">
                  <Link
                    href={`/admin/orders/${o._id}`}
                    className="inline-flex p-2 rounded-full border border-white/20
                    hover:border-[#d4af37] hover:text-[#d4af37]"
                  >
                    <Eye size={18} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-white/10">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="text-sm text-gray-400 disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-gray-400">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="text-sm text-gray-400 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
