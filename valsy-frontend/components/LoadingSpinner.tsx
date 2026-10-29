export default function LoadingSpinner({
  size = "md",
  label = "Loading content...",
}: {
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-[2.5px]",
  };
  return (
    <div
      role="status"
      aria-label={label}
      className="flex flex-col items-center justify-center w-full py-12 gap-3"
    >
      <div
        className={`${sizes[size]} rounded-full border-[#f5efe6]/12 border-t-[#d4af7a] animate-spin`}
      />
      {size === "lg" && (
        <span className="text-xs tracking-[0.18em] uppercase text-[#b8ada0]">
          Loading Valsy Collection
        </span>
      )}
    </div>
  );
}
