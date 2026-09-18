import { useContext } from "react";
import { ReviewsContext } from "../context/reviewsContextDefinition";

export const useReviews = () => {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews doit être utilisé dans un ReviewsProvider");
  return ctx;
};