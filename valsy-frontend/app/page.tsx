import Link from "next/link";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { ValsyMark } from "@/components/ValsyLogo";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Compass,
  Award,
} from "lucide-react";
import type { ProductDto } from "@/types";

export default async function HomePage() {
  let featuredProducts: ProductDto[] = [];
  try {
    const all = await api.getProducts();
    featuredProducts = all.products.slice(0, 4);
  } catch {
    // Gracefully render editorial storefront even when API is offline
  }

  return (
    <div className="relative overflow-hidden">
      {/* ── Editorial Hero Lookbook ──────────────────────────────────────── */}
      <section className="relative min-h-[84dvh] flex items-center px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Editorial Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d4af7a]/35 bg-[#d4af7a]/10 text-[#e6c89c] text-xs font-medium mb-7">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              VALSY · Value You Deserve
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-[#f5efe6] leading-[1.04] mb-6 max-w-2xl">
              Tailored for Quiet Distinction & Lasting Comfort.
            </h1>

            <p className="text-[#b8ada0] text-base sm:text-lg max-w-xl mb-10 leading-relaxed">
              Every Valsy silhouette is shaped from breathable organic wools, brushed cashmere blends, and long-staple cottons—created for effortless movement and the enduring value you deserve.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="btn-luxury-gold group inline-flex items-center gap-2.5 min-h-12 px-7 py-3.5 rounded-xl text-sm tracking-wide"
              >
                Explore the Collection
                <ArrowRight
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 min-h-12 px-6 py-3.5 rounded-xl border border-[#f5efe6]/15 bg-[#1a1714]/80 text-[#f5efe6] text-sm font-medium hover:border-[#d4af7a]/45 hover:bg-[#231f1b] transition-all"
              >
                Admin Portal
              </Link>
            </div>

            {/* Provenance & Craftsmanship Metrics */}
            <div className="mt-14 pt-8 border-t border-[#f5efe6]/10 grid grid-cols-3 gap-6 sm:gap-12 w-full max-w-lg">
              {[
                { value: "100%", label: "Natural & Traceable Fibers" },
                { value: "48h", label: "Concierge Dispatch" },
                { value: "4.9 ★", label: "Client Satisfaction" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-2xl sm:text-3xl font-semibold text-[#e6c89c] tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#b8ada0] mt-1 leading-snug">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Lookbook Architectural Showcase Card */}
          <div className="lg:col-span-5">
            <div className="luxury-card relative rounded-3xl p-7 sm:p-9 overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#d4af7a]/12 blur-3xl pointer-events-none"
              />
              <div className="relative aspect-[4/4.6] rounded-2xl border border-[#d4af7a]/25 bg-gradient-to-b from-[#28221c] via-[#1c1814] to-[#13100d] p-7 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-[#b8ada0]">
                  <span className="tracking-[0.2em] uppercase text-[#e6c89c]">
                    Edition N° 04
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#12100e]/70 border border-[#f5efe6]/10">
                    Milan · Paris
                  </span>
                </div>

                <div className="my-auto text-center py-6">
                  <div className="w-24 h-24 mx-auto mb-5 rounded-2xl border border-[#d4af7a]/35 bg-[#12100e]/85 flex items-center justify-center shadow-lg">
                    <ValsyMark size={58} variant="gold" />
                  </div>
                  <p className="font-display italic text-3xl sm:text-4xl text-[#f5efe6] leading-tight">
                    “Value you deserve—tailored into every thread.”
                  </p>
                  <p className="text-xs tracking-[0.2em] uppercase text-[#d4af7a] mt-4 font-medium">
                    Valsy Signature Collection
                  </p>
                </div>

                <div className="pt-4 border-t border-[#f5efe6]/10 flex items-center justify-between text-xs">
                  <span className="text-[#b8ada0]">Bespoke Sizing & Colorways</span>
                  <Link
                    href="/products"
                    className="text-[#e6c89c] hover:underline font-medium inline-flex items-center gap-1"
                  >
                    View Lookbook
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pillars of the Maison ─────────────────────────────────────── */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-y border-[#f5efe6]/8 bg-[#161310]/60">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: <Award className="w-5 h-5 text-[#d4af7a]" aria-hidden="true" />,
              title: "Artisanal Textiles",
              desc: "Woven from long-staple organic fibers selected for softness against the skin and multi-season durability.",
            },
            {
              icon: <Truck className="w-5 h-5 text-[#8ab896]" aria-hidden="true" />,
              title: "Complimentary White-Glove Delivery",
              desc: "Every order is pressed, wrapped in acid-free tissue, and shipped with complimentary tracked courier service.",
            },
            {
              icon: <ShieldCheck className="w-5 h-5 text-[#e6c89c]" aria-hidden="true" />,
              title: "Guaranteed Provenance",
              desc: "Each garment undergoes a 14-point atelier inspection for seam integrity, drape, and finish before dispatch.",
            },
          ].map((pillar) => (
            <div
              key={pillar.title}
              className="luxury-card rounded-2xl p-6 flex flex-col gap-3"
            >
              <div className="w-11 h-11 rounded-xl bg-[#231f1b] border border-[#d4af7a]/25 flex items-center justify-center">
                {pillar.icon}
              </div>
              <h2 className="font-display text-2xl font-semibold text-[#f5efe6]">
                {pillar.title}
              </h2>
              <p className="text-[#b8ada0] text-sm leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Curated Featured Pieces ───────────────────────────────────── */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-[#d4af7a] mb-2">
                Curated Selection
              </p>
              <h2 className="font-display text-4xl font-semibold text-[#f5efe6]">
                Featured Valsy Products
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-[#e6c89c] hover:text-[#f5efe6] text-sm font-medium transition-colors"
            >
              Browse Full Catalog
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="luxury-card rounded-2xl p-10 text-center max-w-2xl mx-auto">
              <Compass
                className="w-8 h-8 text-[#d4af7a] mx-auto mb-3"
                aria-hidden="true"
              />
              <h3 className="font-display text-2xl font-semibold text-[#f5efe6] mb-2">
                Explore Our Full Collection
              </h3>
              <p className="text-[#b8ada0] text-sm mb-6">
                Visit the catalog to browse available sizes, seasonal colorways, and live atelier stock.
              </p>
              <Link
                href="/products"
                className="btn-luxury-gold inline-flex items-center gap-2 min-h-11 px-6 py-2.5 rounded-xl text-sm"
              >
                Open Catalog <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Private Client Invitation Banner ─────────────────────────── */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="luxury-card relative rounded-3xl border border-[#d4af7a]/30 p-10 sm:p-14 text-center overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#d4af7a]/[0.06] via-transparent to-[#d4af7a]/[0.06] pointer-events-none"
            />
            <div className="relative max-w-2xl mx-auto">
              <div className="flex justify-center mb-4">
                <ValsyMark size={40} variant="gold" />
              </div>
              <p className="text-xs tracking-[0.22em] uppercase text-[#d4af7a] mb-3">
                VALSY · Value You Deserve
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-semibold text-[#f5efe6] mb-4">
                Acquire Pieces Built to Endure
              </h2>
              <p className="text-[#b8ada0] mb-8 text-base leading-relaxed">
                Filter by exact proportion, colorway, and availability in our interactive catalog, with instant reservation at checkout.
              </p>
              <Link
                href="/products"
                className="btn-luxury-gold inline-flex items-center gap-2.5 min-h-12 px-8 py-3.5 rounded-xl text-sm"
              >
                Enter the Collection
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
