import { api } from "./http";

export type PublicPlatformSettings = {
  siteName: string;
  siteTagline: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  defaultCurrency: string;
  freeShippingThreshold: number;
  defaultShippingCost: number;
  maintenanceMode: boolean;
  maintenanceMessage: string;
};

export const settingsApi = {
  getPublic: () => api.get<PublicPlatformSettings>("/public/settings", { auth: false }),
};
