import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import type { AuthIdentifier } from "../bin/types/authType";

const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidMalagasyPhone = (phone: string): boolean =>
    /^(\+261|0)[0-9]{9}$/.test(phone.replace(/\s/g, ""));

export type AuthMode = "login" | "register";

/**
 * useAuthForm
 *
 * Contrôleur (hook) pour les formulaires de connexion et d'inscription.
 * Centralise l'état des champs, la validation métier (email, numéro
 * malgache, mot de passe, consentement CGU/cookies) et l'appel au
 * contexte d'authentification (`useAuth`). Les vues (`AuthPage`) restent
 * ainsi purement déclaratives et ne contiennent aucune logique de
 * validation ou d'appel réseau.
 *
 * @returns L'état des formulaires et les gestionnaires d'actions (bascule
 * de mode, connexion, inscription, réinitialisation)
 */
export const useAuthForm = () => {
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const [mode, setMode] = useState<AuthMode>("login");
    const [identifierType, setIdentifierType] =
        useState<AuthIdentifier>("email");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [loginIdentifier, setLoginIdentifier] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [fullName, setFullName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPhone, setRegisterPhone] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    /** Vrai une fois que l'utilisateur a lu et accepté les CGU et la politique des cookies */
    const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

    const resetForm = () => {
        setLoginIdentifier("");
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

    const handleLogin = async () => {
        setError(null);

        if (!loginIdentifier.trim() || !loginPassword.trim()) {
            setError("Identifiant et mot de passe requis.");
            return;
        }

        setIsSubmitting(true);
        try {
            await login({
                identifier: loginIdentifier,
                password: loginPassword,
            });
            navigate("/compte");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur de connexion.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegister = async () => {
        setError(null);

        // Validation
        if (fullName.trim().length < 2) {
            setError("Le nom complet est requis.");
            return;
        }

        if (identifierType === "email") {
            if (!isValidEmail(registerEmail)) {
                setError("Email invalide.");
                return;
            }
        } else {
            if (!isValidMalagasyPhone(registerPhone)) {
                setError("Numéro malgache invalide (ex : 034 12 345 67).");
                return;
            }
        }

        if (registerPassword.length < 6) {
            setError("Le mot de passe doit faire au moins 6 caractères.");
            return;
        }

        if (registerPassword !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        if (!hasAcceptedTerms) {
            setError("Veuillez lire et accepter les CGU et la politique des cookies pour continuer.");
            return;
        }

        setIsSubmitting(true);
        try {
            await register({
                fullName,
                email: identifierType === "email" ? registerEmail : undefined,
                phone: identifierType === "phone" ? registerPhone : undefined,
                password: registerPassword,
                primaryIdentifier: identifierType,
            });
            navigate("/compte");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur d'inscription.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        mode,
        switchMode,
        identifierType,
        setIdentifierType,
        isSubmitting,
        error,
        setError,

        // Login
        loginIdentifier,
        setLoginIdentifier,
        loginPassword,
        setLoginPassword,
        handleLogin,

        // Register
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