"use client";

import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function AdminTopbar() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="h-16 border-b border-white/10 px-8
      flex items-center justify-between bg-black">
      <h1 className="text-lg font-semibold">
        Admin Dashboard
      </h1>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-400 hover:text-red-500"
      >
        <User size={18} />
        <LogOut size={18} />
      </button>
    </header>
  );
}
