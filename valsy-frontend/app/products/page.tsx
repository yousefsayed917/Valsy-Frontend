"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { ProductDto, ProductFiltersDto } from "@/types";
import {
  Search,
  SlidersHorizontal,
  X,
  AlertCircle,
  RefreshCw,
  Compass,
  ArrowUpDown,
  Check,
} from "lucide-react";

type SortOption = "featured" | "price-asc" | "price-desc" | "name-asc";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [availableFilters, setAvailableFilters] =
    useState<ProductFiltersDto | null>(null);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Filter & Sort states
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedMinPrice, setSelectedMinPrice] = useState<string>("");
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const fetchProducts = useCallback(
    (overrides?: {
      search?: string;
      size?: string;
      color?: string;
      minPrice?: string;
      maxPrice?: string;
    }) => {
      const activeSearch = overrides?.search !== undefined ? overrides.search : search;
      const activeSize = overrides?.size !== undefined ? overrides.size : selectedSize;
      const activeColor = overrides?.color !== undefined ? overrides.color : selectedColor;
      const activeMin = overrides?.minPrice !== undefined ? overrides.minPrice : selectedMinPrice;
      const activeMax = overrides?.maxPrice !== undefined ? overrides.maxPrice : selectedMaxPrice;

      setLoading(true);
      setError(null);
      api
        .getProducts({
          search: activeSearch || undefined,
          size: activeSize || undefined,
          color: activeColor || undefined,
          minPrice: activeMin ? Number(activeMin) : undefined,
          maxPrice: activeMax ? Number(activeMax) : undefined,
        })
        .then((res) => {
          setProducts(res.products);
          setAvailableFilters(res.filters);
        })
        .catch((e: unknown) =>
          setError(e instanceof Error ? e.message : "Unable to load catalog")
        )
        .finally(() => setLoading(false));
    },
    [search, selectedSize, selectedColor, selectedMinPrice, selectedMaxPrice]
  );

  useEffect(() => {
    fetchProducts();
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(inputValue.trim());
  };

  const applyFilters = () => {
    setShowFilters(false);
    fetchProducts();
  };

  const clearAllFilters = () => {
    setSelectedSize("");
    setSelectedColor("");
    setSelectedMinPrice("");
    setSelectedMaxPrice("");
    setInStockOnly(false);
    setSearch("");
    setInputValue("");
    fetchProducts({
      search: "",
      size: "",
      color: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  const displayedProducts = useMemo(() => {
    let list = [...products];
    if (inStockOnly) {
      list = list.filter((p) => p.variants.some((v) => v.stock > 0));
    }
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [products, inStockOnly, sortBy]);

  const activeFilterCount = [
    selectedSize,
    selectedColor,
    selectedMinPrice,
    selectedMaxPrice,
    inStockOnly ? "stock" : "",
  ].filter(Boolean).length;

  return (
    <div className="min-h-dvh px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#f5efe6]/10">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#d4af7a] mb-2">
              VALSY · Value You Deserve
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#f5efe6]">
              All Products
            </h1>
          </div>
          <p className="text-[#b8ada0] text-sm tabular-nums" aria-live="polite">
            {loading
              ? "Updating catalog..."
              : `Showing ${displayedProducts.length} ${
                  displayedProducts.length === 1 ? "piece" : "pieces"
                }`}
          </p>
        </div>

        {/* Search, Sort & Filter Controls Bar */}
        <div className="mb-6 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <form onSubmit={handleSearch} className="flex gap-2.5 flex-1 max-w-xl">
            <div className="relative flex-1">
              <label htmlFor="catalog-search" className="sr-only">
                Search pieces by name or material
              </label>
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8073]"
                aria-hidden="true"
              />
              <input
                id="catalog-search"
                type="search"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search silhouettes, wool, cashmere..."
                className="w-full min-h-11 pl-10 pr-9 py-2.5 rounded-xl bg-[#1a1714] border border-[#f5efe6]/12 text-[#f5efe6] placeholder-[#8c8073] text-sm focus:outline-none focus:border-[#d4af7a] transition-colors"
              />
              {inputValue && (
                <button
                  type="button"
                  aria-label="Clear search query"
                  onClick={() => {
                    setInputValue("");
                    if (search) setSearch("");
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md flex items-center justify-center text-[#b8ada0] hover:text-[#f5efe6]"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="min-h-11 px-5 py-2.5 rounded-xl bg-[#231f1b] hover:bg-[#2b2621] border border-[#f5efe6]/12 text-[#f5efe6] text-sm font-medium transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* In-Stock Quick Toggle */}
            <button
              type="button"
              aria-pressed={inStockOnly}
              onClick={() => setInStockOnly((v) => !v)}
              className={`inline-flex items-center gap-2 min-h-11 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${
                inStockOnly
                  ? "bg-[#6e9e7b]/18 border-[#6e9e7b]/50 text-[#98c9a5]"
                  : "bg-[#1a1714] border-[#f5efe6]/12 text-[#b8ada0] hover:text-[#f5efe6]"
              }`}
            >
              <Check
                className={`w-4 h-4 ${inStockOnly ? "opacity-100" : "opacity-40"}`}
                aria-hidden="true"
              />
              Available Only
            </button>

            {/* Sort Select */}
            <div className="relative flex items-center">
              <label htmlFor="catalog-sort" className="sr-only">
                Sort products
              </label>
              <ArrowUpDown
                className="w-4 h-4 text-[#d4af7a] absolute left-3.5 pointer-events-none"
                aria-hidden="true"
              />
              <select
                id="catalog-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="min-h-11 pl-9 pr-8 py-2.5 rounded-xl bg-[#1a1714] border border-[#f5efe6]/12 text-[#f5efe6] text-sm font-medium focus:outline-none focus:border-[#d4af7a] cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>

            {/* Filter Drawer Toggle */}
            <button
              type="button"
              aria-expanded={showFilters}
              onClick={() => setShowFilters((s) => !s)}
              className={`inline-flex items-center gap-2 min-h-11 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${
                showFilters || activeFilterCount > 0
                  ? "bg-[#d4af7a] text-[#12100e] border-[#e6c89c] font-semibold"
                  : "bg-[#1a1714] hover:bg-[#231f1b] text-[#f5efe6] border-[#f5efe6]/12"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
              Refinements
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#12100e] text-[#e6c89c] text-xs flex items-center justify-center tabular-nums">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(search ||
          selectedSize ||
          selectedColor ||
          selectedMinPrice ||
          selectedMaxPrice) && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#8c8073] mr-1">Active:</span>
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setInputValue("");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#231f1b] border border-[#d4af7a]/30 text-xs text-[#e6c89c]"
              >
                Query: “{search}”
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
            {selectedSize && (
              <button
                type="button"
                onClick={() => {
                  setSelectedSize("");
                  fetchProducts({ size: "" });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#231f1b] border border-[#d4af7a]/30 text-xs text-[#e6c89c]"
              >
                Size: {selectedSize}
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
            {selectedColor && (
              <button
                type="button"
                onClick={() => {
                  setSelectedColor("");
                  fetchProducts({ color: "" });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#231f1b] border border-[#d4af7a]/30 text-xs text-[#e6c89c]"
              >
                Color: {selectedColor}
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
            {(selectedMinPrice || selectedMaxPrice) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedMinPrice("");
                  setSelectedMaxPrice("");
                  fetchProducts({ minPrice: "", maxPrice: "" });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#231f1b] border border-[#d4af7a]/30 text-xs text-[#e6c89c]"
              >
                Price: ${selectedMinPrice || "0"} – ${selectedMaxPrice || "Any"}
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-[#b8ada0] hover:text-[#f5efe6] underline ml-2 cursor-pointer"
            >
              Reset all
            </button>
          </div>
        )}

        {/* Collapsible Filters Panel */}
        {showFilters && availableFilters && (
          <div className="luxury-card mb-8 p-6 sm:p-8 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl font-semibold text-[#f5efe6]">
                Refine Selection
              </h2>
              <button
                type="button"
                aria-label="Close refinements panel"
                onClick={() => setShowFilters(false)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#b8ada0] hover:text-[#f5efe6] hover:bg-[#231f1b] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
              {/* Sizes */}
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#b8ada0] mb-3">
                  Size
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSize("")}
                    className={`min-h-10 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors border cursor-pointer ${
                      !selectedSize
                        ? "bg-[#d4af7a] border-[#e6c89c] text-[#12100e] font-semibold"
                        : "bg-[#12100e] border-[#f5efe6]/12 text-[#b8ada0] hover:text-[#f5efe6]"
                    }`}
                  >
                    All
                  </button>
                  {availableFilters.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-h-10 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors border cursor-pointer ${
                        selectedSize === size
                          ? "bg-[#d4af7a] border-[#e6c89c] text-[#12100e] font-semibold"
                          : "bg-[#12100e] border-[#f5efe6]/12 text-[#b8ada0] hover:text-[#f5efe6]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#b8ada0] mb-3">
                  Colorway
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedColor("")}
                    className={`min-h-10 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors border cursor-pointer ${
                      !selectedColor
                        ? "bg-[#d4af7a] border-[#e6c89c] text-[#12100e] font-semibold"
                        : "bg-[#12100e] border-[#f5efe6]/12 text-[#b8ada0] hover:text-[#f5efe6]"
                    }`}
                  >
                    All
                  </button>
                  {availableFilters.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`min-h-10 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors border capitalize cursor-pointer ${
                        selectedColor === color
                          ? "bg-[#d4af7a] border-[#e6c89c] text-[#12100e] font-semibold"
                          : "bg-[#12100e] border-[#f5efe6]/12 text-[#b8ada0] hover:text-[#f5efe6]"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#b8ada0] mb-3">
                  Price Range (USD)
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label htmlFor="min-price-input" className="sr-only">
                      Minimum Price
                    </label>
                    <input
                      id="min-price-input"
                      type="number"
                      min="0"
                      placeholder="Min ($)"
                      value={selectedMinPrice}
                      onChange={(e) => setSelectedMinPrice(e.target.value)}
                      className="w-full min-h-11 px-3.5 py-2 rounded-xl bg-[#12100e] border border-[#f5efe6]/12 text-[#f5efe6] text-sm focus:outline-none focus:border-[#d4af7a] tabular-nums"
                    />
                  </div>
                  <span className="text-[#8c8073]" aria-hidden="true">
                    —
                  </span>
                  <div className="flex-1">
                    <label htmlFor="max-price-input" className="sr-only">
                      Maximum Price
                    </label>
                    <input
                      id="max-price-input"
                      type="number"
                      min="0"
                      placeholder="Max ($)"
                      value={selectedMaxPrice}
                      onChange={(e) => setSelectedMaxPrice(e.target.value)}
                      className="w-full min-h-11 px-3.5 py-2 rounded-xl bg-[#12100e] border border-[#f5efe6]/12 text-[#f5efe6] text-sm focus:outline-none focus:border-[#d4af7a] tabular-nums"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-5 border-t border-[#f5efe6]/10">
              <button
                type="button"
                onClick={clearAllFilters}
                className="min-h-11 px-5 py-2 rounded-xl text-sm font-medium text-[#b8ada0] hover:text-[#f5efe6] transition-colors cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={applyFilters}
                className="btn-luxury-gold min-h-11 px-6 py-2 rounded-xl text-sm cursor-pointer"
              >
                Apply Refinements
              </button>
            </div>
          </div>
        )}

        {/* Catalog Grid / States */}
        {loading ? (
          <LoadingSpinner size="lg" />
        ) : error ? (
          <div
            role="alert"
            className="luxury-card rounded-3xl p-12 max-w-xl mx-auto my-8 flex flex-col items-center text-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#d46a6a]/15 border border-[#d46a6a]/35 flex items-center justify-center">
              <AlertCircle
                className="w-7 h-7 text-[#e08585]"
                aria-hidden="true"
              />
            </div>
            <h2 className="font-display text-2xl font-semibold text-[#f5efe6]">
              Atelier Connection Unavailable
            </h2>
            <p className="text-[#b8ada0] text-sm leading-relaxed">{error}</p>
            <button
              type="button"
              onClick={() => fetchProducts()}
              className="btn-luxury-gold inline-flex items-center gap-2 min-h-11 px-6 py-2.5 rounded-xl text-sm mt-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Retry Connection
            </button>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="luxury-card rounded-3xl p-12 max-w-xl mx-auto my-8 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#231f1b] border border-[#d4af7a]/30 flex items-center justify-center">
              <Compass
                className="w-7 h-7 text-[#d4af7a]"
                aria-hidden="true"
              />
            </div>
            <h2 className="font-display text-2xl font-semibold text-[#f5efe6]">
              No Matching Pieces Found
            </h2>
            <p className="text-[#b8ada0] text-sm">
              No garments match your current search or filter criteria. Reset refinements to view the full collection.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="btn-luxury-gold min-h-11 px-6 py-2.5 rounded-xl text-sm mt-2 cursor-pointer"
            >
              View All Pieces
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
