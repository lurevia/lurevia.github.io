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

export type ProductRating = {
    average: number;
    count: number;
    distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

export type ReviewInput = {
    rating: number;
    title?: string;
    comment: string;
};

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

export interface ReviewsContextType {
    /** Charge (une seule fois) avis, note et éligibilité d'un produit. */
    loadProduct: (productId: string) => Promise<void>;
    /** Charge uniquement « mon avis » pour une liste de produits. */
    loadMyReviews: (productIds: string[]) => Promise<void>;
    isProductLoading: (productId: string) => boolean;

    getProductReviews: (productId: string) => ProductReview[];
    getUserReviewForProduct: (productId: string) => ProductReview | null;
    getProductRating: (productId: string) => ProductRating;
    checkEligibility: (productId: string) => ReviewEligibility;

    addReview: (productId: string, data: ReviewInput) => Promise<void>;
    updateReview: (reviewId: string, productId: string, data: Partial<ReviewInput>) => Promise<void>;
    deleteReview: (reviewId: string, productId: string) => Promise<void>;
}
