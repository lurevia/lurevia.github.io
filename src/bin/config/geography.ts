export const REGIONS_BY_PROVINCE = {
  ANTANANARIVO: ["ITASY", "ANALAMANGA", "VAKINANKARATRA", "BONGOLAVA"],
  ANTSIRANANA: ["DIANA", "SAVA"],
  MAHAJANGA: ["SOFIA", "BOENY", "BETSIBOKA", "MELAKY"],
  TOAMASINA: ["ALAOTRA_MANGORO", "ATSINANANA", "ANALANJIROFO", "AMBATOSOA"],
  FIANARANTSOA: ["AMORON_I_MANIA", "HAUTE_MATSIATRA", "VATOVAVY", "FITOVINANY", "ATSIMO_ATSINANANA", "IHOROMBE"],
  TOLIARA: ["MENABE", "ATSIMO_ANDREFANA", "ANDROY", "ANOSY"],
} as const;

export type ProvinceCode = keyof typeof REGIONS_BY_PROVINCE;
export type RegionCode = (typeof REGIONS_BY_PROVINCE)[ProvinceCode][number];

export const PROVINCE_LABELS: Record<ProvinceCode, string> = {
  ANTANANARIVO: "Antananarivo",
  ANTSIRANANA: "Antsiranana",
  MAHAJANGA: "Mahajanga",
  TOAMASINA: "Toamasina",
  FIANARANTSOA: "Fianarantsoa",
  TOLIARA: "Toliara",
};

export const REGION_LABELS: Record<RegionCode, string> = {
  DIANA: "Diana",
  SAVA: "Sava",
  ITASY: "Itasy",
  ANALAMANGA: "Analamanga",
  VAKINANKARATRA: "Vakinankaratra",
  BONGOLAVA: "Bongolava",
  SOFIA: "Sofia",
  BOENY: "Boeny",
  BETSIBOKA: "Betsiboka",
  MELAKY: "Melaky",
  ALAOTRA_MANGORO: "Alaotra-Mangoro",
  ATSINANANA: "Atsinanana",
  ANALANJIROFO: "Analanjirofo",
  AMBATOSOA: "Ambatosoa",
  AMORON_I_MANIA: "Amoron'i Mania",
  HAUTE_MATSIATRA: "Haute Matsiatra",
  VATOVAVY: "Vatovavy",
  FITOVINANY: "Fitovinany",
  ATSIMO_ATSINANANA: "Atsimo Atsinanana",
  IHOROMBE: "Ihorombe",
  MENABE: "Menabe",
  ATSIMO_ANDREFANA: "Atsimo Andrefana",
  ANDROY: "Androy",
  ANOSY: "Anosy",
};