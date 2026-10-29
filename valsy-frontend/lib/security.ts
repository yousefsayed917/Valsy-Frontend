/**
 * Security utilities for client-side input sanitization, validation,
 * safe path parameter verification, and error normalization.
 */

const HTML_TAG_REGEX = /<[^>]*>?/gm;
const CONTROL_CHARS_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/**
 * Strips HTML tags, control characters, and normalizes whitespace to prevent XSS/injection.
 */
export function sanitizeText(input: string, maxLength = 500): string {
  if (typeof input !== "string") return "";
  return input
    .replace(CONTROL_CHARS_REGEX, "")
    .replace(HTML_TAG_REGEX, "")
    .trim()
    .slice(0, maxLength);
}

/**
 * Ensures numeric IDs interpolated into API paths are positive safe integers,
 * preventing path traversal or malformed URL injection.
 */
export function assertSafeId(id: number, entityName = "Resource"): number {
  const num = Number(id);
  if (!Number.isSafeInteger(num) || num <= 0) {
    throw new Error(`Invalid ${entityName} identifier.`);
  }
  return num;
}

/**
 * Validates an email address with strict length and format checks.
 */
export function isValidEmail(email: string): boolean {
  const clean = email.trim();
  if (clean.length < 5 || clean.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean);
}

/**
 * Validates a phone number (allows international + prefix, digits, spaces, hyphens, parentheses).
 */
export function isValidPhone(phone: string): boolean {
  const clean = phone.trim();
  if (clean.length < 7 || clean.length > 25) return false;
  return /^\+?[0-9\s\-().]{7,25}$/.test(clean);
}

/**
 * Validates checkout form fields and returns a map of field-specific error messages.
 */
export function validateCheckoutForm(data: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  city: string;
  country: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (sanitizeText(data.firstName, 100).length < 2) {
    errors.firstName = "Enter your first name (at least 2 characters).";
  }
  if (sanitizeText(data.lastName, 100).length < 2) {
    errors.lastName = "Enter your last name (at least 2 characters).";
  }
  if (!isValidEmail(data.email)) {
    errors.email = "Enter a valid email address (e.g., name@domain.com).";
  }
  if (!isValidPhone(data.phoneNumber)) {
    errors.phoneNumber = "Enter a valid phone number with country or area code.";
  }
  if (sanitizeText(data.addressLine1, 200).length < 5) {
    errors.addressLine1 = "Enter a complete street address (at least 5 characters).";
  }
  if (sanitizeText(data.city, 100).length < 2) {
    errors.city = "Enter a valid city name.";
  }
  if (sanitizeText(data.country, 100).length < 2) {
    errors.country = "Enter a valid country or region.";
  }

  return errors;
}

/**
 * Generates a unique idempotency key for mutating requests.
 */
export function createIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Normalizes API or network errors into safe, user-friendly messages without leaking internals.
 */
export function normalizeErrorMessage(error: unknown, fallback = "Unable to complete your request. Please try again."): string {
  if (error instanceof Error) {
    if (error.name === "AbortError") {
      return "The request timed out. Please check your connection and try again.";
    }
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      return "Unable to reach the Valsy server. Please ensure the backend service is running.";
    }
    const clean = sanitizeText(error.message, 240);
    return clean || fallback;
  }
  return fallback;
}

