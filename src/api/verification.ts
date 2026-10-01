import { api } from "./http";

export type VerificationStatus =
  | "NOT_SUBMITTED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED";

export interface VerificationStatusResponse {
  isVerified: boolean;
  status: VerificationStatus;
  pendingRequest: { id: string; submittedAt: string } | null;
  latestRequest: {
    status: VerificationStatus;
    submittedAt: string;
    rejectionReason: string | null;
  } | null;
}

export interface IdentityVerificationInput {
  cinNumber: string;
}

export const verificationApi = {
  status: () => api.get<VerificationStatusResponse>("/identity-verifications/status"),

  submit: async (cinNumber: string): Promise<void> => {
    await api.post("/identity-verifications", { cinNumber });
  },
};
