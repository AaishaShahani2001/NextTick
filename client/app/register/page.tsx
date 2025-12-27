"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch(
      "http://localhost:3000/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      return;
    }

    login(data.token, {
      id: data._id,
      name: data.name,
      email: data.email
    });

    router.push("/");
  };

  return (
    <section className="w-full flex items-center justify-center px-6 py-32">
      <div className="w-full max-w-md bg-black border border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Register
        </h1>

        <input
          placeholder="Full Name"
          className="w-full p-4 mb-4 rounded-xl bg-black border border-white/10"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          className="w-full p-4 mb-4 rounded-xl bg-black border border-white/10"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 mb-4 rounded-xl bg-black border border-white/10"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-4 mb-4 rounded-xl bg-black border border-white/10"
          onChange={(e) =>
            setForm({
              ...form,
              confirmPassword: e.target.value
            })
          }
        />

        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={handleRegister}
          className="w-full py-3 rounded-full bg-[#d4af37] text-black"
        >
          Create Account
        </button>

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
