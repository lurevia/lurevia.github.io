import type { FC } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, Phone, Lock, User as UserIcon, Info, ShieldCheck, Check } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { useAuthForm } from "../hooks/useAuthForm";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { AuthLayout } from "../components/auth/AuthLayout";
import { ConsentModal } from "../components/auth/ConsentModal";

type LocationState = {
    from?: string;
    reason?: string;
};

/**
 * AuthPage
 *
 * Vue de connexion et d'inscription. Aucune logique métier n'est portée
 * ici : la validation des champs et les appels au contexte d'authentification
 * sont délégués au hook contrôleur `useAuthForm`. La vue se contente de
 * déclarer l'interface et de brancher les gestionnaires exposés par le hook.
 *
 * L'inscription est protégée par un parcours de consentement explicite
 * (`ConsentModal`) : la case d'acceptation des CGU et de la politique des
 * cookies ne peut être cochée qu'après ouverture et lecture complète de la
 * modale correspondante.
 */
export const AuthPage: FC = () => {
    const { isAuthenticated, isReady } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const form = useAuthForm();
    const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);

    const state = location.state as LocationState | null;
    const from = state?.from ?? "/compte";
    const reason = state?.reason;

    /** Redirige vers la page cible si l'utilisateur est déjà authentifié */
    useEffect(() => {
        if (isReady && isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isReady, isAuthenticated, from, navigate]);

    const isLogin = form.mode === "login";

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-lurevia-dark font-serif italic">
                        Lurevia
                    </h1>
                    <p className="text-sm text-slate-500">
                        {isLogin
                            ? "Connectez-vous à votre compte"
                            : "Créez votre compte en quelques secondes"}
                    </p>
                </div>

                {reason && (
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2">
                        <Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs font-medium text-amber-800">{reason}</p>
                    </div>
                )}

                <div className="bg-slate-100 rounded-2xl p-1 flex">
                    {(["login", "register"] as const).map((m) => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => form.switchMode(m)}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${form.mode === m
                                ? "bg-white text-lurevia-dark shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {m === "login" ? "Connexion" : "Inscription"}
                        </button>
                    ))}
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 space-y-4">
                    {isLogin ? (
                        <>
                            <Input
                                label="Email ou téléphone"
                                value={form.loginIdentifier}
                                onChange={(e) => form.setLoginIdentifier(e.target.value)}
                                placeholder="vous@email.mg ou 034 12 345 67"
                                autoComplete="username"
                            />
                            <Input
                                label="Mot de passe"
                                type="password"
                                value={form.loginPassword}
                                onChange={(e) => form.setLoginPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") form.handleLogin();
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <Input
                                label="Nom complet"
                                value={form.fullName}
                                onChange={(e) => form.setFullName(e.target.value)}
                                placeholder="Rasoa Miora"
                                icon={<UserIcon size={16} />}
                                autoComplete="name"
                            />

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                                    Identifiant
                                </label>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    {(["email", "phone"] as const).map((type) => {
                                        const active = form.identifierType === type;
                                        const Icon = type === "email" ? Mail : Phone;
                                        return (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => form.setIdentifierType(type)}
                                                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${active
                                                    ? "border-lurevia-orange bg-orange-50 text-lurevia-dark"
                                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                                    }`}
                                            >
                                                <Icon size={14} />
                                                {type === "email" ? "Email" : "Mobile"}
                                            </button>
                                        );
                                    })}
                                </div>

                                {form.identifierType === "email" ? (
                                    <Input
                                        type="email"
                                        value={form.registerEmail}
                                        onChange={(e) => form.setRegisterEmail(e.target.value)}
                                        placeholder="rasoa@email.mg"
                                        icon={<Mail size={16} />}
                                        autoComplete="email"
                                    />
                                ) : (
                                    <Input
                                        type="tel"
                                        inputMode="tel"
                                        value={form.registerPhone}
                                        onChange={(e) => form.setRegisterPhone(e.target.value)}
                                        placeholder="034 12 345 67"
                                        icon={<Phone size={16} />}
                                        autoComplete="tel"
                                    />
                                )}
                            </div>

                            <Input
                                label="Mot de passe"
                                type="password"
                                value={form.registerPassword}
                                onChange={(e) => form.setRegisterPassword(e.target.value)}
                                placeholder="Au moins 6 caractères"
                                icon={<Lock size={16} />}
                                autoComplete="new-password"
                            />
                            <Input
                                label="Confirmer le mot de passe"
                                type="password"
                                value={form.confirmPassword}
                                onChange={(e) => form.setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                icon={<Lock size={16} />}
                                autoComplete="new-password"
                            />

                            {/* Parcours de consentement CGU / cookies obligatoire */}
                            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <button
                                    type="button"
                                    role="checkbox"
                                    aria-checked={form.hasAcceptedTerms}
                                    onClick={() => {
                                        if (!form.hasAcceptedTerms) setIsConsentModalOpen(true);
                                    }}
                                    className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors cursor-pointer ${form.hasAcceptedTerms
                                        ? "bg-lurevia-orange border-lurevia-orange"
                                        : "border-slate-300 bg-white"
                                        }`}
                                >
                                    {form.hasAcceptedTerms && (
                                        <Check size={12} strokeWidth={3} className="text-white" />
                                    )}
                                </button>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    J'ai lu et j'accepte les{" "}
                                    <button
                                        type="button"
                                        onClick={() => setIsConsentModalOpen(true)}
                                        className="font-bold text-lurevia-orange hover:underline cursor-pointer"
                                    >
                                        Conditions Générales d'Utilisation et la politique des cookies
                                    </button>
                                    {form.hasAcceptedTerms ? " — merci !" : "."}
                                </p>
                            </div>
                        </>
                    )}

                    {form.error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                            <p className="text-xs font-medium text-red-600">{form.error}</p>
                        </div>
                    )}

                    <Button
                        type="button"
                        variant="primary"
                        onClick={isLogin ? form.handleLogin : form.handleRegister}
                        disabled={form.isSubmitting}
                        className="w-full! py-3! rounded-xl! font-black text-sm"
                    >
                        {form.isSubmitting
                            ? "Chargement…"
                            : isLogin
                                ? "Se connecter"
                                : "Créer mon compte"}
                    </Button>

                    <p className="text-center text-xs text-slate-500">
                        {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
                        <button
                            type="button"
                            onClick={() => form.switchMode(isLogin ? "register" : "login")}
                            className="font-bold text-lurevia-orange hover:underline cursor-pointer"
                        >
                            {isLogin ? "S'inscrire" : "Se connecter"}
                        </button>
                    </p>
                </div>

                <p className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck size={12} />
                    Démo : les données sont stockées localement dans votre navigateur.
                </p>
            </div>

            <ConsentModal
                isOpen={isConsentModalOpen}
                onClose={() => setIsConsentModalOpen(false)}
                onAccept={() => {
                    form.setHasAcceptedTerms(true);
                    setIsConsentModalOpen(false);
                }}
            />
        </AuthLayout>
    );
};
