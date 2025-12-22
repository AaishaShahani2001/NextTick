import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-20 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 grid gap-10
        md:grid-cols-3 text-center md:text-left">

        {/* BRAND */}
        <div className="flex flex-col gap-4 items-center md:items-start">
          <Link href="/" className="text-2xl font-bold tracking-wide">
            <span className="text-white">Chrono</span>
            <span className="text-[#d4af37]">Lux</span>
          </Link>

          <p className="text-sm text-gray-400 max-w-xs">
            Timeless elegance crafted for those who value precision,
            luxury, and style.
          </p>

          <p className="text-xs text-gray-500">
            © 2025 ChronoLux. All rights reserved.
          </p>
        </div>

        {/* SHOP LINKS */}
        <div className="flex flex-col gap-3 items-center md:items-start">
          <p className="text-sm font-semibold text-[#d4af37] uppercase tracking-widest">
            Shop
          </p>

          {["All Products", "New Arrivals", "Best Sellers", "Sale"].map(
            (item) => (
              <Link
                key={item}
                href="/"
                className="text-sm text-gray-400 hover:text-[#d4af37]
                transition relative group"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-px
                  bg-[#d4af37] transition-all group-hover:w-full" />
              </Link>
            )
          )}
        </div>

        {/* COMPANY LINKS */}
        <div className="flex flex-col gap-3 items-center md:items-start">
          <p className="text-sm font-semibold text-[#d4af37] uppercase tracking-widest">
            Company
          </p>

          {["About", "Contact", "Terms of Service", "Privacy Policy"].map(
            (item) => (
              <Link
                key={item}
                href="/"
                className="text-sm text-gray-400 hover:text-[#d4af37]
                transition relative group"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-px
                  bg-[#d4af37] transition-all group-hover:w-full" />
              </Link>
            )
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
