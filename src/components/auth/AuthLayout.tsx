import type { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";

type AuthLayoutProps = {
    /** Contenu du panneau de formulaire (connexion ou inscription) */
    children: ReactNode;
};

/**
 * AuthLayout
 *
 * Habillage dédié aux pages de connexion et d'inscription : aucun header,
 * footer ou menu de navigation global n'est rendu, afin de concentrer
 * l'attention de l'utilisateur sur le parcours d'authentification.
 *
 * Sur les écrans larges, un panneau visuel plein cadre (photographie de
 * l'allée des baobabs de Madagascar) recouvert d'un dégradé aux couleurs
 * de la marque met en valeur l'identité Lurevia ; sur mobile, seul le
 * panneau de formulaire est affiché pour rester compact.
 *
 * @param children Le formulaire (connexion ou inscription) à afficher
 */
export const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-svh w-screen flex bg-white">
            {/* Panneau visuel de marque, masqué sur mobile */}
            <div
                className="hidden lg:flex lg:w-1/2 relative items-end p-12 bg-cover bg-center"
                style={{ backgroundImage: "url(/images/baobab-sunset.jpg)" }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(12,60,76,0.15) 0%, rgba(12,60,76,0.55) 60%, rgba(12,60,76,0.92) 100%)",
                    }}
                />
                <div className="relative z-10 space-y-4 text-white max-w-md">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-lurevia-yellow">
                        <Sparkles size={14} />
                        Artisanat malgache authentique
                    </span>
                    <h2 className="text-3xl font-black font-serif italic leading-tight">
                        L'artisanat de Madagascar, livré chez vous
                    </h2>
                    <p className="text-sm text-white/80 leading-relaxed">
                        Rejoignez Lurevia pour suivre vos commandes, retrouver vos favoris
                        et accéder en priorité aux nouvelles créations de nos artisans
                        partenaires.
                    </p>
                </div>
            </div>

            {/* Panneau de formulaire */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-10 sm:px-8">
                <div className="w-full max-w-md space-y-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-lurevia-dark transition-colors uppercase tracking-wider"
                    >
                        <ArrowLeft size={14} />
                        Retour à l'accueil
                    </Link>

                    {children}
                </div>
            </div>
        </div>
    );
};
