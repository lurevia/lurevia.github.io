import { api } from "./http";

export type VerificationStatus =
  | "NONE"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "USED"
  | "EXPIRED";

export interface VerificationStatusResponse {
  status: VerificationStatus;
  requestedAt?: string;
  expiresAt?: string;
}

export interface RequestVerificationResponse {
  alreadyPending: boolean;
  requestId: string;
}


export const verificationApi = {
  async request(): Promise<RequestVerificationResponse> {
    return api.post<RequestVerificationResponse>("/auth/verification/request");
  },

  async confirm(code: string): Promise<{ success: true }> {
    return api.post<{ success: true }>("/auth/verification/confirm", { code });
  },

  async status(): Promise<VerificationStatusResponse> {
    return api.get<VerificationStatusResponse>("/auth/verification/status");
  },
};