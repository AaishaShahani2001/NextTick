"use client";

import { User } from "lucide-react";

export default function ProfilePage() {
  // TEMP USER DATA (replace with auth context later)
  const user = {
    name: "ChronoLux Customer",
    email: "customer@chronolux.com",
    phone: "+94 77 123 4567"
  };

  return (
    <section className="max-w-5xl mx-auto px-6 md:px-12 py-20">
      <h1 className="text-4xl font-bold text-white mb-12">
        My Profile
      </h1>

      <div className="bg-black border border-white/10 rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-[#d4af37] flex items-center justify-center">
            <User className="text-black" size={28} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              {user.name}
            </h2>
            <p className="text-gray-400 text-sm">
              {user.email}
            </p>
          </div>
        </div>

        <div className="space-y-4 text-gray-300">
          <p>
            <span className="text-gray-400">Email:</span>{" "}
            {user.email}
          </p>

          <p>
            <span className="text-gray-400">Phone:</span>{" "}
            {user.phone}
          </p>
        </div>

        <button
          className="mt-8 px-6 py-3 rounded-full border border-[#d4af37]
          text-[#d4af37] hover:bg-[#d4af37]
          hover:text-black transition"
        >
          Edit Profile (Coming Soon)
        </button>
      </div>
    </section>
  );
}
