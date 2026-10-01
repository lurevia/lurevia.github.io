import { type FC, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
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
    <section className="mx-auto max-w-7xl px-3 py-8 sm:px-6 md:py-12">
      <div
        className={[
          "relative overflow-hidden bg-[#10243e]",
          "px-4 py-7 shadow-[0_28px_80px_-36px_rgba(16,36,62,0.8)]",
          "sm:px-7 md:px-9 md:py-9",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-36 left-1/3 h-72 w-72 bg-sky-500/10 blur-3xl" />
        <div className="relative z-10 mb-6 flex items-end justify-between gap-4 border-b border-white/10 pb-5 md:mb-8">
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-orange-300">
              <Sparkles size={14} />
              Sélection Lurevia
            </p>
            <h2 className="text-xl font-black uppercase tracking-tight text-white md:text-3xl">
              Produits populaires
            </h2>
            <p className="hidden max-w-xl text-sm text-stone-300 md:block">
              Nos découvertes et créations préférées, sélectionnées pour vous.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link to="/boutique" className="flex items-center">
              <span className="mr-2 text-xs font-bold text-orange-200 transition hover:text-white md:hidden">
                Voir tout
              </span>
              <span className="hidden md:block">
                <Button
                  variant="secondary"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="rounded-full! border-orange-400/40! bg-white/10! px-5! py-3! text-white! hover:bg-white/20!"
                >
                  Toute la boutique
                </Button>
              </span>
            </Link>
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                type="button"
                variant="primary"
                size="icon"
                icon={ChevronLeft}
                onClick={() => scroll("left")}
                aria-label="Produits précédents"
                className="h-10! w-10! rounded-full! border border-white/20! bg-white/10! text-white! hover:bg-orange-600!"
              />
              <Button
                type="button"
                variant="primary"
                size="icon"
                icon={ChevronRight}
                onClick={() => scroll("right")}
                aria-label="Produits suivants"
                className="h-10! w-10! rounded-full! border border-white/20! bg-white/10! text-white! hover:bg-orange-600!"
              />
            </div>
          </div>
        </div>

        <div className="relative z-10">
          {isLoading ? (
            <div className="flex justify-center py-16" role="status">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-orange-400" />
              <span className="sr-only">Chargement des produits</span>
            </div>
          ) : topProducts.length === 0 ? (
            <p className="py-12 text-center text-sm text-stone-300">
              Aucun produit disponible pour le moment.
            </p>
          ) : (
            <>
              <ProductMobile products={topProducts} />
              <ProductDesktop products={topProducts} carouselRef={carouselRef} />
            </>
          )}
        </div>
      </div>
    </section>
  );
};