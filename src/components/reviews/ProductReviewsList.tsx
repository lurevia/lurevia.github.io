import { useEffect, useState } from "react";
import type { FC } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquarePlus,
  Star,
  Clock,
  ShoppingBag,
  Info,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useReviews } from "../../hooks/useReviews";
import { Button } from "../ui/Button";
import { ProductReviewSummary } from "./ProductReviewSummary";
import { ProductReviewForm } from "./ProductReviewForm";
import { ProductReviewCard } from "./ProductReviewCard";

type ProductReviewsListProps = {
  productId: string;
  /** 🆕 Ouvre automatiquement le formulaire si l'utilisateur est éligible */
  autoOpenForm?: boolean;
};

export const ProductReviewsList: FC<ProductReviewsListProps> = ({
  productId,
  autoOpenForm = false,
}) => {
  const { user, isAuthenticated } = useAuth();
  const {
    getProductReviews,
    getUserReviewForProduct,
    addReview,
    updateReview,
    deleteReview,
    getProductRating,
    checkEligibility,
  } = useReviews();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const reviews = getProductReviews(productId);
  const rating = getProductRating(productId);
  const myReview = getUserReviewForProduct(productId);
  const eligibility = checkEligibility(productId);

  /** 🎯 Ouverture automatique du formulaire */
  useEffect(() => {
    if (
      autoOpenForm &&
      !isFormOpen &&
      !myReview &&
      eligibility.reason === "eligible"
    ) {
      setIsFormOpen(true);
    }
  }, [autoOpenForm, isFormOpen, myReview, eligibility.reason]);

  /** Bloc d'action contextuel */
  const renderAction = () => {
    if (!isAuthenticated) {
      return (
        <Link to="/auth">
          <Button
            variant="primary"
            size="sm"
            icon={Star}
            className="rounded-full!"
          >
            Se connecter pour noter
          </Button>
        </Link>
      );
    }

    if (myReview) return null;

    switch (eligibility.reason) {
      case "eligible":
        return !isFormOpen ? (
          <Button
            variant="primary"
            size="sm"
            icon={MessageSquarePlus}
            onClick={() => setIsFormOpen(true)}
            className="rounded-full!"
          >
            Écrire un avis
          </Button>
        ) : null;

      case "waiting":
        return (
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-full text-[11px] font-bold text-amber-800">
            <Clock size={12} />
            Disponible dans {eligibility.daysRemaining} jour
            {(eligibility.daysRemaining ?? 0) > 1 ? "s" : ""}
          </div>
        );

      case "not_purchased":
        return (
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-full text-[11px] font-bold text-slate-500">
            <ShoppingBag size={12} />
            Achetez ce produit pour donner votre avis
          </div>
        );

      default:
        return null;
    }
  };

  /** Bandeau informatif */
  const renderInfoBanner = () => {
    if (!isAuthenticated) return null;

    if (eligibility.reason === "waiting") {
      return (
        <div className="flex items-start gap-3 p-4 bg-amber-50/60 border border-amber-100 rounded-2xl">
          <div className="p-2 bg-amber-100 rounded-lg shrink-0">
            <Info size={14} className="text-amber-700" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-900">
              Vous pourrez bientôt donner votre avis
            </p>
            <p className="text-[11px] text-amber-800/80 mt-0.5 leading-relaxed">
              Pour garantir la qualité des avis, nous vous laissons 5 jours
              d’utilisation avant de pouvoir noter ce produit.
              {eligibility.availableAt && (
                <>
                  {" "}
                  Disponible le{" "}
                  <span className="font-bold">
                    {new Date(eligibility.availableAt).toLocaleDateString(
                      "fr-FR",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </span>
                  .
                </>
              )}
            </p>
          </div>
        </div>
      );
    }

    if (eligibility.reason === "not_purchased") {
      return (
        <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
          <div className="p-2 bg-slate-100 rounded-lg shrink-0">
            <ShoppingBag size={14} className="text-slate-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">
              Achat vérifié requis
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Seuls les clients ayant acheté ce produit peuvent laisser un
              avis. Cela garantit la fiabilité des notes.
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section className="space-y-6">
      {/* En-tête */}
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-base md:text-lg font-black text-lurevia-dark">
            Avis clients
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {rating.count > 0
              ? `${rating.count} avis · moyenne ${rating.average.toFixed(1)}/5`
              : "Soyez le premier à donner votre avis"}
          </p>
        </div>

        {renderAction()}
      </header>

      {renderInfoBanner()}

      {/* Résumé */}
      {rating.count > 0 && (
        <ProductReviewSummary
          average={rating.average}
          count={rating.count}
          distribution={rating.distribution}
        />
      )}

      {/* Formulaire d'ajout */}
      {isFormOpen && !myReview && eligibility.reason === "eligible" && user && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <h4 className="text-sm font-black text-lurevia-dark uppercase tracking-wider mb-4">
            Écrire un avis
          </h4>
          <ProductReviewForm
            onSubmit={(data) => {
              addReview({
                productId,
                userId: user.id,
                userName: user.fullName,
                userAvatar: user.avatarUrl,
                rating: data.rating,
                title: data.title,
                comment: data.comment,
              });
              setIsFormOpen(false);
            }}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      )}

      {/* Formulaire d'édition */}
      {editingId && myReview && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <h4 className="text-sm font-black text-lurevia-dark uppercase tracking-wider mb-4">
            Modifier votre avis
          </h4>
          <ProductReviewForm
            initial={myReview}
            onSubmit={(data) => {
              updateReview(editingId, {
                rating: data.rating,
                title: data.title,
                comment: data.comment,
              });
              setEditingId(null);
            }}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}

      {/* Liste des avis */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs">
          Aucun avis pour ce produit pour le moment.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const isOwn = user?.id === review.userId;
            return (
              <ProductReviewCard
                key={review.id}
                review={review}
                isOwn={isOwn}
                onEdit={isOwn ? () => setEditingId(review.id) : undefined}
                onDelete={
                  isOwn
                    ? () => {
                        if (window.confirm("Supprimer cet avis ?")) {
                          deleteReview(review.id);
                        }
                      }
                    : undefined
                }
              />
            );
          })}
        </div>
      )}
    </section>
  );
};