"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/admin/StatCard";
import {
  ShoppingCart,
  DollarSign,
  Package,
  Users,
  Eye
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

type RecentOrder = {
  _id: string;
  totalAmount: number;
  status: string;
  user: { name: string };
};

type DashboardStats = {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  recentOrders: RecentOrder[];
};

type LowStockProduct = {
  _id: string;
  name: string;
  stock: number;
  price: number;
};


export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);


  // FETCH STATS IN DASHBOARD
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:3000/api/admin/orders/stats/overview",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setStats(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load dashboard");
      }
    };

    fetchStats();
  }, []);

  // LOW STOCK ALERT
  useEffect(() => {
  const fetchLowStock = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:3000/api/admin/products/low-stock",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setLowStock(data);
    } catch (err) {
      console.error("Low stock fetch failed");
    }
  };

  fetchLowStock();
}, []);


  if (!stats) {
    return (
      <p className="text-gray-400 text-center py-40">
        Loading dashboard...
      </p>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-8">
        Dashboard Overview
      </h1>

      {/* TOP METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign size={22} />}
        />
        <StatCard
          title="Orders"
          value={stats.totalOrders}
          icon={<ShoppingCart size={22} />}
        />
        <StatCard
          title="Products"
          value={stats.totalProducts}
          icon={<Package size={22} />}
        />
        <StatCard
          title="Customers"
          value={stats.totalCustomers}
          icon={<Users size={22} />}
        />
      </div>

      {/* ORDER STATUS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <StatCard
          title="Pending"
          value={stats.pendingOrders}
          icon={<ShoppingCart size={20} />}
        />
        <StatCard
          title="Processing"
          value={stats.processingOrders}
          icon={<ShoppingCart size={20} />}
        />
        <StatCard
          title="Delivered"
          value={stats.deliveredOrders}
          icon={<ShoppingCart size={20} />}
        />
      </div>

      {/* RECENT ORDERS */}
      <div className="mt-10 bg-black border border-white/10 rounded-xl p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-white">
            Recent Orders
          </h2>

          <Link
            href="/admin/orders"
            className="text-sm text-[#d4af37] hover:underline"
          >
            View All
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className="text-sm text-gray-400">
            No recent orders
          </p>
        ) : (
          <div className="space-y-3">
            {stats.recentOrders.map((o) => (
              <div
                key={o._id}
                className="flex justify-between items-center
                border border-white/10 rounded-lg p-4 hover:border-[#d4af37]/40"
              >
                <div>
                  <p className="text-sm text-white font-medium">
                    {o.user?.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {o.status}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-[#d4af37] font-semibold">
                    ${o.totalAmount}
                  </p>

                  <Link
                    href={`/admin/orders/${o._id}`}
                    className="p-2 rounded-full border border-white/20
                    hover:border-[#d4af37] hover:text-[#d4af37]"
                  >
                    <Eye size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

        {/* LOW STOCK */}
      {lowStock.length > 0 && (
  <div className="mt-10 bg-black border border-red-500/30
  rounded-xl p-6">
    <h2 className="text-lg font-semibold text-red-400 mb-4">
      ⚠️ Low Stock Alerts
    </h2>

    <div className="space-y-3">
      {lowStock.map((p) => (
        <div
          key={p._id}
          className="flex justify-between items-center
          border border-white/10 rounded-lg p-4
          hover:border-red-500/40 transition"
        >
          <div>
            <p className="text-white font-medium">
              {p.name}
            </p>
            <p className="text-xs text-gray-400">
              Only {p.stock} left in stock
            </p>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-[#d4af37] font-semibold">
              ${p.price}
            </p>

            <Link
              href={`/admin/products/${p._id}`}
              className="text-sm text-red-400 hover:underline"
            >
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

    </>
  );
}
