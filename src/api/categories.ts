import { api } from "./http";
import type { CategoryDto } from "./dto";

export const categoriesApi = {
  async list(signal?: AbortSignal): Promise<CategoryDto[]> {
    const data = await api.get<{ categories: CategoryDto[] }>("/categories", {
      auth: false,
      signal,
    });
    return data?.categories ?? [];
  },
};
