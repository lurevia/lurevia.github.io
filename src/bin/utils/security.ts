/**
 * Garde-fous de sécurité côté client.
 *
 * Rappel : ces fonctions sont une défense en profondeur, pas une
 * protection suffisante à elles seules. Toute donnée reçue de l'API est
 * potentiellement contrôlée par un autre utilisateur (nom d'auteur d'un
 * avis, URL d'avatar, message de feedback…) ; le serveur valide déjà ces
 * entrées, mais le client ne doit jamais leur faire aveuglément
 * confiance — en particulier lorsqu'elles alimentent un attribut `src`
 * ou `href`.
 */

/** Protocoles acceptés pour une image affichée dans l'application. */
const SAFE_IMAGE_PROTOCOLS = ["http:", "https:"];

/**
 * Valide une URL d'image. Retourne `undefined` si l'URL est absente ou
 * potentiellement dangereuse (`javascript:`, `vbscript:`, `data:text/html`…),
 * ce qui permet à l'appelant de retomber sur une image par défaut.
 *
 * Les chemins relatifs (`/images/...`) sont acceptés : ils pointent
 * forcément vers notre propre origine.
 */
export const safeImageUrl = (url: string | null | undefined): string | undefined => {
  if (typeof url !== "string") return undefined;

  const trimmed = url.trim();
  if (trimmed === "") return undefined;

  // Chemin relatif same-origin : sûr, mais on refuse "//evil.com" qui est
  // une URL absolue déguisée (protocol-relative).
  if (trimmed.startsWith("/")) {
    return trimmed.startsWith("//") ? undefined : trimmed;
  }

  // Data-URL : uniquement des images, jamais du HTML ou du SVG (un SVG
  // peut embarquer du script et s'exécuter dans certains contextes).
  if (trimmed.toLowerCase().startsWith("data:")) {
    return /^data:image\/(png|jpe?g|gif|webp|avif);base64,[a-z0-9+/=]+$/i.test(trimmed)
      ? trimmed
      : undefined;
  }

  try {
    const parsed = new URL(trimmed);
    return SAFE_IMAGE_PROTOCOLS.includes(parsed.protocol) ? parsed.toString() : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Valide une URL de navigation interne utilisée dans un `<Link to=…>`.
 * Seuls les chemins relatifs à l'application sont autorisés : une
 * `actionUrl` venant de l'API ne doit jamais pouvoir provoquer une
 * redirection ouverte vers un domaine tiers.
 */
export const safeInternalPath = (
  path: string | null | undefined,
  fallback = "/"
): string => {
  if (typeof path !== "string") return fallback;

  const trimmed = path.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback;
  // Évite les séquences de contrôle et les tentatives de sortie de chemin.
  if (/[\u0000-\u001f\\]/.test(trimmed)) return fallback;

  return trimmed;
};

/**
 * Nettoie une chaîne affichée : supprime les caractères de contrôle et
 * borne la longueur. React échappe déjà le HTML, on se protège ici
 * surtout contre les contenus dégradant l'affichage (caractères
 * invisibles, chaînes démesurées).
 */
export const sanitizeText = (value: unknown, maxLength = 2_000): string => {
  if (typeof value !== "string") return "";
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").slice(0, maxLength);
};

/** Initiales sûres à partir d'un nom, pour les avatars de repli. */
export const initialsOf = (fullName: string | undefined): string => {
  const clean = sanitizeText(fullName ?? "", 120).trim();
  if (clean === "") return "?";

  return clean
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
};
