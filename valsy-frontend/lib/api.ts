import type { ProductDto, OrderDto, CheckoutFormData, ProductCatalogDto } from "@/types";
import {
  assertSafeId,
  createIdempotencyKey,
  normalizeErrorMessage,
  sanitizeText,
} from "@/lib/security";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7156";
const DEFAULT_TIMEOUT_MS = 12_000;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  const method = (options?.method || "GET").toUpperCase();
  const isMutating = method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE";

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options?.body ? { "Content-Type": "application/json" } : {}),
    ...(isMutating ? { "X-Idempotency-Key": createIdempotencyKey() } : {}),
    ...(options?.headers as Record<string, string> | undefined),
  };

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      signal: options?.signal ?? controller.signal,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const rawMessage =
        body?.message ||
        body?.title ||
        (Array.isArray(body?.errors) ? body.errors.join(", ") : null) ||
        `Request failed (${res.status})`;
      throw new Error(sanitizeText(String(rawMessage), 240));
    }

    if (res.status === 204) return undefined as T;

    const text = await res.text();
    if (!text) return undefined as T;
    return JSON.parse(text) as T;
  } catch (err: unknown) {
    throw new Error(normalizeErrorMessage(err));
  } finally {
    clearTimeout(timeoutId);
  }
}

// ─── Products ─────────────────────────────────────────────────────────────────

