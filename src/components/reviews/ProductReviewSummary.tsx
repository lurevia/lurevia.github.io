import type { FC } from "react";
import { StarRating } from "./StarRating";

type ProductReviewSummaryProps = {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

export const ProductReviewSummary: FC<ProductReviewSummaryProps> = ({
  average,
  count,
  distribution,
}) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
    <div className="flex flex-col items-center justify-center text-center">
      <p className="text-4xl font-black text-lurevia-dark">
        {average.toFixed(1)}
      </p>
      <StarRating value={average} size={16} className="mt-1" />
      <p className="text-xs text-slate-500 mt-1">
        {count} avis{count > 1 ? "" : ""}
      </p>
    </div>

    <div className="space-y-1.5">
      {([5, 4, 3, 2, 1] as const).map((star) => {
        const n = distribution[star];
        const pct = count === 0 ? 0 : (n / count) * 100;
        return (
          <div key={star} className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-600 w-4">{star}</span>
            <span className="text-lurevia-yellow">★</span>
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-lurevia-yellow transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-slate-400 w-6 text-right">{n}</span>
          </div>
        );
      })}
    </div>
  </div>
);