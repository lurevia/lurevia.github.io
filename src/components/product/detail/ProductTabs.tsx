import { useEffect, useState } from "react";
import type { FC } from "react";
import type { Product } from "../../../bin/types/homeType";
import { ProductReviewsList } from "../../reviews/ProductReviewsList";

type TabId = "description" | "reviews" | "shipping";

type ProductTabsProps = {
  product: Product;
  /** 🎯 Onglet à afficher par défaut */
  initialTab?: TabId;
  /** 🆕 Ouvre automatiquement le formulaire d'avis */
  autoOpenReviewForm?: boolean;
};

export const ProductTabs: FC<ProductTabsProps> = ({
  product,
  initialTab = "description",
  autoOpenReviewForm = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  /** 🎯 Si initialTab change (arrivée avec #reviews), on synchronise */
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const tabs: { id: TabId; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "reviews", label: "Avis" },
    { id: "shipping", label: "Livraison" },
  ];

  return (
    <div className="border-t border-slate-100 pt-8 text-left" id="reviews">
      {/* Onglets */}
      <div className="flex gap-1 border-b border-slate-100 mb-6 overflow-x-auto no-scrollbar select-none">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-3 text-xs md:text-sm font-black uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                active
                  ? "text-lurevia-dark"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-lurevia-orange rounded-full animate-fadeIn" />
              )}
            </button>
          );
        })}
      </div>

      {/* Contenu */}
      <div className="text-xs md:text-sm font-medium text-slate-600 leading-relaxed max-w-3xl">
        {activeTab === "description" && (
          <div className="space-y-3 animate-fadeIn">
            <p>
              {product.longDescription ??
                product.description ??
                "Aucune description disponible."}
            </p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="animate-fadeIn">
            <ProductReviewsList
              productId={product.id}
              autoOpenForm={autoOpenReviewForm}
            />
          </div>
        )}

        {activeTab === "shipping" && (
          <ul className="space-y-3 pl-1 list-none animate-fadeIn text-xs md:text-sm">
            <li className="flex items-start gap-2.5">
              <span className="text-lurevia-orange font-black text-sm leading-none">
                •
              </span>
              <span>
                Livraison garantie partout à Madagascar sous un délai de 2 à 5
                jours ouvrés.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-lurevia-orange font-black text-sm leading-none">
                •
              </span>
              <span>
                Expédition logistique sous 24h pour l'ensemble des commandes
                enregistrées avant 15h.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-lurevia-orange font-black text-sm leading-none">
                •
              </span>
              <span>
                Retours acceptés en toute sérénité sous un délai de 14 jours
                après réception.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-lurevia-orange font-black text-sm leading-none">
                •
              </span>
              <span>
                Solutions flexibles de règlement : paiement à la livraison,
                Mobile Money ou carte bancaire.
              </span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};