
const readString = (value: unknown, fallback: string): string =>
  typeof value === "string" && value.trim() !== "" ? value.trim() : fallback;

const readNumber = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const PRODUCTION_API_URL = "https://lurevia-ecommerce.onrender.com/api/v1";

const isLocalhostUrl = (value: string): boolean => {
  try {
    const hostname = new URL(value).hostname;
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  } catch {
    return false;
  }
};

const configuredApiUrl = readString(import.meta.env.VITE_API_URL, PRODUCTION_API_URL);

export const API_BASE_URL = (
  import.meta.env.PROD && isLocalhostUrl(configuredApiUrl)
    ? PRODUCTION_API_URL
    : configuredApiUrl
).replace(/\/+$/, "");

export const GOOGLE_CLIENT_ID = readString(import.meta.env.VITE_GOOGLE_CLIENT_ID, "");
export const FACEBOOK_APP_ID = readString(import.meta.env.VITE_FACEBOOK_APP_ID, "");

export const REQUEST_TIMEOUT_MS = readNumber(
  import.meta.env.VITE_API_TIMEOUT_MS,
  15_000
);

export const REVIEW_DELAY_DAYS = readNumber(
  import.meta.env.VITE_REVIEW_DELAY_DAYS,
  5
);


export const SHIPPING_COST = readNumber(
  import.meta.env.VITE_DEFAULT_SHIPPING_COST,
  8_000
);

export const FREE_SHIPPING_THRESHOLD = readNumber(
  import.meta.env.VITE_FREE_SHIPPING_THRESHOLD,
  250_000
);

export const PRODUCTS_PER_PAGE = 12;
