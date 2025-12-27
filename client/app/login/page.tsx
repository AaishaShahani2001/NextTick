"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    // TEMP login logic (later backend)
    console.log("LOGIN DATA:", form);
    alert("Login successful (demo)");

    // later: router.push("/")
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-black border border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Login
        </h1>

        <div className="space-y-5">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-black border border-white/10
            text-white placeholder-gray-500 focus:outline-none
            focus:border-[#d4af37]"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-black border border-white/10
            text-white placeholder-gray-500 focus:outline-none
            focus:border-[#d4af37]"
          />

          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-full bg-[#d4af37]
            text-black font-semibold hover:opacity-90 transition"
          >
            Login
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-400 text-center">
          Don’t have an account?{" "}
          <Link href="/register" className="text-[#d4af37]">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}
