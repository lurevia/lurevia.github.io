import { createContext } from "react";
import type { Category } from "../bin/types/homeType";

export interface CategoriesContextType {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const CategoriesContext = createContext<CategoriesContextType | undefined>(
  undefined
);
