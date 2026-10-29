import Link from "next/link";
import { ShieldCheck, Sparkles, Compass } from "lucide-react";
import ValsyLogo from "@/components/ValsyLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-[#f5efe6]/10 bg-[#0e0c0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center mb-5 group">
              <ValsyLogo markSize={34} subLabel="Value you deserve" />
            </Link>
            <p className="text-[#b8ada0] text-sm leading-relaxed max-w-sm">
              Architectural silhouettes and tactile natural fibers designed in small batches. Crafted for quiet confidence and lasting comfort.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-[#b8ada0]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1714] border border-[#f5efe6]/8">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af7a]" aria-hidden="true" />
                Authenticated Craftsmanship
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1714] border border-[#f5efe6]/8">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af7a]" aria-hidden="true" />
                Small-Batch Editions
              </span>
            </div>
          </div>

          {/* Collection Links */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-[#f5efe6] font-semibold text-lg mb-4">
              Shop Valsy
            </h3>
            <ul className="flex flex-col gap-3">
              {[
                { label: "All Products", href: "/products" },
                { label: "New Arrivals", href: "/products" },
                { label: "Best Sellers", href: "/products" },
                { label: "Shopping Bag", href: "/cart" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[#b8ada0] hover:text-[#e6c89c] text-sm transition-colors inline-block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Valsy Links */}
          <div className="lg:col-span-4">
            <h3 className="font-display text-[#f5efe6] font-semibold text-lg mb-4">
              Valsy
            </h3>
            <ul className="flex flex-col gap-3">
              {[
                { label: "About Valsy", href: "/" },
                { label: "Admin Dashboard", href: "/admin" },
                { label: "Manage Products", href: "/admin/products" },
                { label: "Add New Product", href: "/admin/products/new" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[#b8ada0] hover:text-[#e6c89c] text-sm transition-colors inline-block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#f5efe6]/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#8c8073] text-xs">
            © {currentYear} Valsy. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#8c8073]">
            <Compass className="w-3.5 h-3.5 text-[#d4af7a]" aria-hidden="true" />
            <span>VALSY — Value you deserve</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
