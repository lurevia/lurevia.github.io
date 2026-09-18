import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ReviewsContext } from "./reviewsContextDefinition";
import { useAuth } from "../hooks/useAuth";
import { useOrders } from "../hooks/useOrders";
import type { ProductReview, ReviewEligibility } from "../bin/types/reviewType";
import { REVIEW_DELAY_DAYS } from "../bin/utils/constant/constant";

const STORAGE_KEY = "lurevia_reviews";


const readStorage = (): ProductReview[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProductReview[]) : [];
  } catch {
    return [];
  }
};

const writeStorage = (reviews: ProductReview[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (error) {
    console.error("Impossible de sauvegarder les avis.", error);
  }
};

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { orders } = useOrders();
  const [reviews, setReviews] = useState<ProductReview[]>(readStorage);

  useEffect(() => {
    writeStorage(reviews);
  }, [reviews]);

  // ─────────────────────────────────────────────────────────────────────────
  // HELPERS INTERNES
  // ─────────────────────────────────────────────────────────────────────────

  /** Vérifie si l'utilisateur a acheté ce produit */
  const hasPurchased = useCallback(
    (productId: string): boolean => {
      return orders.some((order) =>
        order.items.some((item) => item.product.id === productId)
      );
    },
    [orders]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // LECTURE DES AVIS
  // ─────────────────────────────────────────────────────────────────────────

  /** Tous les avis d'un produit (réels uniquement) */
  const getProductReviews = useCallback(
    (productId: string): ProductReview[] =>
      reviews
        .filter((r) => r.productId === productId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [reviews]
  );

  /** L'avis de l'utilisateur courant pour un produit (s'il existe) */
  const getUserReviewForProduct = useCallback(
    (productId: string): ProductReview | null => {
      if (!user) return null;
      return (
        reviews.find(
          (r) => r.productId === productId && r.userId === user.id
        ) ?? null
      );
    },
    [reviews, user]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // 🎯 CALCUL DE LA NOTE (fusion mock + avis réels)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Calcule la note d'un produit en **fusionnant** :
   * - Les avis réels (utilisateurs)
   * - Les statistiques mockées (produits historiques)
   *
   * Formule :
   *   totalSum   = sommeAvisRéels + (mockRating × mockCount)
   *   totalCount = nombreAvisRéels + mockCount
   *   moyenne    = totalSum / totalCount
   *
   * Si aucun avis réel ET pas de mock → moyenne = 0
   */
  const getProductRating = useCallback(
    (productId: string, mockRating = 0, mockCount = 0) => {
      const productReviews = reviews.filter(
        (r) => r.productId === productId
      );

      // Somme et compte des avis réels
      const realSum = productReviews.reduce((sum, r) => sum + r.rating, 0);
      const realCount = productReviews.length;

      // Fusion avec le mock
      const totalSum = realSum + mockRating * mockCount;
      const totalCount = realCount + mockCount;

      const average =
        totalCount === 0 ? 0 : totalSum / totalCount;

      // Distribution : on ne peut distribuer que les avis RÉELS
      // (le mock n'a pas de détail étoile par étoile)
      const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };
      productReviews.forEach((r) => {
        const rounded = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
        if (rounded >= 1 && rounded <= 5) distribution[rounded]++;
      });

      return { average, count: totalCount, distribution };
    },
    [reviews]
  );

  const checkEligibility = useCallback(
    (productId: string): ReviewEligibility => {
      if (!user) {
        return { canReview: false, reason: "not_logged_in" };
      }

      const existing = reviews.find(
        (r) => r.productId === productId && r.userId === user.id
      );
      if (existing) {
        return { canReview: false, reason: "already_reviewed" };
      }

      const purchaseOrders = orders.filter((o) =>
        o.items.some((item) => item.product.id === productId)
      );
      if (purchaseOrders.length === 0) {
        return { canReview: false, reason: "not_purchased" };
      }

      const orderDate = new Date(purchaseOrders[0].createdAt).getTime();
      const availableDate = new Date(
        orderDate + REVIEW_DELAY_DAYS * 24 * 60 * 60 * 1000
      );
      const now = Date.now();

      if (now < availableDate.getTime()) {
        const daysRemaining = Math.ceil(
          (availableDate.getTime() - now) / (24 * 60 * 60 * 1000)
        );
        return {
          canReview: false,
          reason: "waiting",
          availableAt: availableDate.toISOString(),
          daysRemaining,
        };
      }

      return { canReview: true, reason: "eligible" };
    },
    [user, reviews, orders]
  );

  const addReview = useCallback(
    (
      data: Omit<
        ProductReview,
        "id" | "createdAt" | "updatedAt" | "isVerifiedPurchase"
      >
    ) => {
      if (!user) return;

      const existing = reviews.find(
        (r) => r.productId === data.productId && r.userId === user.id
      );
      if (existing) {
        console.warn(
          "[ReviewsContext] Vous avez déjà publié un avis sur ce produit."
        );
        return;
      }

      const now = new Date().toISOString();
      const newReview: ProductReview = {
        ...data,
        id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        isVerifiedPurchase: hasPurchased(data.productId),
        createdAt: now,
        updatedAt: now,
      };

      setReviews((prev) => [newReview, ...prev]);
    },
    [user, reviews, hasPurchased]
  );

  const updateReview = useCallback(
    (reviewId: string, data: Partial<ProductReview>) => {
      if (!user) return;
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId && r.userId === user.id
            ? { ...r, ...data, updatedAt: new Date().toISOString() }
            : r
        )
      );
    },
    [user]
  );

  const deleteReview = useCallback(
    (reviewId: string) => {
      if (!user) return;
      setReviews((prev) =>
        prev.filter((r) => !(r.id === reviewId && r.userId === user.id))
      );
    },
    [user]
  );

  const value = useMemo(
    () => ({
      getProductReviews,
      getUserReviewForProduct,
      getProductRating,
      checkEligibility,
      addReview,
      updateReview,
      deleteReview,
    }),
    [
      getProductReviews,
      getUserReviewForProduct,
      getProductRating,
      checkEligibility,
      addReview,
      updateReview,
      deleteReview,
    ]
  );

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
};