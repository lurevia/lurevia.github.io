import { api } from "./http";
import { toProduct } from "./mappers";
import type { ProductDto } from "./dto";
import type { Product } from "../bin/types/homeType";

export const favoritesApi = {
  async list(signal?: AbortSignal): Promise<Product[]> {
    const data = await api.get<{ favorites: ProductDto[] }>("/favorites", { signal });
    return (data?.favorites ?? []).map(toProduct);
  },

  async toggle(productId: string): Promise<boolean> {
    const data = await api.post<{ isFavorite: boolean }>(
      `/favorites/${encodeURIComponent(productId)}/toggle`
    );
    return Boolean(data?.isFavorite);
  },
};
