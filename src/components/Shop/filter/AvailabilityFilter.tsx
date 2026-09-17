import type { FC } from "react";
import type { FilterState, Availability } from "../../../bin/types/shopType";
import { FilterBlock } from "./FilterBlock";

type AvailabilityFilterProps = {
  filters: FilterState;
  onChange: (next: FilterState) => void;
};

const OPTIONS: { value: Availability; label: string }[] = [
  { value: "all", label: "Tout" },
  { value: "in-stock", label: "En stock" },
  { value: "out-of-stock", label: "En rupture" },
];

export const AvailabilityFilter: FC<AvailabilityFilterProps> = ({
  filters,
  onChange,
}) => {
  return (
    <FilterBlock title="Disponibilité">
      <ul className="space-y-3">
        {OPTIONS.map((opt) => (
          <li key={opt.value}>
            <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-slate-600 hover:text-lurevia-dark select-none">
              <input
                type="radio"
                name="availability"
                checked={filters.availability === opt.value}
                onChange={() =>
                  onChange({ ...filters, availability: opt.value })
                }
                className="accent-lurevia-orange h-4 w-4 cursor-pointer"
              />
              {opt.label}
            </label>
          </li>
        ))}
      </ul>
    </FilterBlock>
  );
};