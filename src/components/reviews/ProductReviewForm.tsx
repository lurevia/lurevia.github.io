import { useState } from "react";
import type { FC, FormEvent } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { StarRatingInput } from "./StarRatingInput";
import type { ProductReview } from "../../bin/types/reviewType";

type ProductReviewFormProps = {
    initial?: ProductReview;
    isSubmitting?: boolean;
    onSubmit: (data: { rating: number; title?: string; comment: string }) => void;
    onCancel?: () => void;
};

export const ProductReviewForm: FC<ProductReviewFormProps> = ({
    initial,
    isSubmitting = false,
    onSubmit,
    onCancel,
}) => {
    const [rating, setRating] = useState(initial?.rating ?? 0);
    const [title, setTitle] = useState(initial?.title ?? "");
    const [comment, setComment] = useState(initial?.comment ?? "");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (rating < 1) {
            setError("Veuillez sélectionner une note.");
            return;
        }
        if (isSubmitting) return;
        if (comment.trim().length < 10) {
            setError("Votre commentaire doit faire au moins 10 caractères.");
            return;
        }
        setError(null);
        onSubmit({ rating, title: title.trim() || undefined, comment: comment.trim() });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    Votre note
                </label>
                <StarRatingInput value={rating} onChange={setRating} />
            </div>

            <Input
                label="Titre (optionnel)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Excellent produit !"
                maxLength={80}
            />

            <Textarea
                label="Votre avis"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Décrivez votre expérience avec ce produit…"
                rows={4}
                maxLength={1000}
            />

            <p className="text-[11px] text-slate-400 text-right">
                {comment.length}/1000
            </p>

            {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-xs font-medium text-red-600">{error}</p>
                </div>
            )}

            <div className="flex gap-2">
                {onCancel && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        className="flex-1! border border-slate-200!"
                    >
                        Annuler
                    </Button>
                )}
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="flex-1!"
                >
                    {isSubmitting
                        ? "Envoi…"
                        : initial
                            ? "Modifier l'avis"
                            : "Publier l'avis"}
                </Button>
            </div>
        </form>
    );
};