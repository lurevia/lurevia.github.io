import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { X, ShieldCheck, ScrollText } from "lucide-react";
import { Button } from "../ui/Button";

type ConsentModalProps = {
    /** Indique si la modale doit être affichée */
    isOpen: boolean;
    /** Appelé lorsque l'utilisateur ferme la modale sans accepter */
    onClose: () => void;
    /** Appelé lorsque l'utilisateur a lu l'intégralité du texte et clique sur "J'accepte" */
    onAccept: () => void;
};

/**
 * Bloc de texte légal affiché dans la modale de consentement.
 * Regroupe les Conditions Générales d'Utilisation et la Politique des cookies
 * en un seul document défilant, afin de garantir que l'utilisateur ait
 * matériellement fait défiler l'ensemble du contenu avant de pouvoir l'accepter.
 */
const LEGAL_CONTENT = [
    {
        title: "Conditions Générales d'Utilisation",
        paragraphs: [
            "Bienvenue sur Lurevia. En créant un compte, vous acceptez d'utiliser la plateforme conformément à sa vocation : la découverte et l'achat de produits artisanaux malgaches authentiques.",
            "Votre compte est personnel et confidentiel. Vous êtes responsable de la confidentialité de votre mot de passe et de toute activité effectuée depuis votre compte.",
            "Les informations produits (descriptions, prix, disponibilité) sont fournies de bonne foi par Lurevia et ses partenaires artisans. Des ajustements peuvent survenir en cas d'erreur manifeste ou de rupture de stock.",
            "Les commandes sont confirmées après validation du paiement. Un délai de préparation et de livraison vous est communiqué à chaque étape du tunnel de commande.",
            "Les avis et commentaires publiés doivent rester respectueux et refléter une expérience réelle avec un produit ou un service Lurevia. Tout contenu abusif pourra être retiré.",
            "Lurevia se réserve le droit de suspendre un compte en cas d'usage frauduleux, abusif ou contraire à ces conditions.",
        ],
    },
    {
        title: "Politique des cookies",
        paragraphs: [
            "Lurevia utilise des cookies strictement nécessaires au fonctionnement du site : maintien de votre session, contenu de votre panier et de vos favoris.",
            "Des cookies de mesure d'audience peuvent être utilisés, de façon anonymisée, afin d'améliorer l'expérience de navigation et la pertinence du catalogue proposé.",
            "Aucune donnée de navigation n'est cédée à des tiers à des fins publicitaires sans votre consentement explicite.",
            "Vous pouvez à tout moment gérer vos préférences de cookies depuis les paramètres de votre navigateur ou depuis votre espace compte.",
            "Vos données personnelles (nom, coordonnées, historique de commandes) sont conservées uniquement pour la durée nécessaire à la gestion de votre compte et de vos commandes, conformément à la réglementation applicable.",
        ],
    },
];

/**
 * ConsentModal
 *
 * Modale de consentement légal affichée avant la création d'un compte.
 * Le bouton d'acceptation reste désactivé tant que l'utilisateur n'a pas
 * fait défiler l'intégralité du texte (CGU + politique des cookies)
 * jusqu'à son dernier paragraphe, garantissant un parcours de consentement
 * réellement informé plutôt qu'une simple case cochée par défaut.
 *
 * @param isOpen Contrôle l'affichage de la modale
 * @param onClose Fermeture sans consentement
 * @param onAccept Confirmation du consentement, une fois le texte intégralement lu
 */
export const ConsentModal: FC<ConsentModalProps> = ({ isOpen, onClose, onAccept }) => {
    const [hasReachedEnd, setHasReachedEnd] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    /** Réinitialise l'état de lecture à chaque ouverture de la modale */
    useEffect(() => {
        if (isOpen) {
            setHasReachedEnd(false);
            scrollRef.current?.scrollTo({ top: 0 });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    /**
     * Détecte le défilement jusqu'au bas du document légal.
     * Une marge de tolérance de quelques pixels évite les faux négatifs
     * liés aux arrondis de sous-pixels sur certains navigateurs.
     */
    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        const reachedBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
        if (reachedBottom) setHasReachedEnd(true);
    };

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
                        <h2 id="consent-modal-title" className="text-sm font-black text-lurevia-dark uppercase tracking-wider">
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
                    {LEGAL_CONTENT.map((section) => (
                        <section key={section.title} className="space-y-2">
                            <h3 className="text-xs font-black text-lurevia-dark uppercase tracking-wider">
                                {section.title}
                            </h3>
                            {section.paragraphs.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </section>
                    ))}
                    <p className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-100">
                        Fin du document. Vous pouvez à présent confirmer votre lecture ci-dessous.
                    </p>
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
                        disabled={!hasReachedEnd}
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
