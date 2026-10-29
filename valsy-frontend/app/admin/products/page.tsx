"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { ProductDto } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import {
  Plus,
  Search,
  Layers,
  ChevronRight,
  RefreshCw,
  Package,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    api
      .getAdminProducts(search || undefined)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(inputValue.trim());
  };

  return (
    <div className="min-h-dvh px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8 pb-6 border-b border-[#f5efe6]/10">
          <div>
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs text-[#b8ada0] mb-2"
            >
              <Link
                href="/admin"
                className="hover:text-[#f5efe6] transition-colors"
              >
                Valsy Admin
              </Link>
              <ChevronRight
                className="w-3.5 h-3.5 text-[#8c8073]"
                aria-hidden="true"
              />
              <span className="text-[#e6c89c]" aria-current="page">
                Products
              </span>
            </nav>
            <h1 className="font-display text-4xl font-semibold text-[#f5efe6]">
              Valsy Products
            </h1>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={load}
              aria-label="Refresh inventory list"
              className="w-11 h-11 rounded-xl border border-[#f5efe6]/12 bg-[#1a1714] hover:bg-[#231f1b] text-[#b8ada0] hover:text-[#f5efe6] flex items-center justify-center transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
            </button>
            <Link
              href="/admin/products/new"
              className="btn-luxury-gold inline-flex items-center gap-2 min-h-11 px-5 py-2.5 rounded-xl text-sm"
            >
              <Plus className="w-4 h-4" aria-hidden="true" /> New Piece
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8 flex gap-2.5 max-w-xl">
          <div className="relative flex-1">
            <label htmlFor="admin-product-search" className="sr-only">
              Search inventory
            </label>
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8073]"
              aria-hidden="true"
            />
            <input
              id="admin-product-search"
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search pieces by name..."
              className="w-full min-h-11 pl-10 pr-4 py-2.5 rounded-xl bg-[#1a1714] border border-[#f5efe6]/12 text-[#f5efe6] placeholder-[#8c8073] text-sm focus:outline-none focus:border-[#d4af7a] transition-colors"
            />
          </div>
          <button
            type="submit"
            className="min-h-11 px-5 py-2.5 rounded-xl bg-[#231f1b] hover:bg-[#2b2621] border border-[#f5efe6]/12 text-[#f5efe6] text-sm font-medium transition-colors cursor-pointer"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setInputValue("");
              }}
              className="min-h-11 px-4 py-2.5 rounded-xl border border-[#f5efe6]/12 bg-[#1a1714] hover:bg-[#231f1b] text-[#b8ada0] text-sm transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </form>

        {/* Product Directory Table */}
        {loading ? (
          <LoadingSpinner size="lg" />
        ) : products.length === 0 ? (
          <div className="luxury-card rounded-3xl p-12 text-center max-w-lg mx-auto flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#231f1b] border border-[#d4af7a]/30 flex items-center justify-center">
              <Package className="w-7 h-7 text-[#d4af7a]" aria-hidden="true" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-[#f5efe6]">
              No Pieces Registered
            </h2>
            <p className="text-[#b8ada0] text-sm">
              Begin by commissioning your first garment in the atelier catalog.
            </p>
            <Link
              href="/admin/products/new"
              className="btn-luxury-gold inline-flex items-center gap-2 min-h-11 px-6 py-2.5 rounded-xl text-sm"
            >
              <Plus className="w-4 h-4" aria-hidden="true" /> Commission First Piece
            </Link>
          </div>
        ) : (
          <div className="luxury-card rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#12100e]/60 border-b border-[#f5efe6]/10">
              <div className="col-span-5 text-xs font-semibold text-[#b8ada0] uppercase tracking-[0.14em]">
                Piece
              </div>
              <div className="col-span-2 text-xs font-semibold text-[#b8ada0] uppercase tracking-[0.14em]">
                Price
              </div>
              <div className="col-span-2 text-xs font-semibold text-[#b8ada0] uppercase tracking-[0.14em]">
                Editions
              </div>
              <div className="col-span-2 text-xs font-semibold text-[#b8ada0] uppercase tracking-[0.14em]">
                Vault Stock
              </div>
              <div className="col-span-1"></div>
            </div>

            {/* Rows */}
            {products.map((product, i) => {
              const totalStock = product.variants.reduce(
                (s, v) => s + v.stock,
                0
              );
              const isLowStock = totalStock > 0 && totalStock <= 10;
              const isOutOfStock = totalStock === 0;
              return (
                <div
                  key={product.id}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#231f1b]/60 transition-colors ${
                    i !== products.length - 1
                      ? "border-b border-[#f5efe6]/6"
                      : ""
                  }`}
                >
                  <div className="col-span-5 flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#26211c] to-[#15120f] border border-[#d4af7a]/25 flex items-center justify-center flex-shrink-0">
                      <span className="font-display italic text-lg font-semibold text-[#e6c89c]/60">
                        {product.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[#f5efe6] font-semibold text-sm truncate">
                        {product.name}
                      </p>
                      {product.description && (
                        <p className="text-[#8c8073] text-xs truncate mt-0.5">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2 text-[#e6c89c] font-semibold text-sm tabular-nums">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 text-[#b8ada0] text-sm tabular-nums">
                    <Layers
                      className="w-3.5 h-3.5 text-[#d4af7a]"
                      aria-hidden="true"
                    />
                    {product.variants.length}
                  </div>
                  <div className="col-span-2">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border tabular-nums ${
                        isOutOfStock
                          ? "bg-[#d46a6a]/12 border-[#d46a6a]/35 text-[#e69a9a]"
                          : isLowStock
                            ? "bg-[#d99b52]/15 border-[#d99b52]/40 text-[#eab676]"
                            : "bg-[#6e9e7b]/12 border-[#6e9e7b]/35 text-[#98c9a5]"
                      }`}
                    >
                      {isOutOfStock ? "Sold Out" : `${totalStock} units`}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Link
                      href={`/admin/products/${product.id}/variants`}
                      aria-label={`Manage editions for ${product.name}`}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-[#b8ada0] hover:text-[#e6c89c] hover:bg-[#d4af7a]/15 transition-colors"
                      title="Manage editions & stock"
                    >
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
