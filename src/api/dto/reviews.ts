export type ReviewDto = {
  id: string;
  productId: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RatingDto = {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

export type EligibilityDto = {
  canReview: boolean;
  reason:
    | "eligible"
    | "already_reviewed"
    | "not_purchased"
    | "waiting"
    | "not_logged_in";
  availableAt?: string;
  daysRemaining?: number;
};
