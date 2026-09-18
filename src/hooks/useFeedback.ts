import { useContext } from "react";
import { FeedbackContext } from "../context/feedbackContextDefinition";

export const useFeedback = () => {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback doit être utilisé dans un FeedbackProvider");
  return ctx;
};