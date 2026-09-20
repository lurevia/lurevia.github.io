import { type FC, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/Button";
import { ProductDesktop } from "./desktop/ProductDesktop";
import { ProductMobile } from "./mobile/ProductMobile";
import { useTopProducts } from "../../hooks/useTopProducts";
import { useProductsWithStats } from "../../hooks/useProductsWithStats";
import type { Product } from "../../bin/types/homeType";

type ProductGridProps = {
  products?: Product[];
  limit?: number;
  isLoading?: boolean;
};

export const ProductGrid: FC<ProductGridProps> = ({
  products = [],
  limit = 10,
  isLoading = false,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardWidth = 324;

  const productsWithStats = useProductsWithStats(products);

  const topProducts = useTopProducts(productsWithStats, limit);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12">
      <div className="flex items-center justify-between mb-6 md:mb-8 pb-3 border-b border-slate-100 gap-4">
        <div className="space-y-0.5 flex-1">
          <h2 className="text-lg md:text-2xl font-black tracking-tight text-lurevia-dark uppercase">
            Popular Products
          </h2>
          <p className="text-xs font-medium text-slate-500 tracking-wide hidden md:block">
            Nos meilleures ventes, sélectionnées avec soin pour Madagascar.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 select-none">
          <Link to="/boutique" className="flex items-center">
            <span className="md:hidden text-xs font-bold text-lurevia-dark hover:text-lurevia-orange transition-colors">
              View all
            </span>
            <div className="hidden md:block">
              <Button
                variant="secondary"
                icon={ArrowRight}
                iconPosition="right"
                className="px-6! py-3! rounded-full! font-bold text-xs shadow-none hover:shadow-xs"
              >
                Voir toute la boutique
              </Button>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1.5 border-l border-slate-200 pl-4">
            <Button
              type="button"
              variant="primary"
              size="icon"
              icon={ChevronLeft}
              onClick={() => scroll("left")}
              aria-label="Défiler à gauche"
              className="bg-slate-100! text-slate-700! hover:bg-lurevia-dark! hover:text-white! w-9! h-9!"
            />
            <Button
              type="button"
              variant="primary"
              size="icon"
              icon={ChevronRight}
              onClick={() => scroll("right")}
              aria-label="Défiler à droite"
              className="bg-slate-100! text-slate-700! hover:bg-lurevia-dark! hover:text-white! w-9! h-9!"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16" role="status">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-lurevia-orange" />
          <span className="sr-only">Chargement des produits</span>
        </div>
      ) : topProducts.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400">
          Aucun produit disponible pour le moment.
        </p>
      ) : (
        <>
          <ProductMobile products={topProducts} />
          <ProductDesktop products={topProducts} carouselRef={carouselRef} />
        </>
      )}
    </section>
  );
};