import { useContext } from "react";
import { FavoriteContext } from "../context/favoriteContextDefinition";
import type { FavoriteContextType } from "../bin/types/homeType";

export const useFavorite = (): FavoriteContextType => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorite doit être utilisé dans un FavoriteProvider");
  }
  return context;
};
