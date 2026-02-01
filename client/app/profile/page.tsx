"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User as UserIcon } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { isLoggedIn, user, updateUser  } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: ""
  });

  const [loading, setLoading] = useState(false);

  // 🔒 Protect route + load data
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    if (user) {
      setForm({
        name: user.name ?? "",
        phone: user.phone ?? ""
      });
    }
  }, [isLoggedIn, user, router]);

  if (!isLoggedIn || !user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
    setLoading(true);

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      toast.error(data.message || "Update failed");
      return;
    }

  
  updateUser({
  id: data.id,
  name: data.name,
  email: data.email,
  phone: data.phone
});

   toast.success("Profile updated successfully");
  };

  return (
    <section className="max-w-5xl mx-auto px-6 md:px-12 py-20">
      <h1 className="text-4xl font-bold text-white mb-12">
        My Profile
      </h1>

      <div className="bg-black border border-white/10 rounded-2xl p-8">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-[#d4af37]
            flex items-center justify-center">
            <UserIcon className="text-black" size={28} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              {user.email}
            </h2>
          </div>
        </div>

        {/* NAME */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-4 mb-4 rounded-xl bg-black
          border border-white/10 text-white
          focus:outline-none focus:border-[#d4af37]"
        />

        {/* PHONE */}
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full p-4 mb-6 rounded-xl bg-black
          border border-white/10 text-white
          focus:outline-none focus:border-[#d4af37]"
        />

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="px-8 py-3 rounded-full bg-[#d4af37]
          text-black font-semibold hover:opacity-90 transition"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </section>
  );
}
