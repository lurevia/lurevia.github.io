import { useState } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, X, Clock } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useVerification } from "../../hooks/useVerification";

export const VerificationBanner: FC = () => {
  const { user } = useAuth();
  const { status, latestRequest, isLoading, error } = useVerification();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  if (!user || user.isVerified || dismissed) return null;

  const isPending = status === "PENDING";
  const title = isPending ? "Vérification en attente" : "Vérifiez votre identité";
  const message = isPending
    ? "Votre CIN a été envoyé pour examen manuel par l'administration."
    : status === "REJECTED"
      ? latestRequest?.rejectionReason || "Votre demande a été refusée. Vous pouvez la soumettre à nouveau."
      : "La vérification du CIN est nécessaire pour accéder à la vente.";
  const Icon = isPending ? Clock : ShieldAlert;

  return (
    <div className="sticky top-16 md:top-20 z-40 bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <div className="p-1.5 bg-amber-100 rounded-lg shrink-0">
          <Icon size={16} className="text-amber-700" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-amber-900">{title}</p>
          <p className="text-[11px] text-amber-800/80 mt-0.5 line-clamp-1">
            {message}
          </p>
          {error && (
            <p className="text-[11px] text-red-600 mt-1 font-medium">
              {error}
            </p>
          )}
        </div>

        {!isPending && (
          <button
            type="button"
            onClick={() => navigate("/compte/verification")}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-full transition-colors shrink-0 disabled:opacity-50"
          >
            {status === "REJECTED" ? "Modifier ma demande" : "Vérifier"}
          </button>
        )}

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Fermer"
          className="p-1.5 text-amber-700 hover:bg-amber-100 rounded-full shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};