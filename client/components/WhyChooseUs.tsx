"use client";

import {
  Globe,
  CreditCard,
  ShieldCheck,
  Award,
  Star,
  Headphones
} from "lucide-react";

const FEATURES = [
  {
    title: "Global Shipping",
    desc: "Worldwide insured delivery with real-time tracking.",
    icon: Globe
  },
  {
    title: "Flexible Payment",
    desc: "Multiple secure payment options for your convenience.",
    icon: CreditCard
  },
  {
    title: "Authentic Collection",
    desc: "100% genuine luxury watches sourced from trusted brands.",
    icon: ShieldCheck
  },
  {
    title: "Expert Curation",
    desc: "Handpicked timepieces curated by horology experts.",
    icon: Award
  },
  {
    title: "Warranty & Support",
    desc: "Official warranties with dedicated after-sales support.",
    icon: Headphones
  },
  {
    title: "Trusted Excellence",
    desc: "Loved by thousands of collectors worldwide.",
    icon: Star
  }
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-28 bg-black">
      {/* SUBTLE GOLD GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-150 h-150 bg-[#d4af37]/10 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs tracking-[0.35em] text-[#d4af37] uppercase">
            Why Choose Us
          </p>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">
            Crafted for Those Who Value Time
          </h2>
          <p className="mt-5 text-gray-400 leading-relaxed">
            At ChronoLux, every detail reflects precision, trust, and timeless
            luxury — from sourcing to delivery.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="
                  group relative p-8 rounded-3xl
                  bg-white/5 backdrop-blur-xl
                  border border-white/10
                  hover:border-[#d4af37]/40
                  hover:shadow-[0_0_50px_rgba(212,175,55,0.15)]
                  transition-all duration-500
                "
              >
                {/* ICON */}
                <div
                  className="
                    w-14 h-14 flex items-center justify-center
                    rounded-2xl mb-6
                    bg-[#d4af37]/10 text-[#d4af37]
                    group-hover:bg-[#d4af37]
                    group-hover:text-black
                    transition
                  "
                >
                  <Icon size={26} />
                </div>

                {/* TEXT */}
                <h3 className="text-lg font-semibold text-white">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                  {f.desc}
                </p>

                {/* HOVER LINE */}
                <span
                  className="
                    absolute bottom-0 left-1/2 -translate-x-1/2
                    w-0 h-0.5 bg-[#d4af37]
                    group-hover:w-16 transition-all duration-500
                  "
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
