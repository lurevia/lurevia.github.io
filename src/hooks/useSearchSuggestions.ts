import { useEffect, useState } from "react";
import { productsApi } from "../api/products";
import { FALLBACK_IMAGE } from "../bin/utils/constant/assets";
import { safeImageUrl, sanitizeText } from "../bin/utils/security";

const MIN_QUERY_LENGTH = 2;
const MAX_SUGGESTIONS = 5;
const DEBOUNCE_MS = 250;

export type SearchSuggestion = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
};

export type SearchSuggestionsReturn = {
  suggestions: SearchSuggestion[];
  isLoading: boolean;
  hasResults: boolean;
};

/**
 * Suggestions de recherche servies par l'API, avec anti-rebond : on
 * n'envoie une requête qu'après une courte pause de frappe, et toute
 * requête devenue obsolète est annulée.
 */
export const useSearchSuggestions = (rawQuery: string): SearchSuggestionsReturn => {
  const query = rawQuery.trim();
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const results = await productsApi.suggestions(
          query,
          MAX_SUGGESTIONS,
          controller.signal
        );
        if (controller.signal.aborted) return;

        setSuggestions(
          results.map((item) => ({
            id: item.id,
            title: sanitizeText(item.title, 200),
            price: item.price,
            imageUrl: safeImageUrl(item.imageUrl) ?? FALLBACK_IMAGE,
          }))
        );
      } catch {
        if (!controller.signal.aborted) setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return { suggestions, isLoading, hasResults: suggestions.length > 0 };
};
