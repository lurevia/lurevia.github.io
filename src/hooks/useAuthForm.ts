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
  const { login, register } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Connexion ───
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // ─── Inscription ───
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerPhone, setRegisterPhone] = useState("+261 ");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  /** Destination après authentification : par défaut /onboarding pour le parcours interactif complet */
  const redirectTarget = (): string => {
    const from = (location.state as { from?: unknown } | null)?.from;
    if (
      typeof from === "string" &&
      from.startsWith("/") &&
      !from.startsWith("//") &&
      from !== "/compte"
    ) {
      return from;
    }
    return "/onboarding";
  };

  const resetForm = () => {
    setLoginEmail("");
    setLoginPassword("");
    setRegisterFullName("");
    setRegisterPhone("+261 ");
    setRegisterEmail("");
    setRegisterPassword("");
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
      await login({
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword,
      });
      setLoginPassword("");
      navigate(redirectTarget(), {
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

    if (!registerFullName.trim()) {
      setError("Veuillez saisir votre nom complet.");
      return;
    }
    if (!isValidEmail(registerEmail)) {
      setError("Veuillez saisir une adresse email valide.");
      return;
    }
    if (!registerPassword || registerPassword.length < 8) {
      setError("Le mot de passe doit comporter au moins 8 caractères.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        fullName: registerFullName.trim(),
        phone: registerPhone.trim(),
        email: registerEmail.trim().toLowerCase(),
        password: registerPassword,
      });
      navigate("/onboarding", {
        replace: true,
      });
    } catch (err) {
      setError(toErrorMessage(err, "Erreur lors de la création de votre compte."));
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

    registerFullName,
    setRegisterFullName,
    registerPhone,
    setRegisterPhone,
    registerEmail,
    setRegisterEmail,
    registerPassword,
    setRegisterPassword,
    handleRegister,

    resetForm,
  };
};

