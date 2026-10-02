import { Link } from "react-router-dom";
import { Store } from "lucide-react";

export const ProfileSellerApplication = ({
  isVerified,
}: {
  isVerified: boolean;
}) => {
  return (
    <section className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-orange-50 text-lurevia-orange">
          <Store size={18} />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-black text-lurevia-dark">
            Vendre sur Lurevia
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Seuls les comptes vérifiés peuvent vendre. Votre contrat sera envoyé
            à l’administration pour approbation.
          </p>
        </div>
      </div>

      {!isVerified ? (
        <Link
          to="/compte/verification"
          className="inline-flex items-center justify-center rounded-xl bg-lurevia-orange px-4 py-2.5 text-sm font-bold text-white"
        >
          Vérifier mon compte pour vendre
        </Link>
      ) : (
        <Link
          to="/compte/devenir-vendeur"
          className="inline-flex items-center gap-2 rounded-xl bg-lurevia-orange px-4 py-2.5 text-sm font-bold text-white"
        >
          <Store size={16} /> Créer ma boutique
        </Link>
      )}
    </section>
  );
};
