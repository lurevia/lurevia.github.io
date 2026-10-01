import {
  Clock,
  Info,
  MessageSquarePlus,
  ShoppingBag,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { REVIEW_DELAY_DAYS } from "../../bin/config/env";
import type { ReviewEligibility } from "../../bin/types/reviewType";
import { Button } from "../ui/Button";

type ProductReviewEligibilityProps = {
  isAuthenticated: boolean;
  hasReview: boolean;
  isFormOpen: boolean;
  eligibility: ReviewEligibility;
  onOpenForm: () => void;
};

export const ProductReviewAction = ({
  isAuthenticated,
  hasReview,
  isFormOpen,
  eligibility,
  onOpenForm,
}: ProductReviewEligibilityProps) => {
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
  if (hasReview) return null;

  if (eligibility.reason === "eligible" && !isFormOpen) {
    return (
      <Button
        variant="primary"
        size="sm"
        icon={MessageSquarePlus}
        onClick={onOpenForm}
        className="rounded-full!"
      >
        Écrire un avis
      </Button>
    );
  }
  if (eligibility.reason === "waiting") {
    const remainingDays = eligibility.daysRemaining ?? 0;
    return (
      <div className="inline-flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-full text-[11px] font-bold text-amber-800">
        <Clock size={12} />
        Disponible dans {remainingDays} jour{remainingDays > 1 ? "s" : ""}
      </div>
    );
  }
  if (eligibility.reason === "not_purchased") {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-full text-[11px] font-bold text-slate-500">
        <ShoppingBag size={12} />
        Achetez ce produit pour donner votre avis
      </div>
    );
  }
  return null;
};

export const ProductReviewInformation = ({
  isAuthenticated,
  eligibility,
}: Pick<ProductReviewEligibilityProps, "isAuthenticated" | "eligibility">) => {
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
            Pour garantir la qualité des avis, attendez {REVIEW_DELAY_DAYS}{" "}
            jours après la commande.
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
                    },
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
            Seuls les clients ayant acheté ce produit peuvent laisser un avis.
            Cela garantit la fiabilité des notes.
          </p>
        </div>
      </div>
    );
  }

  return null;
};
