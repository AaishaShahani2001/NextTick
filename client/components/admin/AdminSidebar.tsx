"use client";

import Link from "next/link";
import { LayoutDashboard, Watch, Package } from "lucide-react";

const links = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Watch
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: Package
  }
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-black border-r border-white/10 p-6 hidden md:block">
      <h2 className="text-2xl font-bold mb-10">
        <span className="text-white">Chrono</span>
        <span className="text-[#d4af37]">Lux</span>
        <span className="text-sm ml-2 text-gray-400">Admin</span>
      </h2>

      <nav className="space-y-3">
        {links.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl
            text-gray-300 hover:bg-white/5 hover:text-[#d4af37] transition"
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
