import { useState } from "react";
import type { FC, FormEvent } from "react";
import { ArrowLeft, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useVerification } from "../../hooks/useVerification";

export const VerificationPage: FC = () => {
  const { status, latestRequest, isLoading, error, submit } = useVerification();
  const [cinNumber, setCinNumber] = useState("");

  const verified = status === "APPROVED";
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (await submit(cinNumber.trim())) setCinNumber("");
  };

  return (
    <>
      <Link to="/compte" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-lurevia-dark uppercase tracking-wider">
        <ArrowLeft size={14} /> Retour au compte
      </Link>
      <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${verified ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-lurevia-orange"}`}>
            {verified ? <CheckCircle2 size={26} /> : <ShieldCheck size={26} />}
          </div>
          <div>
            <h1 className="text-2xl font-black text-lurevia-dark">Vérification d’identité</h1>
            <p className="text-sm text-slate-500 mt-1">
              {verified
                ? "Votre compte est vérifié."
                : status === "PENDING"
                  ? "Votre demande est en cours d’examen."
                  : status === "REJECTED"
                    ? "Votre demande a été refusée. Vous pouvez en envoyer une nouvelle."
                    : "Envoyez votre numéro CIN pour une vérification manuelle."}
            </p>
          </div>
        </div>

        {status === "PENDING" && (
          <div className="flex gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800">
            <Clock3 size={18} className="shrink-0" />
            Notre équipe examine votre numéro CIN manuellement. Aucun document ou photo n’est demandé.
          </div>
        )}

        {status === "REJECTED" && latestRequest?.rejectionReason && (
          <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
            Motif : {latestRequest.rejectionReason}
          </div>
        )}

        {!verified && status !== "PENDING" && (
          <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
            <p className="text-xs text-slate-500">
              Saisissez les 12 chiffres de votre CIN. La demande sera examinée par notre équipe; elle n’est pas vérifiée automatiquement par un opérateur.
            </p>
            <Input
              label="Numéro CIN"
              value={cinNumber}
              onChange={(event) => setCinNumber(event.target.value.replace(/\D/g, "").slice(0, 12))}
              inputMode="numeric"
              autoComplete="off"
              maxLength={12}
              pattern="[0-9]{12}"
              placeholder="12 chiffres"
              required
            />
            {error && <p className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-600">{error}</p>}
            <Button type="submit" disabled={isLoading || cinNumber.length !== 12} className="rounded-xl!">
              {isLoading ? "Envoi…" : "Envoyer ma demande"}
            </Button>
          </form>
        )}
        {error && (verified || status === "PENDING") && (
          <p className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-600">{error}</p>
        )}
      </div>
    </>
  );
};
