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
  hasPassword: boolean;
  primaryProvider: "LOCAL" | "FACEBOOK" | "GOOGLE";
  createdAt: string;
  lastLoginAt?: string;
  age?: number | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  identityVerificationStatus?: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED" | string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  isMinor?: boolean;
  isPrimaryAdmin?: boolean;
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
  age?: number | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
}

export interface CompleteOAuthProfilePayload {
  fullName?: string;
  phone: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isReady: boolean;

  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: ProfileUpdatePayload) => Promise<void>;
  completeOAuthProfile: (data: CompleteOAuthProfilePayload) => Promise<void>;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
  refreshUser: () => Promise<void>;
  loginWithOAuth: (
    token: string,
    provider: "FACEBOOK" | "GOOGLE"
  ) => Promise<{ user: User; needsProfileCompletion: boolean }>;
}
