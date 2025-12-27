"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // TEMP register logic (later backend)
    console.log("REGISTER DATA:", form);
    alert("Account created successfully (demo)");
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-black border border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Register
        </h1>

        <div className="space-y-5">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-black border border-white/10
            text-white placeholder-gray-500 focus:outline-none
            focus:border-[#d4af37]"
          />

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

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-black border border-white/10
            text-white placeholder-gray-500 focus:outline-none
            focus:border-[#d4af37]"
          />

          <button
            onClick={handleRegister}
            className="w-full py-3 rounded-full bg-[#d4af37]
            text-black font-semibold hover:opacity-90 transition"
          >
            Create Account
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-[#d4af37]">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
