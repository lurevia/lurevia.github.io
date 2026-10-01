import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { X, ShieldCheck, ScrollText } from "lucide-react";
import { settingsApi, type PublicPlatformSettings } from "../../api/settings";
import { Button } from "../ui/Button";

type ConsentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
};

export const ConsentModal: FC<ConsentModalProps> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [legalSettings, setLegalSettings] =
    useState<PublicPlatformSettings | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    setHasReachedEnd(false);
    setLegalSettings(null);
    setLoadError(null);
    scrollRef.current?.scrollTo({ top: 0 });
    settingsApi
      .getPublic()
      .then((settings) => {
        if (active) setLegalSettings(settings);
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Impossible de charger les documents légaux."
          );
        }
      });
    return () => {
      active = false;
    };
  }, [isOpen]);

  const legalSections = legalSettings
    ? [
        {
          title: "Conditions générales",
          content: legalSettings.termsOfService,
        },
        {
          title: "Politique de confidentialité",
          content: legalSettings.privacyPolicy,
        },
        { title: "Cookies", content: legalSettings.cookieMessage },
      ].filter((section) => section.content.trim().length > 0)
    : [];
  const hasRequiredDocuments = Boolean(
    legalSettings?.termsOfService.trim() &&
      legalSettings.privacyPolicy.trim()
  );

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const reachedBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
    if (reachedBottom) setHasReachedEnd(true);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (
      legalSettings &&
      el &&
      el.scrollHeight <= el.clientHeight &&
      hasRequiredDocuments
    ) {
      setHasReachedEnd(true);
    }
  }, [hasRequiredDocuments, legalSettings]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-0 sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-modal-title"
    >
      <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ScrollText size={18} className="text-lurevia-orange" />
            <h2
              id="consent-modal-title"
              className="text-sm font-black text-lurevia-dark uppercase tracking-wider"
            >
              Conditions & cookies
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-y-auto px-5 py-4 space-y-6 text-sm text-slate-600 leading-relaxed"
        >
          {legalSections.map((section) => (
            <section key={section.title} className="space-y-2">
              <h3 className="text-xs font-black text-lurevia-dark uppercase tracking-wider">
                {section.title}
              </h3>
              <p className="whitespace-pre-line">{section.content}</p>
            </section>
          ))}
          {loadError && <p role="alert">{loadError}</p>}
          {legalSettings && !hasRequiredDocuments && (
            <p role="alert">
              Les documents requis ne sont pas disponibles. Contactez l'administrateur.
            </p>
          )}
        </div>

        <div className="px-5 py-4 border-t border-slate-100 space-y-3 bg-slate-50">
          {!hasReachedEnd && (
            <p className="text-[11px] text-slate-500 text-center">
              Faites défiler jusqu'en bas pour activer le bouton d'acceptation.
            </p>
          )}
          <Button
            type="button"
            variant="primary"
            onClick={onAccept}
            disabled={!hasReachedEnd || !hasRequiredDocuments || Boolean(loadError)}
            icon={ShieldCheck}
            className="w-full! py-3! rounded-xl! font-black text-sm"
          >
            J'ai lu et j'accepte les CGU et la politique de cookies
          </Button>
        </div>
      </div>
    </div>
  );
};
