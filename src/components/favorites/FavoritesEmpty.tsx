import type { FC } from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

export const FavoritesEmpty: FC = () => (
  <div className="text-center py-16 md:py-24 max-w-md mx-auto">
    <div className="inline-flex p-6 bg-red-50 rounded-full mb-6">
      <Heart size={40} className="text-red-300" strokeWidth={1.5} />
    </div>

    <h2 className="text-xl md:text-2xl font-black text-lurevia-dark">
      Aucun favori pour le moment
    </h2>
    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
      Ajoutez vos créations préférées en cliquant sur le cœur d’un produit. Elles
      vous attendront ici.
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