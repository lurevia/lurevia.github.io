export type AuthIdentifier = "email" | "phone";

export interface User {
    id: string;
    fullName: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    createdAt: string;
    lastLoginAt?: string;
}

export interface StoredUser extends User {
    passwordHash: string;
    primaryIdentifier: AuthIdentifier;
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

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isReady: boolean;

    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => void;
}