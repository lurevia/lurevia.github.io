export interface ProductReview {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    title?: string;
    comment: string;
    createdAt: string;
    updatedAt: string;
    isVerifiedPurchase: boolean;
}

export interface ReviewsContextType {
    getProductReviews: (productId: string) => ProductReview[];
    getUserReviewForProduct: (productId: string) => ProductReview | null;
    addReview: (
        data: Omit<ProductReview, "id" | "createdAt" | "updatedAt" | "isVerifiedPurchase">
    ) => void;
    updateReview: (reviewId: string, data: Partial<ProductReview>) => void;
    deleteReview: (reviewId: string) => void;
    getProductRating: (productId: string) => {
        average: number;
        count: number;
        distribution: Record<1 | 2 | 3 | 4 | 5, number>;
    };
    checkEligibility: (productId: string) => ReviewEligibility;

}


export interface ReviewEligibility {
    canReview: boolean;
    reason:
    | "eligible"
    | "already_reviewed"
    | "not_purchased"
    | "waiting"
    | "not_logged_in";
    availableAt?: string;
    daysRemaining?: number;
}
