import type { CartItem } from "../bin/types/homeType";

const STORAGE_KEY = "lurevia_guest_cart";
const MAX_GUEST_ITEMS = 50;

const isGuestItem = (value: unknown): value is CartItem => {
  if (typeof value !== "object" || value === null) return false;
  const item = value as {
    product?: { id?: unknown; price?: unknown };
    quantity?: unknown;
  };
  return (
    typeof item.product?.id === "string" &&
    typeof item.product?.price === "number" &&
    typeof item.quantity === "number" &&
    item.quantity > 0
  );
};

export const readGuestCart = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem(STORAGE_KEY);
    if (!storedCart) return [];

    const parsedCart: unknown = JSON.parse(storedCart);
    if (!Array.isArray(parsedCart)) return [];
    return parsedCart.filter(isGuestItem).slice(0, MAX_GUEST_ITEMS);
  } catch {
    return [];
  }
};

export const writeGuestCart = (items: CartItem[]): void => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items.slice(0, MAX_GUEST_ITEMS)),
    );
  } catch {
    // Le panier reste disponible en mémoire si le stockage est indisponible.
  }
};

export const clearGuestCart = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Le stockage peut être désactivé par le navigateur.
  }
};
