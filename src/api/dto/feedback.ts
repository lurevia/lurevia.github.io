export type FeedbackDto = {
  id: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  overallRating: number;
  criteria?: Record<string, number>;
  category: "delivery" | "payment" | "support" | "website" | "other";
  comment: string;
  teamResponse?: string;
  createdAt: string;
  updatedAt: string;
};
