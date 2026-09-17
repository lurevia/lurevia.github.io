import type { FC } from "react";

import { ChevronDown } from "lucide-react";
import type { SortOption } from "../../bin/types/shopType";
import { SORT_OPTIONS } from "../../bin/utils/constant/shopFilter";

type SortDropdownProps = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

export const SortDropdown: FC<SortDropdownProps> = ({ value, onChange }) => {
  const activeLabel = SORT_OPTIONS.find((opt) => opt.value === value)?.label || "Plus récents";

  return (

    <div className="relative flex items-center bg-white border border-slate-200 rounded-full h-10 md:h-11 px-4 gap-1.5 shadow-xs hover:border-slate-300 transition-colors">
      
      <span className="text-xs font-black text-lurevia-dark font-sans select-none shrink-0">
        Trier par :
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        aria-label="Options de tri des produits"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <span className="text-xs font-semibold text-slate-500 truncate pointer-events-none">
        {activeLabel}
      </span>
      <ChevronDown size={14} className="text-slate-500 shrink-0 pointer-events-none stroke-[2.5]" />
      
    </div>
  );
};
