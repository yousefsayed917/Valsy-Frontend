import React from "react";

interface ValsyLogoProps {
  className?: string;
  size?: number;
  variant?: "gold" | "light" | "dark";
}

/**
 * Official VALSY geometric interwoven 'V' emblem SVG component.
 */
export function ValsyMark({
  className = "",
  size = 36,
  variant = "gold",
}: ValsyLogoProps) {
  const fill =
    variant === "gold"
      ? "url(#valsy-gold-grad)"
      : variant === "light"
        ? "#f5efe6"
        : "#12100e";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 185"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="valsy-gold-grad"
          x1="20"
          y1="15"
          x2="180"
          y2="175"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#F3DEC0" />
          <stop offset="50%" stopColor="#D4AF7A" />
          <stop offset="100%" stopColor="#A8824C" />
        </linearGradient>
      </defs>

      {/* Main continuous ribbon: Left wing -> Bottom U-apex -> Center diagonal stem -> Top triangle loop */}
      <path
        d="M 24 64 L 52 64 L 93 135 C 96.5 141 103.5 141 107 135 C 110.5 129 110.5 122 107 116 L 67 47 C 59 33 69 16 85 16 L 115 16 C 131 16 141 33 133 47 L 111 85 L 97 61 L 109 40 C 110.5 37.5 108.8 34 106 34 L 94 34 C 91.2 34 89.5 37.5 91 40 L 131 109 C 141 126 135 148 118 158 C 107 164.5 93 164.5 82 158 C 75 154 69 147 65 140 L 24 64 Z"
        fill={fill}
      />

      {/* Right diagonal wing with parallel angled inner slice */}
      <path
        d="M 148 64 L 176 64 L 136 133 L 122 109 L 148 64 Z"
        fill={fill}
      />
    </svg>
  );
}

export default function ValsyLogo({
  showTagline = true,
  subLabel,
  markSize = 38,
}: {
  showTagline?: boolean;
  subLabel?: string;
  markSize?: number;
}) {
  return (
    <div className="inline-flex items-center gap-3 select-none">
      <div className="relative flex items-center justify-center rounded-xl border border-[#d4af7a]/35 bg-gradient-to-b from-[#231f1b] to-[#14110e] p-1.5 shadow-md group-hover:border-[#d4af7a] transition-colors">
        <ValsyMark size={markSize} variant="gold" />
      </div>
      <div className="flex flex-col">
        <span
          className="text-[#f5efe6] font-bold text-xl sm:text-2xl tracking-[0.18em] leading-none"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          VALSY
        </span>
        {showTagline && (
          <span className="text-[10px] text-[#d4af7a] tracking-[0.16em] uppercase mt-1 font-medium">
            {subLabel || "Value you deserve"}
          </span>
        )}
      </div>
    </div>
  );
}

