import type { FC } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "../../../hooks/useCategories";

export const CategoryMobile: FC = () => {
  const { categories } = useCategories();

  return (
    <div className="block md:hidden w-full overflow-x-auto overflow-y-hidden scrollbar-none snap-x snap-mandatory">
      <div className="flex gap-4 pb-2 w-max px-1">
        {categories.map((category) => {
          const Icon = category.icon;
          
          return (
            <Link 
              key={category.id} 
              to={`/categories/${category.slug || category.id}`}
              className="flex flex-col items-center gap-2 w-16 snap-start group"
            >
              <div className="w-16 h-16 rounded-2xl bg-lurevia-cyan/10 border border-lurevia-cyan/20 flex items-center justify-center shadow-xs transition-all duration-200 group-active:scale-95 group-active:bg-lurevia-cyan">
                {Icon ? (
                  <Icon size={24} className="text-lurevia-dark stroke-[1.75] group-active:text-white transition-colors" />
                ) : (
                  <span className="text-xs font-bold text-slate-400">?</span>
                )}
              </div>
              
              <span className="text-[11px] font-semibold text-lurevia-dark text-center tracking-wide group-hover:text-lurevia-orange transition-colors truncate w-full">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
