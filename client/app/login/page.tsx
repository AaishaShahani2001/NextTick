"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:3000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
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

      // ✅ Redirect after login
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

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-sm text-red-400 text-center">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-full font-semibold transition
              ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#d4af37] text-black hover:opacity-90"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
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
