import type { FC } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { formatAriary } from "../../bin/utils/formatAriary";
import type { Order } from "../../bin/types/orderType";

type OrderSuccessProps = {
  order: Order;
};

export const OrderSuccess: FC<OrderSuccessProps> = ({ order }) => (
  <div className="max-w-lg mx-auto text-center py-12 space-y-6">
    <div className="inline-flex p-5 bg-emerald-50 rounded-full">
      <CheckCircle2 size={48} className="text-emerald-500" strokeWidth={1.5} />
    </div>

    <div>
      <h1 className="text-2xl md:text-3xl font-black text-lurevia-dark">
        Commande confirmée !
      </h1>
      <p className="text-sm text-slate-500 mt-2">
        Merci pour votre confiance. Nous préparons votre commande.
      </p>
    </div>

    <div className="bg-white border border-slate-100 rounded-2xl p-5 text-left space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          N° de commande
        </span>
        <span className="text-xs font-black text-slate-800 font-mono">
          {order.id}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Total payé
        </span>
        <span className="text-sm font-black text-lurevia-dark">
          {formatAriary(order.total)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Livraison
        </span>
        <span className="text-xs font-bold text-slate-700">
          {order.shipping.city}, {order.shipping.region}
        </span>
      </div>
    </div>

    <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
      <Package size={14} className="text-lurevia-orange" />
      Un SMS de suivi vous sera envoyé au {order.shipping.phone}
    </div>

    <Link to="/boutique" className="inline-block">
      <Button
        variant="primary"
        icon={ArrowRight}
        iconPosition="right"
        className="px-6! py-3! rounded-full!"
      >
        Continuer mes achats
      </Button>
    </Link>
  </div>
);