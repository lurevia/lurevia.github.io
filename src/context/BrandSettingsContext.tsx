import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { settingsApi, type PublicPlatformSettings } from "../api/settings";

const DEFAULTS: PublicPlatformSettings = {
  siteName: "Lurevia",
  siteTagline: "Artisanat malgache authentique",
  logoUrl: null,
  faviconUrl: null,
  primaryColor: "#CF642F",
  secondaryColor: "#29231F",
  accentColor: "#D97946",
  defaultCurrency: "MGA",
  freeShippingThreshold: 250000,
  defaultShippingCost: 8000,
  maintenanceMode: false,
  maintenanceMessage: "",
  privacyPolicy: "",
  termsOfService: "",
  cookieMessage: "",
  contactEmail: null,
  contactPhone: null,
};

const BrandSettingsContext = createContext(DEFAULTS);

export const BrandSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState(DEFAULTS);

  useEffect(() => {
    let active = true;
    void settingsApi.getPublic().then((data) => {
      if (active && data) setSettings({ ...DEFAULTS, ...data });
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  useEffect(() => {
    document.title = settings.siteName || "Lurevia";
  }, [settings]);

  return <BrandSettingsContext.Provider value={settings}>{children}</BrandSettingsContext.Provider>;
};

export const useBrandSettings = () => useContext(BrandSettingsContext);
