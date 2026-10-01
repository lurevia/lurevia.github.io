import { useEffect, useMemo, useState } from "react";
import type { FC } from "react";
import { Clock, MessageSquareHeart, Star } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useReviews } from "../../hooks/useReviews";
import { useFeedback } from "../../hooks/useFeedback";
import { useOrders } from "../../hooks/useOrders";
import { REVIEW_DELAY_DAYS } from "../../bin/config/env";
import type { ProductReview } from "../../bin/types/reviewType";
import type { ReviewableProduct } from "./reviewableProduct";
import {
  UserReviewContent,
  type PendingReview,
  type UserReviewTab,
} from "./UserReviewContent";

type Tab = UserReviewTab;
type PurchasedProduct = { product: ReviewableProduct; orderedAt: number };

const DAY_MS = 24 * 60 * 60 * 1000;

export const UserReviewsPage: FC = () => {
  const { user } = useAuth();
  const { orders } = useOrders();
  const { getUserReviewForProduct, loadMyReviews, deleteReview } = useReviews();
  const { myFeedbacks, deleteFeedback } = useFeedback();
  const [tab, setTab] = useState<Tab>("pending");

  const purchased = useMemo(() => {
    const productsById = new Map<string, PurchasedProduct>();
    for (const order of orders) {
      const orderedAt = new Date(order.createdAt).getTime();
      for (const item of order.items) {
        const existing = productsById.get(item.productId);
        if (existing && existing.orderedAt <= orderedAt) continue;
        productsById.set(item.productId, {
          product: {
            id: item.productId,
            title: item.title,
            imageUrl: item.imageUrl,
          },
          orderedAt,
        });
      }
    }
    return Array.from(productsById.values());
  }, [orders]);

  const purchasedIds = useMemo(
    () => purchased.map((entry) => entry.product.id),
    [purchased],
  );
  const purchasedKey = purchasedIds.join(",");

  useEffect(() => {
    if (purchasedIds.length > 0) void loadMyReviews(purchasedIds);
  }, [purchasedKey, loadMyReviews]);

  const pendingReviews = useMemo<PendingReview[]>(() => {
    if (!user) return [];
    const now = Date.now();
    return purchased
      .filter((entry) => !getUserReviewForProduct(entry.product.id))
      .map((entry) => {
        const availableAt = entry.orderedAt + REVIEW_DELAY_DAYS * DAY_MS;
        return {
          product: entry.product,
          daysRemaining: Math.max(0, Math.ceil((availableAt - now) / DAY_MS)),
          availableAt: new Date(availableAt).toISOString(),
        };
      });
  }, [user, purchased, getUserReviewForProduct]);

  const productReviews = useMemo<
    { review: ProductReview; product: ReviewableProduct }[]
  >(() => {
    if (!user) return [];
    return purchased
      .map(({ product }) => {
        const review = getUserReviewForProduct(product.id);
        return review ? { review, product } : null;
      })
      .filter(
        (
          entry,
        ): entry is { review: ProductReview; product: ReviewableProduct } =>
          entry !== null,
      )
      .sort((first, second) =>
        second.review.updatedAt.localeCompare(first.review.updatedAt),
      );
  }, [user, purchased, getUserReviewForProduct]);

  const handleDeleteReview = (reviewId: string, productId: string) => {
    if (window.confirm("Supprimer cet avis définitivement ?")) {
      void deleteReview(reviewId, productId);
    }
  };

  const handleDeleteFeedback = (feedbackId: string) => {
    if (window.confirm("Supprimer ce feedback ?")) {
      void deleteFeedback(feedbackId);
    }
  };

  const counts = {
    pending: pendingReviews.length,
    productReviews: productReviews.length,
    serviceFeedback: myFeedbacks.length,
  };
  const total = counts.pending + counts.productReviews + counts.serviceFeedback;
  const tabs = [
    { id: "pending", label: "À donner", icon: Clock, count: counts.pending },
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
  ] satisfies { id: Tab; label: string; icon: typeof Star; count: number }[];

  return (
    <>
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-lurevia-dark">
          Mes avis &amp; feedbacks
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {total === 0
            ? "Vous n’avez encore rien publié"
            : `${total} élément${total > 1 ? "s" : ""} · ${counts.pending} en attente`}
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
        <div className="p-2 bg-white rounded-lg shrink-0">
          <Clock size={14} className="text-lurevia-orange" />
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          <strong className="text-slate-800">
            Délai de {REVIEW_DELAY_DAYS} jours :
          </strong>{" "}
          vous pouvez noter un produit {REVIEW_DELAY_DAYS} jours après la
          commande.
        </p>
      </div>

      {total > 0 && (
        <div className="flex gap-1 overflow-x-auto pb-1">
          {tabs.map(({ id, label, icon: Icon, count }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  active
                    ? "bg-lurevia-dark text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon size={12} />
                {label}
                {count > 0 && (
                  <span className={active ? "opacity-70" : "opacity-60"}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <UserReviewContent
        tab={tab}
        pendingReviews={pendingReviews}
        productReviews={productReviews}
        feedbacks={myFeedbacks}
        onDeleteReview={handleDeleteReview}
        onDeleteFeedback={handleDeleteFeedback}
      />
    </>
  );
};
