export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center"
      style={{
        backgroundImage: "url('/images/watch-banner.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Timeless <span className="text-[#d4af37]">Elegance</span><br />
            on Your Wrist
          </h1>

          <p className="mt-6 text-gray-300 text-lg max-w-xl">
            Discover precision-crafted watches designed for those
            who value every second.
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href="/watches"
              className="px-8 py-3 rounded-full bg-[#d4af37]
              text-black font-semibold hover:scale-105 transition"
            >
              Explore Watches
            </a>

            <a
              href="/collections"
              className="px-8 py-3 rounded-full border
              border-[#d4af37] text-[#d4af37]
              hover:bg-[#d4af37] hover:text-black transition"
            >
              View Collections
            </a>
          </div>
        </div>

        {/* RIGHT SIDE (optional empty for balance) */}
        <div className="hidden md:block"></div>
      </div>
    </section>
  );
}
