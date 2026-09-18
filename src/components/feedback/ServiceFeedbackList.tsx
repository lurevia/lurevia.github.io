import type { FC } from "react";
import type { ServiceFeedback } from "../../bin/types/feedbackType";
import { ServiceFeedbackCard } from "./ServiceFeedbackCard";

type ServiceFeedbackListProps = {
    feedbacks: ServiceFeedback[];
    currentUserId?: string;
    onEdit?: (fb: ServiceFeedback) => void;
    onDelete?: (fb: ServiceFeedback) => void;
};

export const ServiceFeedbackList: FC<ServiceFeedbackListProps> = ({
    feedbacks,
    currentUserId,
    onEdit,
    onDelete,
}) => {
    if (feedbacks.length === 0) {
        return (
            <div className="text-center py-12 text-slate-400 text-sm">
                Aucun feedback pour le moment.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {feedbacks.map((fb) => {
                const isOwn = currentUserId === fb.userId;
                return (
                    <ServiceFeedbackCard
                        key={fb.id}
                        feedback={fb}
                        isOwn={isOwn}
                        onEdit={isOwn && onEdit ? () => onEdit(fb) : undefined}
                        onDelete={isOwn && onDelete ? () => onDelete(fb) : undefined}
                    />
                );
            })}
        </div>
    );
};