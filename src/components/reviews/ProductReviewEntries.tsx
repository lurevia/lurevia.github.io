import { ProductReviewCard } from "./ProductReviewCard";
import type { ProductReview } from "../../bin/types/reviewType";

type ProductReviewEntriesProps = {
  reviews: ProductReview[];
  isLoading: boolean;
  currentUserId?: string;
  onEdit: (reviewId: string) => void;
  onDelete: (reviewId: string) => void;
};

export const ProductReviewEntries = ({
  reviews,
  isLoading,
  currentUserId,
  onEdit,
  onDelete,
}: ProductReviewEntriesProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12" role="status">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-lurevia-orange" />
        <span className="sr-only">Chargement des avis</span>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 text-xs">
        Aucun avis pour ce produit pour le moment.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const isOwn = currentUserId === review.userId;
        return (
          <ProductReviewCard
            key={review.id}
            review={review}
            isOwn={isOwn}
            onEdit={isOwn ? () => onEdit(review.id) : undefined}
            onDelete={
              isOwn
                ? () => {
                    if (window.confirm("Supprimer cet avis ?")) {
                      onDelete(review.id);
                    }
                  }
                : undefined
            }
          />
        );
      })}
    </div>
  );
};
