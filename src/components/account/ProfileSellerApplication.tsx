import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "lucide-react";
import { sellerApi } from "../../api/seller";
import { toErrorMessage } from "../../api/http";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

export const ProfileSellerApplication = ({
  isVerified,
}: {
  isVerified: boolean;
}) => {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [contractType, setContractType] = useState<
    "PERCENTAGE" | "MONTHLY_FIXED"
  >("PERCENTAGE");
  const [contractValue, setContractValue] = useState("10");
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [storeLogoUrl, setStoreLogoUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const value = Number(contractValue);
    if (
      !Number.isInteger(value) ||
      value < 0 ||
      (contractType === "PERCENTAGE" && value > 100)
    ) {
      setError(
        contractType === "PERCENTAGE"
          ? "Le pourcentage doit être compris entre 0 et 100."
          : "Le montant mensuel doit être un nombre positif.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await sellerApi.apply({
        type: contractType,
        value,
        storeName: storeName.trim(),
        storeDescription: storeDescription.trim(),
        ...(storeLogoUrl.trim() ? { storeLogoUrl: storeLogoUrl.trim() } : {}),
      });
      await refreshUser();
      navigate("/vendeur");
    } catch (submitError) {
      setError(
        toErrorMessage(
          submitError,
          "Impossible d'envoyer votre contrat vendeur.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
      ) : !isFormOpen ? (
        <Button
          type="button"
          icon={Store}
          onClick={() => setIsFormOpen(true)}
          className="rounded-xl!"
        >
          Devenir vendeur
        </Button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 border-t border-slate-100 pt-4"
        >
          <Input
            label="Nom public de la boutique"
            value={storeName}
            onChange={(event) => setStoreName(event.target.value)}
            minLength={2}
            maxLength={100}
            required
          />
          <label className="block text-xs font-bold text-slate-700">
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
          <Input
            label="Logo public (URL, facultatif)"
            type="url"
            value={storeLogoUrl}
            onChange={(event) => setStoreLogoUrl(event.target.value)}
          />
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Type de contrat
            </label>
            <Select
              value={contractType}
              onChange={(event) =>
                setContractType(
                  event.target.value as "PERCENTAGE" | "MONTHLY_FIXED",
                )
              }
            >
              <option value="PERCENTAGE">Commission sur les ventes (%)</option>
              <option value="MONTHLY_FIXED">Forfait mensuel (MGA)</option>
            </Select>
          </div>
          <Input
            label={
              contractType === "PERCENTAGE"
                ? "Commission (%)"
                : "Forfait mensuel (MGA)"
            }
            type="number"
            min={0}
            max={contractType === "PERCENTAGE" ? 100 : 100000000}
            value={contractValue}
            onChange={(event) => setContractValue(event.target.value)}
            required
          />
          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl!"
            >
              {isSubmitting
                ? "Envoi du contrat…"
                : "Devenir vendeur et envoyer le contrat"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsFormOpen(false)}
              disabled={isSubmitting}
              className="rounded-xl!"
            >
              Annuler
            </Button>
          </div>
        </form>
      )}
    </section>
  );
};
