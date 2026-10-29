import type { ProductDto } from "@/types";
import Link from "next/link";
import { Layers, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";
import { ValsyMark } from "@/components/ValsyLogo";

interface ProductCardProps {
  product: ProductDto;
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

export default function ProductCard({ product }: ProductCardProps) {
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const inStock = totalStock > 0;
  const uniqueColors = [...new Set(product.variants.map((v) => v.color))].slice(0, 4);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-[#d4af7a]"
    >
      <article className="luxury-card-interactive h-full rounded-2xl p-5 flex flex-col gap-4 group-hover:-translate-y-1">
        {/* Top Metadata Row */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
              inStock
                ? "bg-[#6e9e7b]/12 border-[#6e9e7b]/35 text-[#98c9a5]"
                : "bg-[#d46a6a]/12 border-[#d46a6a]/35 text-[#e69a9a]"
            }`}
          >
            {inStock ? (
              <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
            ) : (
              <Clock className="w-3 h-3" aria-hidden="true" />
            )}
            {inStock ? "Available" : "Sold Out"}
          </span>

          <span className="text-xs text-[#b8ada0] inline-flex items-center gap-1 tabular-nums">
            <Layers className="w-3.5 h-3.5 text-[#d4af7a]" aria-hidden="true" />
            {product.variants.length}{" "}
            {product.variants.length === 1 ? "edition" : "editions"}
          </span>
        </div>

        {/* Lookbook Visual Frame */}
        <div className="relative w-full aspect-[4/4.3] rounded-xl overflow-hidden bg-gradient-to-b from-[#26211c] via-[#1d1915] to-[#15120f] border border-[#f5efe6]/8 flex flex-col items-center justify-center p-6">
          {/* Subtle architectural frame lines */}
          <div
            aria-hidden="true"
            className="absolute inset-3 rounded-lg border border-[#d4af7a]/15 pointer-events-none group-hover:border-[#d4af7a]/35 transition-colors duration-300"
          />
          <div
            aria-hidden="true"
            className="w-24 h-24 rounded-full bg-[#d4af7a]/[0.07] blur-2xl absolute"
          />

          <span
            aria-hidden="true"
            className="font-display italic text-6xl font-semibold text-[#e6c89c]/35 group-hover:text-[#e6c89c]/60 group-hover:scale-105 transition-all duration-300 select-none"
          >
            {product.name.charAt(0).toUpperCase()}
          </span>
          <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase text-[#8c8073]">
            <ValsyMark size={13} variant="gold" />
            VALSY
          </span>

          {/* Color Swatches Preview */}
          {uniqueColors.length > 0 && (
            <div
              className="absolute bottom-4 left-4 flex items-center gap-1.5"
              aria-label={`Available colors: ${uniqueColors.join(", ")}`}
            >
              {uniqueColors.map((c) => (
                <span
                  key={c}
                  title={c}
                  className="w-3 h-3 rounded-full border border-[#f5efe6]/30 shadow-sm"
                  style={{ backgroundColor: resolveColorHex(c) }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Title & Description */}
        <div className="flex flex-col gap-1.5 flex-1 pt-1">
          <h3 className="font-display text-xl font-semibold text-[#f5efe6] leading-snug line-clamp-2 group-hover:text-[#e6c89c] transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-[#b8ada0] text-xs line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Footer Price & CTA */}
        <div className="pt-3 border-t border-[#f5efe6]/8 flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#8c8073]">
              Price
            </span>
            <span className="text-[#e6c89c] font-semibold text-lg tabular-nums">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#b8ada0] group-hover:text-[#f5efe6] transition-colors">
            Explore
            <ArrowUpRight
              className="w-4 h-4 text-[#d4af7a] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              aria-hidden="true"
            />
          </span>
        </div>
      </article>
    </Link>
  );
}
