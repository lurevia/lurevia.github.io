import { api } from "./http";

export interface UserMessage {
  id: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string;
  senderId?: string | null;
}

export const messagesApi = {
  async list(): Promise<UserMessage[]> {
    const data = await api.get<{ messages: UserMessage[] }>("/messages");
    return data.messages ?? [];
  },

  markRead(id: string): Promise<void> {
    return api.post<void>(`/messages/${encodeURIComponent(id)}/read`);
  },
};
