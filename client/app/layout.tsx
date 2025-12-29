"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/src/context/CartContext";
import { AuthProvider } from "@/src/context/AuthContext";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // ✅ Detect admin routes
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            {/* ✅ Show ONLY for user routes */}
            {!isAdminRoute && <Navbar />}

            <main className={!isAdminRoute ? "pt-24" : ""}>
              {children}
            </main>

            {/* ✅ Toasts available everywhere */}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#000",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.1)"
                }
              }}
            />

            {/* ✅ Footer only for user routes */}
            {!isAdminRoute && <Footer />}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
