import type { FC } from "react";
import { Link } from "react-router-dom";
import { Star, Pencil, Trash2 } from "lucide-react";
import type { ProductReview } from "../../bin/types/reviewType";
import type { ReviewableProduct } from "./reviewableProduct";
import { ProductImage } from "../../components/common/ProductImage";
import { Button } from "../../components/ui/Button";


type MyReviewCardProps = {
  review: ProductReview;
  product: ReviewableProduct;
  onDelete: () => void;
};

export const MyReviewCard: FC<MyReviewCardProps> = ({
  review,
  product,
  onDelete,
}) => (
  <article className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 space-y-3">
    <div className="flex gap-3 items-start">
      <Link
        to={`/produit/${product.id}`}
        className="w-14 h-14 rounded-lg overflow-hidden bg-slate-50 shrink-0"
      >
        <ProductImage
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          to={`/produit/${product.id}`}
          className="text-xs md:text-sm font-bold text-slate-800 line-clamp-1 hover:text-lurevia-orange"
        >
          {product.title}
        </Link>

        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={12}
                className={
                  i <= review.rating
                    ? "fill-lurevia-yellow text-lurevia-yellow stroke-none"
                    : "text-slate-200"
                }
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-400">
            {new Date(review.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Link to={`/produit/${product.id}#reviews`}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            icon={Pencil}
            aria-label="Modifier"
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
    </div>

    {review.title && (
      <h4 className="text-xs font-bold text-slate-800">{review.title}</h4>
    )}
    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line line-clamp-3">
      {review.comment}
    </p>

    <Link
      to={`/produit/${product.id}#reviews`}
      className="inline-flex items-center gap-1 text-[11px] font-bold text-lurevia-orange hover:underline"
    >
      Voir sur le produit
    </Link>
  </article>
);