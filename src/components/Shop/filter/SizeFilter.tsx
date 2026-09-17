import type { FC } from "react";
import type { FilterState, Size } from "../../../bin/types/shopType";
import { SIZES } from "../../../bin/utils/constant/shopFilter";
import { FilterBlock } from "./FilterBlock";

type SizeFilterProps = {
  filters: FilterState;
  onChange: (next: FilterState) => void;
};

export const SizeFilter: FC<SizeFilterProps> = ({ filters, onChange }) => {
  const toggle = (size: Size) => {
    const next = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onChange({ ...filters, sizes: next });
  };

  return (
    <FilterBlock title="Taille">
      <div className="flex flex-wrap gap-2 pt-1">
        {SIZES.map((size) => {
          const active = filters.sizes.includes(size);
          return (
            <button
              key={size}
              type="button"
              onClick={() => toggle(size)}
              className={`min-w-11 h-9 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                active
                  ? "bg-lurevia-dark text-white border-lurevia-dark shadow-xs scale-105"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </FilterBlock>
  );
};