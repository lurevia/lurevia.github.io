import { useState, useEffect } from "react";
import type { FC, FormEvent } from "react";
import { ArrowLeft, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useVerification } from "../../hooks/useVerification";

const labels = {
  NONE: "Votre compte n’est pas encore vérifié.",
  PENDING: "Votre demande est en cours d’examen.",
  APPROVED: "Votre compte est vérifié.",
  REJECTED: "Votre demande a été refusée. Vous pouvez en envoyer une nouvelle.",
  USED: "Votre compte est vérifié.",
  EXPIRED: "Votre lien a expiré. Demandez un nouveau code.",
} as const;

export const VerificationPage: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { status, isLoading, error, request, confirm } = useVerification();
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      void confirm(token).then(() => {
        setTimeout(() => navigate("/compte"), 2000);
      }).catch(() => {});
    }
  }, [searchParams, confirm, navigate]);

  const submitCode = (event: FormEvent) => {
    event.preventDefault();
    if (code.trim()) void confirm(code.trim());
  };

  const requestCode = async () => {
    await request();
    setSent(true);
  };

  const verified = status === "APPROVED" || status === "USED";
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
            <h1 className="text-2xl font-black text-lurevia-dark">Vérification du compte</h1>
            <p className="text-sm text-slate-500 mt-1">{labels[status]}</p>
          </div>
        </div>
        {status === "PENDING" && <div className="flex gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800"><Clock3 size={18} className="shrink-0" /> Notre équipe examine votre demande. Vous serez informé du résultat par message.</div>}
        {!verified && status !== "PENDING" && (
          <>
            <Button type="button" onClick={() => void requestCode()} disabled={isLoading} className="rounded-xl!">
              {isLoading ? "Envoi…" : sent ? "Lien renvoyé" : "Demander un lien de vérification"}
            </Button>
            {(sent || status === "EXPIRED") && (
              <form onSubmit={submitCode} className="space-y-3 pt-2 border-t border-slate-100">
                <Input label="Code de secours (si reçu)" value={code} onChange={(event) => setCode(event.target.value)} inputMode="numeric" autoComplete="one-time-code" />
                <Button type="submit" disabled={isLoading || !code.trim()} className="rounded-xl!">Confirmer le code</Button>
              </form>
            )}
          </>
        )}
        {error && <p className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-600">{error}</p>}
      </div>
    </>
  );
};
