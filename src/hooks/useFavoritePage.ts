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
    const { favorites, toggleFavorite, totalFavorites } = useFavorite();
    const { addToCart } = useCart();

    const [isAddingAll, setIsAddingAll] = useState(false);
    const [lastAddedCount, setLastAddedCount] = useState(0);

    const isEmpty = useMemo(() => favorites.length === 0, [favorites]);

    const removeFromFavorites = (product: Product): void => {
        toggleFavorite(product);
    };

    const clearFavorites = (): void => {
        favorites.forEach((product) => toggleFavorite(product));
    };

    const addAllToCart = (): void => {
        if (favorites.length === 0) return;

        setIsAddingAll(true);
        const count = favorites.length;

        favorites.forEach((product) => {
            addToCart(product, 1);
        });

        setLastAddedCount(count);
        setTimeout(() => {
            setIsAddingAll(false);
            setLastAddedCount(0);
        }, 2000);
    };

    return {
        favorites,
        totalFavorites,
        isEmpty,
        removeFromFavorites,
        clearFavorites,
        addAllToCart,
        isAddingAll,
        lastAddedCount,
    };
};