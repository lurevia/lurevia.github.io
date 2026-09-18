import type { FC } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { ServiceFeedback } from "../../bin/types/feedbackType";
import { Button } from "../ui/Button";
import { StarRating } from "../reviews/StarRating";

type ServiceFeedbackCardProps = {
  feedback: ServiceFeedback;
  isOwn?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

const CATEGORY_LABELS: Record<ServiceFeedback["category"], string> = {
  delivery: "Livraison",
  payment: "Paiement",
  support: "Service client",
  website: "Site web",
  other: "Autre",
};

export const ServiceFeedbackCard: FC<ServiceFeedbackCardProps> = ({
  feedback,
  isOwn,
  onEdit,
  onDelete,
}) => {
  const initials = feedback.userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const date = new Date(feedback.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 space-y-3">
      <header className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-lurevia-dark text-white flex items-center justify-center font-black text-xs shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-slate-800">
              {feedback.userName}
            </span>
            {isOwn && (
              <span className="text-[10px] font-black bg-lurevia-orange text-white px-2 py-0.5 rounded-full uppercase">
                Vous
              </span>
            )}
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full uppercase">
              {CATEGORY_LABELS[feedback.category]}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <StarRating value={feedback.overallRating} size={12} />
            <span className="text-[11px] text-slate-400">{date}</span>
          </div>
        </div>

        {isOwn && (onEdit || onDelete) && (
          <div className="flex items-center gap-1 shrink-0">
            {onEdit && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                icon={Pencil}
                onClick={onEdit}
                className="w-8! h-8! text-slate-400! hover:text-lurevia-dark!"
              />
            )}
            {onDelete && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                icon={Trash2}
                onClick={onDelete}
                className="w-8! h-8! text-slate-400! hover:text-red-500! hover:bg-red-50!"
              />
            )}
          </div>
        )}
      </header>

      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
        {feedback.comment}
      </p>
    </article>
  );
};