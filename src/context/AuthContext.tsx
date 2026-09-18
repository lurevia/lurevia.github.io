import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { AuthContext } from "./authContextDefinition";
import type {
    User,
    StoredUser,
    LoginPayload,
    RegisterPayload,
} from "../bin/types/authType";

const USERS_KEY = "lurevia_users";
const SESSION_KEY = "lurevia_session";

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const readUsers = (): StoredUser[] => {
    try {
        const raw = localStorage.getItem(USERS_KEY);
        return raw ? (JSON.parse(raw) as StoredUser[]) : [];
    } catch {
        return [];
    }
};

const writeUsers = (users: StoredUser[]): void => {
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
        console.error("Impossible de sauvegarder les utilisateurs.", error);
    }
};

/** Hash basique — ⚠️ NON sécurisé, démo uniquement */
const hashPassword = (password: string): string => {
    return btoa(`${password}::lurevia-demo-salt`);
};

const readSession = (): string | null => {
    try {
        return localStorage.getItem(SESSION_KEY);
    } catch {
        return null;
    }
};

const writeSession = (userId: string | null): void => {
    try {
        if (userId) {
            localStorage.setItem(SESSION_KEY, userId);
        } else {
            localStorage.removeItem(SESSION_KEY);
        }
    } catch (error) {
        console.error("Impossible de sauvegarder la session.", error);
    }
};

/** Filtre les données publiques de l'utilisateur (sans passwordHash) */
const toPublicUser = (stored: StoredUser): User => {
    const {
        id,
        fullName,
        email,
        phone,
        avatarUrl,
        createdAt,
        lastLoginAt,
    } = stored;
    return { id, fullName, email, phone, avatarUrl, createdAt, lastLoginAt };
};

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isReady, setIsReady] = useState(false);

    // ─── RESTAURATION DE SESSION au montage ───
    useEffect(() => {
        const sessionUserId = readSession();
        if (!sessionUserId) {
            setIsReady(true);
            return;
        }

        const users = readUsers();
        const found = users.find((u) => u.id === sessionUserId);

        if (found) setUser(toPublicUser(found));
        else writeSession(null);

        setIsReady(true);
    }, []);

    // ─── REGISTER ───
    const register = useCallback(async (payload: RegisterPayload): Promise<void> => {
        const users = readUsers();

        // Validation : identifier unique
        if (payload.email && users.some((u) => u.email === payload.email)) {
            throw new Error("Cet email est déjà utilisé.");
        }
        if (payload.phone && users.some((u) => u.phone === payload.phone)) {
            throw new Error("Ce numéro est déjà utilisé.");
        }

        const newUser: StoredUser = {
            id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            fullName: payload.fullName.trim(),
            email: payload.email?.trim().toLowerCase(),
            phone: payload.phone?.trim(),
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            passwordHash: hashPassword(payload.password),
            primaryIdentifier: payload.primaryIdentifier,
        };

        writeUsers([...users, newUser]);
        writeSession(newUser.id);
        setUser(toPublicUser(newUser));
    }, []);

    // ─── LOGIN ───
    const login = useCallback(async (payload: LoginPayload): Promise<void> => {
        const users = readUsers();
        const identifier = payload.identifier.trim().toLowerCase();

        const found = users.find(
            (u) =>
                u.email?.toLowerCase() === identifier ||
                u.phone === payload.identifier.trim()
        );

        if (!found) {
            throw new Error("Aucun compte trouvé avec cet identifiant.");
        }

        if (found.passwordHash !== hashPassword(payload.password)) {
            throw new Error("Mot de passe incorrect.");
        }

        // Met à jour lastLoginAt
        const updated: StoredUser = {
            ...found,
            lastLoginAt: new Date().toISOString(),
        };
        writeUsers(users.map((u) => (u.id === found.id ? updated : u)));

        writeSession(found.id);
        setUser(toPublicUser(updated));
    }, []);

    // ─── LOGOUT ───
    const logout = useCallback((): void => {
        writeSession(null);
        setUser(null);
    }, []);

    // ─── UPDATE PROFILE ───
    const updateProfile = useCallback(
        (data: Partial<User>): void => {
            if (!user) return;

            const users = readUsers();
            const updated: StoredUser = {
                ...users.find((u) => u.id === user.id)!,
                ...data,
            };
            writeUsers(users.map((u) => (u.id === user.id ? updated : u)));
            setUser(toPublicUser(updated));
        },
        [user]
    );

    // ─── VALEUR DU CONTEXTE ───
    const contextValue = useMemo(
        () => ({
            user,
            isAuthenticated: !!user,
            isReady,
            login,
            register,
            logout,
            updateProfile,
        }),
        [user, isReady, login, register, logout, updateProfile]
    );

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};