import { useState } from "react";
import type { FC } from "react";
import { Star } from "lucide-react";
import type { Product } from "../../../bin/types/homeType";

type ProductTabsProps = {
  product: Product;
};

type TabId = "description" | "reviews" | "shipping";

export const ProductTabs: FC<ProductTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<TabId>("description");

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: "description", label: "Description" },
    { id: "reviews", label: "Avis", count: product.reviewCount ?? 0 },
    { id: "shipping", label: "Livraison" },
  ];

  return (
    <div className="border-t border-slate-100 pt-8 text-left">
      {/* Onglets tactiles horizontaux */}
      <div className="flex gap-1 border-b border-slate-100 mb-6 overflow-x-auto no-scrollbar select-none">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-3 text-xs md:text-sm font-black uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${active
                  ? "text-lurevia-dark"
                  : "text-slate-400 hover:text-slate-600"
                }`}
            >
              {tab.label}
              {typeof tab.count === "number" && tab.count > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 text-[9px] font-bold rounded-full transition-colors ${active
                    ? "bg-lurevia-dark text-white"
                    : "bg-slate-100 text-slate-500"
                  }`}>
                  {tab.count}
                </span>
              )}
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-lurevia-orange rounded-full animate-fadeIn" />
              )}
            </button>
          );
        })}
      </div>

      <div className="text-xs md:text-sm font-medium text-slate-600 leading-relaxed max-w-2xl">
        {activeTab === "description" && (
          <div className="space-y-3 animate-fadeIn">
            <p>{product.longDescription ?? product.description ?? "Aucune description disponible."}</p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4 Amnimate-fadeIn">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 bg-slate-50 border border-slate-100/50 rounded-2xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs md:text-sm">
                      {review.author}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < review.rating
                              ? "fill-lurevia-yellow text-lurevia-yellow"
                              : "text-slate-200"
                          }
                          strokeWidth={i < review.rating ? 1 : 2}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400">{review.date}</p>
                  <p className="text-xs text-slate-600 font-medium">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-xs italic py-4">Aucun avis pour le moment.</p>
            )}
          </div>
        )}

        {activeTab === "shipping" && (
          <ul className="space-y-3 pl-1 list-none animate-fadeIn text-xs md:text-sm">
            <li className="flex items-start gap-2.5">
              <span className="text-lurevia-orange font-black text-sm leading-none">•</span>
              <span>Livraison garantie partout à Madagascar sous un délai de 2 à 5 jours ouvrés.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-lurevia-orange font-black text-sm leading-none">•</span>
              <span>Expédition logistique sous 24h pour l'ensemble des commandes enregistrées avant 15h.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-lurevia-orange font-black text-sm leading-none">•</span>
              <span>Retours acceptés en toute sérénité sous un délai de 14 jours après réception.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-lurevia-orange font-black text-sm leading-none">•</span>
              <span>Solutions flexibles de règlement : paiement à la livraison, Mobile Money ou carte bancaire.</span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};
