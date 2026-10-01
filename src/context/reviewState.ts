import { EMPTY_RATING } from "../api/reviews";
import type {
  ProductRating,
  ProductReview,
  ReviewEligibility,
} from "../bin/types/reviewType";

export type ProductReviewsState = {
  reviews: ProductReview[];
  rating: ProductRating;
  eligibility: ReviewEligibility;
  mine: ProductReview | null;
  isLoading: boolean;
};

export const DEFAULT_PRODUCT_REVIEWS: ProductReviewsState = {
  reviews: [],
  rating: EMPTY_RATING,
  eligibility: { canReview: false, reason: "not_logged_in" },
  mine: null,
  isLoading: false,
};
