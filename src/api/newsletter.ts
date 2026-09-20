import { api } from "./http";

export const newsletterApi = {
  subscribe(email: string): Promise<void> {
    return api.post<void>("/newsletter/subscribe", { email: email.trim().toLowerCase() }, {
      auth: false,
    });
  },
};
