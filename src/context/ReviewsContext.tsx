import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ReviewsContext } from "./reviewsContextDefinition";
import { reviewsApi } from "../api/reviews";
import { useAuth } from "../hooks/useAuth";
import type { ReviewInput } from "../bin/types/reviewType";
import {
  DEFAULT_PRODUCT_REVIEWS,
  type ProductReviewsState,
} from "./reviewState";
import { useReviewLoader } from "./useReviewLoader";

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const { user, isReady } = useAuth();
  const [byProduct, setByProduct] = useState<
    Record<string, ProductReviewsState>
  >({});
  const isAuthenticated = user !== null && user.role !== "ADMIN";
  const { loadProduct, loadMyReviews, reload } = useReviewLoader(
    setByProduct,
    isAuthenticated ? user?.id : undefined,
    isReady,
  );

  const isProductLoading = useCallback(
    (productId: string): boolean => byProduct[productId]?.isLoading ?? false,
    [byProduct],
  );

  const getProductReviews = useCallback(
    (productId: string) => byProduct[productId]?.reviews ?? [],
    [byProduct],
  );

  const getUserReviewForProduct = useCallback(
    (productId: string) => byProduct[productId]?.mine ?? null,
    [byProduct],
  );

  const getProductRating = useCallback(
    (productId: string) =>
      byProduct[productId]?.rating ?? DEFAULT_PRODUCT_REVIEWS.rating,
    [byProduct],
  );

  const checkEligibility = useCallback(
    (productId: string) =>
      byProduct[productId]?.eligibility ?? {
        canReview: false,
        reason: isAuthenticated ? "not_purchased" : "not_logged_in",
      },
    [byProduct, isAuthenticated],
  );

  const addReview = useCallback(
    async (productId: string, data: ReviewInput): Promise<void> => {
      await reviewsApi.create(productId, data);
      await reload(productId);
    },
    [reload],
  );

  const updateReview = useCallback(
    async (
      reviewId: string,
      productId: string,
      data: Partial<ReviewInput>,
    ): Promise<void> => {
      await reviewsApi.update(reviewId, data);
      await reload(productId);
    },
    [reload],
  );

  const deleteReview = useCallback(
    async (reviewId: string, productId: string): Promise<void> => {
      await reviewsApi.remove(reviewId);
      await reload(productId);
    },
    [reload],
  );

  const value = useMemo(
    () => ({
      loadProduct,
      loadMyReviews,
      isProductLoading,
      getProductReviews,
      getUserReviewForProduct,
      getProductRating,
      checkEligibility,
      addReview,
      updateReview,
      deleteReview,
    }),
    [
      loadProduct,
      loadMyReviews,
      isProductLoading,
      getProductReviews,
      getUserReviewForProduct,
      getProductRating,
      checkEligibility,
      addReview,
      updateReview,
      deleteReview,
    ],
  );

  return (
    <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
  );
};
