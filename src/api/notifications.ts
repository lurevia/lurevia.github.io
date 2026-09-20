import { api } from "./http";
import { toNotification } from "./mappers";
import type { NotificationDto } from "./dto";
import type { AppNotification } from "../bin/types/notificationType";

export const notificationsApi = {
  async list(signal?: AbortSignal): Promise<AppNotification[]> {
    const data = await api.get<{ notifications: NotificationDto[] }>("/notifications", { signal });
    return (data?.notifications ?? []).map(toNotification);
  },

  markRead(id: string): Promise<void> {
    return api.post<void>(`/notifications/${encodeURIComponent(id)}/read`);
  },

  markAllRead(): Promise<void> {
    return api.post<void>("/notifications/read-all");
  },

  clear(): Promise<void> {
    return api.delete<void>("/notifications");
  },
};
