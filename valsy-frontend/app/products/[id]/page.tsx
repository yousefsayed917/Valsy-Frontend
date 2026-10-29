"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useCart } from "@/components/CartProvider";
import { showToast } from "@/components/Toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import VariantSelector from "@/components/VariantSelector";
import { ValsyMark } from "@/components/ValsyLogo";
import type { ProductDto, ProductVariantDto } from "@/types";
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantDto | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    const idNum = Number(params.id);
    if (!Number.isSafeInteger(idNum) || idNum <= 0) {
      setLoading(false);
      return;
    }

    api
      .getProductById(idNum)
      .then((p) => {
        setProduct(p);
        if (p?.variants?.length) {
          const inStock =
            p.variants.find((v) => v.stock > 0) || p.variants[0];
          setSelectedVariant(inStock);
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [params?.id]);

  // Clamp quantity when switching to a variant with lower stock
  useEffect(() => {
    if (selectedVariant && selectedVariant.stock > 0 && quantity > selectedVariant.stock) {
      setQuantity(selectedVariant.stock);
    }
  }, [selectedVariant, quantity]);

  if (loading) return <LoadingSpinner size="lg" />;

  if (!product) {
    return (
      <div className="min-h-[70dvh] flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="font-display text-3xl text-[#f5efe6]">Piece Not Found</h1>
        <p className="text-[#b8ada0] text-sm">
          This piece may have been archived or removed from the collection.
        </p>
        <Link
          href="/products"
          className="btn-luxury-gold min-h-11 px-6 py-2.5 rounded-xl text-sm inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Return to Collection
        </Link>
      </div>
    );
  }

  const maxAvailable = selectedVariant ? Math.max(1, selectedVariant.stock) : 1;

  const handleAddToCart = (redirectToCheckout = false) => {
    if (!selectedVariant) return;
    if (selectedVariant.stock < quantity) {
      showToast("error", "Requested quantity exceeds available atelier stock.");
      return;
    }
    setAdding(true);
    addItem({
      productId: product.id,
      productVariantId: selectedVariant.id,
      productName: product.name,
      size: selectedVariant.size,
      color: selectedVariant.color,
      unitPrice: product.price,
      quantity,
    });
    showToast("success", `${product.name} (${selectedVariant.size} / ${selectedVariant.color}) added to bag.`);
    if (redirectToCheckout) {
      router.push("/checkout");
    } else {
      setTimeout(() => setAdding(false), 500);
    }
  };

  return (
    <div className="min-h-dvh px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-[#b8ada0] mb-8"
        >
          <Link href="/" className="hover:text-[#f5efe6] transition-colors">
            Valsy
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#8c8073]" aria-hidden="true" />
          <Link
            href="/products"
            className="hover:text-[#f5efe6] transition-colors"
          >
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#8c8073]" aria-hidden="true" />
          <span className="text-[#e6c89c] truncate max-w-xs" aria-current="page">
            {product.name}
          </span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left: Editorial Visual Frame */}
          <div className="lg:col-span-6">
            <div className="luxury-card relative aspect-[4/4.5] rounded-3xl p-8 flex flex-col justify-between overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute inset-5 rounded-2xl border border-[#d4af7a]/20 pointer-events-none"
              />
              <div className="relative flex items-center justify-between text-xs text-[#b8ada0]">
                <span className="inline-flex items-center gap-2 uppercase tracking-[0.2em] text-[#d4af7a] font-medium">
                  <ValsyMark size={18} variant="gold" />
                  VALSY · Value you deserve
                </span>
                {selectedVariant && (
                  <span className="px-3 py-1 rounded-full bg-[#12100e]/80 border border-[#f5efe6]/10">
                    {selectedVariant.color} · {selectedVariant.size}
                  </span>
                )}
              </div>

              <div className="my-auto text-center select-none">
                <span className="font-display italic text-[130px] sm:text-[160px] font-semibold text-[#e6c89c]/30 leading-none block">
                  {product.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-xs tracking-[0.26em] uppercase text-[#8c8073]">
                  Signature Silhouette
                </span>
              </div>

              <div className="relative flex items-center justify-between text-xs text-[#8c8073] pt-4 border-t border-[#f5efe6]/8">
                <span>Ref. VL-{String(product.id).padStart(4, "0")}</span>
                <span>Small-Batch Tailoring</span>
              </div>
            </div>
          </div>

          {/* Right: Details & Acquisition Controls */}
          <div className="lg:col-span-6 flex flex-col gap-7">
            <div className="border-b border-[#f5efe6]/10 pb-6">
              <p className="text-xs tracking-[0.2em] uppercase text-[#d4af7a] mb-2">
                Valsy Collection
              </p>
              <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#f5efe6] mb-3 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3 mt-4">
                <span className="font-display text-3xl font-semibold text-[#e6c89c] tabular-nums">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs text-[#8c8073]">
                  Includes complimentary white-glove shipping
                </span>
              </div>
              {product.description && (
                <p className="text-[#b8ada0] text-sm sm:text-base leading-relaxed mt-5">
                  {product.description}
                </p>
              )}
            </div>

            {/* Variant Selector */}
            {product.variants.length > 0 && (
              <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelect={setSelectedVariant}
              />
            )}

            {/* Live Stock Status */}
            {selectedVariant && (
              <div
                aria-live="polite"
                className="flex items-center gap-2.5 text-sm"
              >
                {selectedVariant.stock > 5 ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6e9e7b]/12 border border-[#6e9e7b]/35 text-[#98c9a5] text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    In Atelier Stock ({selectedVariant.stock} available)
                  </span>
                ) : selectedVariant.stock > 0 ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d99b52]/15 border border-[#d99b52]/40 text-[#eab676] text-xs font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                    Limited Availability — Only {selectedVariant.stock} left
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d46a6a]/15 border border-[#d46a6a]/40 text-[#e69a9a] text-xs font-medium">
                    Currently Sold Out in this Size/Colorway
                  </span>
                )}
              </div>
            )}

            {/* Quantity Stepper & Primary Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <div className="flex items-center justify-between sm:justify-start gap-3 bg-[#1a1714] border border-[#f5efe6]/12 rounded-xl px-3 py-1.5">
                <span className="text-xs uppercase tracking-wider text-[#b8ada0] pl-1">
                  Qty
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-[#f5efe6] hover:bg-[#231f1b] disabled:opacity-35 transition-colors cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-9 text-center text-[#f5efe6] font-semibold text-sm tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={quantity >= maxAvailable}
                    onClick={() =>
                      setQuantity((q) => Math.min(maxAvailable, q + 1))
                    }
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-[#f5efe6] hover:bg-[#231f1b] disabled:opacity-35 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAddToCart(false)}
                disabled={
                  !selectedVariant || selectedVariant.stock === 0 || adding
                }
                className="btn-luxury-gold flex-1 min-h-12 py-3.5 px-6 rounded-xl flex items-center justify-center gap-2.5 text-sm disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                {adding ? "Added to Bag" : "Add to Bag"}
              </button>

              <button
                type="button"
                onClick={() => handleAddToCart(true)}
                disabled={
                  !selectedVariant || selectedVariant.stock === 0 || adding
                }
                className="min-h-12 py-3.5 px-6 rounded-xl border border-[#d4af7a]/40 bg-[#1a1714] hover:bg-[#231f1b] text-[#e6c89c] font-semibold text-sm transition-colors disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
              >
                Acquire Now
              </button>
            </div>

            {/* Atelier Assurances */}
            <div className="grid sm:grid-cols-3 gap-3 pt-6 border-t border-[#f5efe6]/10 text-xs text-[#b8ada0]">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#1a1714]/70 border border-[#f5efe6]/6">
                <Truck className="w-4 h-4 text-[#d4af7a] flex-shrink-0" aria-hidden="true" />
                <span>Complimentary Express Courier</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#1a1714]/70 border border-[#f5efe6]/6">
                <ShieldCheck className="w-4 h-4 text-[#d4af7a] flex-shrink-0" aria-hidden="true" />
                <span>14-Point Quality Inspection</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#1a1714]/70 border border-[#f5efe6]/6">
                <Sparkles className="w-4 h-4 text-[#d4af7a] flex-shrink-0" aria-hidden="true" />
                <span>Signature Gift Presentation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
