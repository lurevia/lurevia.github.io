import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { NotificationsContext } from "./notificationsContextDefinition";
import { useAuth } from "../hooks/useAuth";
import { useOrders } from "../hooks/useOrders";
import { useReviews } from "../hooks/useReviews";
import type { AppNotification } from "../bin/types/notificationType";
import { REVIEW_DELAY_DAYS } from "../bin/utils/constant/constant";

const STORAGE_KEY = "lurevia_notifications_read";

const readReadIds = (): string[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
        return [];
    }
};


export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const { orders } = useOrders();
    const { getUserReviewForProduct } = useReviews();

    const [readIds, setReadIds] = useState<string[]>(readReadIds);
    const [currentTime] = useState(() => Date.now());

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(readIds));
        } catch (e) {
            console.error("Impossible de sauvegarder les notifications.", e);
        }
    }, [readIds]);

    const notifications = useMemo<AppNotification[]>(() => {
        if (!user) return [];

        const delayMs = REVIEW_DELAY_DAYS * 24 * 60 * 60 * 1000;
        const list: AppNotification[] = [];

        for (const order of orders) {
            const orderTime = new Date(order.createdAt).getTime();

            if (order.status === "shipped") {
                list.push({
                    id: `notif-shipped-${order.id}`,
                    type: "order_shipped",
                    title: "Commande expédiée",
                    message: `Votre commande ${order.id} est en route !`,
                    createdAt: order.createdAt,
                    actionUrl: `/compte/commandes`,
                    read: readIds.includes(`notif-shipped-${order.id}`),
                });
            }

            if (order.status === "delivered") {
                list.push({
                    id: `notif-delivered-${order.id}`,
                    type: "order_delivered",
                    title: "Commande livrée",
                    message: `Votre commande ${order.id} a été livrée.`,
                    createdAt: order.createdAt,
                    actionUrl: `/compte/commandes`,
                    read: readIds.includes(`notif-delivered-${order.id}`),
                });
            }

            const eligibleAt = orderTime + delayMs;
            if (currentTime >= eligibleAt) {
                for (const item of order.items) {
                    const alreadyReviewed = getUserReviewForProduct(item.product.id);
                    if (alreadyReviewed) continue;

                    const notifId = `notif-review-${order.id}-${item.product.id}`;

                    list.push({
                        id: notifId,
                        type: "review_pending",
                        title: "Votre avis nous intéresse",
                        message: `Qu'avez-vous pensé de « ${item.product.title} » ?`,
                        createdAt: new Date(eligibleAt).toISOString(),
                        actionUrl: `/produit/${item.product.id}#reviews`,
                        imageUrl: item.product.imageUrl,
                        read: readIds.includes(notifId),
                    });
                }
            }
        }

        // Tri : plus récents d'abord
        return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }, [currentTime, user, orders, getUserReviewForProduct, readIds]);

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.read).length,
        [notifications]
    );

    const markAsRead = useCallback((id: string) => {
        setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }, []);

    const markAllAsRead = useCallback(() => {
        setReadIds((prev) => [
            ...new Set([...prev, ...notifications.map((n) => n.id)]),
        ]);
    }, [notifications]);

    const clearAll = useCallback(() => {
        setReadIds([]);
    }, []);

    const value = useMemo(
        () => ({ notifications, unreadCount, markAsRead, markAllAsRead, clearAll }),
        [notifications, unreadCount, markAsRead, markAllAsRead, clearAll]
    );

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
};