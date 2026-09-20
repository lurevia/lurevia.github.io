import type { FC } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";

import { formatAriary } from "../../../bin/utils/formatAriary";
import { ProductImage } from "../../common/ProductImage";
import type { SearchSuggestion } from "../../../hooks/useSearchSuggestions";

type SearchSuggestionsProps = {
  query: string;
  suggestions: SearchSuggestion[];
  isLoading: boolean;
  activeIndex: number;
  onSelect: () => void;
};

export const SearchSuggestions: FC<SearchSuggestionsProps> = ({
  query,
  suggestions,
  isLoading,
  activeIndex,
  onSelect,
}) => {
  const hasResults = suggestions.length > 0;

  return (
    <div
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fadeIn"
      role="listbox"
    >
      {isLoading && !hasResults ? (
        <div className="flex items-center justify-center py-8" role="status">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-lurevia-orange" />
          <span className="sr-only">Recherche en cours</span>
        </div>
      ) : hasResults ? (
        <>
          <ul className="py-2 max-h-90 overflow-y-auto">
            {suggestions.map((product, index) => (
              <li key={product.id}>
                <Link
                  to={`/produit/${product.id}`}
                  onClick={onSelect}
                  role="option"
                  aria-selected={index === activeIndex}
                  className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                    index === activeIndex ? "bg-slate-50" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                    <ProductImage
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {product.title}
                    </p>
                    <span className="text-xs font-bold text-slate-700">
                      {formatAriary(product.price)}
                    </span>
                  </div>

                  {index === activeIndex && (
                    <ArrowRight size={14} className="text-lurevia-orange shrink-0" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            to={`/search?q=${encodeURIComponent(query)}`}
            onClick={onSelect}
            className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50 hover:bg-slate-100 transition-colors"
          >
            <span className="text-xs font-bold text-slate-700">
              Voir tous les résultats pour “{query}”
            </span>
          </Link>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <div className="p-3 bg-slate-50 rounded-full mb-3">
            <Search size={20} className="text-slate-300" />
          </div>
          <p className="text-sm font-semibold text-slate-600">
            Aucun résultat pour “{query}”
          </p>
          <p className="text-xs text-slate-400 mt-1">Essayez un autre mot-clé.</p>
        </div>
      )}
    </div>
  );
};
