import { createContext } from "react";
import type { AppNotification } from "../bin/types/notificationType";

export interface NotificationsContextType {
    notifications: AppNotification[];
    unreadCount: number;
    isLoading: boolean;

    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    clearAll: () => Promise<void>;
    refresh: () => Promise<void>;
}

export const NotificationsContext = createContext<
    NotificationsContextType | undefined
>(undefined);
