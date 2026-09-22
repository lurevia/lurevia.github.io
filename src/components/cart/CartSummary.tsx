import type { FC } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldAlert, ShieldCheck, Truck, Tag } from "lucide-react";
import { Button } from "../ui/Button";
import { formatAriary } from "../../bin/utils/formatAriary";
import { useAuth } from "../../hooks/useAuth";
import type { CartSummaryData } from "../../hooks/useCartPage";

type CartSummaryProps = {
  summary: CartSummaryData;
};

export const CartSummary: FC<CartSummaryProps> = ({ summary }) => {
  const {
    subtotal,
    shipping,
    total,
    freeShippingThreshold,
    amountToFreeShipping,
    hasFreeShipping,
  } = summary;

  const { user } = useAuth();
  const isVerified = user?.isVerified ?? false;

  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 md:sticky md:top-24 space-y-5">
      <h2 className="text-sm font-black text-lurevia-dark uppercase tracking-wider pb-3 border-b border-slate-100">
        Récapitulatif
      </h2>

      {!hasFreeShipping ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <Truck size={14} className="text-lurevia-orange" />
            Plus que{" "}
            <span className="text-lurevia-orange font-black">
              {formatAriary(amountToFreeShipping)}
            </span>{" "}
            pour la livraison offerte
          </p>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-lurevia-orange transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl">
          <Tag size={14} />
          Vous bénéficiez de la livraison offerte !
        </div>
      )}

      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Sous-total</span>
          <span className="font-bold text-slate-800">
            {formatAriary(subtotal)}
          </span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Livraison</span>
          <span
            className={`font-bold ${
              hasFreeShipping ? "text-emerald-600" : "text-slate-800"
            }`}
          >
            {hasFreeShipping ? "Offerte" : formatAriary(shipping)}
          </span>
        </div>

        <p className="text-[11px] text-slate-400 pt-1">
          Montants indicatifs — le total définitif est confirmé par nos
          serveurs lors de la validation de la commande.
        </p>

        <div className="flex justify-between items-baseline pt-3 mt-3 border-t border-slate-100">
          <span className="text-sm font-black text-lurevia-dark uppercase tracking-wider">
            Total
          </span>
          <span className="text-2xl font-black text-lurevia-dark">
            {formatAriary(total)}
          </span>
        </div>
      </div>

      {isVerified ? (
        <Link to="/checkout" className="block">
          <Button
            variant="primary"
            icon={ArrowRight}
            iconPosition="right"
            className="w-full! py-3.5! rounded-xl! font-black text-sm"
          >
            Passer la commande
          </Button>
        </Link>
      ) : (
        <div className="space-y-3">
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2">
            <ShieldAlert
              size={14}
              className="text-amber-600 shrink-0 mt-0.5"
            />
            <p className="text-xs text-amber-800 font-medium leading-snug">
              Vérifiez votre compte pour passer commande.
            </p>
          </div>
          <Link to="/compte" className="block">
            <Button
              variant="primary"
              className="w-full! py-3.5! rounded-xl! font-black text-sm"
            >
              Vérifier mon compte
            </Button>
          </Link>
        </div>
      )}

      <Link
        to="/boutique"
        className="block text-center text-xs font-bold text-slate-500 hover:text-lurevia-orange transition-colors"
      >
        Continuer mes achats
      </Link>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
        <ShieldCheck size={12} className="text-emerald-500" />
        Paiement 100 % sécurisé
      </div>
    </div>
  );
};