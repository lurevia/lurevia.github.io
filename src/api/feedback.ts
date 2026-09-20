import { api } from "./http";
import { toFeedback } from "./mappers";
import type { FeedbackDto, PaginatedDto } from "./dto";
import type { FeedbackInput, ServiceFeedback } from "../bin/types/feedbackType";

export const feedbackApi = {
  async listPublic(page = 1, limit = 20, signal?: AbortSignal): Promise<ServiceFeedback[]> {
    const data = await api.get<PaginatedDto<FeedbackDto>>("/feedback", {
      auth: false,
      signal,
      query: { page, limit },
    });
    return (data?.items ?? []).map(toFeedback);
  },

  async stats(signal?: AbortSignal): Promise<{ average: number; count: number }> {
    const data = await api.get<{ average: number; count: number }>("/feedback/stats", {
      auth: false,
      signal,
    });
    return { average: data?.average ?? 0, count: data?.count ?? 0 };
  },

  async listMine(signal?: AbortSignal): Promise<ServiceFeedback[]> {
    const data = await api.get<{ feedback: FeedbackDto[] }>("/feedback/me", { signal });
    return (data?.feedback ?? []).map(toFeedback);
  },

  async create(input: FeedbackInput): Promise<ServiceFeedback> {
    const data = await api.post<{ feedback: FeedbackDto }>("/feedback", input);
    return toFeedback(data.feedback);
  },

  async update(id: string, input: Partial<FeedbackInput>): Promise<ServiceFeedback> {
    const data = await api.patch<{ feedback: FeedbackDto }>(
      `/feedback/${encodeURIComponent(id)}`,
      input
    );
    return toFeedback(data.feedback);
  },

  remove(id: string): Promise<void> {
    return api.delete<void>(`/feedback/${encodeURIComponent(id)}`);
  },
};
