export type NotificationType =
    | "review_pending"
    | "order_shipped"
    | "order_delivered"
    | "promo";

export interface AppNotification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    createdAt: string;
    actionUrl: string;
    imageUrl?: string;
    read: boolean;
}