import { createContext } from "react";
import type { FavoriteContextType } from "../bin/types/homeType";

export const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined
);
