import type { FC } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

export const CartEmpty: FC = () => (
  <div className="text-center py-16 md:py-24 max-w-md mx-auto">
    <div className="inline-flex p-6 bg-slate-50 rounded-full mb-6">
      <ShoppingBag size={40} className="text-slate-300" strokeWidth={1.5} />
    </div>

    <h1 className="text-xl md:text-2xl font-black text-lurevia-dark">
      Votre panier est vide
    </h1>
    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
      Découvrez nos créations artisanales malgaches et ajoutez vos coups de
      cœur.
    </p>

    <Link to="/boutique" className="inline-block mt-6">
      <Button
        variant="primary"
        icon={ArrowRight}
        iconPosition="right"
        className="px-6! py-3! rounded-full!"
      >
        Découvrir la boutique
      </Button>
    </Link>
  </div>
);