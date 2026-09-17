import { useContext } from "react";
import { OrdersContext } from "../context/ordersContextDefinition";

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders doit être utilisé dans un OrdersProvider");
  return ctx;
};