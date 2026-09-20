import type { FC } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import type { ServiceFeedback } from "../../bin/types/feedbackType";
import { StarRating } from "../../components/reviews/StarRating";
import { Button } from "../../components/ui/Button";


type MyFeedbackCardProps = {
  feedback: ServiceFeedback;
  /** Route interne d'édition (navigation SPA, pas de rechargement). */
  to: string;
  onDelete: () => void;
};

const CATEGORY_LABELS: Record<ServiceFeedback["category"], string> = {
  delivery: "Livraison",
  payment: "Paiement",
  support: "Service client",
  website: "Site web",
  other: "Autre",
};

export const MyFeedbackCard: FC<MyFeedbackCardProps> = ({
  feedback,
  to,
  onDelete,
}) => (
  <article className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 space-y-3">
    <header className="flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <StarRating value={feedback.overallRating} size={12} />
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full uppercase">
            {CATEGORY_LABELS[feedback.category]}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          {new Date(feedback.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Link to={to} aria-label="Modifier">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            icon={Pencil}
            className="w-8! h-8! text-slate-400! hover:text-lurevia-dark!"
          />
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          icon={Trash2}
          onClick={onDelete}
          aria-label="Supprimer"
          className="w-8! h-8! text-slate-400! hover:text-red-500! hover:bg-red-50!"
        />
      </div>
    </header>

    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line line-clamp-3">
      {feedback.comment}
    </p>
  </article>
);