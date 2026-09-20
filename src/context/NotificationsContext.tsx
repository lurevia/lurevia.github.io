import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { NotificationsContext } from "./notificationsContextDefinition";
import { notificationsApi } from "../api/notifications";
import { useAuth } from "../hooks/useAuth";
import type { AppNotification } from "../bin/types/notificationType";

/**
 * Notifications : générées et conservées côté serveur.
 *
 * L'état « lu / non lu » n'est plus déduit d'une liste d'identifiants
 * dans le localStorage : il appartient au compte utilisateur et suit donc
 * l'utilisateur d'un appareil à l'autre.
 */
export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const { user, isReady } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async (): Promise<void> => {
    if (!user) {
      setNotifications([]);
      return;
    }

    setIsLoading(true);
    try {
      setNotifications(await notificationsApi.list());
    } catch {
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isReady) return;
    void refresh();
  }, [isReady, refresh]);

  const markAsRead = useCallback(async (id: string): Promise<void> => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await notificationsApi.markRead(id);
    } catch {
      /* la prochaine synchronisation rétablira l'état réel */
    }
  }, []);

  const markAllAsRead = useCallback(async (): Promise<void> => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await notificationsApi.markAllRead();
    } catch {
      /* idem */
    }
  }, []);

  const clearAll = useCallback(async (): Promise<void> => {
    const previous = notifications;
    setNotifications([]);
    try {
      await notificationsApi.clear();
    } catch {
      setNotifications(previous);
    }
  }, [notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const value = useMemo(
    () => ({ notifications, unreadCount, isLoading, markAsRead, markAllAsRead, clearAll, refresh }),
    [notifications, unreadCount, isLoading, markAsRead, markAllAsRead, clearAll, refresh]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};
