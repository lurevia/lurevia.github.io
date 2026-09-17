import type { FC } from "react";
import type { FilterState } from "../../../bin/types/shopType";
import { FilterBlock } from "./FilterBlock";

type CategoryFilterProps = {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  categories: { slug: string; name: string }[];
  categoryCounts: Record<string, number>;
};

export const CategoryFilter: FC<CategoryFilterProps> = ({
  filters,
  onChange,
  categories,
  categoryCounts,
}) => {
  const toggle = (slug: string) => {
    const next = filters.categories.includes(slug)
      ? filters.categories.filter((s) => s !== slug)
      : [...filters.categories, slug];
    onChange({ ...filters, categories: next });
  };

  return (
    <FilterBlock title="Catégorie">
      <ul className="space-y-3">
        {categories.map((cat) => (
          <li key={cat.slug}>
            <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-slate-600 hover:text-lurevia-dark select-none">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.slug)}
                onChange={() => toggle(cat.slug)}
                className="rounded border-slate-300 text-lurevia-orange focus:ring-lurevia-orange h-4 w-4 cursor-pointer"
              />
              <span className="flex-1 truncate">{cat.name}</span>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                ({categoryCounts[cat.slug] ?? 0})
              </span>
            </label>
          </li>
        ))}
      </ul>
    </FilterBlock>
  );
};