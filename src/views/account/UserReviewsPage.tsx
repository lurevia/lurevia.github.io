import { useMemo, useState } from "react";
import type { FC } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  MessageSquareHeart,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useReviews } from "../../hooks/useReviews";
import { useFeedback } from "../../hooks/useFeedback";
import { useOrders } from "../../hooks/useOrders";
import { MOCK_PRODUCTS } from "../../bin/data/mock";


import { Button } from "../../components/ui/Button";
import type { Product } from "../../bin/types/homeType";
import type { ProductReview } from "../../bin/types/reviewType";
import { MyReviewCard } from "./MyReviewCard";
import { MyFeedbackCard } from "./MyFeedbackCard";
import { PendingReviewCard } from "./PendingReviewCard";
import { REVIEW_DELAY_DAYS } from "../../bin/utils/constant/constant";

type Tab = "pending" | "product-reviews" | "service-feedback";

type PendingReview = {
  product: Product;
  daysRemaining: number;
  availableAt: string;
};



export const UserReviewsPage: FC = () => {
  const { user } = useAuth();
  const { orders } = useOrders();
  const {
    getUserReviewForProduct,
    deleteReview,
  } = useReviews();
  const { myFeedbacks, deleteFeedback } = useFeedback();

  const [tab, setTab] = useState<Tab>("pending");

  const pendingReviews = useMemo<PendingReview[]>(() => {
    if (!user) return [];

    const now = Date.now();
    const delayMs = REVIEW_DELAY_DAYS * 24 * 60 * 60 * 1000;
    const seen = new Set<string>();
    const result: PendingReview[] = [];

    for (const order of orders) {
      const orderTime = new Date(order.createdAt).getTime();
      const availableAt = orderTime + delayMs;

      for (const item of order.items) {
        if (seen.has(item.product.id)) continue;
        if (getUserReviewForProduct(item.product.id)) continue;

        const fullProduct = MOCK_PRODUCTS.find(
          (p) => p.id === item.product.id
        );
        if (!fullProduct) continue;

        seen.add(item.product.id);
        result.push({
          product: fullProduct,
          daysRemaining: Math.max(
            0,
            Math.ceil((availableAt - now) / delayMs)
          ),
          availableAt: new Date(availableAt).toISOString(),
        });
      }
    }

    return result;
  }, [user, orders, getUserReviewForProduct]);

  const myProductReviews = useMemo<
    { review: ProductReview; product: Product }[]
  >(() => {
    if (!user) return [];

    const result: { review: ProductReview; product: Product }[] = [];
    const seen = new Set<string>();

    for (const order of orders) {
      for (const item of order.items) {
        if (seen.has(item.product.id)) continue;
        seen.add(item.product.id);

        const review = getUserReviewForProduct(item.product.id);
        if (!review) continue;

        const fullProduct = MOCK_PRODUCTS.find(
          (p) => p.id === item.product.id
        );
        if (!fullProduct) continue;

        result.push({ review, product: fullProduct });
      }
    }

    return result.sort((a, b) =>
      b.review.updatedAt.localeCompare(a.review.updatedAt)
    );
  }, [user, orders, getUserReviewForProduct]);

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm("Supprimer cet avis définitivement ?")) {
      deleteReview(reviewId);
    }
  };

  const handleDeleteFeedback = (id: string) => {
    if (window.confirm("Supprimer ce feedback ?")) {
      deleteFeedback(id);
    }
  };

  const counts = {
    pending: pendingReviews.length,
    productReviews: myProductReviews.length,
    serviceFeedback: myFeedbacks.length,
  };

  const total =
    counts.pending + counts.productReviews + counts.serviceFeedback;

  const TABS: { id: Tab; label: string; icon: typeof Star; count: number }[] =
    [
      {
        id: "pending",
        label: "À donner",
        icon: Clock,
        count: counts.pending,
      },
      {
        id: "product-reviews",
        label: "Avis produits",
        icon: Star,
        count: counts.productReviews,
      },
      {
        id: "service-feedback",
        label: "Feedbacks service",
        icon: MessageSquareHeart,
        count: counts.serviceFeedback,
      },
    ];

  const renderContent = () => {
    switch (tab) {
      case "pending":
        return pendingReviews.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="Aucun avis en attente"
            description="Tous vos avis produits ont été donnés. Bravo !"
            ctaLabel="Continuer mes achats"
            ctaTo="/boutique"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingReviews.map((p) => (
              <PendingReviewCard
                key={p.product.id}
                product={p.product}
                daysRemaining={p.daysRemaining}
                availableAt={p.availableAt}
              />
            ))}
          </div>
        );

      case "product-reviews":
        return myProductReviews.length === 0 ? (
          <EmptyState
            icon={Star}
            title="Aucun avis produit"
            description="Vos avis sur les produits achetés apparaîtront ici."
            ctaLabel="Voir mes commandes"
            ctaTo="/compte/commandes"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myProductReviews.map(({ review, product }) => (
              <MyReviewCard
                key={review.id}
                review={review}
                product={product}
                onDelete={() => handleDeleteReview(review.id)}
              />
            ))}
          </div>
        );

      case "service-feedback":
        return myFeedbacks.length === 0 ? (
          <EmptyState
            icon={MessageSquareHeart}
            title="Aucun feedback service"
            description="Dites-nous comment nous améliorer : livraison, service client, site web…"
            ctaLabel="Donner un feedback"
            ctaTo="/feedback"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myFeedbacks.map((fb) => (
              <MyFeedbackCard
                key={fb.id}
                feedback={fb}
                onEdit={() => {
                  window.location.href = "/feedback";
                }}
                onDelete={() => handleDeleteFeedback(fb.id)}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <>
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-lurevia-dark">
          Mes avis & feedbacks
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {total === 0
            ? "Vous n’avez encore rien publié"
            : `${total} élément${total > 1 ? "s" : ""} · ${
                counts.pending
              } en attente`}
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
        <div className="p-2 bg-white rounded-lg shrink-0">
          <Clock size={14} className="text-lurevia-orange" />
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          <strong className="text-slate-800">Délai de 5 jours :</strong> pour
          garantir la qualité des avis, vous pouvez noter un produit à partir
          de 5 jours après la commande. Cela vous laisse le temps de bien
          l’utiliser.
        </p>
      </div>

      {total > 0 && (
        <div className="flex gap-1 overflow-x-auto pb-1">
          {TABS.map((t) => {
            const active = tab === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  active
                    ? "bg-lurevia-dark text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon size={12} />
                {t.label}
                {t.count > 0 && (
                  <span
                    className={`ml-0.5 ${
                      active ? "opacity-70" : "opacity-60"
                    }`}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {renderContent()}
    </>
  );
};

const EmptyState: FC<{
  icon: typeof Star;
  title: string;
  description: string;
  ctaLabel: string;
  ctaTo: string;
}> = ({ icon: Icon, title, description, ctaLabel, ctaTo }) => (
  <div className="text-center py-16 md:py-20 max-w-md mx-auto">
    <div className="inline-flex p-6 bg-slate-50 rounded-full mb-5">
      <Icon size={40} className="text-slate-300" strokeWidth={1.5} />
    </div>
    <h2 className="text-lg font-black text-lurevia-dark">{title}</h2>
    <p className="text-sm text-slate-500 mt-2">{description}</p>
    <Link to={ctaTo} className="inline-block mt-5">
      <Button
        variant="primary"
        className="rounded-full! px-6! py-3!"
        icon={ArrowRight}
        iconPosition="right"
      >
        {ctaLabel}
      </Button>
    </Link>
  </div>
);