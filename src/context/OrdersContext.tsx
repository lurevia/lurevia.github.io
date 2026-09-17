import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { OrdersContext } from "./ordersContextDefinition";
import { useAuth } from "../hooks/useAuth";
import type { Order, Transaction } from "../bin/types/orderType";

const STORAGE_KEY = "lurevia_orders";

type StorageShape = {
    orders: Order[];
    transactions: Transaction[];
};

const readStorage = (): StorageShape => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as StorageShape) : { orders: [], transactions: [] };
    } catch {
        return { orders: [], transactions: [] };
    }
};

const writeStorage = (data: StorageShape): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Impossible de sauvegarder les commandes.", e);
    }
};

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [all, setAll] = useState<StorageShape>(readStorage);

    useEffect(() => {
        writeStorage(all);
    }, [all]);

    const orders = useMemo(
        () =>
            user
                ? all.orders
                    .filter((o) => o.userId === user.id)
                    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                : [],
        [all.orders, user]
    );

    const transactions = useMemo(
        () =>
            user
                ? all.transactions
                    .filter((t) => all.orders.some((o) => o.id === t.orderId && o.userId === user.id))
                    .sort((a, b) => b.date.localeCompare(a.date))
                : [],
        [all.transactions, all.orders, user]
    );

    const addOrder = useCallback((order: Order) => {
        setAll((prev) => {
            const transaction: Transaction = {
                id: `tx-${Date.now()}`,
                orderId: order.id,
                amount: order.total,
                method: order.paymentMethod,
                status: order.paymentMethod === "cash" ? "pending" : "success",
                date: new Date().toISOString(),
            };
            return {
                orders: [...prev.orders, order],
                transactions: [...prev.transactions, transaction],
            };
        });
    }, []);

    const cancelOrder = useCallback((orderId: string) => {
        setAll((prev) => ({
            orders: prev.orders.map((o) =>
                o.id === orderId ? { ...o, status: "cancelled" } : o
            ),
            transactions: prev.transactions,
        }));
    }, []);

    const clearOrders = useCallback(() => {
        setAll({ orders: [], transactions: [] });
    }, []);

    const value = useMemo(
        () => ({ orders, transactions, addOrder, cancelOrder, clearOrders }),
        [orders, transactions, addOrder, cancelOrder, clearOrders]
    );

    return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};