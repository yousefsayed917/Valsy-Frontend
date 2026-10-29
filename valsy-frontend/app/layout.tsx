import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "@/components/Toast";

export const metadata: Metadata = {
  title: "VALSY — Value You Deserve",
  description:
    "VALSY — Value you deserve. Discover premium fashion, natural textiles, and refined silhouettes crafted for enduring comfort and style.",
  keywords: ["valsy", "fashion", "luxury", "clothing", "ecommerce"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-dvh bg-[#12100e] text-[#f5efe6] antialiased overflow-x-hidden relative selection:bg-[#d4af7a]/30">
        {/* Accessible Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-5 focus:py-2.5 focus:rounded-xl focus:bg-[#d4af7a] focus:text-[#12100e] focus:font-semibold focus:shadow-2xl"
        >
          Skip to main content
        </a>

        {/* Warm Ambient Atelier Lighting (Subtle, eye-comfort glow) */}
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden" aria-hidden="true">
          <div className="absolute top-[-18%] left-[12%] w-[52rem] h-[36rem] rounded-full bg-[#d4af7a]/[0.055] blur-[150px]" />
          <div className="absolute bottom-[-22%] right-[8%] w-[46rem] h-[38rem] rounded-full bg-[#9c7a54]/[0.05] blur-[150px]" />
        </div>

        <CartProvider>
          <Navbar />
          <main id="main-content" className="pt-24 relative z-0 min-h-[calc(100dvh-6rem)]">
            {children}
          </main>
          <Footer />
          <ToastContainer />
        </CartProvider>
      </body>
    </html>
  );
}
