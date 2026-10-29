"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { OrderDto, OrderStatus } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  MapPin,
  Phone,
  ArrowRight,
  Check,
} from "lucide-react";

const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "Pending", label: "Created" },
  { key: "Submitted", label: "Submitted" },
  { key: "Paid", label: "Verified" },
  { key: "Shipped", label: "Dispatched" },
  { key: "Delivered", label: "Delivered" },
];

export default function OrderConfirmationPage() {
  const params = useParams();
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;
    const idNum = Number(params.id);
    if (!Number.isSafeInteger(idNum) || idNum <= 0) {
      setLoading(false);
      return;
    }

    api
      .getOrderById(idNum)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!order) {
    return (
      <div className="min-h-[70dvh] flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="font-display text-3xl text-[#f5efe6]">Order Dossier Not Found</h1>
        <Link
          href="/"
          className="btn-luxury-gold min-h-11 px-6 py-2.5 rounded-xl text-sm"
        >
          Return to Maison
        </Link>
      </div>
    );
  }

  const rawIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const stepIndex = rawIndex >= 0 ? rawIndex : 1;

  return (
    <div className="min-h-dvh px-4 sm:px-6 lg:px-8 py-14">
      <div className="max-w-2xl mx-auto">
        {/* Confirmation Header */}
        <div className="text-center mb-10">
          <div className="inline-flex w-20 h-20 rounded-full bg-[#6e9e7b]/15 border border-[#6e9e7b]/40 items-center justify-center mb-5">
            <CheckCircle2
              className="w-10 h-10 text-[#98c9a5]"
              aria-hidden="true"
            />
          </div>
          <p className="text-xs tracking-[0.22em] uppercase text-[#d4af7a] mb-2">
            VALSY · Value You Deserve
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#f5efe6] mb-3">
            Order Confirmed
          </h1>
          <p className="text-[#b8ada0] text-sm">
            Thank you for your patronage. Reference{" "}
            <span className="font-mono text-xs bg-[#1a1714] border border-[#d4af7a]/30 px-2.5 py-1 rounded-lg text-[#e6c89c] tabular-nums">
              #VL-{String(order.id).padStart(4, "0")}
            </span>
          </p>
        </div>

        {/* Status Progress Stepper */}
        <div className="luxury-card rounded-3xl p-6 sm:p-7 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-semibold text-[#b8ada0] uppercase tracking-[0.18em]">
              Atelier Fulfillment Status
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#d4af7a]/15 border border-[#d4af7a]/35 text-[#e6c89c]">
              {order.status}
            </span>
          </div>

          <div className="flex items-center">
            {STATUS_STEPS.map((step, i) => {
              const completed = i <= stepIndex;
              return (
                <div
                  key={step.key}
                  className="flex items-center flex-1 last:flex-none"
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors ${
                        completed
                          ? "bg-[#d4af7a] border-[#e6c89c] text-[#12100e]"
                          : "bg-[#12100e] border-[#f5efe6]/15 text-[#8c8073]"
                      }`}
                    >
                      {i < stepIndex ? (
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span
                      className={`text-[11px] text-center font-medium ${
                        completed ? "text-[#e6c89c]" : "text-[#8c8073]"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-1.5 mb-5 transition-colors ${
                        i < stepIndex ? "bg-[#d4af7a]" : "bg-[#f5efe6]/10"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Reserved Pieces Breakdown */}
        <div className="luxury-card rounded-3xl p-6 sm:p-7 mb-6 flex flex-col gap-5">
          <div className="flex items-center gap-2.5">
            <Package className="w-4 h-4 text-[#d4af7a]" aria-hidden="true" />
            <h2 className="font-display text-2xl font-semibold text-[#f5efe6]">
              Reserved Pieces
            </h2>
          </div>
          <div className="flex flex-col gap-3.5">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center text-sm pb-3 border-b border-[#f5efe6]/8 last:border-none last:pb-0"
              >
                <div>
                  <p className="text-[#f5efe6] font-medium">
                    {item.productName}
                  </p>
                  <p className="text-[#b8ada0] text-xs mt-0.5">
                    Size {item.size} · {item.color} · Qty {item.quantity}
                  </p>
                </div>
                <p className="text-[#e6c89c] font-semibold tabular-nums">
                  ${item.totalPrice.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-[#f5efe6]/10 pt-4 flex justify-between items-baseline">
            <span className="font-semibold text-[#f5efe6]">Total Paid</span>
            <span className="font-display text-2xl font-semibold text-[#e6c89c] tabular-nums">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Destination Details */}
        <div className="luxury-card rounded-3xl p-6 sm:p-7 mb-8 flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5 mb-1">
            <MapPin className="w-4 h-4 text-[#d4af7a]" aria-hidden="true" />
            <h2 className="font-display text-2xl font-semibold text-[#f5efe6]">
              Courier Destination
            </h2>
          </div>
          <p className="text-[#f5efe6] text-sm">{order.shippingAddressLine1}</p>
          <p className="text-[#b8ada0] text-sm">
            {order.shippingCity}, {order.shippingCountry}
          </p>
          <div className="flex items-center gap-2 text-[#b8ada0] text-xs mt-1">
            <Phone className="w-3.5 h-3.5 text-[#d4af7a]" aria-hidden="true" />
            <span className="tabular-nums">{order.contactPhone}</span>
          </div>
        </div>

        <Link
          href="/products"
          className="btn-luxury-gold w-full min-h-12 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm"
        >
          Continue Exploring the Collection
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
