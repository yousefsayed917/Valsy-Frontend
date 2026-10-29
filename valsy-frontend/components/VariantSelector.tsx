"use client";

import type { ProductVariantDto } from "@/types";

interface VariantSelectorProps {
  variants: ProductVariantDto[];
  selectedVariant: ProductVariantDto | null;
  onSelect: (variant: ProductVariantDto) => void;
}

const COLOR_SWATCH_MAP: Record<string, string> = {
  black: "#1c1a18",
  obsidian: "#1c1a18",
  white: "#f5efe6",
  ivory: "#f5efe6",
  cream: "#ede3d2",
  beige: "#d8c7b0",
  sand: "#cbb69b",
  camel: "#b88c5a",
  gold: "#d4af7a",
  brown: "#634832",
  espresso: "#3b2a1e",
  navy: "#233044",
  blue: "#3d5a78",
  green: "#4a6b53",
  sage: "#7d947e",
  olive: "#5d6344",
  red: "#8c3838",
  burgundy: "#5c2228",
  grey: "#78736e",
  gray: "#78736e",
  charcoal: "#3a3734",
};

function resolveColorHex(colorName: string): string {
  const key = colorName.trim().toLowerCase();
  return COLOR_SWATCH_MAP[key] || "#bfa582";
}

/**
 * Renders size and color pill selectors for a product with accessible state and 44px touch targets.
 */
export default function VariantSelector({
  variants,
  selectedVariant,
  onSelect,
}: VariantSelectorProps) {
  const sizes = [...new Set(variants.map((v) => v.size))];

  const colorsForSelectedSize = selectedVariant
    ? variants.filter((v) => v.size === selectedVariant.size)
    : [];

  const handleSizeClick = (size: string) => {
    const next =
      variants.find((v) => v.size === size && v.stock > 0) ||
      variants.find((v) => v.size === size);
    if (next) onSelect(next);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Size Pills */}
      {sizes.length > 0 && (
        <fieldset>
          <legend className="text-xs text-[#b8ada0] font-medium tracking-[0.14em] uppercase mb-3">
            Select Size{" "}
            {selectedVariant?.size && (
              <span className="text-[#e6c89c] font-semibold ml-1">
                — {selectedVariant.size}
              </span>
            )}
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {sizes.map((size) => {
              const isSelected = selectedVariant?.size === size;
              const hasStock = variants.some(
                (v) => v.size === size && v.stock > 0
              );

              return (
                <button
                  key={size}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleSizeClick(size)}
                  disabled={!hasStock}
                  title={!hasStock ? `${size} — Currently unavailable` : `Select size ${size}`}
                  className={`min-h-11 min-w-12 px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#d4af7a] border-[#e6c89c] text-[#12100e] font-semibold shadow-md shadow-[#d4af7a]/20"
                      : hasStock
                        ? "bg-[#1a1714] border-[#f5efe6]/12 text-[#f5efe6] hover:border-[#d4af7a]/50 hover:bg-[#231f1b]"
                        : "bg-[#15120f] border-[#f5efe6]/5 text-[#8c8073] line-through cursor-not-allowed opacity-50"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Color Pills */}
      {colorsForSelectedSize.length > 0 && (
        <fieldset>
          <legend className="text-xs text-[#b8ada0] font-medium tracking-[0.14em] uppercase mb-3">
            Select Colorway{" "}
            <span className="text-[#e6c89c] font-semibold ml-1">
              — {selectedVariant?.color}
            </span>
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {colorsForSelectedSize.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelect(variant)}
                  disabled={variant.stock === 0}
                  title={
                    variant.stock === 0
                      ? `${variant.color} — Out of stock`
                      : `${variant.color} (${variant.stock} available)`
                  }
                  className={`min-h-11 inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#d4af7a]/18 border-[#d4af7a] text-[#f5efe6] font-semibold shadow-sm"
                      : variant.stock > 0
                        ? "bg-[#1a1714] border-[#f5efe6]/12 text-[#b8ada0] hover:text-[#f5efe6] hover:border-[#d4af7a]/45 hover:bg-[#231f1b]"
                        : "bg-[#15120f] border-[#f5efe6]/5 text-[#8c8073] line-through cursor-not-allowed opacity-45"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="w-3.5 h-3.5 rounded-full border border-[#f5efe6]/30 flex-shrink-0"
                    style={{ backgroundColor: resolveColorHex(variant.color) }}
                  />
                  <span>{variant.color}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );
}
