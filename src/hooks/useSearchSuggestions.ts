import { useMemo } from "react";
import { MOCK_PRODUCTS } from "../bin/data/mock";
import type { Product } from "../bin/types/homeType";

const MAX_SUGGESTIONS = 5;
const MIN_QUERY_LENGTH = 2;

export type SearchSuggestionsReturn = {
  suggestions: Product[];
  totalResults: number;
  hasResults: boolean;
};

export const useSearchSuggestions = (
  rawQuery: string
): SearchSuggestionsReturn => {
  const query = rawQuery.trim().toLowerCase();

  const allMatches = useMemo(() => {
    if (query.length < MIN_QUERY_LENGTH) return [];

    return MOCK_PRODUCTS.filter((p) => {
      const title = p.title.toLowerCase();
      const categories = p.categorySlugs.join(" ").toLowerCase();
      return title.includes(query) || categories.includes(query);
    });
  }, [query]);

  const suggestions = useMemo(
    () => allMatches.slice(0, MAX_SUGGESTIONS),
    [allMatches]
  );

  return {
    suggestions,
    totalResults: allMatches.length,
    hasResults: allMatches.length > 0,
  };
};