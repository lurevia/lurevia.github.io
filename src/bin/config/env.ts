/**
 * Configuration d'exécution du frontend.
 *
 * Toutes les valeurs proviennent des variables d'environnement Vite
 * (`VITE_*`, injectées au build). On ne place JAMAIS de secret ici : tout
 * ce qui est exposé dans `import.meta.env` finit dans le bundle public.
 * Les secrets (clés JWT, mots de passe, clés API privées) restent
 * exclusivement côté serveur.
 */

const readString = (value: unknown, fallback: string): string =>
  typeof value === "string" && value.trim() !== "" ? value.trim() : fallback;

const readNumber = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

/** URL de base de l'API (préfixe inclus). Ex : http://localhost:4000/api/v1 */
export const API_BASE_URL = readString(
  import.meta.env.VITE_API_URL,
  "http://localhost:4000/api/v1"
).replace(/\/+$/, "");

/** Délai maximum d'une requête réseau avant abandon (ms). */
export const REQUEST_TIMEOUT_MS = readNumber(
  import.meta.env.VITE_API_TIMEOUT_MS,
  15_000
);

/**
 * Délai (en jours) après la commande avant de pouvoir noter un produit.
 * Doit rester aligné sur `REVIEW_DELAY_DAYS` du backend : cette valeur ne
 * sert qu'à l'affichage, le serveur reste seul juge de l'éligibilité.
 */
export const REVIEW_DELAY_DAYS = readNumber(
  import.meta.env.VITE_REVIEW_DELAY_DAYS,
  5
);

/**
 * Frais de livraison indicatifs, alignés sur les valeurs par défaut du
 * backend. Les montants réellement facturés sont TOUJOURS recalculés
 * côté serveur au moment du checkout — ces constantes ne servent qu'à
 * l'aperçu avant validation.
 */
export const SHIPPING_COST = readNumber(
  import.meta.env.VITE_DEFAULT_SHIPPING_COST,
  8_000
);

export const FREE_SHIPPING_THRESHOLD = readNumber(
  import.meta.env.VITE_FREE_SHIPPING_THRESHOLD,
  250_000
);

/** Nombre de produits par page dans la boutique. */
export const PRODUCTS_PER_PAGE = 12;
