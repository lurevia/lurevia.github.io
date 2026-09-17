import React from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { formatAriary } from "../../bin/utils/formatAriary";
import { Button } from "../ui/Button";
import { useCart } from "../../hooks/useCart";
import { useFavorite } from "../../hooks/useFavorite";
import type { Product } from "../../bin/types/homeType";

type ProductCardProps = {
  product: Product;
};

export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
  const { id, title, categorySlugs, price, imageUrl, rating = 4.7 } = product;
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorite();
  
  const isFav = isFavorite(id);
  
  const handleFavoriteClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    toggleFavorite(product);
  }, [product, toggleFavorite]);
  
  const handleAddToCart = React.useCallback((): void => addToCart(product), [addToCart, product]);

  const displayCategory = categorySlugs && categorySlugs.length > 0 
    ? categorySlugs[0].replace(/-/g, " ") 
    : "Produit";

  return (
    <article className="bg-white md:border md:border-slate-100 rounded-2xl overflow-hidden md:shadow-xs p-2 md:p-4 flex flex-col justify-between h-full transition-all duration-300 md:hover:shadow-md md:hover:border-slate-200/80">
      <div className="space-y-2 md:space-y-3">
        <div className="relative w-full h-40 sm:h-44 md:h-48 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center">
          <Button
            type="button"
            icon={Heart}
            onClick={handleFavoriteClick}
            aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
            className={`absolute top-2 right-2 w-8 h-8 md:w-9 md:h-9 p-0! rounded-full! shadow-xs border-transparent! bg-white/90! backdrop-blur-md! hover:scale-110! hover:bg-white! z-10 ${
              isFav
                ? "text-red-500! [&_svg]:fill-red-500!"
                : "text-slate-400! hover:text-red-500!"
            }`}
          />

          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 md:hover:scale-105"
            onError={(event: React.SyntheticEvent<HTMLImageElement>) => {
              const image = event.currentTarget;
              image.onerror = null;
              image.src = "/images/logo.jpeg";
            }}
          />
        </div>

        <div className="space-y-1 text-left">
          <span className="hidden md:block text-[10px] font-bold text-lurevia-cyan uppercase tracking-wider">
            {displayCategory}
          </span>
          
          <h3 className="font-bold text-xs md:text-sm text-slate-800 truncate md:line-clamp-2 md:min-h-10 leading-tight">
            {title}
          </h3>
          
          <div className="flex items-center justify-between pt-0.5">
            <p className="text-sm md:text-base font-extrabold text-slate-900">
              {formatAriary(price)}
            </p>
            
            <div className="flex items-center gap-0.5 text-xs font-bold text-lurevia-yellow shrink-0">
              <Star size={12} className="fill-lurevia-yellow stroke-none" />
              <span className="text-slate-500 text-[10px] md:text-xs pt-0.5">{rating}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block mt-4 pt-0.5">
        <Button
          onClick={handleAddToCart}
          variant="primary"
          icon={ShoppingCart}
          iconPosition="left"
          className="w-full py-3! rounded-xl! font-bold text-xs shadow-none hover:shadow-xs"
        >
          Mettre au panier
        </Button>
      </div>

    </article>
  );
});
