import type { FC } from "react";
import { Link } from "react-router-dom";
import { Star, Clock } from "lucide-react";
import type { ReviewableProduct } from "./reviewableProduct";
import { ProductImage } from "../../components/common/ProductImage";
import { Button } from "../../components/ui/Button";


type PendingReviewCardProps = {
  product: ReviewableProduct;
  daysRemaining: number;
  availableAt: string;
};

export const PendingReviewCard: FC<PendingReviewCardProps> = ({
  product,
  daysRemaining,
  availableAt,
}) => {
  const isEligible = daysRemaining <= 0;

  return (
    <article className="flex gap-3 p-4 bg-white border border-slate-100 rounded-2xl">
      <Link
        to={`/produit/${product.id}`}
        className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-slate-50 shrink-0"
      >
        <ProductImage
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </Link>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <Link
            to={`/produit/${product.id}`}
            className="text-xs md:text-sm font-bold text-slate-800 line-clamp-2 hover:text-lurevia-orange transition-colors"
          >
            {product.title}
          </Link>

          <p className="text-[11px] text-slate-500 mt-1">
            {isEligible ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                <Star size={10} className="fill-emerald-600 stroke-none" />
                Vous pouvez donner votre avis
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-700">
                <Clock size={10} />
                Disponible dans {daysRemaining} jour
                {daysRemaining > 1 ? "s" : ""} ·{" "}
                {new Date(availableAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            )}
          </p>
        </div>

        <div className="mt-2">
          {isEligible ? (
            <Link to={`/produit/${product.id}?review=1#reviews`}>
              <Button
                variant="primary"
                size="sm"
                icon={Star}
                className="rounded-full! text-[11px]!"
              >
                Écrire un avis
              </Button>
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              icon={Clock}
              disabled
              className="text-[11px]! border border-slate-200!"
            >
              En attente
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};