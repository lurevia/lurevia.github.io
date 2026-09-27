import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { settingsApi, type PublicPlatformSettings } from "../api/settings";

const DEFAULTS: PublicPlatformSettings = {
  siteName: "Lurevia",
  siteTagline: "Artisanat malgache authentique",
  logoUrl: null,
  faviconUrl: null,
  primaryColor: "#2F7BF6",
  secondaryColor: "#0A1B3D",
  accentColor: "#E8703A",
  defaultCurrency: "MGA",
  freeShippingThreshold: 250000,
  defaultShippingCost: 8000,
  maintenanceMode: false,
  maintenanceMessage: "",
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
    const root = document.documentElement;
    root.style.setProperty("--color-lurevia-cyan", settings.primaryColor);
    root.style.setProperty("--color-lurevia-blue-500", settings.primaryColor);
    root.style.setProperty("--color-lurevia-blue-600", settings.primaryColor);
    root.style.setProperty("--color-lurevia-dark", settings.secondaryColor);
    root.style.setProperty("--color-lurevia-orange", settings.accentColor);
    document.title = settings.siteName || "Lurevia";
  }, [settings]);

  return <BrandSettingsContext.Provider value={settings}>{children}</BrandSettingsContext.Provider>;
};

export const useBrandSettings = () => useContext(BrandSettingsContext);
