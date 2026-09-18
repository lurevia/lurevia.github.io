import { createContext } from "react";
import type { FeedbackContextType } from "../bin/types/feedbackType";

export const FeedbackContext = createContext<FeedbackContextType | undefined>(
  undefined
);