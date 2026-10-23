import type { FC } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Info, ShieldCheck } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { useAuthForm } from "../hooks/useAuthForm";
import { Button } from "../components/ui/Button";
import { AuthLayout } from "../components/auth/AuthLayout";
import { ConsentModal } from "../components/auth/ConsentModal";
import { AuthFormFields } from "../components/auth/AuthFormFields";
import { AuthProviderButtons } from "../components/auth/AuthProviderButtons";
import { AdminSessionNotice } from "../components/auth/AdminSessionNotice";
import { AuthModeSwitch } from "../components/auth/AuthModeSwitch";
import { oauthHelper } from "../utils/oauth";
import { toErrorMessage } from "../api/http";
import type { OAuthProvider } from "../api/auth";

type LocationState = {
  from?: string;
  reason?: string;
};

export const AuthPage: FC = () => {
  const { user, isAuthenticated, isReady, loginWithOAuth, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const form = useAuthForm();
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [isSocialSubmitting, setIsSocialSubmitting] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(
    null
  );

  const state = location.state as LocationState | null;
  const reason = state?.reason;

  useEffect(() => {
    if (isReady && isAuthenticated) {
      if (!user?.phone || !user.hasPassword) {
        navigate("/compte/complete-oauth", { replace: true });
      } else {
        navigate("/onboarding", {
          replace: true,
        });
      }
    }
  }, [isReady, isAuthenticated, user, navigate]);

  const isLogin = form.mode === "login";


  const handleSocialLogin = async (provider: OAuthProvider) => {
    setIsSocialSubmitting(true);
    try {
      const token = await oauthHelper.triggerLogin(provider);
      const result = await loginWithOAuth(token, provider);
      if (result.needsProfileCompletion) {
        navigate("/compte/complete-oauth", { replace: true });
      } else {
        navigate("/onboarding", { replace: true });
      }
    } catch (err: unknown) {
      const providerName = provider === "GOOGLE" ? "Google" : "Facebook";
      form.setError(
        toErrorMessage(err, `Erreur lors de la connexion ${providerName}.`)
      );
    } finally {
      setIsSocialSubmitting(false);
    }
  };

  const requestSocialSignup = (provider: OAuthProvider) => {
    form.setError(null);
    setPendingProvider(provider);
    setIsConsentModalOpen(true);
  };

  const acceptConsent = () => {
    setIsConsentModalOpen(false);
    if (pendingProvider) {
      void handleSocialLogin(pendingProvider);
      setPendingProvider(null);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await logout();
      form.setError(null);
    } catch (err: unknown) {
      form.setError(toErrorMessage(err, "Impossible de fermer cette session."));
    }
  };

  if (user?.role === "ADMIN") {
    return (
      <AuthLayout>
        <AdminSessionNotice
          error={form.error}
          onLogout={() => void handleAdminLogout()}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="overflow-hidden rounded-3xl border border-stone-800/80 bg-stone-900/95 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] backdrop-blur-xl text-stone-100">
        <div className="h-1.5 bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400" />

        <div className="space-y-5 p-6 md:p-8">
          <div className="space-y-1 text-center">
            <h2 className="text-2xl font-black text-white tracking-tight">
              {isLogin ? "S'identifier sur Lurevia" : "Rejoindre l'expérience"}
            </h2>
            <p className="text-xs text-stone-400">
              {isLogin
                ? "Connectez-vous pour accéder à vos sélections et vos créations."
                : "Créez votre compte en quelques instants."}
            </p>
          </div>

          {reason && (
            <div className="flex items-start gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 p-3">
              <Info size={14} className="mt-0.5 shrink-0 text-orange-400" />
              <p className="text-xs font-medium text-orange-200">{reason}</p>
            </div>
          )}

          <AuthModeSwitch mode={form.mode} onSwitch={form.switchMode} />

          <div className="space-y-4">
            <AuthFormFields form={form} />

            {form.error && (
              <div className="rounded-xl border border-red-500/40 bg-red-950/60 p-3">
                <p className="text-xs font-medium text-red-200">
                  {form.error}
                </p>
              </div>
            )}

            <Button
              type="button"
              variant="primary"
              onClick={() => void (isLogin ? form.handleLogin() : form.handleRegister())}
              disabled={form.isSubmitting || isSocialSubmitting}
              className="w-full! py-3.5! rounded-xl! font-black text-xs uppercase tracking-wider bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 text-white shadow-xl shadow-orange-600/30 hover:brightness-110 active:scale-[0.99] transition cursor-pointer"
            >
              {form.isSubmitting
                ? "Traitement en cours…"
                : isLogin
                ? "S'identifier"
                : "Créer mon compte Lurevia"}
            </Button>

            <AuthProviderButtons
              isLogin={isLogin}
              disabled={form.isSubmitting || isSocialSubmitting}
              onLogin={(provider) => void handleSocialLogin(provider)}
              onSignup={requestSocialSignup}
            />

            <p className="text-center text-xs text-stone-400 pt-1">
              {isLogin ? "Première visite sur Lurevia ?" : "Déjà membre ?"}{" "}
              <button
                type="button"
                onClick={() => form.switchMode(isLogin ? "register" : "login")}
                className="font-bold text-orange-400 hover:text-orange-300 hover:underline cursor-pointer"
              >
                {isLogin ? "S'inscrire maintenant" : "Se connecter"}
              </button>
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5 mt-4">
        <ShieldCheck size={12} className="text-lurevia-orange" />
        Vos données sont protégées et sécurisées.
      </p>

      <ConsentModal
        isOpen={isConsentModalOpen}
        onClose={() => {
          setIsConsentModalOpen(false);
          setPendingProvider(null);
        }}
        onAccept={acceptConsent}
      />
    </AuthLayout>
  );
};
