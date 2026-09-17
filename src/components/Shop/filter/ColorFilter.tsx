import type { FC } from "react";
import type { FilterState } from "../../../bin/types/shopType";
import { COLORS } from "../../../bin/utils/constant/shopFilter";
import { FilterBlock } from "./FilterBlock";

type ColorFilterProps = {
  filters: FilterState;
  onChange: (next: FilterState) => void;
};

export const ColorFilter: FC<ColorFilterProps> = ({ filters, onChange }) => {
  const toggle = (hex: string) => {
    const next = filters.colors.includes(hex)
      ? filters.colors.filter((c) => c !== hex)
      : [...filters.colors, hex];
    onChange({ ...filters, colors: next });
  };

  return (
    <FilterBlock title="Couleur">
      <div className="flex flex-wrap gap-2.5 pt-1">
        {COLORS.map(({ label, hex }) => {
          const active = filters.colors.includes(hex);
          return (
            <button
              key={hex}
              type="button"
              onClick={() => toggle(hex)}
              aria-label={label}
              title={label}
              className={`h-6 w-6 rounded-full border-2 transition-all cursor-pointer relative flex items-center justify-center ${active
                  ? "border-lurevia-orange scale-110 ring-2 ring-orange-100"
                  : "border-slate-100 shadow-xs hover:scale-105"
                }`}
              style={{ backgroundColor: hex }}
            >
              {active && (
                <span className="w-1.5 h-1.5 bg-white rounded-full shadow-xs mix-blend-difference" />
              )}
            </button>
          );
        })}
      </div>
    </FilterBlock>
  );
};