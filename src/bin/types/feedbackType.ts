export type ServiceRatingCriteria =
    | "delivery"
    | "customerService"
    | "website"
    | "productQuality";

export interface ServiceFeedback {
    id: string;
    userId: string;
    userName: string;
    overallRating: number;
    criteria?: Partial<Record<ServiceRatingCriteria, number>>;
    category: "delivery" | "payment" | "support" | "website" | "other";
    comment: string;
    createdAt: string;
    updatedAt: string;
    teamResponse?: string;
}

export interface FeedbackContextType {
    myFeedbacks: ServiceFeedback[];
    allFeedbacks: ServiceFeedback[];
    addFeedback: (
        data: Omit<ServiceFeedback, "id" | "createdAt" | "updatedAt" | "userId" | "userName">
    ) => void;
    updateFeedback: (id: string, data: Partial<ServiceFeedback>) => void;
    deleteFeedback: (id: string) => void;
    averageRating: number;
}