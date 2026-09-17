import type { FC } from "react";
import type { FilterState } from "../../../bin/types/shopType";
import { FilterBlock } from "./FilterBlock";
import { CheckboxGroup } from "../../ui/CheckboxGroup";
import type { CheckboxOption } from "../../ui/CheckboxGroup";

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
  const options: CheckboxOption<string>[] = categories.map((cat) => ({
    value: cat.slug,
    label: cat.name,
    count: categoryCounts[cat.slug] ?? 0,
  }));

  return (
    <FilterBlock title="Catégorie">
      <CheckboxGroup
        name="categories"
        values={filters.categories}
        options={options}
        onChange={(slugs) => onChange({ ...filters, categories: slugs })}
      />
    </FilterBlock>
  );
};