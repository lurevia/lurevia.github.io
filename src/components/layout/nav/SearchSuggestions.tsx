import type { FC } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Star } from "lucide-react";
import type { Product } from "../../../bin/types/homeType";
import { formatAriary } from "../../../bin/utils/formatAriary";
import { getProductMainImage } from "../../../bin/utils/getProductImages";
import { useProductRating } from "../../../hooks/useProductRating";
import { ProductImage } from "../../common/ProductImage";


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
            {suggestions.map((product, index) => (
              <SuggestionItem
                key={product.id}
                product={product}
                isActive={index === activeIndex}
                onSelect={onSelect}
              />
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

/** 🎯 Chaque suggestion est un composant pour pouvoir utiliser un hook */
type SuggestionItemProps = {
  product: Product;
  isActive: boolean;
  onSelect: () => void;
};

const SuggestionItem: FC<SuggestionItemProps> = ({
  product,
  isActive,
  onSelect,
}) => {
  /** Note réelle ou fallback mock */
  const { rating } = useProductRating(
    product.id,
    product.rating ?? 0,
    product.reviewCount ?? 0
  );

  return (
    <li>
      <Link
        to={`/produit/${product.id}`}
        onClick={onSelect}
        role="option"
        aria-selected={isActive}
        className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
          isActive ? "bg-slate-50" : "hover:bg-slate-50"
        }`}
      >
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
          <ProductImage
            src={getProductMainImage(product)}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">
            {product.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-400 truncate">
              {product.categorySlugs[0]?.replace(/-/g, " ") ?? "Produit"}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-bold text-slate-700 shrink-0">
              {formatAriary(product.price)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {rating > 0 && (
            <div className="flex items-center gap-0.5">
              <Star
                size={11}
                className="fill-lurevia-yellow text-lurevia-yellow stroke-none"
              />
              <span className="text-[10px] font-bold text-slate-500">
                {rating.toFixed(1)}
              </span>
            </div>
          )}
          {isActive && (
            <ArrowRight size={14} className="text-lurevia-orange" />
          )}
        </div>
      </Link>
    </li>
  );
};