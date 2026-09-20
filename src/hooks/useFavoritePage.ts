import { useMemo, useState } from "react";
import { useFavorite } from "./useFavorite";
import { useCart } from "./useCart";
import type { Product } from "../bin/types/homeType";

export type UseFavoritePageReturn = {
    favorites: Product[];
    totalFavorites: number;
    isEmpty: boolean;

    removeFromFavorites: (product: Product) => void;
    clearFavorites: () => void;
    addAllToCart: () => void;

    isAddingAll: boolean;
    lastAddedCount: number;
};

export const useFavoritePage = (): UseFavoritePageReturn => {
    const { favorites, toggleFavorite, totalFavorites, clearFavorites } = useFavorite();
    const { addToCart } = useCart();

    const [isAddingAll, setIsAddingAll] = useState(false);
    const [lastAddedCount, setLastAddedCount] = useState(0);

    const isEmpty = useMemo(() => favorites.length === 0, [favorites]);

    const removeFromFavorites = (product: Product): void => {
        void toggleFavorite(product);
    };

    const addAllToCart = (): void => {
        if (favorites.length === 0 || isAddingAll) return;

        const available = favorites.filter((p) => p.outOfStock !== true);
        setIsAddingAll(true);

        void (async () => {
            for (const product of available) {
                await addToCart(product, 1);
            }
            setLastAddedCount(available.length);
            setTimeout(() => {
                setIsAddingAll(false);
                setLastAddedCount(0);
            }, 2000);
        })();
    };

    return {
        favorites,
        totalFavorites,
        isEmpty,
        removeFromFavorites,
        clearFavorites: () => void clearFavorites(),
        addAllToCart,
        isAddingAll,
        lastAddedCount,
    };
};
