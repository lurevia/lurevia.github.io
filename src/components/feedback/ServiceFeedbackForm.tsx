import { useState } from "react";
import type { FC, FormEvent } from "react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { StarRatingInput } from "../reviews/StarRatingInput";
import type { ServiceFeedback } from "../../bin/types/feedbackType";

type ServiceFeedbackFormProps = {
    initial?: ServiceFeedback;
    onSubmit: (data: Omit<ServiceFeedback, "id" | "createdAt" | "updatedAt" | "userId" | "userName">) => void;
    onCancel?: () => void;
};

const CATEGORIES: { value: ServiceFeedback["category"]; label: string }[] = [
    { value: "delivery", label: "Livraison" },
    { value: "payment", label: "Paiement" },
    { value: "support", label: "Service client" },
    { value: "website", label: "Site web" },
    { value: "other", label: "Autre" },
];

export const ServiceFeedbackForm: FC<ServiceFeedbackFormProps> = ({
    initial,
    onSubmit,
    onCancel,
}) => {
    const [overallRating, setOverallRating] = useState(initial?.overallRating ?? 0);
    const [category, setCategory] = useState<ServiceFeedback["category"]>(
        initial?.category ?? "other"
    );
    const [comment, setComment] = useState(initial?.comment ?? "");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (overallRating < 1) {
            setError("Veuillez donner une note globale.");
            return;
        }
        if (comment.trim().length < 10) {
            setError("Votre commentaire doit faire au moins 10 caractères.");
            return;
        }
        setError(null);
        onSubmit({ overallRating, category, comment: comment.trim() });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    Note globale
                </label>
                <StarRatingInput value={overallRating} onChange={setOverallRating} />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    Sujet
                </label>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                        <button
                            key={c.value}
                            type="button"
                            onClick={() => setCategory(c.value)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-colors cursor-pointer ${category === c.value
                                    ? "border-lurevia-orange bg-orange-50 text-lurevia-dark"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                }`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>

            <Textarea
                label="Votre feedback"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre expérience avec le service Lurevia…"
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
                <Button type="submit" variant="primary" className="flex-1!">
                    {initial ? "Modifier" : "Envoyer"}
                </Button>
            </div>
        </form>
    );
};