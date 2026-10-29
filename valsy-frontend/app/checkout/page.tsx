"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { api } from "@/lib/api";
import { showToast } from "@/components/Toast";
import { validateCheckoutForm } from "@/lib/security";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  Loader2,
  User,
  MapPin,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { CheckoutFormData } from "@/types";

const SYSTEM_USER = "store-checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState<number>(0);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    addressLine1: "",
    city: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (touched[name]) {
        const errs = validateCheckoutForm(next);
        setFieldErrors((prevErrs) => {
          const updated = { ...prevErrs };
          if (errs[name]) updated[name] = errs[name];
          else delete updated[name];
          return updated;
        });
      }
      return next;
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validateCheckoutForm(form);
    setFieldErrors((prev) => {
      const updated = { ...prev };
      if (errs[name]) updated[name] = errs[name];
      else delete updated[name];
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (items.length === 0) {
      showToast("error", "Your shopping bag is empty.");
      return;
    }

    const errors = validateCheckoutForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        addressLine1: true,
        city: true,
        country: true,
      });
      showToast("error", "Please review the highlighted fields before placing your order.");
      return;
    }

    setSubmitting(true);
    try {
      // Step 1: Create customer profile
      setSubmitStep(1);
      const { customerId } = await api.createCustomer(form, SYSTEM_USER);

      // Step 2: Create order with line items
      setSubmitStep(2);
      const { orderId } = await api.createOrder(
        customerId,
        form.addressLine1,
        form.city,
        form.country,
        form.phoneNumber,
        SYSTEM_USER,
        items.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        }))
      );

      // Step 3: Submit order & deduct stock
      setSubmitStep(3);
      await api.submitOrder(orderId, SYSTEM_USER);

      clearCart();
      showToast("success", "Order confirmed! Preparing your atelier dispatch.");
      router.push(`/orders/${orderId}`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Unable to complete checkout.";
      showToast("error", msg);
    } finally {
      setSubmitting(false);
      setSubmitStep(0);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[75dvh] flex flex-col items-center justify-center gap-5 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#1a1714] border border-[#d4af7a]/30 flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-[#d4af7a]" aria-hidden="true" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-[#f5efe6]">
          Your Atelier Bag is Empty
        </h1>
        <Link
          href="/products"
          className="btn-luxury-gold min-h-11 px-6 py-2.5 rounded-xl text-sm inline-flex items-center gap-2"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  const sections = [
    {
      section: "Client Identity",
      subtitle: "Used for your order dossier and private courier updates.",
      icon: <User className="w-4 h-4 text-[#d4af7a]" aria-hidden="true" />,
      items: [
        {
          name: "firstName",
          label: "First Name",
          type: "text",
          autoComplete: "given-name",
          placeholder: "Camille",
        },
        {
          name: "lastName",
          label: "Last Name",
          type: "text",
          autoComplete: "family-name",
          placeholder: "Laurent",
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          autoComplete: "email",
          placeholder: "camille.laurent@domain.com",
          fullWidth: true,
        },
      ],
    },
    {
      section: "Destination & Concierge Contact",
      subtitle: "Where your signature garment box will be delivered.",
      icon: <MapPin className="w-4 h-4 text-[#d4af7a]" aria-hidden="true" />,
      items: [
        {
          name: "phoneNumber",
          label: "Telephone Number",
          type: "tel",
          autoComplete: "tel",
          placeholder: "+1 (555) 234-5678",
          fullWidth: true,
        },
        {
          name: "addressLine1",
          label: "Street Address & Suite",
          type: "text",
          autoComplete: "street-address",
          placeholder: "24 Rue du Faubourg Saint-Honoré",
          fullWidth: true,
        },
        {
          name: "city",
          label: "City",
          type: "text",
          autoComplete: "address-level2",
          placeholder: "Paris",
        },
        {
          name: "country",
          label: "Country / Region",
          type: "text",
          autoComplete: "country-name",
          placeholder: "France",
        },
      ],
    },
  ];

  const stepLabels = [
    "Registering client profile...",
    "Reserving atelier pieces...",
    "Confirming order dispatch...",
  ];

  return (
    <div className="min-h-dvh px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-10 pb-6 border-b border-[#f5efe6]/10">
          <Link
            href="/cart"
            aria-label="Return to shopping bag"
            className="w-10 h-10 rounded-xl bg-[#1a1714] border border-[#f5efe6]/12 flex items-center justify-center text-[#b8ada0] hover:text-[#f5efe6] hover:border-[#d4af7a]/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </Link>
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#d4af7a]">
              VALSY · Value You Deserve
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#f5efe6]">
              Valsy Checkout
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Form Sections */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {sections.map((section) => (
                <fieldset
                  key={section.section}
                  className="luxury-card rounded-3xl p-6 sm:p-7"
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    {section.icon}
                    <legend className="font-display text-2xl font-semibold text-[#f5efe6]">
                      {section.section}
                    </legend>
                  </div>
                  <p className="text-xs text-[#b8ada0] mb-6">
                    {section.subtitle}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {section.items.map((field) => {
                      const errorMsg = fieldErrors[field.name];
                      const inputId = `checkout-${field.name}`;
                      const errorId = `${inputId}-error`;
                      return (
                        <div
                          key={field.name}
                          className={field.fullWidth ? "sm:col-span-2" : ""}
                        >
                          <label
                            htmlFor={inputId}
                            className="block text-xs text-[#b8ada0] mb-1.5 font-medium"
                          >
                            {field.label}{" "}
                            <span className="text-[#d4af7a]" aria-hidden="true">
                              *
                            </span>
                          </label>
                          <input
                            id={inputId}
                            type={field.type}
                            name={field.name}
                            autoComplete={field.autoComplete}
                            placeholder={field.placeholder}
                            value={
                              (form as unknown as Record<string, string>)[
                                field.name
                              ]
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={Boolean(errorMsg)}
                            aria-describedby={errorMsg ? errorId : undefined}
                            required
                            className={`w-full min-h-11 px-3.5 py-2.5 rounded-xl bg-[#12100e] border text-[#f5efe6] placeholder-[#8c8073]/60 text-sm focus:outline-none transition-colors ${
                              errorMsg
                                ? "border-[#d46a6a] focus:border-[#e08585]"
                                : "border-[#f5efe6]/12 focus:border-[#d4af7a]"
                            }`}
                          />
                          {errorMsg && (
                            <p
                              id={errorId}
                              role="alert"
                              className="mt-1.5 text-xs text-[#e08585] flex items-center gap-1.5"
                            >
                              <AlertCircle
                                className="w-3.5 h-3.5 flex-shrink-0"
                                aria-hidden="true"
                              />
                              {errorMsg}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>

            {/* Right Order Dossier */}
            <div className="lg:col-span-5">
              <div className="luxury-card sticky top-24 rounded-3xl p-6 sm:p-7 flex flex-col gap-5">
                <h2 className="font-display text-2xl font-semibold text-[#f5efe6]">
                  Order Dossier
                </h2>

                <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={item.productVariantId}
                      className="flex justify-between items-start gap-3 text-sm pb-3 border-b border-[#f5efe6]/6 last:border-none last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="text-[#f5efe6] font-medium truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-[#b8ada0]">
                          {item.size} · {item.color} · Qty {item.quantity}
                        </p>
                      </div>
                      <span className="text-[#e6c89c] font-semibold tabular-nums flex-shrink-0">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#f5efe6]/10 pt-4 flex flex-col gap-2 text-sm">
                  <div className="flex justify-between text-[#b8ada0]">
                    <span>White-Glove Delivery</span>
                    <span className="text-[#98c9a5]">Complimentary</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2">
                    <span className="font-semibold text-[#f5efe6]">
                      Total Due
                    </span>
                    <span className="font-display text-3xl font-semibold text-[#e6c89c] tabular-nums">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Live 3-Step Submission Feedback */}
                {submitting && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="p-4 rounded-2xl bg-[#12100e] border border-[#d4af7a]/30 flex flex-col gap-2"
                  >
                    {stepLabels.map((label, idx) => {
                      const stepNum = idx + 1;
                      const isDone = submitStep > stepNum;
                      const isCurrent = submitStep === stepNum;
                      return (
                        <div
                          key={label}
                          className={`flex items-center gap-2.5 text-xs ${
                            isCurrent
                              ? "text-[#e6c89c] font-medium"
                              : isDone
                                ? "text-[#98c9a5]"
                                : "text-[#8c8073]"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          ) : isCurrent ? (
                            <Loader2
                              className="w-3.5 h-3.5 animate-spin"
                              aria-hidden="true"
                            />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full border border-[#8c8073]/40 inline-block" />
                          )}
                          <span>{label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-luxury-gold w-full min-h-12 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2
                        className="w-4 h-4 animate-spin"
                        aria-hidden="true"
                      />
                      Confirming Acquisition...
                    </>
                  ) : (
                    "Complete Acquisition"
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-[#8c8073]">
                  <ShieldCheck
                    className="w-4 h-4 text-[#d4af7a]"
                    aria-hidden="true"
                  />
                  <span>Protected by Valsy Client Assurance</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
