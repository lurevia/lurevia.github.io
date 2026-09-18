import type { FC } from "react";
import { Star } from "lucide-react";

type StarRatingProps = {
    value: number;
    size?: number;
    className?: string;
};

export const StarRating: FC<StarRatingProps> = ({
    value,
    size = 14,
    className = "",
}) => {
    const rounded = Math.round(value);
    return (
        <div
            className={`inline-flex items-center gap-0.5 ${className}`}
            aria-label={`Note ${value.toFixed(1)} sur 5`}
            role="img"
        >
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    size={size}
                    className={
                        i <= rounded
                            ? "fill-lurevia-yellow text-lurevia-yellow stroke-none"
                            : "text-slate-300"
                    }
                />
            ))}
        </div>
    );
};