import { useState } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Store, ShieldCheck, Percent, Wallet } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { sellerApi } from "../../api/seller";
import { toErrorMessage } from "../../api/http";

type ContractType = "PERCENTAGE" | "MONTHLY_FIXED";

/**
 * Parcours "devenir vendeur" : jusqu'ici, l'endpoint POST /seller/apply
 * existait côté API mais rien dans le storefront ne permettait de
 * l'atteindre — un client ne pouvait devenir vendeur qu'en connaissant
 * l'URL de l'API par cœur. Cette page comble ce vide.
 *
 * Le compte doit être vérifié au préalable (règle déjà appliquée côté
 * service) : on l'explique clairement plutôt que de laisser l'utilisateur
 * découvrir un 403 après avoir rempli le formulaire.
 */
export const BecomeSellerPage: FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [type, setType] = useState<ContractType>("PERCENTAGE");
  const [value, setValue] = useState(10);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  if (user.role === "SELLER") {
    return (
      <div className="rounded-2xl bg-white border border-slate-100 p-6 text-center">
        <p className="font-black text-lurevia-dark">Vous êtes déjà vendeur sur Lurevia.</p>
        <Button className="mt-4" onClick={() => navigate("/vendeur")}>
          Accéder à mon espace vendeur
        </Button>
      </div>
    );
  }

  if (user.role !== "CUSTOMER") {
    return (
      <div className="rounded-2xl bg-white border border-slate-100 p-6 text-center text-sm text-slate-500">
        Ce type de compte ne peut pas devenir vendeur.
      </div>
    );
  }

  if (!user.isVerified) {
    return (
      <div className="rounded-2xl bg-white border border-slate-100 p-6">
        <div className="flex items-center gap-3 mb-3">
          <ShieldCheck className="text-lurevia-orange" size={22} />
          <p className="font-black text-lurevia-dark">Vérifiez d'abord votre compte</p>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Pour la sécurité de la marketplace, seuls les comptes vérifiés peuvent devenir vendeurs.
        </p>
        <Button onClick={() => navigate("/compte/verification")}>Vérifier mon compte</Button>
      </div>
    );
  }

  const submit = async () => {
    if (!acceptedTerms) {
      setError("Merci d'accepter les conditions vendeur pour continuer.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await sellerApi.apply({ type, value });
      await refreshUser();
      navigate("/vendeur", { replace: true });
    } catch (err) {
      setError(toErrorMessage(err, "La demande n'a pas pu être envoyée."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-1">
        <Store className="text-lurevia-orange" size={22} />
        <h1 className="text-xl md:text-2xl font-black text-lurevia-dark">Devenir vendeur</h1>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Vendez vos produits directement aux clients Lurevia. Choisissez la formule de commission qui vous convient.
      </p>

      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

      <div className="rounded-2xl bg-white border border-slate-100 p-5 space-y-5">
        <div>
          <p className="text-xs font-bold text-slate-500 mb-2">Type de contrat</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setType("PERCENTAGE");
                setValue(10);
              }}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-bold ${
                type === "PERCENTAGE" ? "border-lurevia-orange bg-orange-50" : "border-slate-200"
              }`}
            >
              <Percent size={20} />
              Commission (%)
            </button>
            <button
              type="button"
              onClick={() => {
                setType("MONTHLY_FIXED");
                setValue(50000);
              }}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-bold ${
                type === "MONTHLY_FIXED" ? "border-lurevia-orange bg-orange-50" : "border-slate-200"
              }`}
            >
              <Wallet size={20} />
              Abonnement mensuel fixe
            </button>
          </div>
        </div>

        <label className="block text-xs font-bold text-slate-500">
          {type === "PERCENTAGE" ? "Pourcentage proposé (0-100)" : "Montant mensuel proposé (Ar)"}
          <input
            type="number"
            min={0}
            max={type === "PERCENTAGE" ? 100 : undefined}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm"
          />
        </label>

        <label className="flex items-start gap-2 text-xs text-slate-500">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            J'accepte que Lurevia prélève la commission convenue sur mes ventes et que mes produits respectent la
            charte qualité de la marketplace.
          </span>
        </label>

        <Button onClick={() => void submit()} disabled={submitting} className="w-full">
          {submitting ? "Envoi de la candidature…" : "Envoyer ma candidature"}
        </Button>
      </div>
    </div>
  );
};
