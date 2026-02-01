"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Clock, Truck, CheckCircle, XCircle } from "lucide-react";


/* ---------------- TYPES ---------------- */
type OrderStatus = "Awaiting Payment" | "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

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
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
  };
  discount?: number;
  subtotal?: number;
  courier?: {
    name: string;
    trackingId?: string;
    shippedAt?: string;
  };

  statusHistory?: StatusHistoryItem[];
};

/* ---------------- TIMELINE ---------------- */
const OrderTimeline = ({ status }: { status: OrderStatus }) => {
  const steps: OrderStatus[] = ["Awaiting Payment", "Pending", "Processing", "Shipped", "Delivered"];

  return (
    <div className="flex items-center gap-4 mt-4">
      {steps.map((step, idx) => {
        const active =
          status !== "Cancelled" &&
          steps.indexOf(status) >= idx;

        return (
          <div key={step} className="flex items-center gap-4">
            <div
              className={`w-3 h-3 rounded-full ${active ? "bg-[#d4af37]" : "bg-white/20"
                }`}
            />
            {idx < steps.length - 1 && (
              <div
                className={`w-10 h-0.5 ${active ? "bg-[#d4af37]" : "bg-white/10"
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
  if (status === "Awaiting Payment") return ["Pending"];
  if (status === "Pending") return ["Processing"];
  if (status === "Processing") return ["Shipped"];
  if (status === "Shipped") return ["Delivered"];
  return [];
};

/* ---------------- PAGE ---------------- */
export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusComment, setStatusComment] = useState("");

  const isCourierAssigned =
    !!order?.courier?.name && !!order?.courier?.trackingId;


  /* ---------------- FETCH ORDER ---------------- */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:5000/api/admin/orders/${id}`,
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

  /*--------------- SAVE COURIER DETAILS -------------- */
  const saveCourierDetails = async () => {
    const token = localStorage.getItem("token");

    if (!order?.courier?.name || !order?.courier?.trackingId) {
      toast.error("Courier name and tracking ID are required");
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/admin/orders/${id}/courier`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: order.courier.name,
          trackingId: order.courier.trackingId
        })
      }
    );

    if (!res.ok) {
      toast.error("Failed to save courier details");
      return;
    }

    toast.success("Courier details updated");
    router.push("/admin/orders");
  };



  /* ---------------- UPDATE STATUS ---------------- */
  const updateStatus = async (newStatus: OrderStatus) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/admin/orders/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus, comment: statusComment })
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Order status updated");

      setOrder(data);
      setStatusComment("");
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
    <section className="max-w-6xl mx-auto px-2 py-5">
      <h1 className="text-3xl font-bold text-white mb-10">
        Order Details
      </h1>

      <div className="bg-black border border-white/10 rounded-3xl p-8 space-y-10">

        {/* ================= SUMMARY HEADER ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-gray-400 uppercase">Order ID</p>
            <p className="text-white break-all font-medium">{order._id}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase">Placed On</p>
            <p className="text-white">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase">Customer</p>
            <p className="text-white font-medium">{order.user.name}</p>
            <p className="text-xs text-gray-400">{order.user.email}</p>
          </div>

          <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-2xl p-4">
            <p className="text-xs text-[#d4af37] uppercase">Total Amount</p>
            <p className="text-2xl font-bold text-[#d4af37]">
              LKR {order.totalAmount}
            </p>

            {typeof order.discount === "number" && order.discount > 0 && (
              <p className="text-xs text-green-400 mt-1">
                Discount applied
              </p>
            )}
          </div>
        </div>

        {/* ================= SHIPPING DETAILS ================= */}
        <div className="border-t border-white/10 pt-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            Shipping Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="text-sm space-y-2">
              <p className="text-gray-400">Recipient</p>
              <p className="text-white font-medium">
                {order.shippingAddress.name}
              </p>

              <p className="text-gray-400 mt-4">Contact</p>
              <p className="text-white">{order.shippingAddress.email}</p>
              <p className="text-white">{order.shippingAddress.phone}</p>
            </div>

            <div className="text-sm space-y-2">
              <p className="text-gray-400">Delivery Address</p>
              <p className="text-white leading-relaxed">
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.province}<br />
                {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>

        {/* COURIER & TRACKING */}
        <div className="border-t border-white/10 pt-6 space-y-4">
          <h2 className="text-xl text-white">Courier & Tracking</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Courier Name (DHL, FedEx, etc.)"
              value={order.courier?.name || ""}
              disabled={isCourierAssigned}
              onChange={(e) =>
                setOrder(prev =>
                  prev
                    ? {
                      ...prev,
                      courier: {
                        name: e.target.value,
                        trackingId: prev.courier?.trackingId || "",
                        shippedAt: prev.courier?.shippedAt
                      }
                    }
                    : prev
                )
              }
              className={`px-4 py-3 rounded-xl bg-black border border-white/10 text-white
    ${isCourierAssigned ? "opacity-60 cursor-not-allowed" : ""}`}
            />



            <input
              placeholder="Tracking ID"
              value={order.courier?.trackingId || ""}
              disabled={isCourierAssigned}
              onChange={(e) =>
                setOrder(prev =>
                  prev
                    ? {
                      ...prev,
                      courier: {
                        name: prev.courier?.name || "",
                        trackingId: e.target.value,
                        shippedAt: prev.courier?.shippedAt
                      }
                    }
                    : prev
                )
              }
              className={`px-4 py-3 rounded-xl bg-black border border-white/10 text-white
    ${isCourierAssigned ? "opacity-60 cursor-not-allowed" : ""}`}
            />



          </div>

          <button
            onClick={saveCourierDetails}
            disabled={isCourierAssigned}
            className={`mt-4 px-6 py-3 rounded-full font-semibold transition
    ${isCourierAssigned
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-[#d4af37] text-black hover:opacity-90"
              }`}
          >
            {isCourierAssigned ? "Courier Already Assigned" : "Save Courier Details"}
          </button>
        </div>


        {/* ================= ORDER STATUS ================= */}
        <div className="border-t border-white/10 pt-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Order Progress
          </h2>

          <textarea
            placeholder="Admin note (visible to customer)"
            value={statusComment}
            onChange={(e) => setStatusComment(e.target.value)}
            className="mb-4 w-full bg-black border border-white/20
             text-white text-sm rounded-xl px-4 py-3 resize-none"
          />


          {order.status === "Cancelled" ? (
            <span className="inline-block px-4 py-2 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
              Cancelled (Read-only)
            </span>
          ) : (
            <select
              value={order.status}
              onChange={(e) =>
                updateStatus(e.target.value as OrderStatus)
              }
              className="bg-black border border-white/20 text-white rounded-xl px-4 py-2"
            >
              <option value={order.status}>{order.status}</option>
              {getAllowedNextStatuses(order.status).map((s) => (
                <option key={s} value={s}>
                  Move to {s}
                </option>
              ))}
            </select>
          )}

          <OrderTimeline status={order.status} />

          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Status History
            </h3>

            {order.statusHistory?.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="mt-1 w-3 h-3 rounded-full bg-[#d4af37]" />

                <div>
                  <p className="flex items-center gap-2 text-white font-medium">
                    {step.status === "Awaiting Payment" && <Clock size={14} />}
                    {step.status === "Processing" && <Clock size={14} />}
                    {step.status === "Shipped" && <Truck size={14} />}
                    {step.status === "Delivered" && <CheckCircle size={14} />}
                    {step.status === "Cancelled" && <XCircle size={14} />}
                    {step.status}
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(step.at).toLocaleString()}
                  </p>

                  {step.comment && (
                    <p className="mt-1 text-sm text-gray-300 italic">
                      “{step.comment}”
                    </p>
                  )}
                </div>
              </div>
            ))}

            {!order.statusHistory?.length && (
              <p className="text-sm text-gray-500">
                No status history available.
              </p>
            )}
          </div>

        </div>

        {/* ================= ITEMS ================= */}
        <div className="border-t border-white/10 pt-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            Ordered Items
          </h2>

          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <span className="text-white">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-[#d4af37] font-medium">
                  LKR {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= FOOTER NOTE ================= */}
        <div className="border-t border-white/10 pt-6 text-xs text-gray-400">
          Cancelled orders are immutable audit records.
          Status transitions are strictly forward-only to preserve order integrity.
        </div>
      </div>
    </section>
  );

}
