import type { FC } from "react";
import type { FilterState, Availability } from "../../../bin/types/shopType";
import { FilterBlock } from "./FilterBlock";
import { RadioGroup } from "../../ui/RadioGroup";
import type { RadioOption } from "../../ui/RadioGroup";

type AvailabilityFilterProps = {
  filters: FilterState;
  onChange: (next: FilterState) => void;
};

const OPTIONS: RadioOption<Availability>[] = [
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
      <RadioGroup
        name="availability"
        value={filters.availability}
        options={OPTIONS}
        onChange={(value) => onChange({ ...filters, availability: value })}
        orientation="vertical"
      />
    </FilterBlock>
  );
};