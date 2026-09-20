import { api } from "./http";
import { toProduct } from "./mappers";
import type { CartDto } from "./dto";
import type { CartItem } from "../bin/types/homeType";

export type ServerCart = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
};

const toCart = (dto: CartDto | null | undefined): ServerCart => ({
  items: (dto?.items ?? []).map((item) => ({
    product: toProduct(item.product),
    quantity: item.quantity,
  })),
  totalItems: dto?.totalItems ?? 0,
  totalPrice: dto?.totalPrice ?? 0,
});

export const cartApi = {
  async get(signal?: AbortSignal): Promise<ServerCart> {
    return toCart(await api.get<CartDto>("/cart", { signal }));
  },

  async addItem(productId: string, quantity = 1): Promise<ServerCart> {
    return toCart(await api.post<CartDto>("/cart/items", { productId, quantity }));
  },

  async updateItem(productId: string, quantity: number): Promise<ServerCart> {
    return toCart(
      await api.patch<CartDto>(`/cart/items/${encodeURIComponent(productId)}`, { quantity })
    );
  },

  async removeItem(productId: string): Promise<ServerCart> {
    return toCart(await api.delete<CartDto>(`/cart/items/${encodeURIComponent(productId)}`));
  },

  async clear(): Promise<ServerCart> {
    return toCart(await api.delete<CartDto>("/cart"));
  },
};
