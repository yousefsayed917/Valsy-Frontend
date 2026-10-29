"use client";

import { useCart } from "@/components/CartProvider";
import Link from "next/link";
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Sparkles,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[75dvh] flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-20 h-20 rounded-3xl bg-[#1a1714] border border-[#d4af7a]/30 flex items-center justify-center">
          <ShoppingBag className="w-9 h-9 text-[#d4af7a]" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#d4af7a] mb-2">
            VALSY
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#f5efe6] mb-2">
            Your Shopping Bag is Empty
          </h1>
          <p className="text-[#b8ada0] text-sm max-w-md">
            Explore our seasonal silhouettes and select your preferred size and colorway to begin.
          </p>
        </div>
        <Link
          href="/products"
          className="btn-luxury-gold inline-flex items-center gap-2.5 min-h-12 px-7 py-3.5 rounded-xl text-sm"
        >
          Explore Collection <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-[#f5efe6]/10">
          <div className="flex items-center gap-3.5">
            <Link
              href="/products"
              aria-label="Back to collection"
              className="w-10 h-10 rounded-xl bg-[#1a1714] border border-[#f5efe6]/12 flex items-center justify-center text-[#b8ada0] hover:text-[#f5efe6] hover:border-[#d4af7a]/40 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </Link>
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-[#d4af7a]">
                VALSY · Value You Deserve
              </p>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#f5efe6]">
                  Your Shopping Bag
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#d4af7a]/15 border border-[#d4af7a]/35 text-[#e6c89c] text-xs font-semibold tabular-nums">
                  {totalItems} {totalItems === 1 ? "piece" : "pieces"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-[#b8ada0] hover:text-[#e08585] transition-colors underline cursor-pointer"
          >
            Empty Bag
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Bag Line Items */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.productVariantId}
                className="luxury-card flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Monogram Thumbnail */}
                  <Link
                    href={`/products/${item.productId}`}
                    className="w-18 h-18 rounded-xl bg-gradient-to-br from-[#26211c] to-[#15120f] border border-[#d4af7a]/25 flex items-center justify-center flex-shrink-0 hover:border-[#d4af7a] transition-colors"
                  >
                    <span className="font-display italic text-3xl font-semibold text-[#e6c89c]/50">
                      {item.productName.charAt(0)}
                    </span>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.productId}`}
                      className="font-display text-xl font-semibold text-[#f5efe6] hover:text-[#e6c89c] transition-colors truncate block"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-[#b8ada0] text-xs mt-1">
                      Size: <span className="text-[#f5efe6]">{item.size}</span> · Colorway:{" "}
                      <span className="text-[#f5efe6]">{item.color}</span>
                    </p>
                    <p className="text-[#d4af7a] font-medium text-xs mt-1.5 tabular-nums">
                      ${item.unitPrice.toFixed(2)} each
                    </p>
                  </div>
                </div>

                {/* Quantity, Subtotal & Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#f5efe6]/8">
                  <div className="flex items-center gap-1 bg-[#12100e] border border-[#f5efe6]/12 rounded-xl p-1">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.productName}`}
                      onClick={() =>
                        updateQuantity(item.productVariantId, item.quantity - 1)
                      }
                      className="w-8 h-8 rounded-lg text-[#b8ada0] hover:text-[#f5efe6] hover:bg-[#231f1b] transition-colors text-sm cursor-pointer"
                    >
                      −
                    </button>
                    <span className="w-7 text-center text-[#f5efe6] font-semibold text-sm tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.productName}`}
                      onClick={() =>
                        updateQuantity(item.productVariantId, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-lg text-[#b8ada0] hover:text-[#f5efe6] hover:bg-[#231f1b] transition-colors text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-[#e6c89c] font-semibold text-base w-20 text-right tabular-nums">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </p>

                  <button
                    type="button"
                    aria-label={`Remove ${item.productName} from bag`}
                    onClick={() => removeItem(item.productVariantId)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-[#8c8073] hover:text-[#e08585] hover:bg-[#d46a6a]/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="luxury-card sticky top-24 rounded-3xl p-6 sm:p-7 flex flex-col gap-5">
              <h2 className="font-display text-2xl font-semibold text-[#f5efe6]">
                Acquisition Summary
              </h2>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-[#b8ada0]">
                  <span>Subtotal ({totalItems} pieces)</span>
                  <span className="text-[#f5efe6] tabular-nums">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[#b8ada0]">
                  <span>White-Glove Courier</span>
                  <span className="text-[#98c9a5] font-medium">Complimentary</span>
                </div>
                <div className="flex justify-between text-[#b8ada0]">
                  <span>Signature Garment Box</span>
                  <span className="text-[#98c9a5] font-medium">Included</span>
                </div>
                <div className="border-t border-[#f5efe6]/10 pt-3.5 flex justify-between items-baseline">
                  <span className="text-[#f5efe6] font-semibold">Total</span>
                  <span className="font-display text-2xl font-semibold text-[#e6c89c] tabular-nums">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="btn-luxury-gold w-full min-h-12 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm"
              >
                Proceed to Private Checkout
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>

              <Link
                href="/products"
                className="text-center text-xs text-[#b8ada0] hover:text-[#f5efe6] transition-colors py-1"
              >
                Continue Exploring the Collection
              </Link>

              <div className="pt-4 border-t border-[#f5efe6]/8 flex flex-col gap-2 text-xs text-[#8c8073]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#d4af7a]" aria-hidden="true" />
                  <span>Encrypted client profile & stock reservation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#d4af7a]" aria-hidden="true" />
                  <span>Dispatched within 48 hours from our atelier</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d4af7a]" aria-hidden="true" />
                  <span>Complimentary size exchange within 30 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
