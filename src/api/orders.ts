import { api } from "./http";
import { toOrder } from "./mappers";
import type { OrderDto, PaginatedDto } from "./dto";
import type { CheckoutPayload, Order } from "../bin/types/orderType";

export const ordersApi = {
  async list(page = 1, limit = 20, signal?: AbortSignal): Promise<Order[]> {
    const data = await api.get<PaginatedDto<OrderDto>>("/orders", {
      signal,
      query: { page, limit },
    });
    return (data?.items ?? []).map(toOrder);
  },

  async getById(id: string): Promise<Order> {
    const data = await api.get<{ order: OrderDto }>(`/orders/${encodeURIComponent(id)}`);
    return toOrder(data.order);
  },

  /**
   * Crée la commande à partir du panier serveur. Les montants (sous-total,
   * frais de port, total) sont recalculés côté API : le client ne peut pas
   * influencer le prix facturé.
   */
  async checkout(payload: CheckoutPayload): Promise<Order> {
    const body: Record<string, unknown> = { paymentMethod: payload.paymentMethod };

    if (payload.addressId) body.addressId = payload.addressId;
    else if (payload.shipping) body.shipping = payload.shipping;

    if (payload.paymentMethod === "mobile-money" && payload.mobileMoney) {
      body.mobileMoney = payload.mobileMoney;
    }
    if (payload.paymentToken) body.paymentToken = payload.paymentToken;

    const data = await api.post<{ order: OrderDto }>("/orders", body);
    return toOrder(data.order);
  },

  async cancel(id: string): Promise<Order> {
    const data = await api.post<{ order: OrderDto }>(`/orders/${encodeURIComponent(id)}/cancel`);
    return toOrder(data.order);
  },
};
