"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, XCircle, X } from "lucide-react";
import toast from "react-hot-toast";



/* ---------------- TYPES ---------------- */
type OrderStatus = "Awaiting Payment" | "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

type PaymentMethod = "COD" | "ONLINE";
type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded";

type Order = {
  _id: string;
  createdAt: string;
  totalAmount: number;
  status: OrderStatus;
  cancelledBy: string;
  discount?: number;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  courier?: {
    name: string;
    trackingId: string;
    shippedAt?: string;
  };
};

// const statusColors = {
//   Pending: "bg-gray-200 text-gray-700",
//   Processing: "bg-yellow-100 text-yellow-700",
//   Shipped: "bg-blue-500/10 text-blue-400",
//   Delivered: "bg-green-500/10 text-green-400",
//   Cancelled: "bg-red-100 text-red-700",
// };

const courierTrackingUrls: Record<string, (id: string) => string> = {
  DHL: (id) =>
    `https://www.dhl.com/global-en/home/tracking.html?tracking-id=${id}`,
  FedEx: (id) =>
    `https://www.fedex.com/fedextrack/?tracknumbers=${id}`,
  UPS: (id) =>
    `https://www.ups.com/track?tracknum=${id}`,
  Aramex: (id) =>
    `https://www.aramex.com/track/results?ShipmentNumber=${id}`,
  "Sri Lanka Post": (id) =>
    `https://www.slpost.gov.lk/track/?id=${id}`
};



