"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError("");

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      //  Save JWT token
      localStorage.setItem("token", data.token);

      // Optional: save user info
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data._id,
          name: data.name,
          email: data.email
        })
      );

      //  Redirect to home (or profile)
      router.push("/");
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex items-center justify-center px-6 py-32">
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

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-sm text-red-400 text-center">
              {error}
            </p>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full py-3 rounded-full font-semibold transition
              ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#d4af37] text-black hover:opacity-90"
              }`}
          >
            {loading ? "Creating account..." : "Create Account"}
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
