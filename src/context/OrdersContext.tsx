import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { OrdersContext } from "./ordersContextDefinition";
import { ordersApi } from "../api/orders";
import { toErrorMessage } from "../api/http";
import { useAuth } from "../hooks/useAuth";
import type { CheckoutPayload, Order, Transaction } from "../bin/types/orderType";

/**
 * Historique de commandes : intégralement serveur.
 *
 * Aucune commande n'est plus fabriquée côté client (l'ancienne version
 * créait l'objet `Order` dans le navigateur, ce qui permettait de forger
 * un historique et un montant arbitraires). Ici le client ne fait que
 * lire ce que l'API renvoie pour l'utilisateur authentifié.
 */
export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const { user, isReady } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    if (!user) {
      setOrders([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      setOrders(await ordersApi.list());
    } catch (err) {
      setError(toErrorMessage(err, "Impossible de charger vos commandes."));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isReady) return;
    void refresh();
  }, [isReady, refresh]);

  const checkout = useCallback(async (payload: CheckoutPayload): Promise<Order> => {
    const order = await ordersApi.checkout(payload);
    setOrders((prev) => [order, ...prev.filter((o) => o.id !== order.id)]);
    return order;
  }, []);

  const cancelOrder = useCallback(async (orderId: string): Promise<void> => {
    const updated = await ordersApi.cancel(orderId);
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  }, []);

  const transactions = useMemo<Transaction[]>(
    () =>
      orders
        .flatMap((order) => order.transactions)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [orders]
  );

  const value = useMemo(
    () => ({ orders, transactions, isLoading, error, refresh, checkout, cancelOrder }),
    [orders, transactions, isLoading, error, refresh, checkout, cancelOrder]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};
