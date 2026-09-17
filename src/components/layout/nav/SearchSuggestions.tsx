import type { FC } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import type { Product } from "../../../bin/types/homeType";
import { formatAriary } from "../../../bin/utils/formatAriary";


type SearchSuggestionsProps = {
  query: string;
  suggestions: Product[];
  totalResults: number;
  activeIndex: number;
  onSelect: () => void;
};

export const SearchSuggestions: FC<SearchSuggestionsProps> = ({
  query,
  suggestions,
  totalResults,
  activeIndex,
  onSelect,
}) => {
  const hasResults = suggestions.length > 0;

  return (
    <div
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fadeIn"
      role="listbox"
    >
      {hasResults ? (
        <>
          <ul className="py-2 max-h-90 overflow-y-auto">
            {suggestions.map((product, index) => {
              const isActive = index === activeIndex;

              return (
                <li key={product.id}>
                  <Link
                    to={`/produit/${product.id}`}
                    onClick={onSelect}
                    role="option"
                    aria-selected={isActive}
                    className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                      isActive ? "bg-slate-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-100"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {product.title}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {product.categorySlugs[0]?.replace(/-/g, " ") ??
                          "Produit"}{" "}
                        · {formatAriary(product.price)}
                      </p>
                    </div>

                    {isActive && (
                      <ArrowRight
                        size={14}
                        className="text-lurevia-orange shrink-0"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            to={`/search?q=${encodeURIComponent(query)}`}
            onClick={onSelect}
            className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50 hover:bg-slate-100 transition-colors"
          >
            <span className="text-xs font-bold text-slate-700">
              Voir tous les résultats pour “{query}”
            </span>
            <span className="text-[11px] font-bold text-lurevia-orange bg-orange-50 px-2 py-0.5 rounded-full">
              {totalResults}
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
          <p className="text-xs text-slate-400 mt-1">
            Essayez un autre mot-clé.
          </p>
        </div>
      )}
    </div>
  );
};