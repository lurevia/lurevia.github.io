import { api } from "./http";
import { toProduct } from "./mappers";
import type { PaginatedDto, ProductDto, SearchSuggestionDto } from "./dto";
import type { Product } from "../bin/types/homeType";
import type { Availability, SortOption } from "../bin/types/shopType";

export type ProductQuery = {
  page?: number;
  limit?: number;
  categories?: string[];
  sizes?: string[];
  /** Libellés de couleur (ex : "Noir"), tels qu'attendus par l'API. */
  colors?: string[];
  priceMin?: number;
  priceMax?: number;
  availability?: Availability;
  sortBy?: SortOption;
  search?: string;
};

export type ProductPage = {
  products: Product[];
  totalItems: number;
  totalPages: number;
  page: number;
};

export const productsApi = {
  async list(query: ProductQuery = {}, signal?: AbortSignal): Promise<ProductPage> {
    const data = await api.get<PaginatedDto<ProductDto>>("/products", {
      auth: false,
      signal,
      query: {
        page: query.page,
        limit: query.limit,
        categories: query.categories,
        sizes: query.sizes,
        colors: query.colors,
        priceMin: query.priceMin,
        priceMax: query.priceMax,
        availability: query.availability,
        sortBy: query.sortBy,
        search: query.search,
      },
    });

    return {
      products: (data?.items ?? []).map(toProduct),
      totalItems: data?.pagination?.totalItems ?? 0,
      totalPages: data?.pagination?.totalPages ?? 1,
      page: data?.pagination?.page ?? 1,
    };
  },

  async getById(id: string, signal?: AbortSignal): Promise<Product> {
    const data = await api.get<{ product: ProductDto }>(`/products/${encodeURIComponent(id)}`, {
      auth: false,
      signal,
    });
    return toProduct(data.product);
  },

  async getRelated(id: string, limit = 4, signal?: AbortSignal): Promise<Product[]> {
    const data = await api.get<{ products: ProductDto[] }>(
      `/products/${encodeURIComponent(id)}/related`,
      { auth: false, signal, query: { limit } }
    );
    return (data?.products ?? []).map(toProduct);
  },

  async suggestions(q: string, limit = 5, signal?: AbortSignal): Promise<SearchSuggestionDto[]> {
    const data = await api.get<{ suggestions: SearchSuggestionDto[] }>(
      "/products/search/suggestions",
      { auth: false, signal, query: { q, limit } }
    );
    return data?.suggestions ?? [];
  },
};
