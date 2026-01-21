"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Eye } from "lucide-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ---------------- TYPES ---------------- */
type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

type Order = {
  _id: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  cancelledBy: string;
  discount?: number;
  user: {
    name: string;
    email: string;
  };
};

const STATUS_OPTIONS: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled"
];

const statusColors = {
  Pending: "bg-gray-200 text-gray-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};


const getAllowedNextStatuses = (status: OrderStatus) => {
  if (status === "Pending") return ["Processing", "Cancelled"];
  if (status === "Processing") return ["Shipped", "Cancelled"];
  if (status === "Shipped") return ["Delivered", "Cancelled"];
  return [];
};

type OrderFilter = OrderStatus | "all" | "discounted";



const ITEMS_PER_PAGE = 6;

/* ---------------- PAGE ---------------- */
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  /* filters */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderFilter>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);

  /* ---------------- COURIER MODAL ---------------- */
  const [showCourierModal, setShowCourierModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [courierName, setCourierName] = useState("");
  const [trackingId, setTrackingId] = useState("");


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
          o._id === orderId
            ? {
              ...o,
              status,
              cancelledBy: status === "Cancelled" ? "admin" : o.cancelledBy
            }
            : o
        )
      );

    } catch (err: any) {
      toast.error(err.message || "Status update failed");
    }
  };

  /* ---------------- ASSIGN COURIER ---------------- */
  const openCourierModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCourierName("");
    setTrackingId("");
    setShowCourierModal(true);
  };

  const assignCourierAndShip = async () => {
    if (!courierName || !trackingId || !selectedOrderId) {
      toast.error("Courier name & tracking ID required");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      //Assign courier
      const courierRes = await fetch(
        `http://localhost:3000/api/admin/orders/${selectedOrderId}/courier`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: courierName,
            trackingId
          })
        }
      );

      if (!courierRes.ok) {
        const text = await courierRes.text();
        throw new Error(text || "Courier assign failed");
      }

      const courierData = await courierRes.json();
      if (!courierRes.ok) throw new Error(courierData.message);

      //  Update status to Shipped
      await updateStatus(selectedOrderId, "Shipped");

      toast.success("Courier assigned & order shipped");
      setShowCourierModal(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to ship order");
    }
  };


  /* ---------------- FILTER LOGIC ---------------- */
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        if (statusFilter === "all") return true;
        if (statusFilter === "discounted")
          return typeof o.discount === "number" && o.discount > 0;
        return o.status === statusFilter;
      })
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

  /* ---------------- REPORT GENERATION ---------------- */
  const generateReportPDF = () => {
    const doc = new jsPDF();

    /* ---------- HEADER ---------- */
    doc.setFontSize(18);
    doc.text("Orders Summary Report", 14, 18);

    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      14,
      26
    );

    doc.text(
      `Status Filter: ${statusFilter}`,
      14,
      32
    );

    if (dateFilter) {
      doc.text(`Date Filter: ${dateFilter}`, 14, 38);
    }

    /* ---------- STATS ---------- */
    const totalRevenue = filteredOrders.reduce(
      (sum, o) => sum + o.totalAmount,
      0
    );

    doc.setTextColor(0);
    doc.text(`Total Orders: ${filteredOrders.length}`, 150, 26);
    doc.text(`Total Revenue: LKR ${totalRevenue.toFixed(2)}`, 150, 32);

    /* ---------- TABLE ---------- */
    autoTable(doc, {
      startY: 45,
      head: [[
        "Order ID",
        "Customer",
        "Date",
        "Status",
        "Total",
        "Discount"
      ]],
      body: filteredOrders.map((o) => [
        o._id,
        o.user?.name,
        new Date(o.createdAt).toLocaleDateString(),
        o.status,
        `LKR ${o.totalAmount}`,
        o.discount && o.discount > 0 ? `LKR ${o.discount}` : "-"
      ]),
      styles: {
        fontSize: 9
      },
      headStyles: {
        fillColor: [212, 175, 55] // gold theme
      }
    });

    /* ---------- FOOTER ---------- */
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        "Generated by ChronoLux Admin System",
        14,
        doc.internal.pageSize.height - 10
      );
    }

    doc.save("orders-summary-report.pdf");
  };


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
      <div className="mb-8 bg-black border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Orders Management
            </h1>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">

            <p className="text-sm text-gray-400">
              Revenue:{" "}
              <span className="text-[#d4af37] font-semibold">
                LKR{" "}
                {filteredOrders.reduce(
                  (sum, o) => sum + o.totalAmount,
                  0
                ).toFixed(2)}
              </span>
            </p>

            <button
              onClick={generateReportPDF}
              className="mt-2 px-6 py-2 rounded-full
        bg-[#d4af37] text-black text-sm font-semibold
        hover:opacity-90 transition"
            >
              📄 Download Report PDF
            </button>
          </div>
        </div>
      </div>


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
          <option value="discounted">Discounted Orders</option>
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

                <td className="p-4">
                  <p className="text-[#d4af37] font-semibold">
                    ${o.totalAmount}
                  </p>

                  {typeof o.discount === "number" && o.discount > 0 && (
                    <p className="text-xs text-green-400 mt-1">
                      Discount: LKR {o.discount}
                    </p>
                  )}
                </td>


                <td className="p-4">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    {/* STATUS */}
                    {o.status === "Cancelled" ? (
                      <span className="text-red-400 text-sm">
                        {o.cancelledBy === "admin"
                          ? "Cancelled by admin"
                          : "Cancelled by customer"}
                      </span>
                    ) : (
                      <select
                        value={o.status}
                        onChange={(e) => {
                          const nextStatus = e.target.value as OrderStatus;

                          if (nextStatus === "Shipped") {
                            openCourierModal(o._id);
                          } else {
                            updateStatus(o._id, nextStatus);
                          }
                        }}

                        className="bg-black border border-white/20
        text-white text-sm rounded-lg px-3 py-1"
                      >
                        <option value={o.status}>{o.status}</option>

                        {getAllowedNextStatuses(o.status).map((s) => (
                          <option key={s} value={s}>
                            {s === "Cancelled" ? "Cancel Order" : `Move to ${s}`}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* DISCOUNT BADGE */}
                    {typeof o.discount === "number" && o.discount > 0 && (
                      <span
                        className="
          px-3 py-1 rounded-full text-xs font-medium
          bg-green-500/10 text-green-400
          border border-green-500/20
        "
                      >
                        🎉 Discount Applied
                      </span>
                    )}
                  </div>
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


      {showCourierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">
              Assign Courier
            </h2>

            <div className="space-y-4">
              <input
                placeholder="Courier name (e.g. DHL, FedEx)"
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-black
          border border-white/20 text-white text-sm"
              />

              <input
                placeholder="Tracking ID / AWB Number"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-black
          border border-white/20 text-white text-sm"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCourierModal(false)}
                className="px-4 py-2 rounded-lg text-sm text-gray-400
          hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={assignCourierAndShip}
                className="px-5 py-2 rounded-lg text-sm font-semibold
          bg-[#d4af37] text-black hover:opacity-90"
              >
                Assign & Ship
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
