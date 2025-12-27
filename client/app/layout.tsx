import Navbar from "@/components/Navbar";
import { CartProvider } from "@/src/context/CartContext";
import { AuthProvider } from "@/src/context/AuthContext";
import "./globals.css";
import Footer from "@/components/Footer";

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
          <Footer />
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
