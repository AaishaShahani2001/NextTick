"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/src/context/CartContext";
import { AuthProvider } from "@/src/context/AuthContext";
import { Toaster } from "react-hot-toast";
import "./globals.css";

type Product = {
  _id: string;
  name: string;
  collection: string;
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Detect admin routes
  const isAdminRoute = pathname.startsWith("/admin");

  // 🔹 Products for Navbar search
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // 🔹 Fetch products ONCE (client-side)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/products"
        );
        const data = await res.json();

        // Adjust if your API response is { products: [...] }
        setProducts(data.products ?? data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            {/* Navbar only for user routes */}
            {!isAdminRoute && (
              <Navbar products={products} />
            )}

            <main className={!isAdminRoute ? "pt-16" : ""}>
              {children}
            </main>

            {/* Toasts available everywhere */}
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

            {/* Footer only for user routes */}
            {!isAdminRoute && <Footer />}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
