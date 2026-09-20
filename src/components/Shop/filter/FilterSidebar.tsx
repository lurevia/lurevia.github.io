import type { FC } from "react";
import { RotateCcw } from "lucide-react";
import type { FilterState } from "../../../bin/types/shopType";
import { CategoryFilter } from "./CategoryFilter";
import { PriceFilter } from "./PriceFilter";
import { SizeFilter } from "./SizeFilter";
import { ColorFilter } from "./ColorFilter";
import { AvailabilityFilter } from "./AvailabilityFilter";

export type FilterSidebarProps = {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
  categories: { slug: string; name: string }[];
  isGlobalShop: boolean;
};

export const FilterSidebar: FC<FilterSidebarProps> = (props) => {
  const { filters, onChange, onReset, isGlobalShop } = props;

  return (
    <aside className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6 text-left">
      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
        <h2 className="text-sm font-black text-lurevia-dark uppercase tracking-wider">
          Filtres
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-lurevia-orange transition-colors cursor-pointer"
        >
          <RotateCcw size={13} strokeWidth={2.5} />
          Réinitialiser
        </button>
      </div>

      {isGlobalShop && (
        <CategoryFilter
          filters={filters}
          onChange={onChange}
          categories={props.categories}
        />
      )}
      <PriceFilter filters={filters} onChange={onChange} />
      <SizeFilter filters={filters} onChange={onChange} />
      <ColorFilter filters={filters} onChange={onChange} />
      <AvailabilityFilter filters={filters} onChange={onChange} />
    </aside>
  );
};