"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithToken } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      //  Save token + update AuthContext
      await loginWithToken(data.token);

      //  Immediately confirm role (no state timing issues)
      const meRes = await fetch("http://localhost:5000/api/me", {
        headers: {
          Authorization: `Bearer ${data.token}`
        }
      });

      if (!meRes.ok) {
        setError("Failed to load user profile");
        return;
      }

      const me = await meRes.json();

      toast.success("Logged in successfully");

      //  Redirect based on role
      if (me.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= BANNER IMAGE ================= */}
      <section
        className="relative h-[55vh] w-full flex items-start justify-center pt-28"
        style={{
          backgroundImage: "url('/images/watch-3.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Title */}
        <h1 className="relative z-10 text-white text-3xl tracking-[0.35em] font-light">
          ACCOUNT
        </h1>
      </section>

      {/* ================= LOGIN CARD ================= */}
      <section className="relative flex justify-center px-6">
        <div
          className="
            -mt-30 w-full max-w-md
            bg-black border border-white/10
            rounded-2xl p-8
            shadow-2xl
          "
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Login
          </h2>

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="
              w-full p-4 mb-4 rounded-xl
              bg-black border border-white/10
              text-white placeholder-gray-500
              focus:outline-none focus:border-[#d4af37]
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="
              w-full p-4 mb-4 rounded-xl
              bg-black border border-white/10
              text-white placeholder-gray-500
              focus:outline-none focus:border-[#d4af37]
            "
          />

          {error && (
            <p className="text-red-400 text-sm mb-3">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="
              w-full py-3 rounded-full
              bg-[#d4af37] text-black
              font-semibold
              hover:opacity-90 transition
              disabled:opacity-60
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-6 text-sm text-gray-400 text-center">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-[#d4af37] hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
