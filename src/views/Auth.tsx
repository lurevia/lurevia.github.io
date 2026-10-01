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
import { oauthHelper } from "../utils/oauth";
import { toErrorMessage } from "../api/http";
import type { OAuthProvider } from "../api/auth";

type LocationState = {
  from?: string;
  reason?: string;
};

export const AuthPage: FC = () => {
  const { user, isAuthenticated, isReady, loginWithOAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const form = useAuthForm();
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [isSocialSubmitting, setIsSocialSubmitting] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(
    null
  );

  const state = location.state as LocationState | null;
  const from =
    typeof state?.from === "string" &&
    state.from.startsWith("/") &&
    !state.from.startsWith("//")
      ? state.from
      : "/compte";
  const reason = state?.reason;

  useEffect(() => {
    if (isReady && isAuthenticated) {
      if (!user?.phone || !user.hasPassword) {
        navigate("/compte/complete-oauth", { replace: true });
      } else {
        navigate(user.isVerified ? from : "/compte/verification", {
          replace: true,
        });
      }
    }
  }, [isReady, isAuthenticated, user, from, navigate]);

  const isLogin = form.mode === "login";

  const handleSocialLogin = async (provider: OAuthProvider) => {
    setIsSocialSubmitting(true);
    try {
      const token = await oauthHelper.triggerLogin(provider);
      const result = await loginWithOAuth(token, provider);
      if (result.needsProfileCompletion) {
        navigate("/compte/complete-oauth", { replace: true });
      } else if (!result.user.isVerified) {
        navigate("/compte/verification", { replace: true });
      } else {
        navigate(from, { replace: true });
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

  return (
    <AuthLayout>
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-[0_24px_80px_-24px_rgba(68,43,27,0.22)]">
        <div className="h-1.5 bg-linear-to-r from-orange-700 via-orange-500 to-amber-300" />

        <div className="space-y-5 p-6 md:p-8">
          <div className="space-y-1 text-center">
            <h2 className="text-2xl font-black text-stone-900">
              {isLogin ? "Bon retour" : "Créer un compte"}
            </h2>
            <p className="text-xs text-stone-500">
              {isLogin
                ? "Connectez-vous pour continuer."
                : "Créez votre compte avec Facebook ou Google."}
            </p>
          </div>

          {reason && (
            <div className="flex items-start gap-2 rounded-xl border border-orange-200 bg-orange-50 p-3">
              <Info size={14} className="mt-0.5 shrink-0 text-orange-700" />
              <p className="text-xs font-medium text-orange-950">{reason}</p>
            </div>
          )}

          <div className="flex rounded-xl bg-stone-100 p-1">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => form.switchMode(m)}
                className={`flex-1 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  form.mode === m
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                {m === "login" ? "Connexion" : "Inscription"}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {isLogin && <AuthFormFields form={form} />}

            {form.error && (
              <div className="rounded-lg border border-red-100 bg-red-50 p-2.5">
                <p className="text-[11px] font-medium text-red-700">
                  {form.error}
                </p>
              </div>
            )}

            {isLogin && (
              <Button
                type="button"
                variant="primary"
                onClick={() => void form.handleLogin()}
                disabled={form.isSubmitting || isSocialSubmitting}
                className="w-full! py-3! rounded-xl! font-black text-sm"
              >
                {form.isSubmitting ? "Chargement…" : "Se connecter"}
              </Button>
            )}

            <AuthProviderButtons
              isLogin={isLogin}
              disabled={form.isSubmitting || isSocialSubmitting}
              onLogin={(provider) => void handleSocialLogin(provider)}
              onSignup={requestSocialSignup}
            />

            <p className="text-center text-[11px] text-slate-500">
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