/* ---------------- ORDER TIMELINE ---------------- */
const OrderTimeline = ({ status }: { status: OrderStatus }) => {
  const steps: OrderStatus[] = ["Awaiting Payment", "Pending", "Processing", "Shipped", "Delivered"];

  return (
    <div className="flex items-center gap-3 mt-4">
      {steps.map((step, idx) => {
        const active =
          status !== "Cancelled" &&
          steps.indexOf(status) >= idx;

        return (
          <div key={step} className="flex items-center gap-3">
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
        <span className="ml-3 text-sm text-red-400">
          Cancelled
        </span>
      )}
    </div>
  );
};

/* ---------------- CONFIRM MODAL ---------------- */
const ConfirmModal = ({
  open,
  onClose,
  onConfirm
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
      <div className="bg-black border border-white/10 rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">
            Cancel Order
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-400 hover:text-white" />
          </button>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed">
          Are you sure you want to cancel this order?
          <br />
          <span className="text-red-400">
            This action cannot be undone.
          </span>
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-white/20
            text-gray-300 hover:border-white/40 transition"
          >
            No, Keep
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-full bg-red-500
            text-white hover:bg-red-600 transition"
          >
            Yes, Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- PAGE ---------------- */
export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  /* ---------------- FETCH ORDERS ---------------- */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Session expired. Please login again.");
          window.location.href = "/login";
          return;
        }

        const res = await fetch("http://localhost:5000/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);


        setOrders(
          data.filter(
            (order: Order) =>
              order.status !== "Cancelled" ||
              order.cancelledBy === "admin"
          )
        );

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* ---------------- ACTION HANDLERS ---------------- */
  const handleRestrictedAction = (order?: Order) => {
    if (order?.paymentMethod === "ONLINE") {
      toast("Online payment orders cannot be cancelled by customers.", {
        icon: "🔒"
      });
      return;
    }

    toast(
      "This order can no longer be modified. Please contact the store or support.",
      { icon: "📞" }
    );
  };


  const handleEditOrder = () => {
    toast(
      "Order is pending. Please contact the store to edit order details.",
      { icon: "✏️" }
    );
  };

  /* ---------------- COURIER AND TRACKING ---------------- */
  const handleTrackPackage = (order: Order) => {
    if (!order.courier) {
      toast.error("Tracking information not available yet");
      return;
    }

    const { name, trackingId } = order.courier;

    const tracker = courierTrackingUrls[name];
    if (!tracker) {
      toast("Courier tracking page not available", { icon: "📦" });
      return;
    }

    window.open(tracker(trackingId), "_blank");
  };


  const confirmCancel = (orderId: string) => {
    setSelectedOrder(orderId);
    setShowModal(true);
  };

  // Auto-remove ONLY if cancelled by customer
  const cancelOrder = async () => {
    if (!selectedOrder) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/orders/${selectedOrder}/cancel`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Order cancelled successfully");

      // Mark as cancelled first (optional visual feedback)
      setOrders((prev) =>
        prev.map((o) =>
          o._id === selectedOrder ? { ...o, status: "Cancelled" } : o
        )
      );

      // Mark as cancelled by customer
      setOrders((prev) =>
        prev.map((o) =>
          o._id === selectedOrder
            ? { ...o, status: "Cancelled", cancelledBy: "customer" }
            : o
        )
      );

      // Remove ONLY customer-cancelled orders
      setTimeout(() => {
        setOrders((prev) =>
          prev.filter(
            (o) =>
              !(
                o._id === selectedOrder &&
                o.cancelledBy === "customer"
              )
          )
        );
      }, 8000);


    } catch (err: any) {
      toast.error(err.message || "Failed to cancel order");
    } finally {
      setShowModal(false);
      setSelectedOrder(null);
    }
  };

  /* ---------------- UI STATES ---------------- */
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
        <div className="space-y-8">
          {orders.map((order) => {
            const isEditable = order.status === "Pending" &&
              order.cancelledBy !== "admin" &&
              order.paymentMethod !== "ONLINE";

            return (
              <div
                key={order._id}
                className="bg-black border border-white/10
                rounded-2xl p-6 hover:border-[#d4af37]/40 transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div>
                    <p className="text-sm text-gray-400">Order ID</p>
                    <p className="text-white font-medium break-all">
                      {order._id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Date</p>
                    <p className="text-white">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Total</p>
                    <p className="text-[#d4af37] font-semibold">
                      LKR {order.totalAmount}
                    </p>

                    {typeof order.discount === "number" &&
                      order.discount > 0 &&
                      !(order.status === "Cancelled" &&
                        order.cancelledBy === "admin" &&
                        order.paymentMethod === "ONLINE") && (
                        <p className="text-xs text-green-400 mt-1">
                          You saved LKR {order.discount.toLocaleString()}
                        </p>
                      )}

                  </div>

                  <div className="flex items-center gap-2 whitespace-nowrap">
                    {/* STATUS BADGE */}
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium
  ${order.status === "Pending"
                          ? "bg-gray-500/10 text-gray-400"
                          : order.status === "Processing"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : order.status === "Shipped"
                              ? "bg-blue-500/10 text-blue-400"
                              : order.status === "Delivered"
                                ? "bg-green-500/10 text-green-400"
                                : "bg-red-500/10 text-red-400"
                        }`}
                    >
                      {order.status === "Cancelled"
                        ? order.cancelledBy === "admin"
                          ? "Cancelled by admin"
                          : "Cancelled by you"
                        : order.status}
                    </span>
                    {/* PAYMENT METHOD BADGE */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border
    ${order.paymentMethod === "ONLINE"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                        }`}
                    >
                      {order.paymentMethod === "ONLINE" ? "ONLINE" : "COD"}
                    </span>


                    {/* DISCOUNT BADGE */}
                    {typeof order.discount === "number" &&
                      order.discount > 0 &&
                      !(order.status === "Cancelled" &&
                        order.cancelledBy === "admin" &&
                        order.paymentMethod === "ONLINE") && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium
      bg-green-500/10 text-green-400 border border-green-500/20">
                          🎉 Discount Applied
                        </span>
                      )}

                  </div>


                  <div className="flex gap-3 justify-start md:justify-end">
                    <Link
                      href={`/orders/${order._id}`}
                      className="p-2 rounded-full border border-white/20
                      hover:border-[#d4af37] hover:text-[#d4af37] transition"
                    >
                      <Eye size={18} />
                    </Link>

                    <button
                      onClick={
                        isEditable
                          ? () => confirmCancel(order._id)
                          : () => handleRestrictedAction(order)
                      }
                      className={`p-2 rounded-full border
                      ${isEditable
                          ? "border-[#d4af37] text-[#d4af37]"
                          : "border-white/10 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={
                        isEditable
                          ? () => confirmCancel(order._id)
                          : () => handleRestrictedAction(order)
                      }
                      className={`p-2 rounded-full border
                      ${isEditable
                          ? "border-red-500 text-red-400"
                          : "border-white/10 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>


                {/* ===== SHIPPING / DELIVERY CARD (SEPARATE ROW) ===== */}
                {order.courier?.trackingId && (
                  <div
                    className={`mt-5 flex justify-end`}
                  >
                    <div
                      className={`w-full md:w-90 rounded-xl border p-4
                  ${order.status === "Delivered"
                          ? "border-green-500/20 bg-green-500/5"
                          : "border-white/10 bg-black/40"
                        }`}
                    >
                      <p className="text-sm text-gray-400">
                        Courier:{" "}
                        <span className="text-white font-medium">
                          {order.courier.name}
                        </span>
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Tracking ID:{" "}
                        <span className="text-[#d4af37] font-semibold">
                          {order.courier.trackingId}
                        </span>
                      </p>

                      {order.status === "Delivered" ? (
                        <p className="mt-2 text-sm text-green-400">
                          ✅ Package delivered successfully
                        </p>
                      ) : (
                        <button
                          onClick={() => handleTrackPackage(order)}
                          className="mt-3 w-full px-4 py-2 rounded-full text-sm font-semibold
                      bg-[#d4af37] text-black hover:opacity-90"
                        >
                          🚚 Track Package
                        </button>
                      )}
                    </div>
                  </div>
                )}



                <OrderTimeline status={order.status} />

                {order.status === "Cancelled" &&
                  order.cancelledBy === "admin" &&
                  order.paymentMethod === "ONLINE" && (
                    <p className="mt-2 text-sm text-blue-400">
                      ❌ Cancelled by admin · 💳 Payment refunded
                    </p>
                  )}



                {order.status === "Cancelled" &&
                  order.cancelledBy === "customer" && (
                    <p className="mt-2 text-xs text-red-400">
                      This order will be removed shortly.
                    </p>
                  )}

                {!isEditable && (
                  <p className="mt-3 text-sm text-gray-400">
                    {order.status === "Cancelled"
                      ? "This order has already been cancelled."
                      : "This order is no longer editable. Please contact the store or support team."}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={cancelOrder}
      />
    </section>
  );
}
