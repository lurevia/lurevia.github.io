import { useState } from "react";
import type { FC } from "react";
import { Star } from "lucide-react";

type StarRatingInputProps = {
    value: number;
    onChange: (value: number) => void;
    size?: number;
};

export const StarRatingInput: FC<StarRatingInputProps> = ({
    value,
    onChange,
    size = 28,
}) => {
    const [hover, setHover] = useState(0);
    const active = hover || value;

    return (
        <div className="inline-flex items-center gap-1" role="radiogroup" aria-label="Note">
            {[1, 2, 3, 4, 5].map((i) => (
                <button
                    key={i}
                    type="button"
                    role="radio"
                    aria-checked={value === i}
                    aria-label={`${i} étoile${i > 1 ? "s" : ""}`}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => onChange(i)}
                    className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
                >
                    <Star
                        size={size}
                        className={
                            i <= active
                                ? "fill-lurevia-yellow text-lurevia-yellow stroke-none"
                                : "text-slate-300"
                        }
                    />
                </button>
            ))}
        </div>
    );
};