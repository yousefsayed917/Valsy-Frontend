"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ProductDto } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import {
  Package,
  Layers,
  TrendingUp,
  Plus,
  ArrowRight,
  AlertTriangle,
  DollarSign,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getAdminProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalVariants = products.reduce((s, p) => s + p.variants.length, 0);
  const totalStock = products.reduce(
    (s, p) => s + p.variants.reduce((vs, v) => vs + v.stock, 0),
    0
  );
  const totalInventoryValue = products.reduce(
    (s, p) =>
      s + p.price * p.variants.reduce((vs, v) => vs + v.stock, 0),
    0
  );
  const lowStockVariants = products.flatMap((p) =>
    p.variants
      .filter((v) => v.stock > 0 && v.stock <= 5)
      .map((v) => ({ ...v, productName: p.name, productId: p.id }))
  );

  return (
    <div className="min-h-dvh px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10 pb-6 border-b border-[#f5efe6]/10">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#d4af7a] mb-2">
              VALSY · Value You Deserve
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#f5efe6]">
              Valsy Admin Dashboard
            </h1>
          </div>
          <Link
            href="/admin/products/new"
            className="btn-luxury-gold inline-flex items-center gap-2 min-h-11 px-5 py-2.5 rounded-xl text-sm"
          >
            <Plus className="w-4 h-4" aria-hidden="true" /> New Product
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <>
            {/* KPI Stat Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {[
                {
                  label: "Catalog Pieces",
                  value: products.length.toString(),
                  icon: (
                    <Package
                      className="w-5 h-5 text-[#d4af7a]"
                      aria-hidden="true"
                    />
                  ),
                },
                {
                  label: "Total Editions (Variants)",
                  value: totalVariants.toString(),
                  icon: (
                    <Layers
                      className="w-5 h-5 text-[#e6c89c]"
                      aria-hidden="true"
                    />
                  ),
                },
                {
                  label: "Atelier Stock Units",
                  value: totalStock.toString(),
                  icon: (
                    <TrendingUp
                      className="w-5 h-5 text-[#98c9a5]"
                      aria-hidden="true"
                    />
                  ),
                },
                {
                  label: "Estimated Vault Value",
                  value: `$${totalInventoryValue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
                  icon: (
                    <DollarSign
                      className="w-5 h-5 text-[#d4af7a]"
                      aria-hidden="true"
                    />
                  ),
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="luxury-card rounded-2xl p-6 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#231f1b] border border-[#d4af7a]/25 flex items-center justify-center flex-shrink-0">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="font-display text-3xl font-semibold text-[#f5efe6] tabular-nums">
                      {stat.value}
                    </p>
                    <p className="text-xs text-[#b8ada0] mt-0.5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Low Stock Alert Banner */}
            {lowStockVariants.length > 0 && (
              <div
                role="region"
                aria-label="Low stock alerts"
                className="mb-10 p-5 rounded-2xl border border-[#d99b52]/35 bg-[#d99b52]/[0.07] flex items-start gap-3.5"
              >
                <AlertTriangle
                  className="w-5 h-5 text-[#eab676] flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div className="flex-1">
                  <p className="text-[#f5efe6] font-semibold text-sm">
                    {lowStockVariants.length}{" "}
                    {lowStockVariants.length === 1 ? "edition is" : "editions are"}{" "}
                    running low in the atelier vault
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {lowStockVariants.map((v) => (
                      <Link
                        key={v.id}
                        href={`/admin/products/${v.productId}/variants`}
                        className="text-xs px-3 py-1 rounded-full bg-[#12100e]/80 border border-[#d99b52]/30 text-[#eab676] hover:border-[#eab676] transition-colors tabular-nums"
                      >
                        {v.productName} · {v.size}/{v.color} ({v.stock} left)
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Navigation Cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              <Link
                href="/admin/products"
                className="luxury-card-interactive group flex items-center justify-between p-6 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#231f1b] border border-[#d4af7a]/25 flex items-center justify-center">
                    <Package
                      className="w-5 h-5 text-[#d4af7a]"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-[#f5efe6] group-hover:text-[#e6c89c] transition-colors">
                      Manage Inventory
                    </h2>
                    <p className="text-[#b8ada0] text-xs mt-0.5 tabular-nums">
                      Inspect and adjust stock across {products.length} pieces
                    </p>
                  </div>
                </div>
                <ArrowRight
                  className="w-5 h-5 text-[#b8ada0] group-hover:text-[#d4af7a] group-hover:translate-x-1 transition-all"
                  aria-hidden="true"
                />
              </Link>

              <Link
                href="/admin/products/new"
                className="luxury-card-interactive group flex items-center justify-between p-6 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#231f1b] border border-[#d4af7a]/25 flex items-center justify-center">
                    <Plus
                      className="w-5 h-5 text-[#d4af7a]"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-[#f5efe6] group-hover:text-[#e6c89c] transition-colors">
                      Commission New Piece
                    </h2>
                    <p className="text-[#b8ada0] text-xs mt-0.5">
                      Register a new garment with sizes, colorways, and initial stock
                    </p>
                  </div>
                </div>
                <ArrowRight
                  className="w-5 h-5 text-[#b8ada0] group-hover:text-[#d4af7a] group-hover:translate-x-1 transition-all"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
