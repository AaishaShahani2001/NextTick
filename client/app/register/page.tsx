"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { loginWithToken } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      await loginWithToken(data.token);

      toast.success("Account created successfully");
      router.push("/");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= BANNER ================= */}
      <section
        className="relative h-[55vh] w-full flex items-start justify-center pt-28"
        style={{
          backgroundImage: "url('/images/watch-3.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <h1 className="relative z-10 text-white text-3xl tracking-[0.35em] font-light">
          ACCOUNT
        </h1>
      </section>

      {/* ================= REGISTER CARD ================= */}
      <section className="relative flex justify-center px-6">
        <div
          className="
            -mt-45 w-full max-w-md
            bg-black border border-white/10
            rounded-2xl p-8
            shadow-2xl
          "
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Register
          </h2>

          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="
              w-full p-4 mb-4 rounded-xl
              bg-black border border-white/10
              text-white placeholder-gray-500
              focus:outline-none focus:border-[#d4af37]
            "
          />

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

          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({
                ...form,
                confirmPassword: e.target.value
              })
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
            onClick={handleRegister}
            disabled={loading}
            className="
              w-full py-3 rounded-full
              bg-[#d4af37] text-black
              font-semibold
              hover:opacity-90 transition
              disabled:opacity-60
            "
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="mt-6 text-sm text-gray-400 text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#d4af37] hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
