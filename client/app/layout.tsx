import Navbar from "@/components/Navbar";
import { CartProvider } from "@/src/context/CartContext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <main className="pt-24">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
