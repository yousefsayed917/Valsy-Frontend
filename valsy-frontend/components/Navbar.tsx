"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import ValsyLogo from "@/components/ValsyLogo";
import {
  ShoppingBag,
  LayoutDashboard,
  Store,
  Menu,
  X,
  Compass,
  Package,
} from "lucide-react";

export default function Navbar() {
  const { totalItems } = useCart();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = isAdmin
    ? [
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/products", label: "Products" },
        { href: "/admin/products/new", label: "Add Product" },
        { href: "/products", label: "Storefront" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/products", label: "Shop" },
      ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#f5efe6]/10 bg-[#12100e]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Crest & Wordmark */}
          <Link
            href="/"
            className="flex items-center group py-1.5"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ValsyLogo
              markSize={32}
              subLabel={isAdmin ? "Admin Portal" : "Value you deserve"}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-8"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname?.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-2 text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? "text-[#e6c89c]"
                      : "text-[#b8ada0] hover:text-[#f5efe6]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#d4af7a]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {!isAdmin && (
              <Link
                href="/cart"
                aria-label={`Shopping bag, ${totalItems} ${totalItems === 1 ? "item" : "items"}`}
                className="relative inline-flex items-center gap-2 min-h-11 px-4 py-2 rounded-xl bg-[#1a1714] hover:bg-[#231f1b] border border-[#f5efe6]/12 hover:border-[#d4af7a]/40 transition-all text-sm font-medium text-[#f5efe6]"
              >
                <ShoppingBag className="w-4 h-4 text-[#d4af7a]" aria-hidden="true" />
                <span className="hidden sm:inline">Bag</span>
                <span
                  aria-live="polite"
                  aria-atomic="true"
                  className={`min-w-5 h-5 px-1.5 rounded-full text-xs font-semibold tabular-nums flex items-center justify-center transition-colors ${
                    totalItems > 0
                      ? "bg-[#d4af7a] text-[#12100e]"
                      : "bg-[#231f1b] text-[#b8ada0]"
                  }`}
                >
                  {totalItems}
                </span>
              </Link>
            )}

            {isAdmin ? (
              <Link
                href="/"
                className="inline-flex items-center gap-2 min-h-11 px-4 py-2 rounded-xl bg-[#1a1714] hover:bg-[#231f1b] border border-[#f5efe6]/12 hover:border-[#d4af7a]/40 transition-all text-sm font-medium text-[#f5efe6]"
              >
                <Store className="w-4 h-4 text-[#d4af7a]" aria-hidden="true" />
                <span className="hidden sm:inline">Store</span>
              </Link>
            ) : (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 min-h-11 px-4 py-2 rounded-xl bg-[#1a1714] hover:bg-[#231f1b] border border-[#f5efe6]/12 hover:border-[#d4af7a]/40 transition-all text-sm font-medium text-[#b8ada0] hover:text-[#f5efe6]"
              >
                <LayoutDashboard className="w-4 h-4 text-[#d4af7a]" aria-hidden="true" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#1a1714] border border-[#f5efe6]/12 text-[#f5efe6] hover:border-[#d4af7a]/40 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-[#f5efe6]/10 bg-[#161310]/98 backdrop-blur-2xl px-4 py-4"
        >
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 min-h-11 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#d4af7a]/15 text-[#e6c89c] border border-[#d4af7a]/30"
                      : "text-[#b8ada0] hover:bg-[#231f1b] hover:text-[#f5efe6]"
                  }`}
                >
                  {isAdmin ? (
                    <Package className="w-4 h-4 text-[#d4af7a]" aria-hidden="true" />
                  ) : (
                    <Compass className="w-4 h-4 text-[#d4af7a]" aria-hidden="true" />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
