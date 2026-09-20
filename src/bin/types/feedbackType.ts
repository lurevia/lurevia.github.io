export type ServiceRatingCriteria =
    | "delivery"
    | "support"
    | "website"
    | "valueForMoney";

export type ServiceFeedbackCategory =
    | "delivery"
    | "payment"
    | "support"
    | "website"
    | "other";

export interface ServiceFeedback {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    overallRating: number;
    criteria?: Partial<Record<ServiceRatingCriteria, number>>;
    category: ServiceFeedbackCategory;
    comment: string;
    createdAt: string;
    updatedAt: string;
    teamResponse?: string;
}

export type FeedbackInput = {
    overallRating: number;
    category: ServiceFeedbackCategory;
    comment: string;
    criteria?: Partial<Record<ServiceRatingCriteria, number>>;
};

export interface FeedbackContextType {
    myFeedbacks: ServiceFeedback[];
    allFeedbacks: ServiceFeedback[];
    averageRating: number;
    totalCount: number;
    isLoading: boolean;
    error: string | null;

    addFeedback: (data: FeedbackInput) => Promise<void>;
    updateFeedback: (id: string, data: Partial<FeedbackInput>) => Promise<void>;
    deleteFeedback: (id: string) => Promise<void>;
    refresh: () => Promise<void>;
}
