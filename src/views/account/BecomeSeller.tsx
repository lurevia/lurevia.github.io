import { useState } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Store, ShieldCheck } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";
import { sellerApi } from "../../api/seller";
import { useCategories } from "../../hooks/useCategories";
import { ImageDropzone } from "../../components/common/ImageDropzone";
import { toErrorMessage } from "../../api/http";
import {
  SellerContractSelector,
  type SellerContractType,
} from "../../components/account/SellerContractSelector";

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
  const { categories, isLoading: categoriesLoading } = useCategories();
  const navigate = useNavigate();
  const [type, setType] = useState<SellerContractType>("PERCENTAGE");
  const [value, setValue] = useState(10);
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [storeLogoUrl, setStoreLogoUrl] = useState("");
  const [storeCategoryId, setStoreCategoryId] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  if (user.role === "SELLER") {
    return (
      <div className="rounded-2xl bg-white border border-slate-100 p-6 text-center">
        <p className="font-black text-lurevia-dark">
          Vous êtes déjà vendeur sur Lurevia.
        </p>
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
          <p className="font-black text-lurevia-dark">
            Vérifiez d'abord votre compte
          </p>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Pour la sécurité de la marketplace, seuls les comptes vérifiés peuvent
          devenir vendeurs.
        </p>
        <Button onClick={() => navigate("/compte/verification")}>
          Vérifier mon compte
        </Button>
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
      await sellerApi.apply({
        type,
        value,
        storeName: storeName.trim(),
        storeDescription: storeDescription.trim(),
        storeCategoryId,
        ...(storeLogoUrl.trim() ? { storeLogoUrl: storeLogoUrl.trim() } : {}),
      });
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
        <h1 className="text-xl md:text-2xl font-black text-lurevia-dark">
          Devenir vendeur
        </h1>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Vendez vos produits directement aux clients Lurevia. Choisissez la
        formule de commission qui vous convient.
      </p>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-2xl bg-white border border-slate-100 p-5 space-y-5">
        <div className="space-y-3">
          <Input
            label="Nom public de la boutique"
            value={storeName}
            onChange={(event) => setStoreName(event.target.value)}
            minLength={2}
            maxLength={100}
            required
          />
          <label className="block text-xs font-bold text-slate-500">
            Présentation de la boutique
            <textarea
              value={storeDescription}
              onChange={(event) => setStoreDescription(event.target.value)}
              minLength={20}
              maxLength={1000}
              rows={4}
              required
              className="mt-1 w-full rounded-lg border border-slate-200 p-3 text-sm"
              placeholder="Présentez votre activité et votre savoir-faire."
            />
          </label>
          <label className="block text-xs font-bold text-slate-600">
            Catégorie principale de la boutique
            <select
              value={storeCategoryId}
              onChange={(event) => setStoreCategoryId(event.target.value)}
              required
              disabled={categoriesLoading}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm"
            >
              <option value="">Choisir une catégorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <ImageDropzone
            images={storeLogoUrl ? [storeLogoUrl] : []}
            onChange={(images) => setStoreLogoUrl(images[0] ?? "")}
            label="Logo public de la boutique (facultatif)"
            circular
          />
        </div>
        <SellerContractSelector
          type={type}
          value={value}
          onTypeChange={(nextType, nextValue) => {
            setType(nextType);
            setValue(nextValue);
          }}
          onValueChange={setValue}
        />

        <label className="flex items-start gap-2 text-xs text-slate-500">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            J'accepte que Lurevia prélève la commission convenue sur mes ventes
            et que mes produits respectent la charte qualité de la marketplace.
          </span>
        </label>

        <Button
          onClick={() => void submit()}
          disabled={submitting}
          className="w-full"
        >
          {submitting ? "Envoi de la candidature…" : "Envoyer ma candidature"}
        </Button>
      </div>
    </div>
  );
};
