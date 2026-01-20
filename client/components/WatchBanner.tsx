"use client";

import Link from "next/link";

export default function WatchBanner() {
  return (
    <section className="relative py-28">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/banner.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      {/* GOLD GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-[#d4af37]/15 blur-[140px]" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 text-center">
        <p className="text-xs tracking-[0.35em] uppercase text-[#d4af37]">
          Timeless Luxury
        </p>

        <h2 className="mt-6 text-3xl md:text-5xl font-bold text-white leading-tight">
          Ready to Own Your <br />
          <span className="text-[#d4af37]">Dream Watch?</span>
        </h2>

        <p className="mt-6 text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Discover expertly curated luxury timepieces crafted for precision,
          prestige, and lasting value. Every second deserves excellence.
        </p>

        {/* CTA BUTTONS */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/watches"
            className="
              px-10 py-4 rounded-full
              bg-[#d4af37] text-black
              font-semibold tracking-wide
              hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]
              transition
            "
          >
            Start Shopping
          </Link>

          <Link
            href="/register"
            className="
              px-10 py-4 rounded-full
              border border-[#d4af37]
              text-[#d4af37]
              font-semibold tracking-wide
              hover:bg-[#d4af37]
              hover:text-black
              transition
            "
          >
            Create Account
          </Link>
        </div>

        {/* TRUST LINE */}
        <p className="mt-8 text-xs text-gray-400 tracking-wide">
          Authentic watches · Secure payments · Worldwide delivery
        </p>
      </div>
    </section>
  );
}
