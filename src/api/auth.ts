import { api, tokenStore } from "./http";
import { toUser } from "./mappers";
import type { AuthSessionDto, UserDto } from "./dto";
import type { LoginPayload, RegisterPayload, User } from "../bin/types/authType";

export const authApi = {
  async register(payload: RegisterPayload): Promise<User> {
    const data = await api.post<AuthSessionDto>(
      "/auth/register",
      {
        fullName: payload.fullName.trim(),
        email: payload.email.trim().toLowerCase(),
        phone: payload.phone.trim(),
        password: payload.password,
      },
      { auth: false }
    );

    tokenStore.set(data.accessToken);
    return toUser(data.user);
  },

  async login(payload: LoginPayload): Promise<User> {
    const data = await api.post<AuthSessionDto>(
      "/auth/login",
      {
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
      },
      { auth: false }
    );

    tokenStore.set(data.accessToken);
    return toUser(data.user);
  },

  async logout(): Promise<void> {
    try {
      await api.post<void>("/auth/logout", undefined, { auth: false });
    } finally {
      tokenStore.clear();
    }
  },

  async me(): Promise<User> {
    const data = await api.get<{ user: UserDto }>("/auth/me");
    return toUser(data.user);
  },
};