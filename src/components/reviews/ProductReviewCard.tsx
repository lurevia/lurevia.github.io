import type { FC } from "react";
import { CheckCircle2, Pencil, Trash2, Star } from "lucide-react";
import type { ProductReview } from "../../bin/types/reviewType";
import { Button } from "../ui/Button";

type ProductReviewCardProps = {
    review: ProductReview;
    isOwn?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
};

export const ProductReviewCard: FC<ProductReviewCardProps> = ({
    review,
    isOwn,
    onEdit,
    onDelete,
}) => {
    const initials = review.userName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const date = new Date(review.createdAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const wasEdited = review.updatedAt !== review.createdAt;

    return (
        <article className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 space-y-3">
            <header className="flex items-start gap-3">
                {review.userAvatar ? (
                    <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-lurevia-dark text-white flex items-center justify-center font-black text-xs shrink-0">
                        {initials}
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-800">
                            {review.userName}
                        </span>
                        {isOwn && (
                            <span className="text-[10px] font-black bg-lurevia-orange text-white px-2 py-0.5 rounded-full uppercase">
                                Vous
                            </span>
                        )}
                        {review.isVerifiedPurchase && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                <CheckCircle2 size={10} />
                                Achat vérifié
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                    key={i}
                                    size={12}
                                    className={
                                        i <= review.rating
                                            ? "fill-lurevia-yellow text-lurevia-yellow stroke-none"
                                            : "text-slate-300"
                                    }
                                />
                            ))}
                        </div>
                        <span className="text-[11px] text-slate-400">
                            {date}
                            {wasEdited && " (modifié)"}
                        </span>
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
                                aria-label="Modifier"
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
                                aria-label="Supprimer"
                                className="w-8! h-8! text-slate-400! hover:text-red-500! hover:bg-red-50!"
                            />
                        )}
                    </div>
                )}
            </header>

            {review.title && (
                <h4 className="font-bold text-slate-800 text-sm">{review.title}</h4>
            )}
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {review.comment}
            </p>
        </article>
    );
};