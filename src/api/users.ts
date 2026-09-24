import { api } from "./http";
import { toUser } from "./mappers";
import type { UserDto } from "./dto";
import type { ChangePasswordPayload, CompleteOAuthProfilePayload, ProfileUpdatePayload, User } from "../bin/types/authType";

export const usersApi = {
  async updateProfile(payload: ProfileUpdatePayload): Promise<User> {
    const body: Record<string, unknown> = {};
    if (payload.fullName !== undefined) body.fullName = payload.fullName.trim();
    if (payload.avatarUrl !== undefined) body.avatarUrl = payload.avatarUrl;

    const data = await api.patch<{ user: UserDto }>("/users/me", body);
    return toUser(data.user);
  },

  changePassword(payload: ChangePasswordPayload): Promise<void> {
    return api.post<void>("/users/me/change-password", payload);
  },

  async completeOAuthProfile(payload: CompleteOAuthProfilePayload): Promise<User> {
    const data = await api.patch<{ user: UserDto }>("/users/me/oauth-profile", payload);
    return toUser(data.user);
  },
};
