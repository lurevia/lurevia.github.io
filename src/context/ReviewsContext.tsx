import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import { ReviewsContext } from "./reviewsContextDefinition";
import { EMPTY_RATING, reviewsApi } from "../api/reviews";
import { useAuth } from "../hooks/useAuth";
import type {
  ProductRating,
  ProductReview,
  ReviewEligibility,
  ReviewInput,
} from "../bin/types/reviewType";

/**
 * Avis produits.
 *
 * Toute la logique métier sensible (achat vérifié, délai de 5 jours,
 * unicité de l'avis, propriété de l'avis) est tranchée par l'API : le
 * client se contente d'afficher la décision du serveur. L'ancienne
 * implémentation calculait l'éligibilité en local, ce qui rendait la
 * règle contournable depuis la console du navigateur.
 *
 * Les réponses sont mises en cache par produit pour éviter de rejouer
 * quatre requêtes à chaque rendu.
 */

type ProductReviewsState = {
  reviews: ProductReview[];
  rating: ProductRating;
  eligibility: ReviewEligibility;
  mine: ProductReview | null;
  isLoading: boolean;
};

const DEFAULT_STATE: ProductReviewsState = {
  reviews: [],
  rating: EMPTY_RATING,
  eligibility: { canReview: false, reason: "not_logged_in" },
  mine: null,
  isLoading: false,
};

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const { user, isReady } = useAuth();
  const [byProduct, setByProduct] = useState<Record<string, ProductReviewsState>>({});
  const inFlight = useRef<Set<string>>(new Set());
  const loadedMine = useRef<Set<string>>(new Set());

  const isAuthenticated = user !== null;

  // Le cache dépend de l'utilisateur (éligibilité, « mon avis ») :
  // on le purge à chaque changement de session.
  useEffect(() => {
    setByProduct({});
    inFlight.current.clear();
    loadedMine.current.clear();
  }, [user?.id]);

  const patchProduct = useCallback(
    (productId: string, patch: Partial<ProductReviewsState>) => {
      setByProduct((prev) => ({
        ...prev,
        [productId]: { ...DEFAULT_STATE, ...prev[productId], ...patch },
      }));
    },
    []
  );

  const loadProduct = useCallback(
    async (productId: string): Promise<void> => {
      if (!productId || !isReady) return;
      if (inFlight.current.has(productId)) return;

      inFlight.current.add(productId);
      patchProduct(productId, { isLoading: true });

      try {
        const [reviews, rating] = await Promise.all([
          reviewsApi.listForProduct(productId),
          reviewsApi.rating(productId),
        ]);

        let eligibility: ReviewEligibility = { canReview: false, reason: "not_logged_in" };
        let mine: ProductReview | null = null;

        if (isAuthenticated) {
          const [eligibilityResult, mineResult] = await Promise.allSettled([
            reviewsApi.eligibility(productId),
            reviewsApi.mine(productId),
          ]);
          if (eligibilityResult.status === "fulfilled") eligibility = eligibilityResult.value;
          if (mineResult.status === "fulfilled") mine = mineResult.value;
        }

        patchProduct(productId, { reviews, rating, eligibility, mine, isLoading: false });
      } catch {
        patchProduct(productId, { isLoading: false });
      } finally {
        inFlight.current.delete(productId);
      }
    },
    [isAuthenticated, isReady, patchProduct]
  );

  const loadMyReviews = useCallback(
    async (productIds: string[]): Promise<void> => {
      if (!isAuthenticated) return;

      const targets = Array.from(new Set(productIds)).filter(
        (id) => id && !loadedMine.current.has(id)
      );
      if (targets.length === 0) return;

      targets.forEach((id) => loadedMine.current.add(id));

      const results = await Promise.allSettled(
        targets.map(async (id) => ({ id, review: await reviewsApi.mine(id) }))
      );

      setByProduct((prev) => {
        const next = { ...prev };
        for (const result of results) {
          if (result.status !== "fulfilled") continue;
          next[result.value.id] = {
            ...DEFAULT_STATE,
            ...next[result.value.id],
            mine: result.value.review,
          };
        }
        return next;
      });
    },
    [isAuthenticated]
  );

  const isProductLoading = useCallback(
    (productId: string): boolean => byProduct[productId]?.isLoading ?? false,
    [byProduct]
  );

  const getProductReviews = useCallback(
    (productId: string): ProductReview[] => byProduct[productId]?.reviews ?? [],
    [byProduct]
  );

  const getUserReviewForProduct = useCallback(
    (productId: string): ProductReview | null => byProduct[productId]?.mine ?? null,
    [byProduct]
  );

  const getProductRating = useCallback(
    (productId: string): ProductRating => byProduct[productId]?.rating ?? EMPTY_RATING,
    [byProduct]
  );

  const checkEligibility = useCallback(
    (productId: string): ReviewEligibility =>
      byProduct[productId]?.eligibility ?? {
        canReview: false,
        reason: isAuthenticated ? "not_purchased" : "not_logged_in",
      },
    [byProduct, isAuthenticated]
  );

  /** Recharge l'état complet d'un produit après écriture. */
  const reload = useCallback(
    async (productId: string): Promise<void> => {
      inFlight.current.delete(productId);
      loadedMine.current.delete(productId);
      setByProduct((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
      await loadProduct(productId);
    },
    [loadProduct]
  );

  const addReview = useCallback(
    async (productId: string, data: ReviewInput): Promise<void> => {
      await reviewsApi.create(productId, data);
      await reload(productId);
    },
    [reload]
  );

  const updateReview = useCallback(
    async (reviewId: string, productId: string, data: Partial<ReviewInput>): Promise<void> => {
      await reviewsApi.update(reviewId, data);
      await reload(productId);
    },
    [reload]
  );

  const deleteReview = useCallback(
    async (reviewId: string, productId: string): Promise<void> => {
      await reviewsApi.remove(reviewId);
      await reload(productId);
    },
    [reload]
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
    ]
  );

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
};
