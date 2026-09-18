import { createContext } from "react";
import type { AppNotification } from "../bin/types/notificationType";

export interface NotificationsContextType {
    notifications: AppNotification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
}

export const NotificationsContext = createContext<
    NotificationsContextType | undefined
>(undefined);