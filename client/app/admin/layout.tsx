"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import AdminGuard from "@/components/AdminGuard";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <AdminGuard>
      <div className="min-h-screen flex bg-black text-white">
        {/* SIDEBAR */}
        <aside className="w-64 border-r border-white/10 p-6">
          <h2 className="text-xl font-bold mb-10">
            <span className="text-white">ChronoLux</span>{" "}
            <span className="text-[#d4af37]">Admin</span>
          </h2>

          <nav className="space-y-4">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5"
            >
              <Package size={18} />
              Products
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5"
            >
              <ShoppingBag size={18} />
              Orders
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-white/5 w-full"
            >
              <LogOut size={18} />
              Logout
            </button>
          </nav>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 p-10">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
