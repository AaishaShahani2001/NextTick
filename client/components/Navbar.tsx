"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Search, Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

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
          {["Home", "Watches", "Collections", "About"].map((item) => (
            <li key={item}>
              <Link
                href={`/${item.toLowerCase()}`}
                className="relative group"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5
                  bg-[#d4af37] transition-all group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT ICONS */}
        <div className="hidden md:flex items-center gap-5 text-gray-300">
          <Search className="hover:text-[#d4af37] cursor-pointer transition" />
          <ShoppingCart className="hover:text-[#d4af37] cursor-pointer transition" />
          <Link
            href="/login"
            className="px-4 py-2 rounded-full border border-[#d4af37]
            text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition"
          >
            Login
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-black/90 backdrop-blur-xl px-6 py-6 space-y-4">
          {["Home", "Watches", "Collections", "About"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="block text-gray-300 hover:text-[#d4af37]"
            >
              {item}
            </Link>
          ))}

          <div className="flex gap-4 pt-4">
            <Search />
            <ShoppingCart />
          </div>

          <Link
            href="/login"
            className="block mt-4 text-center py-2 rounded-full
            bg-[#d4af37] text-black font-semibold"
          >
            Login
          </Link>
        </div>
      )}
    </header>
  );
}
