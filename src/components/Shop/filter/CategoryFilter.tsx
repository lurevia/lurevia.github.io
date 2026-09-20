import type { FC } from "react";
import type { FilterState } from "../../../bin/types/shopType";
import { FilterBlock } from "./FilterBlock";
import { CheckboxGroup } from "../../ui/CheckboxGroup";
import type { CheckboxOption } from "../../ui/CheckboxGroup";

type CategoryFilterProps = {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  categories: { slug: string; name: string }[];
};

export const CategoryFilter: FC<CategoryFilterProps> = ({
  filters,
  onChange,
  categories,
}) => {
  // Le décompte par catégorie n'est plus calculé côté client : le
  // catalogue complet n'est plus chargé dans le navigateur.
  const options: CheckboxOption<string>[] = categories.map((cat) => ({
    value: cat.slug,
    label: cat.name,
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