import type { FC } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Lock,
  User as UserIcon,
  Info,
  Check,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { useAuthForm } from "../hooks/useAuthForm";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { AuthLayout } from "../components/auth/AuthLayout";
import { ConsentModal } from "../components/auth/ConsentModal";
import { oauthHelper } from "../utils/oauth";
import { GoogleIcon, FacebookIcon } from "../components/icons/SocialIcons";

type LocationState = {
  from?: string;
  reason?: string;
};

export const AuthPage: FC = () => {
  const { isAuthenticated, isReady, loginWithOAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const form = useAuthForm();
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);

  const state = location.state as LocationState | null;
  const from = state?.from ?? "/compte";
  const reason = state?.reason;

  useEffect(() => {
    if (isReady && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isReady, isAuthenticated, from, navigate]);

  const isLogin = form.mode === "login";

  const handleSocialLogin = async (provider: "GOOGLE" | "FACEBOOK") => {
    try {
      const token = await oauthHelper.triggerLogin(provider);
      await loginWithOAuth(provider, token);
    } catch (err: any) {
      form.setError(err.message || "Erreur lors de la connexion sociale.");
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white border border-slate-200/70 rounded-2xl shadow-xl shadow-slate-900/5 overflow-hidden">
        <div className="h-1 bg-linear-to-r from-lurevia-dark via-lurevia-blue-500 to-lurevia-cyan" />

        <div className="p-6 md:p-7 space-y-5">
          <div className="space-y-1 text-center">
            <h2 className="text-2xl font-black text-lurevia-dark">
              {isLogin ? "Bon retour 👋" : "Créer un compte"}
            </h2>
            <p className="text-xs text-slate-500">
              {isLogin
                ? "Connectez-vous pour continuer."
                : "Quelques informations et c'est parti."}
            </p>
          </div>

          {reason && (
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2">
              <Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-amber-800">{reason}</p>
            </div>
          )}

          <div className="bg-slate-100 rounded-xl p-1 flex">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => form.switchMode(m)}
                className={`flex-1 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${form.mode === m
                    ? "bg-white text-lurevia-dark shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                {m === "login" ? "Connexion" : "Inscription"}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {isLogin ? (
              <>
                <Input
                  label="Email"
                  type="email"
                  value={form.loginEmail}
                  onChange={(e) => form.setLoginEmail(e.target.value)}
                  placeholder="vous@email.mg"
                  icon={<Mail size={16} />}
                  autoComplete="email"
                />
                <Input
                  label="Mot de passe"
                  type="password"
                  value={form.loginPassword}
                  onChange={(e) => form.setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<Lock size={16} />}
                  autoComplete="current-password"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void form.handleLogin();
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Email"
                    type="email"
                    value={form.registerEmail}
                    onChange={(e) => form.setRegisterEmail(e.target.value)}
                    placeholder="rasoa@email.mg"
                    icon={<Mail size={16} />}
                    autoComplete="email"
                  />
                  <Input
                    label="Téléphone"
                    type="tel"
                    inputMode="tel"
                    value={form.registerPhone}
                    onChange={(e) => form.setRegisterPhone(e.target.value)}
                    placeholder="034 12 345 67"
                    icon={<Phone size={16} />}
                    autoComplete="tel"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Mot de passe"
                    type="password"
                    value={form.registerPassword}
                    onChange={(e) => form.setRegisterPassword(e.target.value)}
                    placeholder="8 caractères"
                    icon={<Lock size={16} />}
                    autoComplete="new-password"
                  />
                  <Input
                    label="Confirmer"
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => form.setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={<Lock size={16} />}
                    autoComplete="new-password"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void form.handleRegister();
                    }}
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={form.hasAcceptedTerms}
                    onClick={() => {
                      if (!form.hasAcceptedTerms) setIsConsentModalOpen(true);
                    }}
                    className={`mt-0.5 shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${form.hasAcceptedTerms
                        ? "bg-lurevia-orange border-lurevia-orange"
                        : "border-slate-300 bg-white"
                      }`}
                  >
                    {form.hasAcceptedTerms && (
                      <Check size={10} strokeWidth={3} className="text-white" />
                    )}
                  </button>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    J'accepte les{" "}
                    <button
                      type="button"
                      onClick={() => setIsConsentModalOpen(true)}
                      className="font-bold text-lurevia-orange hover:underline cursor-pointer"
                    >
                      CGU et la politique des cookies
                    </button>
                  </p>
                </div>
              </>
            )}

            {form.error && (
              <div className="p-2.5 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-[11px] font-medium text-red-600">
                  {form.error}
                </p>
              </div>
            )}

            <Button
              type="button"
              variant="primary"
              onClick={() =>
                void (isLogin ? form.handleLogin() : form.handleRegister())
              }
              disabled={form.isSubmitting}
              className="w-full! py-3! rounded-xl! font-black text-sm"
            >
              {form.isSubmitting
                ? "Chargement…"
                : isLogin
                  ? "Se connecter"
                  : "Créer mon compte"}
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">Ou continuer avec</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => void handleSocialLogin("GOOGLE")}
                disabled={form.isSubmitting}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors text-sm font-semibold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <GoogleIcon size={18} />
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => void handleSocialLogin("FACEBOOK")}
                disabled={form.isSubmitting}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors text-sm font-semibold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <FacebookIcon size={18} />
                <span>Facebook</span>
              </button>
            </div>

            <p className="text-center text-[11px] text-slate-500">
              {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
              <button
                type="button"
                onClick={() =>
                  form.switchMode(isLogin ? "register" : "login")
                }
                className="font-bold text-lurevia-orange hover:underline cursor-pointer"
              >
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5 mt-4">
        <ShieldCheck size={12} />
        Vos données sont chiffrées et sécurisées.
      </p>

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
