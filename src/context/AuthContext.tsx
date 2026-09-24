import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import { AuthContext } from "./authContextDefinition";
import { authApi } from "../api/auth";
import { usersApi } from "../api/users";
import { refreshSession, setSessionHandlers, tokenStore } from "../api/http";
import { toUser } from "../api/mappers";
import type { UserDto } from "../api/dto";
import type {
  ChangePasswordPayload,
  LoginPayload,
  ProfileUpdatePayload,
  RegisterPayload,
  User,
} from "../bin/types/authType";

/**
 * Source de vérité de la session utilisateur.
 *
 * Contrairement à l'ancienne version (comptes et mots de passe stockés
 * dans le localStorage), l'authentification est désormais entièrement
 * déléguée à l'API :
 *
 * - le mot de passe ne transite qu'une fois, vers `/auth/login` ;
 * - le token d'accès reste en mémoire (voir `api/http.ts`) ;
 * - la session est rétablie au chargement via le cookie httpOnly de
 *   refresh, donc un XSS ne peut pas exfiltrer de session réutilisable ;
 * - aucune donnée utilisateur n'est persistée côté navigateur.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // ─── Branche le client HTTP sur l'état de session ───
  useEffect(() => {
    setSessionHandlers({
      onRefreshed: (refreshedUser) => {
        if (!isMounted.current || !refreshedUser) return;
        setUser(toUser(refreshedUser as UserDto));
      },
      onExpired: () => {
        if (!isMounted.current) return;
        tokenStore.clear();
        setUser(null);
      },
    });

    return () => setSessionHandlers({});
  }, []);

  // ─── Restauration de session au démarrage ───
  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const restored = await refreshSession();
      if (cancelled) return;

      if (!restored) {
        setUser(null);
        setIsReady(true);
        return;
      }

      // `onRefreshed` a déjà posé l'utilisateur ; on confirme auprès de
      // /auth/me pour disposer du profil à jour (avatar, rôle...).
      try {
        const current = await authApi.me();
        if (!cancelled) setUser(current);
      } catch {
        // Token tout juste renouvelé : un échec ici est transitoire.
      } finally {
        if (!cancelled) setIsReady(true);
      }
    };

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<void> => {
    const loggedUser = await authApi.login(payload);
    setUser(loggedUser);
  }, []);

  const register = useCallback(async (payload: RegisterPayload): Promise<void> => {
    const created = await authApi.register(payload);
    setUser(created);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await authApi.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data: ProfileUpdatePayload): Promise<void> => {
    const updated = await usersApi.updateProfile(data);
    setUser(updated);
  }, []);

  const changePassword = useCallback(async (payload: ChangePasswordPayload): Promise<void> => {
    await usersApi.changePassword(payload);
    // Le serveur révoque toutes les sessions : on repart d'une session
    // propre en forçant une reconnexion.
    tokenStore.clear();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const current = await authApi.me();
      setUser(current);
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  }, []);

  const loginWithOAuth = useCallback(async (provider: "GOOGLE" | "FACEBOOK", token: string): Promise<void> => {
    const loggedUser = await authApi.oauthCallback(provider, token);
    setUser(loggedUser);
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isReady,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      refreshUser,
      loginWithOAuth,
    }),
    [
      user,
      isReady,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      refreshUser,
      loginWithOAuth,
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};