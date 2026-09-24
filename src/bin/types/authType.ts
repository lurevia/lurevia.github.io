export type AuthIdentifier = "email" | "phone";
export type UserRole = "CUSTOMER" | "SELLER" | "ADMIN";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  age?: number;
  gender?: "MALE" | "FEMALE" | "OTHER";
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ProfileUpdatePayload {
  fullName?: string;
  avatarUrl?: string | null;
  age?: number;
  gender?: "MALE" | "FEMALE" | "OTHER";
}

export interface CompleteOAuthProfilePayload {
  fullName?: string;
  phone: string;
  password?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isReady: boolean;

  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: ProfileUpdatePayload) => Promise<void>;
  completeOAuthProfile: (data: CompleteOAuthProfilePayload) => Promise<void>;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
  refreshUser: () => Promise<void>;
  loginWithOAuth: (provider: "GOOGLE" | "FACEBOOK", token: string) => Promise<void>;
}
