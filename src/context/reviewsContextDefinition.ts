import { createContext } from "react";
import type { ReviewsContextType } from "../bin/types/reviewType";

export const ReviewsContext = createContext<ReviewsContextType | undefined>(
    undefined
);