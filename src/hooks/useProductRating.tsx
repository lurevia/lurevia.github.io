import { useReviews } from "./useReviews";

export const useProductRating = (
  productId: string,
  fallbackRating = 0,
  fallbackCount = 0
): { rating: number; reviewCount: number; hasRealReviews: boolean } => {
  const { getProductRating } = useReviews();
  const { average, count } = getProductRating(productId);

  if (count > 0) {
    return {
      rating: average,
      reviewCount: count,
      hasRealReviews: true,
    };
  }

  return {
    rating: fallbackRating,
    reviewCount: fallbackCount,
    hasRealReviews: false,
  };
};