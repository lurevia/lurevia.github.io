import { useEffect, useState } from "react";
import type { FC } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useReviews } from "../../hooks/useReviews";
import { toErrorMessage } from "../../api/http";
import { ProductReviewForm } from "./ProductReviewForm";
import { ProductReviewSummary } from "./ProductReviewSummary";
import {
  ProductReviewAction,
  ProductReviewInformation,
} from "./ProductReviewEligibility";
import { ProductReviewEntries } from "./ProductReviewEntries";

type ProductReviewsListProps = {
  productId: string;
  autoOpenForm?: boolean;
};

export const ProductReviewsList: FC<ProductReviewsListProps> = ({
  productId,
  autoOpenForm = false,
}) => {
  const { user, isAuthenticated } = useAuth();
  const {
    loadProduct,
    isProductLoading,
    getProductReviews,
    getUserReviewForProduct,
    getProductRating,
    checkEligibility,
    addReview,
    updateReview,
    deleteReview,
  } = useReviews();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadProduct(productId);
  }, [productId, loadProduct]);

  const reviews = getProductReviews(productId);
  const rating = getProductRating(productId);
  const myReview = getUserReviewForProduct(productId);
  const eligibility = checkEligibility(productId);
  const isLoading = isProductLoading(productId);

  useEffect(() => {
    if (autoOpenForm && !myReview && eligibility.reason === "eligible") {
      setIsFormOpen(true);
    }
  }, [autoOpenForm, myReview, eligibility.reason]);

  const runAction = async (action: () => Promise<void>, after: () => void) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await action();
      after();
    } catch (actionError) {
      setError(
        toErrorMessage(actionError, "Votre avis n'a pas pu être enregistré."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (reviewId: string) => {
    if (!window.confirm("Supprimer cet avis ?")) return;
    void runAction(
      () => deleteReview(reviewId, productId),
      () => setEditingId(null),
    );
  };

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-base md:text-lg font-black text-lurevia-dark">
            Avis clients
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {rating.count > 0
              ? `${rating.count} avis · moyenne ${rating.average.toFixed(1)}/5`
              : "Soyez le premier à donner votre avis"}
          </p>
        </div>
        <ProductReviewAction
          isAuthenticated={isAuthenticated}
          hasReview={Boolean(myReview)}
          isFormOpen={isFormOpen}
          eligibility={eligibility}
          onOpenForm={() => setIsFormOpen(true)}
        />
      </header>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-xs font-medium text-red-600">{error}</p>
        </div>
      )}

      <ProductReviewInformation
        isAuthenticated={isAuthenticated}
        eligibility={eligibility}
      />
      {rating.count > 0 && (
        <ProductReviewSummary
          average={rating.average}
          count={rating.count}
          distribution={rating.distribution}
        />
      )}

      {isFormOpen && !myReview && eligibility.reason === "eligible" && user && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <h4 className="text-sm font-black text-lurevia-dark uppercase tracking-wider mb-4">
            Écrire un avis
          </h4>
          <ProductReviewForm
            isSubmitting={isSubmitting}
            onSubmit={(data) =>
              void runAction(
                () => addReview(productId, data),
                () => setIsFormOpen(false),
              )
            }
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      )}

      {editingId && myReview && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <h4 className="text-sm font-black text-lurevia-dark uppercase tracking-wider mb-4">
            Modifier votre avis
          </h4>
          <ProductReviewForm
            initial={myReview}
            isSubmitting={isSubmitting}
            onSubmit={(data) =>
              void runAction(
                () => updateReview(editingId, productId, data),
                () => setEditingId(null),
              )
            }
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}

      <ProductReviewEntries
        reviews={reviews}
        isLoading={isLoading}
        currentUserId={user?.id}
        onEdit={setEditingId}
        onDelete={handleDelete}
      />
    </section>
  );
};
