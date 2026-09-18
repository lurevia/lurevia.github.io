import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { MOCK_PRODUCTS } from "../bin/data/mock";
import { CATEGORIES } from "../bin/utils/constant/constant";
import type { FilterState, SortOption } from "../bin/types/shopType";
import { DEFAULT_FILTERS } from "../bin/types/shopType";
import type { Product } from "../bin/types/homeType";

const ITEMS_PER_PAGE = 6;

export type UseProductCatalogReturn = {
  isGlobalShop: boolean;
  currentCategoryInfo: {
    title: string;
    description: string;
    imageUrl: string;
    breadcrumb: { label: string; to?: string }[];
  };
  filters: FilterState;
  currentPage: number;
  filteredProducts: Product[];
  paginatedProducts: Product[];
  categoryCounts: Record<string, number>;
  totalPages: number;

  changeFilters: (next: FilterState) => void;
  changeSortBy: (sortBy: SortOption) => void;
  resetFilters: () => void;
  changePage: (page: number) => void;
};

export const useProductCatalog = (): UseProductCatalogReturn => {
  const { slug } = useParams<{ slug?: string }>();
  const isGlobalShop = !slug;

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  }, [slug]);

  const currentCategoryInfo = useMemo(() => {
    if (isGlobalShop) {
      return {
        title: "Toute la Boutique",
        description:
          "Découvrez notre sélection de vêtements, sacs, chaussures et accessoires pour un style unique et authentique malgache.",
        imageUrl: "/images/hero/boutique_hero.jpg",
        breadcrumb: [{ label: "Accueil", to: "/" }, { label: "Boutique" }],
      };
    }

    const foundCat = CATEGORIES.find((cat) => cat.slug === slug);
    return {
      title: foundCat?.name ?? "Boutique",
      description: foundCat?.description ?? "Découvrez nos collections exclusives.",

      imageUrl: foundCat?.bannerUrl ?? "/images/logo.jpeg",

      breadcrumb: [
        { label: "Accueil", to: "/" },
        { label: "Boutique", to: "/boutique" },
        { label: foundCat?.name ?? "Catégorie" },
      ],
    };
  }, [slug, isGlobalShop]);

  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    if (!isGlobalShop) {
      result = result.filter((p) => p.categorySlugs.includes(slug!));
    } else if (filters.categories.length > 0) {
      result = result.filter((p) =>
        p.categorySlugs.some((s) => filters.categories.includes(s))
      );
    }

    result = result.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    if (filters.availability === "in-stock") {
      result = result.filter((p) => !p.outOfStock);
    } else if (filters.availability === "out-of-stock") {
      result = result.filter((p) => p.outOfStock);
    }

    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        break;
    }

    return result;
  }, [slug, isGlobalShop, filters]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      counts[cat.slug] = MOCK_PRODUCTS.filter((p) =>
        p.categorySlugs.includes(cat.slug)
      ).length;
    }
    return counts;
  }, []);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  );

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const changeFilters = (next: FilterState): void => {
    setFilters(next);
    setCurrentPage(1);
  };

  const changeSortBy = (sortBy: SortOption): void => {
    setFilters((prev) => ({ ...prev, sortBy }));
    setCurrentPage(1);
  };

  const resetFilters = (): void => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const changePage = (page: number): void => {
    setCurrentPage(page);
    document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    isGlobalShop,
    currentCategoryInfo,
    filters,
    currentPage,
    filteredProducts,
    paginatedProducts,
    categoryCounts,
    totalPages,
    changeFilters,
    changeSortBy,
    resetFilters,
    changePage,
  };
};
