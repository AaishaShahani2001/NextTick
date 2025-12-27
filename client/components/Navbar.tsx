"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  User,
  LogOut,
  Package
} from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import { ProductType } from "@/src/types/product";
import { useAuth } from "@/src/context/AuthContext";

/* ---------------- TEMP PRODUCTS (SEARCH SOURCE) ---------------- */
const products: ProductType[] = [
  {
    id: 1,
    name: "ChronoLux Steel Royale",
    shortDescription: "",
    price: 399,
    category: "Luxury",
    collection: "Classic Collection",
    colors: ["silver", "black"],
    images: { silver: "", black: "" }
  },
  {
    id: 2,
    name: "ChronoLux Midnight Leather",
    shortDescription: "",
    price: 279,
    category: "Classic",
    collection: "Heritage Collection",
    colors: ["black", "brown"],
    images: { black: "", brown: "" }
  },
  {
    id: 3,
    name: "ChronoLux Sport Pro X",
    shortDescription: "",
    price: 349,
    category: "Sport",
    collection: "Sport Collection",
    colors: ["black", "blue", "green"],
    images: { black: "", blue: "", green: "" }
  }
];

/* ---------------- NAV LINKS ---------------- */
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Watches", href: "/watches" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  const searchRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const { cart } = useCart();
  const { isLoggedIn, logout } = useAuth(); // ✅ FIXED

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  /* ---------------- SEARCH LOGIC ---------------- */
  const filteredProducts =
    query.length === 0
      ? []
      : products.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.collection.toLowerCase().includes(query.toLowerCase())
        );

  /* ---------------- CLICK OUTSIDE ---------------- */
  useEffect(() => {
    if (showSearch) {
      searchInputRef.current?.focus();
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setShowSearch(false);
        setQuery("");
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearch]);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    logout();              // ✅ FIXED
    setShowProfile(false);
  };

  return (
    <header className="fixed top-0 w-full z-50">
      <nav className="mx-auto flex items-center justify-between px-6 md:px-12 py-4
        bg-black/60 backdrop-blur-xl border-b border-white/10">

        {/* LOGO */}
        <Link href="/" className="text-2xl font-bold tracking-wide">
          <span className="text-white">Chrono</span>
          <span className="text-[#d4af37]">Lux</span>
        </Link>

        {/* DESKTOP LINKS */}
        <ul className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          {navLinks.map((item) => (
            <li key={item.label}>
              <Link href={item.href} className="relative group">
                {item.label}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5
                  bg-[#d4af37] transition-all group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT ICONS */}
        <div className="hidden md:flex items-center gap-5 text-gray-300 relative">
          <Search
            onClick={() => setShowSearch((prev) => !prev)}
            className="hover:text-[#d4af37] cursor-pointer transition"
          />

          <Link href="/cart" className="relative">
            <ShoppingCart className="hover:text-[#d4af37] cursor-pointer transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#d4af37] text-black
                text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* AUTH SECTION */}
          {isLoggedIn ? (
            <div ref={profileRef} className="relative">
              <User
                onClick={() => setShowProfile(!showProfile)}
                className="hover:text-[#d4af37] cursor-pointer transition"
              />

              {showProfile && (
                <div className="absolute right-0 mt-3 w-48 bg-black
                  border border-white/10 rounded-xl overflow-hidden">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3
                    text-sm text-gray-300 hover:bg-white/5">
                    <User size={16} /> Profile
                  </Link>

                  <Link
                    href="/my-orders"
                    className="flex items-center gap-3 px-4 py-3
                    text-sm text-gray-300 hover:bg-white/5">
                    <Package size={16} /> My Orders
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3
                    text-sm text-red-400 hover:bg-white/5">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-full border border-[#d4af37]
              text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition">
              Login
            </Link>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-white">
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>
    </header>
  );
}