export const api = {
  // Store
  getProducts: (params?: {
    search?: string;
    size?: string;
    color?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("searchTerm", sanitizeText(params.search, 120));
    if (params?.size) searchParams.append("size", sanitizeText(params.size, 50));
    if (params?.color) searchParams.append("color", sanitizeText(params.color, 50));
    if (params?.minPrice !== undefined && Number.isFinite(params.minPrice) && params.minPrice >= 0) {
      searchParams.append("minPrice", params.minPrice.toString());
    }
    if (params?.maxPrice !== undefined && Number.isFinite(params.maxPrice) && params.maxPrice >= 0) {
      searchParams.append("maxPrice", params.maxPrice.toString());
    }

    const query = searchParams.toString();
    return request<ProductCatalogDto>(`/api/products${query ? `?${query}` : ""}`);
  },

  getProductById: (id: number): Promise<ProductDto | null> => {
    const safeId = assertSafeId(id, "Product");
    return request<ProductDto>(`/api/products/${safeId}`);
  },

  // Admin
  getAdminProducts: (searchTerm?: string): Promise<ProductDto[]> => {
    const clean = searchTerm ? sanitizeText(searchTerm, 120) : "";
    const qs = clean ? `?searchTerm=${encodeURIComponent(clean)}` : "";
    return request<ProductDto[]>(`/api/admin/products${qs}`);
  },

  createProduct: async (
    name: string,
    description: string,
    price: number,
    requestedBy: string,
    variants: { size: string; color: string; stock: number; image?: string }[]
  ): Promise<{ productId?: number }> => {
    const cleanName = sanitizeText(name, 200);
    const cleanDesc = sanitizeText(description, 1000);
    const cleanUser = sanitizeText(requestedBy, 100) || "admin";
    const cleanVariants = variants.map((v) => ({
      size: sanitizeText(v.size, 50),
      color: sanitizeText(v.color, 100),
      stock: Math.max(0, Math.floor(Number(v.stock) || 0)),
      ...(v.image ? { image: sanitizeText(v.image, 500) } : {}),
    }));

    const result = await request<{ productId?: number } | undefined>("/api/admin/products", {
      method: "POST",
      body: JSON.stringify({
        name: cleanName,
        description: cleanDesc,
        price: Number(price),
        requestedBy: cleanUser,
        variants: cleanVariants,
      }),
    });

    return result ?? {};
  },

  createProductVariant: (
    productId: number,
    size: string,
    color: string,
    stock: number,
    requestedBy: string
  ): Promise<{ variantId: number }> => {
    const safeProductId = assertSafeId(productId, "Product");
    return request(`/api/admin/products/${safeProductId}/variants`, {
      method: "POST",
      body: JSON.stringify({
        size: sanitizeText(size, 50),
        color: sanitizeText(color, 100),
        stock: Math.max(0, Math.floor(Number(stock) || 0)),
        requestedBy: sanitizeText(requestedBy, 100) || "admin",
      }),
    });
  },

  adjustStock: (
    variantId: number,
    newStock: number,
    requestedBy: string
  ): Promise<void> => {
    const safeVariantId = assertSafeId(variantId, "Variant");
    return request(`/api/admin/products/variants/${safeVariantId}/stock`, {
      method: "PUT",
      body: JSON.stringify({
        newStock: Math.max(0, Math.floor(Number(newStock) || 0)),
        requestedBy: sanitizeText(requestedBy, 100) || "admin",
      }),
    });
  },

  // ─── Customers ──────────────────────────────────────────────────────────────

  createCustomer: (
    data: CheckoutFormData,
    requestedBy: string
  ): Promise<{ customerId: number }> =>
    request("/api/customers", {
      method: "POST",
      body: JSON.stringify({
        firstName: sanitizeText(data.firstName, 100),
        lastName: sanitizeText(data.lastName, 100),
        email: sanitizeText(data.email, 254).toLowerCase(),
        phoneNumber: sanitizeText(data.phoneNumber, 25),
        addressLine1: sanitizeText(data.addressLine1, 200),
        city: sanitizeText(data.city, 100),
        country: sanitizeText(data.country, 100),
        requestedBy: sanitizeText(requestedBy, 100) || "store-checkout",
      }),
    }),

  // ─── Orders ─────────────────────────────────────────────────────────────────

  createOrder: (
    customerId: number,
    shippingAddressLine1: string,
    shippingCity: string,
    shippingCountry: string,
    contactPhone: string,
    requestedBy: string,
    items: { productVariantId: number; quantity: number }[]
  ): Promise<{ orderId: number }> => {
    const safeCustomerId = assertSafeId(customerId, "Customer");
    return request("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        customerId: safeCustomerId,
        shippingAddressLine1: sanitizeText(shippingAddressLine1, 200),
        shippingCity: sanitizeText(shippingCity, 100),
        shippingCountry: sanitizeText(shippingCountry, 100),
        contactPhone: sanitizeText(contactPhone, 25),
        requestedBy: sanitizeText(requestedBy, 100) || "store-checkout",
        items: items.map((item) => ({
          productVariantId: assertSafeId(item.productVariantId, "Variant"),
          quantity: Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1))),
        })),
      }),
    });
  },

  addOrderItem: (
    orderId: number,
    productId: number,
    productVariantId: number,
    quantity: number,
    requestedBy: string
  ): Promise<void> => {
    const safeOrderId = assertSafeId(orderId, "Order");
    return request(`/api/orders/${safeOrderId}/items`, {
      method: "POST",
      body: JSON.stringify({
        productId: assertSafeId(productId, "Product"),
        productVariantId: assertSafeId(productVariantId, "Variant"),
        quantity: Math.max(1, Math.min(99, Math.floor(Number(quantity) || 1))),
        requestedBy: sanitizeText(requestedBy, 100) || "store-checkout",
      }),
    });
  },

  submitOrder: (orderId: number, requestedBy: string): Promise<void> => {
    const safeOrderId = assertSafeId(orderId, "Order");
    return request(`/api/orders/${safeOrderId}/submit`, {
      method: "POST",
      body: JSON.stringify({
        requestedBy: sanitizeText(requestedBy, 100) || "store-checkout",
      }),
    });
  },

  getOrderById: (id: number): Promise<OrderDto> => {
    const safeId = assertSafeId(id, "Order");
    return request<OrderDto>(`/api/orders/${safeId}`);
  },
};
