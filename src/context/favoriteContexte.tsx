import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import { FavoriteContext } from "./favoriteContextDefinition";
import { favoritesApi } from "../api/favorites";
import { useAuth } from "../hooks/useAuth";
import type { Product } from "../bin/types/homeType";

const GUEST_STORAGE_KEY = "lurevia_guest_favorites";
const MAX_GUEST_FAVORITES = 60;

/**
 * Favoris hybrides : stockés côté serveur pour un utilisateur connecté
 * (donc partagés entre ses appareils), et en local pour un visiteur
 * anonyme. La liste locale est poussée vers le serveur à la connexion.
 */

const isProduct = (value: unknown): value is Product => {
  if (typeof value !== "object" || value === null) return false;
  const product = value as { id?: unknown; title?: unknown; price?: unknown };
  return (
    typeof product.id === "string" &&
    typeof product.title === "string" &&
    typeof product.price === "number"
  );
};

const readGuestFavorites = (): Product[] => {
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isProduct).slice(0, MAX_GUEST_FAVORITES);
  } catch {
    return [];
  }
};

const writeGuestFavorites = (products: Product[]): void => {
  try {
    localStorage.setItem(
      GUEST_STORAGE_KEY,
      JSON.stringify(products.slice(0, MAX_GUEST_FAVORITES))
    );
  } catch {
    /* stockage indisponible */
  }
};

const clearGuestFavorites = (): void => {
  try {
    localStorage.removeItem(GUEST_STORAGE_KEY);
  } catch {
    /* ignoré */
  }
};

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
  const { user, isReady } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const previousUserId = useRef<string | null>(null);

  const isAuthenticated = user !== null;

  useEffect(() => {
    if (!isReady) return;

    let cancelled = false;

    const sync = async () => {
      const previousId = previousUserId.current;
      previousUserId.current = user?.id ?? null;

      if (!user) {
        setFavorites(previousId ? [] : readGuestFavorites());
        return;
      }

      try {
        const pending = readGuestFavorites();
        if (pending.length > 0) {
          const serverFavorites = await favoritesApi.list();
          const known = new Set(serverFavorites.map((p) => p.id));

          for (const product of pending) {
            if (known.has(product.id)) continue;
            try {
              await favoritesApi.toggle(product.id);
            } catch {
              /* produit disparu : ignoré */
            }
          }
          clearGuestFavorites();
        }

        const list = await favoritesApi.list();
        if (!cancelled) setFavorites(list);
      } catch {
        if (!cancelled) setFavorites([]);
      }
    };

    void sync();
    return () => {
      cancelled = true;
    };
  }, [user, isReady]);

  useEffect(() => {
    if (isAuthenticated || !isReady) return;
    writeGuestFavorites(favorites);
  }, [favorites, isAuthenticated, isReady]);

  const isFavorite = useCallback(
    (productId: string): boolean => favorites.some((p) => p.id === productId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (product: Product): Promise<void> => {
      if (!isAuthenticated) {
        setFavorites((prev) =>
          prev.some((p) => p.id === product.id)
            ? prev.filter((p) => p.id !== product.id)
            : [...prev, product].slice(0, MAX_GUEST_FAVORITES)
        );
        return;
      }

      // Mise à jour optimiste, annulée si le serveur refuse.
      const wasFavorite = favorites.some((p) => p.id === product.id);
      setFavorites((prev) =>
        wasFavorite ? prev.filter((p) => p.id !== product.id) : [...prev, product]
      );

      try {
        await favoritesApi.toggle(product.id);
      } catch {
        setFavorites((prev) =>
          wasFavorite ? [...prev, product] : prev.filter((p) => p.id !== product.id)
        );
      }
    },
    [isAuthenticated, favorites]
  );

  const clearFavorites = useCallback(async (): Promise<void> => {
    const current = favorites;
    setFavorites([]);

    if (!isAuthenticated) {
      clearGuestFavorites();
      return;
    }

    for (const product of current) {
      try {
        await favoritesApi.toggle(product.id);
      } catch {
        /* on continue : la liste est rechargée au prochain montage */
      }
    }
  }, [favorites, isAuthenticated]);

  const contextValue = useMemo(
    () => ({
      favorites,
      totalFavorites: favorites.length,
      isFavorite,
      toggleFavorite,
      clearFavorites,
    }),
    [favorites, isFavorite, toggleFavorite, clearFavorites]
  );

  return (
    <FavoriteContext.Provider value={contextValue}>{children}</FavoriteContext.Provider>
  );
};
