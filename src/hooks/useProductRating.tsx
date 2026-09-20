import { useReviews } from "./useReviews";

/**
 * Note affichée pour un produit.
 *
 * Les listes de produits renvoyées par l'API contiennent déjà `rating` et
 * `reviewCount` (caches maintenus côté serveur) : on les utilise par
 * défaut, et on ne préfère la valeur du contexte que si la fiche produit
 * a été consultée et a donc chargé le détail des avis.
 */
export const useProductRating = (
  productId: string,
  fallbackRating = 0,
  fallbackCount = 0
): { rating: number; reviewCount: number; hasRealReviews: boolean } => {
  const { getProductRating } = useReviews();
  const { average, count } = getProductRating(productId);

  if (count > 0) {
    return { rating: average, reviewCount: count, hasRealReviews: true };
  }

  return { rating: fallbackRating, reviewCount: fallbackCount, hasRealReviews: fallbackCount > 0 };
};
