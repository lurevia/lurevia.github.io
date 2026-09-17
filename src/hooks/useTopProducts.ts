import { useMemo } from "react";
import type { Product } from "../bin/types/homeType";

const DEFAULT_LIMIT = 10;

export const useTopProducts = (
  products: Product[],
  limit: number = DEFAULT_LIMIT
): Product[] => {
  return useMemo(() => {
    return products
      .filter((p) => {
        const available = p.outOfStock !== true && (p.stock ?? 1) > 0;
        return available;
      })
      .sort((a, b) => {
        const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);
        if (ratingDiff !== 0) return ratingDiff;

        return b.id.localeCompare(a.id);
      })
      .slice(0, limit);
  }, [products, limit]);
};