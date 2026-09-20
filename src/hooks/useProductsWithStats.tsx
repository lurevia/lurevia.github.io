import { useMemo } from "react";
import { useReviews } from "./useReviews";
import type { Product } from "../bin/types/homeType";

/**
 * Complète une liste de produits avec la note issue du contexte d'avis
 * lorsqu'elle a déjà été chargée (fiche produit visitée). Sinon la note
 * du catalogue, calculée par l'API, est conservée.
 */
export const useProductsWithStats = (products: Product[]): Product[] => {
  const { getProductRating } = useReviews();

  return useMemo(
    () =>
      products.map((product) => {
        const { average, count } = getProductRating(product.id);
        if (count === 0) return product;

        return {
          ...product,
          rating: Math.round(average * 10) / 10,
          reviewCount: count,
        };
      }),
    [products, getProductRating]
  );
};
