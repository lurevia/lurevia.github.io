import { api, tokenStore } from "./http";
import { toUser } from "./mappers";
import type { AuthSessionDto, UserDto } from "./dto";
import type { LoginPayload, RegisterPayload, User } from "../bin/types/authType";

/**
 * Module d'authentification.
 *
 * Le token d'accès renvoyé par l'API est immédiatement placé en mémoire
 * (jamais persisté) ; le refresh token, lui, est posé par le serveur dans
 * un cookie httpOnly que le JavaScript ne peut pas lire.
 */
export const authApi = {
  async register(payload: RegisterPayload): Promise<User> {
    const data = await api.post<AuthSessionDto>(
      "/auth/register",
      {
        fullName: payload.fullName.trim(),
        email: payload.email?.trim().toLowerCase(),
        phone: payload.phone?.trim(),
        password: payload.password,
        primaryIdentifier: payload.primaryIdentifier,
      },
      { auth: false }
    );

    tokenStore.set(data.accessToken);
    return toUser(data.user);
  },

  async login(payload: LoginPayload): Promise<User> {
    const data = await api.post<AuthSessionDto>(
      "/auth/login",
      { identifier: payload.identifier.trim(), password: payload.password },
      { auth: false }
    );

    tokenStore.set(data.accessToken);
    return toUser(data.user);
  },

  async logout(): Promise<void> {
    try {
      await api.post<void>("/auth/logout", undefined, { auth: false });
    } finally {
      // Même si l'appel échoue (réseau coupé), la session locale est
      // effacée : on ne garde jamais un token utilisable après un logout.
      tokenStore.clear();
    }
  },

  async me(): Promise<User> {
    const data = await api.get<{ user: UserDto }>("/auth/me");
    return toUser(data.user);
  },
};
