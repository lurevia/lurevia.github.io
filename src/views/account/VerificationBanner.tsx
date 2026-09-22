import { useState } from "react";
import type { FC } from "react";
import {
  ShieldAlert,
  Send,
  Loader2,
  X,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useVerification } from "../../hooks/useVerification";
import { VerifyModal } from "./VerifyModal";

export const VerificationBanner: FC = () => {
  const { user, refreshUser } = useAuth();
  const {
    status,
    isLoading,
    error,
    request,
  } = useVerification();

  const [dismissed, setDismissed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Rien à afficher si : pas connecté, déjà vérifié, ou dismiss
  if (!user || user.isVerified || dismissed) return null;

  const handleRequest = async () => {
    try {
      await request();
    } catch {
      // erreur affichée dans le bandeau
    }
  };

  const handleSuccess = () => {
    // Recharge le user pour que user.isVerified passe à true
    void refreshUser();
  };

  // ─── Contenu selon le statut ───
  const renderContent = () => {
    switch (status) {
      case "PENDING":
        return {
          icon: Clock,
          title: "Demande en attente",
          message:
            "Votre demande a été envoyée. Un administrateur va la traiter prochainement.",
          action: null,
        };

      case "APPROVED":
        return {
          icon: CheckCircle2,
          title: "Code reçu",
          message:
            "Un code vous a été envoyé par email. Entrez-le pour activer votre compte.",
          action: (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-full transition-colors shrink-0"
            >
              Entrer le code
            </button>
          ),
        };

      default:
        return {
          icon: ShieldAlert,
          title: "Vérifiez votre compte",
          message:
            "Pour passer commande, demandez la vérification de votre compte.",
          action: (
            <button
              type="button"
              onClick={() => void handleRequest()}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-full transition-colors shrink-0 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  Envoi…
                </>
              ) : (
                <>
                  <Send size={12} />
                  Demander
                </>
              )}
            </button>
          ),
        };
    }
  };

  const { icon: Icon, title, message, action } = renderContent();

  return (
    <>
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

          {action}

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

      <VerifyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};