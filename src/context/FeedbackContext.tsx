import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { FeedbackContext } from "./feedbackContextDefinition";
import { useAuth } from "../hooks/useAuth";
import type { ServiceFeedback } from "../bin/types/feedbackType";

const STORAGE_KEY = "lurevia_service_feedback";

const readStorage = (): ServiceFeedback[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as ServiceFeedback[]) : [];
    } catch {
        return [];
    }
};

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [all, setAll] = useState<ServiceFeedback[]>(readStorage);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        } catch (e) {
            console.error("Impossible de sauvegarder les feedbacks.", e);
        }
    }, [all]);

    const myFeedbacks = useMemo(
        () =>
            user
                ? all
                    .filter((f) => f.userId === user.id)
                    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                : [],
        [all, user]
    );

    const allFeedbacks = useMemo(
        () => [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        [all]
    );

    const averageRating = useMemo(() => {
        if (all.length === 0) return 0;
        return all.reduce((sum, f) => sum + f.overallRating, 0) / all.length;
    }, [all]);

    const addFeedback = useCallback(
        (data: Omit<ServiceFeedback, "id" | "createdAt" | "updatedAt" | "userId" | "userName">) => {
            if (!user) return;

            const now = new Date().toISOString();
            const newFeedback: ServiceFeedback = {
                ...data,
                id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                userId: user.id,
                userName: user.fullName,
                createdAt: now,
                updatedAt: now,
            };

            setAll((prev) => [newFeedback, ...prev]);
        },
        [user]
    );

    const updateFeedback = useCallback(
        (id: string, data: Partial<ServiceFeedback>) => {
            if (!user) return;
            setAll((prev) =>
                prev.map((f) =>
                    f.id === id && f.userId === user.id
                        ? { ...f, ...data, updatedAt: new Date().toISOString() }
                        : f
                )
            );
        },
        [user]
    );

    const deleteFeedback = useCallback(
        (id: string) => {
            if (!user) return;
            setAll((prev) => prev.filter((f) => !(f.id === id && f.userId === user.id)));
        },
        [user]
    );

    const value = useMemo(
        () => ({
            myFeedbacks,
            allFeedbacks,
            addFeedback,
            updateFeedback,
            deleteFeedback,
            averageRating,
        }),
        [myFeedbacks, allFeedbacks, addFeedback, updateFeedback, deleteFeedback, averageRating]
    );

    return (
        <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>
    );
};