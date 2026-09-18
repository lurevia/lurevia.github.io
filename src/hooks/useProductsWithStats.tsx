import { useMemo } from "react";
import { useReviews } from "./useReviews";
import type { Product } from "../bin/types/homeType";

export const useProductsWithStats = (products: Product[]): Product[] => {
  const { getProductRating } = useReviews();

  return useMemo(() => {
    return products.map((product) => {
      const { average, count } = getProductRating(product.id);

      if (count === 0) return product;

      return {
        ...product,
        rating: Math.round(average * 10) / 10,
        reviewCount: count,
      };
    });
  }, [products, getProductRating]);
};