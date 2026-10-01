export type UserDto = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  role: string;
  primaryProvider?: "LOCAL" | "FACEBOOK" | "GOOGLE";
  hasPassword?: boolean;
  createdAt: string;
  isVerified: boolean;
  updatedAt: string;
  lastLoginAt: string | null;
};

export type AuthSessionDto = {
  user: UserDto;
  accessToken: string;
  needsProfileCompletion?: boolean;
};
