import type { FC } from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import { useFavorite } from "../../hooks/useFavorite";
import { ScrollReveal } from "../../components/common/ScrollReveal";
import { ProductCard } from "../../components/home/ProductCard";
import { Button } from "../../components/ui/Button";

export const AccountFavoritesPage: FC = () => {
  const { favorites, totalFavorites } = useFavorite();

  return (
    <>
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-lurevia-dark">
          Mes favoris
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {totalFavorites} coup{totalFavorites > 1 ? "s" : ""} de cœur
        </p>
      </div>

      {totalFavorites === 0 ? (
        <div className="text-center py-16 md:py-20 max-w-md mx-auto">
          <div className="inline-flex p-6 bg-red-50 rounded-full mb-5">
            <Heart size={40} className="text-red-300" strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-black text-lurevia-dark">
            Aucun favori
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Ajoutez des produits en cliquant sur le cœur.
          </p>
          <Link to="/boutique" className="inline-block mt-5">
            <Button variant="primary" className="rounded-full! px-6! py-3!" icon={ArrowRight} iconPosition="right">
              Découvrir la boutique
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {favorites.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 60}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </>
  );
};