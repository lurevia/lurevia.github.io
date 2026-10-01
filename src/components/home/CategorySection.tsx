import type { FC } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { CategoryDesktop } from "./desktop/CategoryDesktop";
import { CategoryMobile } from "./mobile/CategoryMobile";
import { useCategories } from "../../hooks/useCategories";

export const CategorySection: FC = () => {
  const { categories, isLoading, error } = useCategories();

  if (isLoading || categories.length === 0) {
    return error ? (
      <section className="mx-auto max-w-7xl px-4 py-8" role="alert">
        <p className="text-sm text-stone-600">{error}</p>
      </section>
    ) : null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-12">
      <div className="mb-6 flex items-end justify-between border-b border-stone-200 pb-3 md:mb-8">
        <div className="space-y-0.5">
          <h2 className="text-lg md:text-2xl font-black tracking-tight text-lurevia-dark uppercase">
            Catégories
          </h2>
          <p className="hidden text-xs font-medium tracking-wide text-stone-500 md:block">
            Découvrez nos univers, pensés pour tous les goûts à Madagascar.
          </p>
        </div>

        <Link to="/categories" className="shrink-0 select-none">
          <span className="md:hidden text-xs font-bold text-lurevia-dark hover:text-lurevia-orange transition-colors">
            Voir tout
          </span>

          <div className="hidden md:block">
            <Button
              variant="secondary"
              icon={ArrowRight}
              iconPosition="right"
              className="px-6! py-3! rounded-full! font-bold text-xs shadow-none hover:shadow-xs"
            >
              Voir toutes les catégories
            </Button>
          </div>
        </Link>
      </div>
      <CategoryMobile />
      <CategoryDesktop />
    </section>
  );
};