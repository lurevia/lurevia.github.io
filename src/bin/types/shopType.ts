export type Size = "XS" | "S" | "M" | "L" | "XL";

export type Availability = "all" | "in-stock" | "out-of-stock";


export type SortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "popular";

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  sizes: Size[];
  colors: string[];
  availability: Availability;
  sortBy: SortOption;
}

export const DEFAULT_FILTERS: FilterState = {
  categories: [],
  priceRange:[5_000, 200_000],
  sizes: [],
  colors: [],
  availability: "all",
  sortBy: "newest",
};
