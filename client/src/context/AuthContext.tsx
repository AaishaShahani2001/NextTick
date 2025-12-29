"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  setUser: (user: User) => void;
  loginWithToken: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  /* ================= FETCH LOGGED-IN USER ================= */
  const fetchMe = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3000/api/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setUser(data);
      setIsLoggedIn(true);
    } catch {
      logout();
    }
  };

  /* ================= ON APP LOAD ================= */
  useEffect(() => {
    fetchMe();
  }, []);

  /* ================= LOGIN ================= */
  const loginWithToken = (token: string) => {
    localStorage.setItem("token", token);
    fetchMe(); // 🔥 fetch /api/me immediately
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        setUser,
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
