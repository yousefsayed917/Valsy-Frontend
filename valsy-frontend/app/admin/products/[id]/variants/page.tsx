"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { showToast } from "@/components/Toast";
import type { ProductDto, ProductVariantDto } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  ChevronRight,
  Loader2,
  RefreshCw,
  Layers,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Package,
  X,
} from "lucide-react";

const ADMIN_USER = "admin";

export default function ProductVariantsPage() {
  const params = useParams();
  const productId = Number(params?.id);

  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [stockEdits, setStockEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  // New variant form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newStock, setNewStock] = useState("0");
  const [addingVariant, setAddingVariant] = useState(false);

  const load = useCallback(() => {
    if (!Number.isSafeInteger(productId) || productId <= 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .getProductById(productId)
      .then((p) => {
        setProduct(p);
        if (p) {
          const edits: Record<string, string> = {};
          p.variants.forEach((v) => {
            edits[v.id] = String(v.stock);
          });
          setStockEdits(edits);
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaveStock = async (variant: ProductVariantDto) => {
    const newStockVal = parseInt(stockEdits[variant.id] ?? "0", 10);
    if (isNaN(newStockVal) || newStockVal < 0) {
      showToast("error", "Stock must be a non-negative integer.");
      return;
    }
    setSaving((s) => ({ ...s, [variant.id]: true }));
    try {
      await api.adjustStock(variant.id, newStockVal, ADMIN_USER);
      showToast("success", `Vault stock updated to ${newStockVal} units.`);
      load();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update stock";
      showToast("error", msg);
    } finally {
      setSaving((s) => ({ ...s, [variant.id]: false }));
    }
  };

  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    const stockNum = parseInt(newStock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      showToast("error", "Stock must be a non-negative integer.");
      return;
    }
    setAddingVariant(true);
    try {
      await api.createProductVariant(
        product.id,
        newSize.trim(),
        newColor.trim(),
        stockNum,
        ADMIN_USER
      );
      showToast("success", "New edition added to piece.");
      setNewSize("");
      setNewColor("");
      setNewStock("0");
      setShowAddForm(false);
      load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add edition";
      showToast("error", msg);
    } finally {
      setAddingVariant(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  if (!product) {
    return (
      <div className="min-h-[70dvh] flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="font-display text-3xl text-[#f5efe6]">Piece Not Found</h1>
        <Link
          href="/admin/products"
          className="btn-luxury-gold min-h-11 px-6 py-2.5 rounded-xl text-sm"
        >
          Back to Inventory
        </Link>
      </div>
    );
  }

  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);

  return (
    <div className="min-h-dvh px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-[#b8ada0] mb-6"
        >
          <Link href="/admin" className="hover:text-[#f5efe6] transition-colors">
            Valsy Admin
          </Link>
          <ChevronRight
            className="w-3.5 h-3.5 text-[#8c8073]"
            aria-hidden="true"
          />
          <Link
            href="/admin/products"
            className="hover:text-[#f5efe6] transition-colors"
          >
            Products
          </Link>
          <ChevronRight
            className="w-3.5 h-3.5 text-[#8c8073]"
            aria-hidden="true"
          />
          <span className="text-[#e6c89c]" aria-current="page">
            {product.name}
          </span>
        </nav>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8 pb-6 border-b border-[#f5efe6]/10">
          <div className="flex items-center gap-3.5">
            <Link
              href="/admin/products"
              aria-label="Return to inventory"
              className="w-10 h-10 rounded-xl bg-[#1a1714] border border-[#f5efe6]/12 flex items-center justify-center text-[#b8ada0] hover:text-[#f5efe6] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </Link>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#f5efe6]">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#b8ada0] tabular-nums">
                <span className="text-[#e6c89c] font-semibold">
                  ${product.price.toFixed(2)}
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Layers
                    className="w-3.5 h-3.5 text-[#d4af7a]"
                    aria-hidden="true"
                  />
                  {product.variants.length} editions
                </span>
                <span>·</span>
                <span>{totalStock} units in vault</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={load}
              aria-label="Refresh editions"
              className="w-11 h-11 rounded-xl border border-[#f5efe6]/12 bg-[#1a1714] hover:bg-[#231f1b] text-[#b8ada0] hover:text-[#f5efe6] flex items-center justify-center transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm((s) => !s)}
              className="btn-luxury-gold inline-flex items-center gap-2 min-h-11 px-5 py-2.5 rounded-xl text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" /> Add Edition
            </button>
          </div>
        </div>

        {/* Collapsible New Edition Form */}
        {showAddForm && (
          <div className="luxury-card mb-6 rounded-2xl border border-[#d4af7a]/35 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold text-[#e6c89c]">
                Register New Edition
              </h2>
              <button
                type="button"
                aria-label="Close new edition form"
                onClick={() => setShowAddForm(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#b8ada0] hover:text-[#f5efe6]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <form
              onSubmit={handleAddVariant}
              className="grid sm:grid-cols-4 gap-3.5 items-end"
            >
              <div>
                <label
                  htmlFor="new-variant-size"
                  className="block text-xs text-[#b8ada0] mb-1.5"
                >
                  Size <span className="text-[#d4af7a]">*</span>
                </label>
                <input
                  id="new-variant-size"
                  type="text"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  required
                  maxLength={50}
                  placeholder="S, M, L..."
                  className="w-full min-h-10 px-3 py-2 rounded-xl bg-[#12100e] border border-[#f5efe6]/12 text-[#f5efe6] placeholder-[#8c8073]/60 text-sm focus:outline-none focus:border-[#d4af7a]"
                />
              </div>
              <div>
                <label
                  htmlFor="new-variant-color"
                  className="block text-xs text-[#b8ada0] mb-1.5"
                >
                  Colorway <span className="text-[#d4af7a]">*</span>
                </label>
                <input
                  id="new-variant-color"
                  type="text"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  required
                  maxLength={100}
                  placeholder="Obsidian, Ivory..."
                  className="w-full min-h-10 px-3 py-2 rounded-xl bg-[#12100e] border border-[#f5efe6]/12 text-[#f5efe6] placeholder-[#8c8073]/60 text-sm focus:outline-none focus:border-[#d4af7a]"
                />
              </div>
              <div>
                <label
                  htmlFor="new-variant-stock"
                  className="block text-xs text-[#b8ada0] mb-1.5"
                >
                  Initial Vault Stock
                </label>
                <input
                  id="new-variant-stock"
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  min="0"
                  className="w-full min-h-10 px-3 py-2 rounded-xl bg-[#12100e] border border-[#f5efe6]/12 text-[#f5efe6] text-sm focus:outline-none focus:border-[#d4af7a] tabular-nums"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={addingVariant}
                  className="btn-luxury-gold flex-1 min-h-10 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm disabled:opacity-60 cursor-pointer"
                >
                  {addingVariant ? (
                    <Loader2
                      className="w-3.5 h-3.5 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  Add
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Editions Table */}
        {product.variants.length === 0 ? (
          <div className="luxury-card rounded-3xl p-12 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#231f1b] border border-[#d4af7a]/30 flex items-center justify-center">
              <Package className="w-6 h-6 text-[#d4af7a]" aria-hidden="true" />
            </div>
            <p className="text-[#b8ada0] text-sm">
              No editions registered yet. Use “Add Edition” above to allocate sizes and colorways.
            </p>
          </div>
        ) : (
          <div className="luxury-card rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#12100e]/60 border-b border-[#f5efe6]/10">
              <div className="col-span-3 text-xs font-semibold text-[#b8ada0] uppercase tracking-[0.14em]">
                Size
              </div>
              <div className="col-span-3 text-xs font-semibold text-[#b8ada0] uppercase tracking-[0.14em]">
                Colorway
              </div>
              <div className="col-span-2 text-xs font-semibold text-[#b8ada0] uppercase tracking-[0.14em]">
                Status
              </div>
              <div className="col-span-3 text-xs font-semibold text-[#b8ada0] uppercase tracking-[0.14em]">
                Vault Units
              </div>
              <div className="col-span-1"></div>
            </div>

            {product.variants.map((variant, i) => {
              const isLow = variant.stock > 0 && variant.stock <= 5;
              const isOut = variant.stock === 0;
              const isDirty =
                stockEdits[variant.id] !== undefined &&
                parseInt(stockEdits[variant.id], 10) !== variant.stock;

              return (
                <div
                  key={variant.id}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#231f1b]/50 transition-colors ${
                    i !== product.variants.length - 1
                      ? "border-b border-[#f5efe6]/6"
                      : ""
                  }`}
                >
                  <div className="col-span-3 text-[#f5efe6] font-semibold text-sm">
                    {variant.size}
                  </div>
                  <div className="col-span-3 text-[#b8ada0] text-sm">
                    {variant.color}
                  </div>
                  <div className="col-span-2">
                    {isOut ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#e69a9a]">
                        <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        Out
                      </span>
                    ) : isLow ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#eab676]">
                        <AlertTriangle
                          className="w-3.5 h-3.5"
                          aria-hidden="true"
                        />
                        Low
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#98c9a5]">
                        <CheckCircle2
                          className="w-3.5 h-3.5"
                          aria-hidden="true"
                        />
                        Optimal
                      </span>
                    )}
                  </div>
                  <div className="col-span-3">
                    <label
                      htmlFor={`stock-input-${variant.id}`}
                      className="sr-only"
                    >
                      Stock units for {variant.size} {variant.color}
                    </label>
                    <input
                      id={`stock-input-${variant.id}`}
                      type="number"
                      value={stockEdits[variant.id] ?? variant.stock}
                      onChange={(e) =>
                        setStockEdits((s) => ({
                          ...s,
                          [variant.id]: e.target.value,
                        }))
                      }
                      min="0"
                      className={`w-24 min-h-10 px-3 py-1.5 rounded-xl bg-[#12100e] border text-[#f5efe6] text-sm text-center focus:outline-none transition-colors tabular-nums ${
                        isDirty
                          ? "border-[#d4af7a] bg-[#d4af7a]/10"
                          : "border-[#f5efe6]/12 focus:border-[#d4af7a]"
                      }`}
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveStock(variant)}
                      disabled={!isDirty || saving[variant.id]}
                      className="btn-luxury-gold min-h-9 px-3.5 py-1.5 rounded-xl text-xs disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                    >
                      {saving[variant.id] ? (
                        <Loader2
                          className="w-3.5 h-3.5 animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        "Save"
                      )}
                    </button>
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
