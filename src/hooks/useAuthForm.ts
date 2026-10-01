import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { toErrorMessage } from "../api/http";
import { isValidEmail } from "./authValidation";

export { validatePasswordStrength } from "./authValidation";

export type AuthMode = "login" | "register";

export const useAuthForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Connexion ───
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  /** Destination après authentification, sans redirection ouverte possible. */
  const redirectTarget = (): string => {
    const from = (location.state as { from?: unknown } | null)?.from;
    if (
      typeof from === "string" &&
      from.startsWith("/") &&
      !from.startsWith("//")
    ) {
      return from;
    }
    return "/compte";
  };

  const resetForm = () => {
    setLoginEmail("");
    setLoginPassword("");
    setError(null);
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError(null);
  };

  const handleLogin = async () => {
    setError(null);

    if (!isValidEmail(loginEmail)) {
      setError("Veuillez saisir une adresse email valide.");
      return;
    }
    if (!loginPassword) {
      setError("Mot de passe requis.");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login({
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword,
      });
      setLoginPassword("");
      navigate(user.isVerified ? redirectTarget() : "/compte/verification", {
        replace: true,
      });
    } catch (err) {
      setError(toErrorMessage(err, "Email ou mot de passe incorrect."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    mode,
    switchMode,
    isSubmitting,
    error,
    setError,

    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    handleLogin,

    resetForm,
  };
};
