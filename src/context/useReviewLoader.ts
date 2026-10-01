import { useCallback, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { reviewsApi } from "../api/reviews";
import type { ProductReview, ReviewEligibility } from "../bin/types/reviewType";
import {
  DEFAULT_PRODUCT_REVIEWS,
  type ProductReviewsState,
} from "./reviewState";

type ReviewsByProduct = Record<string, ProductReviewsState>;
type SetReviewsByProduct = Dispatch<SetStateAction<ReviewsByProduct>>;

export const useReviewLoader = (
  setByProduct: SetReviewsByProduct,
  userId: string | undefined,
  isReady: boolean,
) => {
  const inFlight = useRef<Set<string>>(new Set());
  const loadedMine = useRef<Set<string>>(new Set());
  const isAuthenticated = userId !== undefined;

  useEffect(() => {
    setByProduct({});
    inFlight.current.clear();
    loadedMine.current.clear();
  }, [setByProduct, userId]);

  const patchProduct = useCallback(
    (productId: string, patch: Partial<ProductReviewsState>) => {
      setByProduct((previous) => ({
        ...previous,
        [productId]: {
          ...DEFAULT_PRODUCT_REVIEWS,
          ...previous[productId],
          ...patch,
        },
      }));
    },
    [setByProduct],
  );

  const loadProduct = useCallback(
    async (productId: string): Promise<void> => {
      if (!productId || !isReady || inFlight.current.has(productId)) return;

      inFlight.current.add(productId);
      patchProduct(productId, { isLoading: true });

      try {
        const [reviews, rating] = await Promise.all([
          reviewsApi.listForProduct(productId),
          reviewsApi.rating(productId),
        ]);

        let eligibility: ReviewEligibility = {
          canReview: false,
          reason: "not_logged_in",
        };
        let mine: ProductReview | null = null;

        if (isAuthenticated) {
          const results = await Promise.allSettled([
            reviewsApi.eligibility(productId),
            reviewsApi.mine(productId),
          ]);
          if (results[0].status === "fulfilled") eligibility = results[0].value;
          if (results[1].status === "fulfilled") mine = results[1].value;
        }

        patchProduct(productId, {
          reviews,
          rating,
          eligibility,
          mine,
          isLoading: false,
        });
      } catch {
        patchProduct(productId, { isLoading: false });
      } finally {
        inFlight.current.delete(productId);
      }
    },
    [isAuthenticated, isReady, patchProduct],
  );

  const loadMyReviews = useCallback(
    async (productIds: string[]): Promise<void> => {
      if (!isAuthenticated) return;

      const targets = Array.from(new Set(productIds)).filter(
        (productId) => productId && !loadedMine.current.has(productId),
      );
      if (targets.length === 0) return;
      targets.forEach((productId) => loadedMine.current.add(productId));

      const results = await Promise.allSettled(
        targets.map(async (id) => ({ id, review: await reviewsApi.mine(id) })),
      );

      setByProduct((previous) => {
        const next = { ...previous };
        for (const result of results) {
          if (result.status !== "fulfilled") continue;
          next[result.value.id] = {
            ...DEFAULT_PRODUCT_REVIEWS,
            ...next[result.value.id],
            mine: result.value.review,
          };
        }
        return next;
      });
    },
    [isAuthenticated, setByProduct],
  );

  const reload = useCallback(
    async (productId: string): Promise<void> => {
      inFlight.current.delete(productId);
      loadedMine.current.delete(productId);
      setByProduct((previous) => {
        const next = { ...previous };
        delete next[productId];
        return next;
      });
      await loadProduct(productId);
    },
    [loadProduct, setByProduct],
  );

  return { loadProduct, loadMyReviews, reload };
};
