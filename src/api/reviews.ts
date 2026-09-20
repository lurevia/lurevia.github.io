import { api } from "./http";
import { toReview } from "./mappers";
import type { EligibilityDto, RatingDto, ReviewDto } from "./dto";
import type {
  ProductRating,
  ProductReview,
  ReviewEligibility,
  ReviewInput,
} from "../bin/types/reviewType";

const EMPTY_RATING: ProductRating = {
  average: 0,
  count: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

export const reviewsApi = {
  async listForProduct(productId: string, signal?: AbortSignal): Promise<ProductReview[]> {
    const data = await api.get<{ reviews: ReviewDto[] }>(
      `/products/${encodeURIComponent(productId)}/reviews`,
      { auth: false, signal }
    );
    return (data?.reviews ?? []).map(toReview);
  },

  async rating(productId: string, signal?: AbortSignal): Promise<ProductRating> {
    const data = await api.get<RatingDto>(
      `/products/${encodeURIComponent(productId)}/reviews/rating`,
      { auth: false, signal }
    );
    if (!data) return EMPTY_RATING;
    return {
      average: data.average ?? 0,
      count: data.count ?? 0,
      distribution: data.distribution ?? EMPTY_RATING.distribution,
    };
  },

  async eligibility(productId: string, signal?: AbortSignal): Promise<ReviewEligibility> {
    const data = await api.get<EligibilityDto>(
      `/products/${encodeURIComponent(productId)}/reviews/eligibility`,
      { signal }
    );
    return data ?? { canReview: false, reason: "not_logged_in" };
  },

  async mine(productId: string, signal?: AbortSignal): Promise<ProductReview | null> {
    const data = await api.get<{ review: ReviewDto | null }>(
      `/products/${encodeURIComponent(productId)}/reviews/me`,
      { signal }
    );
    return data?.review ? toReview(data.review) : null;
  },

  async create(productId: string, input: ReviewInput): Promise<ProductReview> {
    const data = await api.post<{ review: ReviewDto }>(
      `/products/${encodeURIComponent(productId)}/reviews`,
      { rating: input.rating, title: input.title, comment: input.comment }
    );
    return toReview(data.review);
  },

  async update(reviewId: string, input: Partial<ReviewInput>): Promise<ProductReview> {
    const data = await api.patch<{ review: ReviewDto }>(
      `/reviews/${encodeURIComponent(reviewId)}`,
      input
    );
    return toReview(data.review);
  },

  remove(reviewId: string): Promise<void> {
    return api.delete<void>(`/reviews/${encodeURIComponent(reviewId)}`);
  },
};

export { EMPTY_RATING };
