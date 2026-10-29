// ─── Product Types ─────────────────────────────────────────────────────────────

export interface ProductVariantDto {
  id: number;
  size: string;
  color: string;
  stock: number;
}

export interface ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  variants: ProductVariantDto[];
}

// ─── Order Types ───────────────────────────────────────────────────────────────

export type OrderStatus =
  | "Pending"
  | "Submitted"
  | "Paid"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface OrderItemDto {
  id: number;
  orderId: number;
  productId: number;
  productVariantId: number;
  productName: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderDto {
  id: number;
  customerId: number;
  status: OrderStatus;
  shippingAddressLine1: string;
  shippingCity: string;
  shippingCountry: string;
  contactPhone: string;
  totalAmount: number;
  items: OrderItemDto[];
}

// ─── Cart (client-side only) ───────────────────────────────────────────────────

export interface CartItem {
  productId: number;
  productVariantId: number;
  productName: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
}

// ─── Customer / Checkout Types ────────────────────────────────────────────────

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  city: string;
  country: string;
}

export interface ProductFiltersDto {
  sizes: string[];
  colors: string[];
  minPrice: number;
  maxPrice: number;
}

export interface ProductCatalogDto {
  products: ProductDto[];
  filters: ProductFiltersDto;
}
