"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { showToast } from "@/components/Toast";
import Link from "next/link";
import { ArrowLeft, Plus, Loader2, ChevronRight, Trash2 } from "lucide-react";

const ADMIN_USER = "admin";

interface VariantDraft {
  id: string;
  size: string;
  color: string;
  stock: number;
}

export default function CreateProductPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Product fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // Variant drafts
  const [variants, setVariants] = useState<VariantDraft[]>([
    { id: "initial-1", size: "", color: "", stock: 0 },
  ]);

  const addVariant = () => {
    setVariants((v) => [
      ...v,
      { id: crypto.randomUUID(), size: "", color: "", stock: 0 },
    ]);
  };

  const removeVariant = (id: string) => {
    setVariants((v) => v.filter((d) => d.id !== id));
  };

  const updateVariant = (
    id: string,
    field: keyof Omit<VariantDraft, "id">,
    value: string | number
  ) => {
    setVariants((v) =>
      v.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast("error", "Please enter a valid price greater than $0.00.");
      return;
    }
    const filledVariants = variants.filter(
      (v) => v.size.trim() && v.color.trim()
    );
    if (filledVariants.length === 0) {
      showToast(
        "error",
        "Add at least one edition with both size and colorway."
      );
      return;
    }

    setSubmitting(true);
    try {
      const { productId } = await api.createProduct(
        name,
        description,
        priceNum,
        ADMIN_USER,
        filledVariants
      );

      showToast(
        "success",
        `"${name}" commissioned with ${filledVariants.length} edition(s).`
      );
      if (productId && Number.isSafeInteger(Number(productId))) {
        router.push(`/admin/products/${productId}/variants`);
      } else {
        router.push("/admin/products");
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to commission piece";
      showToast("error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
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
            New Product
          </span>
        </nav>

        <div className="flex items-center gap-3.5 mb-8 pb-6 border-b border-[#f5efe6]/10">
          <Link
            href="/admin/products"
            aria-label="Return to products"
            className="w-10 h-10 rounded-xl bg-[#1a1714] border border-[#f5efe6]/12 flex items-center justify-center text-[#b8ada0] hover:text-[#f5efe6] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </Link>
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#d4af7a]">
              VALSY · Value You Deserve
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#f5efe6]">
              Create New Product
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Garment Details */}
          <div className="luxury-card rounded-3xl p-6 sm:p-7">
            <h2 className="font-display text-2xl font-semibold text-[#f5efe6] mb-5">
              Garment Specifications
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="product-name"
                  className="block text-xs text-[#b8ada0] mb-1.5 font-medium"
                >
                  Piece Title <span className="text-[#d4af7a]">*</span>
                </label>
                <input
                  id="product-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={200}
                  placeholder="e.g. Cashmere Double-Breasted Overcoat"
                  className="w-full min-h-11 px-3.5 py-2.5 rounded-xl bg-[#12100e] border border-[#f5efe6]/12 text-[#f5efe6] placeholder-[#8c8073]/60 text-sm focus:outline-none focus:border-[#d4af7a] transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="product-desc"
                  className="block text-xs text-[#b8ada0] mb-1.5 font-medium"
                >
                  Provenance & Fabric Notes
                </label>
                <textarea
                  id="product-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={1000}
                  rows={3}
                  placeholder="Describe the textile composition, drape, and tailoring..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100e] border border-[#f5efe6]/12 text-[#f5efe6] placeholder-[#8c8073]/60 text-sm focus:outline-none focus:border-[#d4af7a] transition-colors resize-none"
                />
              </div>

              <div>
                <label
                  htmlFor="product-price"
                  className="block text-xs text-[#b8ada0] mb-1.5 font-medium"
                >
                  Atelier Price (USD) <span className="text-[#d4af7a]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d4af7a] text-sm font-semibold">
                    $
                  </span>
                  <input
                    id="product-price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full min-h-11 pl-8 pr-4 py-2.5 rounded-xl bg-[#12100e] border border-[#f5efe6]/12 text-[#f5efe6] placeholder-[#8c8073]/60 text-sm focus:outline-none focus:border-[#d4af7a] transition-colors tabular-nums"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Editions / Variants */}
          <div className="luxury-card rounded-3xl p-6 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-2xl font-semibold text-[#f5efe6]">
                  Editions & Vault Allocation
                </h2>
                <p className="text-xs text-[#b8ada0] mt-0.5">
                  Define sizes, colorways, and initial unit quantities.
                </p>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center gap-1.5 min-h-10 px-3.5 py-2 rounded-xl border border-[#d4af7a]/35 bg-[#d4af7a]/10 text-[#e6c89c] text-xs font-medium hover:bg-[#d4af7a]/20 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Add Edition
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-10 gap-2.5 text-xs font-medium text-[#b8ada0] px-1">
                <span className="col-span-4">Size</span>
                <span className="col-span-4">Colorway</span>
                <span className="col-span-1 text-center">Units</span>
                <span className="col-span-1"></span>
              </div>

              {variants.map((variant, idx) => (
                <div
                  key={variant.id}
                  className="grid grid-cols-10 gap-2.5 items-center"
                >
                  <input
                    type="text"
                    aria-label={`Edition ${idx + 1} size`}
                    value={variant.size}
                    onChange={(e) =>
                      updateVariant(variant.id, "size", e.target.value)
                    }
                    placeholder="S, M, L, XL..."
                    maxLength={50}
                    className="col-span-4 min-h-10 px-3 py-2 rounded-xl bg-[#12100e] border border-[#f5efe6]/12 text-[#f5efe6] placeholder-[#8c8073]/60 text-sm focus:outline-none focus:border-[#d4af7a] transition-colors"
                  />
                  <input
                    type="text"
                    aria-label={`Edition ${idx + 1} colorway`}
                    value={variant.color}
                    onChange={(e) =>
                      updateVariant(variant.id, "color", e.target.value)
                    }
                    placeholder="Obsidian, Ivory, Camel..."
                    maxLength={100}
                    className="col-span-4 min-h-10 px-3 py-2 rounded-xl bg-[#12100e] border border-[#f5efe6]/12 text-[#f5efe6] placeholder-[#8c8073]/60 text-sm focus:outline-none focus:border-[#d4af7a] transition-colors"
                  />
                  <input
                    type="number"
                    aria-label={`Edition ${idx + 1} initial stock`}
                    value={variant.stock}
                    onChange={(e) =>
                      updateVariant(
                        variant.id,
                        "stock",
                        Math.max(0, parseInt(e.target.value, 10) || 0)
                      )
                    }
                    min="0"
                    className="col-span-1 min-h-10 px-2 py-2 rounded-xl bg-[#12100e] border border-[#f5efe6]/12 text-[#f5efe6] text-sm focus:outline-none focus:border-[#d4af7a] transition-colors text-center tabular-nums"
                  />
                  <button
                    type="button"
                    aria-label={`Remove edition ${idx + 1}`}
                    onClick={() => removeVariant(variant.id)}
                    disabled={variants.length === 1}
                    className="col-span-1 w-9 h-9 mx-auto rounded-lg flex items-center justify-center text-[#8c8073] hover:text-[#e08585] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Link
              href="/admin/products"
              className="min-h-11 px-5 py-2.5 rounded-xl border border-[#f5efe6]/12 bg-[#1a1714] hover:bg-[#231f1b] text-[#b8ada0] hover:text-[#f5efe6] text-sm font-medium inline-flex items-center transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn-luxury-gold inline-flex items-center gap-2 min-h-11 px-6 py-2.5 rounded-xl text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    aria-hidden="true"
                  />
                  Commissioning...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  Commission Piece
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
