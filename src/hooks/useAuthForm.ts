import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { toErrorMessage } from "../api/http";
import {
  isValidEmail,
  isValidMalagasyPhone,
  validatePasswordStrength,
} from "./authValidation";

export { validatePasswordStrength } from "./authValidation";

export type AuthMode = "login" | "register";

export const useAuthForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Connexion ───
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // ─── Inscription ───
  const [fullName, setFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

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
    setFullName("");
    setRegisterEmail("");
    setRegisterPhone("");
    setRegisterPassword("");
    setConfirmPassword("");
    setHasAcceptedTerms(false);
    setError(null);
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError(null);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CONNEXION
  // ─────────────────────────────────────────────────────────────────────────

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

  const handleRegister = async () => {
    setError(null);

    if (fullName.trim().length < 2) {
      setError("Le nom complet est requis.");
      return;
    }

    if (!isValidEmail(registerEmail)) {
      setError("Veuillez saisir une adresse email valide.");
      return;
    }

    if (!isValidMalagasyPhone(registerPhone)) {
      setError("Numéro malgache invalide (ex : 034 12 345 67).");
      return;
    }

    const passwordError = validatePasswordStrength(registerPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (registerPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!hasAcceptedTerms) {
      setError(
        "Veuillez lire et accepter les CGU et la politique des cookies pour continuer.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        fullName: fullName.trim(),
        email: registerEmail.trim().toLowerCase(),
        phone: registerPhone.trim(),
        password: registerPassword,
      });
      setRegisterPassword("");
      setConfirmPassword("");
      navigate("/compte/verification", { replace: true });
    } catch (err) {
      setError(toErrorMessage(err, "Inscription impossible."));
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

    fullName,
    setFullName,
    registerEmail,
    setRegisterEmail,
    registerPhone,
    setRegisterPhone,
    registerPassword,
    setRegisterPassword,
    confirmPassword,
    setConfirmPassword,
    hasAcceptedTerms,
    setHasAcceptedTerms,
    handleRegister,

    resetForm,
  };
};
