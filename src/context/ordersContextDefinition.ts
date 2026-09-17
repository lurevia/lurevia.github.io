import { createContext } from "react";
import type { Order, Transaction } from "../bin/types/orderType";

export interface OrdersContextType {
  orders: Order[];
  transactions: Transaction[];
  addOrder: (order: Order) => void;
  cancelOrder: (orderId: string) => void;
  clearOrders: () => void;
}

export const OrdersContext = createContext<OrdersContextType | undefined>(
  undefined
);