import type { FC } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { useFavoritePage } from "../hooks/useFavoritePage";
import { FavoritesHeader } from "../components/favorites/FavoritesHeader";
import { FavoritesEmpty } from "../components/favorites/FavoritesEmpty";
import { FavoritesGrid } from "../components/favorites/FavoritesGrid";
import { CartSuggestions } from "../components/cart/CartSuggestions";

export const FavoritesPage: FC = () => {
  const {
    favorites,
    totalFavorites,
    isEmpty,
    clearFavorites,
    addAllToCart,
    isAddingAll,
    lastAddedCount,
  } = useFavoritePage();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-8 pb-28 md:pb-16">
      <Link
        to="/boutique"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-lurevia-dark transition-colors uppercase tracking-wider"
      >
        <ArrowLeft size={14} />
        Continuer mes achats
      </Link>

      {/* En-tête */}
      <FavoritesHeader
        totalFavorites={totalFavorites}
        onClearAll={clearFavorites}
        onAddAllToCart={addAllToCart}
        isAddingAll={isAddingAll}
        lastAddedCount={lastAddedCount}
      />

      {/* Contenu */}
      {isEmpty ? (
        <FavoritesEmpty />
      ) : (
        <>
          <FavoritesGrid products={favorites} />

          <div className="pt-8">
            <CartSuggestions
              cartItems={favorites.map((p) => ({ product: p, quantity: 1 }))}
              limit={4}
            />
          </div>
        </>
      )}
    </div>
  );
};