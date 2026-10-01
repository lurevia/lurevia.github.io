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
import { oauthHelper } from "../utils/oauth";
import { FacebookIcon } from "../components/icons/SocialIcons";
import { toErrorMessage } from "../api/http";

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

  const handleSocialLogin = async () => {
    try {
      const token = await oauthHelper.triggerLogin();
      const result = await loginWithOAuth(token);
      if (result.needsProfileCompletion) {
        navigate("/compte/complete-oauth", { replace: true });
      } else if (!result.user.isVerified) {
        navigate("/compte/verification", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: unknown) {
      form.setError(
        toErrorMessage(err, "Erreur lors de la connexion Facebook."),
      );
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white border border-slate-200/70 rounded-2xl shadow-xl shadow-slate-900/5 overflow-hidden">
        <div className="h-1 bg-linear-to-r from-lurevia-dark via-lurevia-blue-500 to-lurevia-cyan" />

        <div className="p-6 md:p-7 space-y-5">
          <div className="space-y-1 text-center">
            <h2 className="text-2xl font-black text-lurevia-dark">
              {isLogin ? "Bon retour" : "Créer un compte"}
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
                className={`flex-1 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  form.mode === m
                    ? "bg-white text-lurevia-dark shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {m === "login" ? "Connexion" : "Inscription"}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <AuthFormFields
              form={form}
              isLogin={isLogin}
              onOpenConsent={() => setIsConsentModalOpen(true)}
            />

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
                <span className="bg-white px-2 text-slate-400">
                  Ou continuer avec
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => void handleSocialLogin()}
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
