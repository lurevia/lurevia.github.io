import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  MessageSquareHeart,
  Star,
} from "lucide-react";
import type { ProductReview } from "../../bin/types/reviewType";
import { Button } from "../../components/ui/Button";
import { MyFeedbackCard } from "./MyFeedbackCard";
import { MyReviewCard } from "./MyReviewCard";
import { PendingReviewCard } from "./PendingReviewCard";
import type { ReviewableProduct } from "./reviewableProduct";

export type UserReviewTab = "pending" | "product-reviews" | "service-feedback";

export type PendingReview = {
  product: ReviewableProduct;
  daysRemaining: number;
  availableAt: string;
};

type UserReviewContentProps = {
  tab: UserReviewTab;
  pendingReviews: PendingReview[];
  productReviews: { review: ProductReview; product: ReviewableProduct }[];
  feedbacks: Parameters<typeof MyFeedbackCard>[0]["feedback"][];
  onDeleteReview: (reviewId: string, productId: string) => void;
  onDeleteFeedback: (feedbackId: string) => void;
};

export const UserReviewContent = ({
  tab,
  pendingReviews,
  productReviews,
  feedbacks,
  onDeleteReview,
  onDeleteFeedback,
}: UserReviewContentProps) => {
  if (tab === "pending") {
    return pendingReviews.length === 0 ? (
      <EmptyState
        icon={CheckCircle2}
        title="Aucun avis en attente"
        description="Tous vos avis produits ont été donnés."
        ctaLabel="Continuer mes achats"
        ctaTo="/boutique"
      />
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {pendingReviews.map((item) => (
          <PendingReviewCard
            key={item.product.id}
            product={item.product}
            daysRemaining={item.daysRemaining}
            availableAt={item.availableAt}
          />
        ))}
      </div>
    );
  }

  if (tab === "product-reviews") {
    return productReviews.length === 0 ? (
      <EmptyState
        icon={Star}
        title="Aucun avis produit"
        description="Vos avis sur les produits achetés apparaîtront ici."
        ctaLabel="Voir mes commandes"
        ctaTo="/compte/commandes"
      />
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {productReviews.map(({ review, product }) => (
          <MyReviewCard
            key={review.id}
            review={review}
            product={product}
            onDelete={() => onDeleteReview(review.id, product.id)}
          />
        ))}
      </div>
    );
  }

  return feedbacks.length === 0 ? (
    <EmptyState
      icon={MessageSquareHeart}
      title="Aucun feedback service"
      description="Dites-nous comment nous améliorer : livraison, service client, site web…"
      ctaLabel="Donner un feedback"
      ctaTo="/feedback"
    />
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {feedbacks.map((feedback) => (
        <MyFeedbackCard
          key={feedback.id}
          feedback={feedback}
          to="/feedback"
          onDelete={() => onDeleteFeedback(feedback.id)}
        />
      ))}
    </div>
  );
};

const EmptyState = ({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaTo,
}: {
  icon: typeof Star;
  title: string;
  description: string;
  ctaLabel: string;
  ctaTo: string;
}) => (
  <div className="text-center py-16 md:py-20 max-w-md mx-auto">
    <div className="inline-flex p-6 bg-slate-50 rounded-full mb-5">
      <Icon size={40} className="text-slate-300" strokeWidth={1.5} />
    </div>
    <h2 className="text-lg font-black text-lurevia-dark">{title}</h2>
    <p className="text-sm text-slate-500 mt-2">{description}</p>
    <Link to={ctaTo} className="inline-block mt-5">
      <Button
        variant="primary"
        className="rounded-full! px-6! py-3!"
        icon={ArrowRight}
        iconPosition="right"
      >
        {ctaLabel}
      </Button>
    </Link>
  </div>
);
