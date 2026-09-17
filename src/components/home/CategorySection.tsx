import type { FC } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { CategoryDesktop } from "./desktop/CategoryDesktop";
import { CategoryMobile } from "./mobile/CategoryMobile";

export const CategorySection: FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12">
      
      <div className="flex items-end justify-between mb-6 md:mb-8 pb-3 border-b border-slate-100">
        <div className="space-y-0.5">
          <h2 className="text-lg md:text-2xl font-black tracking-tight text-lurevia-dark uppercase">
            Categories
          </h2>
          <p className="text-xs font-medium text-slate-500 tracking-wide hidden md:block">
            Découvrez nos univers, pensés pour tous les goûts à Madagascar.
          </p>
        </div>

        <Link to="/categories" className="shrink-0 select-none">
          <span className="md:hidden text-xs font-bold text-lurevia-dark hover:text-lurevia-orange transition-colors">
            View all
          </span>
          <Button
            variant="secondary"
            icon={ArrowRight}
            iconPosition="right"
            className="hidden md:flex px-6! py-3! rounded-full! font-bold text-xs shadow-none hover:shadow-xs"
          >
            Voir toutes les catégories
          </Button>
        </Link>
      </div>

      <CategoryMobile />
      <CategoryDesktop />

    </section>
  );
};
