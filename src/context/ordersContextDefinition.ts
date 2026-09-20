import { createContext } from "react";
import type { CheckoutPayload, Order, Transaction } from "../bin/types/orderType";

export interface OrdersContextType {
  orders: Order[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  refresh: () => Promise<void>;
  /** Crée la commande côté serveur à partir du panier authentifié. */
  checkout: (payload: CheckoutPayload) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;
}

export const OrdersContext = createContext<OrdersContextType | undefined>(
  undefined
);
