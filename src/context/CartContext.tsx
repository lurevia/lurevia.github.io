import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import { CartContext } from "./cartContextDefinition";
import { cartApi } from "../api/cart";
import { toErrorMessage } from "../api/http";
import { useAuth } from "../hooks/useAuth";
import type { CartItem, Product } from "../bin/types/homeType";

const GUEST_STORAGE_KEY = "lurevia_guest_cart";
const MAX_GUEST_ITEMS = 50;
const MAX_QUANTITY = 99;

/**
 * Panier hybride.
 *
 * - **Connecté** : le panier serveur fait autorité (stock, prix, quantités
 *   plafonnées). Le client n'envoie que des identifiants et des quantités,
 *   jamais de prix — impossible donc de « négocier » un montant.
 * - **Invité** : panier local, uniquement pour le confort de navigation.
 *   Il est fusionné dans le panier serveur à la connexion, puis effacé.
 */

const isGuestItem = (value: unknown): value is CartItem => {
  if (typeof value !== "object" || value === null) return false;
  const item = value as { product?: { id?: unknown; price?: unknown }; quantity?: unknown };
  return (
    typeof item.product?.id === "string" &&
    typeof item.product?.price === "number" &&
    typeof item.quantity === "number" &&
    item.quantity > 0
  );
};

const readGuestCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isGuestItem).slice(0, MAX_GUEST_ITEMS);
  } catch {
    return [];
  }
};

const writeGuestCart = (items: CartItem[]): void => {
  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(items.slice(0, MAX_GUEST_ITEMS)));
  } catch {
    // Quota dépassé ou stockage désactivé : le panier reste en mémoire.
  }
};

const clearGuestCart = (): void => {
  try {
    localStorage.removeItem(GUEST_STORAGE_KEY);
  } catch {
    /* ignoré */
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, isReady } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previousUserId = useRef<string | null>(null);

  const isAuthenticated = user !== null;

  // ─── Synchronisation panier invité ↔ panier serveur ───
  useEffect(() => {
    if (!isReady) return;

    let cancelled = false;

    const sync = async () => {
      const previousId = previousUserId.current;
      previousUserId.current = user?.id ?? null;

      if (!user) {
        // Déconnexion : on ne conserve jamais le panier d'un autre compte.
        if (previousId) setCart([]);
        else setCart(readGuestCart());
        return;
      }

      setIsSyncing(true);
      try {
        const pending = readGuestCart();

        // Fusion du panier invité dans le panier serveur (une seule fois).
        for (const item of pending) {
          try {
            await cartApi.addItem(item.product.id, Math.min(item.quantity, MAX_QUANTITY));
          } catch {
            // Produit supprimé ou en rupture : on ignore cette ligne.
          }
        }
        if (pending.length > 0) clearGuestCart();

        const serverCart = await cartApi.get();
        if (!cancelled) setCart(serverCart.items);
      } catch (err) {
        if (!cancelled) setError(toErrorMessage(err));
      } finally {
        if (!cancelled) setIsSyncing(false);
      }
    };

    void sync();
    return () => {
      cancelled = true;
    };
  }, [user, isReady]);

  // ─── Persistance locale du panier invité ───
  useEffect(() => {
    if (isAuthenticated || !isReady) return;
    writeGuestCart(cart);
  }, [cart, isAuthenticated, isReady]);

  const runServerAction = useCallback(
    async (action: () => Promise<{ items: CartItem[] }>) => {
      setIsSyncing(true);
      setError(null);
      try {
        const result = await action();
        setCart(result.items);
      } catch (err) {
        setError(toErrorMessage(err, "Le panier n'a pas pu être mis à jour."));
      } finally {
        setIsSyncing(false);
      }
    },
    []
  );

  const addToCart = useCallback(
    async (product: Product, quantity = 1): Promise<void> => {
      const qty = Math.min(Math.max(1, Math.trunc(quantity)), MAX_QUANTITY);

      if (isAuthenticated) {
        await runServerAction(() => cartApi.addItem(product.id, qty));
        return;
      }

      setCart((prev) => {
        const maxStock = product.stock ?? MAX_QUANTITY;
        const existing = prev.find((item) => item.product.id === product.id);

        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + qty, maxStock) }
              : item
          );
        }

        if (prev.length >= MAX_GUEST_ITEMS) return prev;
        return [...prev, { product, quantity: Math.min(qty, maxStock) }];
      });
    },
    [isAuthenticated, runServerAction]
  );

  const removeFromCart = useCallback(
    async (productId: string): Promise<void> => {
      if (isAuthenticated) {
        await runServerAction(() => cartApi.removeItem(productId));
        return;
      }
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    },
    [isAuthenticated, runServerAction]
  );

  const setQuantity = useCallback(
    async (productId: string, quantity: number): Promise<void> => {
      const qty = Math.min(Math.max(0, Math.trunc(quantity)), MAX_QUANTITY);

      if (isAuthenticated) {
        await runServerAction(() => cartApi.updateItem(productId, qty));
        return;
      }

      setCart((prev) =>
        qty <= 0
          ? prev.filter((item) => item.product.id !== productId)
          : prev.map((item) =>
              item.product.id === productId
                ? { ...item, quantity: Math.min(qty, item.product.stock ?? MAX_QUANTITY) }
                : item
            )
      );
    },
    [isAuthenticated, runServerAction]
  );

  const clearCart = useCallback(async (): Promise<void> => {
    if (isAuthenticated) {
      await runServerAction(() => cartApi.clear());
      return;
    }
    setCart([]);
    clearGuestCart();
  }, [isAuthenticated, runServerAction]);

  const totalItems = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const totalPrice = useMemo(
    () => cart.reduce((total, item) => total + item.product.price * item.quantity, 0),
    [cart]
  );

  const contextValue = useMemo(
    () => ({
      cart,
      totalItems,
      totalPrice,
      isSyncing,
      error,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
    }),
    [cart, totalItems, totalPrice, isSyncing, error, addToCart, removeFromCart, setQuantity, clearCart]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};
