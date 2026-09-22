import { useEffect, useState } from "react";
import type { FC, FormEvent } from "react";
import { CheckCircle2, ShieldCheck, X } from "lucide-react";
import { useVerification } from "../../hooks/useVerification";
import { Button } from "../../components/ui/Button";

type VerifyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Callback après validation réussie (ex : recharger le user) */
  onSuccess?: () => void;
};

export const VerifyModal: FC<VerifyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { confirm, isLoading, error, setError } = useVerification();
  const [code, setCode] = useState("");
  const [success, setSuccess] = useState(false);

  /** Reset à chaque ouverture */
  useEffect(() => {
    if (isOpen) {
      setCode("");
      setSuccess(false);
      setError(null);
    }
  }, [isOpen, setError]);

  /** Ferme avec Échap */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (code.trim().length !== 6) return;

    try {
      await confirm(code.trim());
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch {
      // Erreur déjà gérée par le hook
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-lurevia-cyan/10 rounded-lg">
              <ShieldCheck size={16} className="text-lurevia-cyan" />
            </div>
            <h2 className="text-sm font-black text-lurevia-dark uppercase tracking-wider">
              Vérification du compte
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="inline-flex p-4 bg-emerald-50 rounded-full">
                <CheckCircle2 size={40} className="text-emerald-500" />
              </div>
              <div>
                <p className="font-black text-lurevia-dark">
                  Compte vérifié !
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Vous pouvez maintenant passer commande.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                Entrez le code à 6 chiffres envoyé sur votre email par notre
                équipe.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Code de vérification
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="123456"
                  maxLength={6}
                  autoFocus
                  className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-white text-center text-2xl font-mono font-black tracking-[0.5em] text-lurevia-dark placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-lurevia-cyan focus:border-transparent"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-xs text-red-600 font-medium">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={code.length !== 6 || isLoading}
                className="w-full! py-3! rounded-xl! font-black text-sm"
              >
                {isLoading ? "Vérification…" : "Valider le code"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};