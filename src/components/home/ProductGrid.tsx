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
          "relative overflow-hidden rounded-2xl border border-slate-100 bg-white",
          "px-4 py-7",
          "sm:px-7 md:px-9 md:py-9",
        ].join(" ")}
      >
        <div className="relative z-10 mb-6 flex items-end justify-between gap-4 border-b border-slate-100 pb-5 md:mb-8">
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-lurevia-orange">
              <Sparkles size={14} />
              Sélection Lurevia
            </p>
            <h2 className="text-xl font-black uppercase tracking-tight text-lurevia-dark md:text-3xl">
              Produits populaires
            </h2>
            <p className="hidden max-w-xl text-sm text-slate-500 md:block">
              Nos découvertes et créations préférées, sélectionnées pour vous.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link to="/boutique" className="flex items-center">
              <span className="mr-2 text-xs font-bold text-lurevia-dark transition hover:text-lurevia-orange md:hidden">
                Voir tout
              </span>
              <span className="hidden md:block">
                <Button
                  variant="secondary"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="rounded-full! border-slate-200! bg-white! px-5! py-3! text-lurevia-dark! hover:bg-slate-50!"
                >
                  Toute la boutique
                </Button>
              </span>
            </Link>
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                icon={ChevronLeft}
                onClick={() => scroll("left")}
                aria-label="Produits précédents"
                className="h-10! w-10! rounded-full! border border-slate-200! bg-white! text-slate-600! hover:bg-slate-50!"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                icon={ChevronRight}
                onClick={() => scroll("right")}
                aria-label="Produits suivants"
                className="h-10! w-10! rounded-full! border border-slate-200! bg-white! text-slate-600! hover:bg-slate-50!"
              />
            </div>
          </div>
        </div>

        <div className="relative z-10">
          {isLoading ? (
            <div className="flex justify-center py-16" role="status">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-lurevia-orange" />
              <span className="sr-only">Chargement des produits</span>
            </div>
          ) : topProducts.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">
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