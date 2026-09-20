import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { FeedbackContext } from "./feedbackContextDefinition";
import { feedbackApi } from "../api/feedback";
import { toErrorMessage } from "../api/http";
import { useAuth } from "../hooks/useAuth";
import type { FeedbackInput, ServiceFeedback } from "../bin/types/feedbackType";

const PUBLIC_PAGE_SIZE = 20;

/**
 * Feedbacks sur le service.
 *
 * Les avis publics sont lus sans authentification ; la liste « mes
 * feedbacks » et les écritures passent par les routes protégées, le
 * serveur vérifiant la propriété de chaque feedback avant modification
 * ou suppression.
 */
export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const { user, isReady } = useAuth();
  const [allFeedbacks, setAllFeedbacks] = useState<ServiceFeedback[]>([]);
  const [myFeedbacks, setMyFeedbacks] = useState<ServiceFeedback[]>([]);
  const [stats, setStats] = useState({ average: 0, count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const [publicList, publicStats] = await Promise.all([
        feedbackApi.listPublic(1, PUBLIC_PAGE_SIZE),
        feedbackApi.stats(),
      ]);
      setAllFeedbacks(publicList);
      setStats(publicStats);

      if (user) {
        setMyFeedbacks(await feedbackApi.listMine());
      } else {
        setMyFeedbacks([]);
      }
    } catch (err) {
      setError(toErrorMessage(err, "Impossible de charger les feedbacks."));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isReady) return;
    void refresh();
  }, [isReady, refresh]);

  const addFeedback = useCallback(
    async (data: FeedbackInput): Promise<void> => {
      await feedbackApi.create(data);
      await refresh();
    },
    [refresh]
  );

  const updateFeedback = useCallback(
    async (id: string, data: Partial<FeedbackInput>): Promise<void> => {
      await feedbackApi.update(id, data);
      await refresh();
    },
    [refresh]
  );

  const deleteFeedback = useCallback(
    async (id: string): Promise<void> => {
      await feedbackApi.remove(id);
      setAllFeedbacks((prev) => prev.filter((f) => f.id !== id));
      setMyFeedbacks((prev) => prev.filter((f) => f.id !== id));
    },
    []
  );

  const value = useMemo(
    () => ({
      myFeedbacks,
      allFeedbacks,
      averageRating: stats.average,
      totalCount: stats.count,
      isLoading,
      error,
      addFeedback,
      updateFeedback,
      deleteFeedback,
      refresh,
    }),
    [
      myFeedbacks,
      allFeedbacks,
      stats.average,
      stats.count,
      isLoading,
      error,
      addFeedback,
      updateFeedback,
      deleteFeedback,
      refresh,
    ]
  );

  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>;
};
