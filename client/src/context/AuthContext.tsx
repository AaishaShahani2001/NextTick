"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  loginWithToken: (token: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH LOGGED-IN USER ================= */
  const fetchMe = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data: User = await res.json();
      setUser(data);
      setIsLoggedIn(true);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  /* ================= ON APP LOAD ================= */
  useEffect(() => {
    fetchMe();
  }, []);

  /* ================= LOGIN ================= */
  const loginWithToken = async (token: string) => {
    localStorage.setItem("token", token);
    await fetchMe(); // 🔥 instant user + role update
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  };

  // if (loading) {
  //   return null; // or spinner if you want
  // }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        loading,
        loginWithToken,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
