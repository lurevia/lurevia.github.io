export type AuthIdentifier = "email" | "phone";

export interface User {
    id: string;
    fullName: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    role: "CUSTOMER" | "ADMIN";
    primaryIdentifier: AuthIdentifier;
    createdAt: string;
    lastLoginAt?: string;
}

export interface RegisterPayload {
    fullName: string;
    email?: string;
    phone?: string;
    password: string;
    primaryIdentifier: AuthIdentifier;
}

export interface LoginPayload {
    identifier: string;
    password: string;
}

/** Champs réellement modifiables via l'API (`PATCH /users/me`). */
export interface ProfileUpdatePayload {
    fullName?: string;
    /** `null` supprime l'avatar. */
    avatarUrl?: string | null;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    /** Vrai une fois la tentative de restauration de session terminée. */
    isReady: boolean;

    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: ProfileUpdatePayload) => Promise<void>;
    changePassword: (payload: ChangePasswordPayload) => Promise<void>;
}
