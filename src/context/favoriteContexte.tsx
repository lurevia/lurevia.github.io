import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { FavoriteContext } from "./favoriteContextDefinition";
import type { Product } from "../bin/types/homeType";

const STORAGE_KEY = "lurevia_favorites";

const readFavoritesFromStorage = (): Product[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Product[]) : [];
  } catch (error) {
    console.error("Impossible de lire les favoris enregistrés.", error);
    return [];
  }
};

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>(
    readFavoritesFromStorage
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((product: Product): void => {
    setFavorites((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  }, []);

  const isFavorite = useCallback(
    (productId: string): boolean => favorites.some((p) => p.id === productId),
    [favorites]
  );

  const totalFavorites = useMemo(() => favorites.length, [favorites]);

  const contextValue = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, totalFavorites }),
    [favorites, isFavorite, toggleFavorite, totalFavorites]
  );

  return (
    <FavoriteContext.Provider
      value={contextValue}
    >
      {children}
    </FavoriteContext.Provider>
  );
};