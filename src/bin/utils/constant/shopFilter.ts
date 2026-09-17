import type { Size, SortOption } from "../../types/shopType";

export const SIZES: Size[] = ["XS", "S", "M", "L", "XL"];

export const COLORS: { label: string; hex: string }[] = [
  { label: "Noir", hex: "#111111" },
  { label: "Blanc", hex: "#FFFFFF" },
  { label: "Beige", hex: "#E8DCC4" },
  { label: "Orange", hex: "#E55B13" },
  { label: "Vert", hex: "#0B251C" },
  { label: "Bleu", hex: "#2563EB" },
  { label: "Rouge", hex: "#DC2626" },
  { label: "Rose", hex: "#EC4899" },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Plus récents" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "rating-desc", label: "Mieux notés" },
  { value: "popular", label: "Populaires" },
];

export const PRICE_MIN = 5_000;
export const PRICE_MAX = 200_000;
export const PRODUCTS_PER_PAGE = 12;