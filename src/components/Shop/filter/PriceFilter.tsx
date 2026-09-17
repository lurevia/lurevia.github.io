import type { FC } from "react";
import type { FilterState } from "../../../bin/types/shopType";
import { formatAriary } from "../../../bin/utils/formatAriary";
import { PRICE_MIN, PRICE_MAX } from "../../../bin/utils/constant/shopFilter";
import { FilterBlock } from "./FilterBlock";

type PriceFilterProps = {
  filters: FilterState;
  onChange: (next: FilterState) => void;
};

export const PriceFilter: FC<PriceFilterProps> = ({ filters, onChange }) => {
  const handleChange = (index: 0 | 1, value: number) => {
    const next: [number, number] = [...filters.priceRange] as [number, number];
    next[index] = value;
    if (index === 0 && value > next[1]) next[1] = value;
    if (index === 1 && value < next[0]) next[0] = value;
    onChange({ ...filters, priceRange: next });
  };

  return (
    <FilterBlock title="Prix (Ar)">
      <div className="space-y-4 pt-1">
        <div className="space-y-2">
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={5000}
            value={filters.priceRange[0]}
            onChange={(e) => handleChange(0, Number(e.target.value))}
            className="w-full accent-lurevia-orange cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
            aria-label="Prix minimum"
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={5000}
            value={filters.priceRange[1]}
            onChange={(e) => handleChange(1, Number(e.target.value))}
            className="w-full accent-lurevia-orange cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
            aria-label="Prix maximum"
          />
        </div>

        <div className="flex justify-between items-center text-[11px] font-bold text-slate-500">
          <span>{formatAriary(filters.priceRange[0])}</span>
          <span className="text-lurevia-orange bg-orange-50 px-2 py-0.5 rounded-md">
            {formatAriary(filters.priceRange[1])}
          </span>
        </div>
      </div>
    </FilterBlock>
  );
};