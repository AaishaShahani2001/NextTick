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
//import { ProductType } from "@/src/types/product";
import { useAuth } from "@/src/context/AuthContext";
import toast from "react-hot-toast";


/* ---------------- NAV LINKS ---------------- */
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Watches", href: "/watches" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" }
];

type NavbarProps = {
  products: {
    _id: string;
    name: string;
    collection: string;
  }[];
};



export default function Navbar({ products = [] }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  const searchRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);

  const { isLoggedIn, logout } = useAuth();

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  /* ---------------- SEARCH LOGIC ---------------- */
  const filteredProducts =
    query.trim().length === 0
      ? []
      : products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q)
        );
      });


  useEffect(() => {
    setMounted(true);
  }, []);

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
    logout();
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
          {/* SEARCH ICON */}
          <Search
            onClick={() => setShowSearch(true)}
            className="hover:text-[#d4af37] cursor-pointer transition"
          />

          {/* SEARCH INPUT + RESULTS */}
          {showSearch && (
            <div
              ref={searchRef}
              className="absolute right-0 top-full mt-4 w-80 bg-black
      border border-white/10 rounded-xl p-4 z-50"
            >
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search watches or collections..."
                className="w-full px-4 py-2 rounded-lg bg-black
        border border-white/20 text-sm text-white
        placeholder-gray-400 focus:outline-none
        focus:border-[#d4af37]"
              />

              {/* RESULTS */}
              {filteredProducts.length > 0 && (
                <ul className="mt-3 max-h-60 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <li key={product._id}>
                      <Link
                        href={`/watches/${product._id}`}
                        onClick={() => {
                          setShowSearch(false);
                          setQuery("");
                        }}
                        className="block px-3 py-2 text-sm text-gray-300
                hover:bg-white/5 rounded-lg"
                      >
                        {product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {/* EMPTY STATE */}
              {query.length > 0 && filteredProducts.length === 0 && (
                <p className="mt-3 text-sm text-gray-400">
                  No results found
                </p>
              )}
            </div>
          )}

          {isLoggedIn && (
            <Link href="/cart" className="relative">
              <ShoppingCart className="hover:text-[#d4af37] transition cursor-pointer" />

              {mounted && cart.length > 0 && (
                <span
                  className="absolute -top-2 -right-2 bg-[#d4af37] text-black
        text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </span>
              )}
            </Link>
          )}




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
