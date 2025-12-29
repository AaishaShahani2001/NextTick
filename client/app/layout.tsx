import Navbar from "@/components/Navbar";
import { CartProvider } from "@/src/context/CartContext";
import { AuthProvider } from "@/src/context/AuthContext";
import "./globals.css";
import Footer from "@/components/Footer";

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
       <AuthProvider>
        <CartProvider>
          <Navbar />
          <main className="pt-24">
            {children}
          </main>
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
          <Footer />
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
