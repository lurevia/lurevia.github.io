import {
  BarChart3,
  Package,
  RefreshCw,
  ShoppingBag,
  Store,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { SellerTab } from "./sellerDisplay";

const TABS = [
  { id: "dashboard", label: "Tableau de bord", icon: BarChart3 },
  { id: "products", label: "Produits", icon: Package },
  { id: "orders", label: "Commandes", icon: ShoppingBag },
  { id: "store", label: "Ma boutique", icon: Store },
] satisfies { id: SellerTab; label: string; icon: typeof Store }[];

type SellerSpaceNavigationProps = {
  activeTab: SellerTab;
  userId?: string;
  onTabChange: (tab: SellerTab) => void;
  onRefresh: () => void;
};

export const SellerSpaceNavigation = ({
  activeTab,
  userId,
  onTabChange,
  onRefresh,
}: SellerSpaceNavigationProps) => (
  <>
    <header className="flex flex-wrap items-center justify-between gap-4 mb-7">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-lurevia-orange">
          Espace vendeur
        </p>
        <h1 className="text-2xl md:text-3xl font-black text-lurevia-dark">
          Votre activité
        </h1>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onRefresh}
          className="p-2 rounded-xl border border-slate-200 text-slate-500"
          aria-label="Actualiser"
        >
          <RefreshCw size={17} />
        </button>
        {userId && (
          <Link
            to={`/vendeurs/${userId}`}
            className="text-sm font-bold text-lurevia-orange py-2"
          >
            Voir mon profil public
          </Link>
        )}
      </div>
    </header>

    <nav
      aria-label="Navigation vendeur"
      className="flex gap-2 mb-6 border-b border-slate-100"
    >
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onTabChange(id)}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 ${
            activeTab === id
              ? "border-lurevia-orange text-lurevia-dark"
              : "border-transparent text-slate-400"
          }`}
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </nav>
  </>
);
