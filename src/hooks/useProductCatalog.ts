import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { productsApi } from "../api/products";
import { toErrorMessage } from "../api/http";
import { PRODUCTS_PER_PAGE } from "../bin/config/env";
import { COLORS } from "../bin/utils/constant/shopFilter";
import { useCategories } from "./useCategories";
import type { FilterState, SortOption } from "../bin/types/shopType";
import { DEFAULT_FILTERS } from "../bin/types/shopType";
import type { Product } from "../bin/types/homeType";

/**
 * Catalogue boutique.
 *
 * Le filtrage, le tri et la pagination sont délégués à l'API : le
 * navigateur ne télécharge plus l'intégralité du catalogue pour le
 * filtrer en mémoire, ce qui réduit la surface exposée et la charge
 * réseau. Chaque changement de filtre annule la requête précédente.
 */

/** L'UI manipule des codes hexadécimaux, l'API attend des libellés. */
const hexToLabel = (hex: string): string | null =>
  COLORS.find((color) => color.hex.toLowerCase() === hex.toLowerCase())?.label ?? null;

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
  products: Product[];
  totalItems: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;

  changeFilters: (next: FilterState) => void;
  changeSortBy: (sortBy: SortOption) => void;
  resetFilters: () => void;
  changePage: (page: number) => void;
};

export const useProductCatalog = (): UseProductCatalogReturn => {
  const { slug } = useParams<{ slug?: string }>();
  const { categories } = useCategories();
  const isGlobalShop = !slug;

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

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

    const foundCat = categories.find((cat) => cat.slug === slug);
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
  }, [slug, isGlobalShop, categories]);

  // ─── Chargement depuis l'API ───
  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      const selectedCategories = slug ? [slug] : filters.categories;
      const colorLabels = filters.colors
        .map(hexToLabel)
        .filter((label): label is string => label !== null);

      try {
        const page = await productsApi.list(
          {
            page: currentPage,
            limit: PRODUCTS_PER_PAGE,
            categories: selectedCategories,
            sizes: filters.sizes,
            colors: colorLabels,
            priceMin: filters.priceRange[0],
            priceMax: filters.priceRange[1],
            availability: filters.availability,
            sortBy: filters.sortBy,
          },
          controller.signal
        );

        if (controller.signal.aborted) return;
        setProducts(page.products);
        setTotalItems(page.totalItems);
        setTotalPages(page.totalPages);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(toErrorMessage(err, "Impossible de charger les produits."));
        setProducts([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [slug, filters, currentPage]);

  const changeFilters = useCallback((next: FilterState): void => {
    setFilters(next);
    setCurrentPage(1);
  }, []);

  const changeSortBy = useCallback((sortBy: SortOption): void => {
    setFilters((prev) => ({ ...prev, sortBy }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback((): void => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  }, []);

  const changePage = useCallback((page: number): void => {
    setCurrentPage(Math.max(1, page));
    document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return {
    isGlobalShop,
    currentCategoryInfo,
    filters,
    currentPage,
    products,
    totalItems,
    totalPages,
    isLoading,
    error,
    changeFilters,
    changeSortBy,
    resetFilters,
    changePage,
  };
};
